'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  Copy,
  Check,
  ExternalLink,
  Store,
  Home,
} from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading, signOut } = useResellerAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // If on login, signup, or public landing, render children without dashboard shell
  const isAuthOrLandingPage =
    pathname === '/earn' ||
    pathname === '/earn/login' ||
    pathname === '/earn/signup';

  if (isAuthOrLandingPage) {
    return <>{children}</>;
  }

  // Protected route check
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-purple-100 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#6734f7] flex items-center justify-center mx-auto shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[#162048]">Partner Sign-In Required</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Please sign in or create your reseller account to access your products, earnings, and UPI payout portal.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/earn/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white font-black text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
            >
              Sign In to Reseller Portal
            </Link>
            <Link
              href={`/earn/signup?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3.5 rounded-xl border border-purple-200 text-[#162048] font-black text-xs hover:bg-purple-50 active:scale-95 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/earn/dashboard', icon: LayoutDashboard },
    { name: 'My Links', href: '/earn/products', icon: Package },
    { name: 'Create', href: '/earn/create', icon: PlusCircle },
    { name: 'Orders', href: '/earn/orders', icon: ShoppingBag },
    { name: 'Wallet', href: '/earn/wallet', icon: Wallet },
    { name: 'Settings', href: '/earn/settings', icon: Settings },
  ];

  const mobileDockLinks = [
    { name: 'Home', href: '/', icon: Home, isHome: true },
    { name: 'Overview', href: '/earn/dashboard', icon: LayoutDashboard },
    { name: 'My Links', href: '/earn/products', icon: Package },
    { name: 'Create', href: '/earn/create', icon: PlusCircle, isCreate: true },
    { name: 'Orders', href: '/earn/orders', icon: ShoppingBag },
    { name: 'Wallet', href: '/earn/wallet', icon: Wallet },
  ];

  const handleCopyUid = () => {
    if (!profile?.resellerUid) return;
    navigator.clipboard.writeText(profile.resellerUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-[#162048] flex flex-col justify-between selection:bg-purple-200 selection:text-purple-900">
      <div>
        {/* Top Mobile Bar */}
        <header className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-purple-100/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-purple-50 text-[#6734f7] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-[#162048]">Reseller Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-[#6734f7] font-bold">PRO</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile?.resellerUid && (
              <button
                type="button"
                onClick={handleCopyUid}
                className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-900 text-[10px] font-mono font-bold flex items-center gap-1 active:scale-95 transition-transform"
                title="Tap to Copy Reseller UID"
              >
                <span>🆔 {profile.resellerUid}</span>
                {copiedUid ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-2.5 h-2.5 text-amber-700" />}
              </button>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Desktop Sidebar & Mobile Drawer (col-span-3) */}
            <aside className={`lg:col-span-3 space-y-4 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              
              {/* User Profile Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6734f7] to-[#ec288d] text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-500/20 shrink-0">
                    {profile?.displayName?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'RS'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-[#162048] truncate">
                      {profile?.displayName || 'MYZTORE Reseller'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                {profile?.resellerUid && (
                  <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 block">Permanent Reseller UID</span>
                      <span className="font-mono text-xs font-black text-amber-950 truncate block">{profile.resellerUid}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="px-2.5 py-1 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 text-[10px] font-bold shrink-0 transition active:scale-95 shadow-2xs"
                    >
                      {copiedUid ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500">Partner Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold uppercase text-[9px] tracking-wider border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Partner
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-2 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-1">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/earn/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#6734f7] to-[#8a33f5] text-white shadow-md shadow-purple-500/25'
                          : 'text-slate-600 hover:text-[#162048] hover:bg-purple-50/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                <Link
                  href="/"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-[#6734f7] hover:bg-purple-50/50 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>Main Storefront</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    router.push('/earn');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Pro Tip Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50/40 to-purple-50 border border-purple-100/80 text-xs space-y-2">
                <span className="font-black text-[#6734f7] uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Growth Pro Tip</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Share your custom links inside Instagram DMs, broadcast channels, and Telegram to achieve 3x higher conversion rates!
                </p>
              </div>
            </aside>

            {/* Main Dashboard Content Area (col-span-9) */}
            <main className="lg:col-span-9 space-y-6 pb-24 lg:pb-8">
              {children}
            </main>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE STICKY BOTTOM NAVIGATION DOCK (Instant 1-Tap App Nav) */}
      {/* ------------------------------------------------------------- */}
      <nav className="lg:hidden fixed bottom-2.5 left-2 right-2 z-50 bg-white/95 backdrop-blur-2xl border border-purple-200/90 shadow-[0_12px_40px_rgba(103,52,247,0.18)] rounded-3xl py-1.5 px-1 flex items-center justify-around">
        {mobileDockLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/earn/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isCreate) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6 group"
                title="Create New Reseller Link"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white flex items-center justify-center shadow-lg shadow-purple-500/40 group-active:scale-95 transition-transform">
                  <PlusCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-black text-[#6734f7] mt-0.5">New Link</span>
              </Link>
            );
          }

          if (item.isHome) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all text-slate-500 hover:text-[#6734f7] active:scale-95 group"
                title="Main Store Home"
              >
                <div className="w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5 stroke-[2] text-slate-600 group-hover:text-[#6734f7]" />
                </div>
                <span className="text-[10px] mt-0.5 font-bold tracking-tight text-slate-600 group-hover:text-[#6734f7]">Home</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-[#6734f7] font-black' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
