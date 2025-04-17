import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogOut, ArrowLeft, MapPin, AlertCircle, Package, Users, Wrench, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import SOSButton from "@/components/SOSButton";
import BaseCampManagement from "@/components/BaseCampManagement";
import SOSRequests from "@/components/SOSRequests";
import AlertGeneration from "@/components/AlertGeneration";
import DonorAssignments from "@/components/DonorAssignments";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const VolunteerDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background/95">
      <Header />
      
      <div className="bg-success/10 py-4 border-y border-success/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground/90">Volunteer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, <span className="text-success font-medium">{user.name}</span></p>
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
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-success/30 bg-success/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center text-success">
                    <Users className="h-4 w-4 mr-2" /> Active Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">On Duty</p>
                      <p className="text-xs text-muted-foreground">Since 08:00 AM</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-success/80 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" /> Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">Relief Camp Alpha</p>
                      <p className="text-xs text-muted-foreground">Downtown San Francisco</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" /> Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">5 Tasks Completed</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-4">
              <SOSButton />
            </div>
            
            <Tabs defaultValue="basecamp" className="space-y-4">
              <TabsList className="grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="basecamp" className="flex items-center gap-2 py-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Base Camp</span>
                </TabsTrigger>
                <TabsTrigger value="sos" className="flex items-center gap-2 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">SOS Requests</span>
                </TabsTrigger>
                <TabsTrigger value="donors" className="flex items-center gap-2 py-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Donor Assignments</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basecamp">
                <BaseCampManagement />
              </TabsContent>
              
              <TabsContent value="sos">
                <SOSRequests />
              </TabsContent>
              
              <TabsContent value="donors">
                <DonorAssignments />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" /> Area Map
                </CardTitle>
                <CardDescription>
                  View emergency locations and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] rounded-b-md overflow-hidden">
                  <MapComponent />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-primary" /> Quick Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="justify-start h-12">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </Button>
                <Button variant="outline" size="sm" className="justify-start h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Team Chat
                </Button>
                <Button variant="outline" size="sm" className="justify-start h-12">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" size="sm" className="justify-start h-12">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Resources
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" /> Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertGeneration />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
