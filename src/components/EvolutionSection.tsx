'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function EvolutionSection() {
  const evolutionImages = [
    'https://banhmivietnam.xyz/img/Evolution%201.png',
    'https://banhmivietnam.xyz/img/Evolution%202.png',
    'https://banhmivietnam.xyz/img/Evolution%203.png',
    'https://banhmivietnam.xyz/img/Evolution%204.png',
    'https://banhmivietnam.xyz/img/Evolution%205.png',
    'https://banhmivietnam.xyz/img/Evolution%206.png',
  ];

  const milestones = [
    {
      year: '1859',
      title: 'The Heritage Craft',
      yearImg: 'https://banhmivietnam.xyz/img/1859.svg',
      desc: 'Mastering the delicate science of light, shattered glass-like crusts and natural sourdough fermentation.',
      image: 'https://banhmivietnam.xyz/img/Banh%20mi%201859.png',
      reverse: false,
    },
    {
      year: '1958',
      title: 'The Indian Craft Fusion',
      yearImg: 'https://banhmivietnam.xyz/img/1958.svg',
      desc: 'Infusing artisan baguettes with charcoal-seared tandoor marinades, rich herb butters, and tangy pickled garden accompaniments.',
      image: 'https://banhmivietnam.xyz/img/Banh%20mi%201958.png',
      reverse: true,
    },
    {
      year: '2011',
      title: 'Pan-India Cloud Kitchens',
      yearImg: 'https://banhmivietnam.xyz/img/2011.svg',
      desc: 'Delivering hot, crispy gourmet baguettes and single-origin filter coffees in under 25 minutes across Bengaluru, Mumbai, and Delhi.',
      image: 'https://banhmivietnam.xyz/img/Banh%20mi%202011.png',
      reverse: false,
    },
  ];

  return (
    <section id="evolution" className="py-24 lg:py-36 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Evolution Header */}
        <div className="text-center space-y-4 mb-20">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase text-banhmi-dark font-extrabold"
          >
            The Evolution of <span className="text-banhmi-red">Zoffers</span>
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl text-banhmi-dark/70 font-sans max-w-xl mx-auto"
          >
            Bringing the world&apos;s crunchiest artisan baguettes and gourmet cloud kitchen craft to India
          </motion.p>
        </div>

        {/* 6 Grid Collage Behind */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
          {evolutionImages.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-warm-md border border-banhmi-gold/30 bg-cream-200 group"
            >
              <Image
                src={src}
                alt={`Evolution craft step ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </motion.div>
          ))}
        </div>

        {/* 3 Stacking Milestone Cards */}
        <div className="space-y-16 lg:space-y-24">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.year}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className={`p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-banhmi-gold/30 shadow-warm-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                m.reverse ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Left / Right */}
              <div className={`lg:col-span-6 space-y-6 ${m.reverse ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-center justify-between">
                  <div className="relative w-28 sm:w-36 h-12">
                    <Image
                      src={m.yearImg}
                      alt={m.year}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-banhmi-red px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
                    Phase 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase font-bold text-banhmi-dark leading-tight">
                  {m.title}
                </h3>

                <p className="text-base sm:text-lg text-banhmi-dark/80 font-sans leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Big High-Res Imagery */}
              <div className={`lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200 shadow-warm-md border border-cream-300 group ${m.reverse ? 'lg:order-1' : 'lg:order-2'}`}>
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
