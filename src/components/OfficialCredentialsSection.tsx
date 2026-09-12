import React from 'react';
import {
  ShieldCheck, Award, Flame, CheckCircle2, FileText, MapPin,
  Clock, Phone, HeartPulse, Building, ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface OfficialCredentialsSectionProps {
  lang: Language;
}

export const OfficialCredentialsSection: React.FC<OfficialCredentialsSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const compliancePillars = [
    {
      icon: HeartPulse,
      titleAr: 'إفصاح السعرات المعتمد (SFDA)',
      titleEn: 'SFDA Calorie Disclosure Compliant',
      descAr: 'عرض معتمد للسعرات الحرارية وحجم الحصة والمكونات لجميع الوجبات والولائم وفق اشتراطات الهيئة العامة للغذاء والدواء السعودية.',
      descEn: 'Full nutritional transparency with lab-verified calorie counts, portion sizes, and allergens per SFDA regulations.'
    },
    {
      icon: ShieldCheck,
      titleAr: 'لحوم بلدية طازجة 100% يومياً',
      titleEn: '100% Fresh Daily Local Meats',
      descAr: 'نلتزم بالذبح الحلال اليومي تحت رقابة بيطرية كاملة، ذبائح تيس وحاشي وغنم نعيمي محلي مبرد بدون أي مجمدات.',
      descEn: 'Strict commitment to daily fresh local livestock (camel, lamb, and goat) with veterinary hygiene certificates.'
    },
    {
      icon: Building,
      titleAr: 'ترخيص أمانة منطقة الرياض',
      titleEn: 'Riyadh Municipality Licensed',
      descAr: 'منشأة غذائية نظامية مرخصة ومعتمدة في حي ظهرة نمار، مخرج 28، الطريق الدائري الغربي بمدينة الرياض.',
      descEn: 'Fully compliant commercial license by the Municipality of Riyadh at Exit 28, Western Ring Rd.'
    },
    {
      icon: Flame,
      titleAr: 'طهي تراثي آمن وصحي',
      titleEn: 'Natural Wood & Clay Cooking',
      descAr: 'تنور طيني مطلي وفخار صخري ومغشات حجرية بركانية طبيعية تعتمد على السمن البلدي وحطب السمر الطبيعي دون زيوت مهدرجة.',
      descEn: 'Authentic stone & wood craftsmanship using pure natural ghee and clean clay pits without hydrogenated fats.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-[#d4af37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf9f6] text-[#b8860b] border border-[#d4af37]/40 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'الامتثال للمعايير والاعتمادات الرسمية بالسعودية' : 'Saudi Official Standards & SFDA Compliance'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] font-heading tracking-tight">
            {isAr ? 'أعلى معايير المصداقية والسلامة الغذائية بالرياض' : 'Certified Standards & Food Safety in Riyadh'}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'تلتزم شعبيات البيت الريفي بالأنظمة المعتمدة لبلدية الرياض وهيئة الغذاء والدواء السعودية لضمان أصالة الطعم ونظافة التحضير والشفافية التامة أمام ضيوفنا.'
              : 'Shaabiyat Al-Bait Al-Reefi adheres strictly to Riyadh municipal guidelines and SFDA standards, providing certified quality, fresh meats, and accurate nutrition.'}
          </p>
        </div>

        {/* 4 Compliance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {compliancePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#faf9f6] border border-stone-200 hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#141414] font-heading">
                    {isAr ? pillar.titleAr : pillar.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-body">
                    {isAr ? pillar.descAr : pillar.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/70 flex items-center gap-2 text-xs font-bold text-[#b8860b]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'معتمد وموثق نظامياً' : 'Officially Verified'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Maps & Verification Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[#141414] text-white border border-[#d4af37]/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-start max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d4af37] text-[#141414] inline-block mb-1">
              {isAr ? 'المقر الحقيقي الوحيد المعتمد على Google Maps' : 'Google Verified Official Coordinates'}
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-heading text-white">
              {isAr ? 'حي ظهرة نمار، مخرج 28، الطريق الدائري الغربي، الرياض' : 'Dhahrat Namar, Exit 28, Western Ring Rd, Riyadh'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 font-body">
              {isAr
                ? 'إحداثيات معتمدة: 24.561268, 46.515296 | خدمة متواصلة 24 ساعة يومياً | هاتف: ' + RESTAURANT_INFO.phoneDisplay
                : 'Coordinates: 24.561268, 46.515296 | Open 24/7 Daily | Tel: ' + RESTAURANT_INFO.phoneDisplay}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#d4af37] text-[#141414] hover:bg-[#b8860b] hover:text-white transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md"
            >
              <MapPin className="w-4 h-4" />
              <span>{isAr ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>{RESTAURANT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
