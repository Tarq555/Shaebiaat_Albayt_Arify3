import React, { useState, useEffect } from 'react';
import {
  X, Save, Trash2, Image as ImageIcon, Sparkles, Upload,
  Check, AlertCircle, RefreshCw, Flame, DollarSign, Loader2
} from 'lucide-react';
import { MenuItem, Category, Language, Currency } from '../types';
import { IMAGES, CATEGORIES } from '../data/restaurantData';
import { useBodyScrollLock } from '../utils/scrollLock';
import { compressImageFile } from '../utils/imageUpload';

interface QuickDishEditorModalProps {
  isOpen: boolean;
  dish: MenuItem | null;
  onClose: () => void;
  onSave: (updatedDish: MenuItem) => void;
  onDelete?: (dishId: string) => void;
  categories: Category[];
  lang: Language;
  currency: Currency;
}

const PRESET_DISH_PHOTOS = [
  { label: 'مندي ولحم ضأن', url: IMAGES.mandiDish },
  { label: 'مندي دجاج محمر', url: IMAGES.mandiChicken },
  { label: 'زربيان لحم بلدي', url: IMAGES.zurbianLamb },
  { label: 'فحسة حجرية تفور', url: IMAGES.fahsaClayPot },
  { label: 'سلتة ومقلى صخري', url: IMAGES.saltahBento },
  { label: 'مظبي حجر الجمر', url: IMAGES.madhbiStone },
  { label: 'كبدة حاشي وصاج', url: IMAGES.liverSajiya },
  { label: 'مقلقل لحم طازج', url: IMAGES.mugalgalMeat },
  { label: 'فول قلابة جمرية', url: IMAGES.foulQallaba },
  { label: 'شكشوكة بالجبن', url: IMAGES.shakshouka },
  { label: 'مطبق مقرمش', url: IMAGES.mutabbaq },
  { label: 'عريكة ملكية فاخرة', url: IMAGES.arika },
  { label: 'معصوب بالقشطة والموز', url: IMAGES.masoub },
  { label: 'بنت الصحن بالعسل', url: IMAGES.bintAlSahn },
  { label: 'شاي عدني كرك', url: IMAGES.adenTea },
  { label: 'خبز ملوح تنور', url: IMAGES.hushwaBread }
];

