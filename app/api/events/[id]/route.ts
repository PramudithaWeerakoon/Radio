import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get event by ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    const event = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// Delete an event
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params.id;
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
