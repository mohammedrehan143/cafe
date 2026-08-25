'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Clock, ChefHat, Sparkles, Bike } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

export default function Navbar() {
  const { cartCount, setCartDrawerOpen, setTrackingModalOpen, activeTrackingOrder } = useOrder();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'experience', 'menu', 'signatures', 'about', 'gallery', 'location'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Kitchen Menu', href: '#menu' },
    { name: 'Signatures', href: '#signatures' },
    { name: 'Craft & Sourcing', href: '#experience' },
    { name: 'Studio Story', href: '#about' },
    { name: 'Atmosphere', href: '#gallery' },
    { name: 'Delivery & Hours', href: '#location' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#FCFAF6]/90 backdrop-blur-md border-b border-cream-300/40 shadow-warm-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link
            href="#"
            className="group flex flex-col items-start transition-transform duration-300 hover:opacity-90"
          >
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl lg:text-3xl font-normal tracking-tight text-espresso-950">
                Atelier <span className="italic font-light text-espresso-700">L’Ambre</span>
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amberGold-500" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 -mt-1 hidden sm:block">
              SoHo • Artisan Cloud Studio & Roastery
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[12px] tracking-widest uppercase font-medium text-espresso-700 hover:text-espresso-950 transition-colors duration-200 py-1"
              >
                {link.name}
                {activeSection === link.href.replace('#', '') && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-espresso-900"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className="px-3 py-1 rounded-full bg-cream-200/80 hover:bg-cream-300/80 text-[11px] font-mono text-espresso-800 uppercase tracking-wider transition-colors flex items-center space-x-1.5 border border-cream-300"
            >
              <ChefHat className="w-3.5 h-3.5 text-amberGold-600" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Delivery Status Badge */}
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-cream-200/60 border border-cream-300/50 text-[11px] font-mono text-espresso-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Delivering Now (25m)</span>
            </div>

            {/* Active Order Tracker Button */}
            {activeTrackingOrder && (
              <button
                onClick={() => setTrackingModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-amberGold-100 border border-amberGold-300 text-[11px] font-mono text-amberGold-900 font-semibold animate-pulse flex items-center space-x-1"
              >
                <Bike className="w-3.5 h-3.5 text-amberGold-600" />
                <span>Track {activeTrackingOrder.id}</span>
              </button>
            )}

            {/* Order Bag / Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-[#FCFAF6] bg-espresso-900 hover:bg-espresso-800 transition-all duration-300 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5 text-amberGold-400" />
              <span>Order Now</span>
              {cartCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amberGold-500 text-espresso-950 font-bold text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-espresso-900 hover:bg-cream-200/50 md:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FCFAF6]/98 backdrop-blur-xl md:hidden pt-28 px-8 pb-12 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col space-y-5">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-espresso-400">
                Navigation
              </span>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-espresso-950 hover:text-espresso-600 transition-colors flex items-center justify-between border-b border-cream-200 pb-2.5"
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-mono text-espresso-400">0{idx + 1}</span>
                </motion.a>
              ))}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-amberGold-700 hover:text-amberGold-800 transition-colors flex items-center justify-between border-b border-cream-200 pb-2.5 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <span>Admin & Kitchen Portal</span>
                </div>
                <span className="text-xs font-mono text-amberGold-600 font-bold">KDS</span>
              </Link>
            </div>

            <div className="pt-8 border-t border-cream-300/60 flex flex-col space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-espresso-700">
                <Clock className="w-4 h-4 text-amberGold-500" />
                <span>Cloud Studio Dispatch: 7 AM – 10 PM</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartDrawerOpen(true);
                }}
                className="w-full py-4 rounded-full text-center text-xs uppercase tracking-widest font-semibold text-[#FCFAF6] bg-espresso-900 shadow-warm-md flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4 text-amberGold-400" />
                <span>View Order Bag ({cartCount})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
