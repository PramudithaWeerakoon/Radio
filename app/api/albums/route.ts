import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      include: {
        tracks: true,
        album_credits: true
      },
      orderBy: {
        id: 'desc'  // Show newest albums first
      }
    });

    return NextResponse.json({ albums }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return NextResponse.json({ 
      message: "Failed to fetch albums",
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // First delete all related tracks and credits
    await prisma.track.deleteMany({
      where: { album_id: parseInt(id) }
    });
    
    await prisma.albumCredit.deleteMany({
      where: { album_id: parseInt(id) }
    });
    
    // Then delete the album
    await prisma.album.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: "Album deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete album:", error);
    return NextResponse.json({ 
      message: "Failed to delete album",
      error: error.message
    }, { status: 500 });
  }
}