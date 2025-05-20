import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get all events
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : undefined;

    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      ...(limit ? { take: limit } : {}),
    });
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the form data instead of JSON
    const formData = await request.formData();    // Extract basic event info from form data
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const venue = formData.get('venue') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string || 'others'; // Default to 'others' if not provided
      // Extract image file if it exists
    const imageFile = formData.get('image') as File | null;
    
    // Set date as a DateTime object
    const eventDateTime = new Date(date);
      
    // Prepare the event data for database
    const eventData: any = {
      title,
      date: eventDateTime,
      venue,
      description,
      category,
      // Set default values for removed fields
      price: 0,
      availableSeats: 0,
    };
      // Process image if provided
    if (imageFile && imageFile instanceof File) {
      // Convert file to binary data for database storage
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      
      // Add image data to event
      eventData.imageName = imageFile.name;
      eventData.imageData = imageBuffer;
      eventData.imageMimeType = imageFile.type;
    }
    
    console.log('Event data to create:', { 
      ...eventData,
      imageData: eventData.imageData ? 'Binary data' : null 
    });
    
    // Create the event with image data
    const event = await prisma.event.create({
      data: eventData,
    });
    
    return NextResponse.json(event, { status: 201 });  } catch (error) {
    console.error('Failed to create event:', error);
    // Log the detailed error if it's a Prisma error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
