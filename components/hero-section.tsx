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
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background image container with improved responsive handling */}
      <motion.div 
        key={currentImageIndex}
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `url('${currentBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%", 
          backgroundRepeat: "no-repeat",
          objectFit: "cover",
          width: "100%",
          height: "100%",
          // Force the background to maintain aspect ratio while covering the full area
          // This helps prevent cropping on mobile
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content wrapper with proper z-index */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Experience the Sound of Tomorrow
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join us on a musical journey that transcends boundaries and connects souls.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto">
                Upcoming Events
              </Button>
            </Link>
            <Link href="/music">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 w-full sm:w-auto">
                Explore Our Music
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}