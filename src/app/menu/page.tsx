'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Sparkles,
  Coffee,
  UtensilsCrossed,
  Wine,
  Cake,
  Plus,
  Check,
  ChefHat,
  Filter,
  Eye,
} from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { MenuItem } from '@/types/cafe';
import { useOrder } from '@/context/OrderContext';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import MenuDetailModal from '@/components/MenuDetailModal';

export default function WholeMenuPage() {
  const { addToCart, cart, setCartDrawerOpen, cartCount } = useOrder();
  const [activeCategory, setActiveCategory] = useState<'all' | 'mains' | 'coffee' | 'mocktails' | 'desserts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Creations', icon: Sparkles },
    { id: 'mains', label: 'Crispy Baguettes', icon: UtensilsCrossed },
    { id: 'coffee', label: 'Specialty Coffee', icon: Coffee },
    { id: 'mocktails', label: 'Tropical Iced Teas', icon: Wine },
    { id: 'desserts', label: 'Desserts & Flan', icon: Cake },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tasteNotes && item.tasteNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesDietary =
      dietaryFilter === 'all' ||
      (item.dietary && item.dietary.some((d) => d.toLowerCase().includes(dietaryFilter.toLowerCase())));

    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleQuickAdd = (item: MenuItem) => {
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
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] font-sans pb-28 selection:bg-banhmi-red selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-banhmi-gold/30 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/"
              className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 text-banhmi-dark transition-colors flex items-center space-x-1.5 font-display text-sm uppercase font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="h-6 w-px bg-banhmi-gold/40 hidden sm:block" />

            <div>
              <h1 className="font-display text-2xl sm:text-3xl uppercase font-black text-banhmi-dark tracking-tight leading-none">
                Zoffers <span className="text-banhmi-red">Full Menu</span>
              </h1>
              <span className="text-[10px] font-mono text-banhmi-dark/60 uppercase tracking-widest hidden sm:block">
                Cloud Studio Dispatch • Baked Fresh Every 2 Hours
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/track"
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-cream-200 text-xs font-mono font-bold text-banhmi-dark hover:bg-cream-300"
            >
              <Search className="w-3.5 h-3.5 text-banhmi-red" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/admin"
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-banhmi-card border border-banhmi-gold/40 text-xs font-mono font-bold text-banhmi-dark hover:bg-cream-200"
            >
              <ChefHat className="w-3.5 h-3.5 text-banhmi-red" />
              <span>Admin KDS</span>
            </Link>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="px-4 sm:px-5 py-2 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-sm sm:text-base uppercase tracking-wider font-bold transition-all shadow-md flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFB703]" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-banhmi-gold/30 shadow-warm-md mb-10 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full font-display text-sm sm:text-base uppercase tracking-wider transition-all flex items-center space-x-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-banhmi-red text-white font-bold shadow-md'
                      : 'bg-cream-100 text-banhmi-dark hover:bg-cream-200 border border-cream-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB703]' : 'text-banhmi-red'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Dietary Filter */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-cream-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-banhmi-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu: pork, chicken, sea salt coffee, vegan, pate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-[#FFF8F0] border border-banhmi-gold/40 px-3 py-2 rounded-2xl text-xs font-mono">
                <Filter className="w-3.5 h-3.5 text-banhmi-red" />
                <select
                  value={dietaryFilter}
                  onChange={(e) => setDietaryFilter(e.target.value)}
                  className="bg-transparent text-banhmi-dark focus:outline-none font-bold"
                >
                  <option value="all">All Dietary</option>
                  <option value="vegan">Vegan / Plant-Based</option>
                  <option value="spicy">Spicy</option>
                  <option value="house classic">House Classic</option>
                  <option value="traditional">Traditional Roast</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-banhmi-gold/30 p-8 space-y-3">
                <UtensilsCrossed className="w-12 h-12 text-banhmi-gold/60 mx-auto" />
                <h3 className="font-display text-3xl uppercase font-bold text-banhmi-dark">No Dishes Found</h3>
                <p className="text-xs sm:text-sm text-banhmi-dark/70 max-w-sm mx-auto font-sans">
                  Try adjusting your search query or dietary filter to see all gourmet creations.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setDietaryFilter('all');
                  }}
                  className="px-6 py-2.5 rounded-full bg-banhmi-red text-white font-display text-sm uppercase font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const inCartQty = getItemQuantityInCart(item.id);
                const isJustAdded = addedItemNotice === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl overflow-hidden border border-banhmi-gold/30 shadow-warm-sm hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Header */}
                      <div
                        onClick={() => setSelectedMenuItem(item)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200 cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-108"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                        {/* Signature Tag */}
                        {item.signature && (
                          <div className="absolute top-3 left-3 bg-banhmi-card/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-banhmi-red border border-banhmi-red/20 shadow-sm flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-[#FFB703]" />
                            <span>House Signature</span>
                          </div>
                        )}

                        {/* Price Pill */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full font-display text-lg font-black text-banhmi-dark shadow-sm">
                          {item.price}
                        </div>

                        {/* Hover Customize Pill */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                          <span className="px-4 py-2 rounded-full bg-white text-banhmi-dark font-display text-xs uppercase tracking-wider font-bold flex items-center space-x-1.5 shadow-lg">
                            <Eye className="w-3.5 h-3.5 text-banhmi-red" />
                            <span>Customize Dish</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between text-[11px] font-mono text-banhmi-dark/50 uppercase tracking-wider mb-1.5">
                          <span>{item.category.toUpperCase()} • {item.prepTime || '5m'}</span>
                          {item.origin && <span className="truncate max-w-[130px] font-semibold text-amber-800">{item.origin}</span>}
                        </div>

                        <h3
                          onClick={() => setSelectedMenuItem(item)}
                          className="font-display text-2xl uppercase font-bold text-banhmi-dark leading-snug group-hover:text-banhmi-red transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h3>

                        <p className="text-xs text-banhmi-dark/70 mt-2 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        {/* Taste Notes */}
                        {item.tasteNotes && (
                          <div className="flex flex-wrap gap-1.5 mt-3.5">
                            {item.tasteNotes.slice(0, 3).map((note) => (
                              <span
                                key={note}
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cream-100 text-banhmi-dark/80 border border-cream-300 font-medium"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="px-6 py-4 bg-cream-100/70 border-t border-cream-200 flex items-center justify-between">
                      <span className="text-xs font-mono text-banhmi-dark/70">
                        {inCartQty > 0 ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            {inCartQty} in your bag
                          </span>
                        ) : (
                          'Baguette Baked Fresh'
                        )}
                      </span>

                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`px-4 py-2 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-banhmi-red hover:bg-banhmi-redDark text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#FFB703]" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Cart & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <MenuDetailModal
        item={selectedMenuItem}
        isOpen={!!selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />
    </div>
  );
}
