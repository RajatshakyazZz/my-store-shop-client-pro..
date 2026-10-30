'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Mail, Download, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface MaintenanceGateProps {
  message?: string;
  storeName?: string;
  supportEmail?: string;
}

export default function MaintenanceGate({
  message = 'Our store is undergoing scheduled performance upgrades. We will be back online shortly!',
  storeName = 'ZTORE',
  supportEmail = 'ztoredigital@gmail.com',
}: MaintenanceGateProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [checkStatus, setCheckStatus] = useState<string | null>(null);

  const checkStatusNow = async () => {
    setIsChecking(true);
    setCheckStatus(null);
    try {
      const res = await fetch('/api/site-mode', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.mode === 'LIVE') {
          setCheckStatus('Store is back LIVE! Reloading...');
          setTimeout(() => {
            window.location.reload();
          }, 800);
          return;
        }
      }
      setCheckStatus('Still in maintenance. We will auto-check again shortly.');
    } catch {
      setCheckStatus('Still in maintenance mode.');
    } finally {
      setIsChecking(false);
      setSecondsLeft(30);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          checkStatusNow();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-red-600 selection:text-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px]" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-500/20">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            {storeName}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-rose-300 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Under Maintenance</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl w-full text-center space-y-8">
          
          {/* Animated Hero Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-2 border-red-500/40 shadow-2xl flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2]" />
            </div>
          </div>

          {/* Heading & Downtime Message */}
          <div className="space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-rose-300 text-xs font-extrabold uppercase tracking-widest">
              Performance Upgrade In Progress
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              We’re Upgrading Our Store
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 rounded-2xl">
              {message}
            </p>
          </div>

          {/* Re-check Status Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={checkStatusNow}
              disabled={isChecking}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Store Status...' : 'Check If Store Is Back Online'}</span>
            </button>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Auto-refreshing in {secondsLeft}s</span>
            </span>
          </div>

          {checkStatus && (
            <div className="text-xs font-bold text-rose-300 animate-in fade-in">
              {checkStatus}
            </div>
          )}

          {/* Customer Self-Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-6">
            
            {/* Existing Buyer Order Lookup */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Download className="w-5 h-5 shrink-0" />
                <h3 className="font-extrabold text-sm text-white">Already Placed an Order?</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Your purchase and Google Drive files are completely safe! Access your orders and downloads anytime via email lookup.
              </p>
              <Link
                href="/my-order"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
              >
                <span>Access My Order Downloads</span>
                <span>→</span>
              </Link>
            </div>

            {/* Need Urgent Help */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2.5 text-rose-400">
                <Mail className="w-5 h-5 shrink-0" />
                <h3 className="font-extrabold text-sm text-white">Need Urgent Help?</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Our support team is actively online (10:00 AM – 8:00 PM IST) to help you with any questions.
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors pt-1"
              >
                <span>Email Support Team</span>
                <span>→</span>
              </a>
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} {storeName} • High-Performance Cloud Infrastructure</p>
      </footer>

    </div>
  );
}
