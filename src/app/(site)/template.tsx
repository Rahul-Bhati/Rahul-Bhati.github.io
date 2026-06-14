"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation, giving each route a subtle fade-and-rise
 * entrance. Kept short so it reads as polish, not a loading delay.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
