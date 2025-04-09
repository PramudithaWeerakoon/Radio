import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid track ID' }, 
        { status: 400 }
      );
    }
    
    const track = await prisma.track.findUnique({
      where: { id },
      select: {
        audioData: true,
        audioMimeType: true,
        audioFileName: true
      }
    });
    
    if (!track || !track.audioData) {
      return NextResponse.json(
        { success: false, error: 'Track not found or has no audio data' }, 
        { status: 404 }
      );
    }
    
    // Create response with appropriate headers for audio streaming
    const response = new NextResponse(track.audioData);
    
    // Set correct content type for the audio file
    response.headers.set('Content-Type', track.audioMimeType || 'audio/mpeg');
    response.headers.set('Content-Disposition', `inline; filename="${track.audioFileName}"`);
    
    return response;
  } catch (error) {
    console.error('Error fetching track audio:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch track audio',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
