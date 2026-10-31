import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Save, PhoneCall, Sparkles } from 'lucide-react';
import { portalApi } from '../api/client';
import { WhatsappButtonConfig } from '../api/types';
import { useToast } from '../context/ToastContext';

export default function WhatsappButton() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: config } = useQuery({
    queryKey: ['whatsapp-button'],
    queryFn: () => portalApi.getWhatsappButton(),
  });

  const [form, setForm] = useState<WhatsappButtonConfig>({
    enabled: true,
    phone_number: '918807281600',
    default_message: 'Hi Ztore Digital Support! I have a question regarding the bundles.',
    position: 'bottom-right',
    show_popup_badge: true,
    popup_text: 'Need help? Chat on WhatsApp',
    button_color: '#25D366',
  });

  React.useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const mutation = useMutation({
    mutationFn: (updated: WhatsappButtonConfig) => portalApi.updateWhatsappButton(updated),
    onSuccess: (data) => {
      queryClient.setQueryData(['whatsapp-button'], data);
      try {
        localStorage.setItem('rb_portal_settings_whatsapp', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('vaultworld:whatsapp_updated', { detail: data }));
      } catch {}
      success('WhatsApp Button Saved', 'Floating button settings updated across customer store.');
    },
    onError: () => error('Save Failed', 'Could not save WhatsApp button configuration.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Floating WhatsApp Support Button
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Provide instant 1-click WhatsApp customer support for buyers during checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300">Widget Enabled</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600"
              />
              <span className="text-xs font-bold text-white">{form.enabled ? 'Active' : 'Hidden'}</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">WhatsApp Number (with country code)</label>
            <input
              type="text"
              placeholder="e.g. 919876543210"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Pre-filled Greeting Message</label>
            <textarea
              rows={3}
              value={form.default_message}
              onChange={(e) => setForm({ ...form, default_message: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Floating Popup Badge Text</label>
            <input
              type="text"
              value={form.popup_text}
              onChange={(e) => setForm({ ...form, popup_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Screen Position</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Button Hex Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={form.button_color}
                  onChange={(e) => setForm({ ...form, button_color: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300">{form.button_color}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Save WhatsApp Configuration</span>
          </button>
        </form>

        {/* Live Preview Screen */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Customer Mobile Screen Preview</span>
          </h3>

          <div className="h-80 rounded-2xl bg-slate-950 border border-slate-800 relative p-4 flex flex-col justify-end">
            <div className="absolute top-4 left-4 text-[11px] text-slate-500 font-mono">
              Ztore Digital (Mobile Viewport)
            </div>

            {/* Floating button */}
            <div
              className={`absolute bottom-5 ${
                form.position === 'bottom-right' ? 'right-5' : 'left-5'
              } flex items-center gap-2.5`}
            >
              {form.show_popup_badge && (
                <div className="px-3 py-1.5 rounded-xl bg-white text-slate-950 text-[11px] font-black shadow-xl animate-bounce">
                  {form.popup_text}
                </div>
              )}
              <div
                style={{ backgroundColor: form.button_color }}
                className="w-13 h-13 p-3 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
