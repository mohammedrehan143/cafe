import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbDeliveryAgent } from '@/lib/supabase';
import { DeliveryAgent } from '@/types/cafe';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic In-memory fallback cache
let localAgentsCache: DeliveryAgent[] = [];

// GET: List all delivery agents
export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('delivery_agents')
        .select('*')
        .order('orders_delivered_count', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted = data.map((row) => formatDbDeliveryAgent(row));
        return NextResponse.json({
          success: true,
          agents: formatted,
        });
      }
    }

    return NextResponse.json({
      success: true,
      agents: localAgentsCache,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      agents: localAgentsCache,
      warning: err.message,
    });
  }
}

// POST: Add / Register a new Delivery Agent
export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 30, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many agent registration requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, phone, vehicleType } = body;

    const sanitizedName = sanitizeString(name || '', 60);
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json({ success: false, error: 'Valid agent name is required.' }, { status: 400 });
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ success: false, error: 'Valid 10-digit mobile number is required.' }, { status: 400 });
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const agentId = `AGT-${cleanPhone.slice(-4)}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newAgent: DeliveryAgent = {
      id: agentId,
      name: sanitizedName,
      phone: cleanPhone,
      status: 'active',
      vehicleType: sanitizeString(vehicleType || 'Electric Bike', 40),
      ordersDeliveredCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured) {
      try {
        const { error: dbErr } = await supabase.from('delivery_agents').upsert({
          id: agentId,
          name: sanitizedName,
          phone: cleanPhone,
          status: 'active',
          vehicle_type: newAgent.vehicleType,
          orders_delivered_count: 0,
          updated_at: now,
        });

        if (dbErr) {
          console.warn('Supabase agent insert note:', dbErr.message);
        }
      } catch (err) {
        console.warn('Supabase agent insert exception:', err);
      }
    }

    // Update in-memory cache
    const existingIndex = localAgentsCache.findIndex((a) => a.phone === cleanPhone);
    if (existingIndex >= 0) {
      localAgentsCache[existingIndex] = { ...localAgentsCache[existingIndex], ...newAgent };
    } else {
      localAgentsCache.push(newAgent);
    }

    return NextResponse.json({
      success: true,
      agent: newAgent,
      message: `Delivery Agent ${sanitizedName} registered successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Agent creation failed.' }, { status: 500 });
  }
}

// PATCH: Update Delivery Agent status (active, off_duty, inactive) or profile
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, phone, status, name, vehicleType } = body;

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

    if (!agentId && !cleanPhone) {
      return NextResponse.json({ success: false, error: 'Agent ID or Phone number is required' }, { status: 400 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (name) updatePayload.name = sanitizeString(name, 60);
    if (vehicleType) updatePayload.vehicle_type = sanitizeString(vehicleType, 40);

    if (isSupabaseConfigured) {
      const query = supabase.from('delivery_agents').update(updatePayload);
      if (agentId) query.eq('id', agentId);
      else query.eq('phone', cleanPhone);
      await query;
    }

    localAgentsCache = localAgentsCache.map((a) => {
      if ((agentId && a.id === agentId) || (cleanPhone && a.phone === cleanPhone)) {
        return {
          ...a,
          ...(status ? { status } : {}),
          ...(name ? { name: sanitizeString(name, 60) } : {}),
          ...(vehicleType ? { vehicleType: sanitizeString(vehicleType, 40) } : {}),
        };
      }
      return a;
    });

    return NextResponse.json({ success: true, message: 'Delivery agent updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
