import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string, amount: number) => void;
  onCancel: () => void;
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  onSuccess,
  onCancel,
  name = '',
  email = '',
  phone = '',
  description = 'Cash Donation for Disaster Relief'
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [donorName, setDonorName] = useState(name);
  const [donorEmail, setDonorEmail] = useState(email);
  const [donorPhone, setDonorPhone] = useState(phone);
  const [donationAmount, setDonationAmount] = useState(amount > 0 ? amount : 100);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = async () => {
      setIsLoading(true);
      try {
        if (window.Razorpay) {
          setIsScriptLoaded(true);
          setIsLoading(false);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          setIsScriptLoaded(true);
          setScriptError(false);
          setIsLoading(false);
        };
        
        script.onerror = () => {
          setIsScriptLoaded(false);
          setScriptError(true);
          setIsLoading(false);
          console.error('Failed to load Razorpay script');
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        setIsScriptLoaded(false);
        setScriptError(true);
        setIsLoading(false);
      }
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast({
        title: 'Payment Service Unavailable',
        description: 'The payment service is currently unavailable. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    if (!donorName || !donorEmail || !donorPhone || donationAmount <= 0) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and provide a valid donation amount',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, you would get the order ID from your server
      // For this demo, we'll create the payment options directly
      const options = {
        key: 'rzp_test_D0chz2zvngmBQp', // Enter the Key ID generated from the Razorpay Dashboard
        amount: donationAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Rapid Aid Connect',
        description: description,
        image: '/favicon.ico', // Add your organization logo
        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone,
        },
        theme: {
          color: '#3399cc',
        },
        handler: function (response: any) {
          if (response.razorpay_payment_id) {
            toast({
              title: 'Payment Successful',
              description: `Thank you for your generous donation of ₹${donationAmount}`,
            });
            // Pass both the payment ID and amount back to the parent component
            onSuccess(response.razorpay_payment_id, donationAmount);
          } else {
            toast({
              title: 'Payment Failed',
              description: 'Your payment could not be processed. Please try again.',
              variant: 'destructive',
            });
            onCancel();
          }
          setIsLoading(false);
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            onCancel();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response: any) {
        toast({
          title: 'Payment Failed',
          description: `Error: ${response.error.description}`,
          variant: 'destructive',
        });
        setIsLoading(false);
        onCancel();
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      onCancel();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cash Donation</CardTitle>
        <CardDescription>
          Your generous contribution helps us provide immediate relief to those affected by disasters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scriptError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment gateway is currently unavailable. Please try again later or contact support.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={donorPhone}
            onChange={(e) => setDonorPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Donation Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            min="10"
            value={donationAmount}
            onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
            placeholder="Enter donation amount"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={isLoading || !isScriptLoaded || scriptError || !donorName || !donorEmail || !donorPhone || donationAmount <= 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Donate ₹${donationAmount}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RazorpayPayment;