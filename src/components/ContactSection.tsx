import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Send, CheckCircle2, Sparkles, Navigation, Copy, ExternalLink, Map as MapIcon } from 'lucide-react';
import { Language, RestaurantInfoType } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface ContactSectionProps {
  lang: Language;
  onOpenReservation?: () => void;
  restaurantInfo?: RestaurantInfoType;
  isAdmin?: boolean;
  onOpenEditRestaurant?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  restaurantInfo,
  isAdmin = false,
  onOpenEditRestaurant
}) => {
  const isAr = lang === 'ar';
  const info = restaurantInfo || RESTAURANT_INFO;
  const [msgName, setMsgName] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => {
      setMsgName('');
      setMsgPhone('');
      setMsgText('');
      setMsgSent(false);
    }, 4000);
  };

  const handleCopyCoordinates = () => {
    const coordsStr = `${info.coordinates.lat}, ${info.coordinates.lng}`;
    navigator.clipboard.writeText(coordsStr).then(() => {
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2500);
    }).catch(() => {
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2500);
    });
  };

  return (
    <section id="contact-section" className="py-14 sm:py-20 bg-[#faf9f6] border-t border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#d4af37]/30 text-[#b8860b] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isAr ? 'التواصل والحجز المباشر' : 'Direct Contact & Booking'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'تواصل معنا لحجز جلستك وضيافتك' : 'Contact Us for Reservations & Inquiries'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-body">
            {isAr
              ? 'التواصل المباشر هو السبيل المعتمد للحجز والاستفسار وتجهيز ولائمكم في شعبيات البيت الريفي بالرياض.'
              : 'Direct communication via phone and WhatsApp is the official way to reserve your table and banquets.'}
          </p>

          {isAdmin && onOpenEditRestaurant && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenEditRestaurant}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141414] text-[#d4af37] hover:bg-black font-bold text-xs border border-[#d4af37]/40 shadow-sm cursor-pointer"
              >
                <span>✏️</span>
                <span>{isAr ? 'تعديل أرقام التواصل والعنوان والخريطة' : 'Edit Contact & Location'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Map Visual & Contact Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Interactive Live Map Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-md bg-white h-80 sm:h-96 flex flex-col">
              
              {/* Top Map Control Bar */}
              <div className="bg-white px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span className="font-bold text-[#141414] text-xs sm:text-sm font-mono">
                    {info.coordinatesDisplay}
                  </span>
                  <button
                    onClick={handleCopyCoordinates}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                    title={isAr ? 'نسخ الإحداثيات' : 'Copy Coordinates'}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCoords && (
                      <span className="text-emerald-700 font-bold text-[10px]">
                        {isAr ? 'تم النسخ!' : 'Copied!'}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                    className="px-3 py-1 rounded-xl bg-[#faf9f6] hover:bg-stone-200 text-[#141414] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-stone-200"
                  >
                    <MapIcon className="w-3 h-3 text-[#b8860b]" />
                    <span>{showInteractiveMap ? (isAr ? 'قمر صناعي' : 'Satellite') : (isAr ? 'خريطة تفاعلية' : 'Interactive Map')}</span>
                  </button>
                </div>
              </div>

              {/* Map View Frame */}
              <div className="relative flex-1 w-full h-full bg-[#e5e3df] overflow-hidden">
                {showInteractiveMap ? (
                  <iframe
                    title="Shaabiyat Al-Bait Al-Reefi Location Map"
                    src={info.mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <iframe
                      title="Shaabiyat Al-Bait Al-Reefi Location Satellite Map"
                      src={`https://maps.google.com/maps?q=${info.coordinates.lat},${info.coordinates.lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Floating Directions Action Badge on Map */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto bg-black/85 backdrop-blur-xs p-3 rounded-2xl text-white text-xs border border-[#d4af37]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping shrink-0" />
                    <span className="font-bold drop-shadow-xs text-xs text-white">
                      {isAr ? info.nameAr : info.nameEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={info.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      id="contact-directions-link"
                      className="px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الاتجاهات المباشرة' : 'Get Directions'}</span>
                    </a>
                    <a
                      href={info.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      id="contact-google-maps-link"
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1 transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isAr ? 'خرائط Google' : 'Google Maps'}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Restaurant Building Facade Preview Card */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white border border-[#d4af37]/30 flex items-center gap-4 shadow-xs">
                <img
                  src={info.buildingPhoto || RESTAURANT_INFO.buildingPhoto}
                  alt="Shaabiyat Al-Bait Al-Reefi Exterior"
                  className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0 border border-[#d4af37]/30 shadow-2xs"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#b8860b] uppercase tracking-wider block">
                    {isAr ? 'واجهة المطعم الحقيقية' : 'Restaurant Exterior'}
                  </span>
                  <h4 className="font-bold text-sm text-[#141414] truncate">
                    {isAr ? info.nameAr : info.nameEn}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 font-body">
                    {isAr
                      ? 'مبنى تراثي حديث ومواقف سيارات متوفرة وصالات عائلية مريحة مفتوحة 24 ساعة.'
                      : 'Modern heritage building with ample parking and private family seating.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#b8860b] uppercase">
                    {isAr ? 'الهاتف المباشر' : 'Direct Phone'}
                  </span>
                  <a href={`tel:${RESTAURANT_INFO.phone}`} className="text-sm font-bold text-[#141414] hover:text-[#b8860b]">
                    {RESTAURANT_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#b8860b] uppercase">
                    {isAr ? 'الواتساب والطلبات' : 'WhatsApp Service'}
                  </span>
                  <a href={`https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#141414] hover:text-emerald-700">
                    {RESTAURANT_INFO.whatsapp}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 sm:col-span-2">
                <div className="w-9 h-9 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#b8860b] uppercase">
                    {isAr ? 'أوقات العمل واستقبال الزوار' : 'Opening Hours'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#141414]">
                    {isAr ? RESTAURANT_INFO.openingHoursAr : RESTAURANT_INFO.openingHoursEn}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Inquiry & Reservation Trigger (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-[#d4af37]/30 shadow-md flex flex-col justify-between space-y-6">
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#141414] font-heading">
                {isAr ? 'تواصل معنا أو استفسر عن الولائم' : 'Send an Inquiry / Catering Request'}
              </h3>
              <p className="text-xs text-stone-600 font-body">
                {isAr
                  ? 'سواء كنت ترغب في تجهيز ولائم كبيرة أو الاستفسار عن تفاصيل القائمة، يسعدنا تواصلكم.'
                  : 'Get in touch with our team for large banquets, private catering, or general questions.'}
              </p>
            </div>

            {msgSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">
                  {isAr ? 'شكراً لتواصلك معنا!' : 'Thank you for reaching out!'}
                </h4>
                <p className="text-xs text-emerald-800 font-body">
                  {isAr ? 'تم استلام استفسارك وسيقوم فريق الضيافة بالرد عليك سريعاً.' : 'Our hospitality manager will contact you promptly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'الاسم الكريم' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    id="contact-name-input"
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    placeholder={isAr ? 'الاسم...' : 'Name...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    id="contact-phone-input"
                    value={msgPhone}
                    onChange={(e) => setMsgPhone(e.target.value)}
                    placeholder="+966 5..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'نص الرسالة أو طلب الوليمة' : 'Your Message / Request'} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    id="contact-msg-textarea"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder={isAr ? 'اكتب استفسارك هنا...' : 'Write your request or question here...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="send-inquiry-btn"
                  className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال الاستفسار' : 'Send Message'}</span>
                </button>
              </form>
            )}

            {/* Direct Booking via WhatsApp */}
            <div className="pt-3 border-t border-stone-200">
              <a
                id="contact-whatsapp-direct-btn"
                href={`https://wa.me/${info.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  isAr
                    ? 'السلام عليكم ورحمة الله، أود الحجز والاستفسار في شعبيات البيت الريفي بالرياض'
                    : 'Hello, I would like to make a reservation or inquire at Shaabiyat Al-Bait Al-Reefi in Riyadh'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{isAr ? 'حجز مباشر وفوري عبر الواتساب' : 'Direct Booking via WhatsApp'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
