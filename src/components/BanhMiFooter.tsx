'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, ChefHat, ShoppingBag, Search } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

export default function BanhMiFooter() {
  const { setCartDrawerOpen } = useOrder();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className="relative w-full min-h-[100svh] bg-[#8C5832] flex flex-col justify-between overflow-hidden select-none py-8 px-6 sm:px-12"
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(160, 104, 65, 0.4) 0%, rgba(100, 58, 30, 0.95) 100%), url('https://banhmivietnam.xyz/img/Footer%20bg%20image.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Left Sliced Baguette with Parallax Slide-in */}
      <motion.div
        initial={{ x: -250, y: -80, opacity: 0, rotate: -15 }}
        whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-44 sm:w-64 md:w-80 lg:w-[26rem] aspect-[4/3] z-20 pointer-events-none -ml-4 -mt-4 sm:-ml-8 sm:-mt-8"
      >
        <Image
          src="https://banhmivietnam.xyz/img/Footer%20banh%20mi%20top.png"
          alt="Top Left Crispy Baguette"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Bottom Right Sliced Baguette with Parallax Slide-in */}
      <motion.div
        initial={{ x: 250, y: 80, opacity: 0, rotate: 15 }}
        whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 right-0 w-48 sm:w-72 md:w-96 lg:w-[30rem] aspect-[4/3] z-20 pointer-events-none -mr-4 -mb-4 sm:-mr-8 sm:-mb-8"
      >
        <Image
          src="https://banhmivietnam.xyz/img/Footer%20banh%20mi%20bottom.png"
          alt="Bottom Right Crispy Baguette"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Subtle Background Newspaper / Typography Watermarks */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFF8F0_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Quick Actions Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-30 pt-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#E23727] hover:bg-[#B81B0E] text-white font-display text-xs sm:text-sm uppercase tracking-wider font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFB703]" />
            <span>Order Fresh Now</span>
          </button>

          <Link
            href="/menu"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-display text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors shadow-sm"
          >
            Full Menu
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/track"
            className="px-3.5 sm:px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5 text-[#FFB703]" />
            <span className="hidden sm:inline">Track Live</span>
          </Link>

          <Link
            href="/admin"
            className="px-3.5 sm:px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <ChefHat className="w-3.5 h-3.5 text-[#FFB703]" />
            <span className="hidden sm:inline">Admin KDS</span>
          </Link>
        </div>
      </div>

      {/* CENTER STACK: Massive Kinetic Typography “THANK YOU” & Center Paper Tape */}
      <div className="relative my-auto max-w-7xl mx-auto w-full flex flex-col items-center justify-center py-6 sm:py-10 z-20">
        {/* Top Massive Graphic Typography: “THANK” */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex items-center justify-center"
        >
          <h2 className="font-display text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-black uppercase text-[#FFF8F0] tracking-tighter leading-none text-center drop-shadow-2xl">
            &ldquo;THANK&rdquo;
          </h2>
        </motion.div>

        {/* Center Paper Tape Ribbon with Pop-in animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -3 }}
          whileInView={{ scale: 1, opacity: 1, rotate: -2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, type: 'spring', bounce: 0.35 }}
          className="relative px-6 sm:px-10 py-2.5 sm:py-3.5 bg-[#EFE6D8] text-[#3E2723] rounded-lg shadow-2xl border-y-2 border-dashed border-[#8D6E63] -my-4 sm:-my-6 z-30 flex items-center space-x-3 drop-shadow-2xl"
          style={{
            clipPath: 'polygon(2% 0%, 98% 2%, 100% 98%, 0% 96%)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span className="font-serif italic text-sm sm:text-lg md:text-xl font-bold tracking-wide">
            Handcrafted with love in India &bull; Taste the crunch
          </span>
          <span className="text-xl sm:text-2xl animate-bounce">🥪</span>
        </motion.div>

        {/* Bottom Massive Graphic Typography: “YOU” */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex items-center justify-center"
        >
          <h2 className="font-display text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-black uppercase text-[#FFF8F0] tracking-tighter leading-none text-center drop-shadow-2xl">
            YOU
          </h2>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs sm:text-sm font-sans text-[#FFF8F0]/80 z-30 pt-4 border-t border-white/10">
        {/* Left: Copyright & Credit */}
        <div className="font-sans">
          ©2026. Created by{' '}
          <span className="font-semibold text-white underline underline-offset-2">
            Zoffers Studio
          </span>
        </div>

        {/* Center: Go to top with smooth click */}
        <button
          onClick={scrollToTop}
          className="group flex items-center space-x-1.5 text-white font-sans hover:text-[#FFB703] transition-colors cursor-pointer"
        >
          <span className="font-medium">Go to top</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Right: Studio Location */}
        <div className="hidden sm:block font-mono text-[11px] text-[#FFF8F0]/70">
          Zoffers Cloud Kitchens • Bengaluru • Mumbai • Delhi
        </div>
      </div>
    </footer>
  );
}
