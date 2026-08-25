'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Store,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Package,
} from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';

export default function OrderTrackingModal() {
  const {
    activeTrackingOrder,
    trackingModalOpen,
    setTrackingModalOpen,
    orders,
  } = useOrder();

  const [copied, setCopied] = useState(false);

  const currentOrder = activeTrackingOrder || orders[0];

  if (!currentOrder) return null;

  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track?id=${encodeURIComponent(currentOrder.id)}`
    : `https://banhmivietnam.xyz/track?id=${encodeURIComponent(currentOrder.id)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { key: 'new', label: 'Order Received', desc: 'Ticket acknowledged by Saigon kitchen', icon: CheckCircle2 },
    { key: 'preparing', label: 'Chef Preparing', desc: 'Baking rice-flour crust & lemongrass grilling', icon: ChefHat },
    { key: 'ready', label: 'Thermal Packaged', desc: 'Crispy ventilated seal locked', icon: Package },
    {
      key: 'delivering',
      label: currentOrder.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready at Studio Counter',
      desc: currentOrder.deliveryMethod === 'delivery' ? 'Courier en route with thermal bag' : 'Waiting at 428 Mercer St, SoHo',
      icon: currentOrder.deliveryMethod === 'delivery' ? Bike : Store,
    },
    { key: 'completed', label: 'Fulfilled & Enjoyed', desc: 'Chuc ngon mieng!', icon: Sparkles },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'new': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivering': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(currentOrder.status);

  return (
    <AnimatePresence>
      {trackingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrackingModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-warm-xl border border-banhmi-gold/40 overflow-hidden z-10 my-8 max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-cream-300 bg-banhmi-card/90 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-700 font-bold flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                  Live Order Dispatched
                </span>
                <h3 className="font-display text-3xl uppercase font-black text-banhmi-dark mt-0.5">
                  Order <span className="text-banhmi-red">{currentOrder.id}</span>
                </h3>
              </div>

              <button
                onClick={() => setTrackingModalOpen(false)}
                className="p-2 rounded-full text-banhmi-dark/60 hover:text-banhmi-dark hover:bg-cream-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Unique Tracking ID Box with 1-Click Copy */}
              <div className="p-4 rounded-2xl bg-white border border-banhmi-red/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-banhmi-dark/60 block">
                    Your Unique Tracking ID (Track Anywhere)
                  </span>
                  <div className="font-mono text-lg font-black text-banhmi-red tracking-wider">
                    {currentOrder.id}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-mono font-bold text-banhmi-dark flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-banhmi-red" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <Link
                    href={`/track?id=${encodeURIComponent(currentOrder.id)}`}
                    onClick={() => setTrackingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-banhmi-dark hover:bg-banhmi-red text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Full Tracker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Estimated Arrival Banner */}
              <div className="p-5 rounded-2xl bg-banhmi-dark text-white flex items-center justify-between shadow-warm-md">
                <div>
                  <span className="text-xs font-mono uppercase text-[#FFB703] block tracking-wider font-bold">
                    {currentOrder.deliveryMethod === 'delivery' ? 'Estimated Courier Arrival' : 'Estimated Pickup Ready'}
                  </span>
                  <h4 className="font-display text-4xl uppercase font-black mt-0.5 text-white">
                    {currentOrder.estimatedTime}
                  </h4>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 text-[#FFB703]">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 pt-1">
                <span className="font-mono text-xs uppercase tracking-widest text-banhmi-red font-bold block">
                  Kitchen Progress Status
                </span>

                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step.key} className="flex items-start space-x-4 relative">
                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 w-0.5 h-8 -ml-[1px] transition-colors ${
                              idx < currentStepIndex ? 'bg-emerald-600' : 'bg-cream-300'
                            }`}
                          />
                        )}

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 transition-all ${
                            isCurrent
                              ? 'bg-banhmi-red text-white font-bold ring-4 ring-rose-200 shadow-md'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-cream-200 text-banhmi-dark/40 border border-cream-300'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`font-display text-lg uppercase font-bold ${
                                isDone ? 'text-banhmi-dark' : 'text-banhmi-dark/40'
                              }`}
                            >
                              {step.label}
                            </h5>
                            {isCurrent && (
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-100 text-banhmi-red font-bold">
                                Active Step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-banhmi-dark/70 font-sans">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-300 space-y-2">
                <span className="text-xs font-mono uppercase text-banhmi-dark font-bold block mb-1">
                  Ordered Items ({currentOrder.items.length})
                </span>
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-mono text-banhmi-dark">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-bold">${item.itemTotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-cream-200 flex justify-between font-display text-lg font-black text-banhmi-dark uppercase">
                  <span>Total Amount</span>
                  <span className="text-banhmi-red">${currentOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-cream-300">
                <Link
                  href="/admin"
                  onClick={() => setTrackingModalOpen(false)}
                  className="text-xs font-mono text-banhmi-red hover:underline font-bold flex items-center space-x-1"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Kitchen Staff KDS</span>
                </Link>

                <button
                  onClick={() => setTrackingModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-banhmi-dark text-white font-display text-sm uppercase tracking-wider font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
