'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, ChevronRight, Sparkles, ChefHat, Bike } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';

export default function FinalCTASection() {
  const { setCartDrawerOpen } = useOrder();

  return (
    <section className="relative py-32 lg:py-48 bg-espresso-950 text-cream-50 overflow-hidden">
      {/* Background High-Res Photographic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1800&auto=format&fit=crop"
          alt="Atelier L'Ambre Table Atmosphere"
          fill
          className="object-cover opacity-25 scale-105 transition-transform duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/80 to-espresso-950/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-[0.3em] uppercase text-amberGold-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Delivered Fresh Across Manhattan</span>
        </div>

        {/* Large Cinematic Title */}
        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream-50 font-normal leading-[1.02]">
          Fresh craft, <br />
          <span className="italic font-light text-cream-200">delivered right now.</span>
        </h2>

        <p className="text-base sm:text-xl text-cream-300 font-light leading-relaxed max-w-xl mx-auto">
          Single-origin cold drips in amber bottles, 72-hour French croissants, and culinary brunch plates sealed in thermal packaging.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="group px-8 py-4 rounded-full bg-cream-100 hover:bg-white text-espresso-950 font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-2xl hover:scale-[1.03] active:scale-[0.98] flex items-center space-x-2.5"
          >
            <ShoppingBag className="w-4 h-4 text-amberGold-600" />
            <span>Order for Delivery / Pickup</span>
            <ChevronRight className="w-4 h-4 text-espresso-900 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            href="/admin"
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-cream-50 border border-white/20 font-mono text-xs tracking-widest uppercase transition-all duration-300 flex items-center space-x-2"
          >
            <ChefHat className="w-4 h-4 text-amberGold-400" />
            <span>Open Kitchen KDS Portal</span>
          </Link>
        </div>

        {/* Footnote Badge */}
        <div className="pt-8 text-xs font-mono text-cream-400 flex items-center justify-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span>Average Dispatch: 25 Mins</span>
          </span>
          <span>•</span>
          <span>Studio 4B, 428 Mercer St, SoHo</span>
        </div>
      </div>
    </section>
  );
}
