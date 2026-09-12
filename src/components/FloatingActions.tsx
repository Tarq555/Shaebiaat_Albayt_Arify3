import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FloatingActionsProps {
  lang: Language;
  whatsappNumber?: string;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ lang, whatsappNumber }) => {
  const isAr = lang === 'ar';
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const number = whatsappNumber || RESTAURANT_INFO.whatsapp;
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أود الاستفسار والتواصل بخصوص مطعم شعبيات البيت الريفي بالرياض'
      : 'Hello, I would like to inquire about Shaabiyat Al-Bait Al-Reefi Restaurant in Riyadh'
  )}`;

  return (
    <aside aria-label="زر التواصل المباشر عبر واتساب والعودة للأعلى" className="fixed bottom-6 end-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Scroll to Top Button (subtle, appears when scrolling deep) */}
      {showScrollTop && (
        <button
          id="floating-scroll-top-btn"
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#141414]/90 hover:bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-lg transition-all duration-300 hover:scale-110 pointer-events-auto cursor-pointer flex items-center justify-center mb-1"
          title={isAr ? 'العودة لأعلى الصفحة' : 'Scroll to top'}
          aria-label={isAr ? 'العودة لأعلى الصفحة' : 'Scroll to top'}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* The ONE and ONLY Authentic Official WhatsApp Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer flex items-center justify-center border-2 border-white/30"
        title={isAr ? 'تواصل عبر واتساب المطعم مباشرة' : 'Chat directly on WhatsApp'}
        aria-label={isAr ? 'تواصل عبر واتساب المطعم مباشرة' : 'Chat directly on WhatsApp'}
      >
        {/* Continuous subtle pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Authentic Official WhatsApp Vector Icon */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-white relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.24 16C12.83 16.26 13.28 16.41 13.64 16.53C14.24 16.72 14.78 16.69 15.21 16.63C15.69 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.27 14.89 13.19C14.67 13.11 14.51 13.07 14.34 13.31C14.18 13.56 13.72 14.11 13.58 14.27C13.44 14.44 13.3 14.46 13.06 14.34C12.81 14.21 11.78 13.87 10.55 12.78C9.6 11.93 8.95 10.88 8.83 10.64C8.71 10.39 8.81 10.26 8.94 10.13C9.05 10.02 9.19 9.84 9.31 9.7C9.44 9.56 9.48 9.46 9.56 9.29C9.64 9.13 9.6 8.99 9.54 8.86C9.48 8.74 9.02 7.62 8.84 7.15C8.65 6.7 8.46 6.76 8.33 6.75L7.87 6.75C7.74 6.75 8.53 7.33 8.53 7.33Z" />
        </svg>
      </a>

    </aside>
  );
};
