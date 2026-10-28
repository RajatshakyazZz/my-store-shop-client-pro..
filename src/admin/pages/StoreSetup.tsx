import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Save, CheckCircle2 } from 'lucide-react';
import { portalApi } from '../api/client';
import { StoreSetupConfig } from '../api/types';
import { useToast } from '../context/ToastContext';

export default function StoreSetup() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: config } = useQuery({
    queryKey: ['store-setup'],
    queryFn: () => portalApi.getStoreSetup(),
  });

  const [form, setForm] = useState<StoreSetupConfig>({
    store_name: 'VaultWorld Store',
    contact_email: 'support.vaultworld.shop@gmail.com',
    support_whatsapp: '+91 8051017331',
    currency: 'INR',
    currency_symbol: '₹',
    price_format: '₹%s',
    auto_complete_digital_orders: true,
    enable_guest_checkout: true,
    order_success_drive_redirect: true,
  });

  React.useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const mutation = useMutation({
    mutationFn: (updated: StoreSetupConfig) => portalApi.updateStoreSetup(updated),
    onSuccess: (data) => {
      queryClient.setQueryData(['store-setup'], data);
      queryClient.invalidateQueries({ queryKey: ['store-setup'] });
      queryClient.invalidateQueries({ queryKey: ['branding-config'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-button'] });
      try {
        localStorage.setItem('rb_portal_settings_general', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('vaultworld:whatsapp_updated', { detail: { phone_number: data.support_whatsapp } }));
        window.dispatchEvent(new CustomEvent('vaultworld:branding_updated', { detail: data }));
        window.dispatchEvent(new CustomEvent('vaultworld:store_setup_updated', { detail: data }));
      } catch {}
      success('Store Settings Saved 🚀', 'Store Name, Support Email and Support Phone saved to Database and synced across the store!');
    },
    onError: () => error('Save Failed', 'Could not save store configuration.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Store Setup & Fulfillment Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Configure currency formatting, digital order auto-completion, and support contacts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Store Name</label>
            <input
              type="text"
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Support Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Helpline / Support Phone</label>
            <input
              type="text"
              placeholder="+91 8051017331"
              value={form.support_whatsapp}
              onChange={(e) => setForm({ ...form, support_whatsapp: e.target.value, support_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Currency Code</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Currency Symbol</label>
            <input
              type="text"
              value={form.currency_symbol}
              onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Checkbox Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.auto_complete_digital_orders}
              onChange={(e) => setForm({ ...form, auto_complete_digital_orders: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600"
            />
            <span className="text-xs font-semibold text-slate-200">
              Auto-complete digital orders immediately upon payment confirmation
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enable_guest_checkout}
              onChange={(e) => setForm({ ...form, enable_guest_checkout: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600"
            />
            <span className="text-xs font-semibold text-slate-200">
              Enable frictionless 1-click guest checkout (no password creation required)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.order_success_drive_redirect}
              onChange={(e) => setForm({ ...form, order_success_drive_redirect: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600"
            />
            <span className="text-xs font-semibold text-slate-200">
              Show instant Google Drive cloud access link on thank-you confirmation screen
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Configuration</span>
        </button>
      </form>

    </div>
  );
}
