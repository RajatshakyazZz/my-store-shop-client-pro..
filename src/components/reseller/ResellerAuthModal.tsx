'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

interface ResellerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productTitle?: string;
  productId?: string;
}

export default function ResellerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  productTitle,
  productId,
}: ResellerAuthModalProps) {
  const { signIn, signUp, resetPassword } = useResellerAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signup');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (tab === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signUp(email, password, name, phone);
        if (onSuccess) onSuccess();
        onClose();
      } else if (tab === 'signin') {
        if (!email.trim() || !password) throw new Error('Please enter email and password');
        await signIn(email, password);
        if (onSuccess) onSuccess();
        onClose();
      } else if (tab === 'forgot') {
        if (!email.trim()) throw new Error('Please enter your account email');
        await resetPassword(email);
        setSuccessMsg('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
        
        {/* Header gradient banner */}
        <div className="relative p-6 pb-5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ZTORE Reseller Program</span>
          </div>

          <h3 className="text-xl font-black tracking-tight leading-tight">
            {tab === 'signup' && 'Create Your Reseller Account'}
            {tab === 'signin' && 'Welcome Back, Reseller'}
            {tab === 'forgot' && 'Reset Your Password'}
          </h3>

          <p className="text-xs text-white/90 mt-1">
            {productTitle ? (
              <span>Setup custom link for <strong className="text-white underline">{productTitle}</strong></span>
            ) : (
              'Set your own price and keep 100% of the margin on every sale.'
            )}
          </p>
        </div>

        {/* Tab switcher */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-1">
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                tab === 'signup'
                  ? 'bg-white text-[#dc2626] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                tab === 'signin'
                  ? 'bg-white text-[#dc2626] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all font-medium"
                />
              </div>
            </div>
          )}

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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all font-medium"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                WhatsApp Number <span className="text-gray-400 font-normal">(for payout alerts)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all font-medium"
                />
              </div>
            </div>
          )}

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">Password</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setError(null); }}
                    className="text-[11px] font-bold text-[#dc2626] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : tab === 'signup' ? (
              <>
                <span>Create Account & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : tab === 'signin' ? (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          {tab === 'forgot' && (
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(null); }}
              className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 text-center"
            >
              Back to Sign In
            </button>
          )}

          {tab === 'signup' && (
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              By joining, you agree to ZTORE Reseller Terms. You earn the margin above base price with instant payout requests.
            </p>
          )}
        </form>

      </div>
    </div>
  );
}
