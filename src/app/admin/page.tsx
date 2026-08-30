'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Bike,
  Store,
  RefreshCw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Key,
  ShieldCheck,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  Radio,
  FileText,
  Printer,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Users,
  Navigation,
  KeyRound,
  ExternalLink,
  DollarSign,
  PackageCheck,
  Check,
  X,
  ChefHat,
  Receipt,
  LogOut,
  Send,
  Zap,
  Star,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrder } from '@/context/OrderContext';
import { Order, OrderStatus, DeliveryMethod, DeliveryAgent } from '@/types/cafe';
import { CAFE_INFO } from '@/data/cafeData';
import OriginalBillReceipt from '@/components/OriginalBillReceipt';
import BillModal from '@/components/BillModal';

export default function AdminPortalPage() {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    addDemoOrder,
    deliveryAgents,
    refreshDeliveryAgents,
    assignDeliveryAgent,
    verifyDeliveryOtp,
  } = useOrder();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authRole, setAuthRole] = useState<'admin' | 'delivery_agent'>('admin');
  const [loggedDeliveryAgent, setLoggedDeliveryAgent] = useState<DeliveryAgent | null>(null);
  const [isUniversalKeyLogin, setIsUniversalKeyLogin] = useState(false);
  const [activeAuthKey, setActiveAuthKey] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPinText, setShowPinText] = useState(false);

  // Admin View Navigation ('kds' | 'analytics')
  const [adminActiveTab, setAdminActiveTab] = useState<'kds' | 'analytics'>('kds');

  // Change Key Modal State
  const [showChangeKeyModal, setShowChangeKeyModal] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [changeKeyError, setChangeKeyError] = useState<string | null>(null);
  const [changeKeySuccess, setChangeKeySuccess] = useState<string | null>(null);

  // Register New Delivery Agent Modal State
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentVehicle, setNewAgentVehicle] = useState('Electric Bike');
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [addAgentError, setAddAgentError] = useState<string | null>(null);
  const [addAgentSuccess, setAddAgentSuccess] = useState<string | null>(null);

  // KDS Operational State & 24-Hour Cycle
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [kdsTimeCycle, setKdsTimeCycle] = useState<'24h' | 'all'>('24h');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [previewBillOrder, setPreviewBillOrder] = useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Delivery Agent Dispatch Modal State
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [customRiderName, setCustomRiderName] = useState('');
  const [customRiderPhone, setCustomRiderPhone] = useState('');
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  // Delivery Agent Portal State (Rider App Mode)
  const [riderOtpInputs, setRiderOtpInputs] = useState<Record<string, string>>({});
  const [riderVerifyingId, setRiderVerifyingId] = useState<string | null>(null);
  const [riderOtpError, setRiderOtpError] = useState<Record<string, string>>({});
  const [riderOtpSuccess, setRiderOtpSuccess] = useState<Record<string, string>>({});

  // Business Analytics Period State (Monthly Cycle based on days in the current month)
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'month' | 'all'>('month');
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState<string>('all');
  const [analyticsRiderFilter, setAnalyticsRiderFilter] = useState<string>('all');

  // Track all order IDs that have already been alerted
  const alertedOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  // Check existing session on mount
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem('zafiroo_kds_token');
      const savedRole = sessionStorage.getItem('zafiroo_kds_role') as 'admin' | 'delivery_agent' | null;
      const savedUniversal = sessionStorage.getItem('zafiroo_kds_is_universal') === 'true';
      const savedKey = sessionStorage.getItem('zafiroo_kds_auth_key') || '';
      const savedAgentRaw = sessionStorage.getItem('zafiroo_kds_agent');

      if (savedToken) {
        setIsAuthenticated(true);
        setAuthRole(savedRole || 'admin');
        setIsUniversalKeyLogin(savedUniversal);
        setActiveAuthKey(savedKey);
        if (savedAgentRaw) {
          setLoggedDeliveryAgent(JSON.parse(savedAgentRaw));
        }
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

  // Real-Time Audio Trigger on New Incoming Orders (For Kitchen KDS)
  useEffect(() => {
    if (!isInitializedRef.current) {
      orders.forEach((o) => alertedOrderIdsRef.current.add(o.id));
      isInitializedRef.current = true;
      return;
    }

    const unalertedOrders = orders.filter((o) => !alertedOrderIdsRef.current.has(o.id) && o.status === 'new');

    if (unalertedOrders.length > 0 && authRole === 'admin') {
      const latestOrder = unalertedOrders[0];
      alertedOrderIdsRef.current.add(latestOrder.id);
      playKitchenChime();
      triggerDesktopNotification(latestOrder);
      setNewOrderAlert(latestOrder);
    }
  }, [orders, authRole]);

  // Handle PIN or Mobile Number Login Verification (Unified Smart Gateway)
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Please enter Kitchen PIN or Delivery Agent Mobile Number.');
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
        const role = (data.role || 'admin') as 'admin' | 'delivery_agent';
        setAuthRole(role);
        setIsUniversalKeyLogin(Boolean(data.isUniversal));
        setActiveAuthKey(pinInput.trim());

        if (role === 'delivery_agent' && data.agent) {
          setLoggedDeliveryAgent(data.agent);
        } else {
          setLoggedDeliveryAgent(null);
        }

        try {
          sessionStorage.setItem('zafiroo_kds_token', data.token);
          sessionStorage.setItem('zafiroo_kds_role', role);
          sessionStorage.setItem('zafiroo_kds_is_universal', String(Boolean(data.isUniversal)));
          sessionStorage.setItem('zafiroo_kds_auth_key', pinInput.trim());
          if (data.agent) {
            sessionStorage.setItem('zafiroo_kds_agent', JSON.stringify(data.agent));
          }
        } catch {}

        setPinInput('');
      } else {
        setAuthError(data.error || 'Invalid Kitchen PIN or Unregistered Delivery Partner Mobile Number.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthRole('admin');
    setLoggedDeliveryAgent(null);
    setIsUniversalKeyLogin(false);
    setActiveAuthKey('');
    try {
      sessionStorage.removeItem('zafiroo_kds_token');
      sessionStorage.removeItem('zafiroo_kds_role');
      sessionStorage.removeItem('zafiroo_kds_is_universal');
      sessionStorage.removeItem('zafiroo_kds_auth_key');
      sessionStorage.removeItem('zafiroo_kds_agent');
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

  // Handle Changing Custom Admin Key
  const handleChangeKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeKeyError(null);
    setChangeKeySuccess(null);

    if (!newKeyInput.trim() || newKeyInput.trim().length < 4) {
      setChangeKeyError('New PIN must be at least 4 characters long.');
      return;
    }

    if (newKeyInput !== confirmKeyInput) {
      setChangeKeyError('New PIN and confirmation do not match.');
      return;
    }

    setIsSavingKey(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentKey: activeAuthKey || '',
          newKey: newKeyInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setChangeKeySuccess('Custom Admin PIN updated successfully in database.');
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
        setChangeKeyError(data.error || 'Failed to update PIN.');
      }
    } catch {
      setChangeKeyError('Network error. Failed to update PIN.');
    } finally {
      setIsSavingKey(false);
    }
  };

  // Handle Registering a New Delivery Agent in Supabase DB
  const handleAddDeliveryAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAgentError(null);
    setAddAgentSuccess(null);

    if (!newAgentName.trim() || !newAgentPhone.trim()) {
      setAddAgentError('Please enter both name and 10-digit mobile number.');
      return;
    }

    const cleanPhone = newAgentPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setAddAgentError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSavingAgent(true);

    try {
      const res = await fetch('/api/delivery/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAgentName.trim(),
          phone: cleanPhone,
          vehicleType: newAgentVehicle,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAddAgentSuccess(`Rider ${newAgentName.trim()} registered! They can now log in with +91 ${cleanPhone}.`);
        refreshDeliveryAgents();
        setTimeout(() => {
          setShowAddAgentModal(false);
          setNewAgentName('');
          setNewAgentPhone('');
          setAddAgentSuccess(null);
        }, 1500);
      } else {
        setAddAgentError(data.error || 'Failed to register delivery agent.');
      }
    } catch {
      setAddAgentError('Connection error. Failed to register delivery agent.');
    } finally {
      setIsSavingAgent(false);
    }
  };

  // Handle Dispatching Order to a Delivery Agent
  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    let riderName = customRiderName.trim();
    let riderPhone = customRiderPhone.trim();
    let agentId = selectedAgentId;

    if (selectedAgentId && selectedAgentId !== 'custom') {
      const matchedAgent = deliveryAgents.find((a) => a.id === selectedAgentId);
      if (matchedAgent) {
        riderName = matchedAgent.name;
        riderPhone = matchedAgent.phone;
        agentId = matchedAgent.id;
      }
    }

    if (!riderName || !riderPhone) {
      setDispatchError('Please select a delivery partner or enter rider details.');
      return;
    }

    await updateOrderStatus(dispatchModalOrder.id, 'delivering', {
      riderName,
      riderPhone,
      agentId,
    });

    setDispatchModalOrder(null);
    setSelectedAgentId('');
    setCustomRiderName('');
    setCustomRiderPhone('');
    setDispatchError(null);
  };

  // Delivery Agent Doorstep OTP Verification Handler
  const handleRiderVerifyOtp = async (orderId: string) => {
    const otp = (riderOtpInputs[orderId] || '').trim();
    if (!otp || otp.length < 4) {
      setRiderOtpError((prev) => ({ ...prev, [orderId]: 'Enter 4-digit OTP from customer' }));
      return;
    }

    setRiderVerifyingId(orderId);
    setRiderOtpError((prev) => ({ ...prev, [orderId]: '' }));

    const res = await verifyDeliveryOtp(
      orderId,
      otp,
      loggedDeliveryAgent?.id,
      loggedDeliveryAgent?.phone
    );

    setRiderVerifyingId(null);

    if (res.success) {
      setRiderOtpSuccess((prev) => ({ ...prev, [orderId]: 'Delivered & Verified!' }));
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#4A2818', '#F59E0B'],
        });
      } catch {}

      if (loggedDeliveryAgent) {
        setLoggedDeliveryAgent({
          ...loggedDeliveryAgent,
          ordersDeliveredCount: loggedDeliveryAgent.ordersDeliveredCount + 1,
        });
      }

      setTimeout(() => {
        setRiderOtpSuccess((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        setRiderOtpInputs((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
      }, 2500);
    } else {
      setRiderOtpError((prev) => ({ ...prev, [orderId]: res.error || 'Incorrect OTP code.' }));
    }
  };

  // ---------------------------------------------------------------------------
  // 1. 24-HOUR KITCHEN KDS FILTERING
  // ---------------------------------------------------------------------------
  const nowMs = Date.now();
  const twentyFourHoursAgoMs = nowMs - 24 * 60 * 60 * 1000;

  const kdsCycleOrders = orders.filter((order) => {
    if (kdsTimeCycle === '24h') {
      const isRecent = new Date(order.createdAt).getTime() >= twentyFourHoursAgoMs;
      const isUncompleted = order.status !== 'completed' && order.status !== 'cancelled';
      return isRecent || isUncompleted;
    }
    return true;
  });

  const filteredKdsOrders = kdsCycleOrders.filter((order) => {
    const matchesStatus = activeFilter === 'all' || order.status === activeFilter;
    const matchesDelivery = deliveryFilter === 'all' || order.deliveryMethod === deliveryFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.tokenId && order.tokenId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer.address && order.customer.address.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesDelivery && matchesSearch;
  });

  // Filter Delivery Agent Assigned Orders
  const agentPhoneClean = (loggedDeliveryAgent?.phone || '').replace(/[^0-9]/g, '').slice(-10);
  const riderAssignedOrders = orders.filter((o) => {
    if (loggedDeliveryAgent?.id && o.deliveryAgentId === loggedDeliveryAgent.id) return true;
    if (agentPhoneClean && o.riderPhone && o.riderPhone.replace(/[^0-9]/g, '').endsWith(agentPhoneClean)) return true;
    return false;
  });

  const riderActiveDeliveries = riderAssignedOrders.filter((o) => o.status === 'delivering' || o.status === 'ready');
  const riderCompletedDeliveries = riderAssignedOrders.filter((o) => o.status === 'completed');

  // ---------------------------------------------------------------------------
  // 2. DYNAMIC MONTHLY CYCLE & TOTAL INCOME CALCULATION (Dynamic days in month)
  // ---------------------------------------------------------------------------
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonthName = currentDate.toLocaleString('en-US', { month: 'long' });
  const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate(); // 31, 30, or 28/29

  const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59, 999);

  // Orders belonging to the current month cycle
  const currentMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const activePeriodOrders = analyticsPeriod === 'month' ? currentMonthOrders : orders;

  const periodRevenueSum = activePeriodOrders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const periodOrdersCount = activePeriodOrders.length;
  const periodDeliveredCount = activePeriodOrders.filter((o) => o.status === 'completed').length;
  const inKitchenOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready').length;
  const onTheWayOrdersCount = orders.filter((o) => o.status === 'delivering').length;

  // Calculate Customer Rating Metrics
  const ratedOrders = orders.filter((o) => typeof o.rating === 'number' && o.rating > 0);
  const avgRatingScore = ratedOrders.length > 0
    ? (ratedOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / ratedOrders.length).toFixed(1)
    : '5.0';

  // Filtered orders for Business Tracking Table
  const analyticsFilteredOrders = activePeriodOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
      (order.tokenId && order.tokenId.toLowerCase().includes(analyticsSearch.toLowerCase())) ||
      order.customer.name.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
      order.customer.phone.includes(analyticsSearch);

    const matchesStatus =
      analyticsStatusFilter === 'all' || order.status === analyticsStatusFilter;

    const matchesRider =
      analyticsRiderFilter === 'all' ||
      (order.riderName && order.riderName.toLowerCase().includes(analyticsRiderFilter.toLowerCase())) ||
      (order.deliveryAgentId && order.deliveryAgentId === analyticsRiderFilter);

    return matchesSearch && matchesStatus && matchesRider;
  });

  // ---------------------------------------------------------------------------
  // RENDER 1: SMART LOGIN GATEWAY SCREEN (Admin PIN or Rider Mobile Number)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4 relative selection:bg-[#4A2818] selection:text-white overflow-hidden">
        {/* Ambient Warm Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-banhmi-gold/40 shadow-warm-2xl relative z-10">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#4A2818] text-white shadow-md">
              <ChefHat className="w-7 h-7" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase font-black text-banhmi-dark tracking-tight">
              Zafiroo <span className="text-banhmi-red">Terminal</span>
            </h1>
            <p className="text-xs text-banhmi-dark/70 font-sans max-w-xs mx-auto">
              Enter <strong className="text-[#4A2818]">Kitchen Admin PIN</strong> for KDS or <strong className="text-emerald-700">Rider Mobile Number</strong> for Deliveries.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPinText ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setAuthError(null);
                  setPinInput(e.target.value);
                }}
                placeholder="Enter PIN or 10-Digit Mobile..."
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF8F0] border-2 border-banhmi-gold/50 text-banhmi-dark font-mono text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#4A2818] focus:ring-2 focus:ring-[#4A2818]/20 transition-all placeholder:text-black/30 placeholder:tracking-normal placeholder:text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPinText(!showPinText)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-banhmi-dark/40 hover:text-banhmi-dark p-1.5 transition-colors cursor-pointer"
              >
                {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            {/* Quick Touch Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-lg font-bold transition-colors active:scale-95 border border-cream-300 cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-xs font-bold uppercase transition-colors active:scale-95 border border-rose-200 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-lg font-bold transition-colors active:scale-95 border border-cream-300 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-mono text-xs font-bold uppercase transition-colors active:scale-95 border border-amber-200 cursor-pointer"
              >
                Clear Last
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !pinInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-base uppercase tracking-wider font-bold transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Enter Terminal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER 2: DELIVERY AGENT DEDICATED PORTAL (Rider App View)
  // ---------------------------------------------------------------------------
  if (authRole === 'delivery_agent' && loggedDeliveryAgent) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] selection:bg-[#4A2818] selection:text-white pb-20">
        {/* Rider Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-[#4A2818] text-white px-4 sm:px-6 py-4 shadow-warm-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-emerald-400 border border-white/10">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl sm:text-2xl uppercase font-black tracking-tight text-white">
                  {loggedDeliveryAgent.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  Active On-Duty
                </span>
              </div>
              <div className="text-xs font-mono text-white/70 flex items-center space-x-2">
                <span>+91 {loggedDeliveryAgent.phone}</span>
                <span>•</span>
                <span>{loggedDeliveryAgent.vehicleType || 'Electric Bike'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white">
                Delivered: <strong className="text-emerald-300">{loggedDeliveryAgent.ordersDeliveredCount}</strong>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors border border-white/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Rider Portal Main Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-amber-300/80 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-black/50 font-bold block">Assigned Active</span>
              <div className="font-display text-2xl uppercase font-black text-amber-900 mt-0.5">
                {riderActiveDeliveries.length} Deliveries
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-300/80 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-black/50 font-bold block">Total Completed</span>
              <div className="font-display text-2xl uppercase font-black text-emerald-900 mt-0.5 flex items-center space-x-1">
                <span>{loggedDeliveryAgent.ordersDeliveredCount} Orders</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-stone-300/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-black/50 font-bold block">Studio Kitchen</span>
                <div className="font-mono text-xs font-bold text-banhmi-dark mt-0.5">100 Ft Rd Indiranagar</div>
              </div>
              <a
                href="https://maps.google.com/?q=Indiranagar+Bengaluru"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-banhmi-dark transition-colors"
                title="Kitchen GPS"
              >
                <MapPin className="w-4 h-4 text-banhmi-red" />
              </a>
            </div>
          </div>

          {/* Active Assigned Deliveries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h2 className="font-display text-2xl uppercase font-black text-banhmi-dark tracking-tight">
                  Active Doorstep Deliveries ({riderActiveDeliveries.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-black/50">Auto-refreshing live from DB</span>
            </div>

            {riderActiveDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-banhmi-gold/30 text-center space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 inline-block">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl uppercase font-black text-banhmi-dark">
                  No Active Deliveries Assigned Right Now
                </h3>
                <p className="text-xs text-banhmi-dark/70 font-sans max-w-sm mx-auto">
                  You are all caught up! New orders dispatched from the kitchen will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {riderActiveDeliveries.map((order) => {
                  const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const isDelivering = order.status === 'delivering';
                  const isReady = order.status === 'ready';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 shadow-warm-lg space-y-5 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-banhmi-red text-xl">
                              #{order.tokenId || order.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                                isDelivering ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {isDelivering ? 'Out for Delivery' : 'Packed & Ready at Counter'}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-black/50">
                            Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ETA: {order.estimatedTime}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono uppercase text-black/50 block">Payment</span>
                          <span className="font-mono text-sm font-bold text-banhmi-dark">
                            ₹{order.total.toFixed(0)} • {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-[#FFF8F0] p-4 rounded-2xl border border-banhmi-gold/30">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold block">
                            Customer Details
                          </span>
                          <div className="font-display text-lg uppercase font-bold text-banhmi-dark">
                            {order.customer.name}
                          </div>
                          <div className="text-xs font-mono text-banhmi-dark/80 flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{order.customer.phone}</span>
                          </div>

                          <div className="pt-2 flex items-center gap-2">
                            <a
                              href={`tel:${order.customer.phone.replace(/[^0-9+]/g, '')}`}
                              className="px-3 py-1.5 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call Customer</span>
                            </a>
                            <a
                              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.name}, I am your Zafiroo delivery partner with your order #${order.tokenId || order.id}. I am on my way!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                            >
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        <div className="space-y-2 bg-[#FFF8F0] p-4 rounded-2xl border border-banhmi-gold/30 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold block">
                              Delivery Street Address
                            </span>
                            <p className="text-xs font-sans text-banhmi-dark font-medium mt-0.5 line-clamp-3">
                              {order.customer.address || 'Address provided at checkout'} {order.customer.unitOrApt ? `(Unit: ${order.customer.unitOrApt})` : ''}
                            </p>
                            {order.customer.deliveryInstructions && (
                              <p className="text-[11px] font-mono text-amber-900 bg-amber-100/60 p-1.5 rounded-lg mt-1.5 border border-amber-200">
                                <em>{order.customer.deliveryInstructions}</em>
                              </p>
                            )}
                          </div>

                          {order.customer.address && (
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(order.customer.address)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs mt-2"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Open Google Maps Navigation</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-cream-100/70 border border-cream-300">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold block mb-1">
                          Package Items ({itemsCount})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((it, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-white border border-cream-300 text-xs font-mono font-bold text-banhmi-dark shadow-xs"
                            >
                              {it.quantity}x {it.menuItem.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-cream-200">
                        {isReady && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'delivering')}
                            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-display text-base uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                          >
                            <Bike className="w-5 h-5" />
                            <span>Pick Up Package & Start Delivery</span>
                          </button>
                        )}

                        {isDelivering && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#1D1511] to-[#4A2818] text-white border-2 border-emerald-500 shadow-md space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center space-x-2">
                                <KeyRound className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-300">
                                  Doorstep OTP Verification
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-white/60">
                                Ask customer for 4-digit code
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2.5">
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="Enter 4-Digit OTP..."
                                value={riderOtpInputs[order.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setRiderOtpInputs((prev) => ({ ...prev, [order.id]: val }));
                                  setRiderOtpError((prev) => ({ ...prev, [order.id]: '' }));
                                }}
                                className="w-full sm:w-56 px-4 py-2.5 rounded-xl bg-white text-banhmi-dark font-mono text-center text-lg font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-black/30 placeholder:tracking-normal placeholder:text-xs"
                              />

                              <button
                                type="button"
                                disabled={riderVerifyingId === order.id}
                                onClick={() => handleRiderVerifyOtp(order.id)}
                                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                              >
                                {riderVerifyingId === order.id ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Verifying OTP...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>Confirm Delivered</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {riderOtpError[order.id] && (
                              <div className="text-xs font-mono text-rose-300 bg-rose-950/80 p-2 rounded-lg border border-rose-500/50 flex items-center space-x-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                                <span>{riderOtpError[order.id]}</span>
                              </div>
                            )}

                            {riderOtpSuccess[order.id] && (
                              <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 p-2 rounded-lg border border-emerald-500/50 flex items-center space-x-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span>{riderOtpSuccess[order.id]}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed Deliveries */}
          <div className="space-y-4 pt-6 border-t border-cream-300">
            <h3 className="font-display text-xl uppercase font-black text-banhmi-dark tracking-tight flex items-center space-x-2">
              <PackageCheck className="w-5 h-5 text-emerald-600" />
              <span>Delivered History ({riderCompletedDeliveries.length})</span>
            </h3>

            {riderCompletedDeliveries.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white border border-cream-300 text-center text-xs font-mono text-black/50">
                No past delivered orders recorded for today yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {riderCompletedDeliveries.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-banhmi-dark text-sm">
                          #{order.tokenId || order.id}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Delivered</span>
                        </span>
                      </div>
                      <div className="text-xs font-sans text-black/70 mt-0.5">
                        {order.customer.name} • ₹{order.total.toFixed(0)}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-black/50">
                      {order.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Delivered'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER 3: ADMIN PORTAL (Kitchen KDS + Executive Business Tracking Dashboard)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] selection:bg-[#4A2818] selection:text-white pb-20">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#4A2818] text-white px-4 sm:px-8 py-3.5 shadow-warm-lg flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
              <ChefHat className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-display text-xl uppercase font-black tracking-tight text-white block">
                Zafiroo KDS
              </span>
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                Studio Kitchen & Fleet Control
              </span>
            </div>
          </Link>

          {/* Navigation View Switcher: Live KDS vs Business Analytics */}
          <div className="flex items-center bg-black/30 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setAdminActiveTab('kds')}
              className={`px-3.5 py-1.5 rounded-xl font-display text-xs uppercase tracking-wider font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                adminActiveTab === 'kds'
                  ? 'bg-white text-[#4A2818] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Kitchen KDS</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl font-display text-xs uppercase tracking-wider font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                adminActiveTab === 'analytics'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Business Tracking & Fleet</span>
            </button>
          </div>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center space-x-3">
          {/* Digital Clock */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 font-mono text-xs font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentTime}</span>
          </div>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/10 text-white/40 border-white/10'
            }`}
            title={soundEnabled ? 'Kitchen chime audio enabled' : 'Chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Change PIN Button */}
          <button
            onClick={() => setShowChangeKeyModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors border border-white/10 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Change PIN</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors border border-white/10 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* TAB A: EXECUTIVE BUSINESS TRACKING & MONTHLY TOTAL INCOME VIEW */}
      {/* --------------------------------------------------------------------- */}
      {adminActiveTab === 'analytics' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
          {/* Top Monthly Header & Cycle Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-banhmi-gold/40 shadow-warm-md">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold uppercase border border-emerald-300 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentMonthName} {currentYear} • {daysInCurrentMonth}-Day Cycle</span>
                </span>
                <span className="text-xs font-mono text-black/50">Auto-refreshes every month</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl uppercase font-black text-banhmi-dark tracking-tight">
                {analyticsPeriod === 'month' ? `${currentMonthName} Financial & Performance Ledger` : 'All-Time Financial Ledger'}
              </h2>
            </div>

            {/* Period Selector Toggle */}
            <div className="flex items-center bg-cream-100 p-1 rounded-2xl border border-cream-300 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAnalyticsPeriod('month')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  analyticsPeriod === 'month'
                    ? 'bg-[#4A2818] text-white shadow-xs'
                    : 'text-banhmi-dark/70 hover:text-banhmi-dark'
                }`}
              >
                This Month ({daysInCurrentMonth} Days)
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsPeriod('all')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  analyticsPeriod === 'all'
                    ? 'bg-[#4A2818] text-white shadow-xs'
                    : 'text-banhmi-dark/70 hover:text-banhmi-dark'
                }`}
              >
                All Orders ({orders.length})
              </button>
            </div>
          </div>

          {/* Executive KPI Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Monthly Total Revenue Card */}
            <div className="col-span-2 lg:col-span-1 p-5 rounded-3xl bg-[#4A2818] text-white border border-[#2E1509] shadow-warm-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 font-bold block">
                {analyticsPeriod === 'month' ? `${currentMonthName} Income` : 'Total Income'}
              </span>
              <div className="font-display text-3xl uppercase font-black text-emerald-300 mt-1">
                ₹{periodRevenueSum.toFixed(0)}
              </div>
              <span className="text-[11px] font-mono text-white/80">{daysInCurrentMonth}-Day Monthly Cycle</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-banhmi-gold/40 shadow-warm-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/50 font-bold block">
                Orders Placed
              </span>
              <div className="font-display text-3xl uppercase font-black text-[#4A2818] mt-1">
                {periodOrdersCount}
              </div>
              <span className="text-[11px] font-mono text-emerald-700">Database Verified</span>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 shadow-warm-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block flex items-center space-x-1">
                <span>Delivered</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <div className="font-display text-3xl uppercase font-black text-emerald-900 mt-1 flex items-center space-x-2">
                <span>{periodDeliveredCount}</span>
                <span className="text-xs font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  ✓ Verified
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">Doorstep OTP Verified</span>
            </div>

            {/* Average Rating Score Card */}
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-300 shadow-warm-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-bold block flex items-center space-x-1">
                <span>Customer Satisfaction</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              </span>
              <div className="font-display text-3xl uppercase font-black text-amber-950 mt-1 flex items-center space-x-1">
                <span>{avgRatingScore}</span>
                <span className="text-sm font-mono text-amber-800">/ 5.0</span>
              </div>
              <span className="text-[11px] font-mono text-amber-900 font-bold">
                {ratedOrders.length} Reviews Logged
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50 border border-orange-200 shadow-warm-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-800 font-bold block">
                Active En Route
              </span>
              <div className="font-display text-3xl uppercase font-black text-orange-900 mt-1">
                {onTheWayOrdersCount}
              </div>
              <span className="text-[11px] font-mono text-orange-800">Couriers Dispatched</span>
            </div>
          </div>

          {/* Section: Delivery Fleet Partners & Performance Leaderboard */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl uppercase font-black text-banhmi-dark tracking-tight flex items-center space-x-2">
                  <Bike className="w-6 h-6 text-banhmi-red" />
                  <span>Delivery Fleet Partners & Database Tracking</span>
                </h2>
                <p className="text-xs text-banhmi-dark/70 font-sans mt-0.5">
                  Riders log in at the terminal using their registered 10-digit mobile number from the database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAgentModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Register New Rider</span>
              </button>
            </div>

            {deliveryAgents.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/30 text-center space-y-2">
                <p className="text-xs font-mono text-black/60">
                  No delivery partners registered in database yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddAgentModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Partner</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {deliveryAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/40 shadow-xs flex items-center justify-between space-x-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-display text-lg uppercase font-bold text-banhmi-dark">
                          {agent.name}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase">
                          {agent.status}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-banhmi-dark/70 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>+91 {agent.phone}</span>
                      </div>
                      <div className="text-[10px] font-mono text-black/50">
                        Vehicle: {agent.vehicleType || 'Electric Bike'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase text-black/50 block">Delivered</span>
                      <span className="font-display text-2xl uppercase font-black text-emerald-700 flex items-center space-x-1">
                        <span>{agent.ordersDeliveredCount}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Complete Business Orders History & Tracking Table with Customer Feedback */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-md space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl uppercase font-black text-banhmi-dark tracking-tight">
                  Business Order Tracking Ledger
                </h3>
                <span className="text-xs font-mono text-black/50">
                  Showing {analyticsFilteredOrders.length} orders in active ledger
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Token, Phone, Name..."
                    value={analyticsSearch}
                    onChange={(e) => setAnalyticsSearch(e.target.value)}
                    className="px-3.5 py-2 pl-9 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  />
                  <Search className="w-3.5 h-3.5 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={analyticsStatusFilter}
                  onChange={(e) => setAnalyticsStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">✓ Delivered (Green Tick)</option>
                  <option value="delivering">Out for Delivery</option>
                  <option value="ready">Ready at Kitchen</option>
                  <option value="preparing">Preparing</option>
                  <option value="new">New Ticket</option>
                </select>

                <select
                  value={analyticsRiderFilter}
                  onChange={(e) => setAnalyticsRiderFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                >
                  <option value="all">All Riders</option>
                  {deliveryAgents.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.ordersDeliveredCount} delivered)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table with Visible Customer Feedback Column */}
            <div className="overflow-x-auto rounded-2xl border border-cream-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#4A2818] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Order Token</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Total &amp; Payment</th>
                    <th className="p-3.5">Assigned Rider</th>
                    <th className="p-3.5">Delivery OTP</th>
                    <th className="p-3.5">Customer Rating &amp; Review</th>
                    <th className="p-3.5">Delivered Time</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white font-sans">
                  {analyticsFilteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-xs font-mono text-black/40">
                        No orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    analyticsFilteredOrders.map((order) => {
                      const isDelivered = order.status === 'completed';
                      const itemsSummary = order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ');

                      return (
                        <tr key={order.id} className="hover:bg-cream-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-banhmi-red">
                            #{order.tokenId || order.id}
                          </td>
                          <td className="p-3.5">
                            {isDelivered ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px] uppercase border border-emerald-300">
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Delivered</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[10px] uppercase">
                                {order.status}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-banhmi-dark">{order.customer.name}</div>
                            <div className="text-[11px] font-mono text-black/50">{order.customer.phone}</div>
                          </td>
                          <td className="p-3.5 max-w-xs truncate text-[11px] text-banhmi-dark/80" title={itemsSummary}>
                            {itemsSummary}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-banhmi-dark">
                            ₹{order.total.toFixed(0)}
                            <span className="text-[10px] block text-black/50 font-normal">{order.paymentMethod}</span>
                          </td>
                          <td className="p-3.5 font-mono text-xs">
                            {order.riderName ? (
                              <div className="font-bold text-[#4A2818] flex items-center space-x-1">
                                <Bike className="w-3 h-3 text-emerald-600 inline" />
                                <span>{order.riderName}</span>
                              </div>
                            ) : (
                              <span className="text-black/40 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono font-black text-emerald-800 text-sm">
                            {order.deliveryOtp || '4829'}
                          </td>

                          {/* Customer Rating & Feedback Column */}
                          <td className="p-3.5 max-w-xs">
                            {order.rating ? (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-[10px] flex items-center space-x-1 border border-amber-300">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                    <span>{order.rating} / 5</span>
                                  </span>
                                </div>
                                {order.feedbackTags && order.feedbackTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {order.feedbackTags.slice(0, 2).map((t, idx) => (
                                      <span key={idx} className="text-[9px] font-mono bg-cream-100 text-banhmi-dark px-1.5 py-0.2 rounded border border-cream-300">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {order.feedbackNote && (
                                  <p className="text-[10px] text-banhmi-dark/80 italic truncate font-sans" title={order.feedbackNote}>
                                    &ldquo;{order.feedbackNote}&rdquo;
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-black/30 italic">Awaiting review</span>
                            )}
                          </td>

                          <td className="p-3.5 font-mono text-[11px] text-black/60">
                            {order.deliveredAt
                              ? new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : (isDelivered ? 'Verified' : '—')}
                          </td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => setPreviewBillOrder(order)}
                              className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-banhmi-dark transition-colors cursor-pointer"
                              title="View Tax Invoice Bill"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB B: LIVE KITCHEN KDS (24-Hour Active Cooking & Dispatch Cycle) */}
      {/* --------------------------------------------------------------------- */}
      {adminActiveTab === 'kds' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
          {/* Filter Bar with 24-Hour Cycle Switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-banhmi-gold/40 shadow-warm-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-black/50 font-bold mr-1">Status:</span>
              {[
                { id: 'all', label: `All (${kdsCycleOrders.length})` },
                { id: 'new', label: `New (${kdsCycleOrders.filter((o) => o.status === 'new').length})` },
                { id: 'preparing', label: `Cooking (${kdsCycleOrders.filter((o) => o.status === 'preparing').length})` },
                { id: 'ready', label: `Ready (${kdsCycleOrders.filter((o) => o.status === 'ready').length})` },
                { id: 'delivering', label: `Courier (${kdsCycleOrders.filter((o) => o.status === 'delivering').length})` },
                { id: 'completed', label: `✓ Delivered (${kdsCycleOrders.filter((o) => o.status === 'completed').length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#4A2818] text-white shadow-xs'
                      : 'bg-cream-100 hover:bg-cream-200 text-banhmi-dark border border-cream-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* 24-Hour Cycle Toggle */}
              <div className="flex items-center bg-cream-100 p-1 rounded-xl border border-cream-300">
                <button
                  type="button"
                  onClick={() => setKdsTimeCycle('24h')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    kdsTimeCycle === '24h'
                      ? 'bg-[#4A2818] text-white shadow-xs'
                      : 'text-banhmi-dark/70 hover:text-banhmi-dark'
                  }`}
                >
                  24h Cycle
                </button>
                <button
                  type="button"
                  onClick={() => setKdsTimeCycle('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    kdsTimeCycle === 'all'
                      ? 'bg-[#4A2818] text-white shadow-xs'
                      : 'text-banhmi-dark/70 hover:text-banhmi-dark'
                  }`}
                >
                  All Active
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter order tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-1.5 pl-8 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                />
                <Search className="w-3.5 h-3.5 text-black/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={addDemoOrder}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Test Ticket</span>
              </button>
            </div>
          </div>

          {/* Kitchen Order Cards Grid with Visible Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredKdsOrders.map((order) => {
              const isDelivered = order.status === 'completed';
              const isNew = order.status === 'new';
              const isPreparing = order.status === 'preparing';
              const isReady = order.status === 'ready';
              const isDelivering = order.status === 'delivering';

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                    isDelivered
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-warm-md'
                      : isNew
                      ? 'border-rose-400 shadow-warm-lg ring-2 ring-rose-200'
                      : 'border-banhmi-gold/40 shadow-warm-md'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-banhmi-red text-xl">
                          #{order.tokenId || order.id}
                        </span>
                        <span className="text-[10px] font-mono text-black/50">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* GREEN TICK MARK WHEN DELIVERED */}
                      {isDelivered ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-mono font-black uppercase flex items-center space-x-1.5 shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>✓ DELIVERED</span>
                        </span>
                      ) : (
                        <span
                          className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase ${
                            isNew
                              ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                              : isPreparing
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isReady
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-orange-100 text-orange-900 border border-orange-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      )}
                    </div>

                    {/* Customer Header */}
                    <div className="mt-2 text-xs">
                      <div className="font-bold text-banhmi-dark flex items-center justify-between">
                        <span>{order.customer.name}</span>
                        <span className="font-mono text-black/60">{order.customer.phone}</span>
                      </div>
                      {order.deliveryMethod === 'delivery' ? (
                        <p className="text-[11px] font-mono text-black/60 truncate mt-0.5">
                          {order.customer.address || 'Delivery Order'}
                        </p>
                      ) : (
                        <p className="text-[11px] font-mono text-purple-700 font-bold mt-0.5">
                          Store Pickup
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 py-3 border-y border-cream-200 font-mono text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between">
                        <span className="font-bold text-banhmi-dark">
                          <span className="text-banhmi-red mr-1.5">{item.quantity}x</span>
                          {item.menuItem.name}
                        </span>
                        <span className="text-black/50 text-[11px]">
                          ₹{(item.itemTotal || item.menuItem.priceNumber * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}

                    {order.customer.deliveryInstructions && (
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-950 text-[11px] border border-amber-200">
                        <strong>Note:</strong> {order.customer.deliveryInstructions}
                      </div>
                    )}
                  </div>

                  {/* Customer Rating & Feedback Box in KDS Card */}
                  {order.rating && (
                    <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs font-mono space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-amber-900 font-bold">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>Customer Rating: {order.rating} / 5</span>
                        </span>
                        <span className="text-[9px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded uppercase font-black">
                          Verified Review
                        </span>
                      </div>

                      {order.feedbackTags && order.feedbackTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {order.feedbackTags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[10px] text-amber-900 font-semibold shadow-xs"
                            >
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {order.feedbackNote && (
                        <p className="text-[11px] font-sans text-amber-950 italic pt-0.5 leading-snug">
                          &ldquo;{order.feedbackNote}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rider & OTP Info */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between text-black/70">
                      <span>Total: <strong className="text-banhmi-dark">₹{order.total.toFixed(0)}</strong> ({order.paymentMethod})</span>
                      {order.deliveryOtp && (
                        <span className="text-emerald-800 font-bold">OTP: {order.deliveryOtp}</span>
                      )}
                    </div>

                    {order.riderName && (
                      <div className="text-[11px] text-emerald-800 font-bold flex items-center space-x-1">
                        <Bike className="w-3 h-3" />
                        <span>Rider: {order.riderName} ({order.riderPhone})</span>
                      </div>
                    )}
                  </div>

                  {/* Action Workflow Buttons */}
                  <div className="space-y-2 pt-1">
                    {isNew && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Start Cooking (Preparing)
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Mark Ready & Packed
                      </button>
                    )}

                    {isReady && order.deliveryMethod === 'delivery' && (
                      <button
                        type="button"
                        onClick={() => {
                          setDispatchModalOrder(order);
                          setSelectedAgentId(deliveryAgents[0]?.id || 'custom');
                        }}
                        className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Assign Rider & Dispatch</span>
                      </button>
                    )}

                    {isReady && order.deliveryMethod === 'pickup' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Customer Picked Up (Complete)
                      </button>
                    )}

                    {isDelivering && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          Manual Complete
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setPreviewBillOrder(order)}
                        className="text-[11px] font-mono text-[#4A2818] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Bill</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOrder(order.id)}
                        className="text-[11px] font-mono text-rose-600 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 1: ASSIGN DELIVERY RIDER MODAL */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {dispatchModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Bike className="w-5 h-5 text-[#4A2818]" />
                  <h3 className="font-display text-xl uppercase font-bold text-banhmi-dark">
                    Assign Delivery Rider
                  </h3>
                </div>
                <button
                  onClick={() => setDispatchModalOrder(null)}
                  className="p-1 text-black/40 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmDispatch} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    Select Registered Partner:
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  >
                    {deliveryAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} (+91 {agent.phone}) — {agent.ordersDeliveredCount} delivered
                      </option>
                    ))}
                    <option value="custom">+ Enter Custom Rider</option>
                  </select>
                </div>

                {selectedAgentId === 'custom' && (
                  <div className="space-y-3 p-3 rounded-2xl bg-cream-50 border border-cream-200">
                    <input
                      type="text"
                      placeholder="Rider Full Name"
                      value={customRiderName}
                      onChange={(e) => setCustomRiderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs font-mono"
                    />
                    <input
                      type="tel"
                      placeholder="10-Digit Mobile Number"
                      value={customRiderPhone}
                      onChange={(e) => setCustomRiderPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs font-mono"
                    />
                  </div>
                )}

                {dispatchError && (
                  <div className="text-xs font-mono text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {dispatchError}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOrder(null)}
                    className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase transition-colors shadow-sm cursor-pointer"
                  >
                    Dispatch Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 2: REGISTER NEW DELIVERY AGENT IN SUPABASE */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display text-xl uppercase font-bold text-banhmi-dark">
                    Register Delivery Partner (Database)
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddAgentModal(false)}
                  className="p-1 text-black/40 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDeliveryAgent} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    Partner Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    10-Digit Mobile Number (Login ID):
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={newAgentPhone}
                    onChange={(e) => setNewAgentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    Vehicle Type:
                  </label>
                  <select
                    value={newAgentVehicle}
                    onChange={(e) => setNewAgentVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  >
                    <option value="Electric Bike">Electric Bike (EV)</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>

                {addAgentError && (
                  <div className="text-xs font-mono text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {addAgentError}
                  </div>
                )}

                {addAgentSuccess && (
                  <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    {addAgentSuccess}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAgentModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAgent}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingAgent ? 'Saving to Database...' : 'Save Partner'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 3: CHANGE KITCHEN ADMIN PIN */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {showChangeKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-600" />
                  <h3 className="font-display text-xl uppercase font-bold text-banhmi-dark">
                    Update Kitchen PIN
                  </h3>
                </div>
                <button
                  onClick={() => setShowChangeKeyModal(false)}
                  className="p-1 text-black/40 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangeKeySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    New PIN (min 4 digits):
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new PIN..."
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-center text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-black/60 font-bold block mb-1">
                    Confirm New PIN:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new PIN..."
                    value={confirmKeyInput}
                    onChange={(e) => setConfirmKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-mono text-center text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                  />
                </div>

                {changeKeyError && (
                  <div className="text-xs font-mono text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {changeKeyError}
                  </div>
                )}

                {changeKeySuccess && (
                  <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    {changeKeySuccess}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangeKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingKey}
                    className="flex-1 py-2.5 rounded-xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingKey ? 'Saving...' : 'Update PIN'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 4: THERMAL BILL RECEIPT PREVIEW */}
      {/* --------------------------------------------------------------------- */}
      {previewBillOrder && (
        <BillModal
          order={previewBillOrder}
          isOpen={!!previewBillOrder}
          onClose={() => setPreviewBillOrder(null)}
        />
      )}
    </div>
  );
}
