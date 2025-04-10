"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Music, Share2, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { YouTubeDialog } from "@/components/youtube-dialog";
import Image from "next/image";

interface Album {
  id: number;
  title: string;
  releaseDate: string;
  coverArt: string;
  description: string;
  tracks: { title: string; duration: string; youtubeId?: string }[];
  credits: { role: string; name: string }[];
  youtubeId: string;
}

interface AlbumDetailsProps {
  album: Album;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>("");
  
  // Debug log to check data structure
  useEffect(() => {
    console.log("Album data:", album);
    console.log("Tracks with YouTube IDs:", album.tracks.map(track => ({
      title: track.title, 
      youtubeId: track.youtubeId
    })));
  }, [album]);

  // Play all tracks starting from the first one
  const handlePlayAll = () => {
    // Use the first track with a YouTube ID or fallback to album's YouTube ID
    const firstTrackWithVideo = album.tracks.findIndex(track => track.youtubeId);
    if (firstTrackWithVideo !== -1) {
      setCurrentTrack(firstTrackWithVideo);
      setActiveVideoId(album.tracks[firstTrackWithVideo].youtubeId || album.youtubeId);
    } else {
      setCurrentTrack(0);
      setActiveVideoId(album.youtubeId);
    }
    setIsVideoOpen(true);
  };

  // Handle individual track click - Updated with more robust checking
  const handleTrackClick = (index: number) => {
    // Get the specific track
    const track = album.tracks[index];
    
    // Debug which track is clicked and its YouTube ID
    console.log(`Clicked track ${index}:`, track.title);
    console.log(`Track YouTube ID:`, track.youtubeId);
    console.log(`Album YouTube ID:`, album.youtubeId);
    
    // If clicking the current track, toggle playback state
    if (currentTrack === index) {
      setIsVideoOpen(!isVideoOpen);
      return;
    }
    
    // Set current track index
    setCurrentTrack(index);
    
    // Determine which YouTube ID to use
    let videoId = null;
    
    // First priority: Use track's specific YouTube ID if available
    if (track.youtubeId && track.youtubeId.trim() !== '') {
      console.log(`Using track's YouTube ID: ${track.youtubeId}`);
      videoId = track.youtubeId.trim();
    } 
    // Second priority: Fall back to album's YouTube ID
    else if (album.youtubeId && album.youtubeId.trim() !== '') {
      console.log(`No track YouTube ID found, using album's YouTube ID: ${album.youtubeId}`);
      videoId = album.youtubeId.trim();
    }
    
    // Set the active video ID and open dialog
    setActiveVideoId(videoId || '');
    setIsVideoOpen(true);
  };

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
                <div className="aspect-square relative">
                  <Image
                    src={album.coverArt}
                    alt={album.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
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
                        onClick={handlePlayAll}
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
                    {Array.isArray(album.tracks) && album.tracks.length > 0 ? (
                      album.tracks.map((track, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer ${
                            currentTrack === index && isVideoOpen ? "bg-muted" : ""
                          }`}
                          onClick={() => handleTrackClick(index)}
                        >
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              {currentTrack === index && isVideoOpen ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <p className="font-medium">{track.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Track {index + 1} 
                                {track.youtubeId && <span className="ml-1">• YouTube available</span>}
                              </p>
                            </div>
                          </div>
                          <span className="text-muted-foreground">{track.duration}</span>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No tracks available for this album</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(album.credits) && album.credits.length > 0 ? (
                      album.credits.map((credit, index) => (
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
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-4 text-muted-foreground">No credits information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <YouTubeDialog
        videoId={activeVideoId}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}