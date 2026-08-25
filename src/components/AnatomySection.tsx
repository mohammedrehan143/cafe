'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AnatomySection() {
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);

  const leftIngredients = [
    { id: 'baguette', name: 'Crispy Baguette', note: 'Airy dough baked fresh every 2 hours' },
    { id: 'cold-cuts', name: 'Smoked Deli Cuts', note: 'Handcrafted mortadella & roasted cuts' },
    { id: 'pork-rolls', name: 'Savory Roast Roll', note: 'Steamed seasoned pork wrapped in herbs' },
    { id: 'margarine', name: 'French Herb Butter', note: 'Hand-whipped yolk & cultured butter' },
    { id: 'sauce', name: 'Signature Umami Glaze', note: 'Secret house seasoning reduction' },
    { id: 'pate', name: 'Artisan Liver Pate', note: 'Slow-simmered pate with shallots' },
  ];

  const rightIngredients = [
    { id: 'daikon', name: 'Pickled Radish', note: 'Sweet & tart vinegar brine for crisp crunch' },
    { id: 'cucumber', name: 'Crisp Cucumbers', note: 'Cool refreshing spears cutting richness' },
    { id: 'coriander', name: 'Garden Cilantro', note: 'Fragrant herbal top notes' },
    { id: 'pepper', name: 'Cracked Black Pepper', note: 'Aromatic pungent spice & subtle heat' },
    { id: 'carrot', name: 'Pickled Carrots', note: 'Julienned sweet carrot shreds' },
    { id: 'chilli', name: 'Garden Chili', note: 'Fresh spicy kick in every bite' },
  ];

  return (
    <section id="anatomy" className="py-24 lg:py-36 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Pre-Anatomy Intro Card */}
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase font-bold text-banhmi-dark leading-[1.08]"
          >
            Discover the delicate balance of textures and flavors that made the world fall in love
          </motion.h2>

          {/* Floating Pre-anatomy image */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative w-72 sm:w-96 md:w-[480px] aspect-[16/9] mx-auto"
          >
            <Image
              src="https://banhmivietnam.xyz/img/Preanatomy%20banh%20mi.png"
              alt="Preanatomy Zoffers Sandwich"
              fill
              className="object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* Main Exploded Anatomy Layout */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-14 lg:p-20 border border-banhmi-gold/40 shadow-warm-xl">
          {/* Top Row: Floating Carrot, Heading "Anatomy", Floating Cucumber */}
          <div className="flex items-center justify-between mb-12">
            <motion.div
              animate={{ rotate: [0, 10, 0], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="relative w-16 h-16 sm:w-28 sm:h-28"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Carrot.png"
                alt="Carrot"
                fill
                className="object-contain drop-shadow-md"
              />
            </motion.div>

            <h3 className="font-display text-6xl sm:text-8xl md:text-9xl uppercase font-extrabold text-banhmi-dark tracking-tight">
              Anatomy
            </h3>

            <motion.div
              animate={{ rotate: [0, -12, 0], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative w-16 h-16 sm:w-28 sm:h-28"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Cucumber.png"
                alt="Cucumber"
                fill
                className="object-contain drop-shadow-md"
              />
            </motion.div>
          </div>

          {/* Middle Row: Left List, Center 3D Sandwich with Star, Right List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Ingredients */}
            <div className="lg:col-span-3 space-y-4 font-display text-2xl sm:text-3xl uppercase tracking-wider text-banhmi-dark">
              {leftIngredients.map((ing) => (
                <div
                  key={ing.id}
                  onMouseEnter={() => setHoveredIngredient(ing.id)}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  className={`cursor-pointer transition-all duration-200 pb-2 border-b border-cream-200 ${
                    hoveredIngredient === ing.id
                      ? 'text-banhmi-red translate-x-2'
                      : 'hover:text-banhmi-red'
                  }`}
                >
                  <div className="font-bold">{ing.name}</div>
                  <div className="font-sans text-xs text-banhmi-dark/60 font-normal lowercase first-letter:uppercase">
                    {ing.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Center 3D Exploded Sandwich & Rotating Star Badge */}
            <div className="lg:col-span-6 relative aspect-square flex items-center justify-center py-6">
              {/* Rotating Star Badge */}
              <div className="absolute w-64 sm:w-80 md:w-96 aspect-square animate-spin-slow opacity-85">
                <Image
                  src="https://banhmivietnam.xyz/img/Star%20red%2010.svg"
                  alt="Red Star Emblem"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Main Anatomy Sandwich */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="relative z-10 w-full h-[85%]"
              >
                <Image
                  src="https://banhmivietnam.xyz/img/Anatomy%20banh%20mi.png"
                  alt="Exploded Anatomy of Zoffers Baguette"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* Right Ingredients */}
            <div className="lg:col-span-3 space-y-4 font-display text-2xl sm:text-3xl uppercase tracking-wider text-banhmi-dark text-right">
              {rightIngredients.map((ing) => (
                <div
                  key={ing.id}
                  onMouseEnter={() => setHoveredIngredient(ing.id)}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  className={`cursor-pointer transition-all duration-200 pb-2 border-b border-cream-200 ${
                    hoveredIngredient === ing.id
                      ? 'text-banhmi-red -translate-x-2'
                      : 'hover:text-banhmi-red'
                  }`}
                >
                  <div className="font-bold">{ing.name}</div>
                  <div className="font-sans text-xs text-banhmi-dark/60 font-normal lowercase first-letter:uppercase">
                    {ing.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Floating Coriander, Heading "Zoffers", Floating Chili */}
          <div className="flex items-center justify-between mt-12">
            <motion.div
              animate={{ rotate: [0, -10, 0], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="relative w-16 h-16 sm:w-28 sm:h-28"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Coriander.png"
                alt="Coriander"
                fill
                className="object-contain drop-shadow-md"
              />
            </motion.div>

            <h3 className="font-display text-6xl sm:text-8xl md:text-9xl uppercase font-extrabold text-banhmi-dark tracking-tight">
              Zoffers
            </h3>

            <motion.div
              animate={{ rotate: [0, 15, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
              className="relative w-16 h-16 sm:w-28 sm:h-28"
            >
              <Image
                src="https://banhmivietnam.xyz/img/Chilli.png"
                alt="Chili"
                fill
                className="object-contain drop-shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
