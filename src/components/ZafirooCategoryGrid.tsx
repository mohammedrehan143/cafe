'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, GlassWater, Flame, UtensilsCrossed, ChefHat, Cake, Sparkle } from 'lucide-react';

export default function ZafirooCategoryGrid() {
  const categories = [
    {
      id: 'coffee',
      title: 'Specialty Coffee',
      tagline: '5 Creations • Hot & Cold Brews',
      desc: 'Single-origin Arabica roasts, caramel drizzles & sea salt whipped cream.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      icon: Coffee,
      color: 'from-amber-900/80 to-stone-900/90',
    },
    {
      id: 'shakes',
      title: 'Thick Milkshakes',
      tagline: '3 Creations • KitKat & Chocolate',
      desc: 'Super dense, slow-churned whole cream shakes loaded with wafer crunch.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
      icon: GlassWater,
      color: 'from-rose-900/80 to-stone-900/90',
    },
    {
      id: 'fries',
      title: 'Crispy Gourmet Fries',
      tagline: '3 Creations • Triple-Cooked',
      desc: 'Glass-shatter crisp exterior smothered with molten cheddar & Peri Peri.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop',
      icon: Flame,
      color: 'from-amber-800/80 to-stone-900/90',
    },
    {
      id: 'sandwiches',
      title: 'Artisan Sandwiches',
      tagline: '2 Creations • Brioche Grilled',
      desc: 'Fresh veggies, zesty herb pesto & fluffy scrambled eggs with caramelized onions.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
      icon: UtensilsCrossed,
      color: 'from-emerald-900/80 to-stone-900/90',
    },
    {
      id: 'pizza',
      title: 'Stone-Baked Pizzas',
      tagline: '48h Ferment • Bubbly Mozzarella',
      desc: 'Hand-stretched thin crust baked at 450°C with San Marzano tomatoes.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      icon: ChefHat,
      color: 'from-red-900/80 to-stone-900/90',
    },
    {
      id: 'desserts',
      title: 'Molten Desserts & Bakes',
      tagline: '3 Creations • Lava Brownie & Pastries',
      desc: 'Warm oozing 70% Belgian chocolate, airy cupcakes & flaky butter pastries.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
      icon: Cake,
      color: 'from-purple-950/80 to-stone-900/90',
    },
  ];

  return (
    <section id="categories" className="py-20 lg:py-28 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cream-200 border border-banhmi-gold/40 text-[11px] font-mono font-bold uppercase tracking-widest text-banhmi-red">
            <span>Explore All 18 Culinary Delicacies</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase font-black text-banhmi-dark tracking-tight leading-none">
            Crafted for <span className="text-banhmi-red">Every Craving</span>
          </h2>

          <p className="text-sm sm:text-base text-banhmi-dark/70 font-sans leading-relaxed">
            From morning espresso kicks and crunchy afternoon loaded fries to midnight molten lava brownies and stone-baked pizzas.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-warm-md border border-banhmi-gold/30 flex flex-col justify-end p-6 cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-85 group-hover:opacity-75 transition-opacity`} />

                {/* Content */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFF8F0] font-bold bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {cat.tagline}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl uppercase font-bold text-white tracking-wide group-hover:text-cream-100 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-white/80 font-sans line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/menu"
                      className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-cream-100 transition-colors"
                    >
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
