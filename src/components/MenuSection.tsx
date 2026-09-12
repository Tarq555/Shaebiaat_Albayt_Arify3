import React, { useState, useMemo, useRef } from 'react';
import {
  Search, Plus, Eye, MessageCircle, Edit3, Camera,
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  LayoutList, LayoutGrid, ShoppingBag, UtensilsCrossed
} from 'lucide-react';
import { MenuItem, CategoryId, Category, Language, Currency, CartItem, MenuWarehouseItem } from '../types';
import { CATEGORIES, RESTAURANT_INFO, DEFAULT_WAREHOUSE_ITEMS } from '../data/restaurantData';
import { formatPrice } from '../utils/currency';
import { MenuWarehouseSection } from './MenuWarehouseSection';

interface MenuSectionProps {
  menuItems: MenuItem[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectDish: (dish: MenuItem) => void;
  onQuickAddToCart: (dish: MenuItem) => void;
  cartItems: CartItem[];
  lang: Language;
  currency: Currency;
  isAdmin?: boolean;
  onEditDishAdmin?: (dish: MenuItem) => void;
  categories?: Category[];
  catalogOnlyMode?: boolean;
  showPrices?: boolean;
  showDiscountPrices?: boolean;
  whatsappNumber?: string;
  onOpenReadyMenu?: () => void;
  enableReadyMenu?: boolean;
  readyMenuTitle?: string;
  warehouseItems?: MenuWarehouseItem[];
  showDishesMenu?: boolean;
  showMenuWarehouse?: boolean;
  onOpenAdminWarehouse?: () => void;
  onBack?: () => void;
  titleAr?: string;
  subtitleAr?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedCategory,
  onSelectCategory,
  onSelectDish,
  onQuickAddToCart,
  cartItems,
  lang,
  currency,
  isAdmin = false,
  onEditDishAdmin,
  categories = CATEGORIES,
  catalogOnlyMode = true,
  showPrices = true,
  showDiscountPrices = false,
  whatsappNumber = RESTAURANT_INFO.whatsapp,
  onOpenReadyMenu,
  enableReadyMenu = true,
  readyMenuTitle,
  warehouseItems = DEFAULT_WAREHOUSE_ITEMS,
  showDishesMenu = true,
  showMenuWarehouse = true,
  onOpenAdminWarehouse,
  onBack,
  titleAr,
  subtitleAr
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowRight : ArrowLeft;

  const [activeMenuTab, setActiveMenuTab] = useState<'warehouse' | 'dishes'>(
    selectedCategory !== 'all' ? 'dishes' : (showDishesMenu ? 'dishes' : (showMenuWarehouse ? 'warehouse' : 'dishes'))
  );

  React.useEffect(() => {
    if (selectedCategory !== 'all') {
      setActiveMenuTab('dishes');
    }
  }, [selectedCategory]);

  const [searchQuery, setSearchQuery] = useState('');
  // View mode: default to 'list' as requested in Image 2
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: isAr ? -offset : offset, behavior: 'smooth' });
    }
  };

  // Filter items (purely by category and search - ratings & chef/popular filters removed for full customer freedom)
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitleAr = item.titleAr.toLowerCase().includes(q);
        const matchTitleEn = item.titleEn.toLowerCase().includes(q);
        const matchDescAr = item.descAr.toLowerCase().includes(q);
        const matchDescEn = item.descEn.toLowerCase().includes(q);
        const matchRegion = (item.originRegion || '').toLowerCase().includes(q);
        return matchTitleAr || matchTitleEn || matchDescAr || matchDescEn || matchRegion;
      }

      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <section id="menu-section" className="py-6 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Optional Section Title if configured */}
        {titleAr && (
          <div className="text-center space-y-1.5 pb-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#141414] font-heading">
              {titleAr}
            </h2>
            {subtitleAr && (
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
                {subtitleAr}
              </p>
            )}
          </div>
        )}

        {/* Navigation & Top Bar (Back Button + Mode Toggles) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-[#141414] text-stone-800 hover:text-[#d4af37] text-xs sm:text-sm font-bold transition-all cursor-pointer border border-stone-200 shadow-2xs"
                title={isAr ? 'الرجوع للصفحة السابقة' : 'Back to Previous Page'}
              >
                <ArrowIcon className="w-4 h-4 text-[#b8860b]" />
                <span>{isAr ? 'الرجوع للصفحة السابقة' : 'Back to Previous Page'}</span>
              </button>
            )}

            {/* Warehouse vs Dishes tab toggle if warehouse is enabled */}
            {showDishesMenu && showMenuWarehouse && (
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMenuTab('dishes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMenuTab === 'dishes'
                      ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isAr ? 'المنيو' : 'Menu'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMenuTab('warehouse')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMenuTab === 'warehouse'
                      ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isAr ? 'بروشور المنيو' : 'Menu Brochure'}
                </button>
              </div>
            )}
          </div>

          {/* View mode toggle (List vs Grid) */}
          {activeMenuTab === 'dishes' && (
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#141414] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={isAr ? 'عرض جدول / قائمة' : 'List View'}
              >
                <LayoutList className="w-4 h-4" />
                <span>{isAr ? 'قائمة' : 'List'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#141414] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={isAr ? 'عرض شبكي' : 'Grid View'}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{isAr ? 'شبكة' : 'Grid'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Warehouse View Mode */}
        {activeMenuTab === 'warehouse' && (
          <MenuWarehouseSection
            lang={lang}
            isAdmin={isAdmin}
            warehouseItems={warehouseItems}
            onOpenAdminWarehouse={onOpenAdminWarehouse}
          />
        )}

        {/* Regular Dishes Menu */}
        {activeMenuTab === 'dishes' && (
          <div className="space-y-6">
            
            {/* Search Bar & Category Pills Bar (Matches Image 2) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Fast Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث سريع في الأصناف...' : 'Quick search in dishes...'}
                  className="w-full ps-10 pe-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#d4af37] focus:bg-white transition-colors"
                />
                <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Navigation Pills with scroll controls */}
              <div className="relative flex items-center min-w-0">
                <button
                  type="button"
                  onClick={() => handleScrollCategories('left')}
                  className="hidden sm:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                  aria-label="السابق"
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div
                  ref={categoryScrollRef}
                  className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none overscroll-x-contain touch-pan-x px-1"
                >
                  <button
                    id="category-pill-all"
                    onClick={() => onSelectCategory('all')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-transparent'
                    }`}
                  >
                    <span>{isAr ? 'جميع الأصناف' : 'All Dishes'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {menuItems.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const countInCat = menuItems.filter((i) => i.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        id={`category-pill-${cat.id}`}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-transparent'
                        }`}
                      >
                        <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800">
                          {countInCat}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleScrollCategories('right')}
                  className="hidden sm:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                  aria-label="التالي"
                >
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Dishes Listing */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#faf9f6] border border-dashed border-stone-300">
                <UtensilsCrossed className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-[#141414] mb-1 font-heading">
                  {isAr ? 'لم يتم العثور على أطباق مطابقة' : 'No Dishes Found'}
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  {isAr ? 'جرب البحث بكلمات أخرى أو اختر قسماً آخر.' : 'Try searching for other keywords.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSelectCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold hover:bg-black transition-colors border border-[#d4af37]/40 cursor-pointer"
                >
                  {isAr ? 'إعادة ضبط البحث والكل' : 'Show All Dishes'}
                </button>
              </div>
            ) : viewMode === 'list' ? (
              /* ========================================================================= */
              /* LIST / TABLE MODE: Exactly matching Image 2 (Image optional, pure rows)  */
              /* ========================================================================= */
              <div className="space-y-3">
                {filteredItems.map((dish) => {
                  const title = isAr ? dish.titleAr : dish.titleEn;
                  const desc = isAr ? dish.descAr : dish.descEn;
                  const hasImage = Boolean(dish.image && dish.image.trim().length > 5);
                  const catObj = categories.find((c) => c.id === dish.categoryId);
                  const catName = isAr ? (catObj?.nameAr || 'أصناف مختارة') : (catObj?.nameEn || 'Selected');

                  const orderWhatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    isAr
                      ? `السلام عليكم، أود الاستفسار والطلب عن: ${dish.titleAr} (السعر: ${dish.price} ${currency})`
                      : `Hello, I would like to order: ${dish.titleEn} (${dish.price} ${currency})`
                  )}`;

                  return (
                    <div
                      key={dish.id}
                      id={`dish-row-${dish.id}`}
                      onClick={() => onSelectDish(dish)}
                      className="group bg-white rounded-2xl border border-stone-200 hover:border-[#d4af37] p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-5 cursor-pointer relative"
                    >
                      {/* Direct Admin Edit Button */}
                      {isAdmin && onEditDishAdmin && (
                        <button
                          type="button"
                          id={`admin-edit-btn-${dish.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDishAdmin(dish);
                          }}
                          className="absolute top-2.5 end-2.5 z-20 px-2.5 py-1 rounded-lg bg-[#d4af37] text-[#141414] hover:bg-amber-400 text-[11px] font-extrabold flex items-center gap-1 shadow-xs border border-black/20 cursor-pointer"
                          title={isAr ? 'تعديل هذا الصنف' : 'Edit Dish'}
                        >
                          <Edit3 className="w-3 h-3 stroke-[2.5]" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                      )}

                      {/* Main Information Column */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-[#141414] group-hover:text-[#b8860b] transition-colors font-heading">
                            {title}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#faf9f6] text-[#b8860b] border border-[#d4af37]/30">
                            {catName}
                          </span>
                        </div>

                        {desc && (
                          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed font-body">
                            {desc}
                          </p>
                        )}

                        {/* Price & Serving Size */}
                        <div className="pt-1 flex items-center gap-3">
                          {showPrices && (
                            <div className="flex items-baseline gap-1.5">
                              {showDiscountPrices && dish.originalPrice && dish.originalPrice > dish.price ? (
                                <>
                                  <span className="line-through text-stone-400 text-xs font-semibold">
                                    {formatPrice(dish.originalPrice, currency, lang)}
                                  </span>
                                  <span className="text-base sm:text-lg font-extrabold text-[#d4af37] font-heading">
                                    {formatPrice(dish.price, currency, lang)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base sm:text-lg font-extrabold text-[#141414] font-heading">
                                  {formatPrice(dish.price, currency, lang)}
                                </span>
                              )}
                            </div>
                          )}

                          {dish.serves && (
                            <span className="text-xs text-stone-400 font-medium">
                              • {dish.serves}
                            </span>
                          )}

                          {dish.originRegion && (
                            <span className="text-xs text-stone-400 font-medium hidden md:inline">
                              • {dish.originRegion}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Optional Dish Thumbnail: ONLY renders if image exists, without distorting or breaking layout */}
                      {hasImage && (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 order-first sm:order-none">
                          <img
                            src={dish.image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDish(dish);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#141414] text-stone-800 hover:text-[#d4af37] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/80"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{isAr ? 'استعراض' : 'View'}</span>
                        </button>

                        <a
                          href={orderWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-white" />
                          <span>{isAr ? 'طلب واتساب' : 'WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ========================================================================= */
              /* GRID MODE: Clean card layout with optional photos and no ratings/badges  */
              /* ========================================================================= */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((dish) => {
                  const title = isAr ? dish.titleAr : dish.titleEn;
                  const desc = isAr ? dish.descAr : dish.descEn;
                  const hasImage = Boolean(dish.image && dish.image.trim().length > 5);

                  return (
                    <div
                      key={dish.id}
                      id={`dish-card-${dish.id}`}
                      onClick={() => onSelectDish(dish)}
                      className="group bg-white rounded-3xl border border-stone-200 hover:border-[#d4af37] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
                    >
                      {isAdmin && onEditDishAdmin && (
                        <button
                          type="button"
                          id={`admin-edit-grid-${dish.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDishAdmin(dish);
                          }}
                          className="absolute top-2.5 end-2.5 z-20 px-2.5 py-1 rounded-lg bg-[#d4af37] text-[#141414] hover:bg-amber-400 text-[11px] font-extrabold flex items-center gap-1 shadow-md border border-black/20 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 stroke-[2.5]" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                      )}

                      {/* Optional Photo Container */}
                      {hasImage && (
                        <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                          <img
                            src={dish.image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-[#141414] group-hover:text-[#b8860b] transition-colors line-clamp-1 font-heading">
                            {title}
                          </h3>
                          {desc && (
                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                              {desc}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                          {showPrices && (
                            <div className="text-base font-extrabold text-[#141414] font-heading">
                              {formatPrice(dish.price, currency, lang)}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDish(dish);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{isAr ? 'استعراض' : 'View'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
