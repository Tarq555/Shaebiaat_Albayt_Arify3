import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Flame, Sparkles, Beef, CookingPot,
  Clock, Building2, Utensils, MessageCircle, Calendar,
  Maximize2, X, PhoneCall, CheckCircle2, ChevronRight, MapPin, Share2,
  BookOpen
} from 'lucide-react';
import { Language, HeroConfig, SiteDisplaySettings, RestaurantInfoType } from '../types';
import { IMAGES, RESTAURANT_INFO, DEFAULT_HERO_CONFIG } from '../data/restaurantData';

interface HeroProps {
  lang: Language;
  onExploreMenu: () => void;
  onBookTable: () => void;
  onDishSelect: (dishId: string) => void;
  heroConfig?: HeroConfig;
  catalogOnlyMode?: boolean;
  restaurantInfo?: RestaurantInfoType;
  onOpenReadyMenu?: () => void;
  isAdmin?: boolean;
  onOpenEditHero?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExploreMenu,
  onBookTable,
  onDishSelect,
  heroConfig = DEFAULT_HERO_CONFIG,
  catalogOnlyMode = true,
  restaurantInfo,
  onOpenReadyMenu,
  isAdmin = false,
  onOpenEditHero
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [activeMediaView, setActiveMediaView] = useState<'building' | 'feast'>('building');
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false);
  const info = restaurantInfo || RESTAURANT_INFO;

  // WhatsApp pre-filled inquiry text
  const whatsappUrl = `https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أود الاستفسار والتواصل بخصوص مطعم شعبيات البيت الريفي بالرياض'
      : 'Hello, I would like to inquire about Shaabiyat Al-Bait Al-Reefi Restaurant in Riyadh'
  )}`;

  // Opacity helper from 20 to 85
  const opacityValue = (heroConfig.overlayOpacity || 60) / 100;

  return (
    <section className="relative overflow-hidden pt-3 sm:pt-6 pb-12 sm:pb-16 lg:pb-20">
      
      {/* Outer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card with Transparent Image & Glassmorphism Definition */}
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/40 bg-[#121212]">
          
          {/* Background Image: The Real Authentic Restaurant Photo (or Feast) */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeMediaView === 'building' ? (heroConfig.bgImage || IMAGES.restaurantBuilding) : IMAGES.heroMandiPlatter}
              alt="صرح شعبيات البيت الريفي بالرياض - ALBAEBIAAT ALBAYT ALRIYAFI"
              className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out filter contrast-105"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            {/* The Expressive Transparent / Translucent Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/80 to-black/60 transition-opacity duration-300"
              style={{ opacity: Math.max(0.4, Math.min(0.92, opacityValue + 0.15)) }}
            />
            {/* Subtle Luxury Dark Glass Tint Layer */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>

          {/* Hero Content Grid (Right over the transparent building photo) */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 xl:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left/Right Text Introduction & Definition Section (7/12 cols) */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                
                {/* Riyadh Exclusive Tag */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md text-xs sm:text-sm font-bold tracking-wide shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
                    <span>{isAr ? (heroConfig.badgeAr || 'المقر الحصري والوحيد بالرياض (لا توجد فروع أخرى)') : (heroConfig.badgeEn || 'Exclusive Riyadh Flagship')}</span>
                  </div>

                  {isAdmin && onOpenEditHero && (
                    <button
                      type="button"
                      onClick={onOpenEditHero}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37] hover:bg-amber-400 text-[#141414] font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <span>✏️</span>
                      <span>{isAr ? 'تعديل الصرح والتعريف والصورة' : 'Edit Landmark & Photo'}</span>
                    </button>
                  )}
                </div>

                {/* Main Grand Title */}
                <div className="space-y-2.5">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.18] font-heading drop-shadow-md">
                    <span className="block text-white/95">
                      {isAr ? (heroConfig.titleLine1Ar || 'عراقة الطعم الشعبي والولائم الأصيلة') : (heroConfig.titleLine1En || 'Authentic Heritage Cuisine & Feasts')}
                    </span>
                    <span className="text-[#d4af37] font-calligraphy text-4xl sm:text-5xl md:text-6xl xl:text-7xl block mt-2 drop-shadow-lg">
                      {isAr ? (heroConfig.titleHighlightAr || 'في شعبيات البيت الريفي بالرياض') : (heroConfig.titleHighlightEn || 'Shaabiyat Al-Bait Al-Reefi')}
                    </span>
                  </h1>
                </div>

                {/* THE DEFINITION OF THE RESTAURANT (التعريف بالمطعم فوق الصورة الشفافة) */}
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/50 backdrop-blur-md border border-[#d4af37]/30 shadow-xl max-w-3xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    <Building2 className="w-4 h-4 text-[#d4af37]" />
                    <span>{isAr ? 'التعريف بمطعمنا وصرحنا الحصري بالرياض' : 'About Our Riyadh Flagship'}</span>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-body">
                    {isAr ? (
                      heroConfig.definitionAr ||
                      'المقر الحصري والوحيد بالعاصمة الرياض لتقديم أشهى ولائم المندي والحنيذ والزربيان على حطب السمر الطبيعي، الفحسة والسلتة الفائرة بالمدرة الحجرية، كبدة الحاشي والتقاطيع الطازجة، المطبق المقرمش، والمعصوب والعريكة الملكية على مدار 24 ساعة يومياً. (لا توجد أي فروع أخرى للمطعم خارج الرياض أو باليمن).'
                    ) : (
                      heroConfig.definitionEn ||
                      'The exclusive Riyadh flagship presenting authentic slow-smoked wood-fired lamb Mandi, Zurbian, bubbling stone-pot Fahsa & Saltah, fresh hashi liver, crispy Mutabbaq, and royal Masoub & Arika 24/7.'
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/70">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-emerald-300">
                      {isAr ? 'المطعم يستقبلكم الآن بالرياض بكامل طاقته' : 'Open now in Riyadh for dine-in & takeaway'}
                    </span>
                    <span className="text-white/40">•</span>
                    <span>{isAr ? 'جلسات عائلية خاصة وصالات VIP' : 'Private Family & VIP Majlis'}</span>
                  </div>
                </div>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  
                  {/* 1. Explore Menu Catalog Button */}
                  <button
                    id="hero-explore-catalog-btn"
                    onClick={onExploreMenu}
                    className="group px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59b27] hover:brightness-105 text-[#141414] font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <span>{isAr ? 'المنيو' : 'Menu'}</span>
                    <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </button>

                  {/* 2. Direct Phone Call Button */}
                  <a
                    id="hero-call-now-btn"
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/60 font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2.5 cursor-pointer hover:border-[#d4af37]"
                  >
                    <PhoneCall className="w-4 h-4 text-[#d4af37]" />
                    <span>{isAr ? 'اتصل بنا' : 'Call Us'}</span>
                  </a>

                  {/* 3. Direct Location on Map Button */}
                  <a
                    id="hero-maps-location-btn"
                    href={info.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base transition-all backdrop-blur-md shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span>{isAr ? 'الموقع على الخريطة' : 'Location on Map'}</span>
                  </a>

                  {/* 4. Direct WhatsApp Inquiry */}
                  <a
                    id="hero-whatsapp-inquiry-btn"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>{isAr ? (heroConfig.contactBtnTextAr || 'طلب واتساب') : (heroConfig.contactBtnTextEn || 'WhatsApp')}</span>
                  </a>
                </div>

                {/* Quick Social & Direct Navigation Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300">
                  <span className="text-[#d4af37] font-semibold">{isAr ? 'تابعنا وتواصل معنا:' : 'Connect with us:'}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {info.socialLinks?.tiktok && (info.showSocialLinks?.tiktok !== false) && (
                      <a
                        href={info.socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <span>تيك توك</span>
                      </a>
                    )}
                    {info.socialLinks?.instagram && (info.showSocialLinks?.instagram !== false) && (
                      <a
                        href={info.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <span>انستغرام</span>
                      </a>
                    )}
                    {info.socialLinks?.snapchat && (info.showSocialLinks?.snapchat !== false) && (
                      <a
                        href={info.socialLinks.snapchat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <span>سناب شات</span>
                      </a>
                    )}
                    {info.socialLinks?.twitter && (info.showSocialLinks?.twitter !== false) && (
                      <a
                        href={info.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <span>منصة إكس</span>
                      </a>
                    )}
                    {info.socialLinks?.youtube && (info.showSocialLinks?.youtube !== false) && (
                      <a
                        href={info.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        <span>يوتيوب</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 3 Heritage Trust Pillars */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-6 border-t border-white/15">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 text-[#d4af37] flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {isAr ? (heroConfig.pillar1TitleAr || 'حطب وتنور طيني') : 'Wood-Fired Tandoor'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-300 hidden sm:block">
                        {isAr ? (heroConfig.pillar1DescAr || 'طهي بطيء تحت الأرض') : 'Slow smoked earthen pit'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 text-[#d4af37] flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Beef className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {isAr ? (heroConfig.pillar2TitleAr || 'لحوم بلدية طازجة 100%') : '100% Fresh Local Meats'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-300 hidden sm:block">
                        {isAr ? (heroConfig.pillar2DescAr || 'ذبائح تيس وحاشي وغنم يومياً') : 'Fresh daily meat cuts'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 text-[#d4af37] flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <CookingPot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {isAr ? (heroConfig.pillar3TitleAr || 'مدرة حجرية تفور') : 'Volcanic Stone Pots'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-300 hidden sm:block">
                        {isAr ? (heroConfig.pillar3DescAr || 'فحسة وسلتة ساخنة') : 'Sizzling hot table service'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side Visual Showcase Box (4/12 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Floating Preview Card */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-black/50 backdrop-blur-md group">
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={heroConfig.bgImage || IMAGES.restaurantBuilding}
                      alt="Restaurant Building"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Top Action Triggers: Zoom only */}
                    <div className="absolute top-3 end-3 flex items-center gap-2 z-10">
                      <button
                        id="hero-zoom-preview-btn"
                        onClick={() => setIsPhotoZoomOpen(true)}
                        className="p-2 px-3 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-[#d4af37]/40 shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        title={isAr ? 'تكبير صورة المطعم بجودة عالية' : 'Zoom in photo'}
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isAr ? 'تكبير الصورة' : 'Zoom'}</span>
                      </button>
                    </div>

                    {/* Bottom Caption inside card */}
                    <div className="absolute bottom-3 start-3 end-3 text-white space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#d4af37] text-[#141414]">
                        {isAr ? 'المقر الحصري بالرياض' : 'Riyadh Flagship'}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                        {isAr ? 'صرح ومبنى شعبيات البيت الريفي' : 'Shaabiyat Al-Bait Al-Reefi Palace'}
                      </h4>
                    </div>
                  </div>

                  {/* Card quick actions */}
                  <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-xs text-white/80">
                      <span className="block font-semibold text-[#d4af37]">
                        {isAr ? 'ساعات العمل:' : 'Hours:'}
                      </span>
                      <span>{isAr ? 'مفتوح 24 ساعة يومياً' : 'Open 24/7'}</span>
                    </div>

                    <div className="text-xs text-white/80 text-end">
                      <span className="block font-semibold text-[#d4af37]">
                        {isAr ? 'المقر المعتمد:' : 'Flagship:'}
                      </span>
                      <span>{isAr ? 'الرياض - السلي' : 'Riyadh - As-Sulay'}</span>
                    </div>
                  </div>
                </div>

                {/* Exclusive Branch Notice Pill */}
                <div className="p-3.5 rounded-2xl bg-[#141414]/90 border border-[#d4af37]/40 backdrop-blur-md text-center">
                  <p className="text-xs text-[#d4af37] font-bold">
                    {isAr
                      ? '📍 فرعنا الحصري الوحيد في الرياض - لا توجد أي فروع أخرى'
                      : '📍 Exclusive Sole Flagship in Riyadh - No other branches'}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Photo Zoom Modal */}
      {isPhotoZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPhotoZoomOpen(false)}
        >
          <button
            onClick={() => setIsPhotoZoomOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-xl flex items-center gap-2 text-xs font-bold border border-white/30 cursor-pointer"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
            <span>{isAr ? 'إغلاق' : 'Close'}</span>
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={heroConfig.bgImage || IMAGES.restaurantBuilding}
              alt="صورة صرح شعبيات البيت الريفي بالرياض الحقيقية"
              className="w-full h-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="p-4 bg-black/90 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
              <div>
                <h3 className="font-bold text-base text-[#d4af37]">
                  {isAr ? 'صرح شعبيات البيت الريفي بالرياض - الصورة الحقيقية للواجهة' : 'Shaabiyat Al-Bait Al-Reefi Riyadh - Real Building Facade'}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  {isAr ? 'المقر الحصري بالرياض - صالات عائلية وجلسات أرضية VIP مفتوحة 24 ساعة' : 'Exclusive Riyadh Flagship - Open 24/7 with Private Majlis'}
                </p>
              </div>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold shadow-md transition-all"
              >
                {isAr ? 'فتح في خرائط Google' : 'Open in Google Maps'}
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
