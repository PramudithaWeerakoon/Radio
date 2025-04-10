"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Music, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { YouTubeDialog } from "@/components/youtube-dialog";
import Image from "next/image";

interface Track {
  id?: number;
  title: string;
  duration: string;
  youtubeId?: string;
}

interface Album {
  id: number;
  title: string;
  releaseDate: string;
  coverArt: string;
  description: string;
  tracks: Track[];
  credits: { role: string; name: string }[];
  youtubeId: string;
}

interface AlbumDetailsProps {
  album: Album;
}

// Debug helper function
const debugLog = (message: string, data?: any) => {
  console.log(`[AlbumDetails] ${message}`, data || '');
};

export function AlbumDetails({ album }: AlbumDetailsProps) {
  // State
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>("");
  const [trackYoutubeIds, setTrackYoutubeIds] = useState<Map<number | string, string>>(new Map());
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Fetch track-specific YouTube IDs
  useEffect(() => {
    const fetchTrackYoutubeIds = async () => {
      if (!album?.id) return;
      
      try {
        debugLog(`Fetching YouTube IDs for album ${album.id}`);
        const response = await fetch(`/api/albums/${album.id}/youtube-tracks`);
        
        if (!response.ok) {
          debugLog('Failed to fetch YouTube track data');
          setDebugInfo("Error fetching YouTube data");
          return;
        }
        
        const data = await response.json();
        debugLog('Received YouTube data', data);
        
        if (data.success && Array.isArray(data.tracks)) {
          // Create a Map for easy lookup by track ID
          const youtubeMap = new Map();
          
          data.tracks.forEach(track => {
            if (track.id && track.youtube_id) {
              youtubeMap.set(track.id, track.youtube_id);
              debugLog(`Mapped track ${track.id} to YouTube ID ${track.youtube_id}`);
            }
            
            // Also map by title for tracks with no ID
            if (track.title && track.youtube_id) {
              youtubeMap.set(track.title.toLowerCase(), track.youtube_id);
              debugLog(`Mapped track title "${track.title}" to YouTube ID ${track.youtube_id}`);
            }
          });
          
          setTrackYoutubeIds(youtubeMap);
          
          // Log actual contents of the map for debugging
          const mapDebug = Array.from(youtubeMap.entries()).map(([key, val]) => `${key}: ${val}`).join(', ');
          setDebugInfo(`Loaded ${youtubeMap.size} track YouTube IDs: ${mapDebug}`);
          debugLog(`Track YouTube ID map: ${mapDebug}`);
        }
      } catch (err) {
        debugLog('Error fetching YouTube data:', err);
        setDebugInfo("Failed to fetch YouTube data");
      }
    };
    
    fetchTrackYoutubeIds();
  }, [album?.id]);
  
  // Get YouTube ID for a specific track
  const getTrackYoutubeId = (track: Track): string | null => {
    // First check if the track has a direct youtubeId property
    if (track.youtubeId) {
      debugLog(`Using direct track YouTube ID: ${track.youtubeId}`);
      return track.youtubeId;
    }
    
    // Then check our API data using the track ID
    if (track.id && trackYoutubeIds.has(track.id)) {
      const youtubeId = trackYoutubeIds.get(track.id);
      debugLog(`Found YouTube ID by track ID ${track.id}: ${youtubeId}`);
      return youtubeId || null;
    }

    // Try to find by title if ID match failed
    if (track.title) {
      // Try exact title match
      const title = track.title.toLowerCase();
      if (trackYoutubeIds.has(title)) {
        const youtubeId = trackYoutubeIds.get(title);
        debugLog(`Found YouTube ID by exact title match "${title}": ${youtubeId}`);
        return youtubeId;
      }
      
      // Try case-insensitive title matching against all tracks
      debugLog(`Trying to find YouTube ID by title: "${track.title}"`);
      
      // Check if title contains "robinson" specifically (special case)
      if (title.includes("robinson")) {
        const robinsonEntry = Array.from(trackYoutubeIds.entries())
          .find(([key, val]) => 
            typeof key === "string" && 
            key.toLowerCase().includes("robinson")
          );
        
        if (robinsonEntry) {
          debugLog(`Found special case "robinson" YouTube ID: ${robinsonEntry[1]}`);
          return robinsonEntry[1];
        }
      }
      
      // Try direct numerical ID lookup from the array (not the map)
      // This is to handle cases where we have track numbers in the UI but IDs in the API
      for (let i = 0; i < album.tracks.length; i++) {
        if (album.tracks[i].title === track.title) {
          // Track numbers are typically 1-based, but array indices are 0-based
          const trackNum = i + 4; // Adding offset for ID (if track IDs start from 4)
          if (trackYoutubeIds.has(trackNum)) {
            const youtubeId = trackYoutubeIds.get(trackNum);
            debugLog(`Found YouTube ID by calculated ID ${trackNum}: ${youtubeId}`);
            return youtubeId;
          }
        }
      }
    }
    
    debugLog(`No YouTube ID found for track "${track.title}" (ID: ${track.id || 'unknown'})`);
    return null;
  };

  // Play YouTube video for a track
  const playTrackVideo = (index: number) => {
    const track = album.tracks[index];
    debugLog(`Attempting to play track ${index}: "${track.title}" (ID: ${track.id || 'unknown'})`);
    
    // Toggle if already playing this track
    if (currentTrack === index && isVideoOpen) {
      setIsVideoOpen(false);
      return;
    }
    
    setCurrentTrack(index);
    
    // Get the YouTube ID for this track
    const trackYoutubeId = getTrackYoutubeId(track);
    
    if (trackYoutubeId) {
      // Use track-specific YouTube ID
      debugLog(`Playing YouTube ID: ${trackYoutubeId} for track "${track.title}"`);
      setActiveVideoId(trackYoutubeId);
    } else {
      // Fall back to album's YouTube ID
      debugLog(`No track-specific YouTube ID found for "${track.title}", falling back to album ID: ${album.youtubeId}`);
      setActiveVideoId(album.youtubeId);
    }
    
    setIsVideoOpen(true);
  };

  // Check if a track has its own YouTube ID
  const hasOwnYoutubeId = (track: Track): boolean => {
    if (track.youtubeId) return true;
    if (track.id && trackYoutubeIds.has(track.id)) return true;
    return false;
  };

  // Play all button handler
  const handlePlayAll = () => {
    // Find first track with YouTube ID
    const firstTrackWithVideo = album.tracks.findIndex(track => hasOwnYoutubeId(track));
    
    if (firstTrackWithVideo !== -1) {
      playTrackVideo(firstTrackWithVideo);
    } else if (album.tracks.length > 0) {
      // Play first track with album YouTube ID
      setCurrentTrack(0);
      setActiveVideoId(album.youtubeId);
      setIsVideoOpen(true);
    }
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
            {/* Album cover and info */}
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

            {/* Tracks */}
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
                      album.tracks.map((track, index) => {
                        // Check if this track has its own YouTube ID
                        const hasYouTube = hasOwnYoutubeId(track);
                        // Get the actual YouTube ID for this track (for debugging display)
                        const trackYtId = getTrackYoutubeId(track);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer ${
                              currentTrack === index && isVideoOpen ? "bg-muted" : ""
                            }`}
                            onClick={() => playTrackVideo(index)}
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
                                  {hasYouTube && (
                                    <span className="ml-1 text-green-500">• YouTube</span>
                                  )}
                                  {debugInfo && track.id && (
                                    <span className="ml-1 text-xs text-muted-foreground">
                                      ID: {track.id} 
                                      {trackYtId && ` (YT: ${trackYtId.substring(0, 6)}...)`}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <span className="text-muted-foreground">{track.duration}</span>
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No tracks available for this album</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Credits */}
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

      {/* YouTube dialog */}
      <YouTubeDialog
        videoId={activeVideoId}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}