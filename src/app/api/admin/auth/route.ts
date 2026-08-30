import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey, saveUserAdminKey, getSupabaseAdminKeys, UNIVERSAL_MASTER_KEY } from '@/lib/adminAuth';
import { isAuthThrottled, recordFailedAuthAttempt, clearFailedAuthAttempts } from '@/lib/security';
import { supabase, isSupabaseConfigured, formatDbDeliveryAgent } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  // Check if current IP has exceeded maximum WRONG attempts
  const throttle = isAuthThrottled(req, 25, 60);
  if (throttle.throttled) {
    return NextResponse.json(
      { success: false, error: 'Too many incorrect attempts. Please wait 1 minute.' },
      { status: 429, headers: { 'Retry-After': String(throttle.resetIn) } }
    );
  }

  try {
    const body = await req.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'PIN or Mobile number is required.' },
        { status: 400 }
      );
    }

    const cleanInput = key.trim();

    // 1. Try Admin PIN / Master Key verification
    const { valid, isUniversal } = await verifyAdminKey(cleanInput);

    if (valid) {
      clearFailedAuthAttempts(req);
      const token = Buffer.from(`auth_${Date.now()}_${isUniversal ? 'universal' : 'user'}`).toString('base64');
      return NextResponse.json({
        success: true,
        role: 'admin',
        isUniversal,
        token,
        message: isUniversal
          ? 'Authenticated successfully with Universal Master Key.'
          : 'Authenticated successfully with Kitchen Admin Key.',
      });
    }

    // 2. Check if input is a Delivery Agent's Mobile Number (10 digits)
    const cleanPhone = cleanInput.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length >= 10) {
      // Check in Supabase delivery_agents table
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('delivery_agents')
            .select('*')
            .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            clearFailedAuthAttempts(req);
            const agent = formatDbDeliveryAgent(data);
            const token = Buffer.from(`agent_${agent.id}_${Date.now()}`).toString('base64');
            return NextResponse.json({
              success: true,
              role: 'delivery_agent',
              agent,
              token,
              message: `Welcome, Delivery Partner ${agent.name}!`,
            });
          }
        } catch (dbErr) {
          console.warn('Supabase agent lookup note:', dbErr);
        }
      }
    }

    // Failed both Admin PIN and Delivery Agent Mobile checks
    recordFailedAuthAttempt(req);
    return NextResponse.json(
      { success: false, error: 'Invalid Kitchen PIN or Unregistered Delivery Agent Mobile Number.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error occurred.' },
      { status: 500 }
    );
  }
}

// Change or update the custom user key
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentKey, newKey } = body;

    if (!newKey || typeof newKey !== 'string' || newKey.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'New key must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    // Verify current authorization (must provide current valid key or universal key)
    const { valid, isUniversal } = await verifyAdminKey(currentKey);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Current authorization verification failed.' },
        { status: 401 }
      );
    }

    await saveUserAdminKey(newKey.trim());

    return NextResponse.json({
      success: true,
      message: 'Custom Admin Key updated successfully in database!',
      isUniversal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update admin key.' },
      { status: 500 }
    );
  }
}

// Get status/preview
export async function GET() {
  try {
    const { universalKey, customUserKey } = await getSupabaseAdminKeys();
    return NextResponse.json({
      success: true,
      universalKeyConfigured: !!universalKey,
      customUserKeyConfigured: !!customUserKey,
      tableName: 'admin_keys',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
