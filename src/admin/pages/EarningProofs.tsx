import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DollarSign,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  CreditCard,
  Layers,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { AdminEarningProofsConfig, AdminEarningProofItem } from '../api/types';
import { useToast } from '../context/ToastContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import ImageUploadField from '../components/common/ImageUploadField';

const DEFAULT_CONFIG: AdminEarningProofsConfig = {
  enabled: true,
  badge: '💰 VERIFIED EARNINGS & PAYOUTS',
  headline: 'Real Creator & Reseller Earnings',
  subheadline: 'Genuine payment receipts, bank transfers and reseller profits made with our reels bundles.',
  items: [],
};

export default function EarningProofsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { isLight } = useAdminTheme();

  const { data: remoteConfig, isLoading } = useQuery({
    queryKey: ['earning-proofs-admin'],
    queryFn: () => portalApi.getEarningProofs(),
  });

  const [form, setForm] = useState<AdminEarningProofsConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (remoteConfig) {
      setForm(remoteConfig);
    }
  }, [remoteConfig]);

  const mutation = useMutation({
    mutationFn: (data: AdminEarningProofsConfig) => portalApi.updateEarningProofs(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['earning-proofs-admin'], data);
      success('Earning Proofs Saved', `Updated ${data.items.length} payment screenshots. Storefront updated!`);
    },
    onError: (err: any) => {
      error('Failed to Save', err.message || 'Could not save earning proofs.');
    },
  });

  const handleAddItem = () => {
    const newItem: AdminEarningProofItem = {
      id: `ep-${Date.now()}`,
      image: '',
      amount: '₹25,000',
      tag: 'UPI Received',
      caption: 'Creator Profit — Weekly sales from AI reels',
      date: 'Yesterday',
    };
    setForm((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const copy = [...prev.items];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, items: copy };
    });
  };

  const handleUpdateItem = (index: number, patch: Partial<AdminEarningProofItem>) => {
    setForm((prev) => {
      const copy = [...prev.items];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, items: copy };
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Earning Proofs Showcase
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload payment screenshots, UPI receipts & reseller earnings proofs to boost checkout conversion & buyer trust.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment Screenshot</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{mutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Global Section Controls */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">Section Visibility</h3>
            <p className="text-xs text-slate-400">Enable or disable the Earning Proofs section storefront-wide.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            <span className="ml-3 text-xs font-bold text-slate-300">
              {form.enabled ? 'ACTIVE (Visible)' : 'DISABLED (Hidden)'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Section Badge</label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="💰 VERIFIED EARNINGS & PAYOUTS"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Real Creator & Reseller Earnings"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subheadline</label>
            <input
              type="text"
              value={form.subheadline}
              onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              placeholder="Genuine payment receipts, bank transfers and reseller profits made with our reels bundles."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Screenshots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Payment Proofs ({form.items.length})</span>
            <span className="text-xs font-normal text-slate-400">
              (UPI receipts, Bank SMS, or Reseller Dashboard screenshots)
            </span>
          </h2>
        </div>

        {form.items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
            <Wallet className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-400">No payment screenshots added yet. Default samples will be shown.</p>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Payment Screenshot</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {form.items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-5 items-start transition-all hover:border-slate-700"
              >
                {/* Screenshot Upload / Preview */}
                <div className="w-full md:w-56 shrink-0">
                  <ImageUploadField
                    label={`Payment Proof #${index + 1}`}
                    value={item.image}
                    onChange={(url) => handleUpdateItem(index, { image: url })}
                    placeholder="https://... upload payment proof"
                    helperText="Upload UPI/Bank screenshot (PNG/JPG)"
                  />
                </div>

                {/* Details Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Amount Earned / Received
                    </label>
                    <input
                      type="text"
                      value={item.amount}
                      onChange={(e) => handleUpdateItem(index, { amount: e.target.value })}
                      placeholder="₹28,450"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Payment Method / Tag
                    </label>
                    <input
                      type="text"
                      value={item.tag}
                      onChange={(e) => handleUpdateItem(index, { tag: e.target.value })}
                      placeholder="UPI Received / Bank Transfer"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Caption / Reseller Story
                    </label>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleUpdateItem(index, { caption: e.target.value })}
                      placeholder="Rahul Verma — Weekly profit reselling AI reels to client pages"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Date / Note
                    </label>
                    <input
                      type="text"
                      value={item.date || ''}
                      onChange={(e) => handleUpdateItem(index, { date: e.target.value })}
                      placeholder="Yesterday / 3 days ago"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Actions (Move & Delete) */}
                <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === form.items.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete Screenshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
