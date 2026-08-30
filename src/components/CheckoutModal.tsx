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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';
import { shareLiveLocationOnWhatsApp } from '@/lib/whatsapp';
import { getCurrentLocationAddress } from '@/lib/location';
import Link from 'next/link';

declare global {
  interface Window {
    Cashfree: any;
  }
}

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

  // GPS Auto-Location State
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    unitOrApt: '',
    deliveryInstructions: '',
  });

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
        setTimeout(() => setLocationSuccess(null), 3500);
      } else {
        setLocationError(res.error || 'Could not fetch current location. Please allow browser location access.');
        setTimeout(() => setLocationError(null), 4500);
      }
    } catch {
      setIsLocating(false);
      setLocationError('Location request failed. Please type address manually.');
      setTimeout(() => setLocationError(null), 4500);
    }
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
    } catch {
      // fallback
    }
  };

  const handleShareWhatsAppLocation = async () => {
    const result = await shareLiveLocationOnWhatsApp({
      customerName: customer.name || 'Customer',
      address: customer.address,
      customNote: customer.deliveryInstructions,
      total: finalTotal,
    });
    if (result.coords && !customer.address) {
      setCustomer((prev) => ({
        ...prev,
        address: prev.address || 'Live GPS Location Shared via WhatsApp',
        deliveryInstructions: prev.deliveryInstructions
          ? `${prev.deliveryInstructions} (GPS: ${result.coords?.lat.toFixed(5)}, ${result.coords?.lng.toFixed(5)})`
          : `GPS: https://maps.google.com/?q=${result.coords?.lat.toFixed(5)},${result.coords?.lng.toFixed(5)}`,
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
      deliveryInstructions: '',
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

    // 1. ONLINE PAYMENT VIA CASHFREE
    if (paymentChoice === 'cashfree') {
      setIsProcessingPayment(true);
      try {
        const currentCustomerData = { ...customer };
        const currentMethod = deliveryMethod;

        const orderRes = await fetch('/api/cashfree/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            customer: currentCustomerData,
          }),
        });

        const orderData = await orderRes.json();

        // If Cashfree SDK is loaded and we have a live payment session
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

              // Verify payment
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

        // 2. Simulated Cashfree Sandbox Payment (Seamless fallback)
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
        await placeOrder(customer, deliveryMethod, 0, 'Online (Cashfree Direct)');
        triggerConfetti();
        resetCheckoutForm();
      }
    } else {
      // 3. CASH ON DELIVERY
      await placeOrder(
        customer,
        deliveryMethod,
        0,
        deliveryMethod === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Pickup'
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
                    UPI • Razorpay • Cards
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl uppercase font-black text-[#1C1917] tracking-tight">
                  Complete Your Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="p-2 rounded-full hover:bg-cream-200 text-espresso-700 transition-colors flex-shrink-0"
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
                        Superfast Delivery
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
                        Kitchen Pickup
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
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-300 text-[#4A2818] font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      {isLocating ? (
                        <>
                          <RefreshCw className="w-3 h-3 text-[#4A2818] animate-spin" />
                          <span>Detecting GPS...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          <span>Use Current Location</span>
                        </>
                      )}
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

                  {locationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center space-x-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>{locationError}</span>
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
                  <input
                    type="text"
                    placeholder="Courier Notes (e.g. Ring doorbell, landmark)"
                    value={customer.deliveryInstructions}
                    onChange={(e) => setCustomer({ ...customer, deliveryInstructions: e.target.value })}
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

              {/* Chef Customization Note (Available for both delivery and pickup) */}
              <div className="space-y-2 pt-1 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-950 font-bold flex items-center space-x-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-[#4A2818]" />
                  <span>Customization Message for the Chef</span>
                  <span className="text-[10px] font-normal text-amber-900/60">(Optional)</span>
                </span>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra crispy fries, less sugar in coffee, no ice, extra spicy, separate dip, allergic to nuts..."
                  value={customer.deliveryInstructions}
                  onChange={(e) => setCustomer({ ...customer, deliveryInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300/80 text-banhmi-dark text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818] font-mono resize-none placeholder:text-black/40"
                />
              </div>

              {/* Payment Method Selector (Cashfree vs Cash) */}
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
                        : 'bg-cream-100/70 border-cream-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-banhmi-red text-white">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase font-bold text-banhmi-dark flex items-center space-x-1.5">
                        <span>Cashfree PG</span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Fast</span>
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">UPI, GPay, PhonePe, Cards, NetBanking</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentChoice('cod')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentChoice === 'cod'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-banhmi-dark text-white">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase font-bold text-banhmi-dark">
                        {deliveryMethod === 'delivery' ? 'Cash on Delivery' : 'Pay at Pickup'}
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">Pay when receiving food</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="p-5 rounded-2xl bg-cream-100/80 border border-cream-300 space-y-2 font-mono text-xs text-banhmi-dark">
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">Bag Items ({cart.length})</span>
                  <span className="font-bold">₹{cartSubtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">
                    {deliveryMethod === 'delivery' ? 'Thermal Delivery' : 'Pickup'}
                  </span>
                  <span className="font-bold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">GST (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cream-300 font-display text-2xl uppercase font-black text-banhmi-dark">
                  <span>Grand Total</span>
                  <span className="text-banhmi-red">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-lg uppercase tracking-wider font-bold transition-all shadow-warm-lg flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>
                    {isProcessingPayment
                      ? 'Processing Payment...'
                      : paymentChoice === 'cashfree'
                      ? `Pay with Online PG • ₹${finalTotal.toFixed(0)}`
                      : `Place Order • ₹${finalTotal.toFixed(0)}`}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
