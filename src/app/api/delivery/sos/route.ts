import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SosAlert } from '@/types/cafe';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback cache for SOS alerts
let localSosCache: SosAlert[] = [];

export async function GET(req: NextRequest) {
  const limit = checkRateLimit(req, 120, 60, 'sos_get');
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        const formatted: SosAlert[] = data.map((row) => ({
          id: row.id,
          agentId: row.agent_id || undefined,
          agentName: row.agent_name || 'Rider',
          agentPhone: row.agent_phone || '',
          orderId: row.order_id || undefined,
          tokenId: row.token_id || undefined,
          reason: row.reason || 'other',
          notes: row.notes || undefined,
          lat: row.lat ? Number(row.lat) : undefined,
          lng: row.lng ? Number(row.lng) : undefined,
          locationAddress: row.location_address || undefined,
          status: row.status || 'active',
          resolvedAt: row.resolved_at || undefined,
          resolvedBy: row.resolved_by || undefined,
          createdAt: row.created_at,
        }));

        return NextResponse.json(
          { success: true, alerts: formatted },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }

    return NextResponse.json(
      { success: true, alerts: localSosCache },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: true, alerts: localSosCache, warning: err.message },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 30, 60, 'sos_post');
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many SOS requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { agentId, agentName, agentPhone, orderId, tokenId, reason, notes, lat, lng, locationAddress } = body;

    if (!agentName && !agentPhone) {
      return NextResponse.json({ success: false, error: 'Rider identity (name/phone) is required for SOS.' }, { status: 400 });
    }

    const sosId = `SOS-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    const nowISO = new Date().toISOString();

    const newAlert: SosAlert = {
      id: sosId,
      agentId: sanitizeString(agentId || '', 60) || undefined,
      agentName: sanitizeString(agentName || 'Delivery Partner', 80),
      agentPhone: sanitizeString(agentPhone || '', 30),
      orderId: sanitizeString(orderId || '', 60) || undefined,
      tokenId: sanitizeString(tokenId || '', 60) || undefined,
      reason: sanitizeString(reason || 'Emergency Assistance Needed', 100),
      notes: sanitizeString(notes || '', 500) || undefined,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      locationAddress: sanitizeString(locationAddress || '', 300) || undefined,
      status: 'active',
      createdAt: nowISO,
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('sos_alerts').insert({
          id: newAlert.id,
          agent_id: newAlert.agentId || null,
          agent_name: newAlert.agentName,
          agent_phone: newAlert.agentPhone,
          order_id: newAlert.orderId || null,
          token_id: newAlert.tokenId || null,
          reason: newAlert.reason,
          notes: newAlert.notes || null,
          lat: newAlert.lat || null,
          lng: newAlert.lng || null,
          location_address: newAlert.locationAddress || null,
          status: 'active',
          created_at: nowISO,
          updated_at: nowISO,
        });
      } catch (dbErr: any) {
        console.warn('Supabase SOS alert insert error:', dbErr.message);
      }
    }

    localSosCache = [newAlert, ...localSosCache].slice(0, 100);

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: '🚨 Emergency SOS broadcasted immediately to Kitchen KDS and Admin dispatch!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to dispatch SOS alert' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { alertId, status, resolvedBy, resolutionNotes } = body;

    if (!alertId) {
      return NextResponse.json({ success: false, error: 'Alert ID is required' }, { status: 400 });
    }

    const nowISO = new Date().toISOString();
    const targetStatus = status || 'resolved';

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('sos_alerts')
          .update({
            status: targetStatus,
            resolved_at: targetStatus === 'resolved' ? nowISO : null,
            resolved_by: sanitizeString(resolvedBy || 'Kitchen Admin', 80),
            notes: resolutionNotes ? sanitizeString(resolutionNotes, 500) : undefined,
            updated_at: nowISO,
          })
          .eq('id', alertId);
      } catch (dbErr: any) {
        console.warn('Supabase SOS resolution error:', dbErr.message);
      }
    }

    localSosCache = localSosCache.map((a) =>
      a.id === alertId
        ? {
            ...a,
            status: targetStatus,
            resolvedAt: targetStatus === 'resolved' ? nowISO : undefined,
            resolvedBy: resolvedBy || 'Kitchen Admin',
          }
        : a
    );

    return NextResponse.json({
      success: true,
      message: `SOS alert #${alertId} marked as ${targetStatus}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update SOS alert' }, { status: 500 });
  }
}
