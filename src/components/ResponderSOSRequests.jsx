import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Filter, MapPin, Clock, User, CheckCircle, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MapComponent from "@/components/Map";
import * as sosService from "@/services/sosService";
import * as volunteerService from "@/services/volunteerService";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";

const ResponderSOSRequests = () => {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assigningVolunteer, setAssigningVolunteer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { user } = useUser();

  const mockVolunteers = [
    {
      id: "mock-v1",
      name: "Michael Chen",
      available: true,
      location: "SoMa, San Francisco",
      distance: "0.5 miles",
      specialty: ["Medical"]
    },
    {
      id: "mock-v2",
      name: "Lisa Rodriguez",
      available: true,
      location: "Mission District, San Francisco",
      distance: "1.8 miles",
      specialty: ["Search & Rescue"]
    },
    {
      id: "mock-v3",
      name: "James Wilson",
      available: false,
      location: "Tenderloin District, San Francisco",
      distance: "0.7 miles",
      specialty: ["Medical"]
    },
    {
      id: "mock-v4",
      name: "Emily Martinez",
      available: true,
      location: "Richmond District, San Francisco",
      distance: "3.2 miles",
      specialty: ["Supply Distribution"]
    },
    {
      id: "mock-v5",
      name: "Robert Kim",
      available: true,
      location: "North Beach, San Francisco",
      distance: "2.1 miles",
      specialty: ["Evacuation"]
    }
  ];

  useEffect(() => {
    const fetchSOSRequests = async () => {
      setIsLoading(true);
      try {
        const data = await sosService.getAll();

        const formattedRequests = data.map(request => ({
          id: request._id || request.id || "",
          name: request.user?.name || (request.isAnonymous ? "Anonymous" : "Unknown"),
          location: request.location?.address || "Location not specified",
          emergency: request.emergency || "Unknown",
          description: request.description || "",
          timestamp: request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : "Unknown time",
          status: request.status || "pending",
          assignedVolunteer: request.assignedTo?.name,
          originalData: request
        }));

        setRequests(formattedRequests);
        setError(null);
      } catch (err) {
        console.error("Error fetching SOS requests:", err);
        setError("Failed to load SOS requests. Please try again.");
        toast({
          title: "Error loading requests",
          description: err.message || "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchVolunteers = async () => {
      setIsLoadingVolunteers(true);
      try {
        let data = await volunteerService.getAll();

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("No volunteer data from API, falling back to mock data");
          data = mockVolunteers;
        } else {
          data = data.map(volunteer => ({
            id: volunteer._id || volunteer.id,
            name: volunteer.name,
            available: volunteer.available !== false,
            location: volunteer.location?.address || "Location not specified",
            distance: "Unknown distance",
            specialty: volunteer.specialty || ["General"]
          }));
        }

        setVolunteers(data);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
        setVolunteers(mockVolunteers);
        toast({
          title: "Error loading volunteers",
          description: "Using demo volunteer data instead.",
          variant: "default",
        });
      } finally {
        setIsLoadingVolunteers(false);
      }
    };

    fetchSOSRequests();
    fetchVolunteers();

    const intervalId = setInterval(fetchSOSRequests, 30000);

    return () => clearInterval(intervalId);
  }, [toast]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      (req.name && req.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.location && req.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.emergency && req.emergency.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const availableVolunteers = volunteers.filter(vol => vol.available);

  const handleAssignVolunteer = async (requestId, volunteerId) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;

    try {
      const originalRequest = requests.find(req => req.id === requestId);
      if (!originalRequest) return;

      // Fix: Check if user exists and has an id property before using it
      const assignedToId = user && user.id ? user.id : null;
      if (!assignedToId) {
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      await sosService.update(requestId, {
        status: "assigned",
        assignedTo: assignedToId
      });

      if (volunteer.id !== "mock-v1" && volunteer.id !== "mock-v2" && volunteer.id !== "mock-v3" && 
          volunteer.id !== "mock-v4" && volunteer.id !== "mock-v5") {
        try {
          await volunteerService.updateStatus(volunteerId, false);
          await volunteerService.assignToTask(volunteerId, requestId, 'sos');
        } catch (error) {
          console.error("Error updating volunteer status:", error);
        }
      }

      setRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.id === requestId) {
            return {
              ...req,
              status: "assigned",
              assignedVolunteer: user.name
            };
          }
          return req;
        })
      );

      setVolunteers(prevVolunteers =>
        prevVolunteers.map(vol => {
          if (vol.id === volunteerId) {
            return { ...vol, available: false };
          }
          return vol;
        })
      );

      setAssigningVolunteer(null);

      toast({
        title: "SOS Request Assigned",
        description: `You have been assigned to this emergency.`,
      });
    } catch (error) {
      toast({
        title: "Failed to assign request",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleResolveRequest = async (requestId) => {
    try {
      await sosService.update(requestId, {
        status: "resolved",
        resolvedAt: new Date().toISOString()
      });

      const resolvedRequest = requests.find(req => req.id === requestId);
      if (resolvedRequest && resolvedRequest.originalData.assignedTo) {
        try {
          await volunteerService.updateStatus(resolvedRequest.originalData.assignedTo._id, true);
        } catch (error) {
          console.error("Error updating volunteer status:", error);
        }
      }

      setRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.id === requestId) {
            return { ...req, status: "resolved" };
          }
          return req;
        })
      );

      toast({
        title: "Emergency Resolved",
        description: "The SOS request has been marked as resolved.",
      });
    } catch (error) {
      toast({
        title: "Failed to resolve request",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-emergency text-emergency-foreground";
      case "assigned": return "bg-info text-info-foreground";
      case "resolved": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-emergency" /> SOS Request Management
          </CardTitle>
          <CardDescription>
            View, assign volunteers, and manage emergency SOS requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              {error}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No SOS requests matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map(request => (
                    <TableRow key={request.id} className={selectedRequest?.id === request.id ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {request.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{request.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          request.emergency === "Medical" ? "bg-emergency/10 text-emergency border-emergency/20" :
                          request.emergency === "Trapped" ? "bg-alert/10 text-alert border-alert/20" :
                          request.emergency === "Supplies" ? "bg-info/10 text-info border-info/20" :
                          request.emergency === "Evacuation" ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-muted"
                        }>
                          {request.emergency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          {request.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === "pending" && "Pending"}
                          {request.status === "assigned" && "Assigned"}
                          {request.status === "resolved" && "Resolved"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {request.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setAssigningVolunteer(request.id);
                                }}
                                disabled={availableVolunteers.length === 0}
                              >
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                Assign
                              </Button>
                            </>
                          )}
                          {request.status === "assigned" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleResolveRequest(request.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                              Resolve
                            </Button>
                          )}
                          {request.status === "resolved" && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setSelectedRequest(request)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && assigningVolunteer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assign Volunteer to {selectedRequest.name}</CardTitle>
            <CardDescription>Select an available volunteer to respond to this emergency</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingVolunteers ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading volunteers...</p>
              </div>
            ) : availableVolunteers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No volunteers are currently available. Try again later.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  <span className="font-medium">Emergency:</span> {selectedRequest.emergency} - {selectedRequest.description}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span> {selectedRequest.location}
                </p>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableVolunteers.map(volunteer => (
                        <TableRow key={volunteer.id}>
                          <TableCell>{volunteer.name}</TableCell>
                          <TableCell>{volunteer.location}</TableCell>
                          <TableCell>{volunteer.distance}</TableCell>
                          <TableCell>
                            {Array.isArray(volunteer.specialty) ? (
                              volunteer.specialty.map((spec, idx) => (
                                <Badge key={idx} variant="outline" className="bg-muted/50 mr-1">
                                  {spec}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="bg-muted/50">
                                {volunteer.specialty || "General"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm"
                              onClick={() => handleAssignVolunteer(selectedRequest.id, volunteer.id)}
                            >
                              Assign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setAssigningVolunteer(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {selectedRequest && !assigningVolunteer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Details</CardTitle>
            <CardDescription>Details about the selected emergency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Requester</p>
                  <p className="text-muted-foreground">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Emergency Type</p>
                  <Badge className={
                    selectedRequest.emergency === "Medical" ? "bg-emergency/10 text-emergency border-emergency/20" :
                    selectedRequest.emergency === "Trapped" ? "bg-alert/10 text-alert border-alert/20" :
                    selectedRequest.emergency === "Supplies" ? "bg-info/10 text-info border-info/20" :
                    selectedRequest.emergency === "Evacuation" ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-muted"
                  }>
                    {selectedRequest.emergency}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-muted-foreground">{selectedRequest.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reported</p>
                  <p className="text-muted-foreground">{selectedRequest.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status === "pending" && "Pending"}
                    {selectedRequest.status === "assigned" && "Assigned"}
                    {selectedRequest.status === "resolved" && "Resolved"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-muted-foreground">
                    {selectedRequest.assignedVolunteer || "Not assigned"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">{selectedRequest.description}</p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
          <CardDescription>View SOS requests on the map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <MapComponent />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponderSOSRequests;
