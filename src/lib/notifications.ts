import { Order } from '@/types/cafe';
import { CAFE_INFO } from '@/data/cafeData';

export interface DispatchNotificationParams {
  orderId: string;
  tokenId?: string;
  customerName: string;
  customerPhone: string;
  deliveryOtp: string;
  riderName?: string;
  riderPhone?: string;
  address?: string;
  total?: number;
  appUrl?: string;
}

export interface NotificationResult {
  success: boolean;
  channel: 'twilio_sms' | 'twilio_whatsapp' | 'fast2sms' | 'whatsapp_cloud' | 'whatsapp_link' | 'sms_link';
  message: string;
  whatsappUrl?: string;
  smsUrl?: string;
  providerResponse?: any;
  error?: string;
}

/**
 * Builds the official standard OTP dispatch message for WhatsApp and SMS
 */
export function buildDispatchOtpMessage(params: DispatchNotificationParams): string {
  const token = params.tokenId || params.orderId;
  const baseUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://zafiroo.com';
  const trackingUrl = `${baseUrl}/track?id=${encodeURIComponent(token)}`;

  const riderInfo = params.riderName
    ? `${params.riderName}${params.riderPhone ? ` (+91 ${params.riderPhone})` : ''}`
    : 'Assigned Zafiroo Delivery Partner';

  return (
    `🛵 *Zafiroo Cafe - Order Dispatched!*\n\n` +
    `Hi *${params.customerName || 'Valued Customer'}*,\n` +
    `Your order *#${token}* is on its way to your doorstep!\n\n` +
    `🔢 *YOUR DELIVERY OTP:* *${params.deliveryOtp}*\n` +
    `_(Please share this 4-digit OTP with your delivery partner upon arrival to verify handover)_\n\n` +
    `🚴 *Rider:* ${riderInfo}\n` +
    `📍 *Live Order Tracker:* ${trackingUrl}\n\n` +
    `Thank you for ordering with Zafiroo Gourmet Cafe! ☕✨`
  );
}

/**
 * Builds a plain text SMS friendly version (under 160 chars when possible)
 */
export function buildDispatchOtpSmsText(params: DispatchNotificationParams): string {
  const token = params.tokenId || params.orderId;
  return (
    `Zafiroo Order #${token} is OUT FOR DELIVERY! Your 4-Digit Delivery OTP is: ${params.deliveryOtp}. ` +
    `Please share this OTP with delivery rider upon arrival.`
  );
}

/**
 * Formats a clean 10-digit Indian phone or standard international E.164 number
 */
export function formatPhoneNumber(phone: string): { clean10: string; e164: string } {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  const clean10 = digits.slice(-10);
  const e164 = digits.startsWith('91') && digits.length === 12 ? `+${digits}` : `+91${clean10}`;
  return { clean10, e164 };
}

/**
 * Dispatches automated OTP notification via configured SMS/WhatsApp gateway
 * with automatic fallback to WhatsApp Click-to-Chat URI.
 */
export async function sendAutomaticOtpNotification(
  params: DispatchNotificationParams
): Promise<NotificationResult> {
  const { clean10, e164 } = formatPhoneNumber(params.customerPhone);
  const message = buildDispatchOtpMessage(params);
  const smsText = buildDispatchOtpSmsText(params);

  // Generate fallback WhatsApp link & SMS link
  const whatsappUrl = `https://wa.me/91${clean10}?text=${encodeURIComponent(message)}`;
  const smsUrl = `sms:${e164}?body=${encodeURIComponent(smsText)}`;

  // 1. Check Twilio SMS / WhatsApp credentials
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER;

  if (twilioSid && twilioToken && (twilioWhatsapp || twilioPhone)) {
    try {
      const isWhatsapp = Boolean(twilioWhatsapp);
      const from = isWhatsapp ? `whatsapp:${twilioWhatsapp}` : twilioPhone;
      const to = isWhatsapp ? `whatsapp:${e164}` : e164;
      const body = isWhatsapp ? message : smsText;

      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const formBody = new URLSearchParams({
        From: from || '',
        To: to,
        Body: body,
      });

      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        }
      );

      const twilioData = await twilioRes.json();
      if (twilioRes.ok) {
        return {
          success: true,
          channel: isWhatsapp ? 'twilio_whatsapp' : 'twilio_sms',
          message: `OTP notification sent automatically via Twilio ${isWhatsapp ? 'WhatsApp' : 'SMS'} to ${e164}`,
          whatsappUrl,
          smsUrl,
          providerResponse: twilioData,
        };
      }
      console.warn('Twilio API returned error:', twilioData);
    } catch (err: any) {
      console.warn('Twilio dispatch error:', err.message);
    }
  }

  // 2. Check Fast2SMS API Key (Instant Indian SMS Gateway)
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  if (fast2SmsKey && clean10.length === 10) {
    try {
      const fast2smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: smsText,
          language: 'english',
          flash: 0,
          numbers: clean10,
        }),
      });

      const fastData = await fast2smsRes.json();
      if (fast2smsRes.ok && fastData.return) {
        return {
          success: true,
          channel: 'fast2sms',
          message: `OTP SMS dispatched automatically via Fast2SMS to +91 ${clean10}`,
          whatsappUrl,
          smsUrl,
          providerResponse: fastData,
        };
      }
      console.warn('Fast2SMS returned error:', fastData);
    } catch (err: any) {
      console.warn('Fast2SMS dispatch error:', err.message);
    }
  }

  // 3. Check WhatsApp Cloud API (Meta Graph API)
  const metaToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (metaToken && metaPhoneId) {
    try {
      const metaRes = await fetch(
        `https://graph.facebook.com/v18.0/${metaPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${metaToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: `91${clean10}`,
            type: 'text',
            text: { preview_url: true, body: message },
          }),
        }
      );

      const metaData = await metaRes.json();
      if (metaRes.ok && metaData.messages) {
        return {
          success: true,
          channel: 'whatsapp_cloud',
          message: `OTP WhatsApp dispatched automatically via Meta Cloud API to +91 ${clean10}`,
          whatsappUrl,
          smsUrl,
          providerResponse: metaData,
        };
      }
      console.warn('Meta WhatsApp Cloud API error:', metaData);
    } catch (err: any) {
      console.warn('Meta WhatsApp dispatch error:', err.message);
    }
  }

  // 4. Default High-Reliability Delivery: Instant WhatsApp Direct Message link with prefilled OTP
  return {
    success: true,
    channel: 'whatsapp_link',
    message: `WhatsApp OTP message generated for +91 ${clean10}`,
    whatsappUrl,
    smsUrl,
  };
}
