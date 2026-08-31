'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ZafirooHero from '@/components/ZafirooHero';
import BestPicksSection from '@/components/BestPicksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ZafirooFooter from '@/components/ZafirooFooter';
import { MenuItem } from '@/types/cafe';

// Dynamically load interactive modals only when needed to keep initial mobile JS tiny
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });
const CheckoutModal = dynamic(() => import('@/components/CheckoutModal'), { ssr: false });
const OrderTrackingModal = dynamic(() => import('@/components/OrderTrackingModal'), { ssr: false });
const MenuDetailModal = dynamic(() => import('@/components/MenuDetailModal'), { ssr: false });

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleSelectMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
  };

  const handleCloseMenuModal = () => {
    setSelectedMenuItem(null);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#1C1917] relative selection:bg-[#4A2818] selection:text-white">
      {/* 1. Zafiroo Hero Section with Cinematic Background */}
      <ZafirooHero />

      {/* 2. Zafiroo Best Picks Curated Spotlight (Add to Cart / Customizer) */}
      <BestPicksSection onSelectItem={handleSelectMenuItem} />

      {/* 3. Testimonials & Social Acclaim */}
      <TestimonialsSection />

      {/* 4. Zafiroo Gourmet Cafe Footer */}
      <ZafirooFooter />

      {/* Interactive Cart, Checkout, Live Tracker, and Customizer Modals (Loaded On-Demand) */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      {selectedMenuItem && (
        <MenuDetailModal
          item={selectedMenuItem}
          isOpen={!!selectedMenuItem}
          onClose={handleCloseMenuModal}
        />
      )}
    </main>
  );
}
