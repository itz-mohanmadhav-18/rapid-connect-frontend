
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User } from "lucide-react";
import AuthDialog from "@/components/AuthDialog";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    if (user) {
      // Navigate to appropriate dashboard based on user role
      if (user.role === "donor") {
        navigate("/donor-dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (user.role === "responder") {
        navigate("/responder-dashboard");
      }
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <>
      <header className="bg-info shadow-md py-3">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-emergency mr-2" />
            <h1 className="text-white text-xl font-bold">Rapid Aid Connect</h1>
          </div>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Button variant="secondary" size="sm" onClick={handleProfileClick}>
              <User className="h-4 w-4 mr-1" />
              {user ? user.name : "Login"}
            </Button>
            <span className="text-xs text-white/80">For donors, volunteers & response teams</span>
          </div>
        </div>
      </header>
      
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
};

export default Header;
