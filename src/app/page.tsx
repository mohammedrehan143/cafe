'use client';

import React, { useState } from 'react';
import Preloader from '@/components/Preloader';
import ZafirooHero from '@/components/ZafirooHero';
import BestPicksSection from '@/components/BestPicksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ZafirooFooter from '@/components/ZafirooFooter';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import MenuDetailModal from '@/components/MenuDetailModal';
import { MenuItem } from '@/types/cafe';

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
      {/* 1. Opening Preloader Animation */}
      <Preloader />

      {/* 2. Zafiroo Hero Section with Cinematic Background Video */}
      <ZafirooHero />

      {/* 3. Zafiroo Best Picks Curated Spotlight (Add to Cart / Customizer) */}
      <BestPicksSection onSelectItem={handleSelectMenuItem} />

      {/* 4. Testimonials & Social Acclaim */}
      <TestimonialsSection />

      {/* 5. Zafiroo Gourmet Cafe Footer */}
      <ZafirooFooter />

      {/* Interactive Cart, Checkout, Live Tracker, and Customizer Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <MenuDetailModal
        item={selectedMenuItem}
        isOpen={!!selectedMenuItem}
        onClose={handleCloseMenuModal}
      />
    </main>
  );
}
