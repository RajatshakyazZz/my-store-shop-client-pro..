'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, KeyRound, FolderOpen, Download, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

import { getCustomerOrders } from '@/lib/firebase';

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'orders'>('email');
  const [mockGeneratedOtp, setMockGeneratedOtp] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-load purchased orders from local device storage without requiring Gmail or OTP
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const purchasedRaw = localStorage.getItem('vaultzet_purchased_orders');
      const ordersRaw = localStorage.getItem('vaultzet_orders');
      let combined: any[] = [];

      if (purchasedRaw) {
        const parsed = JSON.parse(purchasedRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          combined = [...combined, ...parsed];
        }
      }

      if (ordersRaw) {
        const parsed = JSON.parse(ordersRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((o: any) => {
            const oNum = o.orderNumber || o.order_number || o.id;
            if (!combined.some((c: any) => (c.orderNumber || c.order_id || c.id) === oNum)) {
              combined.push(o);
            }
          });
        }
      }

      if (combined.length > 0) {
        setOrders(combined);
        setStep('orders');
        const firstEmail = combined[0]?.customer?.email || '';
        if (firstEmail) setEmail(firstEmail);
      }
    } catch (e) {
      console.warn('Error reading local orders:', e);
    }
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Generate a 6-digit OTP
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setMockGeneratedOtp(generated);
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === mockGeneratedOtp || otp === '123456') {
      setLoading(true);
      try {
        const firestoreOrders = await getCustomerOrders(email);
        setOrders(firestoreOrders);
      } catch {
        const stored = JSON.parse(localStorage.getItem('vaultzet_purchased_orders') || localStorage.getItem('vaultzet_orders') || '[]');
        setOrders(stored);
      } finally {
        setLoading(false);
        setStep('orders');
      }
    } else {
      alert('Invalid OTP code. Please enter the code shown in the demo banner.');
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/60 text-red-900 text-xs font-black uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-red-600" />
            Customer Download Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            My Orders &amp; Downloads
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
            Access your purchased reels bundles anytime without creating or remembering passwords.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-1">
            <span>✓ Instant Local Access</span>
            <span>•</span>
            <span>✓ No Password Needed</span>
            <span>•</span>
            <span>✓ Private Cloud Links</span>
          </div>
        </div>

        {/* Step 1: Input Email */}
        {step === 'email' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md mx-auto space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-200/60 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-950">Enter Purchase Email</h2>
              <p className="text-xs text-slate-500">
                Enter the email address you entered during checkout to view your past purchases.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/25 cursor-pointer"
              >
                <span>Send One-Time OTP Code</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 'otp' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md mx-auto space-y-5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-200/60 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-950">Enter Verification Code</h2>
              <p className="text-xs text-slate-500">
                We sent a 6-digit verification code to <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>

            {/* Instant Demo Helper Banner */}
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-900">
              Demo OTP code: <span className="text-base font-black text-red-700 tracking-widest">{mockGeneratedOtp}</span> (or 123456)
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-black px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-black text-sm shadow-md shadow-red-500/25 cursor-pointer"
              >
                Verify &amp; Access Downloads →
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Change Email Address
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Orders List */}
        {step === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-black text-slate-950">Your Purchased Bundles</h2>
                <p className="text-xs text-slate-500">
                  {email ? `Orders for ${email}` : 'Instant download access granted for your purchased bundles.'}
                </p>
              </div>
              <button
                onClick={() => setStep('email')}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                {email ? 'Search Other Email' : 'Enter Email to Restore'}
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Past Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We could not locate past purchases on this device. Click above to look up orders via your checkout email.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-md shadow-red-500/20"
                >
                  Browse Bundles
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord: any, idx: number) => {
                  const orderId = ord.orderNumber || ord.orderId || ord.order_id || ord.id || 'Order';
                  const dateStr = ord.date_created || ord.date || ord.createdAt || '';
                  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString() : 'Recent';

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between text-xs font-bold pb-3 border-b border-slate-200">
                        <div>
                          Order: <span className="text-red-700 font-black">{orderId}</span>
                        </div>
                        <div className="text-slate-400 font-medium">
                          {formattedDate}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {ord.items?.map((item: any, i: number) => {
                          const itemFiles: Array<{ id?: string; name: string; file_url?: string; url?: string }> =
                            Array.isArray(item.files) && item.files.length > 0
                              ? item.files
                              : [{ name: item.title || item.name, file_url: item.googleDriveLink || item.driveLink || 'https://drive.google.com' }];

                          return (
                            <div
                              key={i}
                              className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                <div>
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-950">
                                    {item.title || item.name}
                                  </h4>
                                  <span className="text-[11px] text-slate-500 font-semibold">
                                    License: {item.license === 'reseller' ? 'Reseller Rights Included' : 'Personal Use'}
                                  </span>
                                </div>
                                {itemFiles.length > 1 && (
                                  <span className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shrink-0">
                                    {itemFiles.length} Drive Files
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1.5">
                                {itemFiles.map((f, fIdx) => (
                                  <div
                                    key={f.id || fIdx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 gap-3"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FolderOpen className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                      <span className="text-xs font-semibold text-slate-900 truncate">
                                        {f.name || `Drive Part #${fIdx + 1}`}
                                      </span>
                                    </div>
                                    <a
                                      href={f.file_url || f.url || item.googleDriveLink || item.driveLink || 'https://drive.google.com'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Download</span>
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        {ord.hasBump && (
                          <div className="flex items-center justify-between bg-red-50/80 p-3.5 rounded-xl border border-red-200 gap-3">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-red-950">
                                ★ Bonus Pack: {ord.orderBump?.title || '1500+ Ultimate Twisted World & Viral AI Reels'}
                              </h4>
                              <span className="text-[11px] text-red-700 font-semibold">
                                Order Bump Special Offer
                              </span>
                            </div>

                            <a
                              href={ord.orderBump?.googleDriveLink || 'https://drive.google.com/drive/folders/bonus-pack-twisted-world'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
