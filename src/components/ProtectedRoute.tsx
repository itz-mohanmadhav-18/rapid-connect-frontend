import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useUser();

  // Show loading state if authentication is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required but user doesn't have it, redirect
  if (role) {
    const requiredRoles = Array.isArray(role) ? role : [role];
    
    if (!requiredRoles.includes(user.role)) {
      // Redirect to the appropriate dashboard based on the user's role
      if (user.role === "donor") {
        return <Navigate to="/donor-dashboard" replace />;
      } else if (user.role === "volunteer") {
        return <Navigate to="/volunteer-dashboard" replace />;
      } else if (user.role === "responder") {
        return <Navigate to="/responder-dashboard" replace />;
      }
      
      // Fallback to home page if role doesn't match any known dashboard
      return <Navigate to="/" replace />;
    }
  }

  // If user is authenticated and has the required role (or no specific role is required),
  // render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;