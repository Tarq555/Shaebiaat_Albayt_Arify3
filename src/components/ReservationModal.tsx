import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language, Reservation } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useBodyScrollLock(isOpen);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:00');
  const [guests, setGuests] = useState(4);
  const [seatingArea, setSeatingArea] = useState<'indoor-majlis' | 'family-section' | 'outdoor-terrace' | 'vip-room'>('indoor-majlis');
  const [specialOccasion, setSpecialOccasion] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState<Reservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone,
      date,
      time,
      guests,
      seatingArea,
      specialOccasion,
      notes,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem('al_bait_reservations');
      const list: Reservation[] = existing ? JSON.parse(existing) : [];
      list.unshift(newReservation);
      localStorage.setItem('al_bait_reservations', JSON.stringify(list));
    } catch {
      // ignore
    }

    setIsSuccess(newReservation);
  };

  const seatingOptions = [
    { id: 'indoor-majlis', titleAr: 'جلسة ديوان يمني تقليدي', titleEn: 'Traditional Cushioned Majlis', descAr: 'جلسات أرضية مريحة مع مساند وتراث أصيل' },
    { id: 'family-section', titleAr: 'قسم العائلات والخصوصية', titleEn: 'Private Family Section', descAr: 'أجواء عائلية مستقلة وهادئة تماماً' },
    { id: 'outdoor-terrace', titleAr: 'طاولات حديثة في الصالة', titleEn: 'Modern Dining Tables', descAr: 'طاولات وكراسي راقية ومريحة' },
    { id: 'vip-room', titleAr: 'ديوان الولائم والمناسبات VIP', titleEn: 'VIP Royal Banquet Hall', descAr: 'مخصص للمناسبات والولائم الكبيرة' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/35 my-auto max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#faf9f6] border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#141414] font-heading">
                {isAr ? 'حجز طاولة وجلسة تراثية' : 'Book a Table or Majlis'}
              </h3>
              <p className="text-xs text-[#b8860b]">
                {isAr ? 'ضمان توفر جلستك المفضلة والوليمة الساخنة' : 'Guaranteed seating & fresh hot feast preparation'}
              </p>
            </div>
          </div>

          <button
            id="close-reservation-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div 
          className="p-5 sm:p-7 overflow-y-auto overscroll-contain touch-pan-y grow"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {isSuccess ? (
            /* Success Voucher */
            <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#b8860b] uppercase tracking-wider">
                  {isAr ? 'تم تأكيد حجزك بنجاح' : 'Reservation Confirmed!'}
                </span>
                <h3 className="text-2xl font-extrabold text-[#141414] font-heading">
                  {isAr ? 'أهلاً وسهلاً بك في ضيافتنا' : 'We Look Forward to Welcoming You!'}
                </h3>
                <p className="text-xs text-stone-500 font-body">
                  {isAr ? `رقم الحجز: #${isSuccess.id}` : `Booking Reference: #${isSuccess.id}`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 text-start space-y-2.5 text-xs">
                <div className="flex justify-between font-bold text-sm text-[#141414] pb-2 border-b border-stone-200">
                  <span>{isSuccess.name}</span>
                  <span>{isSuccess.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600 font-body">
                  <div>
                    <span className="font-bold text-[#141414]">{isAr ? 'التاريخ:' : 'Date:'}</span> {isSuccess.date}
                  </div>
                  <div>
                    <span className="font-bold text-[#141414]">{isAr ? 'الوقت:' : 'Time:'}</span> {isSuccess.time}
                  </div>
                  <div>
                    <span className="font-bold text-[#141414]">{isAr ? 'عدد الضيوف:' : 'Guests:'}</span> {isSuccess.guests} {isAr ? 'أشخاص' : 'Persons'}
                  </div>
                  <div>
                    <span className="font-bold text-[#141414]">{isAr ? 'نوع الجلسة:' : 'Section:'}</span> {isAr ? 'ديوان تراثي' : 'Traditional'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#d4af37]/30 text-xs text-[#141414] font-bold">
                {isAr
                  ? 'تم حفظ تفاصيل حجزك وسيتواصل معك فريق الاستقبال لتأكيد وصولكم. أهلاً بكم!'
                  : 'Booking details confirmed. Our team will contact you shortly!'}
              </div>

              <button
                id="done-reservation-btn"
                onClick={() => {
                  setIsSuccess(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm shadow-md cursor-pointer"
              >
                {isAr ? 'إغلاق والعودة' : 'Close'}
              </button>
            </div>
          ) : (
            /* Reservation Form */
            <form id="table-reservation-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'الاسم الكريم' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    id="res-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: عبد الرحمن الصنعاني' : 'e.g. Tariq'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'رقم الهاتف / الواتساب' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    id="res-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Date & Time & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'تاريخ الحجز' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    id="res-date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'وقت الوصول (متاح 24 ساعة)' : 'Time (24/7 Open)'}
                  </label>
                  <select
                    id="res-time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  >
                    <option value="07:00">07:00 AM (إفطار الصباح)</option>
                    <option value="09:00">09:00 AM (إفطار ريفي)</option>
                    <option value="12:00">12:00 PM (الغداء الباكر)</option>
                    <option value="13:30">01:30 PM (الغداء والولائم)</option>
                    <option value="15:00">03:00 PM (فترة ما بعد الغداء)</option>
                    <option value="18:00">06:00 PM (المغرب والشاي)</option>
                    <option value="20:00">08:00 PM (العشاء العائلي)</option>
                    <option value="22:00">10:00 PM (العشاء المتأخر)</option>
                    <option value="00:00">12:00 AM (منتصف الليل)</option>
                    <option value="02:00">02:00 AM (سهرات وطلبات ليلية)</option>
                    <option value="04:00">04:00 AM (فجرية وسحور)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'عدد الضيوف' : 'Guests'}
                  </label>
                  <div className="flex items-center bg-[#faf9f6] border border-stone-200 rounded-xl p-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-[#141414] font-bold text-xs cursor-pointer hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#141414]">
                      {guests} {isAr ? 'أشخاص' : 'guests'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-[#141414] font-bold text-xs cursor-pointer hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Seating Area Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                  {isAr ? 'اختر نوع الجلسة المفضلة' : 'Select Preferred Seating'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {seatingOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSeatingArea(opt.id as any)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        seatingArea === opt.id
                          ? 'bg-[#141414] text-[#d4af37] border-[#d4af37] shadow-sm'
                          : 'bg-[#faf9f6] text-stone-700 border-stone-200 hover:border-[#d4af37]/40'
                      }`}
                    >
                      <h5 className="font-bold text-xs">
                        {isAr ? opt.titleAr : opt.titleEn}
                      </h5>
                      <p className={`text-[11px] mt-0.5 font-body ${seatingArea === opt.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {isAr ? opt.descAr : opt.titleEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isAr ? 'مناسبة خاصة أو طلبات مسبقة (اختياري)' : 'Special Occasion or Advance Requests (Optional)'}
                </label>
                <input
                  type="text"
                  id="res-notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'مثال: وليمة عائلية، تجهيز المندي فور الوصول...' : 'e.g. Family banquet, prepare hot Mandi in advance...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="res-submit-btn"
                  className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'تأكيد حجز الجلسة' : 'Confirm Table Reservation'}</span>
                  <ArrowIcon className="w-4 h-4 text-[#d4af37]" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
