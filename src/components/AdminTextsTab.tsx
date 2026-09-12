import React, { useState } from 'react';
import {
  Type, Sparkles, Check, Save, Undo2, Bold, Eye, FileText,
  Sliders, MessageSquare, Layers, Award, ShieldCheck, Flame, Beef, CookingPot
} from 'lucide-react';
import { HeroConfig, SiteDisplaySettings, RestaurantInfoType, Language } from '../types';

interface AdminTextsTabProps {
  heroConfig: HeroConfig;
  onUpdateHeroConfig: (config: HeroConfig) => void;
  siteSettings: SiteDisplaySettings;
  onUpdateSiteSettings: (settings: SiteDisplaySettings) => void;
  restaurantInfo: RestaurantInfoType;
  onUpdateRestaurantInfo: (info: RestaurantInfoType) => void;
  lang: Language;
}

export const AdminTextsTab: React.FC<AdminTextsTabProps> = ({
  heroConfig,
  onUpdateHeroConfig,
  siteSettings,
  onUpdateSiteSettings,
  restaurantInfo,
  onUpdateRestaurantInfo,
  lang
}) => {
  const isAr = lang === 'ar';
  const [activeCategory, setActiveCategory] = useState<'hero' | 'sections' | 'footer' | 'typography'>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local Form States
  const [localHero, setLocalHero] = useState<HeroConfig>(heroConfig);
  const [localSettings, setLocalSettings] = useState<SiteDisplaySettings>(siteSettings);
  const [localInfo, setLocalInfo] = useState<RestaurantInfoType>(restaurantInfo);

  const handleSaveAll = () => {
    onUpdateHeroConfig(localHero);
    onUpdateSiteSettings(localSettings);
    onUpdateRestaurantInfo(localInfo);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setLocalHero(heroConfig);
    setLocalSettings(siteSettings);
    setLocalInfo(restaurantInfo);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#141414] text-white border border-[#d4af37]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#d4af37]/20 text-[#d4af37]">
              <Type className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-extrabold text-white">
              {isAr ? 'التحكم في جميع نصوص وعناوين الموقع' : 'Control All Website Texts & Headings'}
            </h3>
          </div>
          <p className="text-xs text-stone-300">
            {isAr
              ? 'يمكنك هنا تعديل كل كلمة تظهر على الموقع، سواء العناوين العريضة أو النصوص العادية أو شارات الأقسام، مع المعاينة الفورية.'
              : 'Edit every word appearing on the website, both bold titles and regular body text.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'تراجع' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? (isAr ? 'تم الحفظ بنجاح!' : 'Saved!') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveCategory('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'hero'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'الواجهة الرئيسية (Hero)' : 'Hero Section'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'sections'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isAr ? 'عناوين ونصوص الأقسام' : 'Section Headings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('footer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'footer'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isAr ? 'نصوص أسفل الموقع (الفوتر)' : 'Footer Texts'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('typography')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'typography'
              ? 'bg-[#141414] text-[#d4af37] shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isAr ? 'سماكة الخطوط ومظهرها' : 'Typography & Weight'}</span>
        </button>
      </div>

      {/* 1. HERO SECTION TEXTS */}
      {activeCategory === 'hero' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
            <Bold className="w-4 h-4 text-[#b8860b] shrink-0" />
            <span>{isAr ? 'يمكنك التمييز بين النصوص العريضة (العناوين البارزة) والنصوص العادية (الشرح والوصف):' : 'Customize bold headlines and normal body text:'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Badge */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                {isAr ? 'الشارة العلوية (نص عادي صغير)' : 'Top Exclusive Badge'}
              </label>
              <input
                type="text"
                value={localHero.topBadgeAr || ''}
                onChange={(e) => setLocalHero({ ...localHero, topBadgeAr: e.target.value })}
                placeholder="صرح الضيافة اليمنية الأصيلة الأول بالرياض"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-[#d4af37] bg-white"
              />
            </div>

            {/* Subtitle / Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-stone-800">
                {isAr ? 'نص التعريف وقصة المطعم (الخط العادي)' : 'Hero Subtitle & Description (Normal Font)'}
              </label>
              <textarea
                rows={3}
                value={localHero.subtitleAr || ''}
                onChange={(e) => setLocalHero({ ...localHero, subtitleAr: e.target.value })}
                placeholder="حيث يجتمع عبق التراث وعراقة الطهي على حطب السمر الطبيعي..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-[#d4af37] bg-white leading-relaxed"
              />
            </div>

            {/* Title Line 1 (Bold) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[10px]">{isAr ? 'عريض' : 'Bold'}</span>
                <span>{isAr ? 'عنوان الواجهة - السطر الأول' : 'Hero Title - Line 1'}</span>
              </label>
              <input
                type="text"
                value={localHero.titleLine1Ar || ''}
                onChange={(e) => setLocalHero({ ...localHero, titleLine1Ar: e.target.value })}
                placeholder="شعبيات البيت الريفي بالرياض"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:outline-hidden focus:border-[#d4af37] bg-white"
              />
            </div>

            {/* Title Line 2 / Highlight (Calligraphy Bold) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[10px]">{isAr ? 'خط ديواني عريض' : 'Calligraphy Bold'}</span>
                <span>{isAr ? 'النص الذهبي البارز' : 'Golden Highlight'}</span>
              </label>
              <input
                type="text"
                value={localHero.titleHighlightAr || ''}
                onChange={(e) => setLocalHero({ ...localHero, titleHighlightAr: e.target.value })}
                placeholder="مأكولات وتراث يمني أصيل"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-[#b8860b] focus:outline-hidden focus:border-[#d4af37] bg-white"
              />
            </div>
          </div>

          {/* 3 Pillars Section */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] flex items-center gap-2">
              <span>{isAr ? 'أركان الثقة التراثية الثلاثة في الواجهة:' : 'Three Heritage Trust Pillars in Hero:'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1 */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 text-[#b8860b]">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold">{isAr ? 'الركن الأول (حطب وتنور طيني)' : 'Pillar 1'}</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700">{isAr ? 'العنوان (عريض):' : 'Title (Bold):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar1TitleAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar1TitleAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600">{isAr ? 'الوصف (عادي):' : 'Description (Normal):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar1DescAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar1DescAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 text-[#b8860b]">
                  <Beef className="w-4 h-4" />
                  <span className="text-xs font-bold">{isAr ? 'الركن الثاني (لحوم بلدية طازجة)' : 'Pillar 2'}</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700">{isAr ? 'العنوان (عريض):' : 'Title (Bold):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar2TitleAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar2TitleAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600">{isAr ? 'الوصف (عادي):' : 'Description (Normal):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar2DescAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar2DescAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 text-[#b8860b]">
                  <CookingPot className="w-4 h-4" />
                  <span className="text-xs font-bold">{isAr ? 'الركن الثالث (مدرة حجرية تفور)' : 'Pillar 3'}</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700">{isAr ? 'العنوان (عريض):' : 'Title (Bold):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar3TitleAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar3TitleAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600">{isAr ? 'الوصف (عادي):' : 'Description (Normal):'}</label>
                  <input
                    type="text"
                    value={localHero.pillar3DescAr || ''}
                    onChange={(e) => setLocalHero({ ...localHero, pillar3DescAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Branch Notice */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <label className="block text-xs font-bold text-stone-800">
              {isAr ? 'تنبيه الفرع الحصري الوحيد في الرياض' : 'Exclusive Branch Notice'}
            </label>
            <input
              type="text"
              value={localSettings.exclusiveBranchNoticeAr || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, exclusiveBranchNoticeAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>
        </div>
      )}

      {/* 2. SECTION HEADINGS & TEXTS */}
      {activeCategory === 'sections' && (
        <div className="space-y-6">
          {/* Categories Section */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>{isAr ? 'أقسام المطبخ والمأكولات (Categories Section)' : 'Categories Section'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isAr ? 'الشارة العلوية الصغرى:' : 'Badge Text:'}</label>
                <input
                  type="text"
                  value={localSettings.categoriesBadgeAr || 'أقسام المطبخ اليمني التراثي'}
                  onChange={(e) => setLocalSettings({ ...localSettings, categoriesBadgeAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isAr ? 'العنوان الرئيسي (عريض):' : 'Main Heading (Bold):'}</label>
                <input
                  type="text"
                  value={localSettings.categoriesTitleAr || 'روائع المائدة والولائم الشعبية'}
                  onChange={(e) => setLocalSettings({ ...localSettings, categoriesTitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">{isAr ? 'النص التوضيحي للقسم (عادي):' : 'Description (Normal):'}</label>
                <input
                  type="text"
                  value={localSettings.categoriesSubtitleAr || 'اضغط على أي قسم لعرض جميع أطباقه الشعبية والولائم، أو استبدل صورته بالسحب والإفلات مباشرة.'}
                  onChange={(e) => setLocalSettings({ ...localSettings, categoriesSubtitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] pb-2 border-b border-stone-100">
              <span>{isAr ? 'صفحة المنيو (Menu Page)' : 'Menu Page'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isAr ? 'عنوان المنيو الرئيسي (عريض):' : 'Menu Title (Bold):'}</label>
                <input
                  type="text"
                  value={localSettings.menuTitleAr || 'المنيو وقائمة الأطباق الشعبية'}
                  onChange={(e) => setLocalSettings({ ...localSettings, menuTitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">{isAr ? 'النص التوضيحي للمنيو (عادي):' : 'Menu Description (Normal):'}</label>
                <input
                  type="text"
                  value={localSettings.menuSubtitleAr || 'تصفح أشهى ولائم المندي، الفخاريات الحجرية، الصاجيات والمشروبات التراثية'}
                  onChange={(e) => setLocalSettings({ ...localSettings, menuSubtitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] pb-2 border-b border-stone-100">
              <span>{isAr ? 'معرض صور المطعم والأجواء (Gallery Section)' : 'Gallery Section'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isAr ? 'الشارة العلوية للمعرض:' : 'Badge Text:'}</label>
                <input
                  type="text"
                  value={localSettings.galleryBadgeAr || 'عدسة البيت الريفي'}
                  onChange={(e) => setLocalSettings({ ...localSettings, galleryBadgeAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isAr ? 'عنوان المعرض الرئيسي (عريض):' : 'Gallery Title (Bold):'}</label>
                <input
                  type="text"
                  value={localSettings.galleryTitleAr || 'معرض صور المطعم والأجواء والولائم'}
                  onChange={(e) => setLocalSettings({ ...localSettings, galleryTitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">{isAr ? 'النص التوضيحي للمعرض (عادي):' : 'Gallery Description (Normal):'}</label>
                <input
                  type="text"
                  value={localSettings.gallerySubtitleAr || 'جولة بصرية في صرح شعبيات البيت الريفي بالرياض: من نيران التنور الحية وأطباق الولائم الفاخرة، إلى خصوصية الجلسات العائلية والصالات الملكية.'}
                  onChange={(e) => setLocalSettings({ ...localSettings, gallerySubtitleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FOOTER TEXTS */}
      {activeCategory === 'footer' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] pb-2 border-b border-stone-100">
              <span>{isAr ? 'نصوص أسفل الصفحة (الفوتر)' : 'Footer Texts'}</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'نبذة المطعم التراثية في الفوتر (خط عادي):' : 'Footer About Paragraph (Normal Font):'}
                </label>
                <textarea
                  rows={3}
                  value={localSettings.footerAboutAr || 'نقدم لكم أصالة المذاق اليمني المستوحى من عراقة صنعاء وحضرموت وعدن، بمكونات بلدية طازجة وطهي على الحطب والتنور الطيني.'}
                  onChange={(e) => setLocalSettings({ ...localSettings, footerAboutAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'نص حقوق النشر والتذييل:' : 'Copyright Notice:'}
                </label>
                <input
                  type="text"
                  value={localSettings.footerCopyrightAr || `جميع الحقوق محفوظة © ${new Date().getFullYear()} شعبيات البيت الريفي - أصالة المذاق والضيافة اليمنية.`}
                  onChange={(e) => setLocalSettings({ ...localSettings, footerCopyrightAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TYPOGRAPHY & WEIGHT SETTINGS */}
      {activeCategory === 'typography' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#141414] pb-2 border-b border-stone-100 flex items-center gap-2">
              <Bold className="w-4 h-4 text-[#d4af37]" />
              <span>{isAr ? 'خيارات سماكة الخطوط العادية والوضوح' : 'Font Weight & Legibility Settings'}</span>
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-stone-900">
                    {isAr ? 'تغميق الخطوط العادية لسهولة القراءة' : 'Enforce Medium/Bold Font Weight'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {isAr ? 'يجعل كل النصوص العادية في الموقع أكثر وضوحاً وسماكة مريحة للعين.' : 'Enhances body text weight across the whole site for better contrast.'}
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.extraBoldText || false}
                    onChange={(e) => setLocalSettings({ ...localSettings, extraBoldText: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button Floating Bar */}
      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-2xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/50 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? (isAr ? 'تم الحفظ بنجاح!' : 'Saved Successfully!') : (isAr ? 'حفظ جميع النصوص' : 'Save All Texts')}</span>
        </button>
      </div>
    </div>
  );
};
