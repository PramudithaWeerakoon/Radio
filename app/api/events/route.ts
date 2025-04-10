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
    const formData = await request.formData();
    
    // Extract basic event info from form data
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const venue = formData.get('venue') as string;
    const price = parseFloat(formData.get('price') as string);
    const availableSeats = parseInt(formData.get('availableSeats') as string);
    const description = formData.get('description') as string;
    
    // Extract image file if it exists
    const imageFile = formData.get('image') as File | null;
    
    // Combine date and time into a single DateTime
    const eventDateTime = new Date(`${date}T${time || '00:00'}`);
    
    // Prepare the event data for database
    const eventData: any = {
      title,
      date: eventDateTime,
      venue,
      price,
      availableSeats,
      description,
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
    
    // Create the event with image data
    const event = await prisma.event.create({
      data: eventData,
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
