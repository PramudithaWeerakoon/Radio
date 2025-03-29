"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Music, Share2, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { YouTubeDialog } from "@/components/youtube-dialog";

interface Album {
  id: number;
  title: string;
  releaseDate: string;
  coverArt: string;
  description: string;
  tracks: { title: string; duration: string }[];
  credits: { role: string; name: string }[];
  youtubeId: string;
}

interface AlbumDetailsProps {
  album: Album;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/albums">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Albums
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div
                  className="aspect-square bg-cover bg-center"
                  style={{ backgroundImage: `url(${album.coverArt})` }}
                />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">{album.title}</h1>
                      <p className="text-muted-foreground">{album.releaseDate}</p>
                    </div>
                    <p className="text-muted-foreground">{album.description}</p>
                    <div className="flex space-x-4">
                      <Button 
                        className="flex-1"
                        onClick={() => setIsVideoOpen(true)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Play All
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tracks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {album.tracks.map((track, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer ${
                          currentTrack === index ? "bg-muted" : ""
                        }`}
                        onClick={() => {
                          setCurrentTrack(currentTrack === index ? null : index);
                          setIsVideoOpen(true);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            {currentTrack === index ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-muted-foreground">Track {index + 1}</p>
                          </div>
                        </div>
                        <span className="text-muted-foreground">{track.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {album.credits.map((credit, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3"
                      >
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{credit.name}</p>
                          <p className="text-sm text-muted-foreground">{credit.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <YouTubeDialog
        videoId={album.youtubeId}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}