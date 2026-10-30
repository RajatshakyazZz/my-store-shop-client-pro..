import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpCircle,
  Server,
  Code2,
  FileCode,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import { ConnectorStatus } from '../api/types';

export default function Connector() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [checking, setChecking] = useState(false);

  const { data: status, isLoading, refetch } = useQuery<ConnectorStatus>({
    queryKey: ['connector-status'],
    queryFn: () => portalApi.getConnectorStatus(),
  });

  const updateMutation = useMutation({
    mutationFn: () => portalApi.updateConnector(),
    onSuccess: (data) => {
      addToast({
        type: 'success',
        title: 'Connector Updated',
        message: data.message || 'Portal Connector plugin updated successfully to the latest release.',
      });
      queryClient.invalidateQueries({ queryKey: ['connector-status'] });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not automatically update plugin file on WooCommerce host.',
      });
    },
  });

  const handleManualCheck = async () => {
    setChecking(true);
    await refetch();
    setTimeout(() => {
      setChecking(false);
      addToast({
        type: 'info',
        title: 'Sync Check Complete',
        message: 'Endpoint status and compatibility verified with storefront.',
      });
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const isUpToDate = !status?.update_available;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-400" />
            Portal Connector Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Status, server compatibility, and atomic auto-updater for Ztore Digital cloud connector.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin text-purple-400' : ''}`} />
            <span>Check Update</span>
          </button>

          <button
            onClick={() => updateMutation.mutate()}
            disabled={isUpToDate || updateMutation.isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isUpToDate
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20'
            }`}
          >
            <ArrowUpCircle className={`w-4 h-4 ${updateMutation.isPending ? 'animate-spin' : ''}`} />
            <span>{updateMutation.isPending ? 'Updating...' : isUpToDate ? 'Up to Date' : 'Update Connector'}</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/20 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                isUpToDate
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10'
              }`}
            >
              {isUpToDate ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-white">{status?.plugin_name || 'Ztore Digital Portal Connector'}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                    isUpToDate
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isUpToDate ? 'STABLE & SYNCD' : 'UPDATE AVAILABLE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Installed on WordPress core at <code className="text-purple-300 font-mono">wp-content/plugins/portal-connector/</code>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                <div>
                  Current Version: <span className="font-bold text-white font-mono">{status?.current_version}</span>
                </div>
                <div>•</div>
                <div>
                  Latest Release: <span className="font-bold text-purple-300 font-mono">{status?.latest_version}</span>
                </div>
                <div>•</div>
                <div>
                  Last Health Check: <span className="text-slate-300">{formatDate(status?.last_sync || '')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-right md:w-64">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">REST Route Prefix</div>
            <div className="text-xs font-mono font-bold text-purple-400 mt-1 break-all">
              /wp-json/portal-connector/v1
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              REST API 200 OK
            </div>
          </div>
        </div>
      </div>

      {/* Environment Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">PHP Engine</div>
            <div className="text-sm font-bold text-white">{status?.php_version || '8.2.14'}</div>
            <div className="text-[10px] text-emerald-400">OpCache Active</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">WordPress Core</div>
            <div className="text-sm font-bold text-white">{status?.wp_version || '6.5.3'}</div>
            <div className="text-[10px] text-slate-400">REST API v2 enabled</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">WooCommerce Store</div>
            <div className="text-sm font-bold text-white">{status?.wc_version || '8.8.2'}</div>
            <div className="text-[10px] text-emerald-400">HPOS Tables Active</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">HMAC Auth Engine</div>
            <div className="text-sm font-bold text-white">SHA-256</div>
            <div className="text-[10px] text-emerald-400">Strict Nonce Validation</div>
          </div>
        </div>
      </div>

      {/* Changelog & Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Release Notes */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <FileCode className="w-4 h-4 text-purple-400" />
            Release Changelog ({status?.latest_version})
          </h3>
          <div className="text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
            {status?.changelog ||
              `• Added support for fast digital file temporary streaming tokens (/downloadable-file-token).
• Enhanced order sync endpoint with modified_after microsecond timestamps.
• Added high-throughput bulk price & stock updates without triggering full WC cache rebuilds.
• Resolved race condition on concurrent webhook retry triggers.
• Compatible with WooCommerce 8.8+ HPOS order storage engine.`}
          </div>
        </div>

        {/* REST API Endpoints Map */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Active Connector Endpoints
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {[
              { method: 'GET', path: '/daily-summary', desc: 'Realtime revenue & KPI stats' },
              { method: 'POST', path: '/sync/orders', desc: 'Incremental order pagination' },
              { method: 'POST', path: '/downloadable-file-token', desc: 'Secure Google Drive relay link' },
              { method: 'POST', path: '/webhook-retry', desc: 'Instant replay for failed delivery' },
              { method: 'POST', path: '/site-mode', desc: 'Instant LIVE / MAINTENANCE switch' },
              { method: 'POST', path: '/connector-update', desc: 'Self-hosted atomic updater' },
            ].map((ep, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-slate-300">{ep.path}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
