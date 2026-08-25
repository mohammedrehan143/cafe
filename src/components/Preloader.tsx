'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const words = ['CRISPY', 'TASTY', 'IRRESISTIBLE'];

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
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#E23727] text-white overflow-hidden select-none pointer-events-auto"
        >
          {/* Expanding Circle Aperture Background */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-[800px] h-[800px] rounded-full bg-[#B81B0E] -z-10 opacity-70 blur-2xl"
          />

          {/* Animated Words */}
          <div className="relative text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[currentWordIndex]}
                initial={{ y: 80, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -80, opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-7xl sm:text-9xl md:text-[13rem] tracking-tighter uppercase text-white font-extrabold drop-shadow-xl"
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-[#FFB703] mt-4 font-bold"
            >
              #TheTasteOfLove
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
