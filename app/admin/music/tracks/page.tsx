"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash, Music, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const tracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    album: "Echoes of Tomorrow",
    duration: "4:32",
    trackNumber: 1,
  },
  {
    id: 2,
    title: "Electric Sunset",
    album: "Echoes of Tomorrow",
    duration: "3:45",
    trackNumber: 2,
  },
];

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Tracks</h1>
      </div>

      <div className="flex justify-end">
        <Link href="/admin/music/tracks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Track
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">{track.title}</h3>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span>Track {track.trackNumber}</span>
                      <span className="mx-2">•</span>
                      <span>{track.album}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mx-1" />
                      <span>{track.duration}</span>
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}