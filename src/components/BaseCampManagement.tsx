
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Plus, Minus, Building2, Package, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Resource {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface BaseCamp {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  resources: Resource[];
  volunteersAssigned: number;
}

const mockBaseCamp: BaseCamp = {
  id: "camp1",
  name: "Relief Camp Alpha",
  location: "Downtown San Francisco",
  capacity: 500,
  occupancy: 320,
  volunteersAssigned: 15,
  resources: [
    { id: "r1", name: "Water Bottles", quantity: 1200, unit: "units" },
    { id: "r2", name: "Food Packages", quantity: 850, unit: "packs" },
    { id: "r3", name: "Medical Kits", quantity: 75, unit: "kits" },
    { id: "r4", name: "Blankets", quantity: 450, unit: "pieces" }
  ]
};

const BaseCampManagement: React.FC = () => {
  const [baseCamp, setBaseCamp] = useState<BaseCamp>(mockBaseCamp);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);
  const { toast } = useToast();

  const handleResourceChange = (resourceId: string, amount: number) => {
    setBaseCamp(prevCamp => {
      const updatedResources = prevCamp.resources.map(resource => {
        if (resource.id === resourceId) {
          const newQuantity = resource.quantity + amount;
          return { ...resource, quantity: Math.max(0, newQuantity) };
        }
        return resource;
      });
      
      return { ...prevCamp, resources: updatedResources };
    });

    toast({
      title: "Resource Updated",
      description: `Inventory has been successfully updated.`,
    });
  };

  const startEditing = (resourceId: string, currentQuantity: number) => {
    setEditingResource(resourceId);
    setTempQuantity(currentQuantity);
  };

  const saveEditing = (resourceId: string) => {
    setBaseCamp(prevCamp => {
      const updatedResources = prevCamp.resources.map(resource => {
        if (resource.id === resourceId) {
          return { ...resource, quantity: Math.max(0, tempQuantity) };
        }
        return resource;
      });
      
      return { ...prevCamp, resources: updatedResources };
    });
    
    setEditingResource(null);
    
    toast({
      title: "Resource Updated",
      description: `Inventory has been manually updated.`,
    });
  };

  const cancelEditing = () => {
    setEditingResource(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Your Assigned Base Camp
        </CardTitle>
        <CardDescription>
          Manage resources and view capacity of your assigned relief camp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{baseCamp.name}</h3>
              <p className="text-sm text-muted-foreground">{baseCamp.location}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Occupancy: <span className="font-semibold">{baseCamp.occupancy} / {baseCamp.capacity}</span>
              </div>
              <div className="text-sm">
                Volunteers: <span className="font-semibold">{baseCamp.volunteersAssigned}</span>
              </div>
            </div>
          </div>
        </div>
        
        <h4 className="font-medium mb-3 flex items-center">
          <Package className="h-4 w-4 mr-1" /> Manage Resources
        </h4>
        
        <div className="space-y-2">
          {baseCamp.resources.map(resource => (
            <div key={resource.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
              <div className="flex-1">
                <div className="font-medium">{resource.name}</div>
                
                {editingResource === resource.id ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      value={tempQuantity}
                      onChange={(e) => setTempQuantity(parseInt(e.target.value) || 0)}
                      className="w-24 h-8"
                    />
                    <span className="text-sm text-muted-foreground">{resource.unit}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => saveEditing(resource.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm" onClick={() => startEditing(resource.id, resource.quantity)}>
                    <span className="font-medium">{resource.quantity}</span> {resource.unit}
                  </div>
                )}
              </div>
              
              {editingResource !== resource.id && (
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleResourceChange(resource.id, -1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleResourceChange(resource.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseCampManagement;
