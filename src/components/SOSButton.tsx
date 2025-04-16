import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import * as sosService from "@/services/sosService";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as locationService from "@/services/locationService";

const emergencyTypes = ["Medical", "Trapped", "Supplies", "Evacuation", "Other"];

const sosFormSchema = z.object({
  emergency: z.string().min(1, { message: "Please select an emergency type" }),
  description: z.string().min(10, { message: "Please provide a brief description (at least 10 characters)" }),
  contactInfo: z.string().min(1, { message: "Please provide contact information" }),
});

type SOSFormValues = z.infer<typeof sosFormSchema>;

const SOSButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<SOSFormValues>({
    resolver: zodResolver(sosFormSchema),
    defaultValues: {
      emergency: "",
      description: "",
      contactInfo: "",
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      // Get user's location when dialog opens
      setIsLoadingLocation(true);
      locationService.getCurrentLocation()
        .then(location => {
          setUserLocation(location);
          setIsLoadingLocation(false);
        })
        .catch(error => {
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please ensure location services are enabled.",
            variant: "destructive"
          });
          setIsLoadingLocation(false);
        });
      
      // Pre-populate contact info if user is logged in
      if (user) {
        form.setValue("contactInfo",  user.email || "");
      }
    }
  }, [isDialogOpen, toast, user, form]);

  const handleSOSClick = () => {
    setIsDialogOpen(true);
  };

  const handleEmergencySelect = (type: string) => {
    setSelectedEmergency(type);
    form.setValue("emergency", type);
  };

  const handleEmergencySubmit = async (data: SOSFormValues) => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Your location is required to send an emergency request. Please enable location services.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const locationData = {
        coordinates: [userLocation.lng, userLocation.lat] as [number, number], // [longitude, latitude]
        address: userLocation.address || "Unknown address"
      };

      if (user) {
        // Authenticated user - use regular SOS request
        const sosData: sosService.CreateSOSRequestData = {
          emergency: data.emergency,
          description: data.description,
          location: locationData
        };
        await sosService.create(sosData);
      } else {
        // Anonymous user - use anonymous SOS request
        const anonymousSosData: sosService.CreateAnonymousSOSRequestData = {
          emergency: data.emergency,
          description: data.description,
          location: locationData,
          contactInfo: data.contactInfo
        };
        await sosService.createAnonymous(anonymousSosData);
      }

      toast({
        title: "Emergency alert sent!",
        description: "Help is on the way. Stay calm and follow safety guidelines.",
        variant: "default"
      });
      setIsDialogOpen(false);
      form.reset();
      setSelectedEmergency(null);
    } catch (error) {
      toast({
        title: "Failed to send alert",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        className="sos-button w-full md:w-64 h-16 text-xl animate-pulse-emergency"
        onClick={handleSOSClick}
        variant="destructive"
      >
        <AlertCircle className="mr-2 h-6 w-6" />
        SOS EMERGENCY
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          form.reset();
          setSelectedEmergency(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emergency flex items-center">
              <AlertCircle className="mr-2" /> Emergency Assistance
            </DialogTitle>
            <DialogDescription>
              Please provide details about your emergency situation.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmergencySubmit)} className="space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                <FormLabel>What type of emergency are you experiencing?</FormLabel>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {emergencyTypes.map((type) => (
                    <Button 
                      key={type}
                      type="button"
                      variant="outline" 
                      className={`h-14 sm:h-16 flex flex-col items-center justify-center text-xs sm:text-sm ${
                        selectedEmergency === type 
                          ? "border-2 border-emergency bg-emergency/10" 
                          : "border hover:bg-emergency/10"
                      }`}
                      onClick={() => handleEmergencySelect(type)}
                    >
                      <span>{type}</span>
                    </Button>
                  ))}
                </div>
                {form.formState.errors.emergency && (
                  <p className="text-sm text-destructive">{form.formState.errors.emergency.message}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Briefly describe your situation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details about your emergency (e.g., number of people, specific needs, etc.)" 
                        className="resize-none h-16 sm:h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!user && (
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number or other contact information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        Required for responders to contact you. We'll keep this private.
                      </p>
                    </FormItem>
                  )}
                />
              )}

              {isLoadingLocation && (
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted-foreground p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting your location...</span>
                </div>
              )}

              {userLocation && (
                <div className="text-xs sm:text-sm bg-muted p-2 rounded">
                  <p className="font-medium">Your location:</p>
                  <p className="text-muted-foreground truncate">{userLocation.address || "Unknown address"}</p>
                </div>
              )}
              
              <div className="mt-2 rounded-md bg-muted p-2 sm:p-3">
                <div className="font-semibold text-xs sm:text-sm flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> Emergency Hotline
                </div>
                <div className="text-base sm:text-lg font-bold">1-800-DISASTER</div>
                <div className="text-xs text-muted-foreground">Call if possible instead of digital SOS</div>
              </div>

              <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                  className="w-1/3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || isLoadingLocation}
                  variant="destructive"
                  className="w-2/3 h-10 sm:h-12 text-sm sm:text-base font-semibold animate-pulse-emergency"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "SEND EMERGENCY ALERT"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
