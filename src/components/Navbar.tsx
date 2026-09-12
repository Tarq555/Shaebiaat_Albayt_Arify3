import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, Globe, Menu as MenuIcon, X, PhoneCall,
  Shield, MessageCircle, QrCode, Gift, User, Table
} from 'lucide-react';
import { Language, Currency, MemberUser } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { RestaurantLogo } from './RestaurantLogo';
import { useBodyScrollLock } from '../utils/scrollLock';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  activeTab: 'home' | 'menu' | 'gallery' | 'contact' | 'table-menu';
  onNavigate: (tab: 'home' | 'menu' | 'gallery' | 'contact' | 'table-menu') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation?: () => void;
  onOpenQrMenu?: () => void;
  onOpenOffersSubscription?: () => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
  onOpenAdminLogin: () => void;
  catalogOnlyMode?: boolean;
  currentMember?: MemberUser | null;
  onOpenAuthModal?: () => void;
  enableTableMenuPage?: boolean;
  showSignInButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
  activeTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenReservation,
  onOpenQrMenu,
  onOpenOffersSubscription,
  isAdmin = false,
  onOpenAdmin,
  onOpenAdminLogin,
  catalogOnlyMode = true,
  currentMember = null,
  onOpenAuthModal,
  enableTableMenuPage = true,
  showSignInButton = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  useBodyScrollLock(mobileMenuOpen);

  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أود الاستفسار والحجز في شعبيات البيت الريفي بالرياض'
      : 'Hello, I would like to inquire and make a booking at Shaabiyat Al-Bait Al-Reefi in Riyadh'
  )}`;

  const navItems: { id: 'home' | 'table-menu' | 'menu' | 'gallery' | 'contact'; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'table-menu', labelAr: 'جدول المنيو', labelEn: 'Table Menu' },
    { id: 'menu', labelAr: 'قائمة الأصناف', labelEn: 'Dishes' },
    { id: 'gallery', labelAr: 'معرض الصور', labelEn: 'Gallery' },
    { id: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact Us' },
  ];

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTimeRef = useRef<number>(0);

  const handleAdminClick = () => {
    if (isAdmin) {
      onOpenAdmin();
    } else {
      onOpenAdminLogin();
    }
  };

  const startLongPress = () => {
    pressStartTimeRef.current = Date.now();
    const duration = 2000; // Exact 2 seconds required

    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);

    pressTimerRef.current = setTimeout(() => {
      pressStartTimeRef.current = 0;
      handleAdminClick();
    }, duration);
  };

  const cancelLongPress = () => {
    const elapsed = Date.now() - pressStartTimeRef.current;
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    // If regular tap (< 350ms): navigate home normally
    if (elapsed > 20 && elapsed < 350) {
      onNavigate('home');
    }
    pressStartTimeRef.current = 0;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 border-b border-[#d4af37]/25 transition-all shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity: 2-second silent hold enters Admin Control Panel */}
          <div
            id="brand-logo"
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onTouchCancel={cancelLongPress}
            className="flex items-center gap-3 cursor-pointer group relative select-none"
            title={isAr ? 'شعبيات البيت الريفي' : 'Al-Bait Al-Reefi'}
          >
            <div className="relative group-hover:scale-105 transition-transform duration-200">
              <RestaurantLogo size={50} className="shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="block font-bold text-xl sm:text-2xl text-[#141414] tracking-tight font-heading leading-tight group-hover:text-[#b8860b] transition-colors">
                  {isAr ? 'شعبيات البيت الريفي' : 'Al-Bait Al-Reefi'}
                </span>
              </div>
              <span className="block text-xs font-semibold text-[#b8860b] tracking-wider uppercase">
                {isAr ? 'المقر الحصري بالرياض • مأكولات تراثية' : 'Exclusive Riyadh Flagship'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-[#141414] bg-[#faf9f6]'
                      : 'text-stone-600 hover:text-[#141414] hover:bg-stone-50'
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#d4af37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Controls & Global Standalone Sign-In Button */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Website Sign In / Member / Admin Dashboard Button */}
            {isAdmin ? (
              <button
                id="admin-dashboard-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#141414] bg-[#d4af37] hover:bg-amber-400 border border-[#141414]/20 shadow-xs transition-all cursor-pointer"
                title={isAr ? 'فتح لوحة التحكم والإدارة' : 'Open Admin Panel'}
              >
                <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isAr ? 'لوحة التحكم' : 'Admin Panel'}</span>
              </button>
            ) : currentMember ? (
              <button
                id="member-account-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#141414] bg-amber-100/90 hover:bg-amber-200 border border-[#d4af37]/60 shadow-xs transition-all cursor-pointer"
                title={isAr ? `أهلاً بك، ${currentMember.name} - بيانات حسابك` : `Signed in as ${currentMember.name}`}
              >
                <User className="w-3.5 h-3.5 text-[#b8860b]" />
                <span className="max-w-[110px] truncate">{currentMember.name}</span>
              </button>
            ) : showSignInButton ? (
              <button
                id="site-login-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-800 hover:text-[#141414] bg-[#faf9f6] hover:bg-stone-100 border border-stone-200 transition-all cursor-pointer"
                title={isAr ? 'تسجيل الدخول للموقع' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            ) : null}

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:text-[#141414] bg-[#faf9f6] hover:bg-stone-100 border border-stone-200 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Cart or WhatsApp Inquiry Button */}
            {catalogOnlyMode ? (
              <a
                id="nav-whatsapp-inquiry-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            ) : (
              <button
                id="cart-drawer-toggle-btn"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold transition-all shadow-xs relative cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'السلة' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold bg-[#d4af37] text-[#141414] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Top Action Controls */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Quick Mobile Site Login Button */}
            {isAdmin ? (
              <button
                id="mobile-admin-badge-btn"
                onClick={onOpenAdmin}
                className="p-2 rounded-xl bg-[#d4af37] text-[#141414] border border-[#141414]/20 shadow-2xs font-bold text-xs"
                title={isAr ? 'لوحة التحكم' : 'Admin'}
              >
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : currentMember ? (
              <button
                id="mobile-site-login-btn"
                onClick={onOpenAuthModal}
                className="p-2 rounded-xl border shadow-2xs transition-colors cursor-pointer bg-amber-100 text-[#141414] border-[#d4af37]"
                title={isAr ? `حسابي (${currentMember.name})` : 'My Account'}
              >
                <User className="w-4 h-4 text-[#b8860b]" />
              </button>
            ) : showSignInButton ? (
              <button
                id="mobile-site-login-btn"
                onClick={onOpenAuthModal}
                className="p-2 rounded-xl border shadow-2xs transition-colors cursor-pointer bg-[#faf9f6] text-stone-800 border-stone-200 hover:bg-stone-100"
                title={isAr ? 'تسجيل الدخول للموقع' : 'Sign In'}
              >
                <User className="w-4 h-4 text-[#b8860b]" />
              </button>
            ) : null}

            {catalogOnlyMode ? (
              <a
                id="mobile-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs"
                title="واتساب"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            ) : (
              <button
                id="mobile-cart-btn"
                onClick={onOpenCart}
                className="relative p-2 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-2xs"
              >
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-extrabold bg-[#d4af37] text-[#141414] rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#faf9f6] text-[#141414] border border-stone-200 shadow-2xs"
              aria-label="القائمة الجانبية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Mobile Drawer with Fixed Viewport & Scroll Isolation (Fixes scroll trap bug) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-50 bg-black/60 backdrop-blur-xs touch-none animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white h-full overflow-y-auto overscroll-contain touch-pan-y px-4 py-5 space-y-4 pb-32 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* User status card */}
            {currentMember && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-[#d4af37]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#141414] text-[#d4af37] flex items-center justify-center font-bold text-xs">
                    {currentMember.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141414]">{currentMember.name}</div>
                    <div className="text-[11px] text-stone-500">{currentMember.phone}</div>
                  </div>
                </div>
                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-[#b8860b] hover:underline cursor-pointer"
                  >
                    {isAr ? 'حسابي' : 'My Account'}
                  </button>
                )}
              </div>
            )}

            {/* Navigation links */}
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-start px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                        : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    {isAr ? item.labelAr : item.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Quick Language & Login Control in Drawer */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">{isAr ? 'اللغة:' : 'Language:'}</span>
                <button
                  id="mobile-lang-btn"
                  onClick={() => {
                    onLanguageChange(isAr ? 'en' : 'ar');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs font-bold text-[#141414]"
                >
                  <Globe className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>{isAr ? 'English' : 'العربية'}</span>
                </button>
              </div>

              {/* Mobile Drawer Site Login Button */}
              {isAdmin ? (
                <button
                  id="mobile-drawer-admin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#d4af37] text-[#141414] font-extrabold text-sm shadow-sm cursor-pointer border border-[#141414]"
                >
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                  <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}</span>
                </button>
              ) : currentMember ? (
                <button
                  id="mobile-drawer-site-login-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#141414] text-[#d4af37] hover:bg-black font-bold text-sm shadow-sm cursor-pointer border border-[#d4af37]/40 transition-colors"
                >
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {isAr ? `حسابي (${currentMember.name})` : `My Account (${currentMember.name})`}
                  </span>
                </button>
              ) : showSignInButton ? (
                <button
                  id="mobile-drawer-site-login-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#141414] text-[#d4af37] hover:bg-black font-bold text-sm shadow-sm cursor-pointer border border-[#d4af37]/40 transition-colors"
                >
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span>{isAr ? 'تسجيل الدخول للموقع' : 'Sign In'}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
