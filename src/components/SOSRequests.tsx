import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, MapPin, User, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import * as sosService from "@/services/sosService";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";

interface FormattedSOSRequest {
  id: string;
  name: string;
  location: string;
  emergency: string;
  timestamp: string;
  distance?: string;
  status: "pending" | "assigned" | "resolved";
  description: string;
  originalData: sosService.SOSRequest;
}

const SOSRequests: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  
  // Fetch SOS requests from the API
  const { data, isLoading, isError, error, refetch } = useApiQuery<sosService.SOSRequest[]>(
    'sos-requests',
    sosService.getAll,
    {
      // Refresh data every 30 seconds
      refetchInterval: 30000,
      // Don't refetch on window focus to reduce API calls
      refetchOnWindowFocus: false,
      // Handle errors
      onError: (err) => {
        toast({
          title: "Error loading emergency requests",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  );
  
  // Update SOS request mutation
  const updateRequestMutation = useApiMutation<
    sosService.SOSRequest, 
    { id: string; updateData: Partial<sosService.SOSRequest> }
  >(
    async ({ id, updateData }) => await sosService.update(id, updateData),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (err) => {
        toast({
          title: "Failed to update request",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  );

  // Format the SOS requests for display
  const formatRequests = (requests: sosService.SOSRequest[]): FormattedSOSRequest[] => {
    if (!requests || !Array.isArray(requests)) {
      console.error("Invalid SOS requests data:", requests);
      return [];
    }
    
    return requests.map(request => ({
      id: request._id || request.id || "",
      name: request.user?.name || "Unknown",
      location: request.location?.address || "Location not specified",
      emergency: request.emergency || "Unknown",
      description: request.description || "",
      timestamp: request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : "Unknown time",
      status: (request.status as "pending" | "assigned" | "resolved") || "pending",
      originalData: request
    }));
  };

  // Handle assigning or resolving a request
  const handleRequestAction = (requestId: string, action: "assign" | "resolve") => {
    const updateData: Partial<sosService.SOSRequest> = {
      status: action === "assign" ? "assigned" : "resolved"
    };
    
    // If resolving, add resolved timestamp
    if (action === "resolve") {
      updateData.resolvedAt = new Date().toISOString();
    }
    
    updateRequestMutation.mutate({ id: requestId, updateData });

    const message = action === "assign" 
      ? "You've been assigned to this emergency. Please proceed to the location."
      : "Emergency has been marked as resolved. Thank you for your help.";
      
    toast({
      title: action === "assign" ? "Emergency Assigned" : "Emergency Resolved",
      description: message,
    });
  };

  // Format and filter requests based on user's role
  const formattedRequests = data ? formatRequests(data) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-emergency" /> Emergency SOS Requests
        </CardTitle>
        <CardDescription>
          View and respond to nearby emergency requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-destructive">
            Error loading requests: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        ) : formattedRequests.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No emergency requests at this time
          </div>
        ) : (
          <div className="space-y-4">
            {formattedRequests.map(request => (
              <div key={request.id} className="border rounded-md p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{request.name}</span>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{request.timestamp} {request.distance && `• ${request.distance}`}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>{request.description}</p>
                      </div>
                    </div>
                  </div>

                  <Badge 
                    className={
                      request.status === "pending" 
                        ? "bg-emergency" 
                        : request.status === "assigned" 
                          ? "bg-info" 
                          : "bg-success"
                    }
                  >
                    {request.emergency}
                  </Badge>
                </div>
                
                <div className="flex mt-3 space-x-2 justify-end">
                  {user?.role === "responder" && (
                    <>
                      {request.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleRequestAction(request.id, "assign")}
                          disabled={updateRequestMutation.isPending}
                        >
                          {updateRequestMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </>
                          ) : (
                            "Respond to Emergency"
                          )}
                        </Button>
                      )}
                      {request.status === "assigned" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRequestAction(request.id, "resolve")}
                          disabled={updateRequestMutation.isPending}
                        >
                          {updateRequestMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" /> Mark as Resolved
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                  {request.status === "resolved" && (
                    <span className="text-sm text-success flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SOSRequests;
