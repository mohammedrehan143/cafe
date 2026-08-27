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
    const rawLookup = decodeURIComponent(id).trim();
    const lookupId = sanitizeString(rawLookup.toUpperCase(), 40);
    const cleanDigits = rawLookup.replace(/[^0-9]/g, '');

    if (!lookupId && !cleanDigits) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID or Phone Number is required' },
        { status: 400, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    // 1. Try Supabase lookup
    if (isSupabaseConfigured) {
      // Build search query across token, tracking code, id, and phone
      let searchFilter = `id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%`;
      if (cleanDigits.length >= 4) {
        searchFilter += `,customer_phone.ilike.%${cleanDigits}%`;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(searchFilter)
        .order('created_at', { ascending: false })
        .limit(25);

      if (!error && data && data.length > 0) {
        const formattedOrders: Order[] = data.map((row) => formatDbOrderToOrder(row));

        // Check if query was an exact single order token/id match
        const exactMatch = formattedOrders.find(
          (o) =>
            o.id.toUpperCase() === lookupId ||
            (o.tokenId && o.tokenId.toUpperCase() === lookupId) ||
            (o.trackingCode && o.trackingCode.toUpperCase() === lookupId)
        );

        if (exactMatch) {
          return NextResponse.json(
            { success: true, order: exactMatch, orders: [exactMatch], isExact: true },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }

        // Otherwise filter only ACTIVE / RUNNING orders (exclude completed & cancelled)
        const runningOrders = formattedOrders.filter(
          (o) => o.status !== 'completed' && o.status !== 'cancelled'
        );

        if (runningOrders.length > 0) {
          return NextResponse.json(
            {
              success: true,
              orders: runningOrders,
              order: runningOrders[0],
              count: runningOrders.length,
            },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }

        // All matched orders are already completed
        return NextResponse.json(
          {
            success: false,
            error: 'All past orders for this number are completed. (No active kitchen orders running)',
            allCompleted: true,
          },
          { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }

    // 2. Fallback search in initial demo orders
    const matchedList = INITIAL_ORDERS.filter(
      (o) =>
        o.id.toUpperCase().includes(lookupId) ||
        (o.tokenId && o.tokenId.toUpperCase().includes(lookupId)) ||
        (cleanDigits && o.customer.phone.replace(/[^0-9]/g, '').includes(cleanDigits)) ||
        o.customer.name.toUpperCase().includes(lookupId)
    );

    if (matchedList.length > 0) {
      const runningOrders = matchedList.filter(
        (o) => o.status !== 'completed' && o.status !== 'cancelled'
      );

      if (runningOrders.length > 0) {
        return NextResponse.json(
          {
            success: true,
            orders: runningOrders,
            order: runningOrders[0],
            count: runningOrders.length,
          },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'All past orders for this number are completed.',
          allCompleted: true,
        },
        { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    return NextResponse.json(
      { success: false, error: 'No active orders found for this number or Token ID.' },
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
