import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Bell, CheckCircle2, Clock, MapPin, Users, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { getAuthToken } from "@/lib/api-config";
import apiConfig from "@/lib/api-config";

const API_URL = apiConfig.API_URL;

// Keeping the mock alerts as fallback if the API fails
const mockAlerts = [
  {
    id: "alert1",
    title: "URGENT: Flooding in Downtown Area",
    description: "Rising water levels have trapped residents in the northern downtown sector. Immediate evacuation assistance needed.",
    area: "Downtown San Francisco",
    severity: "critical",
    status: "active",
    timestamp: "Today, 10:22 AM",
    affectedUsers: 2500
  },
  {
    id: "alert2",
    title: "WARNING: Wildfire Approaching Western Region",
    description: "Wildfire predicted to reach residential areas within 12 hours. Evacuation planning required.",
    area: "Western San Francisco",
    severity: "high",
    status: "active",
    timestamp: "Today, 09:15 AM",
    affectedUsers: 1800
  },
  {
    id: "alert3",
    title: "Power Outage in Southern District",
    description: "Expected to last 4-6 hours. Affected areas include Marina and parts of Mission District.",
    area: "Southern San Francisco",
    severity: "medium",
    status: "resolved",
    timestamp: "Yesterday, 08:30 PM",
    affectedUsers: 5000
  }
];

const ResponderAlertGeneration = () => {
  const [alerts, setAlerts] = useState([]);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    area: "",
    severity: "medium",
  });
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  // Fetch alerts from the backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken(); // Use the helper function from api-config
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await axios.get(`${API_URL}/alerts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.success) {
          console.log("Alerts loaded from API:", response.data.data);
          setAlerts(response.data.data);
        } else {
          throw new Error('Failed to fetch alerts');
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError(err.message);
        // Fall back to mock data if API fails
        setAlerts(mockAlerts);
        toast({
          title: "Warning",
          description: "Using sample data due to connection issues.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [toast]);

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.description || !newAlert.area) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = getAuthToken(); // Use the helper function from api-config
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare alert data with estimated affected users
      const alertData = {
        title: newAlert.title,
        description: newAlert.description,
        area: newAlert.area,
        severity: newAlert.severity,
        status: "active",
        affectedUsers: Math.floor(Math.random() * 1000) + 100, // Random number for demo
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041], // Default coordinates (can be improved)
          address: newAlert.area
        }
      };

      // Send alert to backend
      const response = await axios.post(
        `${API_URL}/alerts`, 
        alertData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.success) {
        const createdAlert = response.data.data;
        
        // Add to local state
        setAlerts(prevAlerts => [createdAlert, ...prevAlerts]);
        
        // Reset form
        setIsCreatingAlert(false);
        setNewAlert({
          title: "",
          description: "",
          area: "",
          severity: "medium",
        });
        
        toast({
          title: "Alert Created",
          description: "Emergency alert has been broadcast to all users in the affected area.",
        });
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (err) {
      console.error("Error creating alert:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const token = getAuthToken(); // Use the helper function from api-config
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Update alert status in backend
      const response = await axios.put(
        `${API_URL}/alerts/${alertId}`,
        { status: 'resolved' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Update alert in local state
        setAlerts(prevAlerts => 
          prevAlerts.map(alert => {
            if (alert._id === alertId) {
              return { ...alert, status: "resolved" };
            }
            return alert;
          })
        );
        
        toast({
          title: "Alert Resolved",
          description: "Users will be notified that the emergency has been resolved.",
        });
      } else {
        throw new Error('Failed to resolve alert');
      }
    } catch (err) {
      console.error("Error resolving alert:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to resolve alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-emergency text-emergency-foreground";
      case "high": return "bg-alert text-alert-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffHours = Math.round((now - date) / (1000 * 60 * 60));
      
      if (diffHours < 24) {
        if (diffHours < 1) return "Just now";
        return `${diffHours} hours ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (err) {
      return dateString || "Unknown";
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      {isCreatingAlert ? (
        <div className="border border-dashed border-border p-4 rounded-lg bg-background">
          <h3 className="text-lg font-medium mb-4">Create New Alert</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="alert-title">Alert Title</Label>
              <Input 
                id="alert-title" 
                placeholder="E.g., Urgent: Flooding in Downtown Area"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="alert-area">Affected Area</Label>
              <Input 
                id="alert-area" 
                placeholder="E.g., Downtown Delhi"
                value={newAlert.area}
                onChange={(e) => setNewAlert({...newAlert, area: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="alert-severity">Severity Level</Label>
              <Select 
                value={newAlert.severity} 
                onValueChange={(value) => setNewAlert({...newAlert, severity: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - Life threatening</SelectItem>
                  <SelectItem value="high">High - Immediate action needed</SelectItem>
                  <SelectItem value="medium">Medium - Caution advised</SelectItem>
                  <SelectItem value="low">Low - Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="alert-description">Alert Description</Label>
              <Textarea 
                id="alert-description" 
                placeholder="Provide detailed information about the emergency..."
                className="min-h-[100px]"
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>
                <Bell className="h-4 w-4 mr-1.5" /> Broadcast Alert
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Active Emergency Alerts</h3>
            <p className="text-sm text-muted-foreground">Manage and create emergency alerts for affected areas</p>
          </div>
          <Button onClick={() => setIsCreatingAlert(true)}>
            <Bell className="h-4 w-4 mr-1.5" /> New Alert
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active alerts at this time.
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert._id || alert.id} 
              className={`p-4 border rounded-md ${
                alert.status === "active" 
                  ? alert.severity === "critical" 
                    ? "border-emergency bg-emergency/5"
                    : "border-border" 
                  : "border-muted bg-muted/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === "critical" && <AlertTriangle className="h-5 w-5 text-emergency" />}
                    <h4 className={`font-medium ${alert.status === "resolved" ? "text-muted-foreground" : ""}`}>
                      {alert.title}
                    </h4>
                  </div>
                  
                  <p className={`text-sm ${alert.status === "resolved" ? "text-muted-foreground" : ""}`}>
                    {alert.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {alert.area}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {alert.affectedUsers.toLocaleString()} affected
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {alert.timestamp || formatDate(alert.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={
                      alert.status === "active" ? "border-success/30 text-success" : 
                      alert.status === "resolved" ? "border-muted-foreground text-muted-foreground" :
                      "border-warning text-warning"
                    }>
                      {alert.status === "active" && <span className="mr-1.5">●</span>}
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {alert.status === "active" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleResolveAlert(alert._id || alert.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponderAlertGeneration;
