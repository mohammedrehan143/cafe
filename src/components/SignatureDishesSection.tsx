'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ChefHat, Wine, ShoppingBag, Check } from 'lucide-react';
import { SIGNATURE_DISHES, MENU_ITEMS } from '@/data/cafeData';
import { useOrder } from '@/context/OrderContext';

export default function SignatureDishesSection() {
  const { addToCart } = useOrder();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const dish = SIGNATURE_DISHES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SIGNATURE_DISHES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === SIGNATURE_DISHES.length - 1 ? 0 : prev + 1));
  };

  const handleOrderSignature = () => {
    const menuItem = MENU_ITEMS.find((m) => m.name === dish.name) || MENU_ITEMS[0];
    addToCart(menuItem, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <section id="signatures" className="py-24 lg:py-36 bg-[#F8F4EC] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-cream-300/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
                05 • Signature Masterpieces
              </span>
              <span className="w-8 h-px bg-espresso-300" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.06]">
              Masterpieces of <span className="italic font-light text-espresso-700">Taste.</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              className="p-3.5 rounded-full bg-white border border-cream-300 hover:border-espresso-900 text-espresso-800 transition-colors shadow-warm-sm active:scale-95"
              aria-label="Previous Signature Dish"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-espresso-600 px-2">
              0{currentIndex + 1} / 0{SIGNATURE_DISHES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-3.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-cream-50 transition-colors shadow-warm-sm active:scale-95"
              aria-label="Next Signature Dish"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Spotlight Showcase Card */}
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-10 lg:p-14 border border-cream-300 shadow-warm-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left High-Res Photography Spotlight */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-warm-lg bg-cream-200 group">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/40 via-transparent to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 glass-panel px-4 py-1.5 rounded-full font-serif text-xl font-bold text-espresso-950 shadow-warm-md">
                  {dish.price}
                </div>

                {/* Signature Indicator */}
                <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full flex items-center space-x-1.5 text-xs font-mono uppercase text-amberGold-600">
                  <Sparkles className="w-3.5 h-3.5 text-amberGold-500" />
                  <span>Chef Curated</span>
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                {SIGNATURE_DISHES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      currentIndex === idx
                        ? 'border-espresso-900 scale-105 shadow-warm-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Information & Flavor Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-amberGold-600 font-bold block mb-1">
                  {dish.subtitle}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso-950 font-normal leading-tight">
                  {dish.name}
                </h3>
              </div>

              <p className="text-base sm:text-lg text-espresso-700 font-light leading-relaxed">
                {dish.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-cream-200/80 border border-cream-300 text-espresso-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Flavor Profile Matrix */}
              <div className="p-5 rounded-2xl bg-cream-100/70 border border-cream-300 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 block">
                  Sensory Flavor Radar (%)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(dish.flavorProfile).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-espresso-700 capitalize">
                        <span>{key}</span>
                        <span className="font-bold">{val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-cream-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-espresso-800 rounded-full transition-all duration-700"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Note & Pairing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-cream-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-espresso-500 uppercase">
                    <ChefHat className="w-3.5 h-3.5 text-amberGold-500" />
                    <span>Chef&apos;s Craft Note</span>
                  </div>
                  <p className="text-xs text-espresso-700 leading-snug">
                    {dish.chefNote}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-cream-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-espresso-500 uppercase">
                    <Wine className="w-3.5 h-3.5 text-amberGold-500" />
                    <span>Recommended Pairing</span>
                  </div>
                  <p className="text-xs text-espresso-700 leading-snug">
                    {dish.pairing}
                  </p>
                </div>
              </div>

              {/* Order Signature Dish Button */}
              <div className="pt-2">
                <button
                  onClick={handleOrderSignature}
                  className={`w-full py-4 rounded-full font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-warm-md flex items-center justify-center space-x-2 ${
                    justAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-espresso-900 hover:bg-espresso-800 text-cream-50'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Order Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amberGold-400" />
                      <span>Order This Signature ({dish.price})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
