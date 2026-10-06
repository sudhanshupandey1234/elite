'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, Video, X, Loader2, Link2 } from 'lucide-react';

interface MediaUploaderProps {
  kind: 'image' | 'video';
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

/**
 * Photo / video picker for admin forms.
 * Uploads the file to /api/admin/upload (Vercel Blob) and returns its URL,
 * or accepts a pasted URL (e.g. a YouTube link for videos).
 */
export function MediaUploader({ kind, label, value, onChange, hint }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  const isVideo = kind === 'video';
  const Icon = isVideo ? Video : ImagePlus;
  const accept = isVideo ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('kind', kind);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      setShowUrl(false);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700">{label}</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          {isVideo ? (
            <video src={value} controls className="w-full max-h-44 object-contain bg-black" />
          ) : (
            <img src={value} alt={label} className="w-full max-h-44 object-contain bg-slate-100" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/50 transition-colors p-6 flex flex-col items-center gap-2 text-slate-500"
        >
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          ) : (
            <Icon className="w-7 h-7" />
          )}
          <span className="text-xs font-semibold">
            {uploading ? 'Uploading...' : isVideo ? 'Upload product video' : 'Upload product photo'}
          </span>
          <span className="text-[11px] text-slate-400">
            {isVideo ? 'MP4 / WebM / MOV, max 100MB' : 'JPG / PNG / WebP / GIF, max 8MB'}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}

      <button
        type="button"
        onClick={() => setShowUrl((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
      >
        <Link2 className="w-3.5 h-3.5" />
        {showUrl ? 'Hide URL field' : 'Or paste a link instead'}
      </button>

      {showUrl && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isVideo ? 'Paste video URL (YouTube link works too)' : 'Paste image URL'}
          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
        />
      )}

      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
