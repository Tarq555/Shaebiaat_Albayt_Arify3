import React, { useState } from 'react';
import {
  Sparkles, Flame, Star, ArrowLeft, ArrowRight,
  Award, Eye, MessageCircle, Heart, ChevronRight, Edit3,
  Camera, Upload, Loader2
} from 'lucide-react';
import { MenuItem, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { compressImageFile } from '../utils/imageUpload';

interface FeaturedDishesSectionProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onExploreFullMenu: () => void;
  lang: Language;
  currency: Currency;
  showPrices?: boolean;
  showDiscountPrices?: boolean;
  isAdmin?: boolean;
  onEditDish?: (dish: MenuItem) => void;
  liveEditMode?: boolean;
  onUpdateDishImage?: (dish: MenuItem, newImageUrl: string) => void;
}

export const FeaturedDishesSection: React.FC<FeaturedDishesSectionProps> = ({
  dishes,
  onSelectDish,
  onExploreFullMenu,
  lang,
  currency,
  showPrices = true,
  showDiscountPrices = false,
  isAdmin = false,
  onEditDish,
  liveEditMode = true,
  onUpdateDishImage
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [filter, setFilter] = useState<'all' | 'popular' | 'chef' | 'mains' | 'dessert'>('all');
  const [dragOverDishId, setDragOverDishId] = useState<string | null>(null);
  const [uploadingDishId, setUploadingDishId] = useState<string | null>(null);

  const handleProcessDishFile = async (dish: MenuItem, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingDishId(dish.id);
    try {
      const compressed = await compressImageFile(file, 1200, 900, 0.85);
      if (onUpdateDishImage) {
        onUpdateDishImage(dish, compressed);
      }
    } catch (e) {
      console.error('Error compressing dish image', e);
    } finally {
      setUploadingDishId(null);
    }
  };

  // Filter top signature dishes
  const featuredList = dishes.filter((dish) => {
    if (filter === 'popular') return dish.isPopular;
    if (filter === 'chef') return dish.isChefSpecial;
    if (filter === 'mains') return dish.categoryId === 'mains';
    if (filter === 'dessert') return dish.categoryId === 'sweets';
    // Default featured: high rating or marked popular/chef
    return dish.isPopular || dish.isChefSpecial || dish.rating >= 4.8;
  }).slice(0, 6);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#d4af37]/20 relative overflow-hidden">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#b8860b] border border-[#d4af37]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              {isAr ? 'روائع وتوصيات الشيف' : "Chef's Signature Selection"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
              {isAr ? 'الأطباق المميزة والأكثر طلباً' : 'Signature & Most Requested Dishes'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-body">
              {isAr
                ? 'مختارات أعدت بعناية فائقة وتوابل أصيلة، تُطهى على نار هادئة وحطب طبيعي لتمنحك النكهة الشعبية الفريدة.'
                : 'Handcrafted signature dishes infused with authentic heritage spices and slow-cooked over natural wood embers.'}
            </p>
          </div>

          {/* Action button to explore full menu */}
          <button
            id="featured-view-full-menu-btn"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onExploreFullMenu();
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#141414] hover:text-[#b8860b] group self-start md:self-auto cursor-pointer"
          >
            <span>{isAr ? 'عرض كامل القائمة والمنيو' : 'View Full Menu'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-[#d4af37]" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
            }`}
          >
            {isAr ? 'الكل المميز' : 'All Featured'}
          </button>
          <button
            onClick={() => setFilter('popular')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'popular'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
            }`}
          >
            {isAr ? 'الأكثر طلباً' : 'Best Sellers'}
          </button>
          <button
            onClick={() => setFilter('chef')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'chef'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
            }`}
          >
            {isAr ? 'توصية الشيف' : "Chef's Specials"}
          </button>
          <button
            onClick={() => setFilter('mains')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'mains'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
            }`}
          >
            {isAr ? 'مندي وولائم' : 'Feasts & Mandi'}
          </button>
          <button
            onClick={() => setFilter('dessert')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'dessert'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
            }`}
          >
            {isAr ? 'حلا ومعصوب' : 'Desserts'}
          </button>
        </div>

        {/* Featured Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredList.map((dish) => {
            const title = isAr ? dish.titleAr : dish.titleEn;
            const desc = isAr ? dish.descAr : dish.descEn;
            const isThisDragOver = dragOverDishId === dish.id;
            const isThisUploading = uploadingDishId === dish.id;

            const orderWhatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
              isAr
                ? `السلام عليكم، أود طلب طبق: ${dish.titleAr} (السعر: ${dish.price} ${currency})`
                : `Hello, I would like to order: ${dish.titleEn} (${dish.price} ${currency})`
            )}`;

            return (
              <div
                key={dish.id}
                id={`featured-dish-card-${dish.id}`}
                onClick={() => onSelectDish(dish)}
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
                className={`group rounded-3xl bg-white border border-[#d4af37]/30 shadow-sm hover:shadow-2xl hover:border-[#d4af37] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative ${
                  isThisDragOver ? 'ring-4 ring-[#d4af37] ring-inset' : ''
                }`}
              >
                {/* Live Admin Quick Edit and Image Replace Buttons */}
                {isAdmin && liveEditMode && (
                  <div className="absolute top-3 start-3 z-30 flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditDish) onEditDish(dish);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#d4af37] text-[#141414] hover:bg-[#ffe38a] font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer border border-[#141414]"
                      title={isAr ? 'تعديل الصنف كاملاً' : 'Quick Edit Dish'}
                    >
                      <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1.5 rounded-xl bg-[#141414]/90 hover:bg-black text-[#d4af37] border border-[#d4af37]/50 font-extrabold text-xs shadow-lg flex items-center gap-1 cursor-pointer"
                      title={isAr ? 'استبدال صورة هذا الصنف من جهازك' : 'Upload Image'}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استبدال الصورة' : 'Change Photo'}</span>
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

                {/* Drag-over overlay */}
                {isThisDragOver && (
                  <div className="absolute inset-0 z-40 bg-[#141414]/90 border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center text-center p-4">
                    <Upload className="w-10 h-10 text-[#d4af37] mb-2 animate-bounce" />
                    <p className="text-white font-bold text-sm">
                      {isAr ? 'أفلت الصورة هنا لاستبدال صورة الصنف فوراً' : 'Drop image here to replace'}
                    </p>
                  </div>
                )}

                {/* Uploading Spinner */}
                {isThisUploading && (
                  <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                    <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-2" />
                    <p className="text-white font-bold text-xs">
                      {isAr ? 'جاري ضغط وحفظ صورة الصنف...' : 'Uploading & compressing...'}
                    </p>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-stone-100">
                  <img
                    src={dish.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges (Shifted if admin edit is showing) */}
                  <div className={`absolute top-3 ${isAdmin && liveEditMode ? 'start-52' : 'start-3'} end-3 flex items-center justify-between gap-2 z-10`}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {dish.isPopular && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#d4af37] text-[#141414] shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#141414]" />
                          <span>{isAr ? 'الأكثر مبيعاً' : 'Best Seller'}</span>
                        </span>
                      )}
                      {dish.isChefSpecial && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#141414]/80 text-[#d4af37] border border-[#d4af37]/40 shadow-sm backdrop-blur-xs flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#d4af37]" />
                          <span>{isAr ? 'توصية الشيف' : "Chef's Pick"}</span>
                        </span>
                      )}
                    </div>

                    <div className="px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-xs text-xs font-bold flex items-center gap-1 border border-white/20">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Price Tag in Bottom Right */}
                  {showPrices && (
                    <div className="absolute bottom-3 end-3 px-3 py-1.5 rounded-xl bg-[#141414]/90 backdrop-blur-md border border-[#d4af37]/60 text-white shadow-lg flex items-baseline gap-1.5">
                      {showDiscountPrices && dish.originalPrice && dish.originalPrice > dish.price ? (
                        <>
                          <span className="line-through text-stone-400 text-xs font-semibold">
                            {dish.originalPrice}
                          </span>
                          <span className="text-lg font-extrabold text-[#d4af37]">
                            {dish.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-extrabold text-[#d4af37]">
                          {dish.price}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-stone-300">
                        {isAr ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#141414] font-heading group-hover:text-[#b8860b] transition-colors line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 font-body leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDish(dish);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#d4af37]/15 text-[#141414] hover:text-[#b8860b] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{isAr ? 'تفاصيل الطبق' : 'Dish Details'}</span>
                    </button>

                    <a
                      href={orderWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                      <span>{isAr ? 'طلب عبر واتساب' : 'Order WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
