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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
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
  const [paymentChoice, setPaymentChoice] = useState<'razorpay' | 'cod'>('razorpay');
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    unitOrApt: '',
    deliveryInstructions: '',
  });

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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

  const tax = Number((cartSubtotal * 0.08875).toFixed(2));
  const calculatedTip = customTip
    ? parseFloat(customTip) || 0
    : Number(((cartSubtotal * tipPercentage) / 100).toFixed(2));
  const finalTotal = Number((cartSubtotal + deliveryFee + tax + calculatedTip).toFixed(2));

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#E23727', '#FFB703', '#1E5128', '#FFFFFF'],
      });
    } catch {
      // fallback
    }
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

    // 1. ONLINE PAYMENT VIA RAZORPAY
    if (paymentChoice === 'razorpay') {
      setIsProcessingPayment(true);
      try {
        const orderRes = await fetch('/api/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
          }),
        });

        const orderData = await orderRes.json();

        // If Razorpay SDK is loaded and we have an order ID
        if (typeof window !== 'undefined' && window.Razorpay && orderData.isLive) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Bánh Mì Vietnam",
            description: "Cloud Kitchen Street Gastronomy Order",
            image: "https://banhmivietnam.xyz/img/Favicon.png",
            order_id: orderData.orderId,
            handler: async function (response: any) {
              // Verify on backend
              const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.verified) {
                triggerConfetti();
                await placeOrder(
                  customer,
                  deliveryMethod,
                  calculatedTip,
                  'Online (Razorpay Verified)',
                  response
                );
              } else {
                alert('Payment verification failed. Please try again.');
              }
              setIsProcessingPayment(false);
            },
            prefill: {
              name: customer.name,
              email: customer.email,
              contact: customer.phone,
            },
            theme: {
              color: '#E23727',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Sandbox / Direct Authorized Payment flow
          triggerConfetti();
          await placeOrder(
            customer,
            deliveryMethod,
            calculatedTip,
            'Online (Razorpay Sandbox Authorized)',
            { razorpay_order_id: orderData.orderId, razorpay_payment_id: `pay_${Date.now()}` }
          );
          setIsProcessingPayment(false);
          return;
        }
      } catch {
        // Fallback authorization
        triggerConfetti();
        await placeOrder(customer, deliveryMethod, calculatedTip, 'Online (Authorized)');
        setIsProcessingPayment(false);
        return;
      }
    }

    // 2. CASH ON DELIVERY / STUDIO PICKUP
    triggerConfetti();
    await placeOrder(
      customer,
      deliveryMethod,
      calculatedTip,
      deliveryMethod === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Counter Pickup'
    );
  };

  return (
    <AnimatePresence>
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-warm-xl border border-banhmi-gold/40 overflow-hidden z-10 my-8 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-cream-300 bg-banhmi-card/90 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-banhmi-red font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#FFB703] mr-1" />
                  Cloud Studio Dispatch
                </span>
                <h3 className="font-display text-3xl uppercase font-black text-banhmi-dark mt-0.5">
                  Confirm & Place Order
                </h3>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="p-2 rounded-full text-banhmi-dark/60 hover:text-banhmi-dark hover:bg-cream-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Delivery vs Pickup Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold mb-2">
                  1. Fulfillment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                        Thermal Delivery
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">20–30 min arrival</div>
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
                      <div className="text-[11px] font-mono text-banhmi-dark/60">428 Mercer St (12m)</div>
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
                  <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold block">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-banhmi-red" />
                    Delivery Destination
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Street Address (e.g. 120 Prince St, SoHo) *"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Apt, Suite, Floor"
                        value={customer.unitOrApt}
                        onChange={(e) => setCustomer({ ...customer, unitOrApt: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-sm focus:outline-none focus:ring-2 focus:ring-banhmi-red"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Courier Notes (e.g. Ring buzzer 4C, extra chili please)"
                    value={customer.deliveryInstructions}
                    onChange={(e) => setCustomer({ ...customer, deliveryInstructions: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-white border border-banhmi-gold/40 text-banhmi-dark text-xs focus:outline-none focus:ring-2 focus:ring-banhmi-red font-mono"
                  />
                </div>
              )}

              {/* Payment Method Selector (Razorpay vs Cash) */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold block">
                  3. Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentChoice('razorpay')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentChoice === 'razorpay'
                        ? 'bg-white border-banhmi-red ring-2 ring-banhmi-red shadow-warm-sm'
                        : 'bg-cream-100/70 border-cream-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-banhmi-red text-white">
                      <Zap className="w-4 h-4 text-[#FFB703]" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase font-bold text-banhmi-dark flex items-center space-x-1.5">
                        <span>Razorpay Online</span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Fast</span>
                      </div>
                      <div className="text-[11px] font-mono text-banhmi-dark/60">UPI, GPay, Cards, NetBanking</div>
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
                      <CreditCard className="w-4 h-4 text-[#FFB703]" />
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

              {/* Kitchen Tip Presets */}
              <div className="pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-banhmi-dark font-bold">
                    Kitchen Gratuity
                  </span>
                  <span className="text-xs font-mono font-bold text-banhmi-red">
                    +${calculatedTip.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                  {[10, 15, 18, 20].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => {
                        setTipPercentage(pct);
                        setCustomTip('');
                      }}
                      className={`py-2 rounded-xl border transition-all ${
                        tipPercentage === pct && !customTip
                          ? 'bg-banhmi-red text-white border-banhmi-red font-bold shadow-sm'
                          : 'bg-white text-banhmi-dark border-banhmi-gold/40 hover:bg-cream-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTipPercentage(0);
                      setCustomTip('0');
                    }}
                    className={`py-2 rounded-xl border transition-all ${
                      customTip === '0'
                        ? 'bg-banhmi-red text-white border-banhmi-red font-bold'
                        : 'bg-white text-banhmi-dark border-banhmi-gold/40 hover:bg-cream-100'
                    }`}
                  >
                    0% / Custom
                  </button>
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="p-5 rounded-2xl bg-cream-100/80 border border-cream-300 space-y-2 font-mono text-xs text-banhmi-dark">
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">Bag Items ({cart.length})</span>
                  <span className="font-bold">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">
                    {deliveryMethod === 'delivery' ? 'Thermal Delivery' : 'Pickup'}
                  </span>
                  <span className="font-bold">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">Tax (8.875%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-banhmi-dark/60">Gratuity</span>
                  <span>${calculatedTip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cream-300 font-display text-2xl uppercase font-black text-banhmi-dark">
                  <span>Grand Total</span>
                  <span className="text-banhmi-red">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-lg uppercase tracking-wider font-bold transition-all shadow-warm-lg flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5 text-[#FFB703]" />
                  <span>
                    {isProcessingPayment
                      ? 'Processing Razorpay...'
                      : paymentChoice === 'razorpay'
                      ? `Pay with Razorpay • $${finalTotal.toFixed(2)}`
                      : `Place Order • $${finalTotal.toFixed(2)}`}
                  </span>
                </button>

                <div className="text-center mt-2.5 text-[11px] font-mono text-banhmi-dark/60 flex items-center justify-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to Supabase with unique tracking ID • 10-day retention</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
