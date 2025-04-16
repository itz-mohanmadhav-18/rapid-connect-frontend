
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DonorAssignment {
  id: string;
  donorName: string;
  donationType: string;
  items: string;
  quantity: string;
  location: string;
  status: "pending" | "in-progress" | "completed";
  dueBy?: string;
}

const mockDonorAssignments: DonorAssignment[] = [
  {
    id: "d1",
    donorName: "Bay Area Food Bank",
    donationType: "Food Supplies",
    items: "Non-perishable food items",
    quantity: "500 packages",
    location: "Relief Camp Alpha",
    status: "in-progress",
    dueBy: "Today, 5:00 PM"
  },
  {
    id: "d2",
    donorName: "SF Medical Association",
    donationType: "Medical Supplies",
    items: "First aid kits, medications",
    quantity: "200 kits",
    location: "Medical Station Beta",
    status: "pending",
    dueBy: "Tomorrow, 10:00 AM"
  },
  {
    id: "d3",
    donorName: "Tech for Good Inc.",
    donationType: "Equipment",
    items: "Power banks, radios",
    quantity: "150 units",
    location: "Downtown Distribution Center",
    status: "completed"
  }
];

const DonorAssignments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-info" /> Donor Assignments
        </CardTitle>
        <CardDescription>
          Your assigned donor contributions to coordinate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDonorAssignments.map(assignment => (
            <div key={assignment.id} className="border rounded-md p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{assignment.donorName}</div>
                  <div className="text-sm text-muted-foreground">{assignment.donationType}</div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    assignment.status === "completed" 
                      ? "bg-success/10 text-success border-success/20" 
                      : assignment.status === "in-progress" 
                        ? "bg-info/10 text-info border-info/20" 
                        : "bg-muted"
                  }
                >
                  {assignment.status === "completed" && (
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  )}
                  {assignment.status === "in-progress" && (
                    <Clock className="h-3.5 w-3.5 mr-1" />
                  )}
                  {assignment.status === "pending" && (
                    <Package className="h-3.5 w-3.5 mr-1" />
                  )}
                  {assignment.status === "completed" ? "Completed" : 
                   assignment.status === "in-progress" ? "In Progress" : "Pending"}
                </Badge>
              </div>
              
              <div className="mt-3 space-y-1 text-sm">
                <div>
                  <span className="font-medium">Items:</span> {assignment.items}
                </div>
                <div>
                  <span className="font-medium">Quantity:</span> {assignment.quantity}
                </div>
                <div>
                  <span className="font-medium">Delivery Location:</span> {assignment.location}
                </div>
                {assignment.dueBy && (
                  <div className="text-emergency">
                    <span className="font-medium">Due By:</span> {assignment.dueBy}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {mockDonorAssignments.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              No donor assignments at this time
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorAssignments;
