'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4A2818] via-[#7B4426] to-[#4A2818] z-[100] origin-left pointer-events-none shadow-[0_1px_8px_rgba(74,40,24,0.7)]"
      style={{ scaleX }}
    />
  );
}
