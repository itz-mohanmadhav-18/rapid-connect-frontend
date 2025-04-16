
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, LogIn, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["donor", "volunteer", "responder"], { 
    required_error: "Please select a role",
    invalid_type_error: "Role must be donor, volunteer or responder"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { user, login, signup } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const onLoginSubmit = async (data: LoginValues) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Logged in successfully",
        description: "Welcome back to Rapid Aid Connect!",
      });
      onOpenChange(false);
      
      // Navigate to the appropriate dashboard based on role
      if (user?.role === "donor") {
        navigate("/donor-dashboard");
      } else if (user?.role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (user?.role === "responder") {
        navigate("/responder-dashboard");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your email and password",
        variant: "destructive",
      });
    }
  };

  const onSignupSubmit = async (data: SignupValues) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await signup(signupData.email, signupData.password, signupData.name, signupData.role as UserRole);
      toast({
        title: "Account created successfully",
        description: "Welcome to Rapid Aid Connect!",
      });
      onOpenChange(false);
      
      // Navigate to the appropriate dashboard based on role
      if (data.role === "donor") {
        navigate("/donor-dashboard");
      } else if (data.role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (data.role === "responder") {
        navigate("/responder-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rapid Aid Connect</DialogTitle>
          <DialogDescription>
            Join the disaster response community to help those in need
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 mt-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="•••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 mt-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="•••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="•••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I want to join as</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="donor">Donor</SelectItem>
                          <SelectItem value="volunteer">Volunteer</SelectItem>
                          <SelectItem value="responder">Response Team</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={signupForm.formState.isSubmitting}>
                  {signupForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" /> Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
