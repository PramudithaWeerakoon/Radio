"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { Gallery as PhotoSwipeGallery } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

interface Image {
  id: number;
  src: string;
  width: number;
  height: number;
  title: string;
}

const images: Image[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    width: 2850,
    height: 1900,
    title: "Live Performance",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    width: 1350,
    height: 900,
    title: "Summer Stadium Tour",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    width: 1350,
    height: 900,
    title: "Acoustic Night",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    width: 1350,
    height: 900,
    title: "Festival Performance",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    width: 1350,
    height: 900,
    title: "Behind the Scenes",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    width: 1350,
    height: 900,
    title: "Studio Session",
  },
];

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export function Gallery() {
  return (
    <PhotoSwipeGallery>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-background"
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-semibold">{image.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>
    </PhotoSwipeGallery>
  );
}