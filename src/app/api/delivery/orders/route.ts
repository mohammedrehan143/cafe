import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/data/cafeData';
import { Order } from '@/types/cafe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone') || '';
    const agentId = searchParams.get('agentId') || '';

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

    if (!cleanPhone && !agentId) {
      return NextResponse.json(
        { success: false, error: 'Delivery agent ID or phone number is required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      let effectiveAgentId = agentId ? agentId.trim() : '';

      // If only phone was provided, resolve the agent's ID from delivery_agents
      if (!effectiveAgentId && cleanPhone) {
        const { data: agentRow, error: agentLookupErr } = await supabase
          .from('delivery_agents')
          .select('id')
          .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
          .limit(1)
          .maybeSingle();

        if (agentLookupErr) {
          return NextResponse.json(
            { success: false, error: `Agent lookup error: ${agentLookupErr.message}` },
            { status: 500 }
          );
        }

        if (agentRow) {
          effectiveAgentId = agentRow.id;
        }
      }

      if (!effectiveAgentId) {
        return NextResponse.json(
          {
            success: false,
            error: `No registered delivery agent found matching mobile number +91 ${cleanPhone}.`,
          },
          { status: 404 }
        );
      }

      // Query orders assigned strictly to this delivery agent
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('delivery_agent_id', effectiveAgentId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Supabase fetch delivery orders error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      const formatted: Order[] = (data || []).map((row) => formatDbOrderToOrder(row));
      return NextResponse.json({
        success: true,
        agentId: effectiveAgentId,
        orders: formatted,
        activeOrders: formatted.filter((o) => o.status !== 'completed' && o.status !== 'cancelled'),
        completedOrders: formatted.filter((o) => o.status === 'completed'),
      });
    }

    // Memory / Local fallback
    const matched = INITIAL_ORDERS.filter(
      (o) =>
        (agentId && o.deliveryAgentId === agentId) ||
        (cleanPhone && o.riderPhone && o.riderPhone.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    return NextResponse.json({
      success: true,
      agentId: agentId || 'local-agent',
      orders: matched,
      activeOrders: matched.filter((o) => o.status !== 'completed' && o.status !== 'cancelled'),
      completedOrders: matched.filter((o) => o.status === 'completed'),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Error fetching delivery orders.' }, { status: 500 });
  }
}

