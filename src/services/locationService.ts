// Helper functions for geolocation
interface GeoPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: number;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Get the user's current location
export const getCurrentPosition = (): Promise<GeoPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Get the user's current location with address information
export const getCurrentLocation = async (): Promise<Location> => {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    
    // Try to get the address using reverse geocoding
    try {
      // Using Nominatim OpenStreetMap API for reverse geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address information');
      }
      
      const data = await response.json();
      const address = data.display_name || 'Unknown location';
      
      return {
        lat: latitude,
        lng: longitude,
        address
      };
    } catch (error) {
      console.error('Error getting address:', error);
      // Return coordinates without address if geocoding fails
      return {
        lat: latitude,
        lng: longitude,
        address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
      };
    }
  } catch (error) {
    throw new Error('Could not determine your location. Please ensure location services are enabled.');
  }
};

// Calculate distance between two points in kilometers using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Converts decimal degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Convert kilometers to miles
export const kmToMiles = (km: number): number => {
  return km * 0.621371;
};

// Format the distance to a user-friendly string
export const formatDistance = (distance: number, useKm = true): string => {
  if (useKm) {
    return distance < 1 
      ? `${Math.round(distance * 1000)} m` 
      : `${distance.toFixed(1)} km`;
  } else {
    const miles = kmToMiles(distance);
    return miles < 1 
      ? `${Math.round(miles * 5280)} ft` 
      : `${miles.toFixed(1)} miles`;
  }
};

export default {
  getCurrentPosition,
  getCurrentLocation,
  calculateDistance,
  kmToMiles,
  formatDistance
};