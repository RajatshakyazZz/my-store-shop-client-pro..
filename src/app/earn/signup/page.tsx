'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/earn/dashboard';
  const { signUp } = useResellerAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!name.trim()) throw new Error('Please enter your full name');
      if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      try {
        await signUp(email, password, name, phone);
        router.push(redirectUrl);
      } catch (signUpErr: any) {
        if (signUpErr?.message?.toLowerCase().includes('already registered')) {
          throw new Error('This email is already registered. Please sign in with your password.');
        }
        throw signUpErr;
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12 pb-24">
      <div className="w-full max-w-md bg-white rounded-3xl border border-red-100 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="p-8 pb-6 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resell & Earn Today</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Create Reseller Account</h1>
          <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
            Set your custom price on 222,000+ reels & keep 100% of your margin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-gray-700 mb-1">
              WhatsApp / Mobile Number <span className="text-gray-400 font-normal">(for payout alerts)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <span>Creating Account...</span> : (
              <>
                <span>Join & Start Earning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">Already have an account? </span>
            <Link
              href={`/earn/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="text-xs font-black text-[#dc2626] hover:underline"
            >
              Sign In
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Zero Upfront Inventory • Instant Reseller Access</span>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function ResellerSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-sm">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
