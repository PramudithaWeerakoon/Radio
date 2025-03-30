"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, DollarSign, Search, Plus, Edit, Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";

const events = [
  {
    id: 1,
    title: "Summer Stadium Tour",
    date: "2024-07-15",
    time: "19:00",
    venue: "Madison Square Garden",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
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
    availableSeats: 100,
  },
];

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Events</h1>
      </div>

      <div className="flex justify-end">
        <Link href="/admin/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[200px,1fr] gap-6">
                  <div
                    className="h-40 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.venue}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="mr-2 h-4 w-4" />
                            ${event.price}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        {event.availableSeats} seats available
                      </span>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}