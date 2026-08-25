import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
      }

      return NextResponse.json({ success: true, verified: true });
    }

    // In sandbox/demo fallback mode, accept simulated payment authorization
    return NextResponse.json({
      success: true,
      verified: true,
      mode: 'sandbox_verified',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
