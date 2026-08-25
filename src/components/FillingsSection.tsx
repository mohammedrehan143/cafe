'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { useOrder } from '@/context/OrderContext';

export default function FillingsSection() {
  const { addToCart } = useOrder();
  const [slideIndex, setSlideIndex] = useState(0);

  const fillings = [
    { id: 1, title: 'Charcoal BBQ Pork', image: 'https://banhmivietnam.xyz/img/Fillings%201.png', price: '$9.50', tag: 'House Classic' },
    { id: 2, title: 'Honey Lemongrass Chicken', image: 'https://banhmivietnam.xyz/img/Fillings%202.png', price: '$9.00', tag: 'Charred Honey' },
    { id: 3, title: 'Braised Tomato Meatballs', image: 'https://banhmivietnam.xyz/img/Fillings%203.png', price: '$10.00', tag: 'Slow Simmer' },
    { id: 4, title: 'King Oyster Mushroom & Tofu', image: 'https://banhmivietnam.xyz/img/Fillings%204.png', price: '$8.50', tag: '100% Vegan' },
    { id: 5, title: 'Classic Savory Deli Roll', image: 'https://banhmivietnam.xyz/img/Fillings%205.png', price: '$9.00', tag: 'House Pate' },
    { id: 6, title: 'Golden Sunny Egg & Glaze', image: 'https://banhmivietnam.xyz/img/Fillings%206.png', price: '$8.00', tag: 'Morning Energy' },
    { id: 7, title: 'Crispy Crackling Pork Belly', image: 'https://banhmivietnam.xyz/img/Fillings%207.png', price: '$10.50', tag: 'Extra Crunch' },
    { id: 8, title: 'Sizzling Angus Steak & Onion', image: 'https://banhmivietnam.xyz/img/Fillings%208.png', price: '$12.00', tag: 'Chef Special' },
  ];

  const handlePrev = () => {
    setSlideIndex((prev) => (prev === 0 ? fillings.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setSlideIndex((prev) => (prev >= fillings.length - 3 ? 0 : prev + 1));
  };

  const handleQuickAddFilling = (itemTitle: string, price: string) => {
    const matched = MENU_ITEMS.find((m) => m.name.toLowerCase().includes(itemTitle.toLowerCase())) || MENU_ITEMS[0];
    addToCart(matched, 1);
  };

  return (
    <section id="fillings" className="py-24 lg:py-36 bg-[#FFF8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Kinetic 3-Row Typography Heading */}
        <div className="space-y-6 mb-20">
          {/* Row 1 */}
          <div className="flex items-center justify-between overflow-hidden">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-6xl sm:text-8xl md:text-9xl uppercase font-extrabold text-banhmi-dark tracking-tight"
            >
              Types of
            </motion.h2>

            <div className="relative w-32 sm:w-48 md:w-64 h-16 sm:h-24 md:h-28 rounded-2xl overflow-hidden shadow-warm-md border border-banhmi-gold/30">
              <Image
                src="https://banhmivietnam.xyz/img/Topping%201.png"
                alt="Topping 1"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Row 2 (Reversed) */}
          <div className="flex items-center justify-between flex-row-reverse overflow-hidden">
            <motion.h2
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-6xl sm:text-8xl md:text-9xl uppercase font-extrabold text-banhmi-red tracking-tight"
            >
              Zoffers
            </motion.h2>

            <div className="relative w-32 sm:w-48 md:w-64 h-16 sm:h-24 md:h-28 rounded-2xl overflow-hidden shadow-warm-md border border-banhmi-gold/30">
              <Image
                src="https://banhmivietnam.xyz/img/Topping%202.png"
                alt="Topping 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between overflow-hidden">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-6xl sm:text-8xl md:text-9xl uppercase font-extrabold text-banhmi-dark tracking-tight"
            >
              Fillings
            </motion.h2>

            <div className="relative w-32 sm:w-48 md:w-64 h-16 sm:h-24 md:h-28 rounded-2xl overflow-hidden shadow-warm-md border border-banhmi-gold/30">
              <Image
                src="https://banhmivietnam.xyz/img/Topping%203.png"
                alt="Topping 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Carousel Container with Half Circle Top & Bottom Curves */}
        <div className="relative pt-12 pb-16">
          <p className="text-center font-sans text-base sm:text-xl text-banhmi-dark/70 max-w-xl mx-auto mb-10">
            Zoffers offers distinct artisan fillings and can be paired with our specialty coffees and iced teas
          </p>

          {/* Top Half Circle SVG Curve */}
          <div className="relative w-full h-8 sm:h-12 mb-4">
            <Image
              src="https://banhmivietnam.xyz/img/Half%20circle%20top.svg"
              alt="Curve Top"
              fill
              className="object-contain"
            />
          </div>

          {/* Swiper Slider Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fillings.slice(slideIndex, slideIndex + 3).map((filling) => (
              <motion.div
                key={filling.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden border border-banhmi-gold/30 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
                  <Image
                    src={filling.image}
                    alt={filling.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-banhmi-card/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-banhmi-red">
                    {filling.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-display font-bold text-banhmi-dark">
                    {filling.price}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="p-5 flex items-center justify-between">
                  <h4 className="font-display text-2xl uppercase font-bold text-banhmi-dark">
                    {filling.title}
                  </h4>
                  <button
                    onClick={() => handleQuickAddFilling(filling.title, filling.price)}
                    className="p-2.5 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white transition-transform active:scale-95 shadow-sm"
                    title="Add to Order Bag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Half Circle SVG Curve */}
          <div className="relative w-full h-8 sm:h-12 mt-4">
            <Image
              src="https://banhmivietnam.xyz/img/Half%20circle%20bottom.svg"
              alt="Curve Bottom"
              fill
              className="object-contain"
            />
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-4 rounded-full bg-white border border-banhmi-gold/40 text-banhmi-dark hover:bg-banhmi-red hover:text-white transition-colors shadow-warm-sm active:scale-95"
              aria-label="Previous Fillings"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-banhmi-dark/60 font-bold px-2">
              0{slideIndex + 1} / 0{fillings.length - 2}
            </span>
            <button
              onClick={handleNext}
              className="p-4 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white transition-colors shadow-warm-sm active:scale-95"
              aria-label="Next Fillings"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
