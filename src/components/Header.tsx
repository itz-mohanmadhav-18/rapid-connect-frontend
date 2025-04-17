import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Menu, X, ChevronDown, Bell } from "lucide-react";
import AuthDialog from "@/components/AuthDialog";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="bg-primary shadow-elevation-1 py-3 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer transition-transform hover:scale-105" 
              onClick={() => navigate("/")}
            >
              <div className="bg-white/10 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-emergency" />
              </div>
              <div>
                <h1 className="text-white text-xl font-display font-bold leading-none">
                  Rapid Aid
                </h1>
                <p className="text-white/70 text-xs">Disaster Response System</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav>
                <ul className="flex space-x-6 text-white/90">
                  <li className="hover:text-white transition-colors">
                    <a href="/" className="text-sm font-medium">Home</a>
                  </li>
                  <li className="hover:text-white transition-colors">
                    <a href="#services" className="text-sm font-medium">Services</a>
                  </li>
                  <li className="hover:text-white transition-colors">
                    <a href="#emergency" className="text-sm font-medium">Emergency</a>
                  </li>
                  <li className="hover:text-white transition-colors">
                    <a href="#contact" className="text-sm font-medium">Contact</a>
                  </li>
                </ul>
              </nav>
              
              <div className="flex items-center gap-2">
                {user && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white/90 hover:text-white hover:bg-white/10 relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emergency text-[10px] text-white font-medium">
                      2
                    </span>
                  </Button>
                )}
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20"
                      >
                        <User className="h-4 w-4" />
                        <span className="font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <span className="capitalize">{user.role}</span> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setIsAuthDialogOpen(true)}
                    className="font-medium shadow-sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 animate-in slide-in-from-top-5 duration-200">
              <nav className="mb-4">
                <ul className="space-y-3 text-white/90">
                  <li className="hover:text-white">
                    <a href="/" className="block py-1">Home</a>
                  </li>
                  <li className="hover:text-white">
                    <a href="#services" className="block py-1">Services</a>
                  </li>
                  <li className="hover:text-white">
                    <a href="#emergency" className="block py-1">Emergency</a>
                  </li>
                  <li className="hover:text-white">
                    <a href="#contact" className="block py-1">Contact</a>
                  </li>
                </ul>
              </nav>
              
              {user ? (
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
                    onClick={handleProfileClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Dashboard
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="font-medium w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login / Register
                </Button>
              )}
              
              {user && (
                <div className="mt-3 px-3 py-3 bg-white/10 rounded-md text-white/80 text-sm">
                  <div className="flex justify-between items-center">
                    <p>Logged in as <span className="font-medium text-white capitalize">{user.role}</span></p>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">Active</Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
};

export default Header;
