import React, { useState, useEffect } from 'react';
import {
  Sparkles, Maximize2, X, ChevronRight, ChevronLeft,
  Camera, Utensils, Building2, Users, Flame, Award
} from 'lucide-react';
import { Language } from '../types';
import { IMAGES } from '../data/restaurantData';

interface GalleryItem {
  id: string;
  category: 'dishes' | 'interior' | 'majlis' | 'presentation' | 'events';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  tagAr: string;
  tagEn: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    category: 'interior',
    titleAr: 'واجهة ومبنى صرح شعبيات البيت الريفي بالرياض',
    titleEn: 'Riyadh Flagship Landmark Facade',
    descAr: 'المقر المعتمد والفريد بالرياض بتصميم تراثي أصيل يحاكي دفء البيوت الشعبية القديمة.',
    descEn: 'Authentic heritage facade welcoming guests in the heart of Riyadh.',
    image: '/restaurant_building.jpg',
    tagAr: 'المقر والواجهة',
    tagEn: 'Flagship Facade'
  },
  {
    id: 'g-2',
    category: 'dishes',
    titleAr: 'وليمة المندي الملكي بلحم التيس البلدي',
    titleEn: 'Royal Mandi Platter with Local Lamb',
    descAr: 'مطهو على حطب السمر الطبيعي في حفر الطين بعناية لأكثر من 4 ساعات.',
    descEn: 'Slow-cooked over natural wood embers in traditional earthen pits.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'أطباق شعبية',
    tagEn: 'Traditional Mains'
  },
  {
    id: 'g-3',
    category: 'presentation',
    titleAr: 'فحسة اللحم البلدي في المدرة الحجرية البركانية',
    titleEn: 'Sizzling Stone Pot Fahsa',
    descAr: 'تُقدَّم وهي تفور بالنار والحلية الشعبية على طاولة الضيوف مباشرة.',
    descEn: 'Served bubbling hot in volcanic stone pots with fenugreek froth.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'فنون التقديم',
    tagEn: 'Presentation'
  },
  {
    id: 'g-4',
    category: 'majlis',
    titleAr: 'الجلسات العائلية التراثية الخاصة',
    titleEn: 'Private Heritage Family Majlis',
    descAr: 'خصوصية تامة، وسائد سدو تقليدية، وأجواء هادئة تسع العائلات الكبيرة.',
    descEn: 'Complete privacy with traditional Sadu cushions and spacious seating.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'جلسات عائلية',
    tagEn: 'Family Majlis'
  },
  {
    id: 'g-5',
    category: 'presentation',
    titleAr: 'خبز الملوح والتنور الطيني الطازج',
    titleEn: 'Fresh Tandoor Bread',
    descAr: 'يُخبز باليد على جدران التنور الحار فور تلقي الطلب ليصلك مقرمشاً وطازجاً.',
    descEn: 'Handmade and freshly baked on hot clay walls to crisp perfection.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'التنور والمخبوزات',
    tagEn: 'Tandoor Breads'
  },
  {
    id: 'g-6',
    category: 'events',
    titleAr: 'ضيافة الولائم والمناسبات الخاصة بالرياض',
    titleEn: 'Banquets & Private Gatherings Hospitality',
    descAr: 'تجهيز صواني الذبائح الكاملة، صحون المظبي، والمقبلات الشعبية الفاخرة.',
    descEn: 'Full feast arrangements for weddings, corporate banquets, and celebrations.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'ولائم ومناسبات',
    tagEn: 'Feasts & Events'
  },
  {
    id: 'g-7',
    category: 'dishes',
    titleAr: 'مقلقل كبدة الحاشي واللحم الطازج على الصاج',
    titleEn: 'Fresh Hashi Liver Sajiya',
    descAr: 'تُقلى مع البصل والفلفل الأخضر وبهارات البيت الريفي الخاصة.',
    descEn: 'Sautéed fresh daily on high heat cast iron with special house aromatics.',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'صاجيات طازجة',
    tagEn: 'Sajiya'
  },
  {
    id: 'g-8',
    category: 'majlis',
    titleAr: 'صالات كبار الشخصيات VIP للضيافة',
    titleEn: 'VIP Reception Halls',
    descAr: 'مجهزة بأفخم الديكورات التراثية لاستقبال ضيوفك بإكرام وتقدير يليق بهم.',
    descEn: 'Equipped with regal heritage décor to host esteemed guests with honor.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'صالات VIP',
    tagEn: 'VIP Halls'
  },
  {
    id: 'g-9',
    category: 'dishes',
    titleAr: 'المعصوب والعريكة الملكية بالعسل الدوعني',
    titleEn: 'Royal Masoub with Doani Honey',
    descAr: 'سمن بلدي فاخر، قشطة طازجة، حبة سوداء وعسل سدر جبلي أصيل.',
    descEn: 'Layered with pure local ghee, fresh cream, nigella seeds, and mountain honey.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'حلويات ملكية',
    tagEn: 'Royal Sweets'
  }
];

