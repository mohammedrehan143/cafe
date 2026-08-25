'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 sm:p-12 text-center bg-[#FFF8F0] rounded-3xl border border-banhmi-gold/30 shadow-warm-lg max-w-lg mx-auto my-12 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-banhmi-red flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl uppercase font-bold text-banhmi-dark">
            Something unexpected occurred
          </h3>
          <p className="text-xs sm:text-sm text-banhmi-dark/70 font-sans">
            Our cloud kitchen system caught a visual glitch. You can reload the section safely.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-2.5 rounded-full bg-banhmi-red hover:bg-banhmi-redDark text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-md inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
