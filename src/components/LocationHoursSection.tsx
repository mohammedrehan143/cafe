'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Navigation, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { CAFE_INFO } from '@/data/cafeData';

export default function LocationHoursSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CAFE_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="location" className="py-24 lg:py-36 bg-[#FCFAF6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-espresso-500">
              07 • Visit the Sanctuary
            </span>
            <span className="w-8 h-px bg-espresso-300" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-normal leading-[1.06]">
            Location & <span className="italic font-light text-espresso-700">Hours.</span>
          </h2>
        </div>

        {/* 2-Column Practical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Hours, Address & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Status Card */}
            <div className="p-6 rounded-2xl bg-[#F8F4EC] border border-cream-300 shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-cream-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-serif text-lg font-semibold text-espresso-950">
                    Open Today
                  </span>
                </div>
                <span className="text-xs font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                  Walk-ins Welcome
                </span>
              </div>

              {/* Hours Schedule */}
              <div className="space-y-3 font-mono text-xs text-espresso-800">
                <div className="flex justify-between">
                  <span className="text-espresso-500">MONDAY – FRIDAY</span>
                  <span className="font-semibold">{CAFE_INFO.hours.weekday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">SATURDAY – SUNDAY</span>
                  <span className="font-semibold">{CAFE_INFO.hours.weekend}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cream-200 text-[11px] text-espresso-500">
                  <span>KITCHEN & BRUNCH SERVICE</span>
                  <span>Until 4:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white border border-cream-300 shadow-warm-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-full bg-cream-200 text-espresso-900 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-espresso-950">
                      SoHo Historic District
                    </h4>
                    <p className="text-xs sm:text-sm text-espresso-700 mt-0.5">
                      {CAFE_INFO.address}
                    </p>
                    <span className="text-[11px] font-mono text-espresso-500 block mt-1">
                      Between Spring & Broome Streets
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="p-2 rounded-lg text-espresso-500 hover:text-espresso-900 hover:bg-cream-100 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {copied && (
                <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                  Address copied to clipboard!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-cream-50 font-mono text-xs uppercase tracking-wider text-center transition-colors shadow-warm-sm flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-amberGold-400" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${CAFE_INFO.phone}`}
                  className="py-3 px-4 rounded-xl bg-cream-100 hover:bg-cream-200 text-espresso-900 font-mono text-xs uppercase tracking-wider text-center transition-colors border border-cream-300 flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-espresso-600" />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Direct Inquiries */}
            <div className="p-4 rounded-xl bg-cream-100/60 border border-cream-200 flex items-center justify-between text-xs font-mono text-espresso-700">
              <span className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-espresso-500" />
                <span>{CAFE_INFO.email}</span>
              </span>
              <span className="text-espresso-500">Events & Press</span>
            </div>
          </div>

          {/* Right Column: Stylized Interactive Map Preview Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-warm-xl border border-cream-300 bg-cream-200">
              {/* Styled Map Graphic Background */}
              <iframe
                title="Atelier L'Ambre Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.635876356784!2d-73.99923832347313!3d40.72382607139148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598c19955555%3A0x1e860959f63ad49!2sMercer%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 filter grayscale contrast-125 opacity-85"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Pin Overlay Card */}
              <div className="absolute top-6 left-6 glass-panel p-4 rounded-2xl border border-cream-300 shadow-warm-lg max-w-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-espresso-900 text-amberGold-400 flex items-center justify-center font-serif font-bold text-sm">
                    L
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-espresso-950">
                      Atelier L’Ambre
                    </h5>
                    <p className="text-[10px] font-mono text-espresso-600">
                      428 Mercer St, SoHo
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-cream-200 flex items-center justify-between text-[10px] font-mono text-espresso-500">
                  <span>Valet & Street Parking</span>
                  <span className="text-amberGold-600 font-semibold">Subway: Prince St / Bway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
