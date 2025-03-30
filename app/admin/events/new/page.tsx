"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function NewEventPage() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Event</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input placeholder="Enter event title" />
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue</Label>
              <Input placeholder="Enter venue name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" placeholder="Enter ticket price" />
              </div>

              <div className="space-y-2">
                <Label>Available Seats</Label>
                <Input type="number" placeholder="Enter number of available seats" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="Enter image URL" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter event description"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button>Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}