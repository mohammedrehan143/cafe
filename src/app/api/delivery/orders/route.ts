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
        { success: false, error: 'Agent phone number or ID is required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      // Match either by delivery_agent_id or by rider_phone or in customer_instructions notes
      if (agentId && cleanPhone) {
        query = query.or(
          `delivery_agent_id.eq.${agentId},rider_phone.ilike.%${cleanPhone}%,customer_instructions.ilike.%${cleanPhone}%`
        );
      } else if (agentId) {
        query = query.eq('delivery_agent_id', agentId);
      } else if (cleanPhone) {
        query = query.or(`rider_phone.ilike.%${cleanPhone}%,customer_instructions.ilike.%${cleanPhone}%`);
      }

      const { data, error } = await query.limit(50);

      if (!error && data) {
        const formatted: Order[] = data.map((row) => formatDbOrderToOrder(row));
        return NextResponse.json({
          success: true,
          orders: formatted,
          activeOrders: formatted.filter((o) => o.status !== 'completed' && o.status !== 'cancelled'),
          completedOrders: formatted.filter((o) => o.status === 'completed'),
        });
      }
    }

    // Memory / Local fallback
    const matched = INITIAL_ORDERS.filter(
      (o) =>
        (agentId && o.deliveryAgentId === agentId) ||
        (cleanPhone && o.riderPhone && o.riderPhone.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    return NextResponse.json({
      success: true,
      orders: matched,
      activeOrders: matched.filter((o) => o.status !== 'completed' && o.status !== 'cancelled'),
      completedOrders: matched.filter((o) => o.status === 'completed'),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
