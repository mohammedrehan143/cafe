'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, ArrowRight, UtensilsCrossed, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { useOrder } from '@/context/OrderContext';
import { MenuItem } from '@/types/cafe';

interface BestPicksSectionProps {
  onSelectItem?: (item: MenuItem) => void;
}

export default function BestPicksSection({ onSelectItem }: BestPicksSectionProps) {
  const { addToCart } = useOrder();
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find items reliably from MENU_ITEMS
  const getItem = (id: string) => MENU_ITEMS.find((m) => m.id === id) || MENU_ITEMS[0];

  const bestPicks = [
    {
      ...getItem('zafiroo-signature-coffee'),
      badge: '🏆 Signature Coffee',
      highlight: 'Velvety sea salt cream froth',
    },
    {
      ...getItem('cheesy-fries'),
      badge: '🔥 Bestseller',
      highlight: 'Triple-cooked molten cheddar',
    },
    {
      ...getItem('kitkat-shake'),
      badge: '⭐ Thick Shake',
      highlight: 'Crispy wafer folded shake',
    },
    {
      ...getItem('brownie-chocolate-lava'),
      badge: '🍫 Molten Lava',
      highlight: '70% Belgian dark cocoa oozing core',
    },
    {
      ...getItem('pizzas'),
      badge: '🍕 Stone-Baked',
      highlight: '48h sourdough bubbly crust',
    },
    {
      ...getItem('egg-sandwich'),
      badge: '🥪 Brioche Grill',
      highlight: 'Silky scrambled eggs & caramelized onions',
    },
  ];

  const categories = ['All', 'Coffee', 'Fries', 'Shakes', 'Bakes & Pizza', 'Desserts'];

  const filteredPicks = activeCategory === 'All'
    ? bestPicks
    : bestPicks.filter((item) => {
        if (activeCategory === 'Coffee') return item.category === 'coffee';
        if (activeCategory === 'Fries') return item.category === 'fries';
        if (activeCategory === 'Shakes') return item.category === 'shakes';
        if (activeCategory === 'Bakes & Pizza') return item.category === 'pizzas' || item.category === 'sandwiches';
        if (activeCategory === 'Desserts') return item.category === 'desserts';
        return true;
      });

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item, 1);
    setAddedNotice(item.id);
    setTimeout(() => setAddedNotice(null), 1800);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="best-picks" className="py-10 sm:py-14 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Compact Header with Category Filters & Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#4A2818] font-mono text-[11px] uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef&apos;s Signature Showcase</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase font-black text-[#1C1917] tracking-tight leading-none mt-0.5">
              Food <span className="text-[#4A2818]">Gallery</span> &amp; Best Picks
            </h2>
          </div>

          {/* Right Controls: Category Filters & Left/Right Arrows */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                    activeCategory === cat
                      ? 'bg-[#4A2818] text-white shadow-sm'
                      : 'bg-white text-[#1C1917]/70 hover:text-[#1C1917] hover:bg-cream-200 border border-black/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Prev / Next Slider Arrows (Compact space saver) */}
            <div className="hidden sm:flex items-center space-x-1.5 ml-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white hover:bg-[#4A2818] text-[#1C1917] hover:text-white border border-black/10 shadow-sm transition-all active:scale-95"
                title="Previous Dish"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white hover:bg-[#4A2818] text-[#1C1917] hover:text-white border border-black/10 shadow-sm transition-all active:scale-95"
                title="Next Dish"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Smooth Snap Carousel (Not stacked one under another, saves massive vertical space) */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredPicks.map((item) => {
            const isAdded = addedNotice === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem && onSelectItem(item)}
                className="w-[240px] sm:w-[270px] md:w-[290px] flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-black/10 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer transform-gpu"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 240px, 300px"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-sm border border-white/20">
                      {item.badge}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full font-display text-sm font-bold text-[#1C1917] shadow-sm">
                      {item.price}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5">
                    <div className="text-[10px] font-mono text-[#1C1917]/50 uppercase tracking-wider mb-0.5">
                      {item.category.toUpperCase()} • {item.prepTime || '4m'}
                    </div>

                    <h3 className="font-display text-lg uppercase font-bold text-[#1C1917] leading-snug group-hover:text-[#4A2818] transition-colors truncate">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#1C1917]/70 mt-1 line-clamp-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Add Button */}
                <div className="px-3.5 py-2.5 bg-cream-50 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1C1917]">
                    {item.price}
                  </span>

                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`px-3 py-1.5 rounded-full font-display text-xs uppercase tracking-wider font-bold transition-all shadow-sm flex items-center space-x-1 active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#4A2818] hover:bg-[#2E1509] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-white" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Direct Link to Whole Menu End Card */}
          <Link
            href="/menu"
            className="w-[180px] sm:w-[200px] flex-shrink-0 snap-start bg-gradient-to-br from-[#1C1917] to-[#2E2824] text-white rounded-2xl overflow-hidden p-5 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] border border-white/10"
          >
            <div className="w-10 h-10 rounded-full bg-[#4A2818] flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg uppercase font-bold tracking-tight text-white leading-tight">
              View All 18 Items
            </span>
            <span className="text-[11px] font-mono text-white/60 mt-1">
              Explore Full Menu →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
