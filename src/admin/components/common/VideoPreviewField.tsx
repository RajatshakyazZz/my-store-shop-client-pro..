import React, { useState } from 'react';
import {
  Video,
  Play,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Film,
  Sparkles,
} from 'lucide-react';
import { parseHostedVideoUrl, ParsedVideoInfo } from '@/lib/videoUtils';

interface VideoPreviewFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export { parseHostedVideoUrl };
export type { ParsedVideoInfo };

export default function VideoPreviewField({
  value,
  onChange,
  label = 'Dedicated Video Preview URL (View Samples Section)',
  helperText = "Paste a hosted video link (Direct MP4, Cloud CDN, Google Drive preview, or YouTube Shorts). This video is embedded directly in the 'View Samples' section on the product page.",
}: VideoPreviewFieldProps) {
  const [videoError, setVideoError] = useState(false);
  const parsed = parseHostedVideoUrl(value);

  const handleClear = () => {
    onChange('');
    setVideoError(false);
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
      {/* Label and Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-300" />
          <span>Product Page "View Samples"</span>
        </span>
      </div>

      {/* Input Group */}
      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2 transition-all">
        <Video className="w-4 h-4 text-rose-400 mr-2 shrink-0" />
        <input
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setVideoError(false);
          }}
          placeholder="https://domain.com/sample.mp4 or https://drive.google.com/file/d/.../view or YouTube link"
          className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
        />
        {value && (
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              title="Clear link"
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open video in new tab"
              className="p-1 rounded-md text-purple-400 hover:text-purple-300 hover:bg-purple-950/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <p className="text-[11px] text-slate-400 leading-relaxed">{helperText}</p>
      )}

      {/* Status & Live Preview */}
      {parsed.type !== 'empty' && (
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          {/* Format Detection Badge */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Detected: {parsed.label}</span>
            </span>
            <span className="text-[10px] text-slate-400">Live preview below</span>
          </div>

          {/* Interactive Player Preview Box */}
          <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center min-h-[160px] max-h-[260px]">
            {parsed.type === 'direct' && (
              <video
                key={parsed.directUrl}
                src={parsed.directUrl}
                controls
                playsInline
                preload="metadata"
                onError={() => setVideoError(true)}
                className="w-full max-h-[260px] object-contain bg-black"
              />
            )}

            {(parsed.type === 'youtube' || parsed.type === 'drive' || parsed.type === 'vimeo') && (
              <iframe
                src={parsed.embedUrl}
                title="Video Sample Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-[220px] sm:h-[260px] border-0"
              />
            )}

            {parsed.type === 'unknown' && (
              <div className="p-4 text-center text-xs text-amber-300 space-y-1">
                <AlertCircle className="w-5 h-5 mx-auto text-amber-400" />
                <p className="font-bold">Unrecognized video link format</p>
                <p className="text-[10px] text-slate-400">
                  Please use a direct MP4 URL, Google Drive file preview URL, or YouTube link.
                </p>
              </div>
            )}

            {videoError && parsed.type === 'direct' && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center text-xs text-rose-300">
                <AlertCircle className="w-5 h-5 mb-1 text-rose-400" />
                <p className="font-semibold">Unable to stream video directly</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Check if host allows cross-origin streaming or test via link button above.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
