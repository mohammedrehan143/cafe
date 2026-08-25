import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { Order } from '@/types/cafe';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lookupId = decodeURIComponent(id).trim().toUpperCase();

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
          items: data.items_json,
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

    return NextResponse.json(
      { success: false, error: 'Order tracking ID not found or older than 10 days' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Missing status' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .or(`id.eq.${id},tracking_code.eq.${id}`);
    }

    return NextResponse.json({ success: true, message: `Order status updated to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