interface GallerySectionProps {
  lang: Language;
  isAdmin?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ lang, isAdmin = false }) => {
  const isAr = lang === 'ar';
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_gallery_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading gallery items', e);
    }
    return GALLERY_ITEMS;
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Admin Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [image, setImage] = useState('');
  const [tagAr, setTagAr] = useState('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('al_bait_gallery_items', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving gallery items', e);
    }
  }, [items]);

  // Close lightbox on Escape key & Arrow navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev === null ? null : (prev + 1) % items.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev === null ? null : (prev - 1 + items.length) % items.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items.length]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitleAr('');
    setTitleEn('');
    setDescAr('');
    setImage('');
    setTagAr('ضيافة البيت الريفي');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitleAr(item.titleAr);
    setTitleEn(item.titleEn);
    setDescAr(item.descAr);
    setImage(item.image);
    setTagAr(item.tagAr);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Delete this image?')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !image.trim()) return;

    if (editingItem) {
      setItems(prev =>
        prev.map(i =>
          i.id === editingItem.id
            ? {
                ...i,
                titleAr: titleAr.trim(),
                titleEn: titleEn.trim() || titleAr.trim(),
                descAr: descAr.trim(),
                descEn: descAr.trim(),
                image: image.trim(),
                tagAr: tagAr.trim() || 'صورة من المعرض',
                tagEn: tagAr.trim() || 'Gallery Photo'
              }
            : i
        )
      );
    } else {
      const newItem: GalleryItem = {
        id: `g-${Date.now()}`,
        category: 'dishes',
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim() || titleAr.trim(),
        descAr: descAr.trim(),
        descEn: descAr.trim(),
        image: image.trim(),
        tagAr: tagAr.trim() || 'صورة من المعرض',
        tagEn: tagAr.trim() || 'Gallery Photo'
      };
      setItems(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="gallery-section" className="py-12 sm:py-16 bg-[#faf9f6] border-y border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#b8860b] border border-[#d4af37]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            {isAr ? 'عدسة البيت الريفي' : 'Photo Gallery'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'معرض صور المطعم والأجواء والولائم' : 'Restaurant Ambiance & Dishes Gallery'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'جولة بصرية في صرح شعبيات البيت الريفي بالرياض: من نيران التنور الحية وأطباق الولائم الفاخرة، إلى خصوصية الجلسات العائلية والصالات الملكية.'
              : 'A visual journey through our Riyadh landmark: from live tandoor fires and royal banquets to intimate family majlis.'}
          </p>

          {/* Admin Toolbar to add photos directly from Home page */}
          {isAdmin && (
            <div className="pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-[#141414] text-[#d4af37] hover:bg-black border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? '+ إضافة صورة جديدة للمعرض' : '+ Add Gallery Photo'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Image Grid - Displaying all photos directly without category filter buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#d4af37]/30 shadow-sm hover:shadow-xl hover:border-[#d4af37] transition-all duration-300 h-64 sm:h-72 cursor-pointer flex flex-col justify-end p-5"
            >
              <img
                src={item.image}
                alt={isAr ? item.titleAr : item.titleEn}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Top Tag, Admin buttons & Zoom icon */}
              <div className="absolute top-4 start-4 end-4 flex items-center justify-between gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141414]/80 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-xs shadow-sm">
                  {isAr ? item.tagAr : item.tagEn}
                </span>

                <div className="flex items-center gap-1.5">
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="w-7 h-7 rounded-full bg-black/80 hover:bg-[#d4af37] hover:text-[#141414] text-white flex items-center justify-center transition-colors border border-white/20"
                        title={isAr ? 'تعديل الصورة' : 'Edit Photo'}
                      >
                        <span className="text-[11px] font-bold">✏️</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/20"
                        title={isAr ? 'حذف الصورة' : 'Delete Photo'}
                      >
                        <span className="text-[11px] font-bold">🗑️</span>
                      </button>
                    </>
                  )}
                  <span className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 group-hover:bg-[#d4af37] group-hover:text-[#141414] transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-[#d4af37] transition-colors line-clamp-1">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 font-body">
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Admin Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-[#141414] font-heading">
                {editingItem ? (isAr ? 'تعديل صورة المعرض' : 'Edit Gallery Photo') : (isAr ? 'إضافة صورة جديدة للمعرض' : 'Add New Gallery Photo')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isAr ? 'عنوان الصورة بالعربية *' : 'Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: مضبي لحم بلدي على الحجارة الحارة"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isAr ? 'رابط الصورة (URL) *' : 'Image URL *'}
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'التصنيف / الشارة' : 'Tag Badge'}
                  </label>
                  <input
                    type="text"
                    value={tagAr}
                    onChange={(e) => setTagAr(e.target.value)}
                    placeholder="ولائم ومناسبات، فخاريات..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'العنوان بالإنجليزية (اختياري)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Hot Stone Madhbi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isAr ? 'الوصف بالعربية' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="وصف مختصر للصورة..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#141414] text-[#d4af37] font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  {isAr ? 'حفظ الصورة في المعرض' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          id="gallery-lightbox-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            id="gallery-lightbox-close-btn"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 end-4 sm:top-6 sm:end-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer z-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + items.length) % items.length));
                }}
                className="absolute start-4 sm:start-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-[#d4af37]/40 transition-all cursor-pointer z-50"
                aria-label="Previous image"
              >
                <ChevronRight className="w-6 h-6 rtl:rotate-180" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
                }}
                className="absolute end-4 sm:end-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-[#d4af37]/40 transition-all cursor-pointer z-50"
                aria-label="Next image"
              >
                <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Modal Content Box */}
          <div
            className="max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-full flex items-center justify-center rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black">
              <img
                src={items[lightboxIndex].image}
                alt={isAr ? items[lightboxIndex].titleAr : items[lightboxIndex].titleEn}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption Card */}
            <div className="w-full bg-[#141414]/90 border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#d4af37] text-[#141414]">
                  {isAr ? items[lightboxIndex].tagAr : items[lightboxIndex].tagEn}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                  {isAr ? items[lightboxIndex].titleAr : items[lightboxIndex].titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300">
                  {isAr ? items[lightboxIndex].descAr : items[lightboxIndex].descEn}
                </p>
              </div>

              <span className="text-xs text-stone-400 font-mono shrink-0">
                {lightboxIndex + 1} / {items.length}
              </span>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
