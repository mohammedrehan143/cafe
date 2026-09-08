'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

const WORDS = ['CRISPY', 'FRESH', 'ZAFIROO'];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Advance to 'FRESH'
    timeouts.push(
      setTimeout(() => {
        setCurrentWordIndex(1);
      }, 450)
    );

    // Advance to 'ZAFIROO'
    timeouts.push(
      setTimeout(() => {
        setCurrentWordIndex(2);
      }, 900)
    );

    // Complete and trigger curtain reveal
    timeouts.push(
      setTimeout(() => {
        setIsFinished(true);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 1600)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#2E1509] text-white overflow-hidden select-none pointer-events-auto transform-gpu"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#4A2818]/60 blur-3xl pointer-events-none -z-10" />

          {/* Animated Brand Typography */}
          <div className="relative text-center z-10 px-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={WORDS[currentWordIndex]}
                initial={{ y: 35, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -35, opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-6xl sm:text-8xl md:text-[10rem] tracking-tighter uppercase text-white font-black drop-shadow-2xl"
              >
                {WORDS[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase text-[#D4A373] mt-3 font-bold"
            >
              #TheTasteOfLove • Artisan Kitchen
            </motion.div>

            {/* Aesthetic progress indicator */}
            <div className="w-36 h-[2px] bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#D4A373] to-amber-400"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
