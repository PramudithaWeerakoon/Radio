"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Behind the Scenes: Making of Our New Album",
    excerpt: "Get an exclusive look at the creative process and studio sessions that went into crafting our latest album.",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Studio Updates",
  },
  {
    id: 2,
    title: "Summer Tour Announcement",
    excerpt: "We're hitting the road! Check out all the cities we'll be visiting on our upcoming summer tour.",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Tour News",
  },
];

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Blog Posts</h1>
      </div>

      <div className="flex justify-end">
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[200px,1fr] gap-6">
                  <div
                    className="h-40 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{post.date}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <p className="text-muted-foreground mt-2">{post.excerpt}</p>
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
                    <div className="flex justify-end pt-4 border-t">
                      <Button variant="outline">View Post</Button>
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