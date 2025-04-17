import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Radio, Users, AlertTriangle, MapIcon, LogOut, ArrowLeft, RefreshCw, Building2, Archive, Filter, Bell, Activity, UserCog, UserCheck, Phone, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import BaseCampsList from "@/components/BaseCampsList";
import RescueHistory from "@/components/RescueHistory";
import ResponderSOSRequests from "@/components/ResponderSOSRequests";
import ResponderAlertGeneration from "@/components/ResponderAlertGeneration";
import ResponderDonorManagement from "@/components/ResponderDonorManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const ResponderDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("emergency");
  const { toast } = useToast();
  const [deployedTeams, setDeployedTeams] = useState(8);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    
    // Simulate progress change for demonstration
    const timer = setTimeout(() => setProgress(75), 3000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (!user) {
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
    <div className="flex flex-col min-h-screen bg-background/97">
      <Header />
      
      <div className="bg-emergency/10 py-4 border-y border-emergency/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground/90">Response Team Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, <span className="text-emergency font-medium">{user.name}</span></p>
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
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-emergency/30 bg-emergency/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center text-emergency">
                    <AlertTriangle className="h-4 w-4 mr-2" /> Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">Active emergencies</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emergency/20 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-emergency animate-ping opacity-75"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <UserCog className="h-4 w-4 mr-2" /> Response Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold">{deployedTeams}</p>
                      <p className="text-xs text-muted-foreground">Teams deployed</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        setDeployedTeams(prev => prev + 1);
                        toast({
                          title: "Team Deployed",
                          description: "Additional response team has been dispatched."
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2" /> Operation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2">
                      <div 
                        className={progress > 70 ? "bg-success" : "bg-warning"} 
                        style={{ 
                          width: `${progress}%`,
                          height: '100%',
                          borderRadius: 'inherit'
                        }}
                      />
                    </Progress>
                    <p className="text-xs text-muted-foreground">Relief effort in progress</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:w-1/4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" /> Command Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="default" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" /> Emergency Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" /> Broadcast Alert
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" /> Team Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="emergency" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
          <div className="bg-card z-10 sticky top-0 pt-2 border-b shadow-sm">
            <ScrollArea className="max-w-full pb-2">
              <TabsList className="w-full mb-0 h-auto p-1">
                <TabsTrigger value="emergency" className="flex items-center gap-2 py-2 data-[state=active]:bg-emergency/10 data-[state=active]:text-emergency">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Emergency Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="sos" className="flex items-center gap-2 py-2 data-[state=active]:bg-alert/10 data-[state=active]:text-alert">
                  <AlertCircle className="h-4 w-4" />
                  <span>SOS Requests</span>
                </TabsTrigger>
                <TabsTrigger value="camps" className="flex items-center gap-2 py-2">
                  <Building2 className="h-4 w-4" />
                  <span>Base Camps</span>
                </TabsTrigger>
                <TabsTrigger value="donors" className="flex items-center gap-2 py-2">
                  <Users className="h-4 w-4" />
                  <span>Donor Management</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2 py-2">
                  <Archive className="h-4 w-4" />
                  <span>Rescue History</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          
          <TabsContent value="emergency" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-emergency/20">
                <CardHeader className="pb-2 bg-emergency/5 border-b border-emergency/10">
                  <CardTitle className="flex items-center gap-2 text-emergency">
                    <AlertTriangle className="h-5 w-5" /> Emergency Alerts
                  </CardTitle>
                  <CardDescription>Critical situations requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponderAlertGeneration />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" /> Alert Statistics
                  </CardTitle>
                  <CardDescription>Overview of current emergency status</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-emergency/10 rounded-md text-center border border-emergency/20">
                      <div className="text-emergency font-medium text-2xl">2</div>
                      <div className="text-sm text-muted-foreground">Active Critical Alerts</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="border border-border rounded-md p-3 text-center">
                        <div className="text-xl font-bold">{deployedTeams}</div>
                        <div className="text-xs text-muted-foreground">Teams Deployed</div>
                      </div>
                      <div className="border border-border rounded-md p-3 text-center">
                        <div className="text-xl font-bold">3</div>
                        <div className="text-xs text-muted-foreground">Pending Alerts</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("sos")}>
                      <AlertCircle className="h-4 w-4 mr-2" /> View SOS Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" /> Emergency Response Map
                </CardTitle>
                <CardDescription>
                  View current alerts and resources on the map
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
            <ResponderSOSRequests />
          </TabsContent>
          
          <TabsContent value="camps" className="mt-0">
            <BaseCampsList />
          </TabsContent>
          
          <TabsContent value="donors" className="mt-0">
            <ResponderDonorManagement />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <RescueHistory />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResponderDashboard;
