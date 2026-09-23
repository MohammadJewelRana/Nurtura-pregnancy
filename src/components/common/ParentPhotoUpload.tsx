'use client';

import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Trash2, User, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { compressImageToBlob, ParentPhotoType } from '@/lib/storage/parent-photos';

interface ParentPhotoUploadProps {
  type: ParentPhotoType;
  label: string;
  photoUrl: string | null;
  onUpload: (photo: Blob | string) => Promise<void>;
  onRemove: () => Promise<void>;
  compact?: boolean;
}

export function ParentPhotoUpload({
  type,
  label,
  photoUrl,
  onUpload,
  onRemove,
  compact = false,
}: ParentPhotoUploadProps) {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setErrorMessage(null);

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage(
        language === 'bn'
          ? 'দয়া করে JPG, PNG বা WebP ছবি নির্বাচন করুন।'
          : 'Please select a JPG, PNG, or WebP image.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsProcessing(true);
      // Compress to max 600px width/height and quality 0.85
      const { blob } = await compressImageToBlob(file, 600, 600, 0.85);
      await onUpload(blob);
    } catch (err) {
      console.warn('[ParentPhotoUpload] Upload error:', err);
      setErrorMessage(
        language === 'bn'
          ? 'ছবি সংরক্ষণ করতে সমস্যা হয়েছে।'
          : 'Failed to process and save photo.'
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    try {
      setIsProcessing(true);
      await onRemove();
    } catch (err) {
      console.warn('[ParentPhotoUpload] Remove error:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 rounded-xl bg-navy-elevated/70 border border-navy-border space-y-3">
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-text-primary flex items-center space-x-1.5">
          {type === 'mother' ? (
            <Heart className="w-3.5 h-3.5 text-emerald" />
          ) : (
            <User className="w-3.5 h-3.5 text-emerald-accent" />
          )}
          <span>{label}</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
          {language === 'bn' ? 'ঐচ্ছিক' : 'Optional'}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Photo Avatar Frame */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-navy-surface border-2 border-navy-border flex items-center justify-center overflow-hidden shadow-subtle relative group">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-text-muted">
                <Camera className="w-6 h-6 text-text-muted/60" />
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-navy-bg/80 backdrop-blur-sm flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-emerald animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            {!photoUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="py-2 px-3.5 rounded-xl bg-emerald/15 border border-emerald/30 text-emerald hover:bg-emerald/25 text-xs font-bold inline-flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t.parentPhotos.uploadPhoto}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="py-1.5 px-3 rounded-xl bg-navy-surface border border-navy-border text-text-secondary hover:text-emerald hover:border-emerald/40 text-xs font-semibold inline-flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3 text-emerald" />
                  <span>{t.parentPhotos.replacePhoto}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isProcessing}
                  className="py-1.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold inline-flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.parentPhotos.removePhoto}</span>
                </button>
              </>
            )}
          </div>

          <p className="text-[10px] text-text-muted leading-tight">
            {language === 'bn'
              ? 'JPG, PNG, WebP • আপনার ডিভাইসেই সুরক্ষিত'
              : 'JPG, PNG, WebP • Stored privately on device'}
          </p>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-rose-400 pt-1 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
