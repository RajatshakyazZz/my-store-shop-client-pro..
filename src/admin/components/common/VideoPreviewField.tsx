import React, { useState } from 'react';
import {
  Video,
  Play,
  ExternalLink,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Film,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { parseHostedVideoUrl, ParsedVideoInfo } from '@/lib/videoUtils';

interface VideoPreviewFieldProps {
  values?: string[];
  onChangeUrls?: (urls: string[]) => void;
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  helperText?: string;
}

export { parseHostedVideoUrl };
export type { ParsedVideoInfo };

export default function VideoPreviewField({
  values,
  onChangeUrls,
  value,
  onChange,
  label = 'Dedicated Video Previews (View Samples Section)',
  helperText = "Add 1 or more hosted video links (Direct MP4, Cloud CDN, Google Drive preview, or YouTube Shorts). Each video will appear in the 'View Samples' player on this product's page.",
}: VideoPreviewFieldProps) {
  // Normalize into array of strings
  const rawList = values !== undefined
    ? values
    : value !== undefined
    ? (value.trim() ? [value.trim()] : [])
    : [];

  // Always show at least 1 input slot if empty
  const urlList = rawList.length > 0 ? rawList : [''];

  const [previewOpenIdx, setPreviewOpenIdx] = useState<number | null>(null);
  const [videoErrors, setVideoErrors] = useState<Record<number, boolean>>({});

  const updateList = (newList: string[]) => {
    if (onChangeUrls) {
      onChangeUrls(newList);
    }
    if (onChange) {
      onChange(newList[0] || '');
    }
  };

  const handleChangeAt = (idx: number, newUrl: string) => {
    const updated = [...urlList];
    updated[idx] = newUrl;
    updateList(updated);
    setVideoErrors((prev) => ({ ...prev, [idx]: false }));
  };

  const handleAddSlot = () => {
    const updated = [...urlList, ''];
    updateList(updated);
  };

  const handleRemoveAt = (idx: number) => {
    const updated = urlList.filter((_, i) => i !== idx);
    // If all removed, keep 1 empty slot
    updateList(updated.length > 0 ? updated : ['']);
  };

  const validCount = urlList.filter((u) => Boolean(u && u.trim())).length;

  return (
    <div className="space-y-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
      {/* Label and Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>Multiple Videos Supported</span>
          </span>
          {validCount > 0 && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {validCount} {validCount === 1 ? 'Video' : 'Videos'} Added
            </span>
          )}
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-relaxed">{helperText}</p>
      )}

      {/* Video Slots List */}
      <div className="space-y-3">
        {urlList.map((url, idx) => {
          const parsed = parseHostedVideoUrl(url);
          const hasUrl = Boolean(url && url.trim());
          const isPreviewing = previewOpenIdx === idx;
          const hasError = videoErrors[idx];

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 transition-all"
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sample Video #{idx + 1}</span>
                </span>

                <div className="flex items-center gap-2">
                  {hasUrl && parsed.type !== 'empty' && (
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{parsed.label}</span>
                    </span>
                  )}
                  {hasUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewOpenIdx(isPreviewing ? null : idx)}
                      className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                      title={isPreviewing ? 'Hide live preview' : 'Show live preview'}
                    >
                      {isPreviewing ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hide Player</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>Test Play</span>
                        </>
                      )}
                    </button>
                  )}
                  {urlList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAt(idx)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Remove this video preview"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Input Group */}
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2 transition-all">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleChangeAt(idx, e.target.value)}
                  placeholder={`https://domain.com/sample-${idx + 1}.mp4 or Google Drive or YouTube Shorts URL`}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                />
                {hasUrl && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open link in new tab"
                    className="p-1 rounded-md text-purple-400 hover:text-purple-300 hover:bg-purple-950/60 transition-colors ml-2 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Inline Player Preview (Toggled or shown on test play) */}
              {isPreviewing && hasUrl && (
                <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center min-h-[160px] max-h-[260px] mt-2">
                  {parsed.type === 'direct' && (
                    <video
                      key={parsed.directUrl}
                      src={parsed.directUrl}
                      controls
                      playsInline
                      preload="metadata"
                      onError={() =>
                        setVideoErrors((prev) => ({ ...prev, [idx]: true }))
                      }
                      className="w-full max-h-[260px] object-contain bg-black"
                    />
                  )}

                  {(parsed.type === 'youtube' ||
                    parsed.type === 'drive' ||
                    parsed.type === 'vimeo') && (
                    <iframe
                      src={parsed.embedUrl}
                      title={`Sample Video #${idx + 1} Preview`}
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

                  {hasError && parsed.type === 'direct' && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center text-xs text-rose-300">
                      <AlertCircle className="w-5 h-5 mb-1 text-rose-400" />
                      <p className="font-semibold">Unable to stream video directly</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Test via external link button (↗) above.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Another Video Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleAddSlot}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Another Sample Video (Reel Preview)</span>
        </button>
      </div>
    </div>
  );
}
