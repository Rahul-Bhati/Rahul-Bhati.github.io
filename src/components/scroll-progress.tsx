"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar pinned to the very top, filling as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400"
      aria-hidden
    />
  );
}
