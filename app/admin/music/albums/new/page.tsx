"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function NewAlbumPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Album state
  const [album, setAlbum] = useState({
    title: "",
    releaseDate: "",
    coverArtUrl: "",
    description: "",
    youtubeId: ""
  });
  
  // Tracks state
  const [tracks, setTracks] = useState([
    { title: "", duration: "" },
    { title: "", duration: "" },
    { title: "", duration: "" }
  ]);
  
  // Credits state
  const [credits, setCredits] = useState([
    { role: "", name: "" },
    { role: "", name: "" }
  ]);
  
  // Handle album input changes
  const handleAlbumChange = (e) => {
    const { name, value } = e.target;
    setAlbum(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle track input changes
  const handleTrackChange = (index, field, value) => {
    setTracks(prev => 
      prev.map((track, i) => 
        i === index ? { ...track, [field]: value } : track
      )
    );
  };
  
  // Handle credit input changes
  const handleCreditChange = (index, field, value) => {
    setCredits(prev => 
      prev.map((credit, i) => 
        i === index ? { ...credit, [field]: value } : credit
      )
    );
  };
  
  // Add new track
  const addTrack = () => {
    setTracks(prev => [...prev, { title: "", duration: "" }]);
  };
  
  // Remove track
  const removeTrack = (index) => {
    setTracks(prev => prev.filter((_, i) => i !== index));
  };
  
  // Add new credit
  const addCredit = () => {
    setCredits(prev => [...prev, { role: "", name: "" }]);
  };
  
  // Remove credit
  const removeCredit = (index) => {
    setCredits(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Filter out empty tracks and credits
      const validTracks = tracks.filter(track => track.title.trim() !== "");
      const validCredits = credits.filter(credit => credit.role.trim() !== "" || credit.name.trim() !== "");
      
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...album,
          tracks: validTracks,
          credits: validCredits,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create album");
      }
      
      toast({
        title: "Success",
        description: "Album created successfully",
      });
      
      router.push("/admin/music/albums");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create album",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/music/albums">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Album</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Album Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter album title" 
                value={album.title}
                onChange={handleAlbumChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input 
                id="releaseDate" 
                name="releaseDate" 
                type="date" 
                value={album.releaseDate}
                onChange={handleAlbumChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverArtUrl">Cover Art URL</Label>
              <Input 
                id="coverArtUrl" 
                name="coverArtUrl" 
                placeholder="Enter cover art URL"
                value={album.coverArtUrl}
                onChange={handleAlbumChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter album description"
                className="min-h-[100px]"
                value={album.description}
                onChange={handleAlbumChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Tracks</Label>
              <div className="space-y-4">
                {tracks.map((track, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <Input value={index + 1} disabled />
                    </div>
                    <div className="col-span-7">
                      <Input 
                        placeholder={`Track ${index + 1} title`}
                        value={track.title}
                        onChange={(e) => handleTrackChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        placeholder="Duration" 
                        value={track.duration}
                        onChange={(e) => handleTrackChange(index, "duration", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => removeTrack(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={addTrack}
                >
                  Add Track
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Credits</Label>
              <div className="space-y-4">
                {credits.map((credit, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                      <Input 
                        placeholder="Role" 
                        value={credit.role}
                        onChange={(e) => handleCreditChange(index, "role", e.target.value)}
                      />
                    </div>
                    <div className="col-span-5">
                      <Input 
                        placeholder="Name" 
                        value={credit.name}
                        onChange={(e) => handleCreditChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => removeCredit(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={addCredit}
                >
                  Add Credit
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeId">YouTube Video ID</Label>
              <Input 
                id="youtubeId"
                name="youtubeId"
                placeholder="Enter YouTube video ID for album preview" 
                value={album.youtubeId}
                onChange={handleAlbumChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/music/albums">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Album"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}