import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalApi } from '../../api/client';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'https://i.ibb.co/... or https://...',
  required = false,
  helperText = 'Plays as the main bundle display card across the storefront.',
}: ImageUploadFieldProps) {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isImgBB = value && (value.includes('ibb.co') || value.includes('i.ibb.co'));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so re-selecting same file triggers change
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
      const msg = 'Invalid format! Only .PNG, .JPG, and .JPEG files are allowed.';
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

    // 3. Perform Secure Upload
    setIsUploading(true);
    try {
      const result = await portalApi.uploadImage(file);
      onChange(result.url);
      setUploadError(null);
      success('Image Uploaded', 'Product cover image hosted securely on ImgBB CDN!');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to upload image to ImgBB';
      setUploadError(errMsg);
      error('Upload Error', errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {isImgBB && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            ImgBB CDN Hosted
          </span>
        )}
      </div>

      {/* Main input and preview row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* URL Input */}
        <div className="flex-1 flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5 transition-colors">
          <ImageIcon className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
          <input
            type="url"
            required={required}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setUploadError(null);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
              title="Clear URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
              isUploading
                ? 'bg-purple-900/50 text-purple-200 border border-purple-700/50 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30 active:scale-95'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>Upload from Gallery</span>
              </>
            )}
          </label>

          {/* Quick Preview Thumbnail */}
          {value && (
            <div className="relative group shrink-0">
              <img
                src={value}
                alt="Cover Preview"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700 shadow-inner bg-slate-900"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity text-white"
                title="View full image in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Rules and Allowed Formats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span>
            Accepted: <strong className="text-purple-300 font-semibold">.PNG, .JPG, .JPEG only</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>Max Size: <strong className="text-slate-300 font-medium">32 MB</strong></span>
        </div>
        <span className="text-[10px] text-slate-500">
          Secure Vercel API → ImgBB CDN
        </span>
      </div>

      {/* Inline Upload Error Notice */}
      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{uploadError}</p>
            {uploadError.includes('IMGBB_API_KEY') && (
              <p className="text-[11px] text-rose-400/90 mt-1">
                Tip: Copy your free ImgBB API key from{' '}
                <a
                  href="https://api.imgbb.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-rose-200 hover:text-white"
                >
                  api.imgbb.com
                </a>{' '}
                and add <code className="bg-rose-950 px-1 py-0.5 rounded text-amber-300">IMGBB_API_KEY</code> to your
                Vercel Project Settings &gt; Environment Variables.
              </p>
            )}
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}
