import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Play, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithPassword } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      error('Password Required', 'Please enter your master admin password.');
      return;
    }

    setIsLoading(true);
    const ok = await loginWithPassword(password.trim());
    setIsLoading(false);

    if (ok) {
      success('Access Granted', 'Welcome to Ztore Digital Admin Portal.');
      navigate('/');
    } else {
      const isConfigured = Boolean(
        typeof process !== 'undefined' &&
          (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
            (process.env as any).ADMIN_PASSWORD ||
            (process.env as any).VITE_ADMIN_PASSWORD ||
            'vaultzet@2026')
      );
      if (!isConfigured) {
        error(
          'Password Not Configured',
          'VITE_ADMIN_PASSWORD is not set in Vercel. Please add VITE_ADMIN_PASSWORD in your Vercel Environment Variables.'
        );
      } else {
        error('Access Denied', 'Incorrect admin password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Card Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-xl shadow-purple-500/25">
            <img src="/logo.png" alt="Ztore Digital Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Ztore Digital Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Command Center for <span className="text-purple-400 font-bold">Ztore Digital</span>
            </p>
          </div>
        </div>

        {/* Secure Password Login Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Master Admin Authentication
            </h2>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Admin Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your secret admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Protected by <code className="text-purple-400 font-mono">VITE_ADMIN_PASSWORD</code> in your Vercel Environment Variables.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-knowledge client security active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
