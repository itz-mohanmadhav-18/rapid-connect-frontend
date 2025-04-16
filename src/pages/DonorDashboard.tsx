import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Heart, DollarSign, RefreshCw, LogOut, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";

const DonorDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-primary/10 py-4 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Donor Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" /> Your Donation Impact
              </CardTitle>
              <CardDescription>See how your contributions are helping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Total Donated:</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>People Helped:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supplies Funded:</span>
                  <span className="font-bold">0 items</span>
                </div>
                <Button className="w-full">
                  <Heart className="h-4 w-4 mr-2" /> Make a Donation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-info" /> Recent Disasters
              </CardTitle>
              <CardDescription>Areas currently in need of support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">Coastal Flooding</div>
                  <div className="text-sm text-muted-foreground">San Francisco Bay Area</div>
                  <div className="mt-2 text-xs bg-alert/20 text-alert-foreground p-1 rounded inline-block">High Need</div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">Wildfire</div>
                  <div className="text-sm text-muted-foreground">Northern California</div>
                  <div className="mt-2 text-xs bg-emergency/20 text-emergency p-1 rounded inline-block">Critical Need</div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View All Disasters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emergency" /> Active Relief Camps
              </CardTitle>
              <CardDescription>Current operations you can support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">City Hall Relief Center</div>
                  <div className="text-sm text-muted-foreground">Downtown San Francisco</div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Needs: Medical, Food</span>
                    <span>2.5 miles away</span>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">South Bay Emergency Camp</div>
                  <div className="text-sm text-muted-foreground">San Jose</div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Needs: Blankets, Water</span>
                    <span>15 miles away</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View All Camps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Relief Camp and Volunteer Map</CardTitle>
            <CardDescription>
              Track volunteer activity and find nearby relief camps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] mb-4">
              <MapComponent />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-alert"></div>
                Relief Camps
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                Assigned Volunteers
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-info"></div>
                Your Location
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>
              Your contributions help disaster victims directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-6 text-muted-foreground">
                Donation feature will be available soon. Thank you for your patience.
              </p>
              <Button disabled className="mx-auto">
                <Heart className="mr-2 h-4 w-4" /> Donate Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonorDashboard;
