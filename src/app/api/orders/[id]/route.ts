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
  const limit = checkRateLimit(req, 60, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { id } = await params;
    const rawLookup = decodeURIComponent(id).trim();
    const lookupId = sanitizeString(rawLookup, 60);
    const body = await req.json();
    const { status, riderName, riderPhone, agentId, rating, feedbackTags, feedbackNote } = body;

    const validStatuses: OrderStatus[] = ['new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: `Invalid order status: ${status}` }, { status: 400 });
    }

    const nowISO = new Date().toISOString();

    if (isSupabaseConfigured) {
      // 1. Find the target order in Supabase
      const { data: existingOrders, error: findErr } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${lookupId},token_id.eq.${lookupId},tracking_code.eq.${lookupId},id.ilike.%${lookupId}%,token_id.ilike.%${lookupId}%,tracking_code.ilike.%${lookupId}%`)
        .limit(1);

      if (findErr) {
        return NextResponse.json({ success: false, error: `Database search error: ${findErr.message}` }, { status: 500 });
      }

      if (!existingOrders || existingOrders.length === 0) {
        return NextResponse.json({ success: false, error: `Order #${lookupId} not found in database.` }, { status: 404 });
      }

      const targetOrder = existingOrders[0];

      // 2. Validate agent ID if provided
      let resolvedAgentId: string | null = targetOrder.delivery_agent_id;
      if (agentId !== undefined) {
        if (!agentId || agentId === 'none' || agentId === 'null') {
          resolvedAgentId = null;
        } else {
          const cleanAgentId = sanitizeString(String(agentId).trim(), 60);
          // Verify agent exists in delivery_agents table
          const { data: agentData, error: agentErr } = await supabase
            .from('delivery_agents')
            .select('id, name, phone')
            .eq('id', cleanAgentId)
            .maybeSingle();

          if (agentErr) {
            return NextResponse.json(
              { success: false, error: `Delivery agent lookup error: ${agentErr.message}` },
              { status: 500 }
            );
          }

          if (!agentData) {
            return NextResponse.json(
              {
                success: false,
                error: `Delivery Agent with ID "${cleanAgentId}" does not exist in the database. Please register the agent first.`,
              },
              { status: 404 }
            );
          }

          resolvedAgentId = agentData.id;
        }
      }

      // 3. Construct update payload strictly using existing table columns
      const updatePayload: Record<string, any> = {
        updated_at: nowISO,
      };

      if (status) {
        updatePayload.status = status;
      }

      if (agentId !== undefined) {
        updatePayload.delivery_agent_id = resolvedAgentId;
      }

      if (status === 'completed') {
        updatePayload.delivered_at = nowISO;
      }

      // If rider info or feedback notes are provided, store safely in customer_instructions
      if (riderName || riderPhone || rating || feedbackNote || feedbackTags) {
        let notes = targetOrder.customer_instructions || '';

        if (riderName) {
          notes = notes.replace(/\[RIDER:.*?\]/g, '').trim();
          notes = `${notes} [RIDER: ${sanitizeString(riderName, 60)} | ${sanitizeString(riderPhone || '', 30)}]`.trim();
        }

        if (rating || feedbackNote || feedbackTags) {
          const feedbackSummary = `[FEEDBACK: Rating=${rating || 5} | Tags=${(feedbackTags || []).join(',')} | Note=${feedbackNote || ''}]`;
          notes = notes.replace(/\[FEEDBACK:.*?\]/g, '').trim();
          notes = `${notes} ${feedbackSummary}`.trim();
        }

        updatePayload.customer_instructions = notes;
      }

      // 4. Perform Supabase update with select confirmation
      const { data: updatedRows, error: updateErr } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', targetOrder.id)
        .select();

      if (updateErr) {
        console.error('Supabase order update failed:', updateErr);
        return NextResponse.json(
          { success: false, error: `Supabase order update failed: ${updateErr.message}` },
          { status: 500 }
        );
      }

      if (!updatedRows || updatedRows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Order update could not be committed in Supabase.' },
          { status: 500 }
        );
      }

      const formattedOrder = formatDbOrderToOrder(updatedRows[0]);
      return NextResponse.json({
        success: true,
        order: formattedOrder,
        agentId: resolvedAgentId,
        status: updatePayload.status || targetOrder.status,
        message: 'Order updated successfully in Supabase.',
      });
    }

    // Local / In-memory fallback
    return NextResponse.json({
      success: true,
      status,
      agentId,
      riderName,
      riderPhone,
      message: 'Order updated in local memory.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Order update failed' }, { status: 500 });
  }
}
