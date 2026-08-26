'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { Order, OrderStatus, DeliveryMethod } from '@/types/cafe';

export default function AdminPortalPage() {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    addDemoOrder,
  } = useOrder();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUniversalKeyLogin, setIsUniversalKeyLogin] = useState(false);
  const [activeAuthKey, setActiveAuthKey] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPinText, setShowPinText] = useState(false);

  // Change Key Modal State
  const [showChangeKeyModal, setShowChangeKeyModal] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [changeKeyError, setChangeKeyError] = useState<string | null>(null);
  const [changeKeySuccess, setChangeKeySuccess] = useState<string | null>(null);

  // KDS Operational State
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Delivery Agent Assignment Modal State
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [riderNameInput, setRiderNameInput] = useState('');
  const [riderPhoneInput, setRiderPhoneInput] = useState('');
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  // Track all order IDs that have already been alerted
  const alertedOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  // Check existing session on mount
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem('zafiroo_kds_token');
      const savedUniversal = sessionStorage.getItem('zafiroo_kds_is_universal') === 'true';
      const savedKey = sessionStorage.getItem('zafiroo_kds_auth_key') || '';
      if (savedToken) {
        setIsAuthenticated(true);
        setIsUniversalKeyLogin(savedUniversal);
        setActiveAuthKey(savedKey);
      }
    } catch {}
  }, []);

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
    } catch {}
  };

  // Browser Native Desktop Push Notification
  const triggerDesktopNotification = (order: Order) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`New Order Ticket #${order.id}`, {
          body: `${order.customer.name} • ₹${order.total.toFixed(0)} (${order.items.length} items)`,
          icon: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=200&auto=format&fit=crop',
        });
      }
    }
  };

  // Keep digital clock live
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-Time Audio Trigger on New Incoming Orders
  useEffect(() => {
    if (!isInitializedRef.current) {
      orders.forEach((o) => alertedOrderIdsRef.current.add(o.id));
      isInitializedRef.current = true;
      return;
    }

    const unalertedOrders = orders.filter((o) => !alertedOrderIdsRef.current.has(o.id) && o.status === 'new');

    if (unalertedOrders.length > 0) {
      const latestOrder = unalertedOrders[0];
      alertedOrderIdsRef.current.add(latestOrder.id);
      playKitchenChime();
      triggerDesktopNotification(latestOrder);
      setNewOrderAlert(latestOrder);
    }
  }, [orders]);

  // Handle PIN Login Verification
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Please enter authorization key.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: pinInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setIsUniversalKeyLogin(data.isUniversal);
        setActiveAuthKey(pinInput.trim());

        try {
          sessionStorage.setItem('zafiroo_kds_token', data.token);
          sessionStorage.setItem('zafiroo_kds_is_universal', String(data.isUniversal));
          sessionStorage.setItem('zafiroo_kds_auth_key', pinInput.trim());
        } catch {}

        setPinInput('');
      } else {
        setAuthError(data.error || 'Invalid Admin Key or Master PIN.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsUniversalKeyLogin(false);
    setActiveAuthKey('');
    try {
      sessionStorage.removeItem('zafiroo_kds_token');
      sessionStorage.removeItem('zafiroo_kds_is_universal');
      sessionStorage.removeItem('zafiroo_kds_auth_key');
    } catch {}
  };

  // Keypad Helper Functions
  const handleKeypadPress = (val: string) => {
    setAuthError(null);
    setPinInput((prev) => (prev.length < 12 ? prev + val : prev));
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setAuthError(null);
  };

  // Handle Changing Custom Key
  const handleChangeKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeKeyError(null);
    setChangeKeySuccess(null);

    if (!newKeyInput.trim() || newKeyInput.trim().length < 4) {
      setChangeKeyError('New key must be at least 4 characters long.');
      return;
    }

    if (newKeyInput !== confirmKeyInput) {
      setChangeKeyError('New key and confirmation do not match.');
      return;
    }

    setIsSavingKey(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentKey: activeAuthKey || '9019631104',
          newKey: newKeyInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setChangeKeySuccess('Custom Admin Key updated successfully in database.');
        setActiveAuthKey(newKeyInput.trim());
        try {
          sessionStorage.setItem('zafiroo_kds_auth_key', newKeyInput.trim());
        } catch {}
        setTimeout(() => {
          setShowChangeKeyModal(false);
          setNewKeyInput('');
          setConfirmKeyInput('');
          setChangeKeySuccess(null);
        }, 1400);
      } else {
        setChangeKeyError(data.error || 'Failed to update key.');
      }
    } catch {
      setChangeKeyError('Network error. Failed to update key.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderNameInput.trim() || !riderPhoneInput.trim()) {
      setDispatchError('Please enter both delivery agent name and phone number.');
      return;
    }
    if (!dispatchModalOrder) return;

    await updateOrderStatus(dispatchModalOrder.id, 'delivering', {
      riderName: riderNameInput.trim(),
      riderPhone: riderPhoneInput.trim(),
    });

    setDispatchModalOrder(null);
    setRiderNameInput('');
    setRiderPhoneInput('');
    setDispatchError(null);
  };

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

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter((o) => ['new', 'preparing', 'ready', 'delivering'].includes(o.status)).length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'NEW TICKET' };
      case 'preparing':
        return { bg: 'bg-amber-50 text-amber-900 border-amber-200', label: 'PREPARING' };
      case 'ready':
        return { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', label: 'PACKED & READY' };
      case 'delivering':
        return { bg: 'bg-blue-50 text-blue-900 border-blue-200', label: 'OUT FOR DELIVERY' };
      case 'completed':
        return { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', label: 'COMPLETED' };
      case 'cancelled':
        return { bg: 'bg-neutral-100 text-neutral-600 border-neutral-200', label: 'CANCELLED' };
      default:
        return { bg: 'bg-neutral-100 text-neutral-700 border-neutral-200', label: String(status).toUpperCase() };
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
    }, 250);
  };

  // 1. SLEEK TYPOGRAPHIC SECURITY TERMINAL GATE (NO ICONS)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141210] text-[#FFF8F0] flex flex-col items-center justify-center p-4 sm:p-6 select-none selection:bg-[#4A2818] selection:text-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm bg-[#1C1917] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Header Typography */}
          <div className="text-center space-y-1.5 border-b border-white/10 pb-5">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-[#D4A373] font-bold">
              KDS ACCESS TERMINAL
            </div>
            <h1 className="font-display text-3xl uppercase font-black tracking-tight text-white">
              Zafiroo <span className="text-[#D4A373]">Kitchen</span>
            </h1>
            <p className="text-xs text-white/50 font-sans">
              Enter Admin PIN or Universal Recovery Key
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type={showPinText ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="••••••••••"
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-center text-xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#D4A373] placeholder:tracking-normal placeholder:text-white/20"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPinText(!showPinText)}
                  className="text-[11px] font-mono text-white/50 hover:text-white transition-colors"
                >
                  {showPinText ? '[ Hide PIN ]' : '[ Reveal PIN ]'}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
                {authError}
              </div>
            )}

            {/* Numeric Keypad Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white font-mono text-lg font-bold transition-all border border-white/10"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-3 rounded-xl bg-white/5 hover:bg-rose-950 active:scale-95 text-rose-300 font-mono text-xs uppercase font-bold transition-all border border-white/10"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white font-mono text-lg font-bold transition-all border border-white/10"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white font-mono text-xs uppercase font-bold transition-all border border-white/10"
              >
                DEL
              </button>
            </div>

            {/* Action Unlock Button */}
            <button
              type="submit"
              disabled={isVerifying || !pinInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] disabled:opacity-40 text-white font-display text-sm uppercase tracking-wider font-bold transition-all border border-white/20 shadow-md active:scale-95"
            >
              {isVerifying ? 'VERIFYING KEY...' : 'UNLOCK KITCHEN KDS'}
            </button>
          </form>

          {/* Bottom Links */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>MASTER: 9019631104</span>
            <Link href="/" className="hover:text-white transition-colors underline">
              [ Customer Menu ]
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. MAIN AUTHORIZED KDS INTERFACE (PROPER, BEAUTIFUL, WELL-MANNERED, NO ICONS)
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1D1511] font-sans pb-20 select-none">

      {/* Real-Time New Order Banner Toast */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto"
          >
            <div className="bg-[#1C1917] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#4A2818] text-[10px] font-mono font-bold uppercase text-white">
                    NEW ORDER
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    #{newOrderAlert.id}
                  </span>
                </div>
                <div className="font-display text-lg uppercase font-bold text-white mt-1">
                  {newOrderAlert.customer.name} • ₹{newOrderAlert.total.toFixed(0)}
                </div>
                <div className="text-xs font-mono text-white/60">
                  {newOrderAlert.items.length} items • {newOrderAlert.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    updateOrderStatus(newOrderAlert.id, 'preparing');
                    setNewOrderAlert(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold uppercase transition-colors shadow-sm whitespace-nowrap"
                >
                  START PREPARING
                </button>
                <button
                  onClick={() => setNewOrderAlert(null)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Professional Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#1C1917] text-white border-b border-white/10 shadow-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Live Dispatch Badge */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white uppercase transition-colors"
            >
              MENU
            </Link>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl uppercase font-black tracking-tight text-white">
                  Zafiroo <span className="text-[#D4A373]">KDS</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  DISPATCH ACTIVE
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/50">
                LIVE DISPATCH • {currentTime}
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center space-x-2 flex-wrap">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors border ${
                soundEnabled
                  ? 'bg-[#4A2818] border-white/20 text-white'
                  : 'bg-white/10 border-white/10 text-white/50'
              }`}
            >
              {soundEnabled ? 'BELL: ON' : 'BELL: MUTED'}
            </button>

            <button
              onClick={() => addDemoOrder()}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase transition-colors border border-white/15"
            >
              SIMULATE ORDER
            </button>

            <button
              onClick={() => setShowChangeKeyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase transition-colors border border-white/20"
            >
              KEY SETTINGS
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase transition-colors"
            >
              LOCK
            </button>
          </div>

        </div>
      </header>

      {/* Main KDS Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-xs">
            <div className="text-[11px] font-mono text-black/50 uppercase font-semibold">Active Tickets</div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#1C1917] mt-1">
              {activeOrdersCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-xs">
            <div className="text-[11px] font-mono text-black/50 uppercase font-semibold">New Pending</div>
            <div className="font-display text-3xl sm:text-4xl font-black text-rose-700 mt-1">
              {newOrdersCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-xs">
            <div className="text-[11px] font-mono text-black/50 uppercase font-semibold">Today&apos;s Tickets</div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#1C1917] mt-1">
              {orders.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-xs">
            <div className="text-[11px] font-mono text-black/50 uppercase font-semibold">Today&apos;s Volume</div>
            <div className="font-display text-3xl sm:text-4xl font-black text-emerald-800 mt-1">
              ₹{totalRevenue.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['all', 'new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  activeFilter === st
                    ? 'bg-[#4A2818] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {st === 'all' ? 'ALL TICKETS' : st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ID, PHONE, CUSTOMER..."
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 border border-black/10 text-xs font-mono text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
            />
          </div>
        </div>

        {/* Order Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-black/10 p-6">
            <h3 className="font-display text-xl uppercase font-bold text-[#1C1917]">No Orders In Pipeline</h3>
            <p className="text-xs font-mono text-black/50 mt-1">
              Click &quot;SIMULATE ORDER&quot; in header to generate live tickets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const elapsed = getElapsedMinutes(order.createdAt);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-black/10 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-black/5 bg-neutral-50/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm font-black text-[#1C1917]">
                        #{order.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-black/60">
                      <span className="font-semibold text-[#1C1917]">{order.customer.name}</span>
                      <span>{elapsed}m ago</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs">
                        <div className="font-sans font-semibold text-[#1C1917]">
                          <span className="text-[#4A2818] font-bold mr-1.5">{item.quantity}x</span>
                          <span>{item.menuItem?.name || 'Cafe Item'}</span>
                          {item.selectedOptions?.portion && (
                            <span className="block text-[10px] font-mono text-black/50">
                              Portion: {item.selectedOptions.portion}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-black/70">
                          ₹{(item.itemTotal || 0).toFixed(0)}
                        </span>
                      </div>
                    ))}

                    {order.customer.address && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px] font-mono text-black/60">
                        {order.customer.address}
                      </div>
                    )}

                    {order.riderName && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px] font-mono text-blue-950 bg-blue-50/90 p-2.5 rounded-xl flex items-center justify-between border border-blue-200">
                        <div>
                          <span className="font-bold uppercase text-[10px] text-blue-800 block">Assigned Delivery Rider</span>
                          <span className="font-semibold text-xs">{order.riderName}</span>
                          <span className="text-black/60 block text-[11px]">{order.riderPhone}</span>
                        </div>
                        {order.status === 'delivering' && (
                          <button
                            onClick={() => {
                              setDispatchModalOrder(order);
                              setRiderNameInput(order.riderName || '');
                              setRiderPhoneInput(order.riderPhone || '');
                              setDispatchError(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-blue-200/80 hover:bg-blue-300 text-blue-900 text-[10px] font-mono font-bold uppercase transition-colors"
                          >
                            EDIT
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3.5 bg-neutral-50 border-t border-black/5 space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs font-bold text-[#1C1917]">
                      <span>TOTAL</span>
                      <span>₹{order.total.toFixed(0)}</span>
                    </div>

                    {/* Sequential Status Progression Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {order.status === 'new' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="col-span-2 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-mono text-xs font-bold uppercase transition-colors"
                        >
                          START COOKING
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="col-span-2 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-mono text-xs font-bold uppercase transition-colors"
                        >
                          MARK READY
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => {
                            if (order.deliveryMethod === 'delivery') {
                              setDispatchModalOrder(order);
                              setRiderNameInput(order.riderName || '');
                              setRiderPhoneInput(order.riderPhone || '');
                              setDispatchError(null);
                            } else {
                              updateOrderStatus(order.id, 'completed');
                            }
                          }}
                          className="col-span-2 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-mono text-xs font-bold uppercase transition-colors"
                        >
                          {order.deliveryMethod === 'delivery' ? 'ASSIGN RIDER & DISPATCH' : 'COMPLETE ORDER'}
                        </button>
                      )}

                      {order.status === 'delivering' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="col-span-2 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs font-bold uppercase transition-colors"
                        >
                          CONFIRM DELIVERED
                        </button>
                      )}

                      <button
                        onClick={() => printReceipt(order)}
                        className="py-1.5 rounded-lg bg-white border border-black/10 hover:bg-neutral-100 text-xs font-mono font-bold uppercase text-center"
                      >
                        PRINT SLIP
                      </button>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase text-center"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 3. CHANGE ADMIN KEY MODAL (NO ICONS, PURE TYPOGRAPHIC DESIGN) */}
      <AnimatePresence>
        {showChangeKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-[#1C1917] text-white border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-xl uppercase font-bold text-white">
                  CHANGE ADMIN KEY
                </h3>
                <button
                  onClick={() => setShowChangeKeyModal(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono uppercase text-white/70 hover:text-white"
                >
                  CLOSE
                </button>
              </div>

              <form onSubmit={handleChangeKeySubmit} className="space-y-4">
                <p className="text-xs text-white/70 font-sans">
                  Set new custom PIN (min 4 characters). The Universal Master Key (<strong>9019631104</strong>) remains active as your recovery override.
                </p>

                <div>
                  <label className="block text-[11px] font-mono text-[#D4A373] uppercase font-bold mb-1">
                    NEW ADMIN PIN
                  </label>
                  <input
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Enter new PIN..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#D4A373] uppercase font-bold mb-1">
                    CONFIRM NEW PIN
                  </label>
                  <input
                    type="password"
                    value={confirmKeyInput}
                    onChange={(e) => setConfirmKeyInput(e.target.value)}
                    placeholder="Re-enter new PIN..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                  />
                </div>

                {changeKeyError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    {changeKeyError}
                  </div>
                )}

                {changeKeySuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                    {changeKeySuccess}
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangeKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingKey}
                    className="flex-1 py-2.5 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-md border border-white/20"
                  >
                    {isSavingKey ? 'SAVING...' : 'SAVE NEW KEY'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* 4. ASSIGN DELIVERY AGENT MODAL */}
        {dispatchModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-[#1C1917] text-white border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display text-xl uppercase font-bold text-white">
                    ASSIGN DELIVERY AGENT
                  </h3>
                  <span className="text-xs font-mono text-[#D4A373]">
                    ORDER #{dispatchModalOrder.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono uppercase text-white/70 hover:text-white"
                >
                  CLOSE
                </button>
              </div>

              <form onSubmit={handleConfirmDispatch} className="space-y-4">
                <p className="text-xs text-white/70 font-sans">
                  Enter the delivery rider&apos;s name and phone number. This will be shared with the customer to track courier arrival.
                </p>

                <div>
                  <label className="block text-[11px] font-mono text-[#D4A373] uppercase font-bold mb-1.5">
                    DELIVERY AGENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={riderNameInput}
                    onChange={(e) => setRiderNameInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#D4A373] uppercase font-bold mb-1.5">
                    DELIVERY AGENT PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98450 12345"
                    value={riderPhoneInput}
                    onChange={(e) => setRiderPhoneInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                  />
                </div>

                {dispatchError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    {dispatchError}
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOrder(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-md border border-white/20"
                  >
                    CONFIRM & DISPATCH
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Print Receipt Slip */}
      {selectedReceiptOrder && (
        <div id="print-section" className="hidden print:block fixed inset-0 bg-white text-black p-8 font-mono text-xs">
          <div className="text-center pb-4 border-b border-black">
            <h2 className="text-lg font-bold">ZAFIROO KITCHEN</h2>
            <p>Order #{selectedReceiptOrder.id}</p>
            <p>{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</p>
          </div>
          <div className="py-4 border-b border-black space-y-2">
            <p><strong>Customer:</strong> {selectedReceiptOrder.customer.name}</p>
            <p><strong>Phone:</strong> {selectedReceiptOrder.customer.phone}</p>
            {selectedReceiptOrder.customer.address && (
              <p><strong>Address:</strong> {selectedReceiptOrder.customer.address}</p>
            )}
          </div>
          <div className="py-4 border-b border-black space-y-1">
            {selectedReceiptOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.quantity}x {item.menuItem?.name}</span>
                <span>₹{(item.itemTotal || 0).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span>₹{selectedReceiptOrder.total.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
