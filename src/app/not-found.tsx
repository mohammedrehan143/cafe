import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1C1917] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-amber-300 shadow-warm-xl space-y-6">
        <h2 className="font-display text-4xl uppercase font-black text-[#4A2818]">
          404 - Page Not Found
        </h2>
        <p className="text-xs text-black/70">
          The requested page could not be located.
        </p>
        <Link
          href="/"
          className="inline-flex py-3 px-6 rounded-full bg-[#4A2818] text-white font-display text-sm uppercase tracking-wider font-bold items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
