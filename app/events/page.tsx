"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Loader2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const venues = ["All Venues", "Madison Square Garden", "Blue Note Jazz Club", "Central Park"];
const priceRanges = ["All Prices", "Under $50", "$50-$100", "Over $100"];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to load events');
        }
        
        const data = await response.json();
        
        // Process events to include image URLs for database images
        const processedEvents = data.events.map((event: any) => ({
          ...event,
          // If the event has image data stored in DB, create a URL to fetch it with cache busting
          imageUrl: event.imageName ? `/api/events/${event.id}/image?t=${Date.now()}` : null,
          // Keep any existing image URL or use a placeholder
          image: event.image || "https://placehold.co/600x400?text=No+Image"
        }));
        
        setEvents(processedEvents || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    // Fix date comparison by comparing year, month, and day components instead of strings
    const matchesDate = !date || isSameDay(new Date(event.date), date);
    
    const matchesVenue = selectedVenue === "All Venues" || event.venue === selectedVenue;
    const matchesPrice = selectedPrice === "All Prices" || 
      (selectedPrice === "Under $50" && event.price < 50) ||
      (selectedPrice === "$50-$100" && event.price >= 50 && event.price <= 100) ||
      (selectedPrice === "Over $100" && event.price > 100);

    return matchesDate && matchesVenue && matchesPrice;
  });

  // Helper function to compare if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us at our next performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue} value={venue}>
                          {venue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Dialog key={event.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-[300px,1fr] gap-6">
                        <div
                          className="h-48 md:h-full bg-cover bg-center relative"
                          style={{ 
                            backgroundImage: event.imageUrl 
                              ? `url(${event.imageUrl})` 
                              : `url(${event.image})`
                          }}
                        >
                          {event.imageUrl && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                              <ImageIcon className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {format(new Date(event.date), "MMMM d, yyyy")}
                                {event.time && ` at ${event.time}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>${parseFloat(event.price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6">
                      <div
                        className="h-64 w-full bg-cover bg-center rounded-lg"
                        style={{ 
                          backgroundImage: event.imageUrl 
                            ? `url(${event.imageUrl})` 
                            : `url(${event.image})`
                        }}
                      />
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{event.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>${event.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {event.availableSeats} seats available
                          </p>
                          <Button asChild>
                            <Link href={`/booking/${event.id}`}>Book Tickets</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}