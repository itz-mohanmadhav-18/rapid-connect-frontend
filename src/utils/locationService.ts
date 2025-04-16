
type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
};

// Get user's current location
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// Calculate distance between two points in km
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
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Mock data for nearby entities based on user location
export const getNearbyEntities = (userLocation: Coordinates) => {
  const { latitude, longitude } = userLocation;
  
  // Mock data - in a real app, this would come from an API
  return {
    camps: [
      {
        id: "camp1",
        name: "Relief Camp Alpha",
        latitude: latitude + 0.01,
        longitude: longitude + 0.01,
        capacity: 500,
        occupancy: 320,
        supplies: "Food, Water, Medical",
        contact: "+1-555-123-4567"
      },
      {
        id: "camp2",
        name: "Medical Station Beta",
        latitude: latitude - 0.008,
        longitude: longitude + 0.006,
        capacity: 200,
        occupancy: 120,
        supplies: "Medical, Shelter",
        contact: "+1-555-987-6543"
      },
      {
        id: "camp3",
        name: "Food Distribution Center",
        latitude: latitude + 0.004,
        longitude: longitude - 0.01,
        capacity: 300,
        occupancy: 180,
        supplies: "Food, Water",
        contact: "+1-555-456-7890"
      }
    ],
    volunteers: [
      {
        id: "vol1",
        name: "Medical Team A",
        latitude: latitude - 0.005,
        longitude: longitude - 0.003,
        specialty: "Medical",
        members: 5,
        status: "Active"
      },
      {
        id: "vol2",
        name: "Rescue Squad B",
        latitude: latitude + 0.007,
        longitude: longitude - 0.008,
        specialty: "Search & Rescue",
        members: 8,
        status: "Active"
      }
    ],
    donors: [
      {
        id: "donor1",
        name: "Supply Drop Point",
        latitude: latitude - 0.01,
        longitude: longitude + 0.009,
        supplies: "Food, Water, Medicine",
        status: "Receiving Donations"
      }
    ]
  };
};
