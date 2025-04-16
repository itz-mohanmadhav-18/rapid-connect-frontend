import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import SOSButton from "@/components/SOSButton";
import MapComponent from "@/components/Map";
import DisasterChart from "@/components/DisasterChart";
import RescueStats from "@/components/RescueStats";
import Guidelines from "@/components/Guidelines";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin } from "lucide-react";
import { getCurrentLocation } from "@/utils/locationService";

const Index = () => {
  const [locationName, setLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getLocationName = async () => {
      try {
        setLoading(true);
        const coords = await getCurrentLocation();
        
        // Use reverse geocoding to get the location name from coordinates
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${coords.latitude}+${coords.longitude}&key=95a7bd9313c94223a797fc08e6840b50`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const city = result.components.city || result.components.town || result.components.village;
          const state = result.components.state_code || result.components.state;
          
          if (city && state) {
            setLocationName(`${city}, ${state}`);
          } else {
            setLocationName(result.formatted.split(',').slice(0, 2).join(','));
          }
        } else {
          setLocationName("Location unavailable");
        }
      } catch (err) {
        console.error("Could not determine location:", err);
        setLocationName("Location unavailable");
      } finally {
        setLoading(false);
      }
    };
    
    getLocationName();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-alert/10 py-4 border-y border-alert/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <AlertTriangle className="h-5 w-5 text-emergency mr-2" />
                <span className="font-semibold">
                  HIGH ALERT: Flood warning in effect
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  Current location: {loading ? "Detecting location..." : locationName}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <SOSButton />
          </div>
          
          <div className="mb-6">
            <RescueStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Relief Resources Near You</CardTitle>
              </CardHeader>
              <CardContent>
                <MapComponent />
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2 space-y-6">
              <DisasterChart />
              <Guidelines />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;