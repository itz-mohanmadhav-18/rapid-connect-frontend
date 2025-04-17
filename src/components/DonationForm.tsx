import React, { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import * as baseCampService from "@/services/baseCampService";
import * as donationService from "@/services/donationService";
import RazorpayPayment from "@/components/RazorpayPayment";
import { Label } from "@/components/ui/label";

// Define donation form schema with Zod
const resourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

const donationFormSchema = z.object({
  baseCamp: z.string().min(1, "Please select a base camp"),
  scheduledDate: z.date({
    required_error: "Please select a delivery date",
  }).min(new Date(), "Delivery date must be in the future"),
  resources: z.array(resourceSchema).min(1, "At least one resource is required"),
});

// Resource units options
const resourceUnits = [
  "units",
  "kg",
  "liters",
  "packs",
  "boxes",
  "pieces",
  "sets",
  "kits",
  "bottles",
  "cartons",
  "bundles",
  "packets",
  "bags",
  "cans",
  "pairs",
  "tons"
];

// Common resource suggestions
const resourceSuggestions = [
  { name: "Water Bottles", unit: "bottles" },
  { name: "Food Packages", unit: "packs" },
  { name: "Medical Kits", unit: "kits" },
  { name: "Blankets", unit: "pieces" },
  { name: "Tents", unit: "units" },
  { name: "Clothes", unit: "sets" },
  { name: "Medicines", unit: "boxes" },
  { name: "Baby Formula", unit: "cans" },
  { name: "Hygiene Kits", unit: "kits" },
  { name: "Sanitary Pads", unit: "packs" },
  { name: "First Aid Supplies", unit: "kits" },
  { name: "Flashlights", unit: "units" },
  { name: "Batteries", unit: "packs" },
  { name: "Rice", unit: "kg" },
  { name: "Cooking Oil", unit: "liters" },
];

type DonationFormValues = z.infer<typeof donationFormSchema>;

interface DonationFormProps {
  onSuccess?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"resource" | "cash">("resource");
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [selectedBaseCamp, setSelectedBaseCamp] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow as default
  const [presetAmount, setPresetAmount] = useState<number | null>(null);

  // Fetch base camps
  const { data: baseCamps, isLoading: isLoadingBaseCamps } = useApiQuery<baseCampService.BaseCamp[]>(
    'base-camps',
    baseCampService.getAll,
    {
      onSuccess: () => {
        console.log("Base camps loaded successfully");
      },
      onSettled: (data: any, error: any) => {
        if (error) {
          toast({
            title: "Failed to load base camps",
            description: error instanceof Error ? error.message : "Unknown error",
            variant: "destructive",
          });
        }
      }
    }
  );

  // Resource donation creation mutation
  const resourceDonationMutation = useApiMutation<donationService.Donation, any>(
    async (data) => {
      return await donationService.createResourceDonation(data);
    },
    {
      onSuccess: () => {
        toast({
          title: "Donation scheduled successfully",
          description: "Thank you for your contribution!",
        });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/donor-dashboard/donations");
        }
      },
      onError: (error) => {
        toast({
          title: "Failed to schedule donation",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }
  );

  // Cash donation creation mutation
  const cashDonationMutation = useApiMutation<donationService.Donation, any>(
    async (data) => {
      return await donationService.createCashDonation(data);
    },
    {
      onSuccess: () => {
        toast({
          title: "Cash donation completed successfully",
          description: "Thank you for your contribution!",
        });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/donor-dashboard/donations");
        }
      },
      onError: (error) => {
        toast({
          title: "Failed to process cash donation",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }
  );

  // Initialize form with default values
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      baseCamp: "",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow as default
      resources: [{ name: "", quantity: 1, unit: "units" }],
    },
  });

  // Field array for dynamic resources
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  // Add a suggested resource
  const addSuggestedResource = (suggestion: { name: string; unit: string }) => {
    append({
      name: suggestion.name,
      quantity: 1,
      unit: suggestion.unit,
    });
  };

  // Form submission handler for resource donations
  const onSubmitResourceDonation = async (values: DonationFormValues) => {
    setIsSubmitting(true);
    
    // Make sure we're using the correct baseCamp value from state
    const donationData = {
      resources: values.resources,
      baseCamp: selectedBaseCamp || values.baseCamp, // Use selectedBaseCamp as priority
      scheduledDate: values.scheduledDate.toISOString(),
    };
    
    // Log what we're sending to help with debugging
    console.log("Submitting resource donation data:", donationData);
    
    try {
      await resourceDonationMutation.mutateAsync(donationData);
      // The success handling is in the mutation configuration
    } catch (error) {
      console.error("Error submitting resource donation:", error);
      // Error handling is in the mutation configuration
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cash donation initiation
  const handleInitiateCashDonation = (amount: number | null = null) => {
    if (!selectedBaseCamp) {
      toast({
        title: "Base camp selection required",
        description: "Please select a base camp for your cash donation.",
        variant: "destructive",
      });
      return;
    }

    if (amount) {
      setPresetAmount(amount);
    }
    
    setShowCashPayment(true);
  };

  // Handle successful cash payment
  const handleCashPaymentSuccess = (paymentId: string, amount: number) => {
    if (!paymentId || amount <= 0) {
      toast({
        title: "Invalid Payment",
        description: "Payment information is incomplete. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a cash donation record
    const donationData = {
      amount: amount,
      paymentId: paymentId,
      baseCamp: selectedBaseCamp,
      scheduledDate: scheduledDate.toISOString(),
    };
    
    // Log what we're sending to help with debugging
    console.log("Submitting cash donation data:", donationData);
    
    try {
      cashDonationMutation.mutate(donationData);
      setShowCashPayment(false);
    } catch (error) {
      console.error("Error submitting cash donation:", error);
      // Note: mutate (vs mutateAsync) handles errors through the mutation config
    }
  };

  // Handle base camp selection
  const handleBaseCampChange = (value: string) => {
    setSelectedBaseCamp(value);
    form.setValue("baseCamp", value);
  };

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setScheduledDate(date);
      form.setValue("scheduledDate", date);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>
          Contribute to support disaster relief efforts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resource" value={activeTab} onValueChange={(value) => setActiveTab(value as "resource" | "cash")}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="resource">Donate Resources</TabsTrigger>
            <TabsTrigger value="cash">Donate Cash</TabsTrigger>
          </TabsList>
          
          {/* Common fields (outside Form context) */}
          <div className="mb-6 space-y-4">
            <div>
              <Label htmlFor="base-camp-select">Base Camp</Label>
              <Select 
                id="base-camp-select"
                onValueChange={handleBaseCampChange}
                defaultValue={selectedBaseCamp}
                disabled={isLoadingBaseCamps}
              >
                <SelectTrigger className="w-full" id="base-camp-select">
                  <SelectValue placeholder="Select a base camp to donate to" />
                </SelectTrigger>
                <SelectContent>
                  {baseCamps && baseCamps.length > 0 ? (
                    baseCamps.map((camp) => (
                      <SelectItem key={camp._id || camp.id} value={camp._id || camp.id}>
                        {camp.name} - {camp.location?.address || 'No address'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-camps" disabled>
                      No base camps available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {isLoadingBaseCamps && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading base camps...
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Choose the relief center where your donation will be delivered
              </p>
              {baseCamps && baseCamps.length === 0 && !isLoadingBaseCamps && (
                <p className="text-destructive text-xs mt-1">No base camps available. Please try again later.</p>
              )}
            </div>

            <div>
              <Label htmlFor="scheduled-date">Scheduled Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="scheduled-date"
                    variant="outline"
                    className="w-full pl-3 text-left font-normal flex justify-between items-center"
                  >
                    {scheduledDate ? (
                      format(scheduledDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={handleDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-1">
                Select when you expect the donation to be delivered or processed
              </p>
            </div>
          </div>

          <TabsContent value="resource">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitResourceDonation)} className="space-y-6">
                {/* Resource Suggestions */}
                <div>
                  <div className="text-sm font-medium mb-2">Quick Add Resources</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resourceSuggestions.slice(0, 8).map((suggestion, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestedResource(suggestion)}
                        className="h-8"
                      >
                        {suggestion.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base">Resources</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", quantity: 1, unit: "units" })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Resource
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded-md">
                      No resources added yet. Click "Add Resource" or use the quick add buttons above.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-end border p-3 rounded-md">
                          <FormField
                            control={form.control}
                            name={`resources.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Water Bottles" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`resources.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="w-24">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      field.onChange(isNaN(value) ? "" : value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`resources.${index}.unit`}
                            render={({ field }) => (
                              <FormItem className="w-32">
                                <FormLabel>Unit</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {resourceUnits.map((unit) => (
                                      <SelectItem key={unit} value={unit}>
                                        {unit}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="mb-0.5"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {form.formState.errors.resources?.message && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.resources.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting || resourceDonationMutation.isPending || !selectedBaseCamp}
                  >
                    {(isSubmitting || resourceDonationMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Schedule Resource Donation"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="cash">
            {showCashPayment ? (
              <RazorpayPayment 
                amount={presetAmount || 0}
                onSuccess={handleCashPaymentSuccess}
                onCancel={() => setShowCashPayment(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="p-6 flex flex-col h-auto"
                    onClick={() => handleInitiateCashDonation(100)}
                    disabled={!selectedBaseCamp}
                  >
                    <span className="text-2xl font-bold mb-1">₹100</span>
                    <span className="text-xs text-muted-foreground">Basic Support</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-6 flex flex-col h-auto"
                    onClick={() => handleInitiateCashDonation(500)}
                    disabled={!selectedBaseCamp}
                  >
                    <span className="text-2xl font-bold mb-1">₹500</span>
                    <span className="text-xs text-muted-foreground">Standard Support</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-6 flex flex-col h-auto"
                    onClick={() => handleInitiateCashDonation(1000)}
                    disabled={!selectedBaseCamp}
                  >
                    <span className="text-2xl font-bold mb-1">₹1000</span>
                    <span className="text-xs text-muted-foreground">Premium Support</span>
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Or enter a custom amount and complete your payment</p>
                  <Button 
                    onClick={() => handleInitiateCashDonation()}
                    disabled={!selectedBaseCamp}
                  >
                    Proceed to Payment
                  </Button>
                </div>
                
                <div className="rounded-md border p-4 mt-4 bg-muted/20">
                  <h4 className="font-medium mb-2">How Cash Donations Help</h4>
                  <p className="text-sm text-muted-foreground">
                    Your cash donations provide immediate financial support that helps us purchase essential 
                    supplies, medical resources, and emergency provisions for those affected by disasters.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonationForm;