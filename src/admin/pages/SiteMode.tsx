import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Power, ShieldAlert, CheckCircle2, AlertOctagon, Save } from 'lucide-react';
import { portalApi } from '../api/client';
import { SiteModeConfig } from '../api/types';
import { useToast } from '../context/ToastContext';

export default function SiteMode() {
  const queryClient = useQueryClient();
  const { success, error, warning } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'LIVE' | 'MAINTENANCE'>('LIVE');

  const { data: config, isLoading } = useQuery({
    queryKey: ['site-mode'],
    queryFn: () => portalApi.getSiteMode(),
  });

  const [message, setMessage] = useState(
    'We are updating our bundle catalog! Check back in 15 minutes.'
  );
  const [ips, setIps] = useState('103.112.44.18, 172.17.124.188');

  React.useEffect(() => {
    if (config) {
      setMessage(config.maintenance_message);
      setIps(config.bypass_ips.join(', '));
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: (updated: SiteModeConfig) => portalApi.setSiteMode(updated),
    onSuccess: (data) => {
      queryClient.setQueryData(['site-mode'], data);
      queryClient.invalidateQueries({ queryKey: ['site-mode'] });
      setIsConfirmOpen(false);
      if (data.mode === 'MAINTENANCE') {
        warning('Maintenance Mode Activated', 'Public access paused. Customers now see the maintenance screen.');
      } else {
        success('Store is LIVE', 'Ztore Digital is now open to all global visitors.');
      }
    },
    onError: () => error('Action Failed', 'Could not update site mode state.'),
  });

  const handleRequestToggle = (targetMode: 'LIVE' | 'MAINTENANCE') => {
    setPendingMode(targetMode);
    setIsConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    mutation.mutate({
      mode: pendingMode,
      maintenance_message: message,
      bypass_ips: ips.split(',').map((s) => s.trim()).filter(Boolean),
      last_updated: new Date().toISOString(),
    });
  };

  const isLive = (config?.mode ?? 'LIVE') === 'LIVE';

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Site Mode & Maintenance Gate
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Safely switch between LIVE storefront traffic and MAINTENANCE emergency downtime.
        </p>
      </div>

      {/* Hero Mode Status Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isLive
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-amber-950/20 border-amber-500/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Power className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Status:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isLive ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {config?.mode || 'LIVE'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isLive ? 'Store is Accepting Orders & Customers' : 'Store is Under Maintenance'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => handleRequestToggle(isLive ? 'MAINTENANCE' : 'LIVE')}
            disabled={mutation.isPending}
            className={`px-6 py-3 rounded-2xl font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
              isLive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <Power className={`w-4 h-4 ${mutation.isPending ? 'animate-spin' : ''}`} />
            <span>
              {mutation.isPending
                ? 'Updating...'
                : isLive
                ? 'Switch to MAINTENANCE Mode'
                : 'Switch to LIVE Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Maintenance Gate Configuration</h3>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">
            Downtime Banner Message (Shown to Customers)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">
            Whitelisted Admin IPs (Comma separated, can browse normally)
          </label>
          <input
            type="text"
            value={ips}
            onChange={(e) => setIps(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={() =>
              mutation.mutate({
                mode: config?.mode || 'LIVE',
                maintenance_message: message,
                bypass_ips: ips.split(',').map((s) => s.trim()).filter(Boolean),
                last_updated: new Date().toISOString(),
              })
            }
            disabled={mutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-600/20 disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{mutation.isPending ? 'Saving...' : 'Save Gate Configuration'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Open Customer Storefront</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                Confirm Switching Site Mode to {pendingMode}?
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {pendingMode === 'MAINTENANCE'
                  ? 'All public visitors will immediately see the maintenance upgrade gate and will be blocked from placing orders. You (as logged-in Admin) will still be able to preview the live store.'
                  : 'The store will immediately open back up to global public traffic.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                disabled={mutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={mutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {mutation.isPending ? 'Applying...' : 'Yes, Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