export const QuickDishEditorModal: React.FC<QuickDishEditorModalProps> = ({
  isOpen,
  dish,
  onClose,
  onSave,
  onDelete,
  categories,
  lang,
  currency
}) => {
  const isAr = lang === 'ar';
  useBodyScrollLock(isOpen);

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState('');
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const [serves, setServes] = useState('');
  const [image, setImage] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dish) {
      setTitleAr(dish.titleAr || '');
      setTitleEn(dish.titleEn || '');
      setDescAr(dish.descAr || '');
      setDescEn(dish.descEn || '');
      setPrice(dish.price || 0);
      setOriginalPrice(dish.originalPrice);
      setCategoryId(dish.categoryId || 'mains');
      setCalories(dish.calories);
      setServes(dish.serves || '1-2 أشخاص');
      setImage(dish.image || '');
      setIsPopular(!!dish.isPopular);
      setIsChefSpecial(!!dish.isChefSpecial);
      setError('');
      setShowPresets(false);
    }
  }, [dish, isOpen]);

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);

  if (!isOpen || !dish) return null;

  const processDishFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }
    setIsProcessingImage(true);
    try {
      const compressed = await compressImageFile(file, 1200, 900, 0.85);
      setImage(compressed);
    } catch (err) {
      console.error('Error compressing dish image', err);
      setError(isAr ? 'تعذر معالجة الصورة، يرجى اختيار ملف آخر' : 'Failed to process image');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processDishFile(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titleAr.trim()) {
      setError(isAr ? 'اسم الصنف بالعربي مطلوب' : 'Arabic dish title is required');
      return;
    }

    if (price < 0 || isNaN(price)) {
      setError(isAr ? 'السعر يجب أن يكون رقماً موجباً' : 'Price must be a valid positive number');
      return;
    }

    const updatedDish: MenuItem = {
      ...dish,
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      descAr: descAr.trim(),
      descEn: descEn.trim(),
      price: Number(price),
      originalPrice: originalPrice && Number(originalPrice) > 0 ? Number(originalPrice) : undefined,
      categoryId,
      calories: calories ? Number(calories) : undefined,
      serves: serves.trim() || '1-2 أشخاص',
      image: image.trim() || dish.image,
      isPopular,
      isChefSpecial
    };

    onSave(updatedDish);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && dish) {
      if (window.confirm(isAr ? `هل أنت متأكد من حذف صنف "${dish.titleAr}" نهائياً من الموقع؟` : `Delete dish "${dish.titleAr}"?`)) {
        onDelete(dish.id);
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37] my-auto max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#141414] text-white border-b border-[#d4af37]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
            <div>
              <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                {isAr ? 'تعديل مباشر في وضع الزائر' : 'Live In-Context Editor'}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {isAr ? `تعديل صنف: ${dish.titleAr}` : `Editing: ${dish.titleEn || dish.titleAr}`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form 
          onSubmit={handleFormSubmit} 
          className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain touch-pan-y grow"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dish Image Preview & Live Photo Changer */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <label className="block text-xs font-bold text-stone-700">
              {isAr ? 'صورة الصنف (تعديل مباشر)' : 'Dish Photo (Live Edit)'}
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div
                className={`relative w-28 h-28 rounded-2xl overflow-hidden border-2 shrink-0 bg-stone-200 shadow-xs cursor-pointer ${
                  isImageDragOver ? 'border-[#d4af37] ring-4 ring-[#d4af37]/40 scale-105' : 'border-[#d4af37]'
                } transition-all`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsImageDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsImageDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsImageDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    processDishFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-1 text-center">
                    <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin mb-1" />
                    <span className="text-[9px] text-white font-bold">{isAr ? 'جاري الضغط...' : 'Compressing...'}</span>
                  </div>
                )}

                {isImageDragOver && (
                  <div className="absolute inset-0 bg-[#141414]/90 flex flex-col items-center justify-center p-1 text-center">
                    <Upload className="w-6 h-6 text-[#d4af37] animate-bounce mb-1" />
                    <span className="text-[9px] text-white font-bold">{isAr ? 'أفلت هنا' : 'Drop here'}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:border-[#d4af37]"
                />
                
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-stone-800 text-[#d4af37] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رفع / إسقاط صورة من جهازك' : 'Upload / Drop File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{showPresets ? (isAr ? 'إخفاء المعرض' : 'Hide Presets') : (isAr ? 'اختيار من الصور الجاهزة' : 'Pick Preset')}</span>
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  {isAr ? 'اسحب أي صورة وأفلتها فوق المربع، أو اضغط على الزر لاختيار ملف من جهازك' : 'Drag & drop image onto the preview box, or browse device'}
                </p>
              </div>
            </div>

            {/* Quick Photo Presets Grid */}
            {showPresets && (
              <div className="pt-2 border-t border-stone-200">
                <p className="text-[11px] text-stone-500 mb-2 font-medium">
                  {isAr ? 'انقر على أي صورة لتطبيقها فوراً على هذا الصنف:' : 'Click any photo to apply immediately:'}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-stone-200">
                  {PRESET_DISH_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className={`relative rounded-lg overflow-hidden h-14 border-2 transition-all cursor-pointer group ${
                        image === p.url ? 'border-[#d4af37] scale-95 shadow-sm' : 'border-transparent hover:border-stone-400'
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white p-0.5 truncate text-center">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'اسم الصنف بالعربي *' : 'Arabic Title *'}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'الاسم بالإنجليزي' : 'English Title'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Price, Original Price, Category, Calories, Serves */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? `السعر (${currency}) *` : `Price (${currency}) *`}
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 font-extrabold text-[#b8860b] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? `السعر القديم (${currency})` : `Old Price (${currency})`}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder={isAr ? 'قبل الخصم' : 'Before discount'}
                value={originalPrice ?? ''}
                onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'القسم *' : 'Category *'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#d4af37]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'السعرات (سعرة)' : 'Calories (kcal)'}
              </label>
              <input
                type="number"
                min="0"
                value={calories || ''}
                onChange={(e) => setCalories(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                placeholder="650"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'يكفي كم شخص' : 'Serves'}
              </label>
              <input
                type="text"
                value={serves}
                onChange={(e) => setServes(e.target.value)}
                placeholder="1-2 أشخاص"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isAr ? 'وصف الصنف بالعربي' : 'Arabic Description'}
            </label>
            <textarea
              rows={2}
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Badges / Highlights */}
          <div className="flex items-center gap-4 pt-1 text-xs font-bold text-stone-700">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37]"
              />
              <span>{isAr ? '⭐ الأكثر طلباً' : 'Popular'}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isChefSpecial}
                onChange={(e) => setIsChefSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37]"
              />
              <span>{isAr ? '👑 توقيع الشيف' : "Chef's Special"}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'حذف هذا الصنف نهائياً' : 'Delete Dish'}</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات فوراً' : 'Save Live Changes'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
