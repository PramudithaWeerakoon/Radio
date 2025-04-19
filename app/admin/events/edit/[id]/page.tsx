"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import Link from "next/link";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { use } from "react";

// For client components in Next.js 15, we need to handle both Promise-based and direct params
// This helps ensure compatibility across different environments (local dev vs Vercel)
type PageParams = { id: string } | Promise<{ id: string }>;

interface EditEventPageProps {
  params: PageParams;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  // Handle params whether it's a Promise or direct object
  const eventId = 'then' in params 
    ? use(params as Promise<{ id: string }>).id
    : (params as { id: string }).id;
  
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    venue: "",
    price: "",
    availableSeats: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the event data when the page loads
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        
        const eventData = await response.json().then(data => data.event);
        
        // Format the date and time
        const eventDate = new Date(eventData.date);
        setDate(eventDate);

        // Extract hours and minutes for the time input, ensuring it works correctly with timezones
        const hours = eventDate.getHours().toString().padStart(2, '0');
        const minutes = eventDate.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Set the form data
        setFormData({
          title: eventData.title,
          time: timeString,
          venue: eventData.venue,
          price: eventData.price.toString(),
          availableSeats: eventData.availableSeats.toString(),
          description: eventData.description || "",
        });
        
        // Check if there's an existing image
        if (eventData.imageName) {
          // Add timestamp to prevent image caching issues
          const timestamp = Date.now();
          // Set the current image URL to display the existing image
          setCurrentImageUrl(`/api/events/${eventId}/image?t=${timestamp}`);
          setImagePreview(`/api/events/${eventId}/image?t=${timestamp}`);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchEvent();
  }, [eventId, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear the current image URL as we're replacing it
      setCurrentImageUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentImageUrl(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date for the event",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all text fields to FormData
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key as keyof typeof formData]);
      });
      
      // Add date in the required format
      submitData.append("date", date.toISOString().split('T')[0]);
      
      // Add image file if selected (a new image)
      if (imageFile) {
        submitData.append("image", imageFile);
      }
      
      // Flag to indicate if image was removed
      submitData.append("imageRemoved", (!imageFile && !currentImageUrl).toString());
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        body: submitData, // Send as FormData, not JSON
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading event details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date && date instanceof Date && !isNaN(date.getTime()) 
                        ? format(date, "PPP") 
                        : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input 
                id="venue"
                name="venue"
                placeholder="Enter venue name"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter ticket price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Input 
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  placeholder="Enter number of available seats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              {imagePreview ? (
                <div className="relative w-full h-48 bg-slate-100 rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full h-full object-cover" 
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                </div>
              )}
              <Input
                id="image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter event description"
                className="min-h-[100px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/events')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
