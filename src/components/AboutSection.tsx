'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Compass, MapPin, Feather, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const milestones = [
    { year: "2021", label: "Founding in SoHo", desc: "Started as a micro-batch garage roaster on Mercer Street with a single 5kg drum roaster." },
    { year: "2023", label: "Direct Farm Alliances", desc: "Partnered with 6 micro-lot estates across Huila, Colombia & Yirgacheffe, Ethiopia." },
    { year: "2024", label: "The French Patisserie Atelier", desc: "Welcomed Chef Bastien Laurent to craft 72-hour cold-fermented laminated viennoiserie." },
    { year: "Present", label: "Sensory Destination", desc: "A Michelin Guide recommended destination for specialty coffee and culinary brunch." },
  ];

  return (
    <section id="about" className="py-24 lg:py-36 bg-[#FCFAF6] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cream-200/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Eyebrow */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
            04 • The Heritage & Craft
          </span>
          <span className="w-8 h-px bg-espresso-300" />
        </div>

        {/* Asymmetrical Grid Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.08]">
              More Than Coffee. <br />
              <span className="italic font-light text-espresso-700">A Reverence for the Craft.</span>
            </h2>
            <p className="text-base sm:text-lg text-espresso-800 font-light leading-relaxed">
              Atelier L’Ambre was born from a desire to create a sanctuary away from the relentless rush of New York City. A place where coffee extraction is treated with the same precision as fine winemaking, and where the morning croissant is rolled by hand with cultured French butter.
            </p>
            <p className="text-sm text-espresso-600 leading-relaxed">
              Our name, <em className="font-serif italic font-medium text-espresso-900">L’Ambre</em> (Amber), pays homage to the glowing, honeyed crema that tops a perfectly pulled ristretto shot and the warm golden light that fills our sunlit courtyard every morning.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-2xl bg-cream-100 border border-cream-300 shadow-warm-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-espresso-900 text-amberGold-400 flex items-center justify-center font-serif text-lg font-bold">
                  L
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso-950">
                    Bastien & Genevieve Laurent
                  </h4>
                  <span className="text-xs text-espresso-600 font-mono">Founders & Head Roaster</span>
                </div>
              </div>
              <blockquote className="text-xs sm:text-sm text-espresso-700 italic border-l-2 border-amberGold-500 pl-3 leading-relaxed">
                &ldquo;We don&apos;t just serve breakfast and coffee. We curate fifteen unhurried minutes in your morning that set the tone for your entire day.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* Asymmetrical Photo Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center mb-24">
          {/* Big Photo Left */}
          <div className="md:col-span-7 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-warm-xl border border-cream-300/80 group">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop"
              alt="Atelier L'Ambre Sunlit Interior"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amberGold-300 block mb-1">
                The Roastery Space
              </span>
              <p className="font-serif text-xl sm:text-2xl font-normal">
                Designed with travertine, reclaimed oak, and natural linen banquettes.
              </p>
            </div>
          </div>

          {/* Two Stacked Photos Right */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <div className="relative h-[220px] rounded-2xl overflow-hidden shadow-warm-md border border-cream-300/80 group">
              <Image
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop"
                alt="72-Hour Laminated Pastry"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-serif">Handcrafted Viennoiserie</span>
              </div>
            </div>

            <div className="relative h-[220px] rounded-2xl overflow-hidden shadow-warm-md border border-cream-300/80 group">
              <Image
                src="https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1200&auto=format&fit=crop"
                alt="Espresso Barista Craft"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-serif">Dual-PID Barista Calibration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Journey */}
        <div className="pt-12 border-t border-cream-300">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-espresso-500">
                The Journey
              </span>
              <h3 className="font-serif text-3xl text-espresso-950 mt-1">
                Milestones in Craft
              </h3>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-espresso-600">
              <Sparkles className="w-3.5 h-3.5 text-amberGold-500" />
              <span>Continuous Innovation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="p-6 rounded-xl bg-cream-100/60 border border-cream-300/70 relative flex flex-col justify-between hover:bg-cream-100 transition-colors"
              >
                <div>
                  <span className="font-serif text-3xl text-amberGold-600 font-bold block mb-2">
                    {m.year}
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-espresso-950 mb-2">
                    {m.label}
                  </h4>
                  <p className="text-xs text-espresso-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[10px] font-mono text-espresso-400 uppercase">
                  Phase 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
