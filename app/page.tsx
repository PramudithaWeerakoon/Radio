"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Calendar, Ticket, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MusicPlayer } from "@/components/music-player";
import { EventScroller } from "@/components/event-scroller";
import { HeroSection } from "@/components/hero-section";
import { BookingSection } from "@/components/booking-section";
import Link from "next/link";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Latest Release Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-4xl font-bold">Latest Release</h2>
              <p className="text-xl text-gray-400">
                "Echoes of Tomorrow" - Our most ambitious album yet, featuring a unique blend of classical rock and electronic elements.
              </p>
              <div className="flex gap-4">
                <Link href="/albums/1">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90">
                    Listen Now
                  </Button>
                </Link>
                <Link href="/albums">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                    View All Albums
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <MusicPlayer />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Upcoming Events
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
              Join us at our next performance
            </motion.p>
          </motion.div>
          <EventScroller />
          <motion.div
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link href="/events">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Meet the Band",
                description: "Get to know the talented musicians behind Radioo Music",
                image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "/members"
              },
              {
                title: "Latest News",
                description: "Stay updated with our latest announcements and blog posts",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "/blog"
              },
              {
                title: "Official Merchandise",
                description: "Show your support with our latest merchandise collection",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "/merchandise"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-lg"
              >
                <Link href={item.link}>
                  <div className="relative h-96">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-200">{item.description}</p>
                      <Button
                        variant="outline"
                        className="mt-4 text-white border-white hover:bg-white hover:text-black transition-colors"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Stay Connected
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-8">
              Subscribe to our newsletter for exclusive updates and behind-the-scenes content
            </motion.p>
            <motion.form
              variants={fadeInUp}
              className="max-w-md mx-auto flex gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-black hover:bg-white/90">
                Subscribe
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      <BookingSection />
    </main>
  );
}