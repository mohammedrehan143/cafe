'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Instagram, Mail, MapPin, Phone, Sparkles, Check, ChefHat, Bike } from 'lucide-react';
import { CAFE_INFO } from '@/data/cafeData';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1D1511] text-[#FCFAF6] pt-20 pb-12 border-t border-espresso-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-espresso-800">
          {/* Brand Column (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="#" className="inline-block">
              <span className="font-serif text-3xl tracking-tight text-cream-50">
                Atelier <span className="italic font-light text-cream-300">L’Ambre</span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cream-400 block mt-1">
                SoHo, New York • Cloud Studio & Roastery
              </span>
            </Link>

            <p className="text-sm text-cream-300 font-light leading-relaxed max-w-sm">
              An artisan culinary cloud kitchen celebrating single-origin coffees, slow temperature extraction, and 72-hour French laminated pastries delivered fresh in Manhattan.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs font-mono text-cream-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Studio Dispatch Active: 7:00 AM – 10:00 PM</span>
            </div>
          </div>

          {/* Quick Links Column (Cols 6-8) */}
          <div className="lg:col-span-3 space-y-4 font-mono text-xs">
            <span className="uppercase tracking-widest text-amberGold-400 font-bold block">
              Navigation & Access
            </span>
            <ul className="space-y-2.5 text-cream-300">
              <li>
                <a href="#menu" className="hover:text-cream-50 transition-colors">
                  Kitchen Menu & Orders
                </a>
              </li>
              <li>
                <a href="#signatures" className="hover:text-cream-50 transition-colors">
                  Signature Creations
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-cream-50 transition-colors">
                  The Sourcing & Roasting
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-cream-50 transition-colors">
                  Delivery Radius & Studio
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-amberGold-400 hover:text-amberGold-300 font-bold transition-colors flex items-center space-x-1"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Admin & Kitchen KDS Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / The Amber Journal (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amberGold-400 font-bold block">
              The Studio Journal
            </span>
            <p className="text-xs text-cream-300 leading-relaxed font-light">
              Receive secret drop codes, new harvest arrivals, and seasonal patisserie menus.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-espresso-800/80 border border-amberGold-500/40 text-xs font-mono text-amberGold-300 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Merci! You are on our VIP release list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-espresso-800 border border-espresso-700 text-cream-50 text-xs focus:outline-none focus:ring-1 focus:ring-amberGold-400 flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-white text-espresso-950 text-xs font-mono font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-400">
          <div className="flex items-center space-x-6">
            <span>© {new Date().getFullYear()} Atelier L’Ambre Cloud Studio. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Studio 4B, 428 Mercer St, SoHo NYC</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="text-amberGold-400 hover:text-white transition-colors flex items-center space-x-1"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </Link>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream-50 transition-colors flex items-center space-x-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@atelier.lambre</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-espresso-800 hover:bg-espresso-700 text-cream-200 transition-colors flex items-center space-x-1"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
