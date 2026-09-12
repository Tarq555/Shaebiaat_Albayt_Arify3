import React, { useState } from 'react';
import {
  X, Search, Plus, Edit3, Camera, ShoppingBag, Eye,
  MessageCircle, ArrowLeft, ArrowRight, Loader2, Upload
} from 'lucide-react';
import { Category, MenuItem, Language, Currency } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { formatPrice } from '../utils/currency';
import { compressImageFile } from '../utils/imageUpload';
import { useBodyScrollLock } from '../utils/scrollLock';

interface CategoryDishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onAddToCart?: (dish: MenuItem) => void;
  onQuickAddToCart?: (dish: MenuItem) => void;
  lang: Language;
  currency: Currency;
  isAdmin?: boolean;
  onEditDish?: (dish: MenuItem) => void;
  onEditDishAdmin?: (dish: MenuItem) => void;
  onAddNewDish?: (categoryId: string) => void;
  onAddNewDishToCategory?: (categoryId: string) => void;
  onUpdateCategoryCover?: (category: Category, newImageUrl: string) => void;
  onUpdateDishImage?: (dish: MenuItem, newImageUrl: string) => void;
  onSelectCategory?: (category: Category) => void;
  showPrices?: boolean;
  showDiscountPrices?: boolean;
  whatsappNumber?: string;
  catalogOnlyMode?: boolean;
  onViewAllInMenu?: (category: Category) => void;
  onViewInFullMenu?: () => void;
}

