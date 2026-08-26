'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Coffee, Award, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import { BRAND_PILLARS } from '@/data/cafeData';

export default function ZafirooCraftSection() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 0,
      number: '01',
      title: 'Single-Origin 100% Arabica',
      subtitle: 'Artisan Coffee Roastery',
      desc: 'Selected from 1,400m high-altitude estates in Chikmagalur. Micro-roasted in small batches to 218°C to develop rich notes of dark cacao, toasted hazelnut, and natural caramelized sweetness.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
      stats: [
        { label: 'Elevation', value: '1,400m' },
        { label: 'SCA Score', value: '89.0' },
        { label: 'Roast Profile', value: 'Medium-Dark' },
      ]
    },
    {
      id: 1,
      number: '02',
      title: 'Triple-Fried Potato Science',
      subtitle: 'Glass-Shatter Crisp Guarantee',
      desc: 'Hand-cut russet potatoes soaked, steam-blanched, and triple-cooked in custom temperature stages. Creates a glass-like crisp exterior that stays crunchy even when smothered in molten cheese.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop',
      stats: [
        { label: 'Cook Stages', value: '3 Phases' },
        { label: 'Crisp Retention', value: '30+ Mins' },
        { label: 'Potato Cut', value: 'Skin-On Russet' },
      ]
    },
    {
      id: 2,
      number: '03',
      title: '48h Fermented Sourdough Pizzas',
      subtitle: 'Stone-Baked Volcanic Heat',
      desc: 'Naturally fermented over two full days to create an airy, easily digestible dough. Flashed in our stone hearth oven at 450°C for golden blistered crusts and gooey mozzarella pull.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
      stats: [
        { label: 'Ferment Time', value: '48 Hours' },
        { label: 'Oven Temp', value: '450°C' },
        { label: 'Tomatoes', value: 'San Marzano' },
      ]
    },
    {
      id: 3,
      number: '04',
      title: '70% Belgian Couverture Bakes',
      subtitle: 'Pure Molten Dark Lava',
      desc: 'Real Belgian dark cocoa melted into fudgy brownie batter. Baked to order so the center stays irresistibly warm and flows luxuriously upon your very first spoonful.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop',
      stats: [
        { label: 'Cocoa Purity', value: '70% Dark' },
        { label: 'Lava Flow', value: '100% Molten' },
        { label: 'Butter', value: 'Pure Cultured' },
      ]
    }
  ];

  const current = pillars[activePillar];

  return (
    <section id="experience" className="py-24 lg:py-36 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cream-200 border border-banhmi-gold/40 text-xs font-mono font-bold uppercase tracking-widest text-banhmi-red">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Zafiroo Culinary Standard</span>
          </div>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase font-black text-banhmi-dark tracking-tight leading-[0.92]">
            Obsessed with <span className="text-banhmi-red">Every Detail</span>
          </h2>

          <p className="text-sm sm:text-base text-banhmi-dark/70 font-sans leading-relaxed">
            We reject shortcuts. Every roast, sauce, potato blanch, and dough ferment is calibrated to deliver the ultimate gourmet cloud kitchen experience.
          </p>
        </div>

        {/* Interactive Pillar Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {pillars.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePillar(idx)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-display text-sm sm:text-base uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 ${
                activePillar === idx
                  ? 'bg-banhmi-red text-white font-bold shadow-warm-md scale-105'
                  : 'bg-white text-banhmi-dark hover:bg-cream-200 border border-banhmi-gold/30'
              }`}
            >
              <span className="font-mono text-xs opacity-75">{p.number}</span>
              <span>{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Main Pillar Card Display */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-banhmi-gold/40 shadow-warm-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Text & Stats (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cream-100 text-xs font-mono font-bold uppercase tracking-wider text-banhmi-red">
              <span>{current.subtitle}</span>
            </div>

            <h3 className="font-display text-3xl sm:text-5xl uppercase font-black text-banhmi-dark leading-tight">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-banhmi-dark/80 leading-relaxed font-sans">
              {current.desc}
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cream-200">
              {current.stats.map((s, i) => (
                <div key={i} className="bg-cream-100/70 p-3.5 rounded-2xl border border-cream-200 text-center">
                  <div className="font-display text-xl sm:text-2xl font-black text-banhmi-dark">{s.value}</div>
                  <div className="text-[10px] sm:text-xs font-mono text-banhmi-dark/60 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right High-Res Photo (Cols 8-12) */}
          <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden shadow-warm-lg border border-banhmi-gold/30">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-banhmi-dark">
                Zafiroo Signature Craft
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-banhmi-gold/30 shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl uppercase font-bold text-banhmi-dark">Under 30 Min Dispatch</h4>
              <p className="text-xs text-banhmi-dark/70 mt-1 leading-relaxed">
                Streamlined cloud studio pipeline ensures hot items stay crunchy and iced drinks stay chilled during transit.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-banhmi-gold/30 shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-banhmi-red flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl uppercase font-bold text-banhmi-dark">Thermal Sealed Packaging</h4>
              <p className="text-xs text-banhmi-dark/70 mt-1 leading-relaxed">
                Custom ventilated food boxes prevent steam condensation so fries never get soggy and pizzas retain crunch.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-banhmi-gold/30 shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl uppercase font-bold text-banhmi-dark">Fresh Made to Order</h4>
              <p className="text-xs text-banhmi-dark/70 mt-1 leading-relaxed">
                No pre-made holding warmers. Every order is freshly ground, pulled, fried, and baked upon ticket receipt.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
