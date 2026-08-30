import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 60, 60, 'cashfree_order');
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many payment requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { amount, customer, orderId: clientOrderId } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = (process.env.NEXT_PUBLIC_CASHFREE_ENV || process.env.CASHFREE_ENV || 'TEST').toUpperCase();

    const orderId = clientOrderId || `CF_ORD_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const cleanPhone = (customer?.phone || '').replace(/[^0-9]/g, '').slice(-10) || '9999999999';
    const customerId = `CUST_${cleanPhone}_${Math.random().toString(36).substring(2, 5)}`;
    const customerName = sanitizeString(customer?.name || 'Zafiroo Guest', 60);
    const customerEmail = sanitizeString(customer?.email || `guest_${cleanPhone}@zafiroo.com`, 80);

    const baseUrl = mode === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (appId && secretKey && !appId.includes('your_') && !appId.includes('rzp_')) {
      // Direct REST API Call to Cashfree PG (API Version 2023-08-01)
      const cashfreePayload = {
        order_id: orderId,
        order_amount: Number(parsedAmount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
          customer_id: customerId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: cleanPhone,
        },
        order_meta: {
          return_url: `${appUrl}/track?order_id={order_id}`,
          notify_url: `${appUrl}/api/cashfree/webhook`,
          payment_methods: 'upi,cc,dc,nb,wallet',
        },
      };

      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': appId.trim(),
          'x-client-secret': secretKey.trim(),
          'x-api-version': '2023-08-01',
        },
        body: JSON.stringify(cashfreePayload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.payment_session_id) {
        return NextResponse.json({
          success: true,
          orderId: responseData.order_id || orderId,
          paymentSessionId: responseData.payment_session_id,
          cfOrderId: responseData.cf_order_id,
          environment: mode === 'PRODUCTION' ? 'production' : 'sandbox',
          isLive: true,
        });
      } else {
        console.warn('Cashfree API responded with error, falling back to simulated sandbox session:', responseData);
      }
    }

    // Secure Sandbox/Test Simulation Mode
    const simulatedSessionId = `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentSessionId: simulatedSessionId,
      cfOrderId: `cf_${Date.now()}`,
      environment: 'sandbox',
      isLive: false,
      note: 'Running in Cashfree Sandbox Simulator. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local for production processing.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to create Cashfree order' }, { status: 500 });
  }
}
