import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { checkRateLimit, validateCustomer, validateOrderAmounts, sanitizeString } from '@/lib/security';

// In-memory bounded cache for high-speed fallback under 10,000+ users
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
        const formatted: Order[] = data.map((row) => ({
          id: row.tracking_code || row.id,
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
        }));
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

    // Generate collision-resistant unique tracking code (e.g. ZF-9421-XK7)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingCode = `ZF-${randomDigits}-${randomChars}`;

    const newOrder: Order = {
      id: trackingCode,
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
    };

    // Insert into Supabase if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('orders').insert({
          tracking_code: trackingCode,
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
      trackingId: trackingCode,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Order placement failed' }, { status: 500 });
  }
}
