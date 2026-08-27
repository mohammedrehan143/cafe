import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { checkRateLimit, validateCustomer, validateOrderAmounts, sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory bounded cache for high-speed fallback under heavy load or offline development
const MAX_CACHE_SIZE = 1000;
let localOrdersCache: Order[] = [...INITIAL_ORDERS];

function purgeOrdersOlderThan10Days(ordersList: Order[]): Order[] {
  const tenDaysAgoMs = Date.now() - 10 * 24 * 60 * 60 * 1000;
  return ordersList
    .filter((o) => new Date(o.createdAt).getTime() >= tenDaysAgoMs)
    .slice(0, MAX_CACHE_SIZE);
}

export async function GET(req: NextRequest) {
  // Rate limiting protection (Generous for live KDS background heartbeat polling)
  const limit = checkRateLimit(req, 600, 60, 'orders_get');
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again in a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetIn) } }
    );
  }

  try {
    localOrdersCache = purgeOrdersOlderThan10Days(localOrdersCache);

    // Fetch from Supabase if configured
    if (isSupabaseConfigured) {
      const tenDaysAgoISO = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', tenDaysAgoISO)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        const formatted: Order[] = data.map((row) => formatDbOrderToOrder(row));
        return NextResponse.json(
          { success: true, orders: formatted },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }

    return NextResponse.json(
      { success: true, orders: localOrdersCache },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: true, orders: localOrdersCache, warning: err.message },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting protection for order placement (generous to allow rapid consecutive customer orders)
  const limit = checkRateLimit(req, 200, 60, 'orders_post');
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many order requests. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetIn) } }
    );
  }

  try {
    const body = await req.json();
    const { customer, deliveryMethod, items, subtotal, deliveryFee, tax, tip, total, paymentMethod, razorpayDetails } = body;

    // Validate customer inputs
    const customerValidation = validateCustomer(customer);
    if (!customerValidation.valid) {
      return NextResponse.json({ success: false, error: customerValidation.error }, { status: 400 });
    }
    const sanitizedCustomer = customerValidation.sanitized;

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ success: false, error: 'Invalid items in order' }, { status: 400 });
    }

    // Validate financial amounts
    const amountValidation = validateOrderAmounts(subtotal, deliveryFee, tax, tip, total);
    if (!amountValidation.valid) {
      return NextResponse.json({ success: false, error: amountValidation.error }, { status: 400 });
    }

    const sanitizedMethod = deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
    const sanitizedPayment = sanitizeString(paymentMethod || 'Online (Razorpay)', 60);

    // Generate unique Order Token ID and Tracking Code (e.g. TOK-9421-XK7 / ZF-9421-XK7)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingCode = `ZF-${randomDigits}-${randomChars}`;
    const tokenId = `TOK-${randomDigits}-${randomChars}`;

    // Clean phone number for customer identity
    const cleanDigits = sanitizedCustomer.phone.replace(/[^0-9]/g, '');
    const last10 = cleanDigits.slice(-10) || cleanDigits || '9999999999';
    let customerId = `CUST-${last10}-${randomChars}`;

    // Guarantee non-empty email to satisfy Supabase NOT NULL constraint
    const effectiveEmail = (sanitizedCustomer.email && sanitizedCustomer.email.trim())
      ? sanitizedCustomer.email.trim()
      : `guest_${last10}@zafiroo.com`;

    // 1. Manage Customer in Supabase (Robust resolution by phone to avoid Foreign Key violations)
    if (isSupabaseConfigured) {
      try {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id, order_count, total_spent')
          .or(`phone.eq.${sanitizedCustomer.phone},phone.ilike.%${last10}%`)
          .limit(1)
          .maybeSingle();

        if (existingCustomer) {
          customerId = existingCustomer.id;
          await supabase
            .from('customers')
            .update({
              name: sanitizedCustomer.name,
              email: effectiveEmail,
              address: sanitizedCustomer.address || 'Address on file',
              unit: sanitizedCustomer.unitOrApt || '',
              default_instructions: sanitizedCustomer.deliveryInstructions || '',
              order_count: (existingCustomer.order_count || 1) + 1,
              total_spent: Number((Number(existingCustomer.total_spent || 0) + Number(total)).toFixed(2)),
              updated_at: new Date().toISOString(),
            })
            .eq('id', customerId);
        } else {
          // Insert new customer
          const { error: insertCustErr } = await supabase.from('customers').insert({
            id: customerId,
            phone: last10,
            name: sanitizedCustomer.name,
            email: effectiveEmail,
            address: sanitizedCustomer.address || 'Takeaway / Pickup',
            unit: sanitizedCustomer.unitOrApt || '',
            default_instructions: sanitizedCustomer.deliveryInstructions || '',
            order_count: 1,
            total_spent: Number(total),
          });

          if (insertCustErr) {
            console.warn('Customer insert collision, re-fetching customer:', insertCustErr.message);
            const { data: fallbackCust } = await supabase
              .from('customers')
              .select('id')
              .or(`phone.eq.${sanitizedCustomer.phone},phone.ilike.%${last10}%`)
              .limit(1)
              .maybeSingle();

            if (fallbackCust) {
              customerId = fallbackCust.id;
            }
          }
        }
      } catch (err: any) {
        console.warn('Customer management exception:', err.message);
      }
    }

    const newOrder: Order = {
      id: trackingCode,
      tokenId: tokenId,
      trackingCode: trackingCode,
      customerId: customerId,
      createdAt: new Date().toISOString(),
      status: 'new',
      deliveryMethod: sanitizedMethod,
      customer: {
        ...sanitizedCustomer,
        phone: last10,
        email: effectiveEmail,
      },
      items: items.slice(0, 50),
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      tax: Number(tax),
      tip: Number(tip),
      total: Number(total),
      estimatedTime: sanitizedMethod === 'delivery' ? '20-30 min' : '10-15 min',
      paymentMethod: sanitizedPayment,
      paymentStatus: 'completed',
      razorpayOrderId: sanitizeString(razorpayDetails?.razorpay_order_id || '', 80),
      razorpayPaymentId: sanitizeString(razorpayDetails?.razorpay_payment_id || '', 80),
    };

    // 2. Insert Order into Supabase
    if (isSupabaseConfigured) {
      try {
        const orderInsertPayload = {
          id: trackingCode,
          token_id: tokenId,
          tracking_code: trackingCode,
          customer_id: customerId,
          customer_name: sanitizedCustomer.name,
          customer_phone: last10,
          customer_email: effectiveEmail,
          customer_address: sanitizedCustomer.address || 'Address provided at checkout',
          customer_unit: sanitizedCustomer.unitOrApt || '',
          customer_instructions: sanitizedCustomer.deliveryInstructions || '',
          delivery_method: sanitizedMethod,
          status: 'new',
          items_json: items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          tax: newOrder.tax,
          tip: newOrder.tip,
          total: newOrder.total,
          estimated_time: newOrder.estimatedTime,
          payment_method: sanitizedPayment,
          payment_status: 'completed',
          razorpay_order_id: sanitizeString(razorpayDetails?.razorpay_order_id || '', 80),
          razorpay_payment_id: sanitizeString(razorpayDetails?.razorpay_payment_id || '', 80),
        };

        let { error: insertOrderErr } = await supabase.from('orders').insert(orderInsertPayload);

        // If a foreign key mismatch on customer_id occurred, fallback to creating customer first
        if (insertOrderErr && insertOrderErr.code === '23503') {
          console.warn('Handling foreign key customer fallback...');
          await supabase.from('customers').upsert({
            id: customerId,
            phone: last10,
            name: sanitizedCustomer.name,
            email: effectiveEmail,
            address: sanitizedCustomer.address || 'Address',
            order_count: 1,
            total_spent: Number(total),
          });
          const retryRes = await supabase.from('orders').insert(orderInsertPayload);
          insertOrderErr = retryRes.error;
        }

        if (insertOrderErr) {
          console.error('Supabase order insert failed:', insertOrderErr.message);
        } else {
          console.log('✅ Order successfully saved to Supabase:', trackingCode);
        }
      } catch (err: any) {
        console.error('Supabase order insert exception:', err);
      }
    }

    localOrdersCache = [newOrder, ...localOrdersCache].slice(0, MAX_CACHE_SIZE);

    return NextResponse.json({
      success: true,
      order: newOrder,
      tokenId: tokenId,
      trackingId: trackingCode,
      customerId: customerId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Order placement failed' }, { status: 500 });
  }
}

// DELETE: Clear all orders or single order from Supabase & memory
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      // Delete single order
      localOrdersCache = localOrdersCache.filter((o) => o.id !== orderId);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('orders').delete().eq('id', orderId);
        } catch {}
      }

      return NextResponse.json({ success: true, message: `Order #${orderId} deleted` });
    } else {
      // Delete ALL orders
      localOrdersCache = [];

      if (isSupabaseConfigured) {
        try {
          await supabase.from('orders').delete().neq('id', 'non-existent-placeholder');
        } catch (e: any) {
          console.warn('Supabase bulk delete orders:', e.message);
        }
      }

      return NextResponse.json({ success: true, message: 'All orders cleared from database successfully' });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to delete orders' }, { status: 500 });
  }
}

