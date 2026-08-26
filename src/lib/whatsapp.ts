import { CAFE_INFO } from '@/data/cafeData';

export interface ShareLocationOptions {
  orderId?: string;
  customerName?: string;
  address?: string;
  customNote?: string;
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
 * Generates and opens a WhatsApp chat prefilled with order details & live GPS Google Maps pin
 */
export async function shareLiveLocationOnWhatsApp(options: ShareLocationOptions = {}) {
  const whatsappNumber = (CAFE_INFO.whatsappPhone || CAFE_INFO.phone).replace(/[^0-9]/g, '');
  
  // Try to get GPS coordinates
  const coords = await getDeviceCoordinates();

  let message = `*Zafiroo Kitchen - Live Delivery Location* 🛵📍\n\n`;

  if (options.orderId) {
    message += `🏷️ *Order Token:* #${options.orderId}\n`;
  }
  if (options.customerName) {
    message += `👤 *Customer:* ${options.customerName}\n`;
  }
  if (options.address) {
    message += `🏠 *Address:* ${options.address}\n`;
  }

  if (coords) {
    message += `📍 *Live GPS Pin:* https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}\n\n`;
    message += `Sharing my exact live GPS location for quick dispatch and doorstep delivery.`;
  } else {
    message += `\n📍 *Note:* Sending my live location pin in this chat.`;
  }

  if (options.customNote) {
    message += `\n💬 *Courier Note:* ${options.customNote}`;
  }

  const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  if (typeof window !== 'undefined') {
    window.open(encodedUrl, '_blank', 'noopener,noreferrer');
  }

  return { success: true, coords };
}
