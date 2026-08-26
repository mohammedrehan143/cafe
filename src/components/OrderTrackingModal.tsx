'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Store,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Package,
  User,
  Radio,
  Phone,
} from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';
import { shareLiveLocationOnWhatsApp } from '@/lib/whatsapp';
import Link from 'next/link';

export default function OrderTrackingModal() {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    trackingModalOpen,
    setTrackingModalOpen,
    orders,
  } = useOrder();

  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const currentOrder = activeTrackingOrder || orders[0];

  useEffect(() => {
    if (!trackingModalOpen || !currentOrder) return;
    const token = currentOrder.tokenId || currentOrder.id;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(token)}`);
        const data = await res.json();
        if (data.success && data.order) {
          if (
            data.order.status !== currentOrder.status ||
            data.order.riderName !== currentOrder.riderName ||
            data.order.riderPhone !== currentOrder.riderPhone
          ) {
            setActiveTrackingOrder(data.order);
          }
        }
      } catch {}
    }, 1500);

    return () => clearInterval(interval);
  }, [trackingModalOpen, currentOrder?.id, currentOrder?.status, currentOrder?.riderName, currentOrder?.riderPhone, setActiveTrackingOrder]);

  if (!currentOrder) return null;

  const trackingCodeOrToken = currentOrder.tokenId || currentOrder.trackingCode || currentOrder.id;

  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track?id=${encodeURIComponent(trackingCodeOrToken)}`
    : `https://zafiroo.com/track?id=${encodeURIComponent(trackingCodeOrToken)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(trackingCodeOrToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const steps = [
    { key: 'new', label: 'Order Received', desc: 'Ticket registered in live kitchen database', icon: CheckCircle2 },
    { key: 'preparing', label: 'Chef Preparing', desc: 'Brewing single-origin coffees & cooking artisan dishes', icon: ChefHat },
    { key: 'ready', label: 'Thermal Packaged', desc: 'Ventilated thermal seal locked', icon: Package },
    {
      key: 'delivering',
      label: currentOrder.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready at Studio Counter',
      desc: currentOrder.deliveryMethod === 'delivery'
        ? (currentOrder.riderName ? `Courier ${currentOrder.riderName} (${currentOrder.riderPhone || ''}) is en route` : 'Courier dispatched with insulated thermal bag')
        : 'Waiting at 100 Feet Rd Studio, Indiranagar',
      icon: currentOrder.deliveryMethod === 'delivery' ? Bike : Store,
    },
    { key: 'completed', label: 'Fulfilled & Enjoyed', desc: 'Enjoy your fresh artisan meal!', icon: Sparkles },
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
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse inline mr-1" />
                  Live Realtime Dispatch
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
              {/* Order Token ID & Customer ID Information Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-banhmi-red/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-banhmi-dark/60 block font-bold">
                      Order Token ID (Keep For Tracking)
                    </span>
                    <div className="font-mono text-lg font-black text-banhmi-red tracking-wider mt-0.5">
                      {trackingCodeOrToken}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyToken}
                    className="mt-2.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-mono font-bold text-banhmi-red flex items-center justify-center space-x-1.5 transition-colors self-start"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? 'Token Copied!' : 'Copy Token ID'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-banhmi-dark/60 block font-bold">
                      Registered Customer ID
                    </span>
                    <div className="font-mono text-sm font-bold text-banhmi-dark tracking-wide mt-1 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-banhmi-gold" />
                      <span>{currentOrder.customerId || 'CUST-REGISTERED'}</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-mono font-bold text-banhmi-dark flex items-center space-x-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-banhmi-red" />}
                      <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                    <Link
                      href={`/track?id=${encodeURIComponent(trackingCodeOrToken)}`}
                      onClick={() => setTrackingModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-banhmi-dark hover:bg-banhmi-red text-white text-xs font-mono font-bold flex items-center space-x-1 transition-colors"
                    >
                      <span>Full Tracker</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Estimated Arrival Banner */}
              <div className="p-5 rounded-2xl bg-banhmi-dark text-white flex items-center justify-between shadow-warm-md">
                <div>
                  <span className="text-xs font-mono uppercase text-[#FFF8F0] block tracking-wider font-bold">
                    {currentOrder.deliveryMethod === 'delivery' ? 'Estimated Courier Arrival' : 'Estimated Pickup Ready'}
                  </span>
                  <h4 className="font-display text-4xl uppercase font-black mt-0.5 text-white">
                    {currentOrder.estimatedTime}
                  </h4>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 text-[#FFF8F0]">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              {/* Highlighted Assigned Delivery Agent Card (When Out for Delivery) */}
              {(currentOrder.riderName || currentOrder.status === 'delivering') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50 border-2 border-amber-400/80 text-[#1C1917] shadow-md space-y-3 ring-2 ring-amber-200/50">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#4A2818] font-black">
                        Courier On The Way
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4A2818] text-white text-[9px] font-mono font-bold uppercase shadow-xs">
                      Out for Delivery
                    </span>
                  </div>

                  <div className="bg-white/95 rounded-xl p-3.5 border border-amber-200/70 shadow-xs flex items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-lg uppercase font-black text-[#1C1917]">
                        {currentOrder.riderName || 'Assigned Courier Rider'}
                      </div>
                      <div className="font-mono text-xs text-[#4A2818] font-bold flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{currentOrder.riderPhone || CAFE_INFO.phone}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${(currentOrder.riderPhone || CAFE_INFO.phone).replace(/[^0-9+]/g, '')}`}
                      className="px-4 py-2 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 flex-shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-[#4A2818]/80 font-sans leading-tight">
                    🛵 Courier is carrying your food in an insulated thermal pack.
                  </p>
                </div>
              )}

              {/* Progress Timeline */}
              <div className="space-y-4 pt-1">
                <span className="font-mono text-xs uppercase tracking-widest text-banhmi-red font-bold block">
                  Kitchen Progress Status (Realtime)
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
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-100 text-banhmi-red font-bold animate-pulse">
                                Active Stage
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
                    <span className="font-bold">₹{item.itemTotal.toFixed(0)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-cream-200 flex justify-between font-display text-lg font-black text-banhmi-dark uppercase">
                  <span>Total Amount</span>
                  <span className="text-banhmi-red">₹{currentOrder.total.toFixed(0)}</span>
                </div>
              </div>

              {/* 1-Click WhatsApp Live Location Button */}
              {currentOrder.deliveryMethod === 'delivery' && (
                <button
                  type="button"
                  onClick={() =>
                    shareLiveLocationOnWhatsApp({
                      orderId: trackingCodeOrToken,
                      customerName: currentOrder.customer?.name,
                      address: currentOrder.customer?.address,
                      customNote: currentOrder.customer?.deliveryInstructions,
                    })
                  }
                  className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span className="text-base">📍</span>
                  <span>Share Live GPS Location via WhatsApp</span>
                </button>
              )}

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-cream-300">
                <Link
                  href="/admin"
                  onClick={() => setTrackingModalOpen(false)}
                  title="Kitchen Staff KDS"
                  aria-label="Kitchen Staff KDS"
                  className="p-2 rounded-full hover:bg-cream-200 text-[#4A2818] transition-colors flex items-center justify-center border border-black/10"
                >
                  <ChefHat className="w-4 h-4" />
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
