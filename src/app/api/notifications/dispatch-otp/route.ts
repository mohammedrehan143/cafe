import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';
import { sendAutomaticOtpNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

/**
 * POST /api/notifications/dispatch-otp
 * Automatically sends OTP via WhatsApp or SMS to the customer when an order is dispatched
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, riderName, riderPhone, customPhone } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    let customerName = 'Valued Customer';
    let customerPhone = customPhone || '';
    let deliveryOtp = '1234';
    let tokenId = orderId;
    let effectiveRiderName = riderName;
    let effectiveRiderPhone = riderPhone;

    // Lookup order in Supabase if configured
    if (isSupabaseConfigured) {
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${orderId},tracking_code.eq.${orderId},token_id.eq.${orderId}`)
        .single();

      if (dbOrder) {
        customerName = dbOrder.customer_name || customerName;
        customerPhone = customerPhone || dbOrder.customer_phone || '';
        deliveryOtp = dbOrder.delivery_otp || deliveryOtp;
        tokenId = dbOrder.token_id || dbOrder.tracking_code || orderId;

        // If rider info wasn't provided, try to fetch from delivery_agents
        if (!effectiveRiderName && dbOrder.delivery_agent_id) {
          const { data: agent } = await supabase
            .from('delivery_agents')
            .select('name, phone')
            .eq('id', dbOrder.delivery_agent_id)
            .single();

          if (agent) {
            effectiveRiderName = agent.name;
            effectiveRiderPhone = agent.phone;
          }
        }
      }
    }

    if (!customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Customer phone number not found for this order.' },
        { status: 400 }
      );
    }

    const result = await sendAutomaticOtpNotification({
      orderId,
      tokenId,
      customerName,
      customerPhone,
      deliveryOtp,
      riderName: effectiveRiderName,
      riderPhone: effectiveRiderPhone,
    });

    return NextResponse.json({
      success: true,
      result,
      otp: deliveryOtp,
      recipient: customerPhone,
      message: result.message,
      whatsappUrl: result.whatsappUrl,
      smsUrl: result.smsUrl,
    });
  } catch (error: any) {
    console.error('Error dispatching OTP notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch OTP notification.' },
      { status: 500 }
    );
  }
}
