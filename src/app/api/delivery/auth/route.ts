import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbDeliveryAgent } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 40, 60, 'delivery_auth');
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many login attempts. Please wait.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { phone } = body;

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    // 1. Look up directly in Supabase Database
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('delivery_agents')
          .select('*')
          .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const agent = formatDbDeliveryAgent(data);
          const token = Buffer.from(`agent_${agent.id}_${Date.now()}`).toString('base64');
          return NextResponse.json({
            success: true,
            role: 'delivery_agent',
            agent,
            token,
            message: `Welcome back, ${agent.name}!`,
          });
        }
      } catch (err) {
        console.warn('Supabase delivery agent query error:', err);
      }
    }

    // Agent not found - auto register on first mobile login or return not found
    return NextResponse.json(
      {
        success: false,
        error: `No delivery partner registered with mobile number +91 ${cleanPhone}. Please ask kitchen admin to register your number.`,
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Login error occurred.' }, { status: 500 });
  }
}
