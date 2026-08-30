/**
 * Location utility to fetch device GPS coordinates and reverse geocode to human-readable street address.
 */

export interface GeocodedAddressResult {
  success: boolean;
  address?: string;
  unitOrApt?: string;
  lat?: number;
  lng?: number;
  error?: string;
}

export async function getCurrentLocationAddress(): Promise<GeocodedAddressResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Reverse geocode with OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};

            const parts: string[] = [];

            // Road / Street / Building
            const street = addr.road || addr.street || addr.residential || addr.suburb || '';
            const house = addr.house_number || addr.building || '';
            const neighbourhood = addr.neighbourhood || addr.suburb || addr.city_district || '';
            const city = addr.city || addr.town || addr.village || addr.county || 'Bengaluru';
            const state = addr.state || 'Karnataka';
            const postcode = addr.postcode || '';

            if (street) parts.push(street);
            if (neighbourhood && neighbourhood !== street) parts.push(neighbourhood);
            if (city) parts.push(city);
            if (state) parts.push(state);
            if (postcode) parts.push(postcode);

            const formattedAddress = parts.length > 0
              ? parts.join(', ')
              : (data.display_name || `GPS Pin (${lat.toFixed(5)}, ${lng.toFixed(5)})`);

            resolve({
              success: true,
              address: formattedAddress,
              unitOrApt: house ? `No. ${house}` : '',
              lat,
              lng,
            });
            return;
          }
        } catch {
          // Fallback if reverse geocoding API timed out
        }

        // Fallback with exact GPS coordinates
        resolve({
          success: true,
          address: `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          lat,
          lng,
        });
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        resolve({
          success: false,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
