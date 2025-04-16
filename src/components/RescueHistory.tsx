
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, MapPin, User, Building2, Clock } from "lucide-react";

const mockRescueOperations = [
  {
    id: "res1",
    victimName: "John Smith",
    location: "Tenderloin District, San Francisco",
    emergencyType: "Medical",
    rescueDate: "Apr 12, 2024",
    rescueTeam: ["Michael Chen", "Lisa Rodriguez"],
    baseCamp: "Relief Camp Alpha",
    status: "success",
    details: "Elderly man with heart condition safely transported to medical facility."
  },
  {
    id: "res2",
    victimName: "Johnson Family",
    location: "Mission District, San Francisco",
    emergencyType: "Trapped",
    rescueDate: "Apr 11, 2024",
    rescueTeam: ["James Wilson", "Sarah Lee"],
    baseCamp: "Relief Camp Alpha",
    status: "success",
    details: "Family of 4 evacuated from flooded apartment building."
  },
  {
    id: "res3",
    victimName: "Chinatown Community Center",
    location: "Chinatown, San Francisco",
    emergencyType: "Supplies",
    rescueDate: "Apr 10, 2024",
    rescueTeam: ["Robert Kim", "Emily Martinez"],
    baseCamp: "Supply Center Delta",
    status: "partial",
    details: "Delivered water and food, but medical supplies were limited."
  },
  {
    id: "res4",
    victimName: "Emma Watson",
    location: "North Beach, San Francisco",
    emergencyType: "Medical",
    rescueDate: "Apr 10, 2024",
    rescueTeam: ["Lisa Rodriguez"],
    baseCamp: "Medical Station Beta",
    status: "success",
    details: "Child with asthma attack provided with inhaler and medical assistance."
  },
  {
    id: "res5",
    victimName: "Marina Apartments",
    location: "Marina District, San Francisco",
    emergencyType: "Evacuation",
    rescueDate: "Apr 9, 2024",
    rescueTeam: ["James Wilson", "Michael Chen", "David Park"],
    baseCamp: "Temporary Shelter Gamma",
    status: "partial",
    details: "18 residents evacuated, 2 refused to leave."
  },
  {
    id: "res6",
    victimName: "David Kim",
    location: "SoMa, San Francisco",
    emergencyType: "Trapped",
    rescueDate: "Apr 8, 2024",
    rescueTeam: ["Robert Kim", "Lisa Rodriguez"],
    baseCamp: "Relief Camp Alpha",
    status: "failed",
    details: "Unable to reach location due to collapsed infrastructure. Reattempt scheduled."
  }
];

const RescueHistory = () => {
  const [rescueOps, setRescueOps] = useState(mockRescueOperations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOperation, setSelectedOperation] = useState(null);

  const filteredOperations = rescueOps.filter(op => {
    const matchesSearch = 
      op.victimName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.baseCamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.rescueTeam.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || op.status === statusFilter;
    const matchesType = typeFilter === "all" || op.emergencyType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "success": return "bg-success text-success-foreground";
      case "partial": return "bg-warning text-warning-foreground";
      case "failed": return "bg-emergency text-emergency-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getEmergencyTypeColor = (type) => {
    switch (type) {
      case "Medical": return "bg-emergency/10 text-emergency border-emergency/20";
      case "Trapped": return "bg-alert/10 text-alert border-alert/20";
      case "Supplies": return "bg-info/10 text-info border-info/20";
      case "Evacuation": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Rescue Operation History
          </CardTitle>
          <CardDescription>
            View past rescue operations and their outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search operations..."
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
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Trapped">Trapped</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Evacuation">Evacuation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {filteredOperations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rescue operations matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Victim</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Emergency Type</TableHead>
                    <TableHead>Rescue Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOperations.map(operation => (
                    <TableRow key={operation.id} className={selectedOperation?.id === operation.id ? "bg-muted/30" : ""}>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {operation.rescueDate}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{operation.victimName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{operation.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getEmergencyTypeColor(operation.emergencyType)}>
                          {operation.emergencyType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {operation.rescueTeam[0]}
                          {operation.rescueTeam.length > 1 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              +{operation.rescueTeam.length - 1}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(operation.status)}>
                          {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedOperation(
                            selectedOperation?.id === operation.id ? null : operation
                          )}
                        >
                          {selectedOperation?.id === operation.id ? "Hide Details" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedOperation && (
            <div className="mt-6 p-4 border rounded-md bg-muted/10">
              <h3 className="font-medium text-lg mb-3">Rescue Operation Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Victim/Location</p>
                  <p className="text-muted-foreground">{selectedOperation.victimName}</p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" /> {selectedOperation.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date & Emergency Type</p>
                  <p className="text-muted-foreground">{selectedOperation.rescueDate}</p>
                  <Badge variant="outline" className={getEmergencyTypeColor(selectedOperation.emergencyType)}>
                    {selectedOperation.emergencyType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Rescue Team</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOperation.rescueTeam.map((member, i) => (
                      <Badge key={i} variant="outline" className="bg-muted/30">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Base Camp</p>
                  <p className="text-muted-foreground flex items-center">
                    <Building2 className="h-3.5 w-3.5 mr-1" /> {selectedOperation.baseCamp}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Operation Details</p>
                <p className="text-muted-foreground">{selectedOperation.details || "No additional details available."}</p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedOperation(null)}>
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RescueHistory;
