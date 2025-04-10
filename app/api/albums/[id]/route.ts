import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single album by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid album ID'
      }, { status: 400 });
    }
    
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        tracks: { orderBy: { track_number: 'asc' } },
        album_credits: true
      }
    });
    
    if (!album) {
      return NextResponse.json({
        success: false,
        error: 'Album not found'
      }, { status: 404 });
    }
    
    // Add coverImageUrl for frontend display
    const albumWithImageUrl = {
      ...album,
      coverImageUrl: album.coverImageData ? `/api/albums/${id}/cover` : null
    };
    
    return NextResponse.json({
      success: true,
      album: albumWithImageUrl
    });
    
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch album',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// UPDATE an album by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid album ID'
      }, { status: 400 });
    }
    
    // Check if album exists
    const existingAlbum = await prisma.album.findUnique({
      where: { id }
    });
    
    if (!existingAlbum) {
      return NextResponse.json({
        success: false,
        error: 'Album not found'
      }, { status: 404 });
    }
    
    // Get form data
    const formData = await request.formData();
    const title = formData.get('title');
    const releaseDate = formData.get('releaseDate');
    const description = formData.get('description');
    const youtubeId = formData.get('youtubeId');
    
    // Handle cover image upload if present
    const coverImage = formData.get('coverImage');
    let coverImageData = undefined;
    let coverImageName = undefined;
    let coverImageMimeType = undefined;
    
    if (coverImage && coverImage.size > 0) {
      // Process the image data
      coverImageData = Buffer.from(await coverImage.arrayBuffer());
      coverImageName = coverImage.name;
      coverImageMimeType = coverImage.type;
    }
    
    // Parse tracks and credits from form data
    const tracksJson = formData.get('tracks');
    const creditsJson = formData.get('credits');
    
    let tracks = [];
    let credits = [];
    
    try {
      if (tracksJson) tracks = JSON.parse(tracksJson);
      if (creditsJson) credits = JSON.parse(creditsJson);
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse tracks or credits data'
      }, { status: 400 });
    }
    
    // Update the album in a transaction
    const updatedAlbum = await prisma.$transaction(async (prisma) => {
      // 1. Update album basic information
      const albumUpdate = {
        title,
        release_date: new Date(releaseDate),
        description,
        youtube_id: youtubeId,
      };
      
      // Only update image data if a new image was provided
      if (coverImageData) {
        albumUpdate.coverImageData = coverImageData;
        albumUpdate.coverImageName = coverImageName;
        albumUpdate.coverImageMimeType = coverImageMimeType;
      }
      
      const album = await prisma.album.update({
        where: { id },
        data: albumUpdate
      });
      
      // 2. Handle tracks: delete existing tracks for this album
      await prisma.track.deleteMany({
        where: { album_id: id }
      });
      
      // 3. Create new tracks
      if (tracks.length > 0) {
        await prisma.track.createMany({
          data: tracks.map((track, index) => ({
            title: track.title,
            duration: track.duration || null,
            track_number: index + 1,
            album_id: id
          }))
        });
      }
      
      // 4. Handle credits: delete existing credits for this album
      await prisma.albumCredit.deleteMany({
        where: { album_id: id }
      });
      
      // 5. Create new credits
      if (credits.length > 0) {
        await prisma.albumCredit.createMany({
          data: credits.map(credit => ({
            role: credit.role,
            name: credit.name,
            album_id: id
          }))
        });
      }
      
      // Get the updated album with related records
      return await prisma.album.findUnique({
        where: { id },
        include: {
          tracks: { orderBy: { track_number: 'asc' } },
          album_credits: true
        }
      });
    });
    
    // Add image URL for frontend display
    const albumWithImageUrl = {
      ...updatedAlbum,
      coverImageUrl: updatedAlbum.coverImageData ? `/api/albums/${id}/cover` : null
    };
    
    return NextResponse.json({
      success: true,
      message: 'Album updated successfully',
      album: albumWithImageUrl
    });
    
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update album',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE an album by ID (keep existing code)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid album ID'
      }, { status: 400 });
    }
    
    // Check if album exists
    const album = await prisma.album.findUnique({
      where: { id }
    });
    
    if (!album) {
      return NextResponse.json({
        success: false,
        error: 'Album not found'
      }, { status: 404 });
    }
    
    // Delete album and related records in a transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Delete tracks related to this album
      await prisma.track.deleteMany({
        where: { album_id: id }
      });
      
      // 2. Delete credits related to this album
      await prisma.albumCredit.deleteMany({
        where: { album_id: id }
      });
      
      // 3. Delete the album itself
      await prisma.album.delete({
        where: { id }
      });
    });
    
    return NextResponse.json({
      success: true,
      message: 'Album deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete album',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
