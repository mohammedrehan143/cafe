/**
 * Location utility to fetch device GPS coordinates and reverse geocode to human-readable street address.
 * Resilient multi-tier fallback: High-Accuracy GPS -> Standard Geolocation -> IP-based Geolocation fallback.
 */

export interface GeocodedAddressResult {
  success: boolean;
  address?: string;
  unitOrApt?: string;
  lat?: number;
  lng?: number;
  error?: string;
}

// Fallback: Fast IP-Based Geolocation (works seamlessly on desktop PC without GPS hardware or when OS location is disabled)
async function fetchIpBasedLocation(): Promise<GeocodedAddressResult> {
  try {
    const ipRes = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (ipRes.ok) {
      const data = await ipRes.json();
      const parts = [data.city, data.region, data.postal ? `${data.postal}` : '', data.country_name]
        .filter(Boolean);

      if (parts.length > 0) {
        return {
          success: true,
          address: parts.join(', '),
          lat: data.latitude,
          lng: data.longitude,
        };
      }
    }
  } catch {}

  try {
    const backupRes = await fetch('https://ipwho.is/', { cache: 'no-store' });
    if (backupRes.ok) {
      const data = await backupRes.json();
      if (data.success) {
        const parts = [data.city, data.region, data.postal, data.country].filter(Boolean);
        return {
          success: true,
          address: parts.join(', '),
          lat: data.latitude,
          lng: data.longitude,
        };
      }
    }
  } catch {}

  return {
    success: false,
    error: 'Could not auto-detect location. Please enter street address manually.',
  };
}

export async function getCurrentLocationAddress(): Promise<GeocodedAddressResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return fetchIpBasedLocation();
  }

  return new Promise((resolve) => {
    let resolved = false;

    // Timeout guard to guarantee IP fallback if browser hangs
    const fallbackTimer = setTimeout(async () => {
      if (!resolved) {
        resolved = true;
        const ipResult = await fetchIpBasedLocation();
        resolve(ipResult);
      }
    }, 6000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(fallbackTimer);

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
        } catch {}

        // Fallback to IP or Coordinates
        resolve({
          success: true,
          address: `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          lat,
          lng,
        });
      },
      async () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(fallbackTimer);

        // If permission denied or OS location blocked on desktop, seamlessly use IP Geolocation
        const ipResult = await fetchIpBasedLocation();
        resolve(ipResult);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  });
}
