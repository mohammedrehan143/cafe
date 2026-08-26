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
      return NextResponse.json({ success: false, error: 'Tracking ID or Token is required' }, { status: 400 });
    }

    // 1. Try Supabase lookup (matches token_id, tracking_code, id, or phone)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%,customer_phone.ilike.%${lookupId}%`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        let resolvedRiderName = data.rider_name;
        let resolvedRiderPhone = data.rider_phone;

        if (!resolvedRiderName && data.customer_instructions) {
          const match = data.customer_instructions.match(/\[RIDER:\s*(.*?)\s*\|\s*(.*?)\s*\]/);
          if (match) {
            resolvedRiderName = match[1];
            resolvedRiderPhone = match[2];
          }
        }

        const order: Order = {
          id: data.tracking_code || data.token_id || data.id,
          tokenId: data.token_id || data.tracking_code || data.id,
          trackingCode: data.tracking_code,
          customerId: data.customer_id,
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
          paymentStatus: data.payment_status as any,
          razorpayOrderId: data.razorpay_order_id,
          razorpayPaymentId: data.razorpay_payment_id,
          riderName: resolvedRiderName,
          riderPhone: resolvedRiderPhone,
        };

        return NextResponse.json({ success: true, order });
      }
    }

    // 2. Fallback search in initial demo orders
    const matched = INITIAL_ORDERS.find(
      (o) =>
        o.id.toUpperCase().includes(lookupId) ||
        (o.tokenId && o.tokenId.toUpperCase().includes(lookupId)) ||
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
    const { status, riderName, riderPhone } = body;

    const validStatuses: OrderStatus[] = ['new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const updatePayload: any = { status, updated_at: new Date().toISOString() };
        if (riderName) updatePayload.rider_name = sanitizeString(riderName, 60);
        if (riderPhone) updatePayload.rider_phone = sanitizeString(riderPhone, 30);

        const { error } = await supabase
          .from('orders')
          .update(updatePayload)
          .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%`);

        if (error) {
          // If rider_name column does not exist in schema, fallback to updating status and storing rider in customer_instructions
          const fallbackPayload: any = { status, updated_at: new Date().toISOString() };
          if (riderName && riderPhone) {
            const { data: currentData } = await supabase
              .from('orders')
              .select('customer_instructions')
              .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%`)
              .maybeSingle();

            const baseNotes = (currentData?.customer_instructions || '').replace(/\[RIDER:.*?\]/g, '').trim();
            fallbackPayload.customer_instructions = `${baseNotes} [RIDER: ${sanitizeString(riderName, 60)} | ${sanitizeString(riderPhone, 30)}]`.trim();
          }

          await supabase
            .from('orders')
            .update(fallbackPayload)
            .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%`);
        }
      } catch (err: any) {
        console.error('Supabase update failed:', err);
      }
    }

    return NextResponse.json({ success: true, status, riderName, riderPhone });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
