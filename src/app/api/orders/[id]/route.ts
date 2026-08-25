import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { Order, OrderStatus } from '@/types/cafe';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limit = checkRateLimit(req, 60, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many lookup requests' },
      { status: 429 }
    );
  }

  try {
    const { id } = await params;
    const lookupId = sanitizeString(decodeURIComponent(id).trim().toUpperCase(), 40);

    if (!lookupId) {
      return NextResponse.json({ success: false, error: 'Tracking ID is required' }, { status: 400 });
    }

    // 1. Try Supabase lookup
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,customer_phone.ilike.%${lookupId}%`)
        .limit(1)
        .single();

      if (!error && data) {
        const order: Order = {
          id: data.tracking_code || data.id,
          createdAt: data.created_at,
          status: data.status as any,
          deliveryMethod: data.delivery_method as any,
          customer: {
            name: data.customer_name,
            phone: data.customer_phone,
            email: data.customer_email,
            address: data.customer_address,
            unitOrApt: data.customer_unit,
            deliveryInstructions: data.customer_instructions,
          },
          items: Array.isArray(data.items_json) ? data.items_json : [],
          subtotal: Number(data.subtotal),
          deliveryFee: Number(data.delivery_fee),
          tax: Number(data.tax),
          tip: Number(data.tip),
          total: Number(data.total),
          estimatedTime: data.estimated_time,
          paymentMethod: data.payment_method,
        };

        return NextResponse.json({ success: true, order });
      }
    }

    // 2. Fallback search in initial demo orders
    const matched = INITIAL_ORDERS.find(
      (o) =>
        o.id.toUpperCase().includes(lookupId) ||
        o.customer.phone.includes(lookupId) ||
        o.customer.name.toUpperCase().includes(lookupId)
    );

    if (matched) {
      return NextResponse.json({ success: true, order: matched });
    }

    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Lookup failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limit = checkRateLimit(req, 40, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { id } = await params;
    const lookupId = sanitizeString(decodeURIComponent(id).trim(), 40);
    const body = await req.json();
    const { status } = body;

    const validStatuses: OrderStatus[] = ['new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await supabase
        .from('orders')
        .update({ status })
        .or(`id.eq.${lookupId},tracking_code.eq.${lookupId}`);
    }

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
