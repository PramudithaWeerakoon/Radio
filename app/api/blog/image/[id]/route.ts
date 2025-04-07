import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Make sure to handle params properly in an async context
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    const blogPost = await prisma.blog.findUnique({
      where: { id },
      select: { imageData: true, imageMimeType: true },
    });
    
    if (!blogPost || !blogPost.imageData || !blogPost.imageMimeType) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Convert binary data back to an image
    const imageBuffer = blogPost.imageData;
    
    // Return the image with appropriate content type
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': blogPost.imageMimeType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
