import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Heart, DollarSign, RefreshCw, LogOut, ArrowLeft, Gift, History, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import DonationForm from "@/components/DonationForm";
import DonationsList from "@/components/DonationsList";
import DonorAssignments from "@/components/DonorAssignments";
import { useApiQuery } from "@/hooks/use-api";
import * as donationService from "@/services/donationService";

const DonorDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const baseCampIdParam = queryParams.get('baseCamp');

  // Check if we're in donation mode
  const isDonationMode = location.pathname.includes('/donate');

  // Get donation statistics
  const { data: donations } = useApiQuery<donationService.Donation[]>(
    'donor-donations',
    donationService.getAll,
    {
      enabled: !!user,
      onError: () => {}
    }
  );

  // Calculate donation statistics
  const donationStats = {
    total: donations?.length || 0,
    pending: donations?.filter(d => d.status === 'pending').length || 0,
    delivered: donations?.filter(d => d.status === 'delivered').length || 0,
    totalItems: donations?.reduce((sum, donation) => {
      return sum + donation.resources.reduce((itemSum, resource) => itemSum + resource.quantity, 0);
    }, 0) || 0
  };

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDonationSuccess = () => {
    navigate("/donor-dashboard/donations");
    setActiveTab("donations");
  };

  const handleSelectBaseCamp = (id: string) => {
    navigate(`/donor-dashboard/donate?baseCamp=${id}`);
  };

  if (isDonationMode) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="bg-primary/10 py-4 border-y border-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Make a Donation</h1>
                <p className="text-muted-foreground">Schedule resources for delivery to relief camps</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/donor-dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <DonationForm onSuccess={handleDonationSuccess} />
        </main>
        
        <Footer />
      </div>
    );
  }

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
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="donate">
              <Heart className="h-4 w-4 mr-2" /> Donate Resources
            </TabsTrigger>
            <TabsTrigger value="donations">
              <Gift className="h-4 w-4 mr-2" /> My Donations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
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
                      <span>Total Donations:</span>
                      <span className="font-bold">{donationStats.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivered:</span>
                      <span className="font-bold">{donationStats.delivered}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Items Donated:</span>
                      <span className="font-bold">{donationStats.totalItems} items</span>
                    </div>
                    <Button className="w-full" onClick={() => setActiveTab("donate")}>
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
                      <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 p-1 rounded inline-block">High Need</div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-md">
                      <div className="font-medium">Wildfire</div>
                      <div className="text-sm text-muted-foreground">Northern California</div>
                      <div className="mt-2 text-xs bg-red-100 text-red-800 p-1 rounded inline-block">Critical Need</div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("donate")}>
                      Support Relief Efforts
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" /> Donation Status
                  </CardTitle>
                  <CardDescription>Track your recent contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm items-center">
                      <span>Pending deliveries:</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        {donationStats.pending}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm items-center">
                      <span>Delivered donations:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {donationStats.delivered}
                      </Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("donations")}>
                      <History className="h-4 w-4 mr-2" />
                      View Donation History
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
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Relief Camps
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Assigned Volunteers
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Your Location
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donate">
            <div className="grid gap-6">
              <DonorAssignments onSelectBaseCamp={handleSelectBaseCamp} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Make a Direct Donation</CardTitle>
                  <CardDescription>
                    Create a new donation without selecting a specific base camp first
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button className="w-full max-w-md" onClick={() => navigate("/donor-dashboard/donate")}>
                    <Heart className="mr-2 h-4 w-4" /> Create New Donation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="donations">
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle>My Donations</CardTitle>
                      <CardDescription>Track and manage your contributions</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/donor-dashboard/donate")}>
                      <Heart className="mr-2 h-4 w-4" /> New Donation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <DonationsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonorDashboard;
