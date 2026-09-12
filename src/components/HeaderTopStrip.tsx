import React from 'react';
import { Clock, MapPin, Phone, MessageCircle, Utensils, Compass, Calendar, ChevronRight } from 'lucide-react';
import { Language, RestaurantInfoType } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeaderTopStripProps {
  lang: Language;
  onNavigate: (tab: 'home' | 'menu' | 'gallery' | 'contact') => void;
  onOpenReservation: () => void;
  restaurantInfo?: RestaurantInfoType;
}

export const HeaderTopStrip: React.FC<HeaderTopStripProps> = ({
  lang,
  onNavigate,
  onOpenReservation,
  restaurantInfo
}) => {
  const isAr = lang === 'ar';
  const info = restaurantInfo || RESTAURANT_INFO;

  const popularDishes = [
    { nameAr: 'مندي حطب بلدي', nameEn: 'Wood-Fired Mandi' },
    { nameAr: 'فحسة حجرية فائرة', nameEn: 'Sizzling Stone Fahsa' },
    { nameAr: 'عريكة ملكية بالعسل', nameEn: 'Royal Honey Arika' },
    { nameAr: 'كبدة حاشي صاج', nameEn: 'Hashi Liver Sajiya' }
  ];

  return (
    <div id="header-top-strip" className="bg-[#141414] text-white border-b border-[#d4af37]/35 py-2 px-3 sm:px-6 text-xs transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left / Info: Hours, Address & Quick Contact */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-stone-300">
          <div className="flex items-center gap-1.5 text-[#d4af37]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">{isAr ? info.openingHoursAr : info.openingHoursEn}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>{isAr ? info.addressAr : info.addressEn}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${info.phone}`}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-800 hover:bg-[#d4af37] hover:text-[#141414] text-stone-200 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#d4af37]" />
              <span className="font-mono font-bold" dir="ltr">{info.phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        {/* Right / Navigation: Quick Links & Popular Dishes */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 text-stone-300">
          
          {/* Quick Links */}
          <div className="flex items-center gap-1.5 border-e border-stone-700 pe-3 me-1 hidden lg:flex">
            <span className="text-stone-400 font-bold">{isAr ? 'روابط سريعة:' : 'Links:'}</span>
            <button
              onClick={() => onNavigate('menu')}
              className="hover:text-[#d4af37] px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              {isAr ? 'المنيو' : 'Menu'}
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="hover:text-[#d4af37] px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              {isAr ? 'المعرض' : 'Gallery'}
            </button>
            <button
              onClick={onOpenReservation}
              className="hover:text-[#d4af37] px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#d4af37] font-bold"
            >
              {isAr ? 'حجز طاولة' : 'Reserve'}
            </button>
          </div>

          {/* Popular Dishes ticker */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#d4af37] font-bold flex items-center gap-1">
              <Utensils className="w-3 h-3" />
              <span className="hidden sm:inline">{isAr ? 'أشهر الأطباق:' : 'Popular:'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {popularDishes.map((dish, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-medium hover:bg-white/20 transition-colors"
                >
                  {isAr ? dish.nameAr : dish.nameEn}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
