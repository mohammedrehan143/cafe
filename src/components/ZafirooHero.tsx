'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  UtensilsCrossed,
  Search,
} from 'lucide-react';
import StarButton from '@/components/ui/star-button';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';

export default function ZafirooHero() {
  const { setCartDrawerOpen, cartCount } = useOrder();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Local HD video scenes for full culinary variety (Coffee, Burger & Fries, Cakes & Pastries, Espresso Crema)
  const heroVideoScenes = [
    {
      id: 'coffee-latte',
      foodName: 'Specialty Latte Art Coffee',
      tagline: 'Single-Origin Arabica & Silky Microfoam',
      url: '/videos/coffee-latte.mp4',
      poster: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'burger-fries',
      foodName: 'Gourmet Burgers & Crispy Fries',
      tagline: 'Triple-Cooked Crunch & Sizzling Brioche',
      url: '/videos/burger-fries.mp4',
      poster: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'cake-pastry',
      foodName: 'Molten Chocolate Lava & Pastries',
      tagline: '70% Belgian Couverture & Warm Molten Core',
      url: '/videos/cake-pastry.mp4',
      poster: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'espresso',
      foodName: 'Zafiroo Cold Coffee & Crema',
      tagline: 'Slow Extraction & Ice-Blended Brews',
      url: '/videos/espresso.mp4',
      poster: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const currentScene = heroVideoScenes[activeVideoIndex];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Automatic Smooth Slideshow Transition Timer (cycles every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % heroVideoScenes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroVideoScenes.length]);

  // Click on Hero Section to instantly change to next video scene
  const handleHeroClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger scene switch if user clicked an interactive button or link
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    setActiveVideoIndex((prev) => (prev + 1) % heroVideoScenes.length);
  };

  return (
    <section
      id="hero"
      onClick={handleHeroClick}
      className="relative min-h-[100svh] w-full pt-4 sm:pt-6 pb-8 sm:pb-12 flex flex-col justify-between overflow-hidden select-none text-white cursor-pointer"
      title="Click anywhere to change video"
    >
      {/* 1. CINEMATIC FULL-SCREEN BACKGROUND VIDEO SLIDESHOW (z-0) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {heroVideoScenes.map((scene, idx) => {
          const isActive = activeVideoIndex === idx;

          return (
            <div
              key={scene.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Fallback Poster */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={scene.poster}
                  alt={scene.foodName}
                  fill
                  className="object-cover opacity-75"
                  priority={idx === 0}
                />
              </div>

              {/* Autoplaying Muted Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={scene.poster}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={scene.url} type="video/mp4" />
              </video>
            </div>
          );
        })}

        {/* Clean Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-20" />
      </div>

      {/* 2. TOP NAVBAR ROW (z-30) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between z-30 gap-2 sm:gap-4">
        {/* Left Links on Desktop */}
        <div className="hidden lg:flex items-center space-x-6 font-display text-lg tracking-wider uppercase text-white drop-shadow-md">
          <Link
            href="/menu"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[#D4A373] transition-colors flex items-center space-x-1.5 font-bold text-white"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#D4A373]" />
            <span>Full Menu</span>
          </Link>
          <a
            href="#best-picks"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[#D4A373] transition-colors"
          >
            Best Picks
          </a>
        </div>

        {/* Right Navigation & Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto sm:ml-0">
          <div className="hidden lg:flex items-center space-x-6 font-display text-lg tracking-wider uppercase text-white mr-2 drop-shadow-md">
            <Link
              href="/track"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#D4A373] transition-colors flex items-center space-x-1"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Track Order</span>
            </Link>
          </div>

          {/* Track Link (Mobile) */}
          <Link
            href="/track"
            onClick={(e) => e.stopPropagation()}
            className="lg:hidden h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-full bg-white/20 text-white hover:bg-white/30 font-display text-xs uppercase tracking-wider transition-colors font-bold backdrop-blur-md border border-white/25 flex items-center justify-center space-x-1"
          >
            <Search className="w-3 h-3 text-white" />
            <span>Track</span>
          </Link>

          {/* Full Menu Link (Mobile) */}
          <Link
            href="/menu"
            onClick={(e) => e.stopPropagation()}
            className="lg:hidden h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-full bg-white/20 text-white hover:bg-white/30 font-display text-xs uppercase tracking-wider transition-colors font-bold backdrop-blur-md border border-white/25 flex items-center justify-center"
          >
            Menu
          </Link>

          {/* Order Bag Button */}
          <StarButton
            onClick={(e) => {
              e.stopPropagation();
              setCartDrawerOpen(true);
            }}
            className="h-7 sm:h-8 px-3 sm:px-4 text-xs font-display tracking-wider uppercase flex items-center justify-center flex-shrink-0"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            <span>Order</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[#4A2818] font-bold text-[10px]">
                {cartCount}
              </span>
            )}
          </StarButton>
        </div>
      </div>

      {/* 3. MIDDLE HERO SECTION: BIG CLEAN TYPOGRAPHY */}
      <div className="relative my-auto w-full max-w-7xl mx-auto px-4 py-1 sm:py-4 flex flex-col items-center justify-center z-20">
        
        {/* DESKTOP LAYOUT (lg:flex) */}
        <div className="hidden lg:flex w-full items-center justify-between relative">
          {/* Left Brand Word: ZAFIROO */}
          <motion.h1
            initial={{ x: -160, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[10.5rem] xl:text-[13rem] leading-[0.88] uppercase font-black text-white tracking-tighter text-left drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)] select-none"
          >
            Zafiroo
          </motion.h1>

          {/* Right Brand Word: KITCHEN */}
          <motion.h1
            initial={{ x: 160, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[10.5rem] xl:text-[13rem] leading-[0.88] uppercase font-black text-[#D4A373] tracking-tighter text-right drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)] select-none"
          >
            Kitchen
          </motion.h1>
        </div>

        {/* MOBILE & TABLET LAYOUT (lg:hidden) - Extra Large, Bold, Tight Spacing */}
        <div className="lg:hidden w-full flex flex-col items-center justify-center my-0 py-1 text-center relative z-20">
          {/* Top Brand Word: ZAFIROO */}
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-[4.8rem] xs:text-[5.5rem] sm:text-8xl md:text-9xl leading-[0.82] uppercase font-black text-white tracking-tighter drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]"
          >
            Zafiroo
          </motion.h1>

          {/* Bottom Brand Word: KITCHEN */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-display text-[4.2rem] xs:text-[4.8rem] sm:text-7xl md:text-8xl leading-[0.82] uppercase font-black text-white tracking-tighter drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)] mt-1"
          >
            Kitchen
          </motion.h1>
        </div>

        {/* 4. NAME OF THE FOOD IN THE VIDEO (Floating Pure Calligraphy - No Box) */}
        <div className="my-1.5 sm:my-3 z-30 pointer-events-none select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-4 max-w-2xl mx-auto"
            >
              <p className="font-calligraphy text-2xl sm:text-4xl md:text-5xl text-white font-bold tracking-wide drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                {currentScene.foodName}
              </p>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80 mt-0.5 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {currentScene.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 5. HERO BOTTOM ROW: ACTION BUTTONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-center z-30 pt-1 sm:pt-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <StarButton
            onClick={(e) => {
              e.stopPropagation();
              setCartDrawerOpen(true);
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-display uppercase tracking-wider font-bold shadow-warm-xl hover:scale-105 active:scale-95 border-2 border-white/30"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Order Fresh Now</span>
          </StarButton>

          <Link
            href="/menu"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/35 text-white font-display text-sm sm:text-base uppercase tracking-wider font-bold transition-all shadow-warm-sm flex items-center justify-center space-x-2 backdrop-blur-md active:scale-95"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#D4A373]" />
            <span>Explore 18 Items</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
