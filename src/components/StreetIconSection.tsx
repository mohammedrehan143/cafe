'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StreetIconSection() {
  return (
    <section id="street" className="py-24 lg:py-36 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Top Image Row: Street Image 1 + Popular Dish Newspaper Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-warm-xl border border-banhmi-gold/30 group"
          >
            <Image
              src="https://banhmivietnam.xyz/img/Street%20image%201.png"
              alt="Culinary Studio Energy"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 relative aspect-square rounded-3xl overflow-hidden shadow-warm-lg flex items-center justify-center p-4"
          >
            <Image
              src="https://banhmivietnam.xyz/img/Popular%20dish.png"
              alt="Popular Dish Graphic"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Big Dual-Tone Street Typography */}
        <div className="py-12 text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase font-black text-banhmi-dark leading-[0.95] tracking-tight max-w-6xl mx-auto"
          >
            Zoffers gourmet meals delivered <span className="text-banhmi-red">hot & fresh</span> across the city
          </motion.h2>
        </div>

        {/* Bottom Image Row: Delicious Flavor Newspaper Graphic + Street Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 relative aspect-square rounded-3xl overflow-hidden shadow-warm-lg flex items-center justify-center p-4"
          >
            <Image
              src="https://banhmivietnam.xyz/img/Delicious%20flavor.png"
              alt="Delicious Flavor Graphic"
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-warm-xl border border-banhmi-gold/30 group"
          >
            <Image
              src="https://banhmivietnam.xyz/img/Street%20image%202.png"
              alt="Artisan Cloud Kitchen Dispatch"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
