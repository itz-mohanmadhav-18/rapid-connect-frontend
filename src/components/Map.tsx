
import React, { useState, useEffect } from "react";
import { getCurrentLocation, getNearbyEntities } from "@/utils/locationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Users, Package, Home, X } from "lucide-react";

// Mock map component - in a real app, you'd use a library like react-leaflet or Google Maps
const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [entities, setEntities] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const coords = await getCurrentLocation();
        setUserLocation(coords);
        
        // Get nearby entities based on user location
        const nearby = getNearbyEntities(coords);
        setEntities(nearby);
      } catch (err) {
        console.error("Error fetching location:", err);
        setError("Unable to access your location. Please enable location services.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
  };

  const handleCloseCard = () => {
    setSelectedEntity(null);
  };

  // Calculate mock positions for entities on the map container
  // In a real map, these would be proper geo-coordinates
  const getEntityStyle = (entity: any) => {
    if (!userLocation) return {};
    
    const latDiff = entity.latitude - userLocation.latitude;
    const lngDiff = entity.longitude - userLocation.longitude;
    
    // Convert geo differences to percentage positions within the container
    // This is a very simplified mock positioning
    const left = 50 + (lngDiff * 1000);
    const top = 50 - (latDiff * 1000);
    
    return {
      left: `${Math.min(Math.max(left, 10), 90)}%`,
      top: `${Math.min(Math.max(top, 10), 90)}%`,
    };
  };

  if (loading) {
    return (
      <div className="map-container h-64 sm:h-80 md:h-96 flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Locating you and nearby resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container h-64 sm:h-80 md:h-96 flex items-center justify-center">
        <div className="text-center p-4 text-destructive">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="map-container h-64 sm:h-80 md:h-96 relative bg-[#e8f4f8]">
        {/* Mock map - In reality, this would be a proper map library */}
        
        {/* User location marker */}
        {userLocation && (
          <div 
            className="absolute bg-info rounded-full w-5 h-5 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-10 pulse-dot"
            style={{ left: '50%', top: '50%' }}
          >
            <span className="sr-only">Your location</span>
          </div>
        )}
        
        {/* Relief camp markers */}
        {entities && entities.camps.map((camp: any) => (
          <div
            key={camp.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={getEntityStyle(camp)}
            onClick={() => handleEntityClick(camp)}
          >
            <div className="bg-alert text-alert-foreground rounded-full p-1">
              <Home className="h-4 w-4" />
            </div>
          </div>
        ))}
        
        {/* Volunteer markers */}
        {entities && entities.volunteers.map((volunteer: any) => (
          <div
            key={volunteer.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={getEntityStyle(volunteer)}
            onClick={() => handleEntityClick(volunteer)}
          >
            <div className="bg-success text-success-foreground rounded-full p-1">
              <Users className="h-4 w-4" />
            </div>
          </div>
        ))}
        
        {/* Donor markers */}
        {entities && entities.donors.map((donor: any) => (
          <div
            key={donor.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={getEntityStyle(donor)}
            onClick={() => handleEntityClick(donor)}
          >
            <div className="bg-info text-info-foreground rounded-full p-1">
              <Package className="h-4 w-4" />
            </div>
          </div>
        ))}
        
        {/* Entity Info Card */}
        {selectedEntity && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 z-20">
            <Card className="entity-card entity-card-camp">
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {selectedEntity.name}
                  </CardTitle>
                  <button onClick={handleCloseCard} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="text-sm space-y-1">
                  <p className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span>
                      {selectedEntity.latitude.toFixed(6)}, {selectedEntity.longitude.toFixed(6)}
                    </span>
                  </p>
                  
                  {selectedEntity.capacity && (
                    <p>
                      <span className="font-semibold">Capacity:</span> {selectedEntity.capacity}
                    </p>
                  )}
                  
                  {selectedEntity.occupancy && (
                    <p>
                      <span className="font-semibold">Current occupancy:</span> {selectedEntity.occupancy}
                    </p>
                  )}
                  
                  {selectedEntity.supplies && (
                    <p>
                      <span className="font-semibold">Supplies:</span> {selectedEntity.supplies}
                    </p>
                  )}
                  
                  {selectedEntity.specialty && (
                    <p>
                      <span className="font-semibold">Specialty:</span> {selectedEntity.specialty}
                    </p>
                  )}
                  
                  {selectedEntity.members && (
                    <p>
                      <span className="font-semibold">Team members:</span> {selectedEntity.members}
                    </p>
                  )}
                  
                  {selectedEntity.status && (
                    <p>
                      <span className="font-semibold">Status:</span> {selectedEntity.status}
                    </p>
                  )}
                  
                  {selectedEntity.contact && (
                    <p className="text-emergency font-medium">
                      {selectedEntity.contact}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-info rounded-full mr-1"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-alert rounded-full mr-1"></div>
          <span>Relief Camps</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-success rounded-full mr-1"></div>
          <span>Volunteers</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-info rounded-full mr-1"></div>
          <span>Donors</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
