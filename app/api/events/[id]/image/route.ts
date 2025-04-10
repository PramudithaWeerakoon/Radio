import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const eventId = parseInt(context.params.id);
    
    if (isNaN(eventId)) {
      return new NextResponse('Invalid event ID', { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        imageData: true,
        imageMimeType: true,
        imageName: true
      }
    });

    if (!event || !event.imageData) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Return the image with the appropriate content type
    const response = new NextResponse(event.imageData);
    response.headers.set('Content-Type', event.imageMimeType || 'image/jpeg');
    response.headers.set('Content-Disposition', `inline; filename="${event.imageName || 'event-image'}"`);
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for a year
    
    return response;
  } catch (error) {
    console.error('Error fetching event image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
