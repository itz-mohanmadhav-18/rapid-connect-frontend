import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, ArrowLeft, MapPin, AlertTriangle, Shield, FileText, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import SOSButton from "@/components/SOSButton";
import BaseCampManagement from "@/components/BaseCampManagement";
import SOSRequests from "@/components/SOSRequests";
import AlertGeneration from "@/components/AlertGeneration";
import DonorAssignments from "@/components/DonorAssignments";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VolunteerDashboard = () => {
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
    <div className="flex flex-col min-h-screen bg-background/97">
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
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <SOSButton className="w-full" />
          </div>
          <Card className="border-success/20 bg-success/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center text-success">
                <Shield className="h-4 w-4 mr-2" /> Volunteer Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="bg-success/20 text-success border-success/20">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    Downtown Area
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Since:</span>
                  <span className="text-sm font-medium">3h 45m</span>
                </div>
                <Separator className="my-2" />
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Update Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="tasks" className="space-y-6">
          <div className="bg-card z-10 sticky top-0 pt-2 border-b shadow-sm">
            <ScrollArea className="max-w-full pb-2">
              <TabsList className="w-full h-auto p-1">
                <TabsTrigger value="tasks" className="flex items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  <span>My Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="sos" className="flex items-center gap-2 py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>SOS Requests</span>
                </TabsTrigger>
                <TabsTrigger value="basecamp" className="flex items-center gap-2 py-2">
                  <MapPin className="h-4 w-4" />
                  <span>Base Camp</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2 py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Alerts</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          
          <TabsContent value="tasks" className="space-y-6 mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Active Assignments
                  </div>
                  <Badge className="ml-2">3 Tasks</Badge>
                </CardTitle>
                <CardDescription>
                  Your current tasks and donor assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonorAssignments />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle>Emergency Response Map</CardTitle>
                <CardDescription>
                  View live location of emergency resources and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <MapComponent />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sos" className="mt-0">
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-emergency" />
                  SOS Requests
                </CardTitle>
                <CardDescription>
                  Emergency assistance requests in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SOSRequests />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="basecamp" className="mt-0">
            <BaseCampManagement />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-emergency" />
                  Alert Generation
                </CardTitle>
                <CardDescription>
                  Create and manage emergency alerts for your area
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AlertGeneration />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
