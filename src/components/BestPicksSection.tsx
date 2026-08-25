'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Plus, ArrowRight, UtensilsCrossed, Check } from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { useOrder } from '@/context/OrderContext';
import { MenuItem } from '@/types/cafe';

interface BestPicksSectionProps {
  onSelectItem?: (item: MenuItem) => void;
}

export default function BestPicksSection({ onSelectItem }: BestPicksSectionProps) {
  const { addToCart } = useOrder();
  const [addedNotice, setAddedNotice] = React.useState<string | null>(null);

  // Curated Best Picks
  const bestPicks = [
    {
      ...MENU_ITEMS[0], // Zoffers House Special
      badge: '🏆 #1 House Legend',
      highlight: 'Shattered crisp crust & artisan liver pate',
    },
    {
      ...MENU_ITEMS[1], // BBQ Pork
      badge: '🔥 Charcoal Caramelized',
      highlight: '24h wildflower honey & herb marinade',
    },
    {
      ...MENU_ITEMS[5], // Sea Salt Cream Coffee
      badge: '⭐ Viral Sensation',
      highlight: 'Slow drip dark roast with whipped sea salt cream',
    },
    {
      ...MENU_ITEMS[4], // Vegan Mushroom
      badge: '🌿 100% Plant-Based',
      highlight: 'King oyster mushroom & shiitake walnut pate',
    },
  ];

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedNotice(item.id);
    setTimeout(() => setAddedNotice(null), 1800);
  };

  return (
    <section id="best-picks" className="py-24 lg:py-32 bg-[#FFF8F0] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-cream-200/60 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-banhmi-red flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef&apos;s Curated Selection</span>
              </span>
              <span className="w-8 h-px bg-banhmi-red/30" />
            </div>

            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase font-black text-banhmi-dark tracking-tight leading-[0.92]">
              Best <span className="text-banhmi-red">Picks</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm sm:text-base text-banhmi-dark/70 max-w-sm font-sans">
              Our 4 most celebrated gourmet dishes and specialty coffee extractions, prepared to order.
            </p>

            {/* Direct Link to Whole Menu Page */}
            <Link
              href="/menu"
              className="px-6 py-3.5 rounded-full bg-banhmi-dark hover:bg-banhmi-red text-white font-display text-base uppercase tracking-wider transition-all duration-300 shadow-md flex items-center space-x-2 flex-shrink-0 active:scale-95"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#FFB703]" />
              <span>Full Menu Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Best Picks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestPicks.map((item) => {
            const isAdded = addedNotice === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden border border-banhmi-gold/30 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Badge */}
                  <div
                    onClick={() => onSelectItem && onSelectItem(item)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200 cursor-pointer"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 bg-banhmi-card/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-banhmi-red border border-banhmi-red/20 shadow-sm">
                      {item.badge}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full font-display text-base font-bold text-banhmi-dark shadow-sm">
                      {item.price}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6">
                    <div className="text-[11px] font-mono text-banhmi-dark/50 uppercase tracking-wider mb-1">
                      {item.category.toUpperCase()} • PREP: {item.prepTime || '5m'}
                    </div>

                    <h3
                      onClick={() => onSelectItem && onSelectItem(item)}
                      className="font-display text-2xl uppercase font-bold text-banhmi-dark leading-snug group-hover:text-banhmi-red transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    <p className="text-xs text-banhmi-dark/70 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 text-[11px] font-mono text-amber-800 font-semibold bg-cream-100 p-2 rounded-lg border border-cream-200">
                      ✨ {item.highlight}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-cream-100/60 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-xs font-mono text-banhmi-dark/70 font-semibold">
                    {item.price}
                  </span>

                  <button
                    onClick={() => handleQuickAdd(item)}
                    className={`px-4 py-2 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-banhmi-red hover:bg-banhmi-redDark text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#FFB703]" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Big Bottom CTA to Whole Menu */}
        <div className="mt-16 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-lg sm:text-xl uppercase tracking-wider transition-all duration-300 shadow-warm-xl hover:scale-105 active:scale-95"
          >
            <UtensilsCrossed className="w-5 h-5 text-[#FFB703]" />
            <span>Browse Full 20+ Item Culinary Menu</span>
            <ArrowRight className="w-5 h-5 text-[#FFB703]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
