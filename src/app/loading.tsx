import React from 'react';
import { Coffee, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] flex flex-col items-center justify-center p-6 select-none font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none -z-10" />

      <div className="text-center space-y-5 max-w-sm mx-auto">
        {/* Animated Coffee Cup & Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-[#4A2818] text-amber-200 flex items-center justify-center shadow-xl shadow-[#4A2818]/15 ring-8 ring-amber-100/60 animate-pulse">
            <Coffee className="w-10 h-10 stroke-[1.8]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-[#4A2818] flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Title & Status */}
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl uppercase font-black tracking-tight text-[#1C1917]">
            Zafiroo <span className="text-[#4A2818]">Cafe</span>
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#D4A373] font-bold">
            #TheTasteOfLove • Artisan Kitchen
          </p>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-48 h-1.5 bg-amber-100 rounded-full mx-auto overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#4A2818] via-[#D4A373] to-[#4A2818] rounded-full animate-[shimmer_1.5s_infinite_linear] w-full" />
        </div>

        <p className="text-xs text-[#1C1917]/60 font-medium">
          Brewing something fresh...
        </p>
      </div>
    </div>
  );
}
