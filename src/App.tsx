import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DonorDashboard from "./pages/DonorDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import { UserProvider } from "./contexts/UserContext";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Donor routes */}
            <Route path="/donor-dashboard" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor-dashboard/donate" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor-dashboard/donations" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
            
            {/* Volunteer routes */}
            <Route path="/volunteer-dashboard" element={<ProtectedRoute role="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
            
            {/* Responder routes */}
            <Route path="/responder-dashboard" element={<ProtectedRoute role="responder"><ResponderDashboard /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
