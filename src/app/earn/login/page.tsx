'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck, Smartphone, KeyRound, CheckCircle2 } from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/earn/dashboard';
  const { signIn, connectAccount, resetPassword } = useResellerAuth();

  const [mode, setMode] = useState<'password' | 'uid'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uidInput, setUidInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'password') {
        if (!email.trim()) throw new Error('Please enter your email address');
        if (!password) throw new Error('Please enter your password');
        await signIn(email, password);
      } else {
        if (!uidInput.trim()) throw new Error('Please enter your permanent Reseller UID (e.g. RSL-8K4M2P9X)');
        await connectAccount(uidInput);
      }
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      setError('Please enter your email above first');
      return;
    }
    try {
      await resetPassword(email);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12 pb-24">
      <div className="w-full max-w-md bg-white rounded-3xl border border-red-100 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="p-6 sm:p-8 pb-6 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reseller Partner Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Sign In to Dashboard</h1>
          <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
            Manage your custom links, track sales & withdraw your earnings across any device.
          </p>

          {/* Mode Selector */}
          <div className="mt-4 grid grid-cols-2 p-1 rounded-2xl bg-black/20 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('password'); setError(null); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'password' ? 'bg-white text-[#162048] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setMode('uid'); setError(null); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'uid' ? 'bg-white text-[#162048] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Sync via Reseller UID
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Password reset link sent to your email!</span>
            </div>
          )}

          {mode === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="text-[11px] font-bold text-[#dc2626] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Permanent Reseller UID</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. RSL-8K4M2P9X"
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 uppercase"
                />
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Enter your secret permanent UID (starts with RSL-) to sync your wallet and links. If using an email address, please switch to Email &amp; Password tab.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <span>Connecting...</span> : (
              <>
                <span>{mode === 'password' ? 'Sign In to Dashboard' : 'Sync & Restore Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">Don&apos;t have a reseller account? </span>
            <Link
              href={`/earn/signup${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="text-xs font-black text-[#dc2626] hover:underline"
            >
              Sign Up Free
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Cross-Device Auto Sync Active</span>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function ResellerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs font-bold text-gray-400">Loading portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
