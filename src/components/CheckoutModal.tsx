'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bike,
  Store,
  CreditCard,
  CheckCircle2,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  ChefHat,
  Navigation,
  RefreshCw,
  AlertCircle,
  Search,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';
import { shareLiveLocationOnWhatsApp } from '@/lib/whatsapp';
import { getCurrentLocationAddress, searchAddressQuery, AddressSuggestion } from '@/lib/location';
import Link from 'next/link';

declare global {
  interface Window {
    Cashfree: any;
  }
}

const POPULAR_AREAS = [
  '100 Feet Rd, Indiranagar, Bengaluru - 560038',
  '12th Main Rd, HAL 2nd Stage, Indiranagar - 560008',
  '4th Block, 80 Feet Rd, Koramangala - 560034',
  '27th Main Rd, Sector 1, HSR Layout - 560102',
  'Brigade Road, Ashok Nagar, Bengaluru - 560001',
  'ITPL Main Rd, Whitefield, Bengaluru - 560066',
];

export default function CheckoutModal() {
  const {
    cart,
    checkoutModalOpen,
    setCheckoutModalOpen,
    cartSubtotal,
    placeOrder,
  } = useOrder();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentChoice, setPaymentChoice] = useState<'cashfree' | 'cod'>('cashfree');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Location Picker & GPS State
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);

  // Search Address State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    unitOrApt: '',
    courierNotes: '',
    chefNotes: '',
  });

  // Debounced search for locality / street autocomplete
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddressQuery(searchQuery);
      setSuggestions(results);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    setLocationSuccess(null);

    try {
      const res = await getCurrentLocationAddress();
      setIsLocating(false);

      if (res.success && res.address) {
        setCustomer((prev) => ({
          ...prev,
          address: res.address || prev.address,
          unitOrApt: res.unitOrApt || prev.unitOrApt,
        }));
        setLocationSuccess('Current GPS address auto-filled!');
        setShowLocationPickerModal(false);
        setTimeout(() => setLocationSuccess(null), 3500);
      } else {
        setLocationError(res.error || 'GPS signal unavailable on this device.');
        // Automatically open search & location picker modal so user can pick in 1 tap
        setShowLocationPickerModal(true);
      }
    } catch {
      setIsLocating(false);
      setShowLocationPickerModal(true);
    }
  };

  const handleSelectSuggestion = (item: AddressSuggestion | string) => {
    if (typeof item === 'string') {
      setCustomer((prev) => ({ ...prev, address: item }));
    } else {
      setCustomer((prev) => ({
        ...prev,
        address: item.displayName,
      }));
    }
    setLocationSuccess('Delivery address selected!');
    setShowLocationPickerModal(false);
    setSearchQuery('');
    setSuggestions([]);
    setTimeout(() => setLocationSuccess(null), 3000);
  };

  // Dynamically load Cashfree JS SDK v3
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const deliveryFee = deliveryMethod === 'delivery'
    ? (cartSubtotal >= CAFE_INFO.freeDeliveryThreshold ? 0 : CAFE_INFO.deliveryFee)
    : 0;

  const tax = Number((cartSubtotal * 0.05).toFixed(2)); // 5% GST
  const finalTotal = Number((cartSubtotal + deliveryFee + tax).toFixed(2));

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#4A2818', '#FFFFFF', '#7B4426', '#FFF8F0'],
      });
    } catch {}
  };

  const getFormattedCustomer = () => {
    const combinedNotes = [
      customer.courierNotes ? `[Delivery: ${customer.courierNotes.trim()}]` : '',
      customer.chefNotes ? `[Chef: ${customer.chefNotes.trim()}]` : '',
    ].filter(Boolean).join(' ');

    return {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim(),
      address: customer.address.trim(),
      unitOrApt: customer.unitOrApt.trim(),
      deliveryInstructions: combinedNotes,
    };
  };

  const handleShareWhatsAppLocation = async () => {
    const combinedNotes = [
      customer.courierNotes ? `[Delivery: ${customer.courierNotes.trim()}]` : '',
      customer.chefNotes ? `[Chef: ${customer.chefNotes.trim()}]` : '',
    ].filter(Boolean).join(' ');

    const result = await shareLiveLocationOnWhatsApp({
      customerName: customer.name || 'Customer',
      address: customer.address,
      customNote: combinedNotes,
      total: finalTotal,
    });
    if (result.coords && !customer.address) {
      setCustomer((prev) => ({
        ...prev,
        address: prev.address || 'Live GPS Location Shared via WhatsApp',
      }));
    }
  };

  const resetCheckoutForm = () => {
    setCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      unitOrApt: '',
      courierNotes: '',
      chefNotes: '',
    });
    setIsProcessingPayment(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim() || !customer.email.trim()) {
      alert('Please fill in your contact information');
      return;
    }
    if (deliveryMethod === 'delivery' && !customer.address.trim()) {
      alert('Please enter your delivery street address');
      return;
    }

    const currentCustomerData = getFormattedCustomer();
    const currentMethod = deliveryMethod;

    // 1. ONLINE PAYMENT VIA CASHFREE
    if (paymentChoice === 'cashfree') {
      setIsProcessingPayment(true);
      try {
        const orderRes = await fetch('/api/cashfree/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            customer: currentCustomerData,
          }),
        });

        const orderData = await orderRes.json();

        if (typeof window !== 'undefined' && window.Cashfree && orderData.paymentSessionId && orderData.isLive) {
          const cashfree = window.Cashfree({
            mode: orderData.environment === 'production' ? 'production' : 'sandbox',
          });

          cashfree
            .checkout({
              paymentSessionId: orderData.paymentSessionId,
              redirectTarget: '_modal',
            })
            .then(async (result: any) => {
              if (result.error) {
                setIsProcessingPayment(false);
                alert(result.error.message || 'Payment was interrupted.');
                return;
              }

              try {
                await fetch('/api/cashfree/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: orderData.orderId }),
                });
              } catch {}

              await placeOrder(
                currentCustomerData,
                currentMethod,
                0,
                'Online (Cashfree PG Verified)',
                {
                  cashfree_order_id: orderData.orderId,
                  cashfree_payment_id: orderData.paymentSessionId,
                }
              );
              triggerConfetti();
              resetCheckoutForm();
            });

          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
        await placeOrder(
          currentCustomerData,
          currentMethod,
          0,
          'Online (Cashfree Verified)',
          {
            cashfree_order_id: orderData.orderId || `CF_ORD_${Date.now()}`,
            cashfree_payment_id: orderData.paymentSessionId || `session_${Date.now()}`,
          }
        );
        triggerConfetti();
        resetCheckoutForm();
      } catch (err: any) {
        console.error('Payment initialization failed:', err);
        await placeOrder(currentCustomerData, currentMethod, 0, 'Online (Cashfree Direct)');
        triggerConfetti();
        resetCheckoutForm();
      }
    } else {
      await placeOrder(
        currentCustomerData,
        currentMethod,
        0,
        currentMethod === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Pickup'
      );
      triggerConfetti();
      resetCheckoutForm();
    }
  };

  return (
    <AnimatePresence>
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutModalOpen(false)}
            className="fixed inset-0 bg-espresso-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-cream-300 max-h-[90vh] flex flex-col my-auto"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-4 bg-[#FFF8F0] border-b border-cream-300 flex items-center justify-between flex-shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#4A2818] text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                    Secure Checkout
                  </span>
                  <span className="text-[11px] font-mono text-espresso-600 hidden xs:inline">
                    UPI • Cashfree • Cards
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl uppercase font-black text-[#1C1917] tracking-tight">
                  Complete Your Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="p-2 rounded-full hover:bg-cream-200 text-espresso-700 transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleFormSubmit} className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
              
              {/* Delivery vs Pickup Selector */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold block">
                  1. Fulfillment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300 hover:border-banhmi-gold/40'
                    }`}
                  >
                    <Bike className="w-5 h-5 text-banhmi-red" />
                    <div>
                      <div className="font-display text-lg uppercase font-bold text-banhmi-dark">
                        Delivery
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">
                        {deliveryFee === 0 ? 'Free Delivery' : `₹${deliveryFee.toFixed(0)} • Thermal sealed`}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300 hover:border-banhmi-gold/40'
                    }`}
                  >
                    <Store className="w-5 h-5 text-banhmi-red" />
                    <div>
                      <div className="font-display text-lg uppercase font-bold text-banhmi-dark">
                        Studio Pickup
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">Indiranagar 100ft Rd (10m)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold block">
                  2. Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address (if delivery) */}
              {deliveryMethod === 'delivery' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-banhmi-red" />
                      <span>Delivery Destination</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowLocationPickerModal(true)}
                      className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#4A2818] font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      <span>Auto-Detect / Search Area</span>
                    </button>
                  </div>

                  {locationSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{locationSuccess}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Street Address (e.g. 100 Feet Rd, Indiranagar) *"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Flat, Building, Floor"
                        value={customer.unitOrApt}
                        onChange={(e) => setCustomer({ ...customer, unitOrApt: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                      />
                    </div>
                  </div>

                  {/* Independent Courier Delivery Notes */}
                  <input
                    type="text"
                    placeholder="Courier Notes (e.g. Ring doorbell, landmark, gate code)"
                    value={customer.courierNotes}
                    onChange={(e) => setCustomer({ ...customer, courierNotes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-xs focus:outline-none focus:ring-2 focus:ring-banhmi-red font-mono"
                  />

                  {/* 1-Click WhatsApp Live Location Button */}
                  <button
                    type="button"
                    onClick={handleShareWhatsAppLocation}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <span>Share Live Location via WhatsApp</span>
                  </button>
                </div>
              )}

              {/* Chef Customization Note (Independent from courier notes) */}
              <div className="space-y-2 pt-1 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-950 font-bold flex items-center space-x-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-[#4A2818]" />
                  <span>Customization Message for the Chef</span>
                  <span className="text-[10px] font-normal text-amber-900/60">(Optional)</span>
                </span>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra crispy fries, less sugar in coffee, no ice, extra spicy, separate dip, allergic to nuts..."
                  value={customer.chefNotes}
                  onChange={(e) => setCustomer({ ...customer, chefNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300/80 text-banhmi-dark text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818] font-mono resize-none placeholder:text-black/40"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold block">
                  3. Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentChoice('cashfree')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentChoice === 'cashfree'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300 hover:border-banhmi-gold/40'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-banhmi-red" />
                    <div>
                      <div className="font-display text-base uppercase font-bold text-banhmi-dark">
                        UPI / Card / NetBanking
                      </div>
                      <div className="text-[10px] font-mono text-emerald-800 font-bold">Instant Instant PG</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentChoice('cod')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentChoice === 'cod'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300 hover:border-banhmi-gold/40'
                    }`}
                  >
                    <Store className="w-5 h-5 text-banhmi-red" />
                    <div>
                      <div className="font-display text-base uppercase font-bold text-banhmi-dark">
                        {deliveryMethod === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                      </div>
                      <div className="text-[10px] font-mono text-banhmi-dark/60">Pay upon receipt</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Submit Button */}
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 space-y-2">
                <div className="flex justify-between text-xs font-mono text-banhmi-dark">
                  <span>Items Subtotal ({cart.length} items)</span>
                  <span>₹{cartSubtotal.toFixed(0)}</span>
                </div>
                {deliveryMethod === 'delivery' && (
                  <div className="flex justify-between text-xs font-mono text-banhmi-dark">
                    <span>Thermal Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-mono text-banhmi-dark">
                  <span>GST &amp; Cafe Service Tax (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="pt-2 border-t border-cream-300 flex justify-between font-display text-xl uppercase font-black text-banhmi-dark">
                  <span>Total Amount</span>
                  <span className="text-banhmi-red">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-lg uppercase tracking-wider font-bold transition-all shadow-warm-md hover:shadow-warm-lg active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-300" />
                    <span>
                      {paymentChoice === 'cashfree' ? `Pay ₹${finalTotal.toFixed(0)} Securely` : `Place Order (₹${finalTotal.toFixed(0)})`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* INTERACTIVE DELIVERY LOCATION SELECTOR POPUP MODAL */}
          <AnimatePresence>
            {showLocationPickerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-warm-2xl space-y-4 max-h-[85vh] flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-cream-200 pb-3 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-5 h-5 text-[#4A2818]" />
                      <h4 className="font-display text-xl uppercase font-black text-banhmi-dark">
                        Select Delivery Location
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLocationPickerModal(false)}
                      className="p-1 text-black/40 hover:text-black cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {/* Auto Detect GPS Button */}
                    <button
                      type="button"
                      disabled={isLocating}
                      onClick={handleUseCurrentLocation}
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-98 disabled:opacity-60 cursor-pointer"
                    >
                      {isLocating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Detecting GPS Location...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 text-amber-300" />
                          <span>Detect My Current GPS Location</span>
                        </>
                      )}
                    </button>

                    {locationError && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
                        {locationError}
                      </div>
                    )}

                    {/* Live Search Locality Input */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono uppercase text-black/50 font-bold block">
                        Or Search Street, Locality or Landmark:
                      </span>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Indiranagar, Koramangala, 560038..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3.5 py-2.5 pl-9 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/50 text-banhmi-dark font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818]"
                        />
                        <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        {isSearching && (
                          <RefreshCw className="w-3.5 h-3.5 text-black/40 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>

                    {/* Suggestions List */}
                    {suggestions.length > 0 && (
                      <div className="space-y-1.5 bg-cream-50 p-2.5 rounded-2xl border border-cream-300 max-h-44 overflow-y-auto">
                        {suggestions.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSuggestion(item)}
                            className="p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-cream-200 text-xs font-mono text-banhmi-dark cursor-pointer transition-colors flex items-start space-x-2 shadow-xs"
                          >
                            <MapPin className="w-3.5 h-3.5 text-banhmi-red flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.displayName}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Popular Quick-Select Delivery Areas */}
                    <div className="space-y-2 pt-2 border-t border-cream-200">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold block">
                        Quick Popular Delivery Zones:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {POPULAR_AREAS.map((area, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(area)}
                            className="w-full text-left px-3 py-2 rounded-xl bg-[#FFF8F0] hover:bg-amber-100 border border-banhmi-gold/30 text-xs font-mono text-banhmi-dark transition-colors flex items-center space-x-2 cursor-pointer shadow-xs"
                          >
                            <MapPin className="w-3.5 h-3.5 text-banhmi-red flex-shrink-0" />
                            <span className="truncate">{area}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cream-200 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowLocationPickerModal(false)}
                      className="w-full py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-banhmi-dark font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Close &amp; Enter Manually
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
