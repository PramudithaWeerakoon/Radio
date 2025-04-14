import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

type BookingRequest = {
  eventId: string;
  seats: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentMethod: string;
};

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validate required fields
    const { eventId, seats, customerInfo, paymentMethod } = body;
    
    if (!eventId || !seats || !customerInfo || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get the event and check seat availability
      const event = await tx.event.findUnique({
        where: { id: parseInt(eventId) },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.availableSeats < seats) {
        throw new Error(`Not enough seats available. Only ${event.availableSeats} remaining.`);
      }

      // In a real application, we would process payment here
      // For this example, we'll simulate successful payment
      
      // Generate a booking reference
      const bookingReference = `BK-${randomUUID().substring(0, 8).toUpperCase()}`;
      
      // Create booking in database
      const booking = await tx.booking.create({
        data: {
          eventId: parseInt(eventId),
          numberOfSeats: seats,
          totalAmount: event.price * seats,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
          paymentMethod: paymentMethod,
          bookingReference: bookingReference,
          status: "confirmed"
        }
      });
      
      // Update event's available seats
      const updatedEvent = await tx.event.update({
        where: { id: parseInt(eventId) },
        data: { availableSeats: { decrement: seats } }
      });

      return {
        booking,
        updatedEvent,
        bookingReference
      };
    });
    
    // Send email confirmation in a real app
    // For demo, we'll just log it
    console.log(`Booking confirmation email sent to: ${customerInfo.email}`);
    
    return NextResponse.json({
      success: true,
      message: "Booking confirmed successfully",
      bookingReference: result.bookingReference,
      bookingId: result.booking.id,
      bookingDetails: {
        event: result.updatedEvent.title,
        seats: seats,
        totalAmount: result.booking.totalAmount,
        date: result.updatedEvent.date,
        venue: result.updatedEvent.venue
      }
    });
    
  } catch (error: any) {
    console.error("Error processing booking:", error);
    
    // Check if it's a known error we threw
    if (error.message.includes("Not enough seats") || error.message.includes("Event not found")) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process booking request", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}