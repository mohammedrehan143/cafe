'use client';

import React, { useState } from 'react';
import Preloader from '@/components/Preloader';
import ThreeBanhMiHero from '@/components/ThreeBanhMiHero';
import EvolutionSection from '@/components/EvolutionSection';
import AnatomySection from '@/components/AnatomySection';
import FillingsSection from '@/components/FillingsSection';
import BestPicksSection from '@/components/BestPicksSection';
import StreetIconSection from '@/components/StreetIconSection';
import BanhMiFooter from '@/components/BanhMiFooter';
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
    <main className="min-h-screen bg-[#FFF8F0] text-[#1C1917] relative selection:bg-[#E23727] selection:text-white">
      {/* 1. Opening Preloader Animation (Crispy -> Tasty -> Irresistible) */}
      <Preloader />

      {/* 2. Hero Section with 3D Floating Bánh Mì & Kinetic Typography */}
      <ThreeBanhMiHero />

      {/* 3. The Evolution Timeline & Sticky Milestone Cards */}
      <EvolutionSection />

      {/* 4. Interactive 3D Anatomy of Bánh Mì & Exploded Ingredients */}
      <AnatomySection />

      {/* 5. Kinetic 3-Row Fillings & Carousel Slider */}
      <FillingsSection />

      {/* 6. Best Picks Curated Section (With Button to Full Menu Page /menu) */}
      <BestPicksSection onSelectItem={handleSelectMenuItem} />

      {/* 7. Street Icon Culture & Newspaper Typography */}
      <StreetIconSection />

      {/* 8. Bánh Mì Editorial Footer & Split Graphics */}
      <BanhMiFooter />

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
