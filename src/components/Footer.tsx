import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Shield, User, Gift } from 'lucide-react';
import { Language, MemberUser } from '../types';
import { RestaurantInfoType } from './AdminManagerModal';
import { RestaurantLogo } from './RestaurantLogo';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: 'home' | 'menu' | 'gallery' | 'story' | 'contact' | 'table-menu') => void;
  onOpenReservation: () => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
  onOpenAdminLogin: () => void;
  onOpenAuthModal?: () => void;
  currentMember?: MemberUser | null;
  restaurantInfo?: RestaurantInfoType;
  showSignInButton?: boolean;
  showReservationButton?: boolean;
  footerAboutAr?: string;
  footerCopyrightAr?: string;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenReservation,
  isAdmin = false,
  onOpenAdmin,
  onOpenAdminLogin,
  onOpenAuthModal,
  currentMember,
  restaurantInfo,
  showSignInButton = true,
  showReservationButton = false,
  footerAboutAr,
  footerCopyrightAr
}) => {
  const isAr = lang === 'ar';
  const info = restaurantInfo || {
    nameAr: 'شعبيات البيت الريفي',
    nameEn: 'Shaabiyat Al-Bait Al-Reefi',
    taglineAr: 'مأكولات وتراث يمني أصيل',
    phone: '+966508283561',
    phoneDisplay: '+966 50 828 3561',
    whatsapp: '+966508283561',
    addressAr: 'الرياض، المملكة العربية السعودية (الموقع: 24.561268, 46.515296)',
    addressEn: 'Riyadh, Saudi Arabia',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=24.561268,46.515296',
    openingHoursAr: 'مفتوح 24 ساعة على مدار اليوم (طوال أيام الأسبوع)',
    openingHoursEn: 'Open 24/7 (All week days)',
    establishedYear: '١٩٨٤'
  };

  return (
    <footer className="bg-[#141414] text-stone-300 border-t border-[#d4af37]/25 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <RestaurantLogo size={56} isDarkBg={true} className="bg-white/10 p-0.5 rounded-full ring-1 ring-[#d4af37]/40 shadow-lg" />
              <div>
                <span className="block font-bold text-xl text-white tracking-tight font-heading">
                  {isAr ? info.nameAr : info.nameEn}
                </span>
                <span className="block text-xs font-semibold text-[#d4af37] tracking-wider uppercase">
                  {isAr ? 'مأكولات وتراث يمني أصيل' : 'Heritage Yemeni Cuisine'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-body">
              {isAr
                ? (footerAboutAr || 'نقدم لكم أصالة المذاق اليمني المستوحى من عراقة صنعاء وحضرموت وعدن، بمكونات بلدية طازجة وطهي على الحطب والتنور الطيني.')
                : 'Honoring ancient Yemeni culinary arts with wood-fired smoking, stone-pot stews, and generous hospitality since 1984.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${info.phone}`}
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 hover:bg-[#d4af37] hover:text-[#141414] text-white flex items-center justify-center transition-colors"
                title="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* TikTok */}
              {info.socialLinks?.tiktok && (info.showSocialLinks?.tiktok !== false) && (
                <a
                  href={info.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-white hover:text-black text-stone-300 text-xs font-bold transition-all"
                  title="TikTok"
                >
                  تيك توك
                </a>
              )}

              {/* Instagram */}
              {info.socialLinks?.instagram && (info.showSocialLinks?.instagram !== false) && (
                <a
                  href={info.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-stone-300 text-xs font-bold transition-all"
                  title="Instagram"
                >
                  انستغرام
                </a>
              )}

              {/* Snapchat */}
              {info.socialLinks?.snapchat && (info.showSocialLinks?.snapchat !== false) && (
                <a
                  href={info.socialLinks.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-amber-400 hover:text-black text-stone-300 text-xs font-bold transition-all"
                  title="Snapchat"
                >
                  سناب شات
                </a>
              )}

              {/* Twitter / X */}
              {info.socialLinks?.twitter && (info.showSocialLinks?.twitter !== false) && (
                <a
                  href={info.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-white hover:text-black text-stone-300 text-xs font-bold transition-all"
                  title="X (Twitter)"
                >
                  منصة إكس
                </a>
              )}

              {/* YouTube */}
              {info.socialLinks?.youtube && (info.showSocialLinks?.youtube !== false) && (
                <a
                  href={info.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-red-600 hover:text-white text-stone-300 text-xs font-bold transition-all"
                  title="YouTube"
                >
                  يوتيوب
                </a>
              )}
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-heading">
              {isAr ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {isAr ? 'المنيو' : 'Menu'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {isAr ? 'معرض صور المطعم والأجواء' : 'Photo Gallery'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {isAr ? 'موقعنا في الرياض' : 'Location & Map (Riyadh)'}
                </button>
              </li>
              {showReservationButton && (
                <li>
                  <button
                    onClick={onOpenReservation}
                    className="hover:text-[#d4af37] font-bold transition-colors cursor-pointer text-[#d4af37]"
                  >
                    {isAr ? 'حجز جلسة عائلية أو ديوان 📅' : 'Book a Majlis Table 📅'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-heading">
              {isAr ? 'العنوان وأوقات العمل' : 'Location & Hours'}
            </h4>
            
            <div className="space-y-2.5">
              <a
                href={info.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 hover:text-[#d4af37] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>{isAr ? info.addressAr : info.addressEn}</span>
              </a>
              
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{isAr ? info.openingHoursAr : info.openingHoursEn}</span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span dir="ltr">{info.phoneDisplay}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p
            onClick={() => {
              // Secret Admin Entry: Triple click on copyright
              const now = Date.now();
              const last = (window as unknown as { __lastCopyClick?: number }).__lastCopyClick || 0;
              const count = (window as unknown as { __copyClickCount?: number }).__copyClickCount || 0;
              if (now - last < 600) {
                const nextCount = count + 1;
                (window as unknown as { __copyClickCount?: number }).__copyClickCount = nextCount;
                if (nextCount >= 3) {
                  (window as unknown as { __copyClickCount?: number }).__copyClickCount = 0;
                  onOpenAdminLogin();
                }
              } else {
                (window as unknown as { __copyClickCount?: number }).__copyClickCount = 1;
              }
              (window as unknown as { __lastCopyClick?: number }).__lastCopyClick = now;
            }}
            className="select-none"
          >
            {isAr
              ? (footerCopyrightAr || `جميع الحقوق محفوظة © ${new Date().getFullYear()} شعبيات البيت الريفي - أصالة المذاق والضيافة اليمنية.`)
              : `© ${new Date().getFullYear()} Shaabiyat Al-Bait Al-Reefi. All rights reserved.`}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Website Member Sign In / Offers Button */}
            {onOpenAuthModal && (isAdmin || currentMember || showSignInButton) && (
              <button
                id="footer-site-login-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {currentMember
                    ? (isAr ? `حسابي (${currentMember.name})` : `My Account (${currentMember.name})`)
                    : (isAr ? 'تسجيل الدخول للموقع' : 'Sign In')}
                </span>
              </button>
            )}

            {/* Admin Access - strictly visible ONLY when authenticated */}
            {isAdmin && (
              <button
                id="footer-admin-manager-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-white transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'لوحة تحكم المدير' : 'Master Admin Dashboard'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
