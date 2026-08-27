'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const words = ['CRISPY', 'FRESH', 'ZAFIROO'];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 450);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(wordInterval);
  }, [onComplete, words.length]);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1509] text-white overflow-hidden select-none pointer-events-auto"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#4A2818]/60 blur-3xl pointer-events-none" />

          {/* Animated Brand Typography */}
          <div className="relative text-center z-10 px-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[currentWordIndex]}
                initial={{ y: 40, opacity: 0, scale: 0.92 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -40, opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-7xl sm:text-9xl md:text-[11rem] tracking-tighter uppercase text-white font-black drop-shadow-2xl"
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-[#D4A373] mt-3 font-bold"
            >
              #TheTasteOfLove • Artisan Kitchen
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
