"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, Plus, Edit, Trash, Music, ArrowLeft, 
  Play, Pause, Clock, Loader2, Save 
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types for our data structures
interface Track {
  id: number;
  title: string;
  artist?: string;
  album: string;
  album_id: number;
  duration: string;
  isInPlayer: boolean;
  audioFileName?: string;
}

export default function MusicPlayerAdminPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [albums, setAlbums] = useState<{id: number, title: string}[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // New track form state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [addToPlayer, setAddToPlayer] = useState(false);

  // Fetch tracks and albums on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setApiError(null);
        
        console.log("Fetching tracks data...");
        // Fetch tracks that can be added to the player
        const tracksResponse = await fetch("/api/music-player/tracks");
        
        if (!tracksResponse.ok) {
          const errorData = await tracksResponse.json().catch(() => null);
          console.error("Tracks API error response:", errorData);
          throw new Error(`Failed to fetch tracks: ${tracksResponse.status} ${tracksResponse.statusText}`);
        }
        
        const tracksData = await tracksResponse.json();
        console.log("Tracks data received:", tracksData);
        
        if (tracksData.success && tracksData.tracks) {
          setTracks(tracksData.tracks);
        } else {
          console.error("Invalid tracks response format:", tracksData);
          throw new Error("Invalid tracks data format");
        }
        
        console.log("Fetching albums data...");
        // Fetch albums for selection
        const albumsResponse = await fetch("/api/albums");
        
        if (!albumsResponse.ok) {
          const errorData = await albumsResponse.json().catch(() => null);
          console.error("Albums API error response:", errorData);
          throw new Error(`Failed to fetch albums: ${albumsResponse.status} ${albumsResponse.statusText}`);
        }
        
        const albumsData = await albumsResponse.json();
        console.log("Albums data received:", albumsData);
        
        if (albumsData.success && albumsData.albums) {
          setAlbums(albumsData.albums);
        } else {
          console.error("Invalid albums response format:", albumsData);
          throw new Error("Invalid albums data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError(error instanceof Error ? error.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to load music data. See console for details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.includes("audio")) {
        toast({
          title: "Invalid File",
          description: "Please select a valid audio file",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
      
      // Auto-fill title from filename if empty
      if (!trackTitle) {
        let filename = file.name
          .replace(/\.[^/.]+$/, "") // Remove extension
          .replace(/_/g, " "); // Replace underscores with spaces
        setTrackTitle(filename);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !trackTitle || !selectedAlbum) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and select an audio file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("audioFile", audioFile);
      formData.append("title", trackTitle);
      formData.append("artist", trackArtist);
      formData.append("albumId", selectedAlbum);
      formData.append("addToPlayer", addToPlayer.toString());
      
      const response = await fetch("/api/music-player/upload", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Upload error response:", errorData);
        throw new Error(`Failed to upload track: ${response.status} ${response.statusText}`);
      }
      
      toast({
        title: "Success",
        description: "Track uploaded successfully"
      });
      
      // Reset form
      setAudioFile(null);
      setTrackTitle("");
      setTrackArtist("");
      setSelectedAlbum("");
      setAddToPlayer(false);
      
      // Refresh tracks list
      const tracksResponse = await fetch("/api/music-player/tracks");
      const tracksData = await tracksResponse.json();
      if (tracksData.success && tracksData.tracks) {
        setTracks(tracksData.tracks);
      }
    } catch (error) {
      console.error("Error uploading track:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload track",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle track playback preview
  const togglePlayback = async (trackId: number) => {
    if (currentlyPlaying === trackId) {
      // Stop playing
      setCurrentlyPlaying(null);
    } else {
      // Start playing this track
      setCurrentlyPlaying(trackId);
      
      // In a real implementation, you would fetch and play the audio file here
      // For now, we'll just simulate playback
      setTimeout(() => {
        setCurrentlyPlaying(null);
      }, 5000);
    }
  };
  
  // Toggle track in player
  const toggleTrackInPlayer = async (trackId: number, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/music-player/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trackId,
          isInPlayer: !currentStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Toggle error response:", errorData);
        throw new Error(`Failed to update track: ${response.status} ${response.statusText}`);
      }
      
      // Update local state
      setTracks(tracks.map(track => 
        track.id === trackId ? { ...track, isInPlayer: !currentStatus } : track
      ));
      
      toast({
        title: "Success",
        description: `Track ${!currentStatus ? "added to" : "removed from"} player`
      });
    } catch (error) {
      console.error("Error toggling track in player:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update track",
        variant: "destructive"
      });
    }
  };
  
  // Filter tracks based on search query
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.artist && track.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get tracks currently in the player
  const tracksInPlayer = tracks.filter(track => track.isInPlayer);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Music Player Manager</h1>
      </div>

      {apiError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p className="font-semibold">API Error:</p>
          <p>{apiError}</p>
        </div>
      )}

      {/* Upload form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Track</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audioFile">Audio File (MP3)</Label>
                <Input 
                  id="audioFile" 
                  type="file" 
                  accept="audio/mp3,audio/mpeg"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="albumSelect">Album</Label>
                <Select 
                  value={selectedAlbum} 
                  onValueChange={setSelectedAlbum}
                  disabled={isUploading || albums.length === 0}
                >
                  <SelectTrigger id="albumSelect">
                    <SelectValue placeholder="Select album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map(album => (
                      <SelectItem key={album.id} value={album.id.toString()}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trackTitle">Title</Label>
                <Input 
                  id="trackTitle" 
                  value={trackTitle} 
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trackArtist">Artist</Label>
                <Input 
                  id="trackArtist" 
                  value={trackArtist} 
                  onChange={(e) => setTrackArtist(e.target.value)}
                  placeholder="Enter artist name"
                  disabled={isUploading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="addToPlayer" 
                checked={addToPlayer}
                onCheckedChange={(checked) => setAddToPlayer(checked === true)}
                disabled={isUploading}
              />
              <Label htmlFor="addToPlayer">Add to player immediately</Label>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading || !audioFile || !trackTitle || !selectedAlbum || albums.length === 0}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Upload Track
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Current playlist */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Playlist</h2>
        {isLoading ? (
          <Card>
            <CardContent className="p-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading playlist...</span>
            </CardContent>
          </Card>
        ) : tracksInPlayer.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No tracks in the player. Add some tracks below.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {tracksInPlayer.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between border-b last:border-0 pb-2">
                    <div className="flex items-center">
                      <div className="font-semibold mr-2">{index + 1}.</div>
                      <div>
                        <div>{track.title}</div>
                        <div className="text-sm text-muted-foreground">{track.artist || "Unknown artist"}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-muted-foreground">{track.duration}</div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleTrackInPlayer(track.id, true)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* All tracks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Tracks</h2>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading tracks...</span>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? "No tracks match your search" : "No tracks found. Upload your first track above."}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => togglePlayback(track.id)}
                        >
                          {currentlyPlaying === track.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {track.artist || "Unknown"} • {track.album} • {track.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={track.isInPlayer ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleTrackInPlayer(track.id, track.isInPlayer)}
                        >
                          {track.isInPlayer ? "Remove from Player" : "Add to Player"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
