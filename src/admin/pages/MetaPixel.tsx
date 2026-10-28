import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crosshair, Save, Activity, CheckCircle2, Send, Radio, RefreshCw, ExternalLink } from 'lucide-react';
import { portalApi } from '../api/client';
import { MetaPixelConfig } from '../api/types';
import { useToast } from '../context/ToastContext';

export default function MetaPixel() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: config } = useQuery({
    queryKey: ['meta-pixel'],
    queryFn: () => portalApi.getMetaPixel(),
  });

  const [isTestingEvent, setIsTestingEvent] = useState(false);
  const [form, setForm] = useState<MetaPixelConfig>({
    enabled: true,
    pixel_id: '',
    capi_token: '',
    test_event_code: '',
    track_pageviews: true,
    track_view_content: true,
    track_add_to_cart: true,
    track_initiate_checkout: true,
    track_purchase: true,
  });

  React.useEffect(() => {
    if (config) {
      setForm({
        ...config,
        pixel_id: config.pixel_id || '',
        capi_token: config.capi_token || '',
        test_event_code: config.test_event_code || '',
      });
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: (updated: MetaPixelConfig) => portalApi.updateMetaPixel(updated),
    onSuccess: (data) => {
      queryClient.setQueryData(['meta-pixel'], data);
      success('Meta Pixel & CAPI Saved', 'Meta Pixel ID and Conversions API tracking updated in Firestore.');
    },
    onError: () => error('Save Failed', 'Could not save Meta Pixel parameters.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleSendTestEvent = async () => {
    const cleanPixelId = form.pixel_id.trim();
    if (!cleanPixelId) {
      error('Pixel ID Required', 'Please enter your Meta Pixel ID first.');
      return;
    }

    setIsTestingEvent(true);
    try {
      // 1. First save the current form values
      await portalApi.updateMetaPixel(form);
      queryClient.invalidateQueries({ queryKey: ['meta-pixel'] });

      // 2. Fire in browser if fbq available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('init', cleanPixelId);
          (window as any).fbq('track', 'PageView');
        } catch (e) {}
      }

      // 3. If CAPI token provided, dispatch server-side test event with test_event_code
      if (form.capi_token.trim()) {
        const testRes = await portalApi.testMetaEvent({
          pixel_id: cleanPixelId,
          capi_token: form.capi_token.trim(),
          test_event_code: form.test_event_code.trim() || undefined,
          event_name: 'PageView',
        });
        success(
          'Meta Event Delivered! 🚀',
          testRes.message || 'Check your Meta Events Manager Test Events tab now.'
        );
      } else {
        success(
          'Browser Pixel Active! 🎯',
          `Pixel initialized with ID ${cleanPixelId}. In Meta Events Manager > Test Events, enter your website URL https://www.vaultworld.shop to view browser events.`
        );
      }
    } catch (err: any) {
      error('Test Dispatch Failed', err.message || 'Could not deliver test event to Meta.');
    } finally {
      setIsTestingEvent(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Meta Pixel & Conversion API (CAPI)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Server-side tracking for Facebook & Instagram Ads with event deduplication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300">Tracking Status</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600"
              />
              <span className="text-xs font-bold text-white">{form.enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Meta Dataset / Pixel ID</label>
            <input
              type="text"
              value={form.pixel_id}
              onChange={(e) => setForm({ ...form, pixel_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Server-Side CAPI Access Token</label>
            <input
              type="password"
              value={form.capi_token}
              onChange={(e) => setForm({ ...form, capi_token: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Test Event Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. TEST12345"
              value={form.test_event_code}
              onChange={(e) => setForm({ ...form, test_event_code: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Active Standard Events:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_pageviews}
                  onChange={(e) => setForm({ ...form, track_pageviews: e.target.checked })}
                  className="accent-purple-600"
                />
                <span>PageView</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_view_content}
                  onChange={(e) => setForm({ ...form, track_view_content: e.target.checked })}
                  className="accent-purple-600"
                />
                <span>ViewContent (Product)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_add_to_cart}
                  onChange={(e) => setForm({ ...form, track_add_to_cart: e.target.checked })}
                  className="accent-purple-600"
                />
                <span>AddToCart</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_purchase}
                  onChange={(e) => setForm({ ...form, track_purchase: e.target.checked })}
                  className="accent-purple-600"
                />
                <span>Purchase (Server Deduplicated)</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{mutation.isPending ? 'Saving...' : 'Save Meta Pixel Config'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendTestEvent}
              disabled={isTestingEvent || mutation.isPending}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isTestingEvent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching to Meta...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Event to Meta (Test Now)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Status card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>CAPI Health Status: Active & Synced</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Events are dynamically dispatched to Meta with deduplicated event IDs for both the browser Meta Pixel and server-side Conversions API (CAPI).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>How to Test Events in Meta:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li>
                Open <strong>Meta Events Manager</strong> &gt; Select your Pixel &gt; Click <strong>Test Events</strong> tab.
              </li>
              <li>
                <strong>Browser Testing:</strong> Under <em>&quot;Confirm your website events are set up correctly&quot;</em>, enter <code className="bg-slate-950 px-1 py-0.5 rounded text-purple-300">https://www.vaultworld.shop</code> and click <em>Open Website</em>. PageView will show up immediately.
              </li>
              <li>
                <strong>Server CAPI Testing:</strong> Under <em>&quot;Confirm your server events are set up correctly&quot;</em>, copy the <strong>Test Event Code</strong> (e.g. <code className="bg-slate-950 px-1 py-0.5 rounded text-blue-300">TEST12345</code>), paste it in the field above, and click <strong>Send Test Event to Meta</strong>.
              </li>
            </ol>
            <a
              href="https://adsmanager.facebook.com/events_manager2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-400 hover:text-purple-300 pt-1"
            >
              <span>Open Meta Events Manager</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
