import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, MapPin, BadgePercent, Users, Route, ArrowRight } from "lucide-react";
import { useApiQuery } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import * as baseCampService from "@/services/baseCampService";
import { Progress } from "@/components/ui/progress";

interface DonorAssignmentsProps {
  onSelectBaseCamp?: (id: string) => void;
}

const DonorAssignments: React.FC<DonorAssignmentsProps> = ({ onSelectBaseCamp }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

  // Fetch base camps
  const { data: baseCamps, isLoading, isError, error } = useApiQuery<baseCampService.BaseCamp[]>(
    'base-camps',
    baseCampService.getAll,
    {
      onError: (err) => {
        toast({
          title: "Error loading base camps",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  );

  // Calculate resource status for each base camp
  const getResourceStatus = (resources: baseCampService.Resource[]) => {
    if (!resources || resources.length === 0) return [];

    // Calculate resource priority based on quantity (lower quantity = higher priority)
    return resources
      .map(resource => {
        let percentage = 100;
        // Determine percentage based on estimated need
        if (resource.name.toLowerCase().includes('water')) {
          percentage = Math.min(100, (resource.quantity / 1000) * 100);
        } else if (resource.name.toLowerCase().includes('food')) {
          percentage = Math.min(100, (resource.quantity / 800) * 100);
        } else if (resource.name.toLowerCase().includes('medical')) {
          percentage = Math.min(100, (resource.quantity / 50) * 100);
        } else if (resource.name.toLowerCase().includes('blanket')) {
          percentage = Math.min(100, (resource.quantity / 300) * 100);
        } else {
          percentage = Math.min(100, (resource.quantity / 100) * 100);
        }

        return {
          ...resource,
          percentage,
          priority: 100 - percentage
        };
      })
      .sort((a, b) => b.priority - a.priority);
  };

  // Get overall status of the base camp based on resources
  const getOverallStatus = (resources: baseCampService.Resource[]) => {
    if (!resources || resources.length === 0) return 50;
    
    const resourceStatuses = getResourceStatus(resources);
    const avgPercentage = resourceStatuses.reduce((acc, curr) => acc + curr.percentage, 0) / resourceStatuses.length;
    return avgPercentage;
  };

  // Format occupation ratio as a percentage
  const getOccupancyPercentage = (occupancy: number, capacity: number) => {
    return Math.round((occupancy / capacity) * 100);
  };

  // Handle selection of a base camp
  const handleSelectBaseCamp = (id: string) => {
    setSelectedCampId(id);
    if (onSelectBaseCamp) {
      onSelectBaseCamp(id);
    } else {
      navigate(`/donor-dashboard/donate?baseCamp=${id}`);
    }
  };

  // Get status indicator based on resource levels
  const getStatusIndicator = (percentage: number) => {
    if (percentage < 30) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (percentage < 60) {
      return <Badge variant="default" className="bg-yellow-500">Low</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Sufficient</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Base Camps Needing Resources
        </CardTitle>
        <CardDescription>
          Select a base camp to donate essential supplies and support disaster relief efforts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center p-4 border rounded-md bg-destructive/10 text-destructive">
            Failed to load base camps. {error instanceof Error ? error.message : "Please try again."}
          </div>
        ) : !baseCamps || baseCamps.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/30">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">No Base Camps Available</h3>
            <p className="text-muted-foreground">
              There are currently no base camps that need resources.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {baseCamps.map(camp => {
              const resourceStatus = getOverallStatus(camp.resources);
              return (
                <div 
                  key={camp.id} 
                  className={`border rounded-md p-4 transition-all ${
                    selectedCampId === camp.id ? 'ring-2 ring-primary' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{camp.name}</h3>
                        {getStatusIndicator(resourceStatus)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {camp.location.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">Occupancy</div>
                        <div className="text-sm text-muted-foreground">
                          {camp.occupancy}/{camp.capacity} ({getOccupancyPercentage(camp.occupancy, camp.capacity)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Resource Status</div>
                      <div className="text-xs text-muted-foreground">{Math.round(resourceStatus)}% Stocked</div>
                    </div>
                    <Progress value={resourceStatus} className="h-2" />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Priority Needs</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {getResourceStatus(camp.resources)
                        .slice(0, 3)
                        .map((resource, index) => (
                          <div 
                            key={index} 
                            className={`text-xs rounded-md px-2 py-1 border ${
                              resource.percentage < 30 
                                ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                                : resource.percentage < 60
                                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                  : 'bg-muted border-muted-foreground/20'
                            }`}
                          >
                            {resource.name}: {Math.round(resource.percentage)}%
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleSelectBaseCamp(camp.id)}
                      className="gap-1"
                    >
                      <span>Donate to this Camp</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Base camps with critical resource needs are highlighted. Your donations can save lives.
      </CardFooter>
    </Card>
  );
};

export default DonorAssignments;
