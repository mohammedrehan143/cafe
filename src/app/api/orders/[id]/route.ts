import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { Order, OrderStatus } from '@/types/cafe';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limit = checkRateLimit(req, 120, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many lookup requests' },
      { status: 429, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }

  try {
    const { id } = await params;
    const lookupId = sanitizeString(decodeURIComponent(id).trim().toUpperCase(), 40);

    if (!lookupId) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID or Token is required' },
        { status: 400, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    // 1. Try Supabase lookup (matches token_id, tracking_code, id, or phone)
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%,customer_phone.ilike.%${lookupId}%`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const order: Order = formatDbOrderToOrder(data);
        return NextResponse.json(
          { success: true, order },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
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
      return NextResponse.json(
        { success: true, order: matched },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Order not found' },
      { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lookup failed' },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
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

    if (isSupabaseConfigured) {
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
