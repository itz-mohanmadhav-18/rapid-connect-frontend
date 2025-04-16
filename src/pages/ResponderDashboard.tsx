import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Radio, Users, AlertTriangle, Map as MapIcon, LogOut, ArrowLeft, RefreshCw, Building2, Archive, Filter, Bell } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import BaseCampsList from "@/components/BaseCampsList";
import RescueHistory from "@/components/RescueHistory";
import ResponderSOSRequests from "@/components/ResponderSOSRequests";
import ResponderAlertGeneration from "@/components/ResponderAlertGeneration";
import ResponderDonorManagement from "@/components/ResponderDonorManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResponderDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("emergency");

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
      
      <div className="bg-emergency/10 py-4 border-y border-emergency/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Response Team Dashboard</h1>
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
        <Tabs defaultValue="emergency" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="emergency" className="flex-grow">
              <AlertTriangle className="h-4 w-4 mr-2" /> Emergency Alerts
            </TabsTrigger>
            <TabsTrigger value="sos" className="flex-grow">
              <AlertCircle className="h-4 w-4 mr-2" /> SOS Requests
            </TabsTrigger>
            <TabsTrigger value="camps" className="flex-grow">
              <Building2 className="h-4 w-4 mr-2" /> Base Camps
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex-grow">
              <Users className="h-4 w-4 mr-2" /> Donor Management
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-grow">
              <Archive className="h-4 w-4 mr-2" /> Rescue History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emergency">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2 bg-emergency/10">
                  <CardTitle className="flex items-center gap-2 text-emergency">
                    <AlertCircle className="h-5 w-5" /> Emergency Alerts
                  </CardTitle>
                  <CardDescription>Critical situations requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponderAlertGeneration />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" /> Alert Statistics
                  </CardTitle>
                  <CardDescription>Overview of current emergency status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-emergency/10 rounded-md text-center">
                      <div className="text-emergency font-medium text-2xl">2</div>
                      <div className="text-sm text-muted-foreground">Active Critical Alerts</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="border border-border rounded-md p-3 text-center">
                        <div className="text-xl font-bold">8</div>
                        <div className="text-xs text-muted-foreground">Teams Deployed</div>
                      </div>
                      <div className="border border-border rounded-md p-3 text-center">
                        <div className="text-xl font-bold">3</div>
                        <div className="text-xs text-muted-foreground">Pending Alerts</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" /> Refresh Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" /> Emergency Response Map
                </CardTitle>
                <CardDescription>
                  View current alerts and resources on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MapComponent />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sos">
            <ResponderSOSRequests />
          </TabsContent>
          
          <TabsContent value="camps">
            <BaseCampsList />
          </TabsContent>
          
          <TabsContent value="donors">
            <ResponderDonorManagement />
          </TabsContent>
          
          <TabsContent value="history">
            <RescueHistory />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResponderDashboard;
