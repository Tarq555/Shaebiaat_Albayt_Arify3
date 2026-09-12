import React, { useState } from 'react';
import { Building2, MapPin, Clock, Phone, Sparkles, Navigation, X, Camera } from 'lucide-react';
import { Language } from '../types';
import { IMAGES, RESTAURANT_INFO } from '../data/restaurantData';

interface FlagshipBuildingBannerProps {
  lang: Language;
  onOpenReservation?: () => void;
  buildingPhoto?: string;
}

export const FlagshipBuildingBanner: React.FC<FlagshipBuildingBannerProps> = ({
  lang,
  onOpenReservation,
  buildingPhoto
}) => {
  const isAr = lang === 'ar';
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const currentPhoto = buildingPhoto || IMAGES.restaurantBuilding;

  React.useEffect(() => {
    if (!isPhotoModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPhotoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoModalOpen]);

  return (
    <section className="py-12 sm:py-16 bg-[#faf9f6] border-t border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card */}
        <div className="relative rounded-3xl bg-white border border-[#d4af37]/30 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Real Building Image Showcase (7/12 cols) */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] bg-black group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img
              src={currentPhoto}
              alt="صرح شعبيات البيت الريفي بالرياض - ALBAEBIAAT ALBAYT ALRIYAFI"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {/* Click to expand badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-black/75 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'صورة الواجهة الحقيقية (اضغط للتكبير)' : 'Real Building Facade'}</span>
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40">
                {isAr ? 'المقر الحصري بالرياض' : 'Flagship Landmark in Riyadh'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {isAr ? 'شعبيات البيت الريفي - صرح الضيافة والولائم' : 'Shaabiyat Al-Bait Al-Reefi Palace'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200">
                {isAr ? 'واجهة معمارية عريقة تضم صالات عائلية وجلسات أرضية VIP فسيحة' : 'Authentic architectural facade with spacious family halls & VIP dining'}
              </p>
            </div>
          </div>

          {/* Details & Visiting Information (5/12 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf9f6] border border-[#d4af37]/30 text-[#b8860b] text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'أهلاً بكم في صرحنا' : 'Welcome to Our Flagship'}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#141414] font-heading">
                {isAr ? 'ضيافة وأجواء شعبية ملكية' : 'Unforgettable Traditional Hospitality'}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-body">
                {isAr
                  ? 'يسرنا استقبالكم وعائلاتكم الكريمة في مبنانا الرئيسي المجهز بأحدث وأرقى الجلسات التراثية ومطابخ الحفر الطينية والمندي الحي.'
                  : 'We are delighted to welcome you and your family to our flagship restaurant featuring traditional seating, VIP salons, and live wood-fire pits.'}
              </p>

              {/* Fast Info Grid */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <MapPin className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#141414]">
                    <strong className="block text-[#141414] font-bold">{isAr ? 'العنوان' : 'Address'}:</strong>
                    <span className="text-stone-600">{isAr ? RESTAURANT_INFO.addressAr : RESTAURANT_INFO.addressEn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <Clock className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <div className="text-xs text-[#141414]">
                    <strong className="block text-[#141414] font-bold">{isAr ? 'ساعات العمل' : 'Hours'}:</strong>
                    <span className="font-bold text-[#b8860b]">{isAr ? 'مفتوح 24 ساعة يومياً' : 'Open 24 Hours / 7 Days'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf9f6] border border-stone-200">
                  <Phone className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <div className="text-xs text-[#141414]">
                    <strong className="block text-[#141414] font-bold">{isAr ? 'الاتصال والحجز' : 'Phone / Booking'}:</strong>
                    <span dir="ltr" className="font-mono font-bold text-[#141414]">{RESTAURANT_INFO.phoneDisplay}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={RESTAURANT_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] font-bold text-xs sm:text-sm text-center shadow-xs flex items-center justify-center gap-2 transition-all border border-[#d4af37]/40 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? 'الاتجاهات عبر Google Maps' : 'Get Directions'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Full Resolution Photo Modal */}
      {isPhotoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <button
            onClick={() => setIsPhotoModalOpen(false)}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold border border-white/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span>{isAr ? 'إغلاق (Esc)' : 'Close'}</span>
          </button>

          <div className="relative max-w-4xl w-full bg-[#141414] rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40" onClick={(e) => e.stopPropagation()}>
            <img
              src={IMAGES.restaurantBuilding}
              alt="Real Restaurant Facade - Shaabiyat Al-Bait Al-Reefi"
              className="w-full max-h-[80vh] object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start border-t border-[#d4af37]/30">
              <div>
                <h4 className="font-bold text-base text-[#d4af37]">
                  {isAr ? 'شعبيات البيت الريفي - المبنى الرئيسي بالرياض' : 'Shaabiyat Al-Bait Al-Reefi - Riyadh Landmark'}
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  {isAr ? 'ALBAEBIAAT ALBAYT ALRIYAFI - صالات الضيافة والجلسات الشعبية' : 'Authentic Hospitality Halls & VIP Seating'}
                </p>
              </div>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#141414] font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#ffe38a] transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{isAr ? 'افتح على الخريطة' : 'Open in Maps'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
