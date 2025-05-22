"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Loading from "../../loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  price: number;
  availableSeats: number;
  imageUrl?: string;
  image?: string;
  imageName?: string;
  description?: string;
  time?: string;
  category?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();
        setEvent({
          ...data.event,
          imageUrl: data.event.imageName ? `/api/events/${data.event.id}/image?t=${Date.now()}` : null,
          image: data.event.image || "https://placehold.co/600x400?text=No+Image",
        });
      } catch (err) {
        setError("Failed to load event. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-12 text-muted-foreground">Event not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href="/events">&larr; Back to Events</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className="h-64 w-full bg-cover bg-center"
          style={{ backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : `url(${event.image})` }}
        />
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${event.price}</span>
            </div>
            
          </div>
          <p className="mb-6 text-base text-muted-foreground">{event.description}</p>
        </div>
      </div>
    </div>
  );
}
