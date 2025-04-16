
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Clock, Building2, Package, UserPlus, Calendar, MailIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  donationTypes: string[];
  location: string;
  status: "active" | "inactive";
  lastDonation?: string;
  notes?: string;
}

interface DonorAssignment {
  id: string;
  donorId: string;
  donorName: string;
  donationType: string;
  items: string;
  quantity: string;
  destination: {
    id: string;
    name: string;
    location: string;
  };
  status: "pending" | "in-progress" | "completed";
  dueBy?: string;
  assignedVolunteer?: {
    id: string;
    name: string;
  };
}

interface Volunteer {
  id: string;
  name: string;
  available: boolean;
  location: string;
  specialty: string[];
}

const mockDonors: Donor[] = [
  {
    id: "d1",
    name: "Bay Area Food Bank",
    email: "contact@bayareafoodbank.org",
    phone: "(415) 555-1234",
    donationTypes: ["Food Supplies", "Water"],
    location: "San Francisco",
    status: "active",
    lastDonation: "2 weeks ago",
    notes: "Regular donor, can provide large quantities of non-perishable food"
  },
  {
    id: "d2",
    name: "SF Medical Association",
    email: "donations@sfma.org",
    phone: "(415) 555-5678",
    donationTypes: ["Medical Supplies", "Hygiene Kits"],
    location: "San Francisco",
    status: "active",
    lastDonation: "1 month ago"
  },
  {
    id: "d3",
    name: "Tech for Good Inc.",
    email: "help@techforgood.com",
    phone: "(415) 555-9012",
    donationTypes: ["Equipment", "Power Supplies"],
    location: "Palo Alto",
    status: "active",
    lastDonation: "3 weeks ago"
  },
  {
    id: "d4",
    name: "Community Shelter Foundation",
    email: "info@communityshelter.org",
    phone: "(415) 555-3456",
    donationTypes: ["Shelter Supplies", "Clothing"],
    location: "Oakland",
    status: "inactive",
    lastDonation: "6 months ago"
  }
];

const mockDonorAssignments: DonorAssignment[] = [
  {
    id: "da1",
    donorId: "d1",
    donorName: "Bay Area Food Bank",
    donationType: "Food Supplies",
    items: "Non-perishable food items",
    quantity: "500 packages",
    destination: {
      id: "camp1",
      name: "Relief Camp Alpha",
      location: "Downtown San Francisco"
    },
    status: "in-progress",
    dueBy: "Today, 5:00 PM",
    assignedVolunteer: {
      id: "vol1",
      name: "Michael Chen"
    }
  },
  {
    id: "da2",
    donorId: "d2",
    donorName: "SF Medical Association",
    donationType: "Medical Supplies",
    items: "First aid kits, medications",
    quantity: "200 kits",
    destination: {
      id: "camp2",
      name: "Medical Station Beta",
      location: "Mission District, San Francisco"
    },
    status: "pending",
    dueBy: "Tomorrow, 10:00 AM"
  },
  {
    id: "da3",
    donorId: "d3",
    donorName: "Tech for Good Inc.",
    donationType: "Equipment",
    items: "Power banks, radios",
    quantity: "150 units",
    destination: {
      id: "camp4",
      name: "Supply Center Delta",
      location: "North Beach, San Francisco"
    },
    status: "completed",
    assignedVolunteer: {
      id: "vol2",
      name: "Lisa Rodriguez"
    }
  }
];

const mockVolunteers: Volunteer[] = [
  {
    id: "vol1",
    name: "Michael Chen",
    available: false,
    location: "SoMa, San Francisco",
    specialty: ["Medical", "Supply Distribution"]
  },
  {
    id: "vol2",
    name: "Lisa Rodriguez",
    available: true,
    location: "Mission District, San Francisco",
    specialty: ["Logistics", "Supply Distribution"]
  },
  {
    id: "vol3",
    name: "James Wilson",
    available: true,
    location: "Tenderloin District, San Francisco",
    specialty: ["Medical", "Transport"]
  },
  {
    id: "vol4",
    name: "Emily Martinez",
    available: true,
    location: "Richmond District, San Francisco",
    specialty: ["Supply Distribution", "Coordination"]
  }
];

const mockBaseCamps = [
  { id: "camp1", name: "Relief Camp Alpha", location: "Downtown San Francisco" },
  { id: "camp2", name: "Medical Station Beta", location: "Mission District, San Francisco" },
  { id: "camp3", name: "Temporary Shelter Gamma", location: "SoMa, San Francisco" },
  { id: "camp4", name: "Supply Center Delta", location: "North Beach, San Francisco" }
];

const ResponderDonorManagement: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(mockDonors);
  const [assignments, setAssignments] = useState<DonorAssignment[]>(mockDonorAssignments);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"donors" | "assignments">("donors");
  const [assigningVolunteer, setAssigningVolunteer] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<DonorAssignment | null>(null);
  const { toast } = useToast();

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || donor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      assignment.donationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.destination.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const availableVolunteers = volunteers.filter(vol => vol.available);

  const handleAssignVolunteer = (assignmentId: string, volunteerId: string) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    // Update assignment
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return { 
            ...assignment, 
            status: "in-progress",
            assignedVolunteer: {
              id: volunteer.id,
              name: volunteer.name
            }
          };
        }
        return assignment;
      })
    );
    
    // Update volunteer availability
    setVolunteers(prevVolunteers =>
      prevVolunteers.map(vol => {
        if (vol.id === volunteerId) {
          return { ...vol, available: false };
        }
        return vol;
      })
    );
    
    setAssigningVolunteer(null);
    setSelectedAssignment(null);
    
    toast({
      title: "Volunteer Assigned",
      description: `${volunteer.name} has been assigned to coordinate with ${selectedAssignment?.donorName}.`,
    });
  };

  const handleCompleteAssignment = (assignmentId: string) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          // If there's an assigned volunteer, make them available again
          if (assignment.assignedVolunteer) {
            setVolunteers(prevVolunteers =>
              prevVolunteers.map(vol => {
                if (vol.id === assignment.assignedVolunteer?.id) {
                  return { ...vol, available: true };
                }
                return vol;
              })
            );
          }
          
          return { ...assignment, status: "completed" };
        }
        return assignment;
      })
    );
    
    toast({
      title: "Assignment Completed",
      description: "The donation has been successfully delivered and processed.",
    });
  };

  const getStatusColor = (status: DonorAssignment["status"] | Donor["status"]) => {
    switch (status) {
      case "pending": return "bg-muted border-muted text-muted-foreground";
      case "in-progress": return "bg-info/10 text-info border-info/20";
      case "completed": return "bg-success/10 text-success border-success/20";
      case "active": return "bg-success/10 text-success border-success/20";
      case "inactive": return "bg-muted border-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Donor Management
          </CardTitle>
          <CardDescription>
            Manage donors and assign volunteers to coordinate donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="flex gap-2">
              <Button 
                variant={activeTab === "donors" ? "default" : "outline"}
                onClick={() => setActiveTab("donors")}
              >
                Donors
              </Button>
              <Button 
                variant={activeTab === "assignments" ? "default" : "outline"}
                onClick={() => setActiveTab("assignments")}
              >
                Assignments
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
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
                  {activeTab === "donors" ? (
                    <>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {activeTab === "donors" ? (
            filteredDonors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No donors matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Donation Types</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map(donor => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">
                          {donor.name}
                          {donor.lastDonation && (
                            <div className="text-xs text-muted-foreground">
                              Last donation: {donor.lastDonation}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <MailIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              {donor.email}
                            </div>
                            <div className="text-sm">{donor.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {donor.donationTypes.map((type, i) => (
                              <Badge key={i} variant="outline" className="bg-muted/30">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{donor.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(donor.status)}>
                            {donor.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              Contact
                            </Button>
                            <Button 
                              size="sm"
                            >
                              New Assignment
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            filteredAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No assignments matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Donation</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Volunteer</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map(assignment => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.donorName}</TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="mb-1 bg-muted/30">
                              {assignment.donationType}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {assignment.items} ({assignment.quantity})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              {assignment.destination.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {assignment.destination.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getStatusColor(assignment.status)}>
                              {assignment.status === "pending" ? "Pending" : 
                               assignment.status === "in-progress" ? "In Progress" : 
                               "Completed"}
                            </Badge>
                            {assignment.dueBy && (
                              <div className="flex items-center text-xs text-emergency">
                                <Clock className="h-3 w-3 mr-1" />
                                Due: {assignment.dueBy}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {assignment.assignedVolunteer ? (
                            assignment.assignedVolunteer.name
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {assignment.status === "pending" && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setAssigningVolunteer(assignment.id);
                                }}
                                disabled={availableVolunteers.length === 0}
                              >
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                Assign
                              </Button>
                            )}
                            {assignment.status === "in-progress" && (
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteAssignment(assignment.id)}
                              >
                                Mark Complete
                              </Button>
                            )}
                            {assignment.status === "completed" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedAssignment(assignment)}
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
            )
          )}
        </CardContent>
      </Card>

      {selectedAssignment && assigningVolunteer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assign Volunteer to Donation</CardTitle>
            <CardDescription>Select a volunteer to coordinate with {selectedAssignment.donorName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
                <div>
                  <p className="text-sm font-medium">Donor</p>
                  <p className="text-muted-foreground">{selectedAssignment.donorName}</p>
                  <Badge variant="outline" className="mt-1 bg-muted/30">
                    {selectedAssignment.donationType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-muted-foreground">{selectedAssignment.destination.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedAssignment.destination.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-muted-foreground">{selectedAssignment.items}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quantity</p>
                  <p className="text-muted-foreground">{selectedAssignment.quantity}</p>
                </div>
                {selectedAssignment.dueBy && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium flex items-center text-emergency">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Due by {selectedAssignment.dueBy}
                    </p>
                  </div>
                )}
              </div>
              
              {availableVolunteers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No volunteers are currently available. Try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Available Volunteers</h4>
                  
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Specialty</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableVolunteers.map(volunteer => (
                          <TableRow key={volunteer.id}>
                            <TableCell>{volunteer.name}</TableCell>
                            <TableCell>{volunteer.location}</TableCell>
                            <TableCell>
                              {volunteer.specialty.map((spec, i) => (
                                <Badge key={i} variant="outline" className="bg-muted/30 mr-1">
                                  {spec}
                                </Badge>
                              ))}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm"
                                onClick={() => handleAssignVolunteer(selectedAssignment.id, volunteer.id)}
                              >
                                Assign
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => {
                  setAssigningVolunteer(null);
                  setSelectedAssignment(null);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponderDonorManagement;
