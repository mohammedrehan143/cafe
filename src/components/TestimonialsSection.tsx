'use client';

import React from 'react';
import { Star, Sparkles } from 'lucide-react';

const FEATURED_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Aarav Sharma',
    dish: 'Signature Coffee',
    rating: 5,
    quote: 'The sea salt crema layer on top is pure magic. Truly unmatched coffee.',
  },
  {
    id: 'rev-2',
    author: 'Pooja Nair',
    dish: 'Cheesy Fries',
    rating: 5,
    quote: 'Arrived steaming hot and crispy, smothered in molten cheddar.',
  },
  {
    id: 'rev-3',
    author: 'Vikram Malhotra',
    dish: 'Brownie Lava',
    rating: 5,
    quote: 'The warm 70% dark Belgian core literally erupts on your spoon.',
  },
  {
    id: 'rev-4',
    author: 'Meera Iyer',
    dish: 'KitKat Shake',
    rating: 5,
    quote: 'Super thick & crunchy! Hands down the best thick shake in town.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-6 sm:py-8 bg-[#FFF8F0] w-full select-none border-t border-black/5">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#4A2818]" />
            <h2 className="font-display text-xl sm:text-2xl uppercase font-black text-[#1C1917] tracking-tight">
              Words of <span className="text-[#4A2818]">Appreciation</span>
            </h2>
          </div>

          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#1C1917]/70 font-semibold">
            <div className="flex items-center space-x-0.5 text-[#4A2818]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#4A2818] text-[#4A2818]" />
              ))}
            </div>
            <span className="hidden sm:inline">4.9 / 5 Rating • Real Foodies</span>
          </div>
        </div>

        {/* Reviews: Swipeable on Mobile / End-to-End Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-4 w-full pb-2 lg:pb-0">
          {FEATURED_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="w-[260px] sm:w-[280px] lg:w-auto flex-shrink-0 snap-start bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-black/10 shadow-xs hover:shadow-sm hover:border-[#4A2818]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center space-x-0.5 text-[#4A2818] mb-1.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#4A2818] text-[#4A2818]" />
                  ))}
                </div>

                {/* Calligraphy Quote in Double Quotes */}
                <p className="font-calligraphy text-lg sm:text-xl text-[#1C1917] leading-snug font-bold tracking-wide my-1">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between">
                <div className="font-display text-xs uppercase font-bold text-[#1C1917] leading-tight">
                  {review.author}
                </div>
                <div className="font-mono text-[9px] text-[#1C1917]/60">
                  {review.dish}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
