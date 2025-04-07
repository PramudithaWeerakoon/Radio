import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get all events
export async function GET(request: Request) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
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
    const data = await request.json();
    
    // Combine date and time into a single DateTime
    const eventDateTime = new Date(
      `${data.date}T${data.time || '00:00'}`
    );
    
    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: eventDateTime,
        venue: data.venue,
        price: parseFloat(data.price),
        availableSeats: parseInt(data.availableSeats),
        imageUrl: data.imageUrl,
        description: data.description,
      },
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
