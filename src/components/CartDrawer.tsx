'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, Sparkles, ShieldCheck } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { CAFE_INFO } from '@/data/cafeData';

export default function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    setCheckoutModalOpen,
  } = useOrder();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const deliveryFee = deliveryMethod === 'delivery' ? CAFE_INFO.deliveryFee : 0;
  const freeDeliveryRemaining = Math.max(0, CAFE_INFO.freeDeliveryThreshold - cartSubtotal);
  const isFreeDelivery = freeDeliveryRemaining === 0 && deliveryMethod === 'delivery';
  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const estimatedTotal = cartSubtotal + effectiveDeliveryFee;

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            className="absolute inset-0 bg-espresso-950/70 backdrop-blur-sm"
          />

          {/* Drawer Right Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FCFAF6] shadow-2xl border-l border-cream-300 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-cream-200 bg-cream-100/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-espresso-900 text-amberGold-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-espresso-950 font-normal">
                        Your Culinary Order
                      </h3>
                      <span className="text-xs font-mono text-espresso-500">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-2 rounded-full text-espresso-500 hover:text-espresso-950 hover:bg-cream-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Delivery / Pickup Switch */}
                <div className="grid grid-cols-2 gap-2 mt-5 p-1 rounded-xl bg-cream-200/80 border border-cream-300 font-mono text-xs">
                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'bg-espresso-900 text-cream-50 font-semibold shadow-sm'
                        : 'text-espresso-700 hover:text-espresso-950'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Delivery (25-35m)</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'bg-espresso-900 text-cream-50 font-semibold shadow-sm'
                        : 'text-espresso-700 hover:text-espresso-950'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Studio Pickup (15m)</span>
                  </button>
                </div>

                {/* Free Delivery Bar */}
                {deliveryMethod === 'delivery' && (
                  <div className="mt-3 text-[11px] font-mono text-espresso-600 bg-white/70 p-2.5 rounded-lg border border-cream-300/80">
                    {freeDeliveryRemaining > 0 ? (
                      <div>
                        <span>Add </span>
                        <strong className="text-amberGold-600 font-bold">${freeDeliveryRemaining.toFixed(2)}</strong>
                        <span> more for free thermal packaging & delivery!</span>
                      </div>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-amberGold-500 inline mr-1" />
                        You unlocked free studio delivery!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-espresso-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-espresso-950">Your order is empty</h4>
                      <p className="text-xs text-espresso-600 mt-1 max-w-xs">
                        Explore our single-origin roasts, 72-hour pastries, and culinary plates.
                      </p>
                    </div>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-espresso-900 text-cream-50 text-xs font-mono uppercase tracking-wider hover:bg-espresso-800"
                    >
                      Browse Studio Menu
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white border border-cream-300 shadow-warm-sm flex items-start space-x-4"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-base font-semibold text-espresso-950 truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="font-serif text-sm font-bold text-espresso-950 ml-2">
                            ${item.itemTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Custom Options Display */}
                        {item.selectedOptions && Object.values(item.selectedOptions).some(Boolean) && (
                          <div className="text-[10px] font-mono text-espresso-500 mt-0.5 space-y-0.5 truncate">
                            {item.selectedOptions.milk && <span>• {item.selectedOptions.milk}</span>}
                            {item.selectedOptions.temperature && <span> • {item.selectedOptions.temperature}</span>}
                            {item.selectedOptions.sweetness && <span> • {item.selectedOptions.sweetness}</span>}
                            {item.selectedOptions.portion && <span> • {item.selectedOptions.portion}</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-cream-100">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-cream-100 rounded-lg p-1 border border-cream-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded text-espresso-700 hover:bg-cream-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-1.5 text-espresso-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded text-espresso-700 hover:bg-cream-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-espresso-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-cream-200 bg-cream-100/60 space-y-4">
                  <div className="space-y-1.5 font-mono text-xs text-espresso-700">
                    <div className="flex justify-between">
                      <span className="text-espresso-500">Subtotal</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-espresso-500">
                        {deliveryMethod === 'delivery' ? 'Thermal Delivery' : 'Pickup'}
                      </span>
                      <span>
                        {effectiveDeliveryFee === 0 ? (
                          <span className="text-emerald-700 font-bold">FREE</span>
                        ) : (
                          `$${effectiveDeliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-cream-300 text-sm font-bold text-espresso-950 font-serif">
                      <span>Estimated Total</span>
                      <span>${estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-full bg-espresso-900 hover:bg-espresso-800 text-cream-50 font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-warm-md flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-amberGold-400" />
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-espresso-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-amberGold-500" />
                    <span>Instant kitchen ticket & live order tracking</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
