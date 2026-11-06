import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  db,
  firebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
  FirebaseConfigObject,
} from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
  Database,
  Key,
  Copy,
  Check,
  Sliders,
  RotateCcw,
} from 'lucide-react';

export type HealthStatus = 'checking' | 'connected' | 'error' | 'placeholder';

export interface BackendHealthState {
  status: HealthStatus;
  latencyMs: number | null;
  projectId: string;
  apiKeyMasked: string;
  errorMessage: string | null;
  errorCode: string | null;
  lastChecked: string | null;
  isModalOpen: boolean;
  hasCustomConfig: boolean;
  openModal: () => void;
  closeModal: () => void;
  runHealthCheck: () => Promise<void>;
}

const BackendHealthContext = createContext<BackendHealthState | undefined>(undefined);

export function BackendHealthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<HealthStatus>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const rawKey = firebaseConfig.apiKey || '';
  const apiKeyMasked = rawKey.length > 8 ? `${rawKey.slice(0, 6)}...${rawKey.slice(-4)}` : 'NOT SET';
  const hasCustomConfig =
    typeof window !== 'undefined' &&
    !!(localStorage.getItem('creatormint_firebase_config') || localStorage.getItem('vaultzet_firebase_config'));
  const isPlaceholderKey =
    !hasCustomConfig &&
    (!rawKey ||
      rawKey.includes('Demo') ||
      rawKey.length < 15 ||
      firebaseConfig.projectId === 'demo-project');

  const runHealthCheck = useCallback(async () => {
    setStatus('checking');
    setErrorMessage(null);
    setErrorCode(null);

    const start = performance.now();

    if (!db) {
      setStatus('error');
      setErrorCode('INIT_FAILED');
      setErrorMessage('Firebase SDK failed to initialize. Please check your Vercel environment variables.');
      setLatencyMs(null);
      setLastChecked(new Date().toLocaleTimeString());
      return;
    }

    try {
      // Live test read from Firestore
      const testRef = doc(db, 'store_settings', 'general');
      await getDoc(testRef);

      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setLastChecked(new Date().toLocaleTimeString());

      if (isPlaceholderKey) {
        setStatus('placeholder');
        setErrorCode('PLACEHOLDER_KEYS');
        setErrorMessage(
          'Using placeholder sandbox credentials. Real Firebase keys are not configured in Vercel environment variables.'
        );
      } else {
        setStatus('connected');
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setLastChecked(new Date().toLocaleTimeString());
      setStatus('error');
      setErrorCode(err?.code || 'UNKNOWN_FIRESTORE_ERROR');
      setErrorMessage(
        err?.message || 'Firestore connection rejected. Verify Firestore rules and project credentials.'
      );
    }
  }, [isPlaceholderKey]);

  useEffect(() => {
    runHealthCheck();
    // Auto-ping every 90 seconds
    const interval = setInterval(runHealthCheck, 90000);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BackendHealthContext.Provider
      value={{
        status,
        latencyMs,
        projectId: firebaseConfig.projectId,
        apiKeyMasked,
        errorMessage,
        errorCode,
        lastChecked,
        isModalOpen,
        hasCustomConfig,
        openModal,
        closeModal,
        runHealthCheck,
      }}
    >
      {children}
      <BackendHealthModal />
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth() {
  const ctx = useContext(BackendHealthContext);
  if (!ctx) {
    throw new Error('useBackendHealth must be used within BackendHealthProvider');
  }
  return ctx;
}

function BackendHealthModal() {
  const {
    status,
    latencyMs,
    projectId,
    apiKeyMasked,
    errorMessage,
    errorCode,
    lastChecked,
    isModalOpen,
    hasCustomConfig,
    closeModal,
    runHealthCheck,
  } = useBackendHealth();

  const [copiedRule, setCopiedRule] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showDirectConfig, setShowDirectConfig] = useState(false);

  // Direct configuration form fields
  const [cfgApiKey, setCfgApiKey] = useState(firebaseConfig.apiKey || 'AIzaSyD8rz1-VaHEaS-ZpEMeShK-v1CG66BFz9s');
  const [cfgProjectId, setCfgProjectId] = useState(firebaseConfig.projectId || 'creator-mint-bf2b1');
  const [cfgAuthDomain, setCfgAuthDomain] = useState(firebaseConfig.authDomain || 'creator-mint-bf2b1.firebaseapp.com');
  const [cfgStorageBucket, setCfgStorageBucket] = useState(firebaseConfig.storageBucket || 'creator-mint-bf2b1.firebasestorage.app');
  const [cfgAppId, setCfgAppId] = useState(firebaseConfig.appId || '1:720751971659:web:2b924dce33742132796cce');
  const [cfgMessagingSenderId, setCfgMessagingSenderId] = useState(firebaseConfig.messagingSenderId || '720751971659');
  const [pasteSnippet, setPasteSnippet] = useState('');
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleJsonPaste = (text: string) => {
    setPasteSnippet(text);
    setPasteStatus(null);
    try {
      let cleaned = text.trim();
      const extractRegex = (key: string) => {
        const match = cleaned.match(new RegExp(`${key}["']?\\s*:\\s*["']([^"']+)["']`));
        return match ? match[1] : '';
      };

      const extractedApiKey = extractRegex('apiKey');
      const extractedProjectId = extractRegex('projectId');
      const extractedAuthDomain = extractRegex('authDomain');
      const extractedStorageBucket = extractRegex('storageBucket');
      const extractedAppId = extractRegex('appId');
      const extractedSenderId = extractRegex('messagingSenderId');

      if (extractedApiKey) setCfgApiKey(extractedApiKey);
      if (extractedProjectId) setCfgProjectId(extractedProjectId);
      if (extractedAuthDomain) setCfgAuthDomain(extractedAuthDomain);
      if (extractedStorageBucket) setCfgStorageBucket(extractedStorageBucket);
      if (extractedAppId) setCfgAppId(extractedAppId);
      if (extractedSenderId) setCfgMessagingSenderId(extractedSenderId);

      if (extractedApiKey || extractedProjectId) {
        setPasteStatus('Keys parsed successfully! Click "Save & Connect" below.');
      }
    } catch (e: any) {
      setPasteStatus('Could not auto-parse keys. Please edit fields directly.');
    }
  };

  const handleSaveDirectConfig = () => {
    if (!cfgApiKey || !cfgProjectId) {
      alert('API Key and Project ID are required.');
      return;
    }
    const newConfig: FirebaseConfigObject = {
      apiKey: cfgApiKey.trim(),
      projectId: cfgProjectId.trim(),
      authDomain: cfgAuthDomain.trim() || `${cfgProjectId.trim()}.firebaseapp.com`,
      storageBucket: cfgStorageBucket.trim() || `${cfgProjectId.trim()}.firebasestorage.app`,
      messagingSenderId: cfgMessagingSenderId.trim() || '1029384756',
      appId: cfgAppId.trim() || '1:1029384756:web:vaultzet',
    };
    saveCustomFirebaseConfig(newConfig);
  };

  const handleResetConfig = () => {
    if (confirm('Reset to default configuration?')) {
      clearCustomFirebaseConfig();
    }
  };

  const handleRecheck = async () => {
    setIsChecking(true);
    await runHealthCheck();
    setIsChecking(false);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Backend Health Diagnostics</h3>
              <p className="text-xs text-slate-400 font-medium">
                Live connection check with Firebase Firestore & API
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            status === 'connected'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : status === 'placeholder'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : status === 'checking'
              ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
              : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {status === 'connected' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
            {status === 'placeholder' && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />}
            {status === 'error' && <XCircle className="w-6 h-6 text-rose-400 shrink-0" />}
            {status === 'checking' && <RefreshCw className="w-6 h-6 text-purple-400 animate-spin shrink-0" />}

            <div>
              <div className="text-sm font-black tracking-wide">
                {status === 'connected' && 'BACKEND CONNECTED (FIRESTORE LIVE)'}
                {status === 'placeholder' && 'DEMO/SANDBOX MODE (KEYS MISSING IN VERCEL)'}
                {status === 'error' && 'BACKEND CONNECTION ERROR / DISCONNECTED'}
                {status === 'checking' && 'TESTING BACKEND CONNECTION...'}
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                {status === 'connected' && `Latency: ${latencyMs}ms • Real orders and store settings syncing.`}
                {status === 'placeholder' && 'Vercel environment variables not set; using local fallback.'}
                {status === 'error' && (errorMessage || 'Firestore rejected request. Check details below.')}
                {status === 'checking' && 'Pinging Firebase servers...'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRecheck}
            disabled={isChecking}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Re-check</span>
          </button>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Project ID</span>
            <span className="text-xs font-mono font-bold text-slate-200 truncate block mt-0.5">
              {projectId}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">API Key</span>
            <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
              {apiKeyMasked}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Latency</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">
              {latencyMs !== null ? `${latencyMs} ms` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Direct Firebase Setup Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Firebase Setup (Keys Yahan Add Karein)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasCustomConfig && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Browser Config Active
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowDirectConfig(!showDirectConfig)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 underline"
              >
                {showDirectConfig ? 'Hide Inputs' : 'Edit / Paste Keys'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Agar aapne Vercel environment variables set nahi kiye hain, toh aap yahan direct Firebase keys paste karke live database se connect kar sakte hain:
          </p>

          {showDirectConfig && (
            <div className="space-y-3 pt-2 border-t border-slate-800 animate-fade-in">
              {/* Quick Paste JSON */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Quick Paste Firebase Config (JSON ya code snippet)
                </label>
                <textarea
                  value={pasteSnippet}
                  onChange={(e) => handleJsonPaste(e.target.value)}
                  placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "vaultzet-5873e",\n  ...\n};`}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 placeholder-slate-600"
                />
                {pasteStatus && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">{pasteStatus}</p>
                )}
              </div>

              {/* Individual Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Firebase API Key *
                  </label>
                  <input
                    type="text"
                    value={cfgApiKey}
                    onChange={(e) => setCfgApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Project ID *
                  </label>
                  <input
                    type="text"
                    value={cfgProjectId}
                    onChange={(e) => setCfgProjectId(e.target.value)}
                    placeholder="vaultzet-5873e"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={cfgAuthDomain}
                    onChange={(e) => setCfgAuthDomain(e.target.value)}
                    placeholder="vaultzet-5873e.firebaseapp.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={cfgStorageBucket}
                    onChange={(e) => setCfgStorageBucket(e.target.value)}
                    placeholder="vaultzet-5873e.firebasestorage.app"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={cfgAppId}
                    onChange={(e) => setCfgAppId(e.target.value)}
                    placeholder="1:1029384756:web:..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Messaging Sender ID
                  </label>
                  <input
                    type="text"
                    value={cfgMessagingSenderId}
                    onChange={(e) => setCfgMessagingSenderId(e.target.value)}
                    placeholder="1029384756"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {hasCustomConfig ? (
                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Defaults
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleSaveDirectConfig}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save & Connect to Firebase
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Details if any */}
        {errorCode && status === 'error' && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Error Code: {errorCode}</span>
            </div>
            <p className="text-xs text-rose-200 font-mono break-words bg-rose-950/60 p-2.5 rounded-xl border border-rose-900/60">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Troubleshooting & Setup Guide */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Troubleshooting Guide (समाधान)
          </h4>

          {/* Issue 1: Firestore Rules */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">
                1. Firestore Security Rules (Permission Denied Error)
              </span>
              <button
                onClick={copyRulesToClipboard}
                className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedRule ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Rules</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If Firebase shows <code className="text-rose-400">permission-denied</code>, go to{' '}
              <strong>Firebase Console &gt; Firestore Database &gt; Rules</strong> and paste:
            </p>
            <pre className="text-[10px] font-mono text-emerald-300 bg-black/60 p-2 rounded-lg overflow-x-auto">
              {sampleRules}
            </pre>
          </div>

          {/* Issue 2: Vercel Env Vars for Storefront */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-300 block">
              2. Storefront Vercel Keys (vaultzet.shop)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Customer Storefront ke Vercel project mai ye environment variables add karein taaki Storefront aur Admin Panel same database se connect ho sakein:
            </p>
            <div className="bg-black/60 p-2.5 rounded-lg space-y-1 font-mono text-[10px] text-slate-300">
              <div>NEXT_PUBLIC_FIREBASE_API_KEY = (your api key)</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID = (your project id)</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = (your auth domain)</div>
            </div>
          </div>

          {/* Issue 3: Admin Portal Vercel Keys */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-300 block">
              3. Admin Portal Vercel Keys (adminp.vaultzet.shop)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Admin Portal project settings mai ye Vite environment variables verify karein:
            </p>
            <div className="bg-black/60 p-2.5 rounded-lg space-y-1 font-mono text-[10px] text-slate-300">
              <div>VITE_FIREBASE_API_KEY = (your api key)</div>
              <div>VITE_FIREBASE_PROJECT_ID = (your project id)</div>
              <div>VITE_ADMIN_PASSWORD = (your login password)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400">
          <span>Last checked: {lastChecked || 'Just now'}</span>
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
