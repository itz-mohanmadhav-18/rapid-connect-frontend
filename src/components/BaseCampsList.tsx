import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Users, MapPin, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MapComponent from "@/components/Map";

interface BaseCamp {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  resources: { food: number, water: number, medical: number, shelter: number };
  volunteersAssigned: { count: number, names: string[] };
  status: "operational" | "limited" | "critical";
}

const mockBaseCamps: BaseCamp[] = [
  {
    id: "camp1",
    name: "Relief Camp Alpha",
    location: "Downtown San Francisco",
    capacity: 500,
    occupancy: 320,
    resources: { food: 75, water: 85, medical: 60, shelter: 90 },
    volunteersAssigned: { 
      count: 15, 
      names: ["John Smith", "Maria Garcia", "Alex Wong", "Sarah Johnson", "Michael Chen"] 
    },
    status: "operational"
  },
  {
    id: "camp2",
    name: "Medical Station Beta",
    location: "Mission District, San Francisco",
    capacity: 300,
    occupancy: 275,
    resources: { food: 45, water: 60, medical: 90, shelter: 40 },
    volunteersAssigned: { 
      count: 22, 
      names: ["David Rodriguez", "Lisa Lee", "Robert Kim", "Emily Martinez", "James Wilson"] 
    },
    status: "limited"
  },
  {
    id: "camp3",
    name: "Temporary Shelter Gamma",
    location: "SoMa, San Francisco",
    capacity: 450,
    occupancy: 420,
    resources: { food: 25, water: 30, medical: 20, shelter: 70 },
    volunteersAssigned: { 
      count: 10, 
      names: ["Jennifer Park", "Daniel Brown", "Sophia Torres", "Kevin Moore", "Olivia Wright"] 
    },
    status: "critical"
  },
  {
    id: "camp4",
    name: "Supply Center Delta",
    location: "North Beach, San Francisco",
    capacity: 200,
    occupancy: 150,
    resources: { food: 90, water: 95, medical: 40, shelter: 50 },
    volunteersAssigned: { 
      count: 8, 
      names: ["Thomas Nelson", "Jessica Adams", "Christopher Hill", "Amanda Scott", "Ryan Young"] 
    },
    status: "operational"
  }
];

const BaseCampsList: React.FC = () => {
  const [camps, setCamps] = useState<BaseCamp[]>(mockBaseCamps);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCamp, setExpandedCamp] = useState<string | null>(null);

  const filteredCamps = camps.filter(camp => 
    camp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    camp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCampDetails = (campId: string) => {
    setExpandedCamp(expandedCamp === campId ? null : campId);
  };

  const getStatusColor = (status: BaseCamp["status"]) => {
    switch (status) {
      case "operational": return "bg-success text-success-foreground";
      case "limited": return "bg-info text-info-foreground";
      case "critical": return "bg-emergency text-emergency-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getResourceStatusColor = (percentage: number) => {
    if (percentage >= 70) return "bg-success";
    if (percentage >= 40) return "bg-info";
    return "bg-emergency";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Building2 className="mr-2 h-6 w-6" /> Base Camps
        </h2>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search camps..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredCamps.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No base camps found. Try a different search term.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCamps.map(camp => (
            <Card key={camp.id} className={`transition-all ${expandedCamp === camp.id ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{camp.name}</CardTitle>
                  <Badge className={getStatusColor(camp.status)}>
                    {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {camp.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Occupancy</div>
                      <div className="text-sm text-muted-foreground">
                        {camp.occupancy} / {camp.capacity} ({Math.round(camp.occupancy / camp.capacity * 100)}%)
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium flex items-center justify-end">
                        <Users className="h-4 w-4 mr-1" /> Volunteers
                      </div>
                      <div className="text-sm text-muted-foreground">{camp.volunteersAssigned.count} assigned</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Resources Status</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1.5 rounded bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getResourceStatusColor(camp.resources.food)}`} 
                            style={{ width: `${camp.resources.food}%` }} 
                          />
                        </div>
                        <span className="text-xs mt-1">Food</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1.5 rounded bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getResourceStatusColor(camp.resources.water)}`} 
                            style={{ width: `${camp.resources.water}%` }} 
                          />
                        </div>
                        <span className="text-xs mt-1">Water</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1.5 rounded bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getResourceStatusColor(camp.resources.medical)}`} 
                            style={{ width: `${camp.resources.medical}%` }} 
                          />
                        </div>
                        <span className="text-xs mt-1">Medical</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1.5 rounded bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getResourceStatusColor(camp.resources.shelter)}`} 
                            style={{ width: `${camp.resources.shelter}%` }} 
                          />
                        </div>
                        <span className="text-xs mt-1">Shelter</span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedCamp === camp.id && (
                    <div className="pt-2 border-t mt-4">
                      <div className="font-medium mb-2">Assigned Volunteers</div>
                      <div className="grid grid-cols-2 gap-2">
                        {camp.volunteersAssigned.names.slice(0, 6).map((name, index) => (
                          <div key={index} className="text-sm flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {name}
                          </div>
                        ))}
                        {camp.volunteersAssigned.names.length > 6 && (
                          <div className="text-sm text-muted-foreground">
                            +{camp.volunteersAssigned.names.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2 flex space-x-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleCampDetails(camp.id)}
                    >
                      {expandedCamp === camp.id ? "Hide Details" : "View Details"}
                    </Button>
                    <Button size="sm">Manage Camp</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {camps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Map Overview</CardTitle>
            <CardDescription>View all base camps on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <MapComponent />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BaseCampsList;
