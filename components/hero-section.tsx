"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface BackgroundImage {
  id: number;
  title?: string;
  imageUrl: string;
  order: number;
}

export function HeroSection() {
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch background images
  useEffect(() => {
    async function fetchBackgroundImages() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/background-images');
        
        if (response.ok) {
          const data = await response.json();
          setBackgroundImages(data.images || []);
        }
      } catch (error) {
        console.error('Error fetching background images:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBackgroundImages();
  }, []);

  // Slideshow effect for multiple images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(current => (current + 1) % backgroundImages.length);
    }, 7000); // Change image every 7 seconds
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Default background image if none from database
  const defaultBackgroundImage = "https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80";
  
  // Current background image
  const currentBackground = backgroundImages.length > 0 
    ? backgroundImages[currentImageIndex].imageUrl
    : defaultBackgroundImage;

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div 
        key={currentImageIndex}
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `url('${currentBackground}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The Radioo Music
        </motion.h1>
        <motion.p 
          className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the fusion of classical rock and modern elements in a journey through sound and emotion
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/events">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book Tickets
            </Button>
          </Link>
          <Link href="/events">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              View Schedule
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}