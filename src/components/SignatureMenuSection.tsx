'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Coffee, Utensils, Cake, Wine, SunMedium, Plus, Check } from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { MenuItem } from '@/types/cafe';
import { useOrder } from '@/context/OrderContext';

interface SignatureMenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export default function SignatureMenuSection({ onSelectItem }: SignatureMenuSectionProps) {
  const { addToCart, cart } = useOrder();
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'breakfast' | 'mains' | 'desserts' | 'mocktails'>('all');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Kitchen Creations', icon: Sparkles },
    { id: 'coffee', label: 'Roasts & Brews', icon: Coffee },
    { id: 'breakfast', label: 'Breakfast & Brunch', icon: SunMedium },
    { id: 'mains', label: 'Mains & Tartines', icon: Utensils },
    { id: 'desserts', label: 'Artisanal Patisserie', icon: Cake },
    { id: 'mocktails', label: 'Tonics & Elixirs', icon: Wine },
  ];

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item, 1);
    setAddedItemNotice(item.id);
    setTimeout(() => setAddedItemNotice(null), 1800);
  };

  const getItemQuantityInCart = (itemId: string) => {
    return cart
      .filter((i) => i.menuItem.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  return (
    <section id="menu" className="py-24 lg:py-36 bg-[#FCFAF6] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-cream-200/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
                02 • Cloud Kitchen Menu
              </span>
              <span className="w-8 h-px bg-espresso-300" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.06]">
              Made to Be <span className="italic font-light text-espresso-700">Remembered.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-espresso-600 max-w-md leading-relaxed font-light">
            Every dish and beverage is calibrated for transport stability, temperature retention, and sensory impact. Prepared fresh to order.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'text-cream-50 bg-espresso-900 shadow-warm-sm'
                    : 'text-espresso-700 bg-cream-100 hover:bg-cream-200/70 border border-cream-300/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amberGold-400' : 'text-espresso-500'}`} />
                <span>{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-full bg-espresso-900 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const inCartQty = getItemQuantityInCart(item.id);
              const isJustAdded = addedItemNotice === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                  onClick={() => onSelectItem(item)}
                  className="group relative bg-[#F8F4EC] rounded-2xl overflow-hidden border border-cream-300 shadow-warm-sm hover:shadow-warm-lg transition-all duration-500 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image with Hover Zoom */}
                    <div className="relative h-60 w-full overflow-hidden bg-cream-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Quick View Hover Pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-espresso-950/20 backdrop-blur-[2px]">
                        <span className="glass-panel px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-espresso-900 flex items-center space-x-1.5 shadow-warm-md">
                          <Eye className="w-3.5 h-3.5 text-amberGold-600" />
                          <span>Customize & Details</span>
                        </span>
                      </div>

                      {/* Signature Badge */}
                      {item.signature && (
                        <div className="absolute top-3 left-3 glass-panel px-2.5 py-1 rounded-full flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-amberGold-600 border border-amberGold-500/30">
                          <Sparkles className="w-3 h-3 text-amberGold-500" />
                          <span>Signature</span>
                        </div>
                      )}

                      {/* Price Pill */}
                      <div className="absolute top-3 right-3 glass-panel px-3 py-1 rounded-full font-serif text-base font-bold text-espresso-950">
                        {item.price}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-espresso-500 mb-2">
                        <span>{item.category} • {item.prepTime || '5 min'}</span>
                        {item.origin && <span className="truncate max-w-[140px]">{item.origin}</span>}
                      </div>

                      <h3 className="font-serif text-2xl text-espresso-950 font-normal leading-snug group-hover:text-espresso-800 transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-sm text-espresso-600 mt-2.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Taste Notes Pills */}
                      {item.tasteNotes && item.tasteNotes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {item.tasteNotes.slice(0, 3).map((note) => (
                            <span
                              key={note}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cream-200/80 text-espresso-700 border border-cream-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer Bar */}
                  <div className="px-6 py-3.5 bg-cream-200/50 border-t border-cream-300/70 flex items-center justify-between">
                    <span className="text-xs font-mono text-espresso-600">
                      {inCartQty > 0 ? (
                        <span className="text-emerald-800 font-bold font-mono">
                          {inCartQty} in your bag
                        </span>
                      ) : (
                        'Fresh on-demand extraction'
                      )}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-espresso-900 text-cream-50 hover:bg-espresso-800'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-amberGold-400" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
