
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle, SendHorizontal, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AlertGeneration: React.FC = () => {
  const [alertType, setAlertType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [photosUploaded, setPhotosUploaded] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmitAlert = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to a backend
    toast({
      title: "Alert Request Sent",
      description: "Your high-priority alert has been sent to response teams for verification.",
    });
    
    // Reset form
    setAlertType("");
    setLocation("");
    setDescription("");
    setPhotosUploaded(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-emergency" /> Generate High Alert
        </CardTitle>
        <CardDescription>
          Request response teams to issue a high priority alert to all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitAlert} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="alert-type" className="text-sm font-medium">Alert Type</label>
            <Select value={alertType} onValueChange={setAlertType} required>
              <SelectTrigger id="alert-type">
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flash Flood Warning</SelectItem>
                <SelectItem value="fire">Wildfire Alert</SelectItem>
                <SelectItem value="earthquake">Earthquake Advisory</SelectItem>
                <SelectItem value="storm">Severe Storm Warning</SelectItem>
                <SelectItem value="evacuation">Evacuation Order</SelectItem>
                <SelectItem value="other">Other Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              <MapPin className="h-4 w-4 inline mr-1" /> Location
            </label>
            <input
              id="location"
              className="w-full p-2 border rounded"
              placeholder="Enter affected area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Detailed Description</label>
            <Textarea
              id="description"
              placeholder="Describe the emergency situation in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="border border-dashed rounded-md p-4">
            <label 
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center cursor-pointer text-center py-2"
            >
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Upload Photos</span>
              <span className="text-xs text-muted-foreground mt-1">
                {photosUploaded > 0 ? `${photosUploaded} photos uploaded` : "Optional but recommended"}
              </span>
              
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setPhotosUploaded(e.target.files?.length || 0)}
              />
            </label>
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={!alertType || !location || !description}>
              <SendHorizontal className="h-4 w-4 mr-2" />
              Submit Alert for Review
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              All alert requests will be verified by response teams before being broadcast
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlertGeneration;
