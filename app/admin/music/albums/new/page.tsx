"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/music/albums">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Album</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            <div className="space-y-2">
              <Label>Album Title</Label>
              <Input placeholder="Enter album title" />
            </div>

            <div className="space-y-2">
              <Label>Release Date</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>Cover Art URL</Label>
              <Input placeholder="Enter cover art URL" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter album description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Tracks</Label>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <Input value={index} disabled />
                    </div>
                    <div className="col-span-7">
                      <Input placeholder={`Track ${index} title`} />
                    </div>
                    <div className="col-span-2">
                      <Input placeholder="Duration" />
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
                  Add Track
                </Button>
              </div>
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
              <Input placeholder="Enter YouTube video ID for album preview" />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/music/albums">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button>Create Album</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}