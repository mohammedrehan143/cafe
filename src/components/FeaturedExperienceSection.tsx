'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Timer, Droplets, Thermometer, Flame } from 'lucide-react';

export default function FeaturedExperienceSection() {
  const [activeStep, setActiveStep] = useState(0);

  const ritualSteps = [
    {
      title: "01. The Botanical Bloom",
      time: "0:00 – 0:45",
      temp: "92.5°C",
      desc: "45-second pre-infusion releasing volatile floral aromatics and trapped CO₂ from fresh roasted grounds.",
      ratio: "1:2 Water Bloom",
    },
    {
      title: "02. Spiral Continuous Pour",
      time: "0:45 – 1:30",
      temp: "92.0°C",
      desc: "Concentric circular pours with gooseneck kettle to ensure uniform saturation and zero channeling.",
      ratio: "3-Stage Dispersion",
    },
    {
      title: "03. Gentle Agitation & Drawdown",
      time: "1:30 – 2:45",
      temp: "91.5°C",
      desc: "Controlled laminar drawdown through Japanese bleached filter paper for absolute clarity in the cup.",
      ratio: "1:15.5 Golden Yield",
    },
    {
      title: "04. Ceramic Snifter Service",
      time: "3:00",
      temp: "62°C Optimal Drinking",
      desc: "Served in hand-thrown thin-lipped ceramic tumblers designed to concentrate jasmine and peach notes.",
      ratio: "Pure Micro-Lot",
    },
  ];

  return (
    <section className="relative py-28 lg:py-40 bg-espresso-950 text-[#FCFAF6] overflow-hidden">
      {/* Background Cinematic Full-Bleed Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1800&auto=format&fit=crop"
          alt="Artisanal Hand Pour-Over Ritual"
          fill
          className="object-cover opacity-25 scale-105 transition-transform duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/85 to-espresso-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-transparent to-espresso-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Atmospheric Typography */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-amberGold-400">
                03 • The Pour-Over Ritual
              </span>
              <span className="w-8 h-px bg-amberGold-500/40" />
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-cream-50 font-normal leading-[1.02]">
              Slow mornings. <br />
              <span className="italic font-light text-cream-200">Strong coffee.</span> <br />
              Good company.
            </h2>

            <p className="text-base sm:text-lg text-cream-300 font-light leading-relaxed max-w-lg">
              Time slows down when water meets freshly ground single-origin Geisha. Our signature pour-over bar is designed as an open theatrical stage where guests can watch every step of extraction.
            </p>

            {/* Quick Feature Metric Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="font-serif text-3xl text-amberGold-400 font-normal">
                  92.4°
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-cream-400">
                  Infusion Temp
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-amberGold-400 font-normal">
                  2:45
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-cream-400">
                  Target Brew Time
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-amberGold-400 font-normal">
                  1:15.5
                </span>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-cream-400">
                  Brew Ratio
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Ritual Step Visualizer */}
          <div className="lg:col-span-6">
            <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amberGold-400 block">
                    Sensory Breakdown
                  </span>
                  <h3 className="font-serif text-2xl text-cream-50 mt-0.5">
                    The 4-Stage V60 Method
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-white/5 border border-white/10 text-amberGold-400">
                  <Timer className="w-5 h-5" />
                </div>
              </div>

              {/* Steps Accordion / Selector */}
              <div className="space-y-3">
                {ritualSteps.map((step, idx) => (
                  <div
                    key={step.title}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      activeStep === idx
                        ? 'bg-white/10 border-amberGold-500/60 shadow-lg'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-medium text-cream-50">
                        {step.title}
                      </h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-amberGold-300">
                        {step.time}
                      </span>
                    </div>

                    {activeStep === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs text-cream-300"
                      >
                        <p className="leading-relaxed">{step.desc}</p>
                        <div className="flex items-center space-x-4 pt-1 font-mono text-[11px] text-amberGold-300">
                          <span className="flex items-center space-x-1">
                            <Thermometer className="w-3.5 h-3.5" />
                            <span>{step.temp}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Droplets className="w-3.5 h-3.5" />
                            <span>{step.ratio}</span>
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Note */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cream-400">
                <span>Available daily at the Bar</span>
                <span className="text-amberGold-400">Single Origin Geisha & Heirlooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
