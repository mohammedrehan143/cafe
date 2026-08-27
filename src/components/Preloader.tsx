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
          }, 300);
          return prev;
        }
      });
    }, 380);

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
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1509] text-white overflow-hidden select-none pointer-events-none transform-gpu"
        >
          {/* Animated Brand Typography */}
          <div className="relative text-center z-10 px-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[currentWordIndex]}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="font-display text-6xl sm:text-8xl md:text-[10rem] tracking-tighter uppercase text-white font-black drop-shadow-lg"
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            <div className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-[#D4A373] mt-2 font-bold opacity-90">
              #TheTasteOfLove • Artisan Kitchen
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
