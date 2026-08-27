'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Copy,
  Check,
  User,
  Radio,
} from 'lucide-react';
import { Order } from '@/types/cafe';
import { INITIAL_ORDERS, CAFE_INFO } from '@/data/cafeData';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';
import { shareLiveLocationOnWhatsApp } from '@/lib/whatsapp';

function TrackerContent() {
  const searchParams = useSearchParams();
  const initialQueryId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialQueryId);
  const [runningOrders, setRunningOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fetchOrder = async (query: string, silent = false) => {
    if (!query.trim()) return;
    if (!silent) {
      setLoading(true);
      setErrorMsg(null);
    }

    try {
      // 1. Query API (returns active running orders or exact token)
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success) {
        const list: Order[] = Array.isArray(data.orders) && data.orders.length > 0
          ? data.orders
          : (data.order ? [data.order] : []);

        setRunningOrders(list);

        if (!currentOrder && !silent) {
          setShowList(true);
          setCurrentOrder(null);
        } else if (currentOrder) {
          // Keep active detailed order in sync
          const updatedMatch = list.find((o) => o.id === currentOrder.id || o.tokenId === currentOrder.tokenId);
          if (updatedMatch) {
            setCurrentOrder(updatedMatch);
          }
        }
        setErrorMsg(null);
      } else {
        // Fallback or error message
        if (data.allCompleted) {
          setErrorMsg('All past orders for this number have been completed. (Only running kitchen orders are displayed)');
        } else {
          setErrorMsg(data.error || 'No active orders found for this Phone number or Token ID.');
        }
        if (!silent) {
          setRunningOrders([]);
          setCurrentOrder(null);
          setShowList(false);
        }
      }
    } catch {
      // Offline fallback
      const saved = localStorage.getItem('atelier_lambre_orders_v1');
      const localList: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
      const cleanDigits = query.replace(/[^0-9]/g, '');
      const matched = localList.filter(
        (o) =>
          o.id.toUpperCase() === query.trim().toUpperCase() ||
          (o.tokenId && o.tokenId.toUpperCase() === query.trim().toUpperCase()) ||
          (cleanDigits && o.customer.phone.replace(/[^0-9]/g, '').includes(cleanDigits))
      );

      const activeLocal = matched.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

      if (activeLocal.length > 0) {
        setRunningOrders(activeLocal);
        if (activeLocal.length > 1 && !currentOrder && !silent) {
          setShowList(true);
          setCurrentOrder(null);
        } else {
          setCurrentOrder(activeLocal[0]);
          setShowList(false);
        }
      } else if (!silent) {
        setErrorMsg('Unable to retrieve tracking details. Please verify your Token ID or Phone number.');
        setRunningOrders([]);
        setCurrentOrder(null);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initialQueryId) {
      fetchOrder(initialQueryId);
    } else {
      setCurrentOrder(null);
      setRunningOrders([]);
      setShowList(false);
    }
  }, [initialQueryId]);

  // Real-time auto sync: Polling every 1.5s
  useEffect(() => {
    const targetQuery = searchId || initialQueryId;
    if (!targetQuery) return;

    const pollInterval = setInterval(() => {
      fetchOrder(targetQuery, true);
    }, 1500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [searchId, initialQueryId, currentOrder?.id]);

  // Real-time Supabase Subscription for Live Tracking
  useEffect(() => {
    if (!currentOrder || !isSupabaseConfigured) return;

    const trackingKey = currentOrder.trackingCode || currentOrder.tokenId || currentOrder.id;

    const channel = supabase
      .channel(`live-tracking-${trackingKey}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload: any) => {
          const updated = payload.new;
          if (
            updated &&
            (updated.tracking_code === trackingKey ||
              updated.token_id === trackingKey ||
              updated.id === trackingKey ||
              updated.customer_phone === currentOrder.customer.phone)
          ) {
            const formatted = formatDbOrderToOrder(updated);
            setCurrentOrder((prev) => (prev ? { ...prev, ...formatted } : formatted));
            setRunningOrders((prevList) =>
              prevList.map((o) =>
                o.id === formatted.id || o.tokenId === formatted.tokenId ? { ...o, ...formatted } : o
              )
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsLiveConnected(true);
        }
      });

    return () => {
      setIsLiveConnected(false);
      supabase.removeChannel(channel);
    };
  }, [currentOrder?.id, currentOrder?.tokenId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOrder(null);
    setShowList(false);
    fetchOrder(searchId);
  };

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getRunningStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'Order Received',
          icon: '📋',
        };
      case 'preparing':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          label: 'Chef Preparing',
          icon: '🍳',
        };
      case 'ready':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          label: 'Packed & Ready',
          icon: '📦',
        };
      case 'delivering':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-300',
          label: 'Out for Delivery',
          icon: '🛵',
        };
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          label: status.toUpperCase(),
          icon: '⚡',
        };
    }
  };

  const steps = [
    { key: 'new', label: 'Order Received', desc: 'Order ticket registered in live kitchen database', icon: CheckCircle2 },
    { key: 'preparing', label: 'Chef Preparing', desc: 'Brewing single-origin coffees & cooking artisan dishes', icon: ChefHat },
    { key: 'ready', label: 'Thermal Packaged', desc: 'Ventilated thermal seal locked for maximum crisp & heat', icon: Package },
    {
      key: 'delivering',
      label: currentOrder?.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready at Studio Counter',
      desc: currentOrder?.deliveryMethod === 'delivery'
        ? (currentOrder.riderName ? `Courier ${currentOrder.riderName} (${currentOrder.riderPhone || ''}) is en route` : 'Thermal courier dispatched to your address')
        : 'Waiting for pickup at 100 Feet Rd Studio',
      icon: currentOrder?.deliveryMethod === 'delivery' ? Bike : Store,
    },
    { key: 'completed', label: 'Delivered & Enjoyed', desc: 'Order fulfilled successfully!', icon: Sparkles },
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-banhmi-gold/30 shadow-warm-xl mb-8 text-center space-y-4">
        <h2 className="font-display text-4xl sm:text-5xl uppercase font-black text-banhmi-dark tracking-tight">
          Track Your <span className="text-banhmi-red">Zafiroo Order</span>
        </h2>
        <p className="text-xs sm:text-sm text-banhmi-dark/70 max-w-md mx-auto">
          Enter your <strong className="font-mono text-banhmi-red">Phone Number</strong> or <strong className="font-mono text-banhmi-red">Token ID</strong> to see running orders.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto pt-2">
          <input
            type="text"
            required
            placeholder="Enter Phone number or Token ID..."
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
            <span>Track Orders</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center justify-center space-x-2 mt-4">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* ACTIVE RUNNING ORDERS LIST (Always shown first on search) */}
      {(showList || (!currentOrder && runningOrders.length > 0)) && runningOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-10"
        >
          <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-banhmi-gold/30 shadow-sm">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {runningOrders.length} Running Kitchen Order{runningOrders.length > 1 ? 's' : ''} Found
                </span>
              </div>
              <p className="text-xs text-banhmi-dark/70 font-sans mt-0.5">
                Select any active order below to track its live stage, courier, and arrival time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runningOrders.map((order) => {
              const badge = getRunningStatusBadge(order.status);
              const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const itemsPreview = order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ');

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setCurrentOrder(order);
                    setShowList(false);
                  }}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-banhmi-gold/40 shadow-warm-md hover:shadow-warm-xl hover:border-banhmi-red transition-all cursor-pointer flex flex-col justify-between space-y-4 group active:scale-[0.99]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-banhmi-red text-base">
                        #{order.tokenId || order.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border flex items-center space-x-1 ${badge.bg}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <div className="text-xs font-mono text-banhmi-dark/60">
                      Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.deliveryMethod === 'delivery' ? '🛵 Home Delivery' : '🏪 Counter Pickup'}
                    </div>

                    <div className="pt-2 border-t border-cream-200">
                      <span className="text-[11px] font-mono uppercase text-banhmi-dark/50 font-bold block mb-1">
                        Items ({itemsCount})
                      </span>
                      <p className="text-xs font-sans text-banhmi-dark font-medium line-clamp-2">
                        {itemsPreview}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-banhmi-dark/50 uppercase block">Total</span>
                      <span className="font-display text-xl uppercase font-black text-banhmi-dark">
                        ₹{order.total.toFixed(0)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentOrder(order);
                        setShowList(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-banhmi-dark group-hover:bg-banhmi-red text-white text-xs font-mono font-bold uppercase transition-colors flex items-center space-x-1.5 shadow-sm"
                    >
                      <span>Track Live</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* SINGLE LIVE ORDER DETAIL VIEW */}
      {currentOrder && !showList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-banhmi-gold/30 shadow-warm-xl overflow-hidden mb-12"
        >
          {/* Top Switcher Strip */}
          {runningOrders.length > 0 && (
            <div className="bg-[#FFF4E6] px-6 py-3 border-b border-banhmi-gold/30 flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => setShowList(true)}
                className="text-xs font-mono font-bold text-banhmi-red hover:underline flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back to Orders List ({runningOrders.length})</span>
              </button>

              {runningOrders.length > 1 && (
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                  {runningOrders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setCurrentOrder(o)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                        (o.id === currentOrder.id || o.tokenId === currentOrder.tokenId)
                          ? 'bg-banhmi-red text-white'
                          : 'bg-white text-banhmi-dark/70 hover:bg-cream-200 border border-banhmi-gold/30'
                      }`}
                    >
                      #{o.tokenId || o.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Header Strip */}
          <div className="p-6 sm:p-8 bg-banhmi-card/70 border-b border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800">
                  {isLiveConnected ? 'Realtime WebSocket Connected' : 'Live Dispatch Stream'}
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
            {/* Tokens & Customer Identifiers Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/40">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-cream-300">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-banhmi-dark/60 block font-bold">
                    Order Token ID (Share to Track)
                  </span>
                  <span className="font-mono font-black text-banhmi-red text-base">
                    {currentOrder.tokenId || currentOrder.id}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyToken(currentOrder.tokenId || currentOrder.id)}
                  className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 text-banhmi-dark transition-colors"
                  title="Copy Token ID"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-banhmi-red" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-cream-300">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-banhmi-dark/60 block font-bold">
                    Database Customer ID
                  </span>
                  <span className="font-mono font-bold text-banhmi-dark text-sm flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-banhmi-gold inline mr-1" />
                    {currentOrder.customerId || 'CUST-REGISTERED'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                  Verified
                </span>
              </div>
            </div>

            {/* Big ETA Banner */}
            <div className="p-6 rounded-3xl bg-banhmi-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-lg">
              <div className="text-center sm:text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFF8F0] font-bold block">
                  {currentOrder.deliveryMethod === 'delivery' ? 'Estimated Courier Arrival' : 'Estimated Counter Pickup'}
                </span>
                <div className="font-display text-4xl sm:text-5xl uppercase font-black text-white mt-1">
                  {currentOrder.estimatedTime}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 text-[#FFF8F0]">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            {/* Highlighted Assigned Delivery Agent Card (When Out for Delivery) */}
            {(currentOrder.riderName || currentOrder.status === 'delivering') && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-rose-50 border-2 border-amber-400/80 text-[#1C1917] shadow-lg space-y-4 ring-4 ring-amber-100/60 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#4A2818] font-black">
                      Courier On The Way
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#4A2818] text-white text-[11px] font-mono font-bold uppercase shadow-xs">
                    Out for Delivery
                  </span>
                </div>

                <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-amber-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold block">
                      Assigned Delivery Partner
                    </span>
                    <div className="font-display text-2xl sm:text-3xl uppercase font-black text-[#1C1917] tracking-tight">
                      {currentOrder.riderName || 'Assigned Courier Rider'}
                    </div>
                    <div className="font-mono text-sm text-[#4A2818] font-bold flex items-center space-x-2 pt-0.5">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>{currentOrder.riderPhone || CAFE_INFO.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={`tel:${(currentOrder.riderPhone || CAFE_INFO.phone).replace(/[^0-9+]/g, '')}`}
                      className="px-5 py-3 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 flex-1 sm:flex-initial"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Agent</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        shareLiveLocationOnWhatsApp({
                          orderId: currentOrder.trackingCode || currentOrder.tokenId || currentOrder.id,
                          customerName: currentOrder.customer.name,
                          address: currentOrder.customer.address,
                          customNote: currentOrder.customer.deliveryInstructions,
                        })
                      }
                      className="px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 flex-1 sm:flex-initial"
                    >
                      <span>📍 WhatsApp Pin</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#4A2818]/80 font-sans leading-relaxed">
                  🛵 Your order is with the delivery partner in a thermal sealed bag. You can call the rider directly above or share your exact doorstep pin on WhatsApp.
                </p>
              </div>
            )}

            {/* Stepper Pipeline */}
            <div className="space-y-4 pt-2">
              <span className="font-mono text-xs uppercase tracking-widest text-banhmi-red font-bold block">
                Live Kitchen Pipeline (Updates Automatically)
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
                    <div>
                      <span className="font-bold text-banhmi-dark">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="text-[10px] text-banhmi-dark/60">
                          {Object.values(item.selectedOptions).filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-banhmi-dark">
                      ₹{item.itemTotal.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between font-display text-xl uppercase font-black text-banhmi-dark border-t border-cream-300">
                <span>Total Amount</span>
                <span>₹{currentOrder.total.toFixed(0)}</span>
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
                      ? currentOrder.customer.address || 'Bengaluru, India'
                      : 'Zafiroo Studio, 100 Feet Rd, Indiranagar, Bengaluru'}
                  </span>
                </div>
                {currentOrder.customer.unitOrApt && (
                  <div className="text-xs text-banhmi-dark/60 pl-5">{currentOrder.customer.unitOrApt}</div>
                )}
              </div>
            </div>

            {/* 1-Click WhatsApp Live Location Button for Delivery Rider */}
            {currentOrder.deliveryMethod === 'delivery' && (
              <div className="pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() =>
                    shareLiveLocationOnWhatsApp({
                      orderId: currentOrder.trackingCode || currentOrder.tokenId || currentOrder.id,
                      customerName: currentOrder.customer.name,
                      address: currentOrder.customer.address,
                      customNote: currentOrder.customer.deliveryInstructions,
                    })
                  }
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display text-sm uppercase tracking-wider font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span className="text-lg">📍</span>
                  <span>Share Live Location on WhatsApp</span>
                </button>
              </div>
            )}
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
