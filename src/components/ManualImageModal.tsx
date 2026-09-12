import React, { useState, useRef } from 'react';
import {
  X, Upload, Image as ImageIcon, Check, Link as LinkIcon,
  Loader2, AlertCircle, RefreshCw, Sparkles, Building2, Eye
} from 'lucide-react';
import { Language } from '../types';
import { compressImageFile } from '../utils/imageUpload';

export interface ImagePreset {
  labelAr: string;
  labelEn: string;
  url: string;
  badgeAr?: string;
  badgeEn?: string;
}

interface ManualImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  currentImage: string;
  onSave: (newImageUrl: string) => void;
  lang: Language;
  presets?: ImagePreset[];
  aspectRatioLabel?: string;
}

export const ManualImageModal: React.FC<ManualImageModalProps> = ({
  isOpen,
  onClose,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  currentImage,
  onSave,
  lang,
  presets = [],
  aspectRatioLabel
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [urlInput, setUrlInput] = useState<string>(currentImage || '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentImage || '');
      setUrlInput(currentImage || '');
      setErrorMessage(null);
    }
  }, [isOpen, currentImage]);

  // Handle ESC key to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please choose a valid image file');
      return;
    }

    setIsCompressing(true);
    try {
      // Compress to max 1200px and high visual fidelity
      const compressedDataUrl = await compressImageFile(file, 1200, 900, 0.84);
      setPreviewUrl(compressedDataUrl);
      setUrlInput('');
    } catch (err: any) {
      console.error('Image compression error:', err);
      setErrorMessage(isAr ? 'حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مرة أخرى' : 'Error processing image, please try again');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رابط صورة صالح' : 'Please provide a valid image URL');
      return;
    }
    setPreviewUrl(urlInput.trim());
    setErrorMessage(null);
  };

  const handleConfirmSave = () => {
    if (!previewUrl) {
      setErrorMessage(isAr ? 'يرجى اختيار صورة أولاً' : 'Please select or upload an image first');
      return;
    }
    onSave(previewUrl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#faf9f6] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#141414] font-heading">
                {isAr ? titleAr : titleEn}
              </h3>
              {(descriptionAr || descriptionEn) && (
                <p className="text-xs text-stone-600 mt-0.5">
                  {isAr ? descriptionAr : descriptionEn}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="px-5 sm:px-6 pt-4 flex items-center gap-2 border-b border-stone-100">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#d4af37] text-[#141414]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Upload className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'رفع من الجهاز / الكاميرا' : 'Upload from Device'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'border-[#d4af37] text-[#141414]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'رابط مباشر (URL)' : 'Direct URL'}</span>
          </button>

          {presets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'border-[#d4af37] text-[#141414]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>{isAr ? 'خيارات جاهزة' : 'Presets'}</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: File Upload (Drag & Drop or browse) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[0.99]'
                    : 'border-stone-300 hover:border-[#d4af37] bg-[#faf9f6]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                    <span className="text-xs font-bold text-[#141414]">
                      {isAr ? 'جاري ضغط ومعالجة الصورة بجودة عالية...' : 'Processing and compressing image...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#141414]">
                        {isAr ? 'اضغط لاختيار صورة من جهازك أو اسحبها إلى هنا' : 'Click to browse device or drag and drop here'}
                      </p>
                      <p className="text-xs text-stone-500">
                        {isAr
                          ? 'يدعم JPG, PNG, WebP (يتم ضغط الصورة تلقائياً للحفاظ على السرعة)'
                          : 'Supports JPG, PNG, WebP (auto-compressed client-side)'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 block">
                {isAr ? 'أدخل رابط الصورة المباشر:' : 'Enter Direct Image URL:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden text-xs text-[#141414] bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  {isAr ? 'معاينة' : 'Preview'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Presets */}
          {activeTab === 'presets' && presets.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                {isAr ? 'اختر من النماذج الحقيقية المعتمدة:' : 'Select from authentic presets:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                {presets.map((p, idx) => {
                  const isSelected = previewUrl === p.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setPreviewUrl(p.url);
                        setUrlInput(p.url);
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-4/3 bg-stone-100 ${
                        isSelected
                          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-[1.02]'
                          : 'border-stone-200 hover:border-[#d4af37]/60'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.labelAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                        {p.badgeAr && (
                          <span className="text-[9px] font-bold text-[#d4af37] block">
                            {isAr ? p.badgeAr : p.badgeEn}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-white line-clamp-1">
                          {isAr ? p.labelAr : p.labelEn}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-[#d4af37] text-[#141414] flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          {previewUrl && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#b8860b]" />
                  {isAr ? 'معاينة الصورة الحالية:' : 'Current Preview:'}
                </span>
                {aspectRatioLabel && (
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {aspectRatioLabel}
                  </span>
                )}
              </div>

              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setErrorMessage(isAr ? 'تعذر تحميل هذه الصورة، يرجى التأكد من الرابط أو رفع صورة صالحة' : 'Failed to load preview image');
                  }}
                />
                <div className="absolute bottom-2 end-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#d4af37]" />
                  <span>{isAr ? 'جاهزة للحفظ والتطبيق' : 'Ready to apply'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#faf9f6] border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs sm:text-sm font-bold hover:bg-stone-100 cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={!previewUrl || isCompressing}
            className="px-6 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Check className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'حفظ وتطبيق الصورة فوراً' : 'Save & Apply Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
