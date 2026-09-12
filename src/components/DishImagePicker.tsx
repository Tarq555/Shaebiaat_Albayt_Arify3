import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Check, Sparkles, Link,
  Search, AlertCircle, RefreshCw, X, Loader2
} from 'lucide-react';
import { FOOD_PRESET_IMAGES } from '../data/foodImageLibrary';
import { Language } from '../types';

interface DishImagePickerProps {
  currentImageUrl: string;
  onSelectImage: (url: string) => void;
  lang: Language;
  label?: string;
}

// Compress and resize images client-side to prevent localStorage quota exhaustion
const compressImageFile = (file: File, maxWidth = 1000, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        // White background for transparent pngs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const DishImagePicker: React.FC<DishImagePickerProps> = ({
  currentImageUrl,
  onSelectImage,
  lang,
  label
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState(currentImageUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter gallery images
  const filteredGallery = FOOD_PRESET_IMAGES.filter((item) => {
    if (galleryFilter !== 'all' && item.category !== galleryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.tagAr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle local file upload with fast automatic compression
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setSuccessNotice(null);

    if (!file.type.startsWith('image/')) {
      setUploadError(isAr ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)' : 'Please select a valid image file');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImageFile(file, 1000, 0.82);
      onSelectImage(compressedBase64);
      setCustomUrlInput(compressedBase64);
      setSuccessNotice(isAr ? 'تم رفع الصورة وضغطها بنجاح وستظهر فوراً!' : 'Image uploaded & compressed successfully!');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err) {
      console.error('Image compression error', err);
      setUploadError(isAr ? 'حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مرة أخرى' : 'Failed to process image, please try again');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlApply = () => {
    if (customUrlInput.trim()) {
      onSelectImage(customUrlInput.trim());
      setSuccessNotice(isAr ? 'تم تطبيق رابط الصورة!' : 'Image URL applied!');
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  const categories = [
    { id: 'all', nameAr: 'الكل', nameEn: 'All' },
    { id: 'mains', nameAr: 'مندي وولائم', nameEn: 'Mandi & Rice' },
    { id: 'pots', nameAr: 'فخاريات ومقالي', nameEn: 'Pots & Fahsa' },
    { id: 'grills', nameAr: 'مشاوي ومظبي', nameEn: 'Grills & Madhbi' },
    { id: 'appetizers', nameAr: 'مقبلات ومطبق', nameEn: 'Appetizers' },
    { id: 'breads', nameAr: 'مخبوزات وتنور', nameEn: 'Breads & Tandoor' },
    { id: 'desserts', nameAr: 'حلويات ومعصوب', nameEn: 'Desserts & Masoub' },
    { id: 'drinks', nameAr: 'مشروبات وشاي', nameEn: 'Drinks & Tea' },
    { id: 'breakfast', nameAr: 'فطور وعشاء', nameEn: 'Breakfast' },
  ];

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#d4af37]/30 shadow-xs">
      
      {/* Header & Current Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shadow-xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#141414] font-heading">
              {label || (isAr ? 'صورة الصنف أو القسم' : 'Item / Category Photo')}
            </h4>
            <p className="text-[11px] text-[#b8860b] font-medium">
              {isAr ? 'اختر صورة جاهزة بضغطة زر، أو ارفع صورة من جوالك/جهازك' : 'Choose ready photo or upload from phone/PC'}
            </p>
          </div>
        </div>

        {/* Selected Thumbnail Indicator */}
        {currentImageUrl && (
          <div className="flex items-center gap-2 bg-[#faf9f6] px-3 py-1.5 rounded-xl border border-[#d4af37]/30 shrink-0 self-start sm:self-auto shadow-2xs">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#d4af37]/40 bg-stone-100 shrink-0">
              <img
                src={currentImageUrl}
                alt="Selected"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            <div className="text-start">
              <span className="text-[10px] font-bold text-emerald-700 block flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                {isAr ? 'تم اختيار الصورة' : 'Photo Selected'}
              </span>
              <span className="text-[9px] text-stone-500 line-clamp-1 max-w-[130px]">
                {currentImageUrl.startsWith('data:') ? (isAr ? 'صورة مرفوعة ومضغوطة' : 'Uploaded') : currentImageUrl}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-bold border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs border border-[#d4af37]/30'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{isAr ? 'اسحب وأسقط أو ارفع من جهازك' : 'Drop or Upload File'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs border border-[#d4af37]/30'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{isAr ? 'مكتبة الصور الجاهزة' : 'Ready Library'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs border border-[#d4af37]/30'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>{isAr ? 'رابط مباشر' : 'URL'}</span>
        </button>
      </div>

      {/* Tab 1: Ready-made Gallery */}
      {activeTab === 'gallery' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          
          {/* Gallery Category Chips & Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن أكلة (مندي، فحسة، معصوب، مشاوي...)' : 'Search dishes...'}
                className="w-full ps-8 pe-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setGalleryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  galleryFilter === cat.id
                    ? 'bg-[#d4af37] text-[#141414] font-extrabold shadow-xs'
                    : 'bg-[#faf9f6] text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Grid of Ready-made Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto p-1.5 rounded-xl bg-[#faf9f6] border border-stone-200">
            {filteredGallery.map((preset) => {
              const isSelected = currentImageUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectImage(preset.url);
                    setSuccessNotice(isAr ? `تم اختيار: ${preset.nameAr}` : `Selected: ${preset.nameEn}`);
                    setTimeout(() => setSuccessNotice(null), 3000);
                  }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-4/3 flex flex-col justify-end p-2 select-none ${
                    isSelected
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37] shadow-md scale-[0.98]'
                      : 'border-transparent hover:border-[#d4af37]/60 hover:shadow-xs'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.nameAr}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-[#d4af37] text-[#141414] flex items-center justify-center shadow-xs font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="relative z-10 text-white">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#141414]/90 text-[#d4af37] font-bold block w-fit mb-0.5 border border-[#d4af37]/40">
                      {preset.tagAr}
                    </span>
                    <p className="text-[11px] font-bold leading-tight line-clamp-1 font-heading text-white group-hover:text-[#d4af37]">
                      {isAr ? preset.nameAr : preset.nameEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-center text-[#b8860b] font-medium">
            {isAr ? '💡 انقر على أي صورة أعلاه وسيتم تطبيقها فوراً على الصنف' : '💡 Click any photo above to apply immediately'}
          </p>
        </div>
      )}

      {/* Tab 2: Upload from Device / Mobile */}
      {activeTab === 'upload' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => !isCompressing && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[0.99]'
                : 'border-stone-300 bg-[#faf9f6] hover:bg-stone-50 hover:border-[#d4af37]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mb-3 shadow-xs">
              {isCompressing ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <h5 className="text-sm font-bold text-[#141414] mb-1 font-heading">
              {isCompressing
                ? (isAr ? 'جاري ضغط وتجهيز الصورة...' : 'Compressing image...')
                : (isAr ? 'اضغط لاختيار صورة من جهازك أو اسحبها هنا' : 'Click to choose image or drag & drop')}
            </h5>
            <p className="text-xs text-stone-500 max-w-xs">
              {isAr
                ? 'يدعم صور الكاميرا والجوال (PNG, JPG, WebP). يتم ضغطها تلقائياً لتظهر فوراً دون استهلاك مساحة التخزين.'
                : 'Supports camera and phone photos. Automatically compressed for fast loading.'}
            </p>

            <button
              type="button"
              disabled={isCompressing}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#141414] text-xs font-bold shadow-xs hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              {isCompressing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isAr ? 'تصفح الملفات من جهازك' : 'Browse Files'}</span>
            </button>
          </div>

          {uploadError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Custom URL Link */}
      {activeTab === 'url' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              {isAr ? 'ضع رابط الصورة المباشر (URL)' : 'Direct Image URL'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => {
                  setCustomUrlInput(e.target.value);
                  onSelectImage(e.target.value.trim());
                }}
                placeholder="https://images.unsplash.com/..."
                className="grow px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleUrlApply}
                className="px-4 py-2.5 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold hover:bg-black transition-colors shrink-0"
              >
                {isAr ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>

          {customUrlInput && (
            <div className="p-3 bg-[#faf9f6] rounded-xl border border-stone-200 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#d4af37]/30 shrink-0 bg-stone-100">
                <img
                  src={customUrlInput}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="text-xs text-stone-600">
                <span className="font-bold text-[#141414] block mb-0.5">
                  {isAr ? 'معاينة الرابط المباشر' : 'Live Image Preview'}
                </span>
                <span className="text-[10px] text-stone-400 line-clamp-2">
                  {customUrlInput}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
