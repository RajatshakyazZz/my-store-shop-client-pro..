'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign,
  Share2,
  CheckCircle2,
  Lock,
  ChevronDown,
  Play,
  Flame,
  Check,
  X,
  CreditCard,
  Layers,
  ArrowUpRight,
  Smartphone,
  Eye,
  Gift,
} from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

export default function EarnLandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useResellerAuth();

  // Interactive Profit Calculator State
  const [salesPerDay, setSalesPerDay] = useState(5);
  const [marginPerBundle, setMarginPerBundle] = useState(250);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/earn/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const dailyEarnings = salesPerDay * marginPerBundle;
  const monthlyEarnings = dailyEarnings * 30;
  const yearlyEarnings = monthlyEarnings * 12;

  const faqs = [
    {
      q: 'How do I get paid and when can I withdraw?',
      a: 'Your profit margin is credited to your reseller wallet the exact moment your customer completes checkout. You can request a payout directly to any UPI ID (PhonePe, Google Pay, Paytm, BHIM) or Bank Account anytime with an ultra-low threshold of just ₹1!',
    },
    {
      q: 'Do I have to deliver files or handle Google Drive links myself?',
      a: 'Zero manual work! VaultWorld handles everything. The moment payment is verified, the customer gets instant access to the Google Drive links on their screen and via email. You never have to host, upload, or email anything.',
    },
    {
      q: 'Is there any joining fee, deposit, or monthly charge?',
      a: 'No. VaultWorld Partner Program is 100% free to join. There are zero upfront costs, zero monthly platform fees, and zero hidden charges.',
    },
    {
      q: 'How much can I charge for each bundle?',
      a: 'You have complete pricing freedom! VaultWorld has a minimum base price (e.g. ₹299). You can set your resale price to ₹499, ₹699, or ₹999. Every single rupee above the base price is 100% your net profit.',
    },
    {
      q: 'Where can I share and promote my reseller links?',
      a: 'Everywhere! You get a clean, customized link (vaultworld.shop/r/your-custom-slug). You can paste it in your Instagram bio, YouTube video descriptions, Telegram channels, WhatsApp groups, or run Facebook / Google ads.',
    },
    {
      q: 'Can I track which link generated sales in real time?',
      a: 'Yes! Your dedicated partner dashboard gives you real-time notifications, clicks, order volume, customer names, and net commission logs updated second-by-second.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#162048] antialiased selection:bg-[#6c3cf0]/20 selection:text-[#6c3cf0]">
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-400/15 via-pink-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#6c3cf0]/20 shadow-xs text-xs font-black text-[#6c3cf0]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span>VaultWorld Official Partner Program &bull; ₹0 Joining Fee</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#111836]">
            Resell Viral Reels. <br />
            <span className="bg-gradient-to-r from-[#6734f7] via-[#942bf6] to-[#ec288d] bg-clip-text text-transparent">
              Set Your Price & Earn.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Pick from 222,000+ viral reels bundles, customize the title and selling price, and share your personal link. We deliver the Google Drive files automatically; you keep <strong className="text-[#162048] font-bold">100% of your profit margin</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/earn/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6734f7] via-[#8534f5] to-[#ec288d] text-white font-black text-base shadow-xl shadow-[#6734f7]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Reselling Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/earn/login"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-purple-200/80 text-[#162048] font-black text-base shadow-xs hover:bg-purple-50/70 hover:border-purple-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#6734f7]" />
              <span>Partner Login</span>
            </Link>
          </div>

          {/* Key Value Micro-pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-purple-100">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>₹0 Capital Required</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-purple-100">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Instant Google Drive Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-purple-100">
              <ShieldCheck className="w-4 h-4 text-[#6734f7]" />
              <span>UPI Payouts (Min ₹1)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE EARNINGS CALCULATOR (High-Converting Feature) */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#162048] via-[#1d1645] to-[#2b1754] text-white p-6 sm:p-10 shadow-2xl border border-purple-900/40 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#ec288d]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#6734f7]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Profit Simulator</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Estimate Your Monthly Income
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Adjust the sliders below to see how much you can earn selling digital bundles on autopilot.
                </p>
              </div>

              {/* Slider 1: Sales Per Day */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Bundle Sales Per Day</span>
                  <span className="font-black text-white bg-purple-500/30 border border-purple-400/40 px-2.5 py-0.5 rounded-lg text-sm">
                    {salesPerDay} {salesPerDay === 1 ? 'sale' : 'sales'} / day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={salesPerDay}
                  onChange={(e) => setSalesPerDay(Number(e.target.value))}
                  className="w-full accent-[#ec288d] cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 sale</span>
                  <span>25 sales</span>
                  <span>50 sales/day</span>
                </div>
              </div>

              {/* Slider 2: Margin per Bundle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Your Markup Profit per Bundle</span>
                  <span className="font-black text-green-400 bg-green-500/20 border border-green-500/40 px-2.5 py-0.5 rounded-lg text-sm">
                    ₹{marginPerBundle} margin
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={marginPerBundle}
                  onChange={(e) => setMarginPerBundle(Number(e.target.value))}
                  className="w-full accent-green-400 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹50</span>
                  <span>₹500</span>
                  <span>₹1,000 / sale</span>
                </div>
              </div>

              <div className="text-[11px] text-purple-200/80 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span>Example: VaultWorld Base ₹299 + Your ₹{marginPerBundle} Markup = Buyer pays ₹{299 + marginPerBundle}</span>
              </div>
            </div>

            {/* Right Column: High-Impact Projected Output Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-pink-300 block">
                Projected Net Profit
              </span>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ₹{monthlyEarnings.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mt-1">
                  Estimated Monthly Income
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-left text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-300 block font-medium">Daily Profit</span>
                  <span className="text-base font-black text-white">₹{dailyEarnings.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-300 block font-medium">Annualized</span>
                  <span className="text-base font-black text-purple-300">₹{yearlyEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href="/earn/signup"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>Claim This Income &bull; Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4-STEP EFFORTLESS FLYWHEEL */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6734f7] text-[10px] font-black uppercase tracking-wider">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111836]">
            How VaultWorld Reselling Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            No packaging, no courier delays, no inventory storage. Everything runs 100% digitally in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6734f7] font-black text-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              1
            </div>
            <h3 className="text-base font-black text-[#162048]">Pick Any Reel Bundle</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Explore 222,000+ viral reels across AI, Motivation, Fitness, Devotional, and Finance. Select the one your audience loves.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#ec288d] font-black text-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              2
            </div>
            <h3 className="text-base font-black text-[#162048]">Set Your Custom Price</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Keep base store price (e.g. ₹299) and set your resale price to ₹499 or ₹699. Add your custom title and marketing description.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-black text-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              3
            </div>
            <h3 className="text-base font-black text-[#162048]">Share Your Custom Link</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              You receive a personalized link <code className="bg-purple-50 px-1 py-0.5 rounded text-[10px] text-[#6734f7] font-mono">vaultworld.shop/r/your-slug</code>. Share it in Instagram bio, WhatsApp, or Telegram.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 font-black text-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              4
            </div>
            <h3 className="text-base font-black text-[#162048]">Instant UPI Cashout</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              When a buyer purchases, VaultWorld delivers the files automatically. Your markup is credited to your wallet & can be withdrawn to UPI anytime!
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* COMPARISON: PHYSICAL DROPSHIPPING VS VAULTWORLD DIGITAL RESELLING */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-20">
        <div className="rounded-3xl bg-white border border-purple-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6734f7]">Why VaultWorld Reselling Wins</span>
            <h2 className="text-xl sm:text-3xl font-black text-[#162048]">
              Compare with Traditional Dropshipping
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-purple-100 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-3 px-3">Business Factor</th>
                  <th className="py-3 px-3 text-red-500">Traditional Physical Dropshipping</th>
                  <th className="py-3 px-3 text-green-700 bg-green-50/60 rounded-t-xl">VaultWorld Digital Reselling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#162048]">Upfront Investment</td>
                  <td className="py-3.5 px-3 text-slate-500">₹20,000–₹50,000 for stock/ads</td>
                  <td className="py-3.5 px-3 font-black text-green-700 bg-green-50/60">₹0 (Zero Risk)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#162048]">Customer Delivery Time</td>
                  <td className="py-3.5 px-3 text-slate-500">5 to 9 Days Shipping</td>
                  <td className="py-3.5 px-3 font-black text-green-700 bg-green-50/60">Instant 0 Seconds (Google Drive)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#162048]">Return / RTO Losses</td>
                  <td className="py-3.5 px-3 text-slate-500">30%–40% RTO courier losses</td>
                  <td className="py-3.5 px-3 font-black text-green-700 bg-green-50/60">0% RTO (Digital product)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#162048]">Profit Margins</td>
                  <td className="py-3.5 px-3 text-slate-500">10%–20% after shipping</td>
                  <td className="py-3.5 px-3 font-black text-green-700 bg-green-50/60">60%–80%+ 100% Yours</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-bold text-[#162048]">Payout Speed</td>
                  <td className="py-3.5 px-3 text-slate-500">Weekly/Bi-weekly after RTO reconciliation</td>
                  <td className="py-3.5 px-3 font-black text-green-700 bg-green-50/60">Direct UPI Payouts (Min ₹1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* POPULAR VIRAL NICHES TO RESELL */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-20">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6734f7]">High-Demand Content</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#162048]">
            Hottest Reel Niches That Sell Daily
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            These trending niches convert at over 8.4% on social media. Resellers make consistent daily sales promoting these.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#6734f7] flex items-center justify-center font-bold text-base">
              🤖
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">AI Avatars & Tech</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 45,000+ Sold</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#ec288d] flex items-center justify-center font-bold text-base">
              🚀
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">Luxury & Motivation</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 High Conversion</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-base">
              💪
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">Gym & Fitness</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 30,000+ Sold</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-base">
              🕉️
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">Sanatan & Devotional</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 Viral Audio Reels</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base">
              💰
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">Crypto & Finance</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 High Ticket Margin</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-base">
              🎨
            </div>
            <div>
              <h4 className="text-xs font-black text-[#162048]">Anime & 4K Edits</h4>
              <span className="text-[10px] text-green-600 font-bold">🔥 Youth Favorite</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6734f7]">Partner FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#162048]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Got questions? We have clear, straightforward answers for every reseller.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-purple-100 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#162048] hover:text-[#6734f7] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-purple-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL HIGH-CONVERTING BOTTOM CTA */}
      {/* ------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#6734f7] via-[#8534f5] to-[#ec288d] text-white text-center shadow-xl space-y-5 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Instant Setup &bull; Start in 60 Seconds</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Start Earning Today?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
              Join 1,400+ Indian creators, marketers, and students making consistent daily income with VaultWorld reseller links.
            </p>
            <div className="pt-2">
              <Link
                href="/earn/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#162048] font-black text-sm shadow-xl hover:bg-purple-50 active:scale-95 transition-all"
              >
                <span>Create Free Partner Account</span>
                <ArrowRight className="w-4 h-4 text-[#6734f7]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
