import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, Sparkles, PhoneCall,
  MessageCircle, Clock, Truck, Calendar, Users, CreditCard, Edit3
} from 'lucide-react';
import { Language, FaqItem } from '../types';
import { RESTAURANT_INFO, DEFAULT_FAQS } from '../data/restaurantData';

interface FaqSectionProps {
  lang: Language;
  faqs?: FaqItem[];
  isAdmin?: boolean;
  onOpenAdminFaqs?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  lang,
  faqs = DEFAULT_FAQS,
  isAdmin = false,
  onOpenAdminFaqs
}) => {
  const isAr = lang === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappInquiryUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم، أود الاستفسار حول خدمات مطعم شعبيات البيت الريفي والحجز'
      : 'Hello, I would like to inquire about Shaabiyat Al-Bait Al-Reefi services and reservations'
  )}`;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-5 h-5 text-[#d4af37]" />;
      case 'Clock': return <Clock className="w-5 h-5 text-[#d4af37]" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-[#d4af37]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#d4af37]" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-[#d4af37]" />;
      case 'PhoneCall': return <PhoneCall className="w-5 h-5 text-[#d4af37]" />;
      default: return <HelpCircle className="w-5 h-5 text-[#d4af37]" />;
    }
  };

  return (
    <section id="faq-section" className="py-12 sm:py-16 bg-white border-b border-[#d4af37]/25 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#b8860b] border border-[#d4af37]/30">
              <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
              {isAr ? 'إجابات واضحة ومباشرة' : 'Frequently Asked Questions'}
            </span>
            {isAdmin && onOpenAdminFaqs && (
              <button
                type="button"
                onClick={onOpenAdminFaqs}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 hover:bg-black transition-all cursor-pointer"
                title={isAr ? 'تعديل وإضافة الأسئلة والأجوبة' : 'Edit FAQs in Admin'}
              >
                <Edit3 className="w-3 h-3 text-[#d4af37]" />
                <span>{isAr ? 'إدارة الأسئلة' : 'Edit FAQs'}</span>
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'الأسئلة الشائعة وإجاباتها الرسمية' : 'FAQ & Hospitality Guide'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'إجابات مباشرة حول خدماتنا، أوقات العمل، التوصيل، وحجوزات الجلسات والولائم عبر التواصل المباشر.'
              : 'Direct answers regarding our services, working hours, delivery, and direct reservations.'}
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                id={`faq-accordion-item-${item.id}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#faf9f6] border-[#d4af37] shadow-md'
                    : 'bg-white border-stone-200 hover:border-[#d4af37]/50 shadow-xs'
                }`}
              >
                <button
                  id={`faq-toggle-btn-${item.id}`}
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-start cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                      {renderIcon(item.iconName)}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-[#141414] font-heading">
                      {isAr ? item.questionAr : item.questionEn}
                    </span>
                  </div>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#d4af37] text-[#141414]' : 'bg-stone-100 text-stone-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-stone-600 font-body leading-relaxed border-t border-[#d4af37]/15">
                    <p className="whitespace-pre-line">{isAr ? item.answerAr : item.answerEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#141414] via-[#1c1c1c] to-[#141414] text-white border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h4 className="text-base sm:text-lg font-bold text-[#d4af37] font-heading">
              {isAr ? 'هل لديك سؤال أو طلب حجز خاص؟' : 'Have a special booking or inquiry?'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300">
              {isAr
                ? 'فريق الضيافة جاهز للرد على استفسارك فوراً وتأكيد حجزك عبر الواتساب أو الاتصال المباشر.'
                : 'Our hospitality team is available to answer your questions and confirm your booking directly.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              id="faq-whatsapp-inquiry-btn"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isAr ? 'تواصل عبر واتساب' : 'Chat WhatsApp'}</span>
            </a>

            <a
              id="faq-call-btn"
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#141414] font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#141414]" />
              <span>{isAr ? 'اتصال مباشر للحجز' : 'Call Direct to Book'}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
