import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create the album with its tracks and credits
    const album = await prisma.album.create({
      data: {
        title: data.title,
        release_date: new Date(data.releaseDate),
        cover_art: data.coverArtUrl || null,
        description: data.description,
        youtube_id: data.youtubeId,
        // Create tracks related to this album
        tracks: {
          create: data.tracks.map((track, index) => ({
            title: track.title,
            duration: track.duration,
            track_number: index + 1
          }))
        },
        // Create credits related to this album
        album_credits: {
          create: data.credits.map(credit => ({
            role: credit.role,
            name: credit.name
          }))
        }
      },
      include: {
        tracks: true,
        album_credits: true
      }
    });

    return NextResponse.json({
      message: "Album created successfully",
      album
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create album:", error);
    return NextResponse.json({
      message: "Failed to create album",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: {
        tracks: true,
        album_credits: true
      },
      orderBy: {
        release_date: 'desc'
      }
    });
    
    const formattedAlbums = albums.map(album => ({
      id: album.id,
      title: album.title,
      release_date: album.release_date,
      // Replace direct cover_art reference with URL to the cover image API endpoint
      cover_art: album.coverImageData ? `/api/albums/${album.id}/cover` : '/placeholder-album.jpg',
      description: album.description || null,
      youtube_id: album.youtube_id || null,
      tracks: album.tracks,
      album_credits: album.album_credits
    }));
    
    return NextResponse.json({ 
      success: true, 
      albums: formattedAlbums 
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch albums',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
