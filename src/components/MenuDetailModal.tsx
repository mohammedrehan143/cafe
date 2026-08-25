'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coffee, Plus, Check, ShoppingBag } from 'lucide-react';
import { MenuItem } from '@/types/cafe';
import { useOrder } from '@/context/OrderContext';

interface MenuDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDetailModal({ item, isOpen, onClose }: MenuDetailModalProps) {
  const { addToCart } = useOrder();
  const [selectedMilk, setSelectedMilk] = useState<string>('');
  const [selectedTemp, setSelectedTemp] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [selectedPortion, setSelectedPortion] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const handleAddToCart = () => {
    const options = {
      milk: selectedMilk || item.customizationOptions?.milk?.[0],
      temperature: selectedTemp || item.customizationOptions?.temperature?.[0],
      sweetness: selectedSweetness || item.customizationOptions?.sweetness?.[0],
      portion: selectedPortion || item.customizationOptions?.portion?.[0],
    };
    addToCart(item, quantity, options);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-950/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative w-full max-w-3xl bg-[#FCFAF6] rounded-2xl shadow-warm-xl border border-cream-300 overflow-hidden z-10 my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-espresso-900/60 hover:bg-espresso-900 text-white backdrop-blur-md transition-colors"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* High-res Image Left */}
              <div className="relative h-64 md:h-full min-h-[300px] w-full bg-cream-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent md:hidden" />

                {item.signature && (
                  <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full flex items-center space-x-1 text-[11px] font-mono uppercase tracking-wider text-amberGold-600 border border-amberGold-500/30">
                    <Sparkles className="w-3 h-3 text-amberGold-500" />
                    <span>House Signature</span>
                  </div>
                )}
              </div>

              {/* Information Right */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-espresso-500">
                      {item.category.toUpperCase()} • PREP: {item.prepTime || '5m'}
                    </span>
                    <span className="font-serif text-2xl font-bold text-espresso-950">
                      {item.price}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-espresso-950 mt-1 font-normal leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-espresso-700 mt-3 leading-relaxed">
                    {item.detailedDescription || item.description}
                  </p>

                  {/* Customization Options */}
                  {item.customizationOptions && (
                    <div className="mt-4 pt-3 border-t border-cream-200 space-y-3">
                      {item.customizationOptions.milk && (
                        <div>
                          <label className="text-[10px] font-mono uppercase text-espresso-500 block mb-1">
                            Choice of Milk / Emulsion
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {item.customizationOptions.milk.map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setSelectedMilk(m)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                                  (selectedMilk || item.customizationOptions?.milk?.[0]) === m
                                    ? 'bg-espresso-900 text-cream-50 border-espresso-900 font-bold'
                                    : 'bg-white text-espresso-700 border-cream-300'
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.customizationOptions.temperature && (
                        <div>
                          <label className="text-[10px] font-mono uppercase text-espresso-500 block mb-1">
                            Serving Style
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {item.customizationOptions.temperature.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setSelectedTemp(t)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                                  (selectedTemp || item.customizationOptions?.temperature?.[0]) === t
                                    ? 'bg-espresso-900 text-cream-50 border-espresso-900 font-bold'
                                    : 'bg-white text-espresso-700 border-cream-300'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.customizationOptions.sweetness && (
                        <div>
                          <label className="text-[10px] font-mono uppercase text-espresso-500 block mb-1">
                            Sweetness Level
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {item.customizationOptions.sweetness.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setSelectedSweetness(s)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                                  (selectedSweetness || item.customizationOptions?.sweetness?.[0]) === s
                                    ? 'bg-espresso-900 text-cream-50 border-espresso-900 font-bold'
                                    : 'bg-white text-espresso-700 border-cream-300'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sommelier Pairing */}
                  {item.pairing && (
                    <div className="mt-4 p-3 rounded-xl bg-cream-100/70 border border-cream-300/60 flex items-start space-x-2.5">
                      <Coffee className="w-4 h-4 text-amberGold-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-espresso-800">
                        <span className="font-semibold block font-mono text-[10px] uppercase text-espresso-500">
                          Recommended Companion
                        </span>
                        <span>{item.pairing}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Add to Bag Action */}
                <div className="pt-4 border-t border-cream-200 flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center space-x-2 bg-cream-100 rounded-xl p-1.5 border border-cream-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-espresso-800"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-espresso-800"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-warm-md flex items-center justify-center space-x-2 ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-espresso-900 hover:bg-espresso-800 text-cream-50'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-amberGold-400" />
                        <span>Add to Order • ${(item.priceNumber * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
