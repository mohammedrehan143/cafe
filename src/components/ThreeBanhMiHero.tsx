'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, ChefHat, UtensilsCrossed, Search } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';

export default function ThreeBanhMiHero() {
  const { setCartDrawerOpen, cartCount } = useOrder();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full bg-[#FFF8F0] pt-4 sm:pt-6 pb-8 sm:pb-12 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Navbar Row - Responsive & Mobile-Fit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between z-30 gap-2 sm:gap-4">
        {/* Left Links on Desktop */}
        <div className="hidden lg:flex items-center space-x-6 font-display text-lg tracking-wider uppercase text-banhmi-dark">
          <Link href="/menu" className="hover:text-banhmi-red transition-colors flex items-center space-x-1 font-bold text-banhmi-red">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Full Menu</span>
          </Link>
          <a href="#evolution" className="hover:text-banhmi-red transition-colors">
            Our Story
          </a>
          <a href="#anatomy" className="hover:text-banhmi-red transition-colors">
            Anatomy
          </a>
        </div>

        {/* Center Tag / Brand */}
        <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-banhmi-card border border-banhmi-red/20 shadow-warm-sm flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-banhmi-red animate-ping inline-block" />
          <span className="font-display tracking-wider text-xs sm:text-sm uppercase text-banhmi-red font-bold truncate max-w-[140px] sm:max-w-none">
            #TheTasteOfLove
          </span>
        </div>

        {/* Right Navigation & Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden lg:flex items-center space-x-6 font-display text-lg tracking-wider uppercase text-banhmi-dark mr-2">
            <a href="#fillings" className="hover:text-banhmi-red transition-colors">
              Specialties
            </a>
            <Link href="/track" className="hover:text-banhmi-red transition-colors flex items-center space-x-1">
              <Search className="w-4 h-4" />
              <span>Track Order</span>
            </Link>
          </div>

          {/* Full Menu Link (Mobile) */}
          <Link
            href="/menu"
            className="lg:hidden px-3 py-1.5 rounded-full bg-cream-200 text-banhmi-dark hover:bg-cream-300 font-display text-xs uppercase tracking-wider transition-colors font-bold"
          >
            Menu
          </Link>

          {/* Admin KDS Link */}
          <Link
            href="/admin"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-banhmi-card hover:bg-cream-200 border border-banhmi-gold/40 text-[11px] sm:text-xs font-mono font-bold text-banhmi-dark flex items-center space-x-1 transition-colors"
          >
            <ChefHat className="w-3.5 h-3.5 text-banhmi-red" />
            <span className="hidden sm:inline">Admin KDS</span>
          </Link>

          {/* Order Bag Button */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-sm sm:text-base tracking-wider uppercase transition-all shadow-md flex items-center space-x-1.5 active:scale-95 flex-shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB703]" />
            <span>Order</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-banhmi-red font-bold text-[10px] sm:text-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Middle Hero Section: Optimized for Both Mobile & Desktop Viewports */}
      <div className="relative my-auto w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-center">
        
        {/* DESKTOP LAYOUT (lg:flex) */}
        <div className="hidden lg:flex w-full items-center justify-between relative z-10">
          <motion.h1
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[11rem] xl:text-[13rem] leading-[0.88] uppercase font-extrabold text-banhmi-dark tracking-tighter text-left"
          >
            Zoffers
          </motion.h1>

          {/* Desktop Center Floating Sandwich */}
          <div
            className="w-[480px] xl:w-[560px] aspect-square flex items-center justify-center pointer-events-none relative"
            style={{
              transform: `translate(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Rotating Sunburst Background */}
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <Image
                src="https://banhmivietnam.xyz/img/Hero%20banh%20mi%20circle%20bg.png"
                alt="Zoffers Circular Sunburst Background"
                width={560}
                height={560}
                className="w-full h-full object-contain opacity-90 drop-shadow-md"
                priority
              />
            </div>

            {/* Main 3D Sandwich Image */}
            <motion.div
              initial={{ scale: 0, rotate: 180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[90%] h-[90%] animate-float-gentle"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Hero%20banh%20mi.png"
                alt="Zoffers Crispy Artisan Baguette"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Floating 3D Ingredients */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -top-4 right-4 w-24 h-24 z-30"
              style={{ transform: `translate(${mousePos.x * -0.7}px, ${mousePos.y * -0.7}px)` }}
            >
              <Image src="https://banhmivietnam.xyz/img/Chilli.png" alt="Fresh Chili" fill className="object-contain drop-shadow-lg" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0], rotate: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.4 }}
              className="absolute -bottom-4 left-4 w-28 h-28 z-30"
              style={{ transform: `translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px)` }}
            >
              <Image src="https://banhmivietnam.xyz/img/Coriander.png" alt="Fresh Herbs" fill className="object-contain drop-shadow-lg" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[11rem] xl:text-[13rem] leading-[0.88] uppercase font-extrabold text-banhmi-dark tracking-tighter text-right"
          >
            Kitchen
          </motion.h1>
        </div>

        {/* MOBILE & TABLET LAYOUT (lg:hidden) - Crystal Clear Name Visibility */}
        <div className="lg:hidden w-full flex flex-col items-center justify-center my-1 relative">
          {/* Top Brand Word: ZOFFERS */}
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl sm:text-7xl md:text-8xl leading-none uppercase font-black text-banhmi-dark tracking-tight text-center z-10"
          >
            Zoffers
          </motion.h1>

          {/* Center 3D Floating Food */}
          <div className="relative w-[230px] sm:w-[280px] md:w-[340px] aspect-square my-1 sm:my-2 flex items-center justify-center pointer-events-none z-20">
            {/* Rotating Sunburst Background */}
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <Image
                src="https://banhmivietnam.xyz/img/Hero%20banh%20mi%20circle%20bg.png"
                alt="Zoffers Circular Background"
                width={340}
                height={340}
                className="w-full h-full object-contain opacity-90 drop-shadow-sm"
                priority
              />
            </div>

            {/* 3D Sandwich Image */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative z-10 w-[92%] h-[92%] animate-float-gentle"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Hero%20banh%20mi.png"
                alt="Zoffers Crispy Baguette"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </motion.div>

            {/* Mobile Floating Chili & Coriander */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-2 right-1 w-14 h-14 sm:w-16 sm:h-16 z-30"
            >
              <Image src="https://banhmivietnam.xyz/img/Chilli.png" alt="Fresh Chili" fill className="object-contain drop-shadow-md" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.3 }}
              className="absolute -bottom-2 left-1 w-16 h-16 sm:w-20 sm:h-20 z-30"
            >
              <Image src="https://banhmivietnam.xyz/img/Coriander.png" alt="Fresh Coriander" fill className="object-contain drop-shadow-md" />
            </motion.div>
          </div>

          {/* Bottom Brand Word: KITCHEN */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl leading-none uppercase font-black text-banhmi-red tracking-tight text-center z-10"
          >
            Kitchen
          </motion.h1>
        </div>

      </div>

      {/* Hero Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 z-30 pt-2 sm:pt-4">
        {/* Left: Indian Cloud Kitchen Tagline */}
        <div className="text-center md:text-left">
          <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-banhmi-red font-bold block">
            Craft Cloud Kitchen • India
          </span>
          <p className="text-xs sm:text-sm text-banhmi-dark/80 max-w-sm mt-0.5 leading-relaxed">
            India&apos;s premier gourmet cloud kitchen crafting shattered crispy baguettes, smoky charcoal grills, and specialty coffees delivered fresh across the city.
          </p>
        </div>

        {/* Center/Right: Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-base tracking-wider uppercase transition-all shadow-warm-md hover:scale-105 flex items-center justify-center space-x-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFB703]" />
            <span>Order Fresh Crunch</span>
          </button>

          <Link
            href="/menu"
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-banhmi-gold/40 hover:bg-cream-200 text-banhmi-dark font-display text-base tracking-wider uppercase transition-colors shadow-warm-sm flex items-center justify-center space-x-1.5"
          >
            <UtensilsCrossed className="w-4 h-4 text-banhmi-red" />
            <span>Explore Full Menu</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
