"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const members = [
  {
    id: 1,
    name: "Alex Rivers",
    role: "Lead Vocals / Guitar",
    bio: "With over a decade of experience in the music industry, Alex brings powerful vocals and electrifying guitar riffs to the band. His songwriting has been instrumental in shaping the band's signature sound.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Lead Guitar",
    bio: "A classically trained musician turned rock virtuoso, Sarah's innovative guitar techniques and melodic solos have become a cornerstone of the band's musical identity.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: 3,
    name: "Marcus Thompson",
    role: "Drums",
    bio: "The rhythmic foundation of Midnight Echo, Marcus brings both power and precision to the drums. His dynamic playing style drives the band's high-energy performances.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
            Meet the Band
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The talented musicians behind Midnight Echo's unique sound
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {members.map((member) => (
            <motion.div key={member.id} variants={item}>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div
                      className="h-64 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${member.image})` }}
                    />
                    <CardHeader>
                      <h3 className="text-2xl font-semibold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </CardHeader>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{member.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className="h-64 w-full bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${member.image})` }}
                    />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{member.role}</h4>
                      <p className="text-muted-foreground mb-4">{member.bio}</p>
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.social.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}