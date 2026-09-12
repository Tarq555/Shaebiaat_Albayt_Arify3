import React, { useState } from 'react';
import { Play, Sparkles, Flame, HeartHandshake, Award, X, Quote } from 'lucide-react';
import { Language, StoryConfig } from '../types';
import { IMAGES, DEFAULT_STORY_CONFIG } from '../data/restaurantData';

interface KitchenStorySectionProps {
  lang: Language;
  onExploreMenu: () => void;
  onBookTable: () => void;
  storyConfig?: StoryConfig;
}

export const KitchenStorySection: React.FC<KitchenStorySectionProps> = ({
  lang,
  onExploreMenu,
  onBookTable,
  storyConfig = DEFAULT_STORY_CONFIG
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const isAr = lang === 'ar';

  React.useEffect(() => {
    if (!videoModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoModalOpen]);

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Visual Showcase (Images + Video Play Trigger) (5/12 cols) */}
          <div className="lg:col-span-5 relative space-y-4">
            
            {/* Primary Chef Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#faf9f6] bg-stone-900 group">
              <img
                src={IMAGES.chefKitchenPortrait}
                alt="Yemeni Master Chef preparing dishes"
                className="w-full h-80 sm:h-96 lg:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Video Play Button Overlay */}
              <button
                id="watch-kitchen-video-btn"
                onClick={() => setVideoModalOpen(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#141414]/90 text-white flex items-center justify-center hover:bg-black hover:scale-110 transition-all shadow-2xl border-2 border-[#d4af37] group/btn cursor-pointer"
                title={isAr ? 'شاهد أسرار مطبخنا' : 'Watch Kitchen Story'}
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37] fill-current translate-x-0.5 rtl:-translate-x-0.5" />
              </button>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-1">
                  {isAr ? 'كبير الطهاة التراثيين' : 'Master Heritage Chef'}
                </span>
                <p className="text-sm sm:text-base font-semibold text-white/95">
                  {isAr ? '«السر ليس في المكونات فقط، بل في حفرة الطين والروح اليمنية الصادقة»' : '"The secret lies not just in the ingredients, but in the earthen clay pit and genuine spirit."'}
                </p>
              </div>
            </div>

            {/* Secondary Floating Heritage Scene with real building photo */}
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-[#faf9f6] border border-[#d4af37]/30 shadow-xs">
              <img
                src={IMAGES.restaurantBuilding}
                alt="ALBAEBIAAT ALBAYT ALRIYAFI Building Facade"
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#d4af37]/40 shadow-xs"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[11px] font-bold text-[#b8860b] block">
                  {isAr ? 'المقر وصالات الضيافة بالرياض' : 'Hospitality Palace in Riyadh'}
                </span>
                <h4 className="font-bold text-sm text-[#141414]">
                  {isAr ? 'شعبيات البيت الريفي الفاخر' : 'Shaabiyat Al-Bait Al-Reefi'}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 font-body">
                  {isAr
                    ? 'أجواء عائلية وتراثية فسيحة تستقبلكم على مدار 24 ساعة يومياً.'
                    : 'Spacious family seating & VIP majlis open 24/7.'}
                </p>
              </div>
            </div>

          </div>

          {/* Story Narrative & Core Pillars (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#faf9f6] border border-[#d4af37]/30 text-[#b8860b] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? (storyConfig.badgeAr || 'أصالة متوارثة جيلاً بعد جيل') : (storyConfig.badgeEn || 'Generations of Culinary Heritage')}</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight leading-tight font-heading">
                {isAr ? (
                  storyConfig.titleAr || (
                    <>
                      سر النكهة في <span className="text-[#b8860b]">شعبيات البيت الريفي</span>: حطب السمر والفخار والمدرة الحجرية
                    </>
                  )
                ) : (
                  storyConfig.titleEn || (
                    <>
                      The Soul of <span className="text-[#b8860b]">Al-Bait Al-Reefi</span>: Wood Fires, Clay Pits & Sizzling Stone
                    </>
                  )
                )}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-body">
                {isAr
                  ? (storyConfig.paragraph1Ar || 'منذ تأسيسنا في عام ١٩٨٤، حافظنا بكل إخلاص على الطرق التقليدية العريقة لطهي الولائم اليمنية. نستخدم الحفر الطينية العميقة وأخشاب السمر الجافة لإكساب لحم الضأن النكهة المدخنة التي لا تتكرر، ونخفق الحلبة الصنعانية يدوياً لتعلو أواني الفحسة الصخرية الفائرة.')
                  : (storyConfig.paragraph1En || 'Since our establishment in 1984, we have faithfully honored timeless Yemeni culinary traditions. We slow-smoke local meats in deep earthen pits with desert firewood and hand-whip fresh Sana\'ani fenugreek over sizzling stone pots.')}
              </p>

              {storyConfig.paragraph2Ar && (
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-body">
                  {isAr ? storyConfig.paragraph2Ar : (storyConfig.paragraph2En || storyConfig.paragraph2Ar)}
                </p>
              )}
            </div>

            {/* 3 Value Pillars */}
            <div className="space-y-4">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 transition-all hover:border-[#d4af37]">
                <div className="w-10 h-10 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#141414]">
                    {isAr ? 'حفرة المندي والتنور الطيني' : 'Traditional Underground Pit & Clay Tandoor'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-body">
                    {isAr
                      ? 'تدخين بطيء على الفحم الطبيعي لمدة تزيد عن ٣ ساعات ليذوب اللحم عن العظم بنعومة فائقة.'
                      : 'Slow-smoked underground over natural embers for 3+ hours until the meat melts off the bone.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 transition-all hover:border-[#d4af37]">
                <div className="w-10 h-10 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#141414]">
                    {isAr ? 'بهارات جبلية وسمن بلدي بري' : 'Wild Mountain Spices & Country Ghee'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-body">
                    {isAr
                      ? 'خلطات بهارات خاصة مطحونة طازجة يومياً مع الهيل الأخضر والزعفران والكمون البلدي والسمن الصافي.'
                      : 'Secret house spice blends freshly stone-ground daily with saffron, whole cardamom, and organic ghee.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 transition-all hover:border-[#d4af37]">
                <div className="w-10 h-10 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shrink-0 shadow-xs">
                  <HeartHandshake className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#141414]">
                    {isAr ? 'كرم الضيافة والجلسات العائلية' : 'Authentic Hospitality & Private Family Majlis'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-body">
                    {isAr
                      ? 'جلسات عربية شعبية مريحة مع الشاي العدني المهيل والترحيب اليماني الدافئ.'
                      : 'Spacious traditional cushioned majlis dining areas with complimentary spiced tea and genuine warmth.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Chef Quote Card */}
            {(storyConfig.chefQuoteAr || storyConfig.chefQuoteEn) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/30 flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#141414] text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                  <Quote className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm italic font-medium text-[#141414] leading-relaxed">
                    {isAr ? storyConfig.chefQuoteAr : (storyConfig.chefQuoteEn || storyConfig.chefQuoteAr)}
                  </p>
                  <span className="text-[11px] font-bold text-[#b8860b] block">
                    — {isAr ? 'كبير طهاة البيت الريفي' : 'Executive Chef, Al-Bait Al-Reefi'}
                  </span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="story-explore-menu-btn"
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {isAr ? 'تذوق أطباقنا التراثية' : 'Taste Our Heritage Dishes'}
              </button>
              <button
                id="story-book-table-btn"
                onClick={onBookTable}
                className="px-6 py-3.5 rounded-xl bg-[#faf9f6] hover:bg-stone-100 text-[#141414] border border-[#d4af37]/30 font-bold text-sm transition-all cursor-pointer"
              >
                {isAr ? 'حجز جلسة في المطعم' : 'Reserve a Majlis Dining'}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Video / Visual Modal */}
      {videoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVideoModalOpen(false);
          }}
        >
          <button
            onClick={() => setVideoModalOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-xl flex items-center gap-2 text-xs font-bold border border-white/30 cursor-pointer"
            title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">{isAr ? 'إغلاق' : 'Close'}</span>
          </button>

          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#faf9f6] border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#b8860b]" />
                <h3 className="font-bold text-base sm:text-lg text-[#141414]">
                  {isAr ? 'في كواليس مطبخ شعبيات البيت الريفي' : 'Behind the Scenes at Al-Bait Al-Reefi'}
                </h3>
              </div>
              <button
                id="close-video-modal-btn"
                onClick={() => setVideoModalOpen(false)}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-[#141414] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">{isAr ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                <img
                  src={IMAGES.chefKitchenPortrait}
                  alt="Chef preparation"
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center border-2 border-[#d4af37]">
                    <Flame className="w-8 h-8 text-[#d4af37]" />
                  </div>
                  <h4 className="text-xl font-bold font-heading text-white">
                    {isAr ? 'طقوس إعداد المندي والفحسة الصنعانية' : 'The Ritual of Mandi & Sizzling Fahsa'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-200 max-w-md">
                    {isAr
                      ? 'يتم إشعال أخشاب السمر عند الفجر لتصل حرارة حفرة الطين للدرجة المثالية قبل إنزال ذبائح اللحم المتبلة بالزعفران والبهارات النادرة.'
                      : 'Firewood is ignited at dawn so the clay pit reaches peak smoking temperature before the saffron-marinated meats are lowered.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <span className="block text-lg font-extrabold text-[#141414]">١٠٠٪</span>
                  <span className="text-xs text-stone-600">{isAr ? 'خشب سمر طبيعي' : 'Natural Firewood'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <span className="block text-lg font-extrabold text-[#b8860b]">٤٠ عاماً</span>
                  <span className="text-xs text-stone-600">{isAr ? 'خبرة وتوارث' : 'Heritage Legacy'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <span className="block text-lg font-extrabold text-[#141414]">٥ نجوم</span>
                  <span className="text-xs text-stone-600">{isAr ? 'رضا الزبائن' : 'Customer Rating'}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#faf9f6] border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {isAr ? 'اضغط خارج النافذة أو Esc للإغلاق' : 'Click outside or press Esc to close'}
              </span>
              <button
                id="close-kitchen-dialog-btn"
                onClick={() => setVideoModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>{isAr ? 'إغلاق النافذة' : 'Close Window'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
