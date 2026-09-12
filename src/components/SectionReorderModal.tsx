import React from 'react';
import {
  ArrowUp, ArrowDown, Eye, EyeOff, X, Sparkles, RefreshCw, Check,
  Layers, Sliders, LayoutGrid
} from 'lucide-react';
import { HomepageSectionConfig, HomepageSectionId, Language, SiteDisplaySettings } from '../types';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../data/restaurantData';

interface SectionReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: HomepageSectionConfig[];
  onUpdateSections: (sections: HomepageSectionConfig[]) => void;
  siteSettings: SiteDisplaySettings;
  onUpdateSiteSettings: (settings: SiteDisplaySettings) => void;
  lang: Language;
  onOpenEditSectionContent?: (sectionId: HomepageSectionId) => void;
}

export const SectionReorderModal: React.FC<SectionReorderModalProps> = ({
  isOpen,
  onClose,
  sections,
  onUpdateSections,
  siteSettings,
  onUpdateSiteSettings,
  lang,
  onOpenEditSectionContent
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onUpdateSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onUpdateSections(updated);
  };

  const toggleEnable = (id: HomepageSectionId) => {
    const updated = sections.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onUpdateSections(updated);
  };

  const handleResetDefault = () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من استعادة الترتيب الافتراضي للأقسام؟' : 'Restore default section order?')) {
      onUpdateSections(DEFAULT_HOMEPAGE_SECTIONS);
    }
  };

  const toggleHeaderTopStrip = () => {
    onUpdateSiteSettings({
      ...siteSettings,
      showHeaderTopStrip: !siteSettings.showHeaderTopStrip
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl border border-[#d4af37]/40 shadow-2xl space-y-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#141414] font-heading">
                {isAr ? 'التحكم الكامل بترتيب وعرض أقسام الصفحة الرئيسية' : 'Homepage Section Order & Display Control'}
              </h2>
              <p className="text-xs text-stone-500">
                {isAr
                  ? 'يمكنك تحريك أي قسم للأعلى أو للأسفل أو إخفاؤه أو تعديله كيفما تشاء'
                  : 'Reorder sections up/down, toggle visibility, or edit contents directly'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Controls: Header Top Strip & Sign In Button */}
        <div className="space-y-3">
          {/* Header Top Strip Quick Option */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-xs sm:text-sm text-[#141414] block">
                {isAr ? 'شريط الرأس العلوي (أوقات العمل، العنوان، التواصل)' : 'Top Header Bar (Hours, Address, Links)'}
              </span>
              <p className="text-[11px] text-stone-500">
                {isAr
                  ? 'إظهار شريط مدمج أعلى الصفحة يحتوي على أوقات العمل والعنوان وروابط سريعة'
                  : 'Display top bar containing operating hours, address, and quick links'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleHeaderTopStrip}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                siteSettings.showHeaderTopStrip
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {siteSettings.showHeaderTopStrip ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{siteSettings.showHeaderTopStrip ? (isAr ? 'مُفعّل' : 'Active') : (isAr ? 'مُعطّل' : 'Disabled')}</span>
            </button>
          </div>

          {/* Sign In Button Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-xs sm:text-sm text-[#141414] block">
                {isAr ? 'زر تسجيل الدخول للموقع (في شريط التنقل والفوتر)' : 'Website Sign In Button'}
              </span>
              <p className="text-[11px] text-stone-500">
                {isAr
                  ? 'التحكم بإظهار أو إخفاء زر تسجيل الدخول للزوار في رأس الصفحة وأسفلها'
                  : 'Toggle login button visibility for visitors in header and footer'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onUpdateSiteSettings({
                  ...siteSettings,
                  showSignInButton: siteSettings.showSignInButton === false ? true : false
                });
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                siteSettings.showSignInButton !== false
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {siteSettings.showSignInButton !== false ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{siteSettings.showSignInButton !== false ? (isAr ? 'ظاهر للزوار' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}</span>
            </button>
          </div>

          {/* Informational Guidance Box on How to Unhide Sections */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <span className="text-base leading-none">💡</span>
            <div>
              <p className="font-bold">
                {isAr ? 'كيف تجعل أي قسم مخفي ظاهراً مرة أخرى؟' : 'How to show a hidden section again?'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                {isAr
                  ? 'كل قسم في القائمة أدناه يحتوي على أيقونة العين 👁️. عند الضغط عليها يتحول القسم إلى (مخفي) أو (ظاهر للزوار) فوراً. الأقسام المخفية تظهر بلون رمادي مع زر عين أحمر، فقط اضغط عليه ليعود مرئياً على الصفحة الرئيسية.'
                  : 'Click the Eye 👁️ button next to any section below to toggle it between Visible and Hidden instantly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section List */}
        <div className="overflow-y-auto space-y-2.5 pe-1 grow">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            {isAr ? 'ترتيب ظهور الأقسام من الأعلى إلى الأسفل:' : 'Section Sequence (Top to Bottom):'}
          </div>

          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                sec.enabled
                  ? 'bg-white border-stone-200 shadow-xs hover:border-[#d4af37]/60'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              {/* Order Number & Name */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-600 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div>
                  <h4 className="font-bold text-sm text-[#141414]">
                    {isAr ? sec.nameAr : sec.nameEn}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    {sec.enabled ? (isAr ? 'ظاهر للزوار' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                
                {/* Direct Edit Section Content Button */}
                {onOpenEditSectionContent && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditSectionContent(sec.id);
                    }}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-[#d4af37] hover:text-[#141414] text-stone-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                    title={isAr ? 'تعديل محتوى هذا القسم' : 'Edit Section Content'}
                  >
                    <span>✏️</span>
                    <span className="hidden sm:inline">{isAr ? 'تعديل' : 'Edit'}</span>
                  </button>
                )}

                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تحريك لأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === sections.length - 1}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تحريك لأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => toggleEnable(sec.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    sec.enabled
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                  }`}
                  title={sec.enabled ? (isAr ? 'إخفاء القسم' : 'Hide Section') : (isAr ? 'إظهار القسم' : 'Show Section')}
                >
                  {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الترتيب الأصلي' : 'Reset to Default'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#141414] text-[#d4af37] font-bold text-xs hover:bg-black transition-colors cursor-pointer shadow-sm"
          >
            {isAr ? 'تم وحفظ الترتيب' : 'Done & Save Order'}
          </button>
        </div>

      </div>
    </div>
  );
};
