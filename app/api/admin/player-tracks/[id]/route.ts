import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { type RouteParams } from 'next/dist/shared/lib/router/utils/route-matcher';

const prisma = new PrismaClient();

// Delete a player track
export async function DELETE(
  request: NextRequest, 
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Track ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the track
    await prisma.playerTrack.delete({
      where: {
        id: parseInt(id as string)
      }
    });
    
    return NextResponse.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting player track:', error);
    return NextResponse.json(
      { message: 'Failed to delete player track', error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
