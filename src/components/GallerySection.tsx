'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Sparkles, Camera } from 'lucide-react';
import { GALLERY_ITEMS } from '@/data/cafeData';
import { GalleryItem } from '@/types/cafe';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Interior', 'Coffee', 'Food', 'Moments'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 lg:py-36 bg-[#FCFAF6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
                06 • Visual Anthology
              </span>
              <span className="w-8 h-px bg-espresso-300" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.06]">
              Atmosphere & <span className="italic font-light text-espresso-700">Moments.</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-espresso-900 text-cream-50 shadow-sm'
                    : 'bg-cream-100 text-espresso-700 hover:bg-cream-200 border border-cream-300/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid Layout */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setLightboxItem(item)}
                className={`group relative overflow-hidden rounded-2xl bg-cream-200 cursor-pointer shadow-warm-sm hover:shadow-warm-xl transition-all duration-500 border border-cream-300/80 ${
                  item.aspect === 'wide' ? 'sm:col-span-2 aspect-[16/9]' : item.aspect === 'tall' ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/75 via-espresso-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-300 block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-normal leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cream-300 font-light mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                {/* Zoom Icon Pill */}
                <div className="absolute top-4 right-4 p-2 rounded-full glass-panel-dark text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 bg-espresso-950/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full max-h-[85vh] bg-[#FCFAF6] rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-espresso-900/60 hover:bg-espresso-900 text-white transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-[55vh] sm:h-[65vh] bg-espresso-950">
                <Image
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-6 bg-[#FCFAF6] border-t border-cream-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-500 block">
                    {lightboxItem.category} • Atelier L’Ambre Archive
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-espresso-950 mt-0.5">
                    {lightboxItem.title}
                  </h4>
                  <p className="text-xs text-espresso-600 mt-1">
                    {lightboxItem.caption}
                  </p>
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-espresso-500">
                  <Camera className="w-4 h-4 text-amberGold-500" />
                  <span>35mm Leica Film Shot</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
