import { AlbumDetails } from "@/components/album-details";

const albums = [
  {
    id: 1,
    title: "Echoes of Tomorrow",
    releaseDate: "2024",
    coverArt: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Our latest album featuring a blend of classical rock and modern electronic elements. A journey through sound that pushes the boundaries of our musical evolution while staying true to our roots.",
    tracks: [
      { title: "Midnight Dreams", duration: "4:32" },
      { title: "Electric Sunset", duration: "3:45" },
      { title: "Urban Symphony", duration: "5:18" },
      { title: "Neon Lights", duration: "4:15" },
      { title: "Digital Rain", duration: "4:52" },
      { title: "Future Past", duration: "3:58" },
      { title: "Crystal Clear", duration: "4:23" },
      { title: "Eternal Echo", duration: "5:07" },
    ],
    credits: [
      { role: "Lead Vocals", name: "Alex Rivers" },
      { role: "Lead Guitar", name: "Sarah Chen" },
      { role: "Drums", name: "Marcus Thompson" },
      { role: "Producer", name: "Jane Smith" },
    ],
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "City Lights",
    releaseDate: "2023",
    coverArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "A journey through the urban landscape with powerful guitar riffs and melodic vocals.",
    tracks: [
      { title: "Downtown", duration: "3:56" },
      { title: "Night Drive", duration: "4:12" },
      { title: "Streetlight Serenade", duration: "4:45" },
      { title: "Urban Jungle", duration: "3:58" },
    ],
    credits: [
      { role: "Lead Vocals", name: "Alex Rivers" },
      { role: "Lead Guitar", name: "Sarah Chen" },
      { role: "Drums", name: "Marcus Thompson" },
    ],
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Acoustic Sessions",
    releaseDate: "2022",
    coverArt: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "A stripped-down collection of our biggest hits, reimagined in an intimate acoustic setting.",
    tracks: [
      { title: "Unplugged Dreams", duration: "4:15" },
      { title: "Raw Emotions", duration: "3:48" },
      { title: "Simple Truth", duration: "4:32" },
      { title: "Natural Echo", duration: "5:02" },
    ],
    credits: [
      { role: "Lead Vocals", name: "Alex Rivers" },
      { role: "Lead Guitar", name: "Sarah Chen" },
      { role: "Drums", name: "Marcus Thompson" },
    ],
    youtubeId: "dQw4w9WgXcQ"
  },
];

export function generateStaticParams() {
  return albums.map((album) => ({
    id: album.id.toString(),
  }));
}

export default function AlbumPage({ params }: { params: { id: string } }) {
  const album = albums.find((a) => a.id === parseInt(params.id)) || albums[0];
  return <AlbumDetails album={album} />;
}