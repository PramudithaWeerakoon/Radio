"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [amplitude, setAmplitude] = useState<number[]>([]);

  // Simulate music visualization
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAmplitude(Array.from({ length: 20 }, () => Math.random() * 40 + 10));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-lg shadow-xl p-8 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            initial={{ scale: 0, x: "50%", y: "50%" }}
            animate={{
              scale: [1, 2, 1],
              x: ["50%", "60%", "50%"],
              y: ["50%", "40%", "50%"],
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "300px",
              height: "300px",
              left: `-${i * 10}%`,
              top: `-${i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Symphony No. 5</h3>
            <p className="text-purple-200">Ludwig van Beethoven</p>
          </div>
          <motion.div
            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Music2 className="h-8 w-8 text-purple-200" />
          </motion.div>
        </div>

        {/* Music Visualization */}
        <div className="flex items-center justify-center h-20 mb-8 gap-1">
          <AnimatePresence>
            {isPlaying && amplitude.map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-1 bg-gradient-to-t from-purple-500 to-indigo-300 rounded-full"
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={(value) => setCurrentTime(value[0])}
          />
          
          <div className="flex justify-between items-center text-sm text-purple-200">
            <span>0:00</span>
            <span>4:32</span>
          </div>
          
          <div className="flex justify-center items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipBack className="h-6 w-6 text-purple-200" />
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-1" />
                )}
              </Button>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="h-6 w-6 text-purple-200" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-200" />
            <Slider
              defaultValue={[80]}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* Floating music notes */}
      <div className="absolute inset-0 pointer-events-none">
        {isPlaying && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              opacity: 0,
              scale: 0,
              x: Math.random() * 100 + "%",
              y: "100%" 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: "0%",
              x: `${Math.random() * 100}%`
            }}
            transition={{
              duration: 4,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeOut"
            }}
          >
            <Music2 className="h-4 w-4 text-purple-200/30" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}