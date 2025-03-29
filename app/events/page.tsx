"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";

const events = [
  {
    id: 1,
    title: "Summer Stadium Tour",
    date: "2024-07-15",
    time: "19:00",
    venue: "Madison Square Garden",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Join us for an unforgettable night of rock and roll at the legendary Madison Square Garden. Experience our biggest show yet with special guest performances and never-before-heard tracks from our upcoming album.",
    availableSeats: 250,
  },
  {
    id: 2,
    title: "Acoustic Night",
    date: "2024-08-02",
    time: "20:00",
    venue: "Blue Note Jazz Club",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "An intimate evening featuring acoustic versions of our hits. Get ready for a unique experience as we strip down our songs to their essence.",
    availableSeats: 100,
  },
  {
    id: 3,
    title: "Festival Performance",
    date: "2024-08-20",
    time: "16:30",
    venue: "Central Park",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Headlining the Summer Music Festival in Central Park. A full day of music, food, and entertainment under the summer sky.",
    availableSeats: 500,
  },
];

const venues = ["All Venues", "Madison Square Garden", "Blue Note Jazz Club", "Central Park"];
const priceRanges = ["All Prices", "Under $50", "$50-$100", "Over $100"];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");

  const filteredEvents = events.filter(event => {
    const matchesDate = !date || event.date === format(date, "yyyy-MM-dd");
    const matchesVenue = selectedVenue === "All Venues" || event.venue === selectedVenue;
    const matchesPrice = selectedPrice === "All Prices" || 
      (selectedPrice === "Under $50" && event.price < 50) ||
      (selectedPrice === "$50-$100" && event.price >= 50 && event.price <= 100) ||
      (selectedPrice === "Over $100" && event.price > 100);

    return matchesDate && matchesVenue && matchesPrice;
  });

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
            {filteredEvents.length === 0 ? (
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
                          className="h-48 md:h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${event.image})` }}
                        />
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>${event.price.toFixed(2)}</span>
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
                        style={{ backgroundImage: `url(${event.image})` }}
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
                          <Button>Book Tickets</Button>
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