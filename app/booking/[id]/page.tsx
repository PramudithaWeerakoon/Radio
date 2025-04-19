"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CreditCard, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from 'react';
import Loading from "../../loading";

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap params promise
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.id;
  const router = useRouter();
  // Use toast directly without destructuring

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState("1");
  const [bookingStep, setBookingStep] = useState(1); // 1: Select seats, 2: Enter payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: ""
  });

  // Fetch event details based on ID
  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load event details');
        }
        
        const data = await response.json();
        setEvent(data.event);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event information');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEventDetails();
  }, [eventId]);

  // Update total price when selectedSeats changes
  const totalPrice = event ? parseFloat(event.price) * parseInt(selectedSeats) : 0;

  // Handle seat selection change
  const handleSeatsChange = (value: string) => {
    // Don't allow selecting more seats than available
    const requestedSeats = parseInt(value);
    if (event && requestedSeats > event.availableSeats) {
      toast({
        title: "Not enough seats available",
        description: `Only ${event.availableSeats} seats available for this event`,
        variant: "destructive"
      });
      return;
    }
    setSelectedSeats(value);
  };

  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for payment
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 
      'cardNumber', 'expiryDate', 'cvc'
    ];
    
    const missingFields = requiredFields.filter(field => !paymentInfo[field as keyof typeof paymentInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paymentInfo.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the booking
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          seats: parseInt(selectedSeats),
          customerInfo: {
            firstName: paymentInfo.firstName,
            lastName: paymentInfo.lastName,
            email: paymentInfo.email,
          },
          // In a real app, you'd use a secure payment processor and not send card details directly
          // This is just for demo purposes
          paymentMethod: "card"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process booking');
      }
      
      const data = await response.json();
      
      // Set success state
      setBookingComplete(true);
      setBookingReference(data.bookingReference);
      setBookingStep(3);
      
      // Show success toast
      toast({
        title: "Booking successful!",
        description: `Your booking reference is ${data.bookingReference}`,
      });
      
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: "Payment failed",
        description: err.message || "There was a problem processing your payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Event not found"}
            <div className="mt-4">
              <Link href="/events">
                <Button variant="outline">Back to Events</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
            Book Tickets
          </h1>
          <p className="text-xl text-muted-foreground">
            {event.title}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {bookingStep === 3 && bookingComplete ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  Booking Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div>
                  <p className="text-xl font-medium">{event.title}</p>
                  <p className="text-muted-foreground">
                    {selectedSeats} {parseInt(selectedSeats) === 1 ? "ticket" : "tickets"}
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Booking Reference</p>
                  <p className="text-2xl font-mono">{bookingReference}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep this reference for your records
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p>A confirmation email has been sent to:</p>
                  <p className="font-medium">{paymentInfo.email}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Link href="/events">
                    <Button className="w-full">Back to Events</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{bookingStep === 1 ? "Ticket Details" : "Payment Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {bookingStep === 1 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm pb-2">
                        <span>Event:</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between text-sm pb-2">
                        <span>Date:</span>
                        <span className="font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pb-2">
                        <span>Time:</span>
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Venue:</span>
                        <span className="font-medium">{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Select value={selectedSeats} onValueChange={handleSeatsChange}>
                        <SelectTrigger id="seats">
                          <SelectValue placeholder="Select number of seats" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: Math.min(10, event.availableSeats) }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "seat" : "seats"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {event.availableSeats} seats available
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Price per ticket</span>
                        <span>${parseFloat(event.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Number of tickets</span>
                        <span>{selectedSeats}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <form className="space-y-6" onSubmit={handlePayment}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={paymentInfo.firstName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={paymentInfo.lastName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={paymentInfo.email}
                        onChange={handlePaymentChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Booking confirmation will be sent to this email</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate" 
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          name="cvc"
                          placeholder="123"
                          value={paymentInfo.cvc}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode"
                          placeholder="12345"
                          value={paymentInfo.zipCode}
                          onChange={handlePaymentChange}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2">
                {bookingStep === 1 ? (
                  <div className="w-full">
                    <Button 
                      onClick={() => setBookingStep(2)} 
                      className="w-full"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setBookingStep(1)} 
                      className="w-full sm:w-auto"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto" 
                      disabled={isProcessing}
                      onClick={handlePayment}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ${totalPrice.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}