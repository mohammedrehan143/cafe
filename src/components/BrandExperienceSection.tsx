'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Clock, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BRAND_PILLARS, CAFE_INFO } from '@/data/cafeData';

export default function BrandExperienceSection() {
  return (
    <section id="experience" className="relative py-24 lg:py-36 bg-[#F8F4EC] overflow-hidden">
      {/* Background Architectural Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cream-400 to-transparent" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amberGold-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Tag */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
            01 • The Philosophy
          </span>
          <span className="w-8 h-px bg-espresso-300" />
        </div>

        {/* Split Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Manifesto & Story */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.08]">
              Slow Craft In An <br />
              <span className="italic font-light text-espresso-700">Unhurried Sanctuary.</span>
            </h2>

            <p className="text-base sm:text-lg text-espresso-800 font-light leading-relaxed">
              We founded Atelier L’Ambre on a singular premise: that the ritual of coffee and morning pastry is not a transaction, but an art form deserving of patient craftsmanship and mindful enjoyment.
            </p>

            <p className="text-sm sm:text-base text-espresso-600 leading-relaxed">
              From our direct relationships with smallholder coffee farmers at altitude in the Huila and Yirgacheffe regions, to our 72-hour cold-proofed sourdough viennoiserie, every detail is engineered to honor the origin and the artisan.
            </p>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cream-300">
              <div className="space-y-1">
                <span className="font-serif text-2xl lg:text-3xl text-espresso-950 font-normal">
                  100%
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600">
                  Micro-Lot Single Origin
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl lg:text-3xl text-espresso-950 font-normal">
                  72 hrs
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600">
                  Laminated Pastry
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl lg:text-3xl text-espresso-950 font-normal">
                  88+
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600">
                  SCA Cup Score
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Photography & Floating Cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-warm-xl border border-cream-300/80 group">
              <Image
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop"
                alt="Atelier L'Ambre Roastery Atmosphere"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-espresso-950/10 to-transparent" />

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-5 sm:p-6 rounded-xl border border-cream-300/80 shadow-warm-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-full bg-espresso-900 text-amberGold-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-espresso-950">
                        In-House Micro Roasting
                      </h4>
                      <p className="text-xs text-espresso-600">
                        San Franciscan 10kg Drum Roaster • Daily Batch
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amberGold-600 px-2 py-1 bg-cream-200 rounded">
                    Batch #418
                  </span>
                </div>
              </div>
            </div>

            {/* Accent Floating Badge Top Right */}
            <div className="absolute -top-4 -right-4 hidden sm:flex glass-panel px-4 py-3 rounded-xl shadow-warm-md border border-cream-300 flex-col items-center animate-float-slow">
              <Sparkles className="w-4 h-4 text-amberGold-500 mb-1" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-800 font-bold">
                Ethical Sourcing
              </span>
              <span className="text-[9px] text-espresso-500 font-mono">100% Direct-to-Farm</span>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-20 pt-12 border-t border-cream-300/80">
          {BRAND_PILLARS.map((pillar) => (
            <motion.div
              key={pillar.number}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-2xl bg-[#FCFAF6] border border-cream-300 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-amberGold-600">
                    {pillar.number}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cream-200 text-espresso-700 font-semibold">
                    {pillar.stat}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-espresso-950 font-normal mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-espresso-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-cream-200 text-[11px] font-mono text-espresso-500 uppercase tracking-wider">
                {pillar.statLabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
