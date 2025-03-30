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

const categories = ["Studio Updates", "Tour News", "Interviews", "Behind the Scenes"];

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Blog Post</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Enter post title" />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input placeholder="Enter image URL" />
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                placeholder="Enter a brief excerpt"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your blog post content..."
                className="min-h-[300px]"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}