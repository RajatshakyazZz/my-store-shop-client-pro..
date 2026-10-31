import React from 'react';
import { TrendingUp, Users, Star, Award } from 'lucide-react';

export default function CreatorProof() {
  const stats = [
    { value: '14.2M+', label: 'Organic Views Generated', icon: TrendingUp, color: 'text-red-700 bg-red-50 border border-red-200/50' },
    { value: '3,850+', label: 'Creators & Agencies', icon: Users, color: 'text-slate-900 bg-slate-100 border border-slate-200' },
    { value: '4.9 / 5', label: 'Average User Rating', icon: Star, color: 'text-red-600 bg-red-50 border border-red-200/50' },
    { value: '100%', label: 'Watermark-Free HD Quality', icon: Award, color: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
  ];

  const testimonials = [
    {
      name: 'Aman Verma',
      channel: '@tech_insights_ai',
      followers: '145K Followers',
      quote: 'The AI Reels pack helped me scale from 5K to 100K followers in just 45 days. The 9:16 framing and audio syncing are top tier.',
      metric: '+95K Followers in 30 Days',
    },
    {
      name: 'Pooja Kashyap',
      channel: '@daily_motivation_hub',
      followers: '280K Followers',
      quote: 'I purchased the Reseller Rights plan and started selling niche reels to agency clients. Made back my investment 10x in the first week.',
      metric: '₹45,000+ Resale Revenue',
    },
    {
      name: 'Rohan Mehra',
      channel: '@satisfying_daily_viral',
      followers: '520K Followers',
      quote: 'High retention is guaranteed. My average watch percentage jumped from 60% to 110% on YouTube Shorts with the ASMR pack.',
      metric: '8.4M Views on Single Short',
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-slate-100 [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-900 border border-red-200/60 text-xs font-black uppercase tracking-wider mb-2">
            📊 Proven Results
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Creator Growth in Real Numbers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            See how creators and page owners are dominating the algorithm with our ready-to-post reels.
          </p>
        </div>

        {/* Stats 4-Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(239,68,68,0.1)] transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} mb-1`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {t.metric}
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950">{t.name}</h3>
                  <p className="text-xs text-red-700 font-bold">{t.channel}</p>
                </div>
                <span className="text-xs font-bold text-slate-500">{t.followers}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
