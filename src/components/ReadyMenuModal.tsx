import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, MessageCircle, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface ReadyMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  menuUrl?: string;
  titleAr?: string;
  titleEn?: string;
  whatsappNumber?: string;
}

export const ReadyMenuModal: React.FC<ReadyMenuModalProps> = ({
  isOpen,
  onClose,
  lang,
  menuUrl = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
  titleAr = 'بروشور الأصناف والأسعار',
  titleEn = 'Menu Catalog Brochure',
  whatsappNumber = '+966530669145'
}) => {
  const isAr = lang === 'ar';
  useBodyScrollLock(isOpen);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappInquiryUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، اطلعت على قائمة الطعام الشاملة لمطعم شعبيات البيت الريفي وأود الاستفسار والطلب'
      : 'Hello, I viewed the complete menu catalog of Shaabiyat Al-Bait Al-Reefi and would like to inquire/order'
  )}`;

  const isPdf = menuUrl.toLowerCase().endsWith('.pdf');

  return (
    <div
      id="ready-menu-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md touch-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ready-menu-modal-content"
        className="relative w-full max-w-5xl h-[90vh] bg-[#121212] border-2 border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-[#1a1a1a] border-b border-[#d4af37]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#d4af37]">
                {isAr ? titleAr : titleEn}
              </h2>
              <p className="text-xs text-neutral-400">
                {isAr
                  ? 'بروشور جاهز وشامل لجميع الأطباق والولائم والأسعار لسهولة التصفح'
                  : 'Complete unified brochure of all feast dishes and prices'}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            {!isPdf && (
              <div className="hidden sm:flex items-center gap-1 bg-[#222] px-2 py-1 rounded-xl border border-white/10">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="p-1.5 hover:text-[#d4af37] disabled:opacity-30 cursor-pointer"
                  title={isAr ? 'تصغير' : 'Zoom Out'}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-1 text-neutral-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="p-1.5 hover:text-[#d4af37] disabled:opacity-30 cursor-pointer"
                  title={isAr ? 'تكبير' : 'Zoom In'}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 hover:text-[#d4af37] cursor-pointer"
                  title={isAr ? 'إعادة الضبط' : 'Reset Zoom'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح بدقة كاملة' : 'Open Full Res'}</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 transition-colors cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto bg-[#0a0a0a] p-3 sm:p-6 flex items-center justify-center relative">
          {isPdf ? (
            <iframe
              src={menuUrl}
              title={isAr ? 'قائمة الطعام الجاهزة' : 'Ready Menu Catalog'}
              className="w-full h-full rounded-xl border border-white/10 bg-white"
            />
          ) : (
            <div className="relative overflow-auto max-w-full max-h-full flex items-center justify-center">
              <img
                src={menuUrl}
                alt={isAr ? titleAr : titleEn}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
              />
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="px-4 sm:px-6 py-3 bg-[#161616] border-t border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>
              {isAr
                ? 'محدث ومعتمد من إدارة مطعم شعبيات البيت الريفي بالرياض'
                : 'Verified & updated by Shaabiyat Al-Bait Al-Reefi Riyadh management'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={menuUrl}
              download="Shaabiyat-AlBait-AlReefi-Menu.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#222] hover:bg-[#2e2e2e] text-[#d4af37] border border-[#d4af37]/40 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل البروشور' : 'Download Catalog'}</span>
            </a>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg transition-transform hover:scale-105"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.24 16C12.83 16.26 13.28 16.41 13.64 16.53C14.24 16.72 14.78 16.69 15.21 16.63C15.69 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.27 14.89 13.19C14.67 13.11 14.51 13.07 14.34 13.31C14.18 13.56 13.72 14.11 13.58 14.27C13.44 14.44 13.3 14.46 13.06 14.34C12.81 14.21 11.78 13.87 10.55 12.78C9.6 11.93 8.95 10.88 8.83 10.64C8.71 10.39 8.81 10.26 8.94 10.13C9.05 10.02 9.19 9.84 9.31 9.7C9.44 9.56 9.48 9.46 9.56 9.29C9.64 9.13 9.6 8.99 9.54 8.86C9.48 8.74 9.02 7.62 8.84 7.15C8.65 6.7 8.46 6.76 8.33 6.75L7.87 6.75C7.74 6.75 8.53 7.33 8.53 7.33Z" />
              </svg>
              <span>{isAr ? 'طلب المنيو عبر الواتساب' : 'Order via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
