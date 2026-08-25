'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ShieldCheck } from 'lucide-react';

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] flex items-center justify-center p-6 select-none font-sans">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-banhmi-gold/40 shadow-warm-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-banhmi-red flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-banhmi-red font-bold block">
            System Protected
          </span>
          <h2 className="font-display text-3xl sm:text-4xl uppercase font-black text-banhmi-dark">
            Page Protected
          </h2>
          <p className="text-xs sm:text-sm text-banhmi-dark/70">
            A temporary network or render anomaly was contained safely. Your order data remains secure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-full bg-cream-200 hover:bg-cream-300 text-banhmi-dark font-display text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
