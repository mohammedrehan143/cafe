/**
 * Pinpoint-Accurate Geolocation & Reverse Geocoding Utility
 * Uses hardware GPS (High Accuracy) with building-level zoom (zoom=18) and multi-provider reverse-geocoding.
 */

export interface GeocodedAddressResult {
  success: boolean;
  address?: string;
  unitOrApt?: string;
  lat?: number;
  lng?: number;
  accuracyMeters?: number;
  error?: string;
}

/**
 * Reverse geocodes coordinates to pinpoint human-readable street address
 */
async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<{ address: string; unitOrApt: string }> {
  // Provider 1: OpenStreetMap Nominatim with Building-level precision (zoom=18)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'ZafirooCafeApp/1.0',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const houseNumber = addr.house_number || addr.building || addr.house_name || '';
      const road = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path || addr.residential || '';
      const neighbourhood = addr.neighbourhood || addr.suburb || addr.subdistrict || addr.colony || addr.quarter || '';
      const cityDistrict = addr.city_district || addr.district || '';
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || 'Bengaluru';
      const postcode = addr.postcode || '';
      const state = addr.state || 'Karnataka';

      const lineParts: string[] = [];
      if (houseNumber && road) {
        lineParts.push(`${houseNumber}, ${road}`);
      } else if (road) {
        lineParts.push(road);
      } else if (houseNumber) {
        lineParts.push(houseNumber);
      }

      if (neighbourhood && !lineParts.includes(neighbourhood)) lineParts.push(neighbourhood);
      if (cityDistrict && !lineParts.includes(cityDistrict) && cityDistrict !== city) lineParts.push(cityDistrict);
      if (city && !lineParts.includes(city)) lineParts.push(city);
      if (state && !lineParts.includes(state)) lineParts.push(state);
      if (postcode) lineParts.push(postcode);

      if (lineParts.length >= 2) {
        return {
          address: lineParts.join(', '),
          unitOrApt: houseNumber ? `No. ${houseNumber}` : '',
        };
      } else if (data.display_name) {
        return {
          address: data.display_name,
          unitOrApt: houseNumber ? `No. ${houseNumber}` : '',
        };
      }
    }
  } catch {}

  // Provider 2: BigDataCloud Precise Reverse Geocoding Client API
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      const data = await res.json();
      const parts: string[] = [];

      const thoroughfare = data.localityInfo?.administrative?.[0]?.name || '';
      const locality = data.locality || data.city || '';
      const district = data.principalSubdivision || '';
      const postcode = data.postcode || '';

      if (data.localityInfo?.informative) {
        for (const info of data.localityInfo.informative) {
          if (info.name && !parts.includes(info.name) && info.order <= 6) {
            parts.push(info.name);
          }
        }
      }

      if (locality && !parts.includes(locality)) parts.push(locality);
      if (district && !parts.includes(district)) parts.push(district);
      if (postcode && !parts.includes(postcode)) parts.push(postcode);

      if (parts.length > 0) {
        return {
          address: parts.join(', '),
          unitOrApt: '',
        };
      }
    }
  } catch {}

  return {
    address: `GPS Pin: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    unitOrApt: '',
  };
}

/**
 * Gets exact device GPS position with High Accuracy enforced
 */
export async function getCurrentLocationAddress(): Promise<GeocodedAddressResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      error: 'Location services are not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        const { address, unitOrApt } = await reverseGeocodeCoordinates(lat, lng);

        resolve({
          success: true,
          address,
          unitOrApt,
          lat,
          lng,
          accuracyMeters: Math.round(accuracy),
        });
      },
      (error) => {
        let errorMsg = 'Could not access device GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please allow location access in your browser settings to autofill your exact address.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS signal is currently unavailable. Please enter address manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS request timed out. Please try clicking "Use Current Location" again.';
        }

        resolve({
          success: false,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,  // Enforces hardware GPS / WiFi trilateration for pinpoint accuracy
        timeout: 12000,
        maximumAge: 0,             // Never use cached stale positions
      }
    );
  });
}
