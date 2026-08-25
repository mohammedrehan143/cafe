import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit, sanitizeString, constantTimeCompare } from '@/lib/security';

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many verification attempts' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const razorpay_order_id = sanitizeString(body?.razorpay_order_id, 80);
    const razorpay_payment_id = sanitizeString(body?.razorpay_payment_id, 80);
    const razorpay_signature = sanitizeString(body?.razorpay_signature, 128);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment signature verification parameters' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      // Constant-time HMAC comparison prevents timing side-channel attacks
      const isSignatureValid = constantTimeCompare(generated_signature, razorpay_signature);

      if (!isSignatureValid) {
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
      }

      return NextResponse.json({ success: true, verified: true });
    }

    // In sandbox simulation mode
    return NextResponse.json({
      success: true,
      verified: true,
      mode: 'sandbox_verified',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
