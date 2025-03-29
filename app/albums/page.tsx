"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Music } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { YouTubeDialog } from "@/components/youtube-dialog";

const albums = [
  {
    id: 1,
    title: "Echoes of Tomorrow",
    releaseDate: "2024",
    coverArt: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tracks: [
      { title: "Midnight Dreams", duration: "4:32" },
      { title: "Electric Sunset", duration: "3:45" },
      { title: "Urban Symphony", duration: "5:18" },
      { title: "Neon Lights", duration: "4:15" },
    ],
    description: "Our latest album featuring a blend of classical rock and modern electronic elements.",
    youtubeId: "dQw4w9WgXcQ" // Example YouTube video ID
  },
  {
    id: 2,
    title: "City Lights",
    releaseDate: "2023",
    coverArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tracks: [
      { title: "Downtown", duration: "3:56" },
      { title: "Night Drive", duration: "4:12" },
      { title: "Streetlight Serenade", duration: "4:45" },
      { title: "Urban Jungle", duration: "3:58" },
    ],
    description: "A journey through the urban landscape with powerful guitar riffs and melodic vocals.",
    youtubeId: "dQw4w9WgXcQ" // Example YouTube video ID
  },
  {
    id: 3,
    title: "Acoustic Sessions",
    releaseDate: "2022",
    coverArt: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tracks: [
      { title: "Unplugged Dreams", duration: "4:15" },
      { title: "Raw Emotions", duration: "3:48" },
      { title: "Simple Truth", duration: "4:32" },
      { title: "Natural Echo", duration: "5:02" },
    ],
    description: "A stripped-down collection of our biggest hits, reimagined in an intimate acoustic setting.",
    youtubeId: "dQw4w9WgXcQ" // Example YouTube video ID
  },
];

export default function AlbumsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
            Our Albums
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our discography and musical journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="h-64 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${album.coverArt})` }}
                />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>{album.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">{album.releaseDate}</span>
                  </div>
                  <p className="text-muted-foreground">{album.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {album.tracks.slice(0, 2).map((track, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                        >
                          <div className="flex items-center space-x-3">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span>{track.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{track.duration}</span>
                        </div>
                      ))}
                      {album.tracks.length > 2 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{album.tracks.length - 2} more tracks
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setSelectedVideo(album.youtubeId)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Listen Now
                      </Button>
                      <Link href={`/albums/${album.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <YouTubeDialog
        videoId={selectedVideo || ""}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}