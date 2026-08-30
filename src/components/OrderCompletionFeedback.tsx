'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  FileText,
  ShoppingBag,
  ArrowRight,
  Send,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { Order } from '@/types/cafe';
import { useOrder } from '@/context/OrderContext';

interface OrderCompletionFeedbackProps {
  order: Order;
  onViewBill?: () => void;
  onClose?: () => void;
}

export default function OrderCompletionFeedback({
  order,
  onViewBill,
  onClose,
}: OrderCompletionFeedbackProps) {
  const { submitOrderFeedback } = useOrder();

  const [rating, setRating] = useState<number>(order.rating || 5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(order.feedbackTags || []);
  const [feedbackNote, setFeedbackNote] = useState(order.feedbackNote || '');
  const [submitted, setSubmitted] = useState(Boolean(order.rating || order.feedbackNote));

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#10B981', '#F59E0B', '#E11D48', '#4A2818'],
      });
    } catch {}
  }, []);

  const feedbackTags = [
    'Hot & Fresh',
    'Super Fast Delivery',
    'Delicious Taste',
    'Eco Packaging',
    'Polite Courier',
    'Perfect Portions',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
      await submitOrderFeedback(
        order.id,
        rating,
        selectedTags,
        feedbackNote.trim()
      );
    } catch {}
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Exceptional! 5 Stars';
      case 4:
        return 'Really Good! 4 Stars';
      case 3:
        return 'Average Experience 3 Stars';
      case 2:
        return 'Needs Improvement 2 Stars';
      case 1:
        return 'Disappointed 1 Star';
      default:
        return 'Select a rating';
    }
  };

  const effectiveRating = hoveredRating || rating;
  const tokenDisplay = order.tokenId || order.trackingCode || order.id;

  return (
    <div className="w-full space-y-6 text-center py-2 selection:bg-[#4A2818] selection:text-white">
      {/* 1. THANK YOU CELEBRATION HERO ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        {/* Animated Badge */}
        <div className="relative inline-flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl"
          />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 text-white flex items-center justify-center shadow-warm-xl border-4 border-white ring-4 ring-emerald-100">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Thank You Typography */}
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-800 font-black block">
            Order Delivered &amp; Completed
          </span>
          <h2 className="font-display text-3xl sm:text-4xl uppercase font-black text-banhmi-dark tracking-tight">
            Thank You for Dining with Us!
          </h2>
          <p className="text-xs sm:text-sm text-banhmi-dark/70 font-sans max-w-md mx-auto leading-relaxed">
            Order <strong className="text-banhmi-red font-mono">#{tokenDisplay}</strong> was successfully fulfilled. We hope you loved every bite of your handcrafted meal.
          </p>
        </div>
      </motion.div>

      {/* 2. INTERACTIVE 5-STAR RATING & FEEDBACK FORM */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-7 border border-banhmi-gold/40 shadow-warm-md text-left space-y-5"
      >
        {!submitted ? (
          <form onSubmit={handleFeedbackSubmit} className="space-y-5">
            {/* Star Rating Section */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold block">
                How was your experience today?
              </span>

              {/* Star buttons */}
              <div className="flex items-center justify-center space-x-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= effectiveRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 sm:p-1.5 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono font-bold text-amber-900">
                {getRatingLabel(effectiveRating)}
              </div>
            </div>

            {/* Quick Compliment Tags */}
            <div className="space-y-2 pt-1 border-t border-cream-200">
              <span className="text-[11px] font-mono uppercase tracking-wider text-black/50 font-bold block text-center">
                What did you like most? (Optional)
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {feedbackTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#4A2818] text-white shadow-xs'
                          : 'bg-[#FFF8F0] hover:bg-cream-200 text-banhmi-dark border border-banhmi-gold/40'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Feedback Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-black/60 font-bold block">
                Additional Comments or Suggestions:
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Tell our chefs and delivery team what you loved or how we can make your next meal even better..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-banhmi-gold/40 text-banhmi-dark font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2818] placeholder:text-black/30 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-display text-base uppercase tracking-wider font-bold transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Submit Rating &amp; Feedback</span>
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-emerald-600 text-emerald-600" />
            </div>
            <h4 className="font-display text-2xl uppercase font-black text-banhmi-dark">
              Feedback Received!
            </h4>
            <p className="text-xs font-sans text-banhmi-dark/70 max-w-xs mx-auto">
              Thank you for rating your meal. Your feedback helps our kitchen and riders maintain artisan culinary standards.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 3. CONVENIENT POST-ORDER ACTIONS (VIEW RECEIPT OR ORDER AGAIN) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        {onViewBill && (
          <button
            type="button"
            onClick={onViewBill}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-[#4A2818] font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <FileText className="w-4 h-4 text-[#4A2818]" />
            <span>View &amp; Print Bill Receipt</span>
          </button>
        )}

        <Link
          href="/"
          onClick={onClose}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#4A2818] hover:bg-[#2E1509] text-white font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 text-center"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Order Again / Back to Menu</span>
        </Link>
      </div>
    </div>
  );
}
