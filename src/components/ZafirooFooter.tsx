'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, ChefHat, ShoppingBag, Search, Sparkles, MapPin, Clock, Phone } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';

export default function ZafirooFooter() {
  const { setCartDrawerOpen } = useOrder();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#12100E] text-[#FFF8F0] select-none py-10 sm:py-12 px-6 sm:px-10 lg:px-12 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Clean Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand Identity */}
          <div>
            <div className="flex items-center space-x-2 text-[#D4A373] font-mono text-[11px] uppercase tracking-widest font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisan Cloud Kitchen &amp; Roastery</span>
            </div>
            <h3 className="font-display text-4xl sm:text-5xl uppercase font-black tracking-tight text-white leading-none">
              Zafiroo <span className="text-[#D4A373]">Kitchen</span>
            </h3>
            <p className="text-xs text-white/60 mt-1.5 max-w-sm font-sans">
              Handcrafted specialty coffees, loaded cheesy fries, thick shakes &amp; molten bakes.
            </p>
          </div>

          {/* Clean Minimal Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="px-4 py-2 rounded-full bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95 border border-white/20"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Order Now</span>
            </button>

            <Link
              href="/menu"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-display text-xs uppercase tracking-wider font-bold transition-colors border border-white/15"
            >
              Full Menu
            </Link>

            <Link
              href="/track"
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors flex items-center space-x-1.5 border border-white/15"
            >
              <Search className="w-3.5 h-3.5 text-white" />
              <span>Track</span>
            </Link>

            <Link
              href="/admin"
              title="Admin KDS"
              aria-label="Admin KDS"
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all flex items-center justify-center border border-white/10"
            >
              <ChefHat className="w-4 h-4 text-[#D4A373]" />
            </Link>
          </div>
        </div>

        {/* Minimal Essential Contact & Hours Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-white/65">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{CAFE_INFO.address}</span>
            </span>

            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>8:00 AM – 11:30 PM (Daily)</span>
            </span>

            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{CAFE_INFO.phone}</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all w-fit self-start sm:self-auto"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Top</span>
          </button>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/40">
          <span>© 2026 Zafiroo Culinary Studio. All rights reserved.</span>
          <span>#TheTasteOfLove</span>
        </div>

      </div>
    </footer>
  );
}
