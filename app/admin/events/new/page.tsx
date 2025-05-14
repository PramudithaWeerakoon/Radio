"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, ArrowLeft, Upload, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import Link from "next/link";
import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function NewEventPage() {
  console.log("Event form version: May 14, 2025 - No time/price/seats fields");
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    description: "",
  });
  const [category, setCategory] = useState<string>(""); // Track category separately
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Event category definitions - kept in sync with frontend display
  const eventCategories = [
    { id: "hotel-lounges", title: "Hotel Lounges & Bars" },
    { id: "theme-nights", title: "Weekly Theme Nights" },
    { id: "private-corporate", title: "Private & Corporate Functions" },
    { id: "weddings", title: "Wedding Receptions" },
    { id: "seasonal", title: "Seasonal Festivals" },
    { id: "others", title: "Others" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category for the event",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add all text fields to FormData
      (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      // Add date in the required format
      submitData.append("date", date.toISOString().split("T")[0]);

      // Add category
      submitData.append("category", category);

      // Add image file if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: submitData, // Send as FormData, not JSON
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      toast({
        title: "Success",
        description: "Event documented successfully",
      });

      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />{" "}
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Document Event</h1>
          <p className="text-muted-foreground mt-1">
            Add a past event to your portfolio (you can select past dates)
          </p>
        </div>
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
            <div className="space-y-2">
              <Label htmlFor="category">Event Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>{" "}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    fromYear={2000}
                    toYear={2030}
                    captionLayout="dropdown-buttons"
                  />
                </PopoverContent>
              </Popover>
            </div>{" "}
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
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload an image
                  </p>
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
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="description">Event Details</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the event: what happened, who attended, highlight moments, etc."
                className="min-h-[150px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/events")}
              >
                Cancel
              </Button>{" "}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