export const CategoryDishesModal: React.FC<CategoryDishesModalProps> = ({
  isOpen,
  onClose,
  category,
  categories,
  dishes,
  onSelectDish,
  onAddToCart,
  onQuickAddToCart,
  lang,
  currency,
  isAdmin = false,
  onEditDish,
  onEditDishAdmin,
  onAddNewDish,
  onAddNewDishToCategory,
  onUpdateDishImage,
  onSelectCategory,
  showPrices = true,
  showDiscountPrices = false,
  whatsappNumber = RESTAURANT_INFO.whatsapp,
  catalogOnlyMode = true
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowRight : ArrowLeft;

  useBodyScrollLock(isOpen);

  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverDishId, setDragOverDishId] = useState<string | null>(null);
  const [uploadingDishId, setUploadingDishId] = useState<string | null>(null);

  // Close on ESC
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  // Unify handlers
  const handleEditDish = onEditDish || onEditDishAdmin;
  const handleAddDish = onAddNewDish || onAddNewDishToCategory;
  const handleAddToCartUnified = onAddToCart || onQuickAddToCart;

  // Filter dishes in this category
  const categoryDishes = dishes.filter((dish) => dish.categoryId === category.id);

  const displayedDishes = categoryDishes.filter((dish) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dish.titleAr.toLowerCase().includes(q) ||
      dish.titleEn.toLowerCase().includes(q) ||
      dish.descAr.toLowerCase().includes(q) ||
      dish.descEn.toLowerCase().includes(q)
    );
  });

  const handleProcessDishFile = async (dish: MenuItem, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingDishId(dish.id);
    try {
      const compressed = await compressImageFile(file, 1200, 900, 0.85);
      if (onUpdateDishImage) {
        onUpdateDishImage(dish, compressed);
      }
    } catch (err) {
      console.error('Error compressing dish image', err);
    } finally {
      setUploadingDishId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 flex flex-col h-[94vh] md:h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Back Button, Category Title, Search and Close */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-stone-200 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs z-10">
          {/* Back button & Category title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#141414] text-stone-800 hover:text-[#d4af37] text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-stone-200"
              title={isAr ? 'الرجوع للصفحة السابقة' : 'Back to Previous Page'}
            >
              <ArrowIcon className="w-4 h-4 text-[#b8860b]" />
              <span>{isAr ? 'الرجوع للصفحة السابقة' : 'Back'}</span>
            </button>

            <div className="h-6 w-px bg-stone-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#141414] font-heading">
                  {isAr ? category.nameAr : category.nameEn}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#faf9f6] text-stone-700 border border-stone-200">
                  {isAr ? `${categoryDishes.length} أصناف` : `${categoryDishes.length} items`}
                </span>
              </div>
            </div>
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث سريع في الأصناف...' : 'Quick search...'}
                className="w-full ps-8 pe-3 py-1.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#d4af37]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {isAdmin && handleAddDish && (
              <button
                type="button"
                onClick={() => handleAddDish(category.id)}
                className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-extrabold flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">{isAr ? 'إضافة صنف' : 'Add Dish'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Category Switcher Tabs */}
        {categories.length > 1 && onSelectCategory && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-50 border-b border-stone-200 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap ps-1 pe-2">
              {isAr ? 'الأقسام:' : 'Categories:'}
            </span>
            {categories.map((c) => {
              const isCurrent = c.id === category.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCategory(c)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                  }`}
                >
                  {isAr ? c.nameAr : c.nameEn}
                </button>
              );
            })}
          </div>
        )}

        {/* Dishes Content List (Direct to dishes, no clutter, images optional) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 overscroll-contain bg-[#faf9f6]">
          {displayedDishes.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-dashed border-stone-300 p-8 max-w-md mx-auto my-8">
              <h3 className="text-base font-bold text-stone-800">
                {searchQuery
                  ? (isAr ? `لا توجد أصناف مطابقة لـ "${searchQuery}"` : `No dishes matched "${searchQuery}"`)
                  : (isAr ? 'لا توجد أصناف في هذا القسم حالياً' : 'No dishes in this category yet')}
              </h3>
              {isAdmin && handleAddDish && (
                <button
                  type="button"
                  onClick={() => handleAddDish(category.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37] text-[#141414] font-bold text-xs shadow-sm cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة صنف لهذا القسم' : 'Add Dish to Category'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {displayedDishes.map((dish) => {
                const title = isAr ? dish.titleAr : dish.titleEn;
                const desc = isAr ? dish.descAr : dish.descEn;
                const hasImage = Boolean(dish.image && dish.image.trim().length > 5);
                const isThisDishDragOver = dragOverDishId === dish.id;
                const isThisDishUploading = uploadingDishId === dish.id;

                const orderWhatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  isAr
                    ? `السلام عليكم، أود طلب: ${dish.titleAr} (السعر: ${dish.price} ${currency}) من قسم ${category.nameAr}`
                    : `Hello, I would like to order: ${dish.titleEn} (${dish.price} ${currency}) from ${category.nameEn}`
                )}`;

                return (
                  <div
                    key={dish.id}
                    id={`category-dish-card-${dish.id}`}
                    onClick={() => {
                      onClose();
                      onSelectDish(dish);
                    }}
                    onDragOver={(e) => {
                      if (!isAdmin) return;
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverDishId(dish.id);
                    }}
                    onDragLeave={(e) => {
                      if (!isAdmin) return;
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverDishId(null);
                    }}
                    onDrop={(e) => {
                      if (!isAdmin) return;
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverDishId(null);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleProcessDishFile(dish, e.dataTransfer.files[0]);
                      }
                    }}
                    className={`group bg-white rounded-2xl border border-stone-200/90 hover:border-[#d4af37] p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer relative ${
                      isThisDishDragOver ? 'ring-4 ring-[#d4af37] ring-inset' : ''
                    }`}
                  >
                    {/* Admin Actions Bar */}
                    {isAdmin && (
                      <div className="absolute top-2.5 end-2.5 z-20 flex items-center gap-1.5">
                        {handleEditDish && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDish(dish);
                            }}
                            className="px-2 py-0.5 rounded-md bg-[#d4af37] text-[#141414] hover:bg-amber-400 font-extrabold text-[10px] flex items-center gap-1 shadow-xs border border-black/20 cursor-pointer"
                            title={isAr ? 'تعديل الصنف' : 'Edit Dish'}
                          >
                            <Edit3 className="w-2.5 h-2.5 stroke-[2.5]" />
                            <span>{isAr ? 'تعديل' : 'Edit'}</span>
                          </button>
                        )}
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 rounded-md bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                          title={isAr ? 'صورة الصنف' : 'Photo'}
                        >
                          <Camera className="w-2.5 h-2.5" />
                          <span>{isAr ? (hasImage ? 'تغيير صورة' : 'إضافة صورة') : 'Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleProcessDishFile(dish, f);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* Drag-over indicator */}
                    {isThisDishDragOver && (
                      <div className="absolute inset-0 z-30 bg-[#141414]/90 flex items-center justify-center text-center p-2 rounded-2xl border-2 border-dashed border-[#d4af37]">
                        <Upload className="w-5 h-5 text-[#d4af37] me-2" />
                        <span className="text-white font-bold text-xs">
                          {isAr ? 'أفلت الصورة هنا لتحديث الصنف' : 'Drop image to update dish'}
                        </span>
                      </div>
                    )}

                    {/* Dish Uploading Spinner */}
                    {isThisDishUploading && (
                      <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center text-center p-2 rounded-2xl">
                        <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin me-2" />
                        <span className="text-white font-bold text-xs">
                          {isAr ? 'جاري رفع الصورة...' : 'Uploading...'}
                        </span>
                      </div>
                    )}

                    {/* Main Content Info (Title, Category badge, Description) */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-[#141414] font-heading group-hover:text-[#b8860b] transition-colors">
                          {title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#faf9f6] text-[#b8860b] border border-[#d4af37]/30">
                          {isAr ? category.nameAr : category.nameEn}
                        </span>
                      </div>

                      {desc && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                          {desc}
                        </p>
                      )}

                      {/* Price Display */}
                      <div className="pt-1 flex items-center gap-3">
                        {showPrices && (
                          <div className="flex items-baseline gap-1.5">
                            {showDiscountPrices && dish.originalPrice && dish.originalPrice > dish.price ? (
                              <>
                                <span className="line-through text-stone-400 text-xs font-medium">
                                  {formatPrice(dish.originalPrice, currency, lang)}
                                </span>
                                <span className="text-base font-extrabold text-[#d4af37] font-heading">
                                  {formatPrice(dish.price, currency, lang)}
                                </span>
                              </>
                            ) : (
                              <span className="text-base font-extrabold text-[#141414] font-heading">
                                {formatPrice(dish.price, currency, lang)}
                              </span>
                            )}
                          </div>
                        )}

                        {dish.serves && (
                          <span className="text-[11px] text-stone-400 font-medium">
                            • {dish.serves}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Optional Dish Image Thumbnail (renders if present, omitted if none without breaking layout) */}
                    {hasImage && (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 order-first sm:order-none">
                        <img
                          src={dish.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // If fails to load, gracefully hide the broken image element
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Actions on the side */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0 justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onSelectDish(dish);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#141414] text-stone-800 hover:text-[#d4af37] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isAr ? 'التفاصيل' : 'Details'}</span>
                      </button>

                      {!catalogOnlyMode && handleAddToCartUnified && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartUnified(dish);
                          }}
                          className="p-1.5 rounded-xl bg-amber-50 hover:bg-[#d4af37] text-[#b8860b] hover:text-[#141414] border border-[#d4af37]/40 transition-colors cursor-pointer"
                          title={isAr ? 'إضافة للسلة' : 'Add to Cart'}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <a
                        href={orderWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                        <span>{isAr ? 'طلب واتساب' : 'WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-6 bg-white border-t border-stone-200 shrink-0 flex items-center justify-between gap-3 text-xs text-stone-500">
          <span className="font-semibold">
            {isAr
              ? `أصناف قسم ${category.nameAr} (${displayedDishes.length} معروضة)`
              : `${category.nameEn} dishes (${displayedDishes.length} shown)`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#141414] text-white hover:text-[#d4af37] font-bold transition-colors cursor-pointer"
          >
            {isAr ? 'الرجوع' : 'Back'}
          </button>
        </div>
      </div>
    </div>
  );
};
