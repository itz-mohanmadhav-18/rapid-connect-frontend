import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/Map";
import SOSButton from "@/components/SOSButton";
import BaseCampManagement from "@/components/BaseCampManagement";
import SOSRequests from "@/components/SOSRequests";
import AlertGeneration from "@/components/AlertGeneration";
import DonorAssignments from "@/components/DonorAssignments";

const VolunteerDashboard: React.FC = () => {
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
      
      <div className="bg-success/10 py-4 border-y border-success/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
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
        <div className="mb-6">
          <SOSButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BaseCampManagement />
          <SOSRequests />
        </div>
        
        <Card className="mb-8 p-4">
          <h2 className="text-xl font-semibold mb-4">Emergency Response Map</h2>
          <MapComponent />
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AlertGeneration />
          <DonorAssignments />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
