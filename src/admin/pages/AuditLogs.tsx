import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Database,
  ArrowDownToLine,
} from 'lucide-react';
import { getRecentAuditLogs, AdminAuditEntry } from '../lib/firebase';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../lib/utils';

export default function AuditLogs() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');

  const { data: logs = [], isLoading, refetch, isFetching } = useQuery<AdminAuditEntry[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: () => getRecentAuditLogs(),
    refetchInterval: 15000, // auto-refresh every 15s
  });

  const modules = ['ALL', ...Array.from(new Set(logs.map((l) => l.module).filter(Boolean)))];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ztore_audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Audit Logs Exported',
      message: `Exported ${logs.length} audit entries to JSON.`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Security & Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable admin activity logs streamed live to Firebase Firestore with timestamping and role tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-purple-400' : ''}`} />
            <span>Sync Trail</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Security Status Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Firebase Cloud Firestore Auditing</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Collection: <code className="text-purple-300 font-mono">admin_audit_logs</code> • Retention: 90 Days
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div>
            Total Entries: <span className="font-bold text-white">{logs.length}</span>
          </div>
          <div>•</div>
          <div>
            Filter Matches: <span className="font-bold text-purple-300">{filteredLogs.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by admin email, action or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium w-full sm:w-auto"
          >
            {modules.map((m) => (
              <option key={m} value={m}>
                {m === 'ALL' ? 'All Modules' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-500" />
            Loading live audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No audit log records match your filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Operator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-white">{log.adminEmail}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-300">{log.module}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
