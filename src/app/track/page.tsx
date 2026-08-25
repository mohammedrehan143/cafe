'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Bike,
  Store,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  RefreshCw,
  Package,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS, CAFE_INFO } from '@/data/cafeData';

function TrackerContent() {
  const searchParams = useSearchParams();
  const initialQueryId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialQueryId);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Query API
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        setCurrentOrder(data.order);
      } else {
        // 2. Local storage / Demo Fallback
        const saved = localStorage.getItem('atelier_lambre_orders_v1');
        const localList: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
        const matched = localList.find(
          (o) =>
            o.id.toUpperCase() === query.trim().toUpperCase() ||
            o.customer.phone.includes(query.trim()) ||
            o.customer.name.toLowerCase().includes(query.trim().toLowerCase())
        );

        if (matched) {
          setCurrentOrder(matched);
        } else {
          setErrorMsg('No active order found with this Tracking ID or Phone Number. Note: Orders older than 10 days are automatically archived.');
          setCurrentOrder(null);
        }
      }
    } catch {
      // Offline fallback
      const saved = localStorage.getItem('atelier_lambre_orders_v1');
      const localList: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
      const matched = localList.find((o) => o.id.toUpperCase() === query.trim().toUpperCase());
      if (matched) {
        setCurrentOrder(matched);
      } else {
        setErrorMsg('Unable to retrieve tracking details. Please verify your Tracking ID.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQueryId) {
      fetchOrder(initialQueryId);
    } else {
      // Load default latest order for preview
      setCurrentOrder(INITIAL_ORDERS[0]);
    }
  }, [initialQueryId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const steps = [
    { key: 'new', label: 'Order Received', desc: 'Ticket acknowledged by Zoffers kitchen station', icon: CheckCircle2 },
    { key: 'preparing', label: 'Chef Preparing', desc: 'Baking crispy baguette crust & grilling savory meats', icon: ChefHat },
    { key: 'ready', label: 'Thermal Packaged', desc: 'Crispy ventilated seal locked for heat retention', icon: Package },
    {
      key: 'delivering',
      label: currentOrder?.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready at Studio Counter',
      desc: currentOrder?.deliveryMethod === 'delivery' ? 'Thermal courier en route to your address' : 'Waiting for pickup at 428 Mercer St, SoHo',
      icon: currentOrder?.deliveryMethod === 'delivery' ? Bike : Store,
    },
    { key: 'completed', label: 'Delivered & Enjoyed', desc: 'Enjoy your fresh meal!', icon: Sparkles },
  ];

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'new': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivering': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(currentOrder?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
      {/* Search Bar Input */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-banhmi-gold/30 shadow-warm-xl mb-10 text-center space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-banhmi-red font-bold block">
          Universal Live Tracking Engine
        </span>
        <h2 className="font-display text-4xl sm:text-5xl uppercase font-black text-banhmi-dark tracking-tight">
          Track Your <span className="text-banhmi-red">Zoffers Order</span>
        </h2>
        <p className="text-xs sm:text-sm text-banhmi-dark/70 max-w-md mx-auto">
          Enter your unique tracking code (e.g. <strong className="font-mono text-banhmi-red">ZF-8812-XK</strong>) or phone number.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto pt-2">
          <input
            type="text"
            required
            placeholder="Enter Tracking ID (e.g. ZF-8812-XK)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-banhmi-red"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-2xl bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-base uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center justify-center space-x-2 mt-4">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Live Order Display Card */}
      {currentOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-banhmi-gold/30 shadow-warm-xl overflow-hidden mb-12"
        >
          {/* Header Strip */}
          <div className="p-6 sm:p-8 bg-banhmi-card/70 border-b border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800">
                  Live Dispatch Stream
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl uppercase font-black text-banhmi-dark mt-1">
                Order <span className="text-banhmi-red">{currentOrder.id}</span>
              </h3>
              <span className="text-xs font-mono text-banhmi-dark/60">
                Placed: {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(currentOrder.createdAt).toLocaleDateString()}
              </span>
            </div>

            <button
              onClick={() => fetchOrder(currentOrder.id)}
              className="self-start sm:self-auto p-2.5 rounded-2xl bg-white border border-banhmi-gold/30 hover:bg-cream-200 text-banhmi-dark text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-banhmi-red" />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Big ETA Banner */}
            <div className="p-6 rounded-3xl bg-banhmi-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-lg">
              <div className="text-center sm:text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFB703] font-bold block">
                  {currentOrder.deliveryMethod === 'delivery' ? 'Estimated Courier Arrival' : 'Estimated Counter Pickup'}
                </span>
                <div className="font-display text-4xl sm:text-5xl uppercase font-black text-white mt-1">
                  {currentOrder.estimatedTime}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 text-[#FFB703]">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div className="space-y-4 pt-2">
              <span className="font-mono text-xs uppercase tracking-widest text-banhmi-red font-bold block">
                Kitchen Progress Status
              </span>

              <div className="space-y-5">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start space-x-4 relative">
                      {/* Vertical line */}
                      {idx < steps.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-10 -ml-[1px] transition-colors ${
                            idx < currentStepIndex ? 'bg-emerald-600' : 'bg-cream-300'
                          }`}
                        />
                      )}

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 transition-all ${
                          isCurrent
                            ? 'bg-banhmi-red text-white ring-4 ring-rose-200 font-bold scale-110 shadow-md'
                            : isDone
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-cream-200 text-banhmi-dark/40 border border-cream-300'
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-display text-xl uppercase font-bold ${
                              isDone ? 'text-banhmi-dark' : 'text-banhmi-dark/40'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="px-3 py-0.5 rounded-full bg-rose-100 text-banhmi-red text-[10px] font-mono font-bold uppercase animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-banhmi-dark/70 mt-0.5 font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="p-5 rounded-2xl bg-cream-100/70 border border-cream-300 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-banhmi-dark block">
                Ordered Items ({currentOrder.items.length})
              </span>
              <div className="space-y-2">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-mono border-b border-cream-200 pb-1.5">
                    <span className="font-bold text-banhmi-dark">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-semibold text-banhmi-dark">
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between font-display text-xl uppercase font-black text-banhmi-dark border-t border-cream-300">
                <span>Total Amount</span>
                <span>${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer & Address details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-banhmi-dark/80 pt-2 border-t border-cream-200">
              <div className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 space-y-1">
                <span className="text-banhmi-dark/50 uppercase font-bold block mb-1">Customer Contact</span>
                <div className="font-bold text-banhmi-dark text-sm">{currentOrder.customer.name}</div>
                <div className="flex items-center space-x-1.5 text-banhmi-red">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentOrder.customer.phone}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 space-y-1">
                <span className="text-banhmi-dark/50 uppercase font-bold block mb-1">
                  {currentOrder.deliveryMethod === 'delivery' ? 'Delivery Address' : 'Studio Pickup Location'}
                </span>
                <div className="flex items-start space-x-1.5 text-banhmi-dark font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-banhmi-red mt-0.5 flex-shrink-0" />
                  <span>
                    {currentOrder.deliveryMethod === 'delivery'
                      ? currentOrder.customer.address || 'SoHo, Manhattan'
                      : 'Studio 4B, 428 Mercer St, SoHo NYC'}
                  </span>
                </div>
                {currentOrder.customer.unitOrApt && (
                  <div className="text-xs text-banhmi-dark/60 pl-5">{currentOrder.customer.unitOrApt}</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function UniversalTrackingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] font-sans pb-28 selection:bg-banhmi-red selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-banhmi-gold/30 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 text-banhmi-dark transition-colors flex items-center space-x-1.5 font-display text-sm uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/menu" className="font-display text-sm uppercase font-bold text-banhmi-red hover:underline">
            Browse Menu
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="text-center py-20 font-mono text-sm">Loading tracker...</div>}>
        <TrackerContent />
      </Suspense>
    </div>
  );
}
