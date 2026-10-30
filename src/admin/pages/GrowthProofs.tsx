import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  Sliders,
  Instagram,
  CheckCircle2,
  ExternalLink,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { AdminGrowthProofsConfig, AdminGrowthProofItem } from '../api/types';
import { useToast } from '../context/ToastContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import ImageUploadField from '../components/common/ImageUploadField';

const DEFAULT_CONFIG: AdminGrowthProofsConfig = {
  enabled: true,
  badge: 'REAL GROWTH PROOF',
  headline: 'Real Growth By Our Bundle Users',
  subheadline: 'These creators acquired our bundles, scaled to 100K+ followers, and monetize daily.',
  autoplay: true,
  autoplayInterval: 4000,
  items: [],
};

export default function GrowthProofsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { isLight } = useAdminTheme();

  const { data: remoteConfig, isLoading } = useQuery({
    queryKey: ['growth-proofs-admin'],
    queryFn: () => portalApi.getGrowthProofs(),
  });

  const [form, setForm] = useState<AdminGrowthProofsConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (remoteConfig) {
      setForm(remoteConfig);
    }
  }, [remoteConfig]);

  const mutation = useMutation({
    mutationFn: (data: AdminGrowthProofsConfig) => portalApi.updateGrowthProofs(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['growth-proofs-admin'], data);
      success('Growth Proofs Saved', `Updated ${data.items.length} screenshots. Storefront updated!`);
    },
    onError: (err: any) => {
      error('Failed to Save', err.message || 'Could not save growth proof configuration.');
    },
  });

  const handleAddItem = () => {
    const newItem: AdminGrowthProofItem = {
      id: `gp-${Date.now()}`,
      image: '',
      title: '@creator_handle',
      followers: '150K Followers',
      metric: '+100K in 30 Days',
      tag: 'AI Reels',
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

  const handleUpdateItem = (index: number, patch: Partial<AdminGrowthProofItem>) => {
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
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Growth Proofs Showcase
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage the 3D Instagram Account & Follower Growth Screenshot carousel displayed across product pages & storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Screenshot</span>
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
            <p className="text-xs text-slate-400">Enable or disable the 3D Growth Proofs section storefront-wide.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
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
              placeholder="REAL GROWTH PROOF"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Real Growth By Our Bundle Users"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subheadline</label>
            <input
              type="text"
              value={form.subheadline}
              onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              placeholder="These creators acquired our bundles, scaled to 100K+ followers, and monetize daily."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Autoplay setting */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.autoplay}
              onChange={(e) => setForm({ ...form, autoplay: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
            />
            <span>Auto-Rotate Carousel (3D Fan-out)</span>
          </label>

          {form.autoplay && (
            <div className="flex items-center gap-2 text-slate-400">
              <span>Speed:</span>
              <select
                value={form.autoplayInterval}
                onChange={(e) => setForm({ ...form, autoplayInterval: Number(e.target.value) })}
                className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
              >
                <option value={3000}>3 Seconds (Fast)</option>
                <option value={4000}>4 Seconds (Standard)</option>
                <option value={5000}>5 Seconds (Relaxed)</option>
                <option value={6000}>6 Seconds (Slow)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Screenshots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Proof Screenshots ({form.items.length})</span>
            <span className="text-xs font-normal text-slate-400">
              (Uploaded screenshots will appear in the 3D coverflow carousel)
            </span>
          </h2>
        </div>

        {form.items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
            <TrendingUp className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-400">No screenshots added yet. Default samples will be shown.</p>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Screenshot</span>
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
                    label={`Screenshot #${index + 1}`}
                    value={item.image}
                    onChange={(url) => handleUpdateItem(index, { image: url })}
                    placeholder="https://... upload screenshot"
                    helperText="Upload mobile screenshot (PNG/JPG)"
                  />
                </div>

                {/* Details Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Creator Account Handle
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(index, { title: e.target.value })}
                      placeholder="@giggle.toons_"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Followers / Reach Tag
                    </label>
                    <input
                      type="text"
                      value={item.followers || ''}
                      onChange={(e) => handleUpdateItem(index, { followers: e.target.value })}
                      placeholder="170K Followers"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Growth Metric Pill
                    </label>
                    <input
                      type="text"
                      value={item.metric || ''}
                      onChange={(e) => handleUpdateItem(index, { metric: e.target.value })}
                      placeholder="+120K in 30 Days"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Bundle / Niche Badge
                    </label>
                    <input
                      type="text"
                      value={item.tag || ''}
                      onChange={(e) => handleUpdateItem(index, { tag: e.target.value })}
                      placeholder="AI Animation"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
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
