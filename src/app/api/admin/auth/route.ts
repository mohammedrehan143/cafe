import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey, saveUserAdminKey, getSupabaseAdminKeys, UNIVERSAL_MASTER_KEY } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  // Rate limiting to protect against brute force
  const limit = checkRateLimit(req, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many authentication attempts. Please wait 1 minute.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetIn) } }
    );
  }

  try {
    const body = await req.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Authorization key is required.' },
        { status: 400 }
      );
    }

    const { valid, isUniversal } = await verifyAdminKey(key);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Admin Key or Master PIN.' },
        { status: 401 }
      );
    }

    // Generate a simple auth token
    const token = Buffer.from(`auth_${Date.now()}_${isUniversal ? 'universal' : 'user'}`).toString('base64');

    return NextResponse.json({
      success: true,
      isUniversal,
      token,
      message: isUniversal
        ? 'Authenticated successfully with Universal Master Key.'
        : 'Authenticated successfully with Custom Admin Key.',
    });
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
