import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { checkRateLimit, validateCustomer, validateOrderAmounts, sanitizeString } from '@/lib/security';

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
  // Rate limiting protection
  const limit = checkRateLimit(req, 60, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again in a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetIn) } }
    );
  }

  try {
    localOrdersCache = purgeOrdersOlderThan10Days(localOrdersCache);

    // Fetch from Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const tenDaysAgoISO = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', tenDaysAgoISO)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        const formatted: Order[] = data.map((row) => {
          let resolvedRiderName = row.rider_name;
          let resolvedRiderPhone = row.rider_phone;

          if (!resolvedRiderName && row.customer_instructions) {
            const match = row.customer_instructions.match(/\[RIDER:\s*(.*?)\s*\|\s*(.*?)\s*\]/);
            if (match) {
              resolvedRiderName = match[1];
              resolvedRiderPhone = match[2];
            }
          }

          return {
            id: row.tracking_code || row.token_id || row.id,
            tokenId: row.token_id || row.tracking_code || row.id,
            trackingCode: row.tracking_code,
            customerId: row.customer_id,
            createdAt: row.created_at,
            status: row.status as any,
            deliveryMethod: row.delivery_method as any,
            customer: {
              name: row.customer_name,
              phone: row.customer_phone,
              email: row.customer_email,
              address: row.customer_address,
              unitOrApt: row.customer_unit,
              deliveryInstructions: row.customer_instructions,
            },
            items: Array.isArray(row.items_json) ? row.items_json : [],
            subtotal: Number(row.subtotal),
            deliveryFee: Number(row.delivery_fee),
            tax: Number(row.tax),
            tip: Number(row.tip),
            total: Number(row.total),
            estimatedTime: row.estimated_time,
            paymentMethod: row.payment_method,
            paymentStatus: row.payment_status as any,
            razorpayOrderId: row.razorpay_order_id,
            razorpayPaymentId: row.razorpay_payment_id,
            riderName: resolvedRiderName,
            riderPhone: resolvedRiderPhone,
          };
        });
        return NextResponse.json({ success: true, orders: formatted });
      }
    }

    return NextResponse.json({ success: true, orders: localOrdersCache });
  } catch (err: any) {
    return NextResponse.json({ success: true, orders: localOrdersCache, warning: err.message });
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting protection against order spam bots
  const limit = checkRateLimit(req, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many order requests. Please wait a minute.' },
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
    const normalizedPhone = sanitizedCustomer.phone.replace(/[^0-9+]/g, '');
    const phoneSuffix = normalizedPhone.slice(-4) || '9999';
    let customerId = `CUST-${phoneSuffix}-${randomChars}`;

    // 1. Manage Customer in Supabase if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id, order_count, total_spent')
          .eq('phone', normalizedPhone)
          .maybeSingle();

        if (existingCustomer) {
          customerId = existingCustomer.id;
          await supabase
            .from('customers')
            .update({
              name: sanitizedCustomer.name,
              email: sanitizedCustomer.email || undefined,
              address: sanitizedCustomer.address || undefined,
              unit: sanitizedCustomer.unitOrApt || undefined,
              default_instructions: sanitizedCustomer.deliveryInstructions || undefined,
              order_count: (existingCustomer.order_count || 1) + 1,
              total_spent: Number((Number(existingCustomer.total_spent || 0) + Number(total)).toFixed(2)),
              updated_at: new Date().toISOString(),
            })
            .eq('id', customerId);
        } else {
          await supabase.from('customers').insert({
            id: customerId,
            phone: normalizedPhone,
            name: sanitizedCustomer.name,
            email: sanitizedCustomer.email || '',
            address: sanitizedCustomer.address || '',
            unit: sanitizedCustomer.unitOrApt || '',
            default_instructions: sanitizedCustomer.deliveryInstructions || '',
            order_count: 1,
            total_spent: Number(total),
          });
        }
      } catch {
        // Continue gracefully even if customer upsert fails
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
      customer: sanitizedCustomer,
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
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('orders').insert({
          id: trackingCode,
          token_id: tokenId,
          tracking_code: trackingCode,
          customer_id: customerId,
          customer_name: sanitizedCustomer.name,
          customer_phone: sanitizedCustomer.phone,
          customer_email: sanitizedCustomer.email,
          customer_address: sanitizedCustomer.address || '',
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
        });
      } catch {
        // Fallback to in-memory store
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

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          await supabase.from('orders').delete().eq('id', orderId);
        } catch {}
      }

      return NextResponse.json({ success: true, message: `Order #${orderId} deleted` });
    } else {
      // Delete ALL orders
      localOrdersCache = [];

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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

