'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    date: '2026-08-27',
    time: '10:30 AM',
    guests: '2 Guests',
    seating: 'Sunlit Courtyard',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '10:30 AM', '11:30 AM',
    '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'
  ];

  const seatingOptions = [
    { id: 'Sunlit Courtyard', label: 'Sunlit Courtyard', desc: 'Surrounded by olive trees & natural morning light' },
    { id: 'Travertine Espresso Bar', label: 'Espresso Bar', desc: 'Front-row sensory view of barista extractions' },
    { id: 'Library Nook', label: 'Library Nook', desc: 'Cozy velvet banquettes for intimate conversations' },
    { id: 'Window Terrace', label: 'Window Terrace', desc: 'Overlooking historic cobbled Mercer Street' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    // Trigger celebratory gold & warm confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D49226', '#1D1511', '#E6D7C2', '#D9683B'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleReset = () => {
    setStep('form');
    onClose();
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative w-full max-w-2xl bg-[#FCFAF6] rounded-2xl shadow-warm-xl border border-cream-300 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="relative px-6 sm:px-10 pt-8 pb-6 border-b border-cream-200 bg-cream-100/50 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-espresso-500 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amberGold-500 inline mr-1" />
                  Table Reservations
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-espresso-950 mt-1">
                  Atelier L’Ambre Dining Room
                </h3>
                <p className="text-xs sm:text-sm text-espresso-600 mt-1">
                  Reserve your sensory coffee & gastronomy experience in SoHo.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-espresso-500 hover:text-espresso-900 hover:bg-cream-200/80 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
                {/* Date & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-2">
                      <Calendar className="w-3.5 h-3.5 inline mr-1 text-espresso-500" />
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-cream-300 text-espresso-900 focus:outline-none focus:ring-2 focus:ring-espresso-800 text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-2">
                      <Users className="w-3.5 h-3.5 inline mr-1 text-espresso-500" />
                      Party Size
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-cream-300 text-espresso-900 focus:outline-none focus:ring-2 focus:ring-espresso-800 text-sm font-sans"
                    >
                      <option value="1 Guest">1 Guest (Solo Bar Experience)</option>
                      <option value="2 Guests">2 Guests (Intimate Table)</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4 Guests">4 Guests (Standard Dining)</option>
                      <option value="5-6 Guests">5–6 Guests (Courtyard Lounge)</option>
                      <option value="7+ Private Event">7+ Guests (Private Tasting Table)</option>
                    </select>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-2.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-espresso-500" />
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-2 px-3 text-xs rounded-lg font-mono transition-all duration-200 border ${
                          formData.time === time
                            ? 'bg-espresso-900 text-cream-50 border-espresso-900 shadow-sm'
                            : 'bg-white text-espresso-700 border-cream-300 hover:border-espresso-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Atmosphere */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-2.5">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-espresso-500" />
                    Seating Atmosphere
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {seatingOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, seating: opt.id })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.seating === opt.id
                            ? 'bg-cream-100/90 border-espresso-900 ring-1 ring-espresso-900 shadow-warm-sm'
                            : 'bg-white border-cream-300 hover:border-cream-400'
                        }`}
                      >
                        <div className="font-serif text-sm font-semibold text-espresso-950">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-espresso-600 mt-0.5 leading-snug">
                          {opt.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Genevieve Laurent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-cream-300 text-espresso-900 text-sm focus:outline-none focus:ring-2 focus:ring-espresso-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="genevieve@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-cream-300 text-espresso-900 text-sm focus:outline-none focus:ring-2 focus:ring-espresso-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-cream-300 text-espresso-900 text-sm focus:outline-none focus:ring-2 focus:ring-espresso-800"
                    />
                  </div>
                </div>

                {/* Dietary Notes */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Special Requests or Dietary Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Celebrating an anniversary / Gluten sensitivity / High chair needed"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-cream-300 text-espresso-900 text-sm focus:outline-none focus:ring-2 focus:ring-espresso-800"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-cream-200">
                  <span className="text-xs text-espresso-500">
                    Complimentary table hold for 15 minutes.
                  </span>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-cream-50 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-warm-md hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2"
                  >
                    <Coffee className="w-4 h-4 text-amberGold-400" />
                    <span>Confirm Reservation</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 sm:p-12 text-center flex flex-col items-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-espresso-500">
                    Reservation Confirmed
                  </span>
                  <h4 className="font-serif text-3xl text-espresso-950 mt-1">
                    We Look Forward to Welcoming You
                  </h4>
                  <p className="text-sm text-espresso-700 max-w-md mx-auto mt-2">
                    A confirmation email and SMS reminder have been sent to <span className="font-semibold">{formData.email || 'your email'}</span>.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="w-full max-w-md p-5 rounded-xl bg-cream-100/80 border border-cream-300 text-left text-xs font-mono space-y-2 text-espresso-800">
                  <div className="flex justify-between border-b border-cream-200 pb-1.5">
                    <span className="text-espresso-500">GUEST</span>
                    <span className="font-semibold">{formData.name || 'Genevieve Laurent'}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-200 pb-1.5">
                    <span className="text-espresso-500">DATE & TIME</span>
                    <span className="font-semibold">{formData.date} at {formData.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-cream-200 pb-1.5">
                    <span className="text-espresso-500">PARTY & SEATING</span>
                    <span className="font-semibold">{formData.guests} • {formData.seating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-espresso-500">VENUE</span>
                    <span className="font-semibold">Atelier L’Ambre SoHo</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-full bg-espresso-900 text-cream-50 text-xs uppercase tracking-widest font-semibold hover:bg-espresso-800 transition-colors shadow-warm-sm"
                >
                  Done & Return to Website
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
