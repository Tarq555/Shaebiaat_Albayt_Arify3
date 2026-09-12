import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Check, X,
  Loader2, AlertCircle, Link as LinkIcon, RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { compressImageFile } from '../utils/imageUpload';

interface DragDropImageUploadProps {
  currentImage?: string;
  onImageChange: (dataUrlOrUrl: string) => void;
  lang: Language;
  labelAr?: string;
  labelEn?: string;
  subLabelAr?: string;
  subLabelEn?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'tall';
  maxWidth?: number;
  maxHeight?: number;
  allowUrl?: boolean;
  className?: string;
  compact?: boolean;
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  currentImage = '',
  onImageChange,
  lang,
  labelAr = 'رفع أو إسقاط صورة من جهازك',
  labelEn = 'Upload or Drop Image from Device',
  subLabelAr = 'اسحب الصورة وأفلتها هنا، أو اضغط لاختيار ملف من الكمبيوتر أو الجوال',
  subLabelEn = 'Drag and drop image here, or click to browse from device',
  aspectRatio = 'video',
  maxWidth = 1400,
  maxHeight = 1000,
  allowUrl = true,
  className = '',
  compact = false
}) => {
  const isAr = lang === 'ar';
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessToast(null);

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        isAr
          ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP, GIF)'
          : 'Please select a valid image file (JPG, PNG, WebP, GIF)'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, maxWidth, maxHeight, 0.85);
      onImageChange(compressedDataUrl);
      setSuccessToast(isAr ? 'تم تحميل وضغط الصورة بنجاح!' : 'Image uploaded successfully!');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      console.error('Image compression error:', err);
      setErrorMessage(
        isAr
          ? 'تعذر معالجة الصورة، يرجى اختيار صورة أخرى أو التأكد من سلامة الملف'
          : 'Failed to process image, please try another file'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage(isAr ? 'يرجى كتابة رابط صورة صحيح' : 'Please provide a valid image URL');
      return;
    }
    onImageChange(urlInput.trim());
    setSuccessToast(isAr ? 'تم تطبيق رابط الصورة بنجاح!' : 'Image URL applied!');
    setTimeout(() => setSuccessToast(null), 3000);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[200px]';
      case 'tall':
        return 'aspect-3/4 max-w-[220px]';
      case 'banner':
        return 'aspect-21/9 max-h-[220px]';
      case 'video':
      default:
        return 'aspect-video max-h-[240px]';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden group ${
          isDragOver
            ? 'border-[#d4af37] bg-[#d4af37]/15 scale-[0.99] shadow-lg ring-2 ring-[#d4af37]/30'
            : 'border-stone-300 hover:border-[#d4af37] bg-[#faf9f6] hover:bg-stone-50'
        } ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-md animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
            </div>
            <p className="text-xs font-bold text-[#141414]">
              {isAr ? 'جاري ضغط ومعالجة الصورة من جهازك...' : 'Compressing & processing photo...'}
            </p>
            <span className="text-[11px] text-stone-500">
              {isAr ? 'يتم تحسين الأبعاد لسرعة التحميل وفخامة العرض' : 'Optimizing dimensions for best performance'}
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Thumbnail / Icon */}
            {currentImage ? (
              <div className={`relative rounded-xl overflow-hidden border-2 border-[#d4af37]/60 shadow-xs shrink-0 w-24 sm:w-28 ${getAspectClass()} bg-stone-100`}>
                <img
                  src={currentImage}
                  alt="Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                    {isAr ? 'تغيير' : 'Change'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
            )}

            {/* Instruction Text & Call To Action */}
            <div className="flex-1 text-center sm:text-start space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h5 className="text-xs sm:text-sm font-bold text-[#141414] font-heading flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <span>{isAr ? labelAr : labelEn}</span>
                </h5>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#141414] text-[10px] font-extrabold border border-[#d4af37]/40">
                  {isAr ? 'إسقاط مباشر أو تصفح' : 'Drag & Drop or Browse'}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                {isAr ? subLabelAr : subLabelEn}
              </p>

              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-black text-white text-xs font-bold transition-all shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isAr ? 'اختر ملفاً من جهازك' : 'Browse from Device'}</span>
                </span>
                <span className="text-[11px] text-stone-600 font-medium">
                  {isAr ? 'أو اسحب الصورة هنا بالماوس' : 'or drag and drop file'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Secondary URL Option Toggle */}
      {allowUrl && (
        <div className="pt-1">
          {!showUrlInput ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(true);
              }}
              className="text-[11px] font-bold text-stone-500 hover:text-[#141414] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAr ? 'هل تفضل استخدام رابط صورة مباشر (URL)؟ اضغط هنا' : 'Prefer using direct image URL? Click here'}</span>
            </button>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isAr ? 'رابط الصورة المباشر:' : 'Direct Image URL:'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-[#faf9f6] focus:outline-hidden focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isAr ? 'تطبيق الرابط' : 'Apply URL'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
