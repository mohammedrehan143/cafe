import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In INR sub-units (paise: 100 paise = 1 INR) or currency equivalent
    // e.g. amount $10.00 -> ~830 INR or direct units
    const amountInSubunits = Math.round(Number(amount) * 100);

    if (keyId && keySecret) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInSubunits,
        currency: currency,
        receipt: receipt || `rec_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        isLive: true,
      });
    }

    // Secure Test/Demo Mode simulation if keys aren't added to env yet
    const simulatedOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return NextResponse.json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInSubunits,
      currency: currency,
      keyId: keyId || 'rzp_test_demoKey123',
      isLive: false,
      note: 'Running in Secure Razorpay Sandbox/Simulation mode. Provide RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in env for live gateway processing.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Razorpay order creation failed' }, { status: 500 });
  }
}
