import React, { useState } from 'react';
import {
  BookOpen, Image as ImageIcon, Download, ZoomIn, X, ChevronLeft, ChevronRight,
  Sparkles, Layers, MessageCircle, PhoneCall, ExternalLink, Filter, Plus, Eye
} from 'lucide-react';
import { Language, MenuWarehouseItem, MenuItem, CategoryId } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface MenuWarehouseSectionProps {
  lang: Language;
  warehouseItems: MenuWarehouseItem[];
  showDishesMenu?: boolean;
  showMenuWarehouse?: boolean;
  onOpenAdminWarehouse?: () => void;
  isAdmin?: boolean;
  onSwitchToDishesMenu?: () => void;
}

export const MenuWarehouseSection: React.FC<MenuWarehouseSectionProps> = ({
  lang,
  warehouseItems,
  showDishesMenu = false,
  showMenuWarehouse = true,
  onOpenAdminWarehouse,
  isAdmin = false,
  onSwitchToDishesMenu
}) => {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(warehouseItems.map(item => item.category || (isAr ? 'قائمة الطعام الرئيسية' : 'Main Menu'))));

  const filteredItems = selectedCategory === 'all'
    ? warehouseItems
    : warehouseItems.filter(item => (item.category || (isAr ? 'قائمة الطعام الرئيسية' : 'Main Menu')) === selectedCategory);

  const activeItem = activeImageIndex !== null ? filteredItems[activeImageIndex] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم، أود الطلب والاستفسار من واقع صور قائمة الطعام والمستودع'
      : 'Hello, I would like to order and inquire based on your menu catalog'
  )}`;

  return (
    <div id="menu-warehouse-section" className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141414] via-[#1c1c1c] to-[#141414] text-white rounded-3xl p-6 sm:p-10 border border-[#d4af37]/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold tracking-wide">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'مستودع وخزينة قوائم الطعام الجاهزة' : 'Menu Catalog Repository'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            {isAr ? 'قوائم وبروشورات شعبيات البيت الريفي المصورة' : 'Shaabiyat Al-Bait Al-Reefi Menu Catalogs'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed">
            {isAr
              ? 'تصفح صفحات قائمة الطعام الأصلية والبروشورات المعتمدة بدقة عالية. يمكنك تكبير أي صفحة، حفظها على جهازك، أو إرسال طلبك المباشر عبر الواتساب.'
              : 'Browse our authentic high-resolution menu pages and brochures. Zoom in, download, or inquire directly via WhatsApp.'}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isAr ? 'طلب واستفسار عبر الواتساب' : 'Order via WhatsApp'}</span>
            </a>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-5 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/60 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#d4af37]" />
              <span>{isAr ? 'اتصال مباشر للحجز' : 'Call Directly'}</span>
            </a>

            {isAdmin && onOpenAdminWarehouse && (
              <button
                type="button"
                onClick={onOpenAdminWarehouse}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#141414] font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#141414]" />
                <span>{isAr ? 'إضافة صور للمستودع (لوحة المدير)' : 'Manage Warehouse (Admin)'}</span>
              </button>
            )}

            {showDishesMenu && onSwitchToDishesMenu && (
              <button
                type="button"
                onClick={onSwitchToDishesMenu}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                <span>{isAr ? 'عرض منيو الأصناف الفردية' : 'View Dishes Grid'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute top-0 end-0 w-80 h-full opacity-10 pointer-events-none bg-radial from-[#d4af37] to-transparent" />
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                : 'bg-[#faf9f6] text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            <span>{isAr ? 'جميع صفحات المنيو' : 'All Catalogs'}</span>
            <span className="ms-1.5 px-1.5 py-0.5 rounded-full bg-stone-200 text-[#141414] text-[10px]">
              {warehouseItems.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                  : 'bg-[#faf9f6] text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Warehouse Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#faf9f6] border border-dashed border-stone-300 space-y-4">
          <ImageIcon className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-[#141414]">
            {isAr ? 'المستودع فارغ حالياً' : 'No Menu Catalogs in Warehouse'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            {isAr
              ? 'يمكنك من خلال لوحة التحكم إضافة صور وقوائم الطعام الخاصة بك والتحكم في إظهارها لزوار الموقع.'
              : 'Use the admin panel to upload your custom menu pages and brochures.'}
          </p>
          {isAdmin && onOpenAdminWarehouse && (
            <button
              type="button"
              onClick={onOpenAdminWarehouse}
              className="px-6 py-3 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 text-xs sm:text-sm font-bold hover:bg-black transition-all cursor-pointer"
            >
              {isAr ? 'اضغط هنا لإضافة صور المنيو' : 'Upload Menu Photos Now'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              id={`warehouse-item-${item.id}`}
              onClick={() => setActiveImageIndex(index)}
              className="group bg-white rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Preview */}
              <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={isAr ? item.titleAr : item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badge Category */}
                <div className="absolute top-3 start-3 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-xs">
                    {item.category || (isAr ? 'قائمة الطعام' : 'Menu')}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3.5 rounded-2xl bg-[#141414]/90 text-[#d4af37] border border-[#d4af37]/60 shadow-lg flex items-center gap-2 text-xs font-bold">
                    <ZoomIn className="w-5 h-5 text-[#d4af37]" />
                    <span>{isAr ? 'تكبير وعرض الصفحة' : 'Click to Enlarge'}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 start-3 end-3 text-white z-10">
                  <h3 className="text-base sm:text-lg font-bold text-white font-heading drop-shadow-sm line-clamp-1">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  {(item.descriptionAr || item.descriptionEn) && (
                    <p className="text-xs text-stone-200 line-clamp-1 mt-0.5">
                      {isAr ? item.descriptionAr : item.descriptionEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-[#faf9f6] border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(index);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] text-[#141414] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>{isAr ? 'عرض بدقة كاملة' : 'View Full Size'}</span>
                </button>

                <a
                  href={item.imageUrl}
                  download={`menu-page-${index + 1}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] text-stone-700 hover:text-[#141414] transition-all cursor-pointer"
                  title={isAr ? 'حفظ الصورة' : 'Download Image'}
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox / Zoom Modal */}
      {activeItem && activeImageIndex !== null && (
        <div
          id="warehouse-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#d4af37] uppercase">
                {activeItem.category || (isAr ? 'مستودع المنيو' : 'Menu Warehouse')} • ({activeImageIndex + 1} / {filteredItems.length})
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white font-heading">
                {isAr ? activeItem.titleAr : activeItem.titleEn}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeItem.imageUrl}
                download={`menu-page-${activeImageIndex + 1}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-1.5 text-xs font-bold"
                title={isAr ? 'تحميل الصورة' : 'Download'}
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span className="hidden sm:inline">{isAr ? 'تحميل' : 'Download'}</span>
              </a>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">{isAr ? 'طلب بالواتساب' : 'WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveImageIndex(null)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image View with Prev/Next Navigation */}
          <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeItem.imageUrl}
              alt={isAr ? activeItem.titleAr : activeItem.titleEn}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all"
            />

            {filteredItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute start-2 sm:start-6 p-3 rounded-full bg-black/60 hover:bg-black text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md transition-all cursor-pointer"
                  title={isAr ? 'الصفحة السابقة' : 'Previous'}
                >
                  <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute end-2 sm:end-6 p-3 rounded-full bg-black/60 hover:bg-black text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md transition-all cursor-pointer"
                  title={isAr ? 'الصفحة التالية' : 'Next'}
                >
                  <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20" onClick={(e) => e.stopPropagation()}>
              {filteredItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#d4af37] scale-105 shadow-md' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
