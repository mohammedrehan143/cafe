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
  Cake,
  Plus,
  Check,
  ChefHat,
  Flame,
  GlassWater,
  Sparkle,
} from 'lucide-react';
import { MENU_ITEMS } from '@/data/cafeData';
import { MenuItem } from '@/types/cafe';
import { useOrder } from '@/context/OrderContext';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';

export default function WholeMenuPage() {
  const { addToCart, cart, setCartDrawerOpen, cartCount, menuItems } = useOrder();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const currentMenu = menuItems && menuItems.length > 0 ? menuItems : MENU_ITEMS;

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'shakes', label: 'Thick Shakes', icon: GlassWater },
    { id: 'fries', label: 'Crispy Fries', icon: Flame },
    { id: 'sandwiches', label: 'Sandwiches', icon: UtensilsCrossed },
    { id: 'pizza', label: 'Pizzas', icon: ChefHat },
    { id: 'desserts', label: 'Desserts', icon: Cake },
    { id: 'drinks', label: 'Coolers', icon: Sparkle },
  ];

  const filteredItems = currentMenu.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item, 1);
    setAddedItemNotice(item.id);
    setTimeout(() => setAddedItemNotice(null), 1500);
  };

  const getItemQuantityInCart = (itemId: string) => {
    return cart
      .filter((i) => i.menuItem.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] font-sans pb-28 selection:bg-[#4A2818] selection:text-white">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-black/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 text-[#1C1917] transition-colors flex items-center space-x-1 font-display text-xs uppercase font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <div>
              <h1 className="font-display text-xl sm:text-2xl uppercase font-black text-[#1C1917] tracking-tight leading-none">
                Zafiroo <span className="text-[#4A2818]">Menu</span>
              </h1>
              <span className="text-[10px] font-mono text-[#1C1917]/50 uppercase tracking-wider hidden sm:block">
                Gourmet Cafe &amp; Artisan Kitchen
              </span>
            </div>
          </div>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="px-4 py-2 rounded-full bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-xs uppercase tracking-wider font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[#4A2818] font-bold text-[10px]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="border-t border-black/5 bg-white/60 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center space-x-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-[#4A2818] text-white shadow-xs'
                      : 'bg-white text-[#1C1917]/70 hover:bg-cream-200 border border-black/10'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-md mx-auto sm:mx-0">
          <Search className="w-4 h-4 text-[#1C1917]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coffee, burgers, fries, shakes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-mono text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
          />
        </div>

        {/* MOBILE LAYOUT (Burger King Style: Photo on Left, Description in Middle, Add on Right) */}
        <div className="space-y-3 md:hidden">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-black/10 p-6">
              <p className="text-sm font-mono text-[#1C1917]/60">No items match your search.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isJustAdded = addedItemNotice === item.id;
              const inCartQty = getItemQuantityInCart(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-black/10 shadow-xs flex items-center justify-between gap-3 hover:border-[#4A2818]/30 transition-all"
                >
                  {/* Left: Item Photo */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                    <Image
                      src={imageErrorMap[item.id] ? 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop' : item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                      onError={() => setImageErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                    />
                    {item.signature && (
                      <div className="absolute top-1 left-1 bg-[#4A2818] text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-md">
                        TOP
                      </div>
                    )}
                  </div>

                  {/* Middle: Name & Small Description */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h3 className="font-display text-base uppercase font-bold text-[#1C1917] leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#1C1917]/65 line-clamp-2 leading-snug mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-mono text-xs font-black text-[#4A2818]">
                        {item.price}
                      </span>
                      {inCartQty > 0 && (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">
                          {inCartQty} in bag
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Direct Add Button (No Customization Needed) */}
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-xs flex items-center justify-center flex-shrink-0 active:scale-95 ${
                      isJustAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#4A2818] hover:bg-[#2E1509] text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <span className="flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* DESKTOP LAYOUT (Rich 3-Column Grid) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isJustAdded = addedItemNotice === item.id;
            const inCartQty = getItemQuantityInCart(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-200">
                    <Image
                      src={imageErrorMap[item.id] ? 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop' : item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      onError={() => setImageErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                    />
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full font-display text-sm font-bold text-[#1C1917] shadow-xs">
                      {item.price}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="text-[10px] font-mono text-[#1C1917]/50 uppercase tracking-wider mb-0.5">
                      {item.category.toUpperCase()} • {item.prepTime || '3m'}
                    </div>

                    <h3 className="font-display text-lg uppercase font-bold text-[#1C1917] leading-snug truncate">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#1C1917]/70 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-3 bg-cream-50 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#1C1917]/60">
                    {inCartQty > 0 ? (
                      <span className="text-emerald-700 font-bold font-mono">
                        {inCartQty} in bag
                      </span>
                    ) : (
                      item.price
                    )}
                  </span>

                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`px-4 py-1.5 rounded-full font-display text-xs uppercase tracking-wider font-bold transition-all shadow-xs flex items-center space-x-1 active:scale-95 ${
                      isJustAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#4A2818] hover:bg-[#2E1509] text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-white" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Cart & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
    </div>
  );
}
