import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, Building2, PackageCheck, CircleAlert, ArrowUpRight, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import * as donationService from "@/services/donationService";
import { formatDistanceToNow } from "date-fns";

const DonationsList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: donations, isLoading, isError, error, refetch } = useApiQuery<donationService.Donation[]>(
    'donor-donations',
    donationService.getAll,
    {
      onError: (err) => {
        toast({
          title: "Error loading donations",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  );

  const cancelDonation = useApiMutation<any, string>(
    async (id) => {
      return await donationService.update(id, { status: 'cancelled' });
    },
    {
      onSuccess: () => {
        toast({
          title: "Donation cancelled",
          description: "Your donation has been cancelled",
        });
        refetch();
      },
      onError: (err) => {
        toast({
          title: "Error cancelling donation",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  );

  const handleCancelDonation = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this donation?")) {
      cancelDonation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'in-transit':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDateRelative = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Filter donations based on status
  const filteredDonations = donations?.filter(donation => 
    statusFilter === "all" || donation.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 border rounded-md bg-destructive/10 text-destructive">
        Failed to load donations. {error instanceof Error ? error.message : "Please try again."}
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <PackageCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-1">No Donations Yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't made any donations yet. Start contributing to disaster relief efforts.
        </p>
        <Button onClick={() => navigate("/donor-dashboard/donate")}>
          Make a Donation
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Your Donations</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredDonations?.length === 0 ? (
          <div className="text-center p-4 border rounded-md bg-muted/30">
            No donations matching the selected filter.
          </div>
        ) : (
          filteredDonations?.map((donation) => (
            <Card key={donation.id} className="overflow-hidden">
              <div className={`h-2 w-full ${
                donation.status === 'pending' ? 'bg-yellow-400' :
                donation.status === 'in-transit' ? 'bg-blue-400' :
                donation.status === 'delivered' ? 'bg-green-400' :
                'bg-red-400'
              }`}></div>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        {donation.donationType === 'cash' ? (
                          <Coins className="h-4 w-4 text-primary" />
                        ) : (
                          <PackageCheck className="h-4 w-4 text-primary" />
                        )}
                        <h4 className="font-medium text-base">
                          {donation.donationType === 'cash' 
                            ? `Cash Donation - ₹${donation.amount}`
                            : `Resource Donation - ${donation.resources.reduce((sum, r) => sum + r.quantity, 0)} items`
                          }
                        </h4>
                      </div>
                      <div>
                        {getStatusBadge(donation.status)}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      {donation.donationType === 'cash' ? (
                        <p className="text-sm text-muted-foreground">
                          Your cash donation will be used to purchase essential supplies for disaster relief
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {donation.resources.map((resource, index) => (
                            <Badge key={index} variant="outline" className="bg-muted/30">
                              {resource.quantity} {resource.unit} of {resource.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 mr-1.5" />
                        {donation.baseCamp?.name || "Unknown Base Camp"}
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {donation.status === 'delivered' 
                          ? `Delivered ${formatDateRelative(donation.deliveredDate || donation.scheduledDate)}`
                          : `Scheduled ${formatDateRelative(donation.scheduledDate)}`
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col sm:justify-between gap-2">
                    {donation.status === 'pending' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleCancelDonation(donation.id)}
                        disabled={cancelDonation.isPending}
                      >
                        {cancelDonation.isPending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <CircleAlert className="h-3.5 w-3.5 mr-1.5" />
                            <span>Cancel</span>
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => alert("Donation details functionality is coming soon.")}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
                      <span>Details</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DonationsList;