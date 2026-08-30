import { CAFE_INFO } from '@/data/cafeData';

export interface ShareLocationOptions {
  orderId?: string;
  customerName?: string;
  address?: string;
  customNote?: string;
  deliveryOtp?: string;
  total?: number;
}

/**
 * Retrieves the device's current GPS coordinates (lat, lng) with high accuracy
 */
export async function getDeviceCoordinates(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Geolocation denied or unavailable
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Generates and opens a WhatsApp chat prefilled with order details, OTP & live GPS Google Maps pin
 */
export async function shareLiveLocationOnWhatsApp(options: ShareLocationOptions = {}) {
  const whatsappNumber = (CAFE_INFO.whatsappPhone || CAFE_INFO.phone).replace(/[^0-9]/g, '');
  
  // Try to get GPS coordinates
  const coords = await getDeviceCoordinates();

  let message = `*Zafiroo Gourmet Cafe - Live Order & Delivery Details*\n\n`;

  if (options.orderId) {
    message += `*Order Token:* #${options.orderId}\n`;
  }
  if (options.deliveryOtp) {
    message += `*Doorstep Delivery OTP:* *${options.deliveryOtp}*\n_(Share this 4-digit code with your rider to verify delivery)_\n`;
  }
  if (options.customerName) {
    message += `*Customer:* ${options.customerName}\n`;
  }
  if (options.address) {
    message += `*Delivery Address:* ${options.address}\n`;
  }
  if (options.total) {
    message += `*Total Amount:* ₹${options.total.toFixed(2)}\n`;
  }

  if (coords) {
    message += `\n*Live GPS Pin:* https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}\n`;
    message += `Sharing my exact live GPS location for quick doorstep delivery.`;
  }

  if (options.customNote) {
    message += `\n*Customer Note:* ${options.customNote}`;
  }

  const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  if (typeof window !== 'undefined') {
    window.open(encodedUrl, '_blank', 'noopener,noreferrer');
  }

  return { success: true, coords };
}

/**
 * Direct WhatsApp OTP confirmation message
 */
export function sendOtpToWhatsApp(orderId: string, otp: string, customerPhone?: string) {
  const recipient = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : (CAFE_INFO.whatsappPhone || CAFE_INFO.phone).replace(/[^0-9]/g, '');
  const message = `*Zafiroo Delivery OTP Verification*\n\nOrder Token: #${orderId}\nYour 4-Digit Delivery OTP is: *${otp}*\n\nPlease share this OTP with your delivery partner upon doorstep arrival to receive your fresh order.`;
  const url = `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
