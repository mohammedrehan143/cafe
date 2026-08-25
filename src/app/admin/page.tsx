'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Clock,
  Bike,
  Store,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
  ArrowLeft,
  Filter,
  Printer,
  Sparkles,
  Phone,
  MapPin,
  Flame,
  Coffee,
  Package,
  Bell,
  BellRing,
  Check,
  X,
} from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { Order, OrderStatus, DeliveryMethod } from '@/types/cafe';
import { CAFE_INFO } from '@/data/cafeData';

export default function AdminPortalPage() {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    addDemoOrder,
    clearAllOrders,
  } = useOrder();

  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Track all order IDs that have already been alerted so no order ever notifies twice
  const alertedOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  // Web Audio API Synthesized Kitchen Bell Chime
  const playKitchenChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      const playTone = (freq: number, start: number, duration: number, gainLevel = 0.25) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(gainLevel, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // 3-Tone Harmonious Kitchen Bell (F5 -> A5 -> C6)
      playTone(698.46, now, 0.35);
      playTone(880.00, now + 0.12, 0.45);
      playTone(1046.50, now + 0.25, 0.7);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Browser Native Desktop Push Notification
  const triggerDesktopNotification = (order: Order) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🛎️ New Order Received! #${order.id}`, {
          body: `${order.customer.name} placed an order for $${order.total.toFixed(2)} (${order.items.length} items).`,
          icon: 'https://banhmivietnam.xyz/img/Favicon.png',
        });
      }
    }
  };

  // Safe single-trigger notification dispatcher
  const notifyNewOrder = (order: Order) => {
    if (!order || alertedOrderIdsRef.current.has(order.id)) return;

    // Immediately mark as alerted to prevent any race condition
    alertedOrderIdsRef.current.add(order.id);

    setNewOrderAlert(order);
    playKitchenChime();
    triggerDesktopNotification(order);

    // Auto-hide banner after 6 seconds
    setTimeout(() => {
      setNewOrderAlert((prev) => (prev?.id === order.id ? null : prev));
    }, 6000);
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsGranted(true);
        playKitchenChime();
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsGranted(Notification.permission === 'granted');
    }
  }, []);

  // Initialize alerted set on first load so existing historical orders don't spam
  useEffect(() => {
    if (!isInitializedRef.current && orders.length > 0) {
      orders.forEach((o) => alertedOrderIdsRef.current.add(o.id));
      isInitializedRef.current = true;
      return;
    }

    // Only notify genuinely new orders placed after page mount
    if (isInitializedRef.current) {
      const unAlerted = orders.filter((o) => !alertedOrderIdsRef.current.has(o.id));
      if (unAlerted.length > 0) {
        notifyNewOrder(unAlerted[0]);
      }
    }
  }, [orders]);

  // Real-time polling from API to detect fresh orders from external tabs/devices
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const freshOrders: Order[] = data.orders;

          // If first poll after mount, register all existing orders
          if (!isInitializedRef.current) {
            freshOrders.forEach((o) => alertedOrderIdsRef.current.add(o.id));
            isInitializedRef.current = true;
            return;
          }

          // Find only fresh un-alerted orders
          const brandNewOrders = freshOrders.filter(
            (o) => !alertedOrderIdsRef.current.has(o.id) && o.status === 'new'
          );

          if (brandNewOrders.length > 0) {
            notifyNewOrder(brandNewOrders[0]);
          }
        }
      } catch {
        // network polling fallback
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [soundEnabled]);

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeFilter === 'all' || order.status === activeFilter;
    const matchesDelivery = deliveryFilter === 'all' || order.deliveryMethod === deliveryFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer.address && order.customer.address.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesDelivery && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter((o) => ['new', 'preparing', 'ready', 'delivering'].includes(o.status)).length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { bg: 'bg-rose-100 text-rose-800 border-rose-300', label: 'NEW TICKET', icon: AlertCircle };
      case 'preparing':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: 'IN KITCHEN', icon: Flame };
      case 'ready':
        return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', label: 'THERMAL PACKED', icon: Package };
      case 'delivering':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', label: 'OUT FOR DELIVERY', icon: Bike };
      case 'completed':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'COMPLETED', icon: CheckCircle2 };
      case 'cancelled':
        return { bg: 'bg-neutral-200 text-neutral-700 border-neutral-300', label: 'CANCELLED', icon: AlertCircle };
      default:
        return { bg: 'bg-neutral-100 text-neutral-700 border-neutral-200', label: status, icon: Clock };
    }
  };

  const getElapsedMinutes = (dateString: string) => {
    const elapsedMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(elapsedMs / (1000 * 60));
    return mins < 0 ? 0 : mins;
  };

  const printReceipt = (order: Order) => {
    setSelectedReceiptOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1D1511] font-sans pb-24 selection:bg-cream-300 relative">
      {/* Real-Time New Order Notification Popup Toast */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto"
          >
            <div className="bg-[#1C1917] text-white p-5 rounded-3xl shadow-2xl border-2 border-banhmi-red flex items-center justify-between gap-4 ring-8 ring-banhmi-red/20">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-banhmi-red flex items-center justify-center text-white flex-shrink-0 animate-bounce">
                  <BellRing className="w-6 h-6 text-[#FFB703]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-banhmi-red text-[10px] font-mono font-black uppercase text-white tracking-wider">
                      NEW ORDER RECEIVED
                    </span>
                    <span className="font-mono text-xs font-bold text-[#FFB703]">
                      #{newOrderAlert.id}
                    </span>
                  </div>
                  <div className="font-display text-xl uppercase font-bold text-white mt-0.5">
                    {newOrderAlert.customer.name} • ${newOrderAlert.total.toFixed(2)}
                  </div>
                  <div className="text-xs font-mono text-white/70">
                    {newOrderAlert.items.length} items • {newOrderAlert.deliveryMethod === 'delivery' ? 'Thermal Delivery' : 'Studio Pickup'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    updateOrderStatus(newOrderAlert.id, 'preparing');
                    setNewOrderAlert(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-colors shadow-sm whitespace-nowrap"
                >
                  Accept & Cook
                </button>
                <button
                  onClick={() => setNewOrderAlert(null)}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Operations Header */}
      <header className="bg-espresso-950 text-cream-50 sticky top-0 z-40 shadow-warm-lg border-b border-espresso-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-200 transition-colors flex items-center space-x-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customer Storefront</span>
            </Link>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-normal text-cream-50">
                  Zoffers <span className="italic text-amberGold-400">Kitchen</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amberGold-500/20 border border-amberGold-500/40 text-[10px] font-mono text-amberGold-300 font-bold uppercase tracking-wider">
                  KDS Operations
                </span>
              </div>
              <span className="text-[10px] font-mono text-cream-400">
                Cloud Studio Dispatch • Bengaluru • Mumbai • Delhi
              </span>
            </div>
          </div>

          {/* Right Live Telemetry & Notification Controls */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Live Clock */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-espresso-900 border border-white/10 font-mono text-xs text-amberGold-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE {currentTime}</span>
            </div>

            {/* Desktop Notification Permission Bell */}
            <button
              onClick={requestNotificationPermission}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center space-x-1.5 transition-colors ${
                notificationsGranted
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                  : 'bg-espresso-900 border-amberGold-500/40 text-amberGold-300 hover:bg-espresso-800'
              }`}
              title={notificationsGranted ? 'Desktop Push Notifications Active' : 'Click to Enable Desktop Push Notifications'}
            >
              <Bell className={`w-3.5 h-3.5 ${notificationsGranted ? 'text-emerald-400' : 'text-amberGold-400'}`} />
              <span>{notificationsGranted ? 'Push Active' : 'Enable Alerts'}</span>
            </button>

            {/* Sound Chime Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playKitchenChime();
              }}
              className="p-2 rounded-lg bg-espresso-900 border border-white/10 text-cream-200 hover:text-white transition-colors"
              title={soundEnabled ? 'Kitchen Sound Chime Active (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-espresso-400" />}
            </button>

            {/* Simulate / Test New Order Arrival */}
            <button
              onClick={addDemoOrder}
              className="px-3.5 py-1.5 rounded-lg bg-amberGold-500 hover:bg-amberGold-400 text-espresso-950 font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Test Order Alert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-cream-300 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs font-mono text-espresso-500 uppercase tracking-wider mb-2">
              <span>Today&apos;s Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-3xl font-normal text-espresso-950">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] font-mono text-emerald-700 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{orders.length} total tickets dispatched</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-cream-300 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs font-mono text-espresso-500 uppercase tracking-wider mb-2">
              <span>Active Kitchen Tickets</span>
              <ChefHat className="w-4 h-4 text-amberGold-600" />
            </div>
            <div className="font-serif text-3xl font-normal text-espresso-950">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] font-mono text-amberGold-700 mt-1">
              {newOrdersCount} pending kitchen start
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-cream-300 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs font-mono text-espresso-500 uppercase tracking-wider mb-2">
              <span>Delivery Orders</span>
              <Bike className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-serif text-3xl font-normal text-espresso-950">
              {orders.filter((o) => o.deliveryMethod === 'delivery').length}
            </div>
            <div className="text-[11px] font-mono text-espresso-600 mt-1">
              Thermal insulated couriers
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-cream-300 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs font-mono text-espresso-500 uppercase tracking-wider mb-2">
              <span>Counter Pickups</span>
              <Store className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-serif text-3xl font-normal text-espresso-950">
              {orders.filter((o) => o.deliveryMethod === 'pickup').length}
            </div>
            <div className="text-[11px] font-mono text-espresso-600 mt-1">
              Studio counter handoff
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-300 shadow-warm-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(['all', 'new', 'preparing', 'ready', 'delivering', 'completed'] as const).map((status) => {
                const isActive = activeFilter === status;
                const count = status === 'all' ? orders.length : orders.filter((o) => o.status === status).length;

                return (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-espresso-900 text-cream-50 font-bold shadow-sm'
                        : 'bg-cream-100 text-espresso-700 hover:bg-cream-200'
                    }`}
                  >
                    <span>{status === 'all' ? 'All Tickets' : status}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-amberGold-500 text-espresso-950 font-bold' : 'bg-cream-300 text-espresso-800'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Delivery Method Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-espresso-500 uppercase">Fulfillment:</span>
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-cream-100 border border-cream-300 text-xs font-mono font-bold text-espresso-900 focus:outline-none focus:ring-2 focus:ring-amberGold-500"
              >
                <option value="all">All Channels</option>
                <option value="delivery">Delivery Only</option>
                <option value="pickup">Pickup Only</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, customer name, phone, or delivery address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-100/60 border border-cream-300 text-xs font-mono text-espresso-950 focus:outline-none focus:ring-2 focus:ring-amberGold-500"
            />
          </div>
        </div>

        {/* Live Order Cards Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-cream-300 p-8 space-y-3">
                <ChefHat className="w-12 h-12 text-cream-400 mx-auto" />
                <h4 className="font-serif text-2xl text-espresso-950">No tickets found</h4>
                <p className="text-xs font-mono text-espresso-500 max-w-sm mx-auto">
                  All active tickets cleared or no orders match current filter parameters.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;
                const elapsedMins = getElapsedMinutes(order.createdAt);
                const isUrgent = order.status === 'new' && elapsedMins > 10;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-3xl border overflow-hidden shadow-warm-md flex flex-col justify-between transition-all duration-300 ${
                      isUrgent
                        ? 'border-rose-400 ring-2 ring-rose-300'
                        : 'border-cream-300 hover:shadow-warm-xl'
                    }`}
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-base font-black text-espresso-950">
                            #{order.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center space-x-1 ${badge.bg}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-espresso-500 mt-1 flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-espresso-400" />
                          <span>{elapsedMins}m ago • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => printReceipt(order)}
                          className="p-2 rounded-xl text-espresso-500 hover:bg-cream-200 transition-colors"
                          title="Print Kitchen Ticket"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-cream-200 transition-colors"
                          title="Archive Ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Customer & Items Details */}
                    <div className="p-5 space-y-4 flex-1">
                      {/* Customer info */}
                      <div className="flex items-center justify-between text-xs font-mono border-b border-cream-200 pb-3">
                        <div>
                          <div className="font-bold text-espresso-950">{order.customer.name}</div>
                          <div className="text-espresso-500 text-[11px] flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-espresso-400" />
                            <span>{order.customer.phone}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold uppercase flex items-center space-x-1 ${
                            order.deliveryMethod === 'delivery' ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'
                          }`}>
                            {order.deliveryMethod === 'delivery' ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                            <span>{order.deliveryMethod}</span>
                          </span>
                        </div>
                      </div>

                      {/* Delivery address if delivery */}
                      {order.deliveryMethod === 'delivery' && order.customer.address && (
                        <div className="text-[11px] font-mono text-espresso-600 bg-cream-100/60 p-2.5 rounded-xl border border-cream-200 flex items-start space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-banhmi-red mt-0.5 flex-shrink-0" />
                          <span className="truncate">{order.customer.address}</span>
                        </div>
                      )}

                      {/* Items list */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-espresso-400 uppercase tracking-wider block">
                          Ticket Line Items ({order.items.length})
                        </span>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-cream-100/70 border border-cream-200/80 text-xs font-mono text-espresso-950 flex justify-between items-start"
                          >
                            <div>
                              <span className="font-bold text-banhmi-red mr-1.5">{item.quantity}x</span>
                              <span className="font-semibold">{item.menuItem.name}</span>
                              {item.selectedOptions && Object.values(item.selectedOptions).some(Boolean) && (
                                <div className="text-[10px] text-espresso-500 mt-0.5">
                                  {Object.entries(item.selectedOptions).map(([k, v]) => (
                                    <span key={k} className="mr-2">• {String(v)}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="font-bold">${item.itemTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Payment method & Total */}
                      <div className="pt-2 border-t border-cream-200 flex items-center justify-between font-mono text-xs">
                        <span className="text-espresso-500 text-[11px]">
                          {order.paymentMethod || 'Razorpay Online'}
                        </span>
                        <span className="font-serif text-lg font-black text-espresso-950">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status Progression Workflow Actions */}
                    <div className="p-4 bg-cream-50 border-t border-cream-200 flex items-center gap-2">
                      {order.status === 'new' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 py-2.5 rounded-xl bg-amberGold-500 hover:bg-amberGold-400 text-espresso-950 font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>Start Kitchen</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Pack Thermal</span>
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivering')}
                          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
                        >
                          {order.deliveryMethod === 'delivery' ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                          <span>{order.deliveryMethod === 'delivery' ? 'Dispatch Courier' : 'Ready at Counter'}</span>
                        </button>
                      )}

                      {order.status === 'delivering' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Fulfilled</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div className="flex-1 text-center py-2 text-xs font-mono font-bold text-emerald-700 flex items-center justify-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Order Complete & Fulfilled</span>
                        </div>
                      )}

                      <Link
                        href={`/track?id=${encodeURIComponent(order.id)}`}
                        target="_blank"
                        className="p-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-espresso-700 transition-colors"
                        title="Open Live Tracker Screen"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Printable Receipt Preview Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full font-mono text-xs text-espresso-950 space-y-4 shadow-2xl border border-cream-300">
            <div className="text-center border-b border-dashed border-espresso-400 pb-3">
              <h4 className="font-serif text-lg font-bold">ZOFFERS CLOUD KITCHEN</h4>
              <p className="text-[10px]">Artisan Culinary Studio • India</p>
              <p className="text-[10px]">100 Feet Rd, Indiranagar, Bengaluru</p>
              <p className="text-xs font-bold mt-2">TICKET #{selectedReceiptOrder.id}</p>
              <p className="text-[10px]">{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-1.5 border-b border-dashed border-espresso-400 pb-3">
              <div className="font-bold uppercase">
                {selectedReceiptOrder.deliveryMethod === 'delivery' ? 'THERMAL DELIVERY ORDER' : 'STUDIO PICKUP'}
              </div>
              <div>Customer: {selectedReceiptOrder.customer.name}</div>
              <div>Phone: {selectedReceiptOrder.customer.phone}</div>
              {selectedReceiptOrder.customer.address && (
                <div>Addr: {selectedReceiptOrder.customer.address}</div>
              )}
            </div>

            <div className="space-y-2 border-b border-dashed border-espresso-400 pb-3">
              {selectedReceiptOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>${item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 border-b border-dashed border-espresso-400 pb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${selectedReceiptOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery/Handling</span>
                <span>${selectedReceiptOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${selectedReceiptOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip</span>
                <span>${selectedReceiptOrder.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span>TOTAL</span>
                <span>${selectedReceiptOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-espresso-900 text-cream-50 text-xs font-mono font-semibold uppercase"
              >
                Print Now
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 rounded-lg bg-cream-200 text-espresso-900 text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
