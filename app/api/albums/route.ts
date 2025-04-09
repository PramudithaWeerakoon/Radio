import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create the album with its tracks and credits
    const album = await prisma.album.create({
      data: {
        title: data.title,
        release_date: new Date(data.releaseDate),
        cover_art: data.coverArtUrl,
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
      select: {
        id: true,
        title: true,
        release_date: true,
        cover_art: true,
        description: true,
        youtube_id: true,
        _count: {
          select: {
            tracks: true
          }
        }
      },
      orderBy: {
        release_date: 'desc'
      }
    });
    
    const formattedAlbums = albums.map(album => ({
      id: album.id,
      title: album.title,
      release_date: album.release_date,
      cover_art: album.cover_art || null,
      description: album.description || null,
      youtube_id: album.youtube_id || null,
      trackCount: album._count.tracks
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

