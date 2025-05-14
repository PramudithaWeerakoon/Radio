import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get event by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params object before accessing its properties
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event details" },
      { status: 500 }
    );
  }
}

// Update an event
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params object before accessing its properties
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Parse FormData
    const formData = await request.formData();
      // Extract basic event info from form data
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const venue = formData.get('venue') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string || 'others'; // Default to 'others' if not provided
    const imageRemoved = formData.get('imageRemoved') === 'true';
    
    // Extract image file if it exists
    const imageFile = formData.get('image') as File | null;
      // Combine date and time into a single DateTime
    const eventDateTime = new Date(date);
    
    // Prepare the event data for database update
    const eventData: any = {
      title,
      date: eventDateTime,
      venue,
      category,
      description,
      // Set default values for removed fields
      price: 0,
      availableSeats: 0,
    };
    
    // Process image update
    if (imageFile && imageFile instanceof File) {
      // Add a new image
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      eventData.imageName = imageFile.name;
      eventData.imageData = imageBuffer;
      eventData.imageMimeType = imageFile.type;
    } else if (imageRemoved) {
      // Remove existing image
      eventData.imageName = null;
      eventData.imageData = null;
      eventData.imageMimeType = null;
    }
    // If neither condition is met, keep the existing image
    
    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData,
    });
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// Delete an event
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params object before accessing its properties
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Check if the event exists
    const eventExists = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!eventExists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Delete the event
    await prisma.event.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { success: true, message: 'Event deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
