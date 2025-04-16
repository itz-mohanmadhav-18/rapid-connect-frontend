
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Bell, CheckCircle2, Clock, MapPin, Users, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    area: "",
    severity: "medium",
  });
  const { toast } = useToast();

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.description || !newAlert.area) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const alert = {
      id: `alert-${Date.now()}`,
      title: newAlert.title,
      description: newAlert.description,
      area: newAlert.area,
      severity: newAlert.severity, // Fixed: This is now one of the allowed values
      status: "active",
      timestamp: "Just now",
      affectedUsers: 0,
    };

    setAlerts([alert, ...alerts]);
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
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        if (alert.id === alertId) {
          return { ...alert, status: "resolved" };
        }
        return alert;
      })
    );

    toast({
      title: "Alert Resolved",
      description: "Users will be notified that the emergency has been resolved.",
    });
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
                placeholder="E.g., Downtown San Francisco"
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
              key={alert.id} 
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
                      {alert.timestamp}
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
                      onClick={() => handleResolveAlert(alert.id)}
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
