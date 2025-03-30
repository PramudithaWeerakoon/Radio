"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTrackPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/music/tracks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Track</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            <div className="space-y-2">
              <Label>Track Title</Label>
              <Input placeholder="Enter track title" />
            </div>

            <div className="space-y-2">
              <Label>Album</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="album1">Echoes of Tomorrow</SelectItem>
                  <SelectItem value="album2">City Lights</SelectItem>
                  <SelectItem value="album3">Acoustic Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="e.g., 3:45" />
              </div>

              <div className="space-y-2">
                <Label>Track Number</Label>
                <Input type="number" placeholder="Enter track number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lyrics</Label>
              <Textarea
                placeholder="Enter track lyrics"
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Credits</Label>
              <div className="space-y-4">
                {[1, 2].map((index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                      <Input placeholder="Role" />
                    </div>
                    <div className="col-span-5">
                      <Input placeholder="Name" />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full">
                  Add Credit
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>YouTube Video ID</Label>
              <Input placeholder="Enter YouTube video ID for track preview" />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button>Create Track</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}