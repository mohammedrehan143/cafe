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
    // Only run once per session for instant subsequent loads
    try {
      if (sessionStorage.getItem('zafiroo_preloader_seen')) {
        setIsFinished(true);
        if (onComplete) onComplete();
        return;
      }
    } catch {}

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          setTimeout(() => {
            setIsFinished(true);
            try {
              sessionStorage.setItem('zafiroo_preloader_seen', 'true');
            } catch {}
            if (onComplete) onComplete();
          }, 350);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(wordInterval);
  }, [onComplete, words.length]);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A2818] text-white overflow-hidden select-none pointer-events-none transform-gpu"
        >
          {/* Animated Words */}
          <div className="relative text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[currentWordIndex]}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="font-display text-6xl sm:text-8xl md:text-[10rem] tracking-tighter uppercase text-white font-extrabold drop-shadow-md"
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            <div className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-[#FFF8F0] mt-3 font-bold opacity-80">
              #TheTasteOfLove • Zafiroo Kitchen
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
