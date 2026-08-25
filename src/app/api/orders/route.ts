import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS } from '@/data/cafeData';

// In-memory persistent cache for zero-lag instant lookups & development fallback
let localOrdersCache: Order[] = [...INITIAL_ORDERS];

// Helper: Auto-purge orders older than 10 days from cache & database
function purgeOrdersOlderThan10Days(ordersList: Order[]): Order[] {
  const tenDaysAgoMs = Date.now() - 10 * 24 * 60 * 60 * 1000;
  return ordersList.filter((o) => new Date(o.createdAt).getTime() >= tenDaysAgoMs);
}

export async function GET(req: NextRequest) {
  try {
    // 1. Perform 10-day retention cleanup
    localOrdersCache = purgeOrdersOlderThan10Days(localOrdersCache);

    // Try fetching from Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const tenDaysAgoISO = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

      // Delete old orders in Supabase older than 10 days
      await supabase.from('orders').delete().lt('created_at', tenDaysAgoISO);

      // Fetch active orders within 10 days
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', tenDaysAgoISO)
        .order('created_at', { ascending: false });

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
          items: row.items_json,
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
  try {
    const body = await req.json();
    const { customer, deliveryMethod, items, subtotal, deliveryFee, tax, tip, total, paymentMethod, razorpayDetails } = body;

    // Security validation
    if (!customer?.name || !customer?.phone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
    }

    // Generate unique human-friendly tracking code: e.g. BM-7842-XK
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `BM-${randomNum}-${randomSuffix}`;
    const orderId = trackingCode;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      id: trackingCode,
      createdAt,
      status: 'new',
      deliveryMethod: deliveryMethod || 'delivery',
      customer: {
        name: String(customer.name).trim().slice(0, 80),
        phone: String(customer.phone).trim().slice(0, 25),
        email: String(customer.email || '').trim().slice(0, 100),
        address: customer.address ? String(customer.address).trim().slice(0, 200) : undefined,
        unitOrApt: customer.unitOrApt ? String(customer.unitOrApt).trim().slice(0, 60) : undefined,
        deliveryInstructions: customer.deliveryInstructions ? String(customer.deliveryInstructions).trim().slice(0, 300) : undefined,
      },
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      tax: Number(tax) || 0,
      tip: Number(tip) || 0,
      total: Number(total) || 0,
      estimatedTime: deliveryMethod === 'delivery' ? '20-30 min' : '10-15 min',
      paymentMethod: paymentMethod || 'Online (Razorpay Authorized)',
    };

    // Save to local memory cache
    localOrdersCache = [newOrder, ...purgeOrdersOlderThan10Days(localOrdersCache)];

    // Save to Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await supabase.from('orders').insert({
        id: orderId,
        tracking_code: trackingCode,
        status: 'new',
        delivery_method: deliveryMethod || 'delivery',
        customer_name: newOrder.customer.name,
        customer_phone: newOrder.customer.phone,
        customer_email: newOrder.customer.email,
        customer_address: newOrder.customer.address || null,
        customer_unit: newOrder.customer.unitOrApt || null,
        customer_instructions: newOrder.customer.deliveryInstructions || null,
        items_json: items,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.deliveryFee,
        tax: newOrder.tax,
        tip: newOrder.tip,
        total: newOrder.total,
        estimated_time: newOrder.estimatedTime,
        payment_method: newOrder.paymentMethod,
        razorpay_order_id: razorpayDetails?.razorpay_order_id || null,
        razorpay_payment_id: razorpayDetails?.razorpay_payment_id || null,
        created_at: createdAt,
      });
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      trackingCode,
      message: 'Order created successfully with 10-day retention and tracking ID',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
