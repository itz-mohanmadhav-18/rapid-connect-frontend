import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, ArrowRight, Loader2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import * as sosService from "@/services/sosService";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as locationService from "@/services/locationService";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const emergencyTypes = [
  { id: "medical", label: "Medical Emergency", icon: "🏥" },
  { id: "trapped", label: "Trapped/Stranded", icon: "🚧" },
  { id: "supplies", label: "Need Supplies", icon: "📦" },
  { id: "evacuation", label: "Need Evacuation", icon: "🚗" },
  { id: "other", label: "Other Emergency", icon: "❗" }
];

const sosFormSchema = z.object({
  emergencyType: z.string().min(1, { message: "Please select an emergency type" }),
  description: z.string().min(10, { message: "Please provide a brief description (at least 10 characters)" }),
  contactInfo: z.string().min(1, { message: "Please provide contact information" }),
  numberOfPeople: z.string().min(1, { message: "Please indicate how many people need help" })
});

const SOSButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationDescription, setLocationDescription] = useState<string | null>(null);
  const [sosRequestId, setSosRequestId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  
  const form = useForm<z.infer<typeof sosFormSchema>>({
    resolver: zodResolver(sosFormSchema),
    defaultValues: {
      emergencyType: "",
      description: "",
      contactInfo: user?.phone || "",
      numberOfPeople: "1"
    },
  });
  
  useEffect(() => {
    if (open && step === 1) {
      getCurrentLocation();
    }
  }, [open, step]);
  
  const getCurrentLocation = async () => {
    setIsLocating(true);
    
    try {
      const position = await locationService.getCurrentLocation();
      // Convert from locationService format (lat, lng) to our component's format (latitude, longitude)
      setCoordinates({
        latitude: position.lat,
        longitude: position.lng
      });
      
      // Use the address from locationService directly
      setLocationDescription(position.address);
    } catch (err) {
      console.error("Error getting location:", err);
      toast({
        title: "Location Error",
        description: "Could not determine your location. Please provide your location in the description.",
        variant: "destructive",
      });
    } finally {
      setIsLocating(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof sosFormSchema>) => {
    setIsLoading(true);
    
    try {
      // Prepare the coordinates properly
      let locationCoords: [number, number] | null = null;
      if (coordinates && coordinates.longitude && coordinates.latitude) {
        locationCoords = [coordinates.longitude, coordinates.latitude];
      }
      
      // Capitalize the first letter of emergency type to match backend expectations
      const emergencyType = values.emergencyType.charAt(0).toUpperCase() + values.emergencyType.slice(1);
      
      // Create SOS request with properly formatted data
      const sosData = {
        emergency: emergencyType, // Now properly capitalized
        description: values.description,
        location: {
          type: "Point", // Required by backend model
          coordinates: locationCoords,
          address: locationDescription || "Unknown location",
        },
        contactInfo: values.contactInfo,
        numberOfPeople: parseInt(values.numberOfPeople),
        user: user ? user.id : null,
        isAnonymous: !user,
        status: "pending",
      };
      
      console.log("SOS request data being submitted:", sosData);
      
      const response = await sosService.create(sosData);
      
      if (response && (response.id || response._id)) {
        setSosRequestId(response.id || response._id);
      }
      
      setIsLoading(false);
      setStep(3); // Success step
    } catch (error) {
      console.error("Error submitting SOS request:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send SOS request. Please try again or call emergency services directly.",
        variant: "destructive",
      });
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(1);
      form.reset();
      setSosRequestId(null);
    }, 300);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative mb-2">
          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="h-24 w-24 rounded-full bg-emergency shadow-elevation-2 animate-emergency-pulse text-white hover:bg-emergency/90 focus:ring-2 focus:ring-emergency/50 focus:ring-offset-2"
          >
            <div className="flex flex-col items-center">
              <AlertCircle className="h-10 w-10 mb-1" />
              <span className="text-xs font-bold">SOS</span>
            </div>
          </Button>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emergency"></span>
          </span>
        </div>
        <span className="text-sm font-semibold text-emergency tracking-wide">EMERGENCY</span>
        <p className="text-xs text-muted-foreground mt-1">Tap for immediate assistance</p>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-emergency">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Emergency Assistance
                </DialogTitle>
                <DialogDescription>
                  We're determining your location to send help to your position.
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-4 border rounded-md bg-emergency/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-emergency" />
                    Your Location
                  </span>
                  {isLocating && 
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  }
                  {!isLocating && !coordinates && 
                    <Badge variant="outline" className="text-warning bg-warning/10">Not Found</Badge>
                  }
                  {!isLocating && coordinates && 
                    <Badge variant="outline" className="text-success bg-success/10">Located</Badge>
                  }
                </div>
                
                {coordinates && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {locationDescription ? (
                      <p className="bg-white/40 p-2 rounded-md text-foreground">{locationDescription}</p>
                    ) : (
                      <p>Coordinates: {coordinates?.latitude?.toFixed(6)}, {coordinates?.longitude?.toFixed(6)}</p>
                    )}
                  </div>
                )}
                
                {!coordinates && !isLocating && (
                  <div className="text-sm p-2 bg-warning/10 rounded-md border border-warning/20 text-warning-foreground">
                    Could not determine your location. You can still proceed and describe your location in the next step.
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Important Information</h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>In life-threatening emergencies, please also call <span className="font-semibold">911</span> directly.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Response teams will be dispatched based on availability and priority.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Providing accurate information helps us respond faster.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setStep(2)} 
                    className="bg-emergency hover:bg-emergency/90 text-white flex items-center gap-2"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-2 flex items-center justify-center gap-2 bg-emergency/10 p-2 rounded-md">
                  <div className="p-1.5 rounded-full bg-emergency/20">
                    <Phone className="h-4 w-4 text-emergency" />
                  </div>
                  <div className="text-sm text-emergency">
                    <span className="font-semibold">Emergency: 911</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-emergency">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Emergency Details
                </DialogTitle>
                <DialogDescription>
                  Please provide details about your emergency situation
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emergencyType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Emergency Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {emergencyTypes.map((type) => (
                              <div key={type.id}>
                                <RadioGroupItem
                                  value={type.id}
                                  id={type.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={type.id}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emergency peer-data-[state=checked]:bg-emergency/5 [&:has([data-state=checked])]:border-emergency [&:has([data-state=checked])]:bg-emergency/5"
                                >
                                  <span className="text-xl mb-1">{type.icon}</span>
                                  <span className="text-xs font-medium text-center">{type.label}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numberOfPeople"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of People</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="How many people need help" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe Your Emergency</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your situation and specific needs..." 
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include any details that might help responders (injuries, hazards, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <div className="flex justify-between w-full gap-3 mt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="bg-emergency hover:bg-emergency/90 text-white"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send SOS Request
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
          
          {step === 3 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-success flex items-center">
                  <div className="bg-success/10 p-1 rounded-full mr-2">
                    <AlertCircle className="h-4 w-4 text-success" />
                  </div>
                  SOS Request Sent
                </DialogTitle>
                <DialogDescription>
                  Your emergency has been reported and help is on the way.
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-success" />
                </div>
                
                <h3 className="text-lg font-semibold mb-1">Help is on the way</h3>
                <p className="text-muted-foreground mb-4">Emergency responders have been notified and are being dispatched to your location.</p>
                
                {sosRequestId && (
                  <div className="w-full mb-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm font-medium mb-1">Request ID:</p>
                    <p className="font-mono text-xs bg-background p-2 rounded border">{sosRequestId}</p>
                    <p className="text-xs text-muted-foreground mt-2">Please save this ID for reference</p>
                  </div>
                )}
                
                <div className="w-full space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Emergency response status</span>
                    <span className="font-medium">Processing</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <p className="text-xs text-muted-foreground text-left">Response teams are being coordinated</p>
                </div>
                
                <Button 
                  onClick={handleClose} 
                  className="w-full mt-2"
                >
                  Close
                </Button>
                
                <p className="mt-4 text-xs text-muted-foreground">Please stay where you are if it's safe to do so, and keep your phone available for contact.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
