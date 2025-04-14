"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function EditAlbumPage({ params }) {
  // Proper way to handle params in client components with Next.js 15+
  const id = React.use(params).id;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Album state
  const [album, setAlbum] = useState({
    title: "",
    releaseDate: "",
    description: "",
    youtubeId: ""
  });
  
  // Cover image state
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  
  // Tracks state
  const [tracks, setTracks] = useState([]);
  
  // Credits state
  const [credits, setCredits] = useState([]);

  // Fetch album data when component mounts
  useEffect(() => {
    async function fetchAlbumData() {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/albums/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch album data");
        }
        
        const albumData = await response.json();
        
        // Format the date properly for the input field
        const releaseDate = albumData.album.release_date 
          ? new Date(albumData.album.release_date).toISOString().split('T')[0]
          : "";
        
        setAlbum({
          title: albumData.album.title || "",
          releaseDate: releaseDate,
          description: albumData.album.description || "",
          youtubeId: albumData.album.youtube_id || ""
        });
        
        // Set cover image preview if available
        if (albumData.album.coverImageUrl) {
          setCoverImagePreview(albumData.album.coverImageUrl);
        }
        
        // Format tracks
        const formattedTracks = albumData.album.tracks.map(track => ({
          id: track.id,
          title: track.title,
          duration: track.duration || ""
        }));
        setTracks(formattedTracks.length > 0 ? formattedTracks : [{ title: "", duration: "" }]);
        
        // Format credits
        const formattedCredits = albumData.album.album_credits.map(credit => ({
          id: credit.id,
          role: credit.role,
          name: credit.name
        }));
        setCredits(formattedCredits.length > 0 ? formattedCredits : [{ role: "", name: "" }]);

      } catch (error) {
        console.error("Error fetching album:", error);
        toast({
          title: "Error",
          description: "Failed to load album data",
          variant: "destructive"
        });
        router.push("/admin/music/albums");
      } finally {
        setIsFetching(false);
      }
    }
    
    fetchAlbumData();
  }, [id, toast, router]);
  
  // Handle album input changes
  const handleAlbumChange = (e) => {
    const { name, value } = e.target;
    setAlbum(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle cover image selection
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      
      // Create form data for multipart/form-data submission
      const formData = new FormData();
      
      // Add album data
      formData.append('title', album.title);
      formData.append('releaseDate', album.releaseDate);
      formData.append('description', album.description || '');
      formData.append('youtubeId', album.youtubeId || '');
      
      // Add cover image if selected
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      // Add tracks and credits as JSON strings
      formData.append('tracks', JSON.stringify(validTracks));
      formData.append('credits', JSON.stringify(validCredits));
      
      const response = await fetch(`/api/albums/${id}`, {
        method: "PUT",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update album");
      }
      
      toast({
        title: "Success",
        description: "Album updated successfully",
      });
      
      router.push("/admin/music/albums");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update album",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading album data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/music/albums">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Album</h1>
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
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full"
                />
              </div>
              {coverImagePreview && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Current Cover:</p>
                  <div className="relative w-32 h-32 bg-slate-100 rounded-md overflow-hidden">
                    {/* Use next/image with unoptimized to handle dynamic src */}
                    <Image 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized={coverImagePreview.startsWith('data:')}
                    />
                  </div>
                </div>
              )}
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
                {isLoading ? "Updating..." : "Update Album"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
