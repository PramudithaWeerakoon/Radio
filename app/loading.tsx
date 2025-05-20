"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import radioLogo from "../public/radioo.png";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-4"
        >
          <Image src={radioLogo} alt="Radioo Logo" className="h-16 w-16" width={64} height={64} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}