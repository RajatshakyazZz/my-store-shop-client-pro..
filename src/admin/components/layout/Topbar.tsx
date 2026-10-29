import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ExternalLink,
  Key,
  LogOut,
  RefreshCw,
  Globe,
  Menu,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useBackendHealth } from '../../context/BackendHealthContext';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { portalApi } from '../../api/client';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const { logout, apiKey } = useAuth();
  const { success } = useToast();
  const { status, openModal } = useBackendHealth();
  const { theme, toggleTheme, isLight } = useAdminTheme();
  const navigate = useNavigate();

  const { data: siteMode } = useQuery({
    queryKey: ['site-mode'],
    queryFn: () => portalApi.getSiteMode(),
    refetchInterval: 15000,
  });
  const isStoreLive = siteMode?.mode !== 'MAINTENANCE';

  const handleCopyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      success('API Key Copied', 'Stored safely in your clipboard.');
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-40">
      
      {/* Left: Mobile Hamburger + Store Domain & Site Mode Badge */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-purple-500/40 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-purple-500/40 hover:text-white transition-all group shrink-0"
          title="Open Live Customer Store"
        >
          <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate max-w-[110px] sm:max-w-none">MYZTORE</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors shrink-0" />
        </a>

        {/* Site Mode Live Badge */}
        <Link
          to="/site-mode"
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0 ${
            isStoreLive
              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-300 animate-pulse hover:bg-amber-900/60 shadow-md shadow-amber-950/50'
          }`}
          title={isStoreLive ? 'Store is LIVE: Accepting visitors & orders' : 'Store is in MAINTENANCE MODE: Public traffic blocked'}
        >
          <span className={`w-2 h-2 rounded-full ${isStoreLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
          <span>{isStoreLive ? 'STORE: LIVE' : 'STORE: MAINTENANCE'}</span>
        </Link>

        {/* Backend Health Check Badge */}
        <button
          onClick={openModal}
          title="Click to view Backend Diagnostics & Connection Details"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
            status === 'connected'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
              : status === 'placeholder'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              : status === 'checking'
              ? 'bg-slate-900 border-slate-800 text-slate-400'
              : 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse hover:bg-rose-900/60 shadow-md shadow-rose-950/50'
          }`}
        >
          {status === 'connected' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
          {status === 'placeholder' && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
          {status === 'error' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
          {status === 'checking' && <RefreshCw className="w-3 h-3 animate-spin text-slate-400 shrink-0" />}

          <span className="hidden sm:inline">
            {status === 'connected' && 'BACKEND: CONNECTED'}
            {status === 'placeholder' && 'BACKEND: DEMO KEYS'}
            {status === 'error' && 'BACKEND: ERROR'}
            {status === 'checking' && 'CHECKING...'}
          </span>
          <span className="sm:hidden">
            {status === 'connected' && 'LIVE'}
            {status === 'placeholder' && 'DEMO'}
            {status === 'error' && 'ERR'}
            {status === 'checking' && '...'}
          </span>
        </button>
      </div>

      {/* Right: Theme Toggle, Key Status, Quick Actions, Profile & Logout */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        
        {/* Theme Toggle Button (Light / Dark Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-xs'
              : 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-500/40 hover:bg-slate-800'
          }`}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* API Key Status Pill */}
        <button
          onClick={handleCopyKey}
          title="Click to copy current API key"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-amber-500 transition-all cursor-pointer"
        >
          <Key className="w-3.5 h-3.5 text-amber-500" />
          <span>{apiKey ? `${apiKey.slice(0, 10)}...` : 'NO KEY'}</span>
        </button>

        {/* Sync Button */}
        <button
          onClick={() => {
            portalApi.syncOrders({ meta_only: true });
            success('Orders Synced', 'Incremental synchronization completed.');
          }}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          title="Incremental Sync"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-bold transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>

    </header>
  );
}
