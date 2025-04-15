import { AlbumDetails } from "@/components/album-details";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  // Get album data from database
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return notFound();
  }

  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        tracks: { orderBy: { track_number: 'asc' } },
        album_credits: true
      }
    });

    if (!album) {
      return notFound();
    }

    // Format the album data for the frontend component
    const formattedAlbum = {
      id: album.id,
      title: album.title,
      releaseDate: album.release_date ? new Date(album.release_date).getFullYear().toString() : 'Unknown',
      coverArt: album.coverImageData ? `/api/albums/${album.id}/cover` : '/placeholder-album.jpg',
      description: album.description || '',
      tracks: album.tracks.map(track => ({
        title: track.title,
        duration: track.duration || ''
      })),
      credits: album.album_credits.map(credit => ({
        role: credit.role,
        name: credit.name
      })),
      youtubeId: album.youtube_id || ''
    };

    return <AlbumDetails album={formattedAlbum} />;
  } catch (error) {
    console.error("Error loading album:", error);
    return notFound();
  }
}

// Generate static params is removed since we're using dynamic data