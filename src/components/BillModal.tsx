'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Order } from '@/types/cafe';
import OriginalBillReceipt from './OriginalBillReceipt';

interface BillModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BillModal({ order, isOpen, onClose }: BillModalProps) {
  if (!order || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Soft Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* SINGLE CLEAN BILL BOX - Pure white receipt card with no nested containers or double borders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-200 max-h-[94vh] overflow-y-auto my-auto"
        >
          {/* Subtle Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Close Bill"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Clean Bill Content */}
          <div className="p-6 sm:p-8">
            <OriginalBillReceipt order={order} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
