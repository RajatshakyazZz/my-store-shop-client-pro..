import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, Plus, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalApi } from '../../api/client';

interface GalleryImageManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  helperText?: string;
}

export default function GalleryImageManager({
  value,
  onChange,
  label = 'Gallery Images',
  helperText = 'Additional preview screenshots displayed on the bundle details page.',
}: GalleryImageManagerProps) {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualTextarea, setShowManualTextarea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Parse images array from newline-separated string
  const images = value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated.join('\n'));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    setUploadError(null);

    // 1. Client-side Format Validation (Strictly .png, .jpg, .jpeg)
    const validExtensions = ['.png', '.jpg', '.jpeg'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    const validMimes = ['image/png', 'image/jpeg', 'image/pjpeg', 'image/jpg'];
    const hasValidMime = validMimes.includes(file.type.toLowerCase());

    if (!hasValidExt || !hasValidMime) {
      const msg = 'Invalid file format! Only .PNG, .JPG, and .JPEG images are supported.';
      setUploadError(msg);
      error('Unsupported File Format', msg);
      return;
    }

    // 2. Client-side Size Validation (Max 32 MB)
    const MAX_SIZE = 32 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const msg = `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 32 MB limit.`;
      setUploadError(msg);
      error('File Too Large', msg);
      return;
    }

    // 3. Upload to ImgBB
    setIsUploading(true);
    try {
      const result = await portalApi.uploadImage(file);
      const newImages = [...images, result.url];
      onChange(newImages.join('\n'));
      setUploadError(null);
      success('Gallery Image Added', 'Uploaded image securely hosted on ImgBB CDN!');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to upload gallery image';
      setUploadError(errMsg);
      error('Upload Error', errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">
          {label} ({images.length})
        </label>
        <button
          type="button"
          onClick={() => setShowManualTextarea(!showManualTextarea)}
          className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
        >
          {showManualTextarea ? 'Hide Direct URLs' : 'Edit URLs Manually'}
        </button>
      </div>

      {/* Upload Button + Gallery Grid */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        {/* Upload Trigger Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            id={`gallery-upload-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`gallery-upload-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm ${
              isUploading
                ? 'bg-purple-900/50 text-purple-200 border border-purple-700/50 cursor-wait'
                : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 active:scale-95'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Uploading to ImgBB...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload Photo to Gallery</span>
              </>
            )}
          </label>

          {/* Format Specification Banner */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span>
              Accepted: <strong className="text-purple-300">.PNG, .JPG, .JPEG only</strong> (Max 32 MB)
            </span>
          </div>
        </div>

        {/* Gallery Thumbnails Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700"
                    title="View full image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-500"
                    title="Remove from gallery"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm text-[9px] font-mono font-bold text-slate-300 px-1.5 py-0.5 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center border border-dashed border-slate-800/80 rounded-xl text-slate-500 text-xs flex flex-col items-center justify-center gap-1">
            <ImageIcon className="w-5 h-5 text-slate-600 mb-0.5" />
            <span>No gallery images added yet.</span>
            <span className="text-[11px] text-slate-600">
              Tap "Upload Photo to Gallery" to upload directly from your phone or device.
            </span>
          </div>
        )}

        {/* Optional Manual Textarea */}
        {showManualTextarea && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Direct Image URLs (One URL per line):
            </label>
            <textarea
              rows={3}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://i.ibb.co/...&#10;https://i.ibb.co/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{uploadError}</p>
            <p className="text-[11px] text-rose-400/90 mt-1">
              Tip: Go to{' '}
              <a
                href="/asdf/settings"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-rose-200 hover:text-white"
              >
                Settings &gt; Integrations &gt; ImgBB CDN
              </a>{' '}
              to save your free API key from{' '}
              <a
                href="https://api.imgbb.com/"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-rose-200 hover:text-white"
              >
                api.imgbb.com
              </a>{' '}
              (works instantly without redeploying). Or click &quot;Edit URLs Manually&quot; above to paste direct image links.
            </p>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}
