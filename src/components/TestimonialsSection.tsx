'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data/cafeData';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const t = TESTIMONIALS[current];

  return (
    <section className="py-24 lg:py-36 bg-[#F8F4EC] relative overflow-hidden border-t border-cream-300">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream-200 border border-cream-300 text-[11px] font-mono tracking-[0.25em] uppercase text-espresso-600 mb-10">
          <Quote className="w-3.5 h-3.5 text-amberGold-500" />
          <span>Critical Acclaim</span>
        </div>

        {/* Testimonial Quote Carousel */}
        <div className="relative min-h-[260px] sm:min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center justify-center space-x-1 text-amberGold-500">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amberGold-400 text-amberGold-500" />
                ))}
              </div>

              {/* Large Editorial Quotation */}
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-espresso-950 font-normal leading-relaxed italic max-w-3xl mx-auto">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author & Publication */}
              <div className="pt-2 flex flex-col items-center">
                <span className="font-serif text-lg font-semibold text-espresso-950">
                  {t.author}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-espresso-500 mt-0.5">
                  {t.role} • <strong className="text-espresso-800 font-semibold">{t.publication}</strong>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination & Arrows */}
        <div className="flex items-center justify-center space-x-4 mt-12">
          <button
            onClick={prev}
            className="p-3 rounded-full bg-white border border-cream-300 hover:border-espresso-900 text-espresso-800 transition-colors shadow-warm-sm active:scale-95"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-8 bg-espresso-900' : 'w-2 bg-cream-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full bg-white border border-cream-300 hover:border-espresso-900 text-espresso-800 transition-colors shadow-warm-sm active:scale-95"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
