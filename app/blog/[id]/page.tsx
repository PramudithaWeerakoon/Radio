"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, ArrowLeft } from "lucide-react";
import Link from "next/link";

const post = {
  id: 1,
  title: "Behind the Scenes: Making of Our New Album",
  date: "March 15, 2024",
  author: "Alex Rivers",
  content: `
    <p>The creative process behind our latest album has been an incredible journey of exploration and growth. From the initial songwriting sessions to the final mixing and mastering, every step has been filled with passion and dedication.</p>
    
    <h2>The Beginning</h2>
    <p>It all started in a small studio in Brooklyn, where we spent countless nights experimenting with new sounds and arrangements. The goal was to push our boundaries while staying true to our roots.</p>
    
    <h2>Studio Sessions</h2>
    <p>Working with renowned producer Jane Smith brought a fresh perspective to our sound. Her expertise in blending classical elements with modern production techniques helped us achieve the perfect balance we were looking for.</p>
    
    <h2>Collaboration</h2>
    <p>One of the highlights of this album was collaborating with various artists from different genres. These collaborations brought unexpected elements to our music and helped us create something truly unique.</p>
    
    <h2>Final Touches</h2>
    <p>The final weeks were spent perfecting every detail, from the subtle harmonies to the dynamic shifts in each track. We can't wait for you to hear the result of our hard work.</p>
  `,
  image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  category: "Studio Updates",
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <div
            className="h-[400px] w-full bg-cover bg-center rounded-lg mb-8"
            style={{ backgroundImage: `url(${post.image})` }}
          />

          <div className="text-center mb-12">
            <span className="text-sm text-muted-foreground">{post.category}</span>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mt-2 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-muted-foreground">By {post.author}</span>
              <span className="text-muted-foreground">{post.date}</span>
            </div>
          </div>

          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </CardContent>
          </Card>

          <div className="mt-12 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Share this article:
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}