import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Upload, Loader2, Camera, Edit3 } from 'lucide-react';
import { Category, CategoryId, Language } from '../types';
import { CATEGORIES, IMAGES } from '../data/restaurantData';
import { compressImageFile } from '../utils/imageUpload';

interface BentoCategoriesProps {
  categories?: Category[];
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenCategoryDetail?: (cat: Category) => void;
  lang: Language;
  isAdmin?: boolean;
  onEditCategory?: (cat: Category) => void;
  onAddNewCategory?: () => void;
  onUpdateCategoryCover?: (cat: Category, newImageUrl: string) => void;
}

export const BentoCategories: React.FC<BentoCategoriesProps> = ({
  categories = CATEGORIES,
  onSelectCategory,
  onOpenCategoryDetail,
  lang,
  isAdmin = false,
  onEditCategory,
  onAddNewCategory,
  onUpdateCategoryCover
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);
  const [uploadingCatId, setUploadingCatId] = useState<string | null>(null);

  const handleProcessCategoryFile = async (cat: Category, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingCatId(cat.id);
    try {
      const compressed = await compressImageFile(file, 1400, 900, 0.85);
      if (onUpdateCategoryCover) {
        onUpdateCategoryCover(cat, compressed);
      }
    } catch (e) {
      console.error('Error compressing category image', e);
    } finally {
      setUploadingCatId(null);
    }
  };

  const handleCardClick = (cat: Category) => {
    onSelectCategory(cat.id);
  };

  return (
    <section id="categories-section" className="py-12 sm:py-16 bg-[#faf9f6] border-y border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b8860b]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              {isAr ? 'أقسام المطبخ اليمني التراثي' : 'Traditional Cuisine Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
              {isAr ? 'روائع المائدة والولائم الشعبية' : 'Explore Our Traditional Specialties'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl">
              {isAr
                ? 'اضغط على أي قسم لعرض جميع أطباقه الشعبية والولائم، أو استبدل صورته بالسحب والإفلات مباشرة.'
                : 'Click any category to explore its signature heritage dishes, or drop a new cover photo in admin mode.'}
            </p>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#141414] hover:text-[#b8860b] group self-start md:self-auto cursor-pointer"
          >
            <span>{isAr ? 'عرض كامل القائمة' : 'View Full Menu'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-[#d4af37]" />
          </button>
        </div>

        {/* Dynamic Bento & Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            let colSpan = 'lg:col-span-4';
            let minHeight = 'min-h-[260px]';
            
            // Logic for Bento Box layout pattern
            if (index === 0) {
              colSpan = 'lg:col-span-7 md:col-span-2';
              minHeight = 'min-h-[300px] sm:min-h-[340px]';
            } else if (index === 1) {
              colSpan = 'lg:col-span-5 md:col-span-2';
              minHeight = 'min-h-[300px] sm:min-h-[340px]';
            } else if (index % 5 === 0 || index % 5 === 1) {
              colSpan = 'lg:col-span-6 md:col-span-2';
            }

            const isThisDragOver = dragOverCatId === cat.id;
            const isThisUploading = uploadingCatId === cat.id;

            return (
              <div
                key={cat.id}
                id={`bento-category-${cat.id}`}
                onClick={() => handleCardClick(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(cat);
                  }
                }}
                onDragOver={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverCatId(cat.id);
                }}
                onDragLeave={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverCatId(null);
                }}
                onDrop={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverCatId(null);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleProcessCategoryFile(cat, e.dataTransfer.files[0]);
                  }
                }}
                className={`${colSpan} group relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#d4af37]/30 shadow-sm hover:shadow-xl hover:border-[#d4af37] transition-all duration-300 ${minHeight} flex flex-col justify-end p-5 sm:p-6 focus:outline-hidden focus:ring-2 focus:ring-[#d4af37] ${
                  isThisDragOver ? 'ring-4 ring-[#d4af37] ring-inset' : ''
                }`}
              >
                <img
                  src={cat.image || IMAGES.saltahBento}
                  alt={isAr ? cat.nameAr : cat.nameEn}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== IMAGES.saltahBento) {
                      target.src = IMAGES.saltahBento;
                    }
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Drag-over indicator overlay */}
                {isThisDragOver && (
                  <div className="absolute inset-0 z-30 bg-[#141414]/85 border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center text-center p-4">
                    <Upload className="w-10 h-10 text-[#d4af37] mb-2 animate-bounce" />
                    <p className="text-white font-bold text-sm sm:text-base">
                      {isAr ? 'أفلت الصورة هنا لاستبدال غلاف القسم' : 'Drop image to update category'}
                    </p>
                  </div>
                )}

                {/* Loading indicator overlay */}
                {isThisUploading && (
                  <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                    <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-2" />
                    <p className="text-white font-bold text-xs sm:text-sm">
                      {isAr ? 'جاري ضغط وحفظ صورة القسم...' : 'Uploading & compressing...'}
                    </p>
                  </div>
                )}
                
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {cat.badge && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-sm">
                          {cat.badge}
                        </span>
                      )}
                      {cat.count !== undefined && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs border border-white/20">
                          {isAr ? `${cat.count} أصناف` : `${cat.count} Items`}
                        </span>
                      )}
                    </div>

                    {/* Admin Direct Image Upload & Edit Buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 z-20">
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg bg-[#141414]/90 hover:bg-black text-[#d4af37] border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                          title={isAr ? 'رفع صورة غلاف للقسم من جهازك' : 'Upload Cover'}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{isAr ? 'استبدال الصورة' : 'Change Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleProcessCategoryFile(cat, f);
                            }}
                            className="hidden"
                          />
                        </label>

                        {onEditCategory && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCategory(cat);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#d4af37] text-[#141414] hover:bg-amber-400 font-bold text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                            title={isAr ? 'تعديل بيانات القسم' : 'Edit Category'}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isAr ? 'تعديل' : 'Edit'}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading group-hover:text-[#d4af37] transition-colors">
                    {isAr ? cat.nameAr : cat.nameEn}
                  </h3>

                  {(cat.descriptionAr || cat.descriptionEn) && (
                    <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-xl font-body">
                      {isAr ? cat.descriptionAr : cat.descriptionEn}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#d4af37] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isAr ? `دخول قسم ${cat.nameAr} واستعراض أطباقه` : `Enter ${cat.nameEn} Dishes`}</span>
                    <ArrowIcon className="w-4 h-4" />
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
