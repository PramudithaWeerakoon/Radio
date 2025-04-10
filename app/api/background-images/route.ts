import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get all background images
export async function GET() {
  try {
    const backgroundImages = await prisma.backgroundImage.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Transform the binary data to base64 for client-side use
    const formattedImages = backgroundImages.map(image => ({
      id: image.id,
      title: image.title,
      imageUrl: `data:${image.imageMimeType};base64,${Buffer.from(image.imageData).toString('base64')}`,
      order: image.order,
      isActive: image.isActive,
      createdAt: image.createdAt
    }));
    
    return NextResponse.json({ success: true, images: formattedImages });
  } catch (error) {
    console.error('Failed to fetch background images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch background images' },
      { status: 500 }
    );
  }
}

// Upload a new background image
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const image = formData.get('image') as File;
    const order = parseInt(formData.get('order') as string) || 0;
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Process the uploaded image
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageMimeType = image.type;

    const backgroundImage = await prisma.backgroundImage.create({
      data: {
        title: title || 'Hero Background',
        imageData: imageBuffer,
        imageMimeType,
        order,
        isActive: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Background image uploaded successfully',
      image: {
        id: backgroundImage.id,
        title: backgroundImage.title,
        order: backgroundImage.order,
        isActive: backgroundImage.isActive,
        createdAt: backgroundImage.createdAt
      }
    });
  } catch (error) {
    console.error('Failed to upload background image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload background image' },
      { status: 500 }
    );
  }
}
