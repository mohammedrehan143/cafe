'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowDown, ChevronRight, ShoppingBag, Bike, Sparkles, ChefHat } from 'lucide-react';
import ThreeHeroCanvas from './ThreeHeroCanvas';
import { CAFE_INFO } from '@/data/cafeData';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';

export default function HeroSection() {
  const { setCartDrawerOpen } = useOrder();

  // Stagger animation container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-between overflow-hidden bg-[#FCFAF6]"
    >
      {/* Background Decorative Warm Gradients & Noise */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-cream-200/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-amberGold-400/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 subtle-grain pointer-events-none -z-10 opacity-60" />

      {/* Main Content Layout (Split Editorial + 3D Canvas) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Typography (Cols 1-7) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start space-y-6 lg:space-y-8 z-10"
          >
            {/* Eyebrow / Provenance Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-cream-200/70 border border-cream-300/80 text-[11px] font-mono tracking-[0.2em] uppercase text-espresso-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>ARTISAN CLOUD ROASTERY • SOHO STUDIO 4B</span>
              </div>
            </motion.div>

            {/* Editorial Main Headline */}
            <div className="overflow-hidden">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-espresso-950 font-normal leading-[1.04]">
                <div className="overflow-hidden">
                  <motion.span variants={lineVariants} className="block">
                    Artisan Coffee
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    variants={lineVariants}
                    className="block italic font-light text-espresso-800"
                  >
                    Delivered In Luxury.
                  </motion.span>
                </div>
              </h1>
            </div>

            {/* Supporting Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-espresso-700/90 max-w-xl font-light leading-relaxed text-balance-editorial"
            >
              Meticulously extracted single-origin micro-lots and 72-hour French pastries, prepared to order in our culinary studio and dispatched in thermal temperature-locked packaging.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="group px-7 py-4 rounded-full bg-espresso-900 hover:bg-espresso-800 text-cream-50 font-medium text-xs tracking-widest uppercase transition-all duration-300 shadow-warm-md hover:shadow-warm-lg hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-3 w-full sm:w-auto justify-center"
              >
                <ShoppingBag className="w-4 h-4 text-amberGold-400" />
                <span>Order Delivery & Pickup</span>
                <ChevronRight className="w-4 h-4 text-amberGold-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#menu"
                className="px-7 py-4 rounded-full bg-transparent hover:bg-cream-200/80 text-espresso-900 border border-espresso-900/30 hover:border-espresso-900 font-medium text-xs tracking-widest uppercase transition-all duration-300 shadow-warm-sm flex items-center space-x-2.5 w-full sm:w-auto justify-center"
              >
                <span>Browse Kitchen Menu</span>
              </a>

              <Link
                href="/admin"
                className="px-4 py-4 rounded-full bg-cream-200 hover:bg-cream-300 text-espresso-800 text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5"
                title="Open Kitchen Display System"
              >
                <ChefHat className="w-4 h-4 text-amberGold-600" />
                <span>Admin KDS</span>
              </Link>
            </motion.div>

            {/* Live Micro Roastery Telemetry Badge */}
            <motion.div
              variants={itemVariants}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-espresso-600 border-t border-cream-300/70 w-full"
            >
              <div className="flex items-center space-x-2">
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-espresso-500">DISPATCH:</span>
                <span className="font-semibold text-espresso-900">{CAFE_INFO.avgDeliveryTime}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-espresso-500">RADIUS:</span>
                <span className="font-semibold text-espresso-900">5.5 Miles Manhattan</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-espresso-500">ROAST:</span>
                <span className="px-2 py-0.5 rounded bg-cream-200 text-amberGold-600 font-bold">
                  {CAFE_INFO.roastingStats.currentBatch}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right 3D Interactive Coffee Canvas (Cols 8-12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient Background Aura behind 3D Canvas */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cream-300/40 via-cream-200/20 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Three.js 3D Coffee Cup, Steam & Floating Beans Canvas */}
            <ThreeHeroCanvas className="w-full" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Down Pill Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-8 flex items-center justify-between text-xs font-mono text-espresso-500"
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-widest text-[10px]">Kitchen Active & Dispatched</span>
        </div>

        <a
          href="#menu"
          className="group flex items-center space-x-2 text-espresso-700 hover:text-espresso-950 transition-colors cursor-pointer"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll to Order</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-amberGold-600" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
