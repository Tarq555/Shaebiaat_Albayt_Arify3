import React, { useState } from 'react';
import {
  X, Mail, Phone, User, Gift, CheckCircle2, Sparkles,
  ArrowLeft, ArrowRight, ShieldCheck, Tag, Heart, MessageSquare
} from 'lucide-react';
import { Language } from '../types';
import {
  validateNameField, validatePhoneField, validateEmailField,
  sanitizeNameInput, sanitizePhoneInput
} from '../utils/validation';
import { useBodyScrollLock } from '../utils/scrollLock';

export interface MarketingSubscriber {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredChannel: 'whatsapp' | 'email' | 'both';
  interest: string;
  createdAt: string;
}

interface OffersSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const OffersSubscriptionModal: React.FC<OffersSubscriptionModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  useBodyScrollLock(isOpen);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'whatsapp' | 'email' | 'both'>('both');
  const [interest, setInterest] = useState<string>('ولائم وغداء يومي');

  // Real-time validation error state
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  if (!isOpen) return null;

  // Handle Name Input with auto-sanitization (letters only)
  const handleNameChange = (val: string) => {
    const clean = sanitizeNameInput(val);
    setName(clean);
    if (touched.name) {
      const res = validateNameField(clean);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  // Handle Phone Input with auto-sanitization (digits and leading +)
  const handlePhoneChange = (val: string) => {
    const clean = sanitizePhoneInput(val);
    setPhone(clean);
    if (touched.phone) {
      const res = validatePhoneField(clean);
      setErrors((prev) => ({ ...prev, phone: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  // Handle Email Input
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      const res = validateEmailField(val, true);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleBlur = (field: 'name' | 'phone' | 'email') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      const res = validateNameField(name);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    } else if (field === 'phone') {
      const res = validatePhoneField(phone);
      setErrors((prev) => ({ ...prev, phone: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    } else if (field === 'email') {
      const res = validateEmailField(email, true);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation check across all logical inputs
    const nameRes = validateNameField(name);
    const phoneRes = validatePhoneField(phone);
    const emailRes = validateEmailField(email, true);

    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!nameRes.isValid) newErrors.name = isAr ? nameRes.messageAr : nameRes.messageEn;
    if (!phoneRes.isValid) newErrors.phone = isAr ? phoneRes.messageAr : phoneRes.messageEn;
    if (!emailRes.isValid) newErrors.email = isAr ? emailRes.messageAr : emailRes.messageEn;

    setTouched({ name: true, phone: true, email: true });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save lead subscriber to localStorage for marketing
    const newSubscriber: MarketingSubscriber = {
      id: `SUB-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      preferredChannel,
      interest,
      createdAt: new Date().toISOString()
    };

    try {
      const saved = localStorage.getItem('al_bait_marketing_subscribers');
      const list: MarketingSubscriber[] = saved ? JSON.parse(saved) : [];
      // Prevent duplicate by phone or email
      const existingIdx = list.findIndex(
        (s) => s.phone === newSubscriber.phone || s.email === newSubscriber.email
      );
      if (existingIdx >= 0) {
        list[existingIdx] = newSubscriber;
      } else {
        list.unshift(newSubscriber);
      }
      localStorage.setItem('al_bait_marketing_subscribers', JSON.stringify(list));
    } catch (e) {
      console.error('Error saving subscriber', e);
    }

    const promoCode = 'REEFI10';
    setVoucherCode(promoCode);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setErrors({});
    setTouched({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs touch-none animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37] my-auto max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Ribbon */}
        <div className="p-5 bg-[#141414] text-white border-b border-[#d4af37]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'نادي الذواقة والعروض الحصرية' : 'VIP Taste & Exclusive Offers'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {isAr ? 'اشترك لتصلك العروض أولاً بأول' : 'Subscribe for Special Deals'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div 
          className="p-5 sm:p-6 overflow-y-auto overscroll-contain touch-pan-y grow"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-[#141414] font-heading">
                  {isAr ? 'أهلاً بك في نادي ذواقة شعبيات البيت الريفي!' : 'Welcome to Al-Bait Al-Reefi VIP Club!'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  {isAr
                    ? `شكراً لك يا ${name}. تم تسجيل بياناتك بنجاح وسنوافيك بأحدث عروض الولائم والغداء والخصومات الحصرية عبر ${
                        preferredChannel === 'whatsapp' ? 'الواتساب' : preferredChannel === 'email' ? 'الإيميل' : 'الإيميل والواتساب'
                      }.`
                    : `Thank you, ${name}. You are registered to receive our top banquets and dining promotions.`}
                </p>
              </div>

              {/* Exclusive Welcome Voucher Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-[#d4af37] max-w-sm mx-auto space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#b8860b]">
                  <Tag className="w-4 h-4" />
                  <span>{isAr ? 'كود خصم الترحيب الحصري (10%)' : 'Welcome 10% Discount Voucher'}</span>
                </div>
                <div className="py-2 px-4 rounded-xl bg-white border border-[#d4af37]/50 font-mono font-extrabold text-lg text-[#141414] tracking-widest select-all">
                  {voucherCode}
                </div>
                <p className="text-[11px] text-stone-500">
                  {isAr ? 'أظهر هذا الكود عند زيارتك لفرعنا بالرياض للحصول على خصمك الترحيبي' : 'Show this coupon upon visiting our Riyadh branch'}
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-6 rounded-2xl bg-[#141414] hover:bg-stone-800 text-[#d4af37] font-bold text-sm transition-colors cursor-pointer"
                >
                  {isAr ? 'تم، العودة لتصفح الموقع' : 'Done, return to website'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-600">
                {isAr
                  ? 'كن أول من يعلم بالعروض الموسمية، خصومات الولائم الأسبوعية، ووجبات الغداء الخاصة عبر البريد الإلكتروني أو الواتساب:'
                  : 'Be the first to receive seasonal promotions, banquet specials, and discount vouchers via email or phone:'}
              </p>

              {/* 1. Name Input with letters-only validation */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{isAr ? 'الاسم الكامل * (حروف فقط)' : 'Full Name * (letters only)'}</span>
                  </span>
                  {errors.name && <span className="text-red-600 text-[11px] font-bold">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder={isAr ? 'مثال: عبد الله بن محمد' : 'e.g. Abdullah Mohammed'}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-500 bg-red-50/40 text-red-900'
                      : 'border-stone-300 focus:border-[#d4af37] bg-white'
                  }`}
                />
              </div>

              {/* 2. Contact Phone with +966 / 05 validation */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{isAr ? 'رقم الجوال للتواصل * (يبدأ بـ 05 أو +966)' : 'Mobile Phone * (starts with 05 or +966)'}</span>
                  </span>
                  {errors.phone && <span className="text-red-600 text-[11px] font-bold">{errors.phone}</span>}
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="05xxxxxxxx  أو  +9665xxxxxxxx"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-500 bg-red-50/40 text-red-900'
                      : 'border-stone-300 focus:border-[#d4af37] bg-white'
                  }`}
                />
              </div>

              {/* 3. Email Input with @ and domain validation */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{isAr ? 'البريد الإلكتروني * (يحتوي على @ للتسويق)' : 'Email * (contains @)'}</span>
                  </span>
                  {errors.email && <span className="text-red-600 text-[11px] font-bold">{errors.email}</span>}
                </label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="yourname@domain.com"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 bg-red-50/40 text-red-900'
                      : 'border-stone-300 focus:border-[#d4af37] bg-white'
                  }`}
                />
              </div>

              {/* Preferred Communication Channel */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'أفضل وسيلة لاستلام العروض والكوبونات:' : 'Preferred Channel for Promotions:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreferredChannel('whatsapp')}
                    className={`py-2 px-2 rounded-xl border font-bold text-center transition-colors cursor-pointer ${
                      preferredChannel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {isAr ? 'واتساب' : 'WhatsApp'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredChannel('email')}
                    className={`py-2 px-2 rounded-xl border font-bold text-center transition-colors cursor-pointer ${
                      preferredChannel === 'email'
                        ? 'bg-[#141414] text-[#d4af37] border-[#141414] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {isAr ? 'إيميل' : 'Email'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredChannel('both')}
                    className={`py-2 px-2 rounded-xl border font-bold text-center transition-colors cursor-pointer ${
                      preferredChannel === 'both'
                        ? 'bg-[#d4af37] text-[#141414] border-[#d4af37] font-extrabold shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {isAr ? 'كلاهما (مفضل)' : 'Both'}
                  </button>
                </div>
              </div>

              {/* Interest Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'العروض الأكثر أهمية بالنسبة لك:' : 'Deals of primary interest:'}
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="ولائم ومناسبات خاصة">{isAr ? 'ولائم العائلات والمناسبات الكبيرة' : 'Family Banquets & Large Orders'}</option>
                  <option value="وجبات غداء يومية">{isAr ? 'عروض وجبات الغداء اليومية' : 'Daily Lunch Feasts'}</option>
                  <option value="إفطار شعبي">{isAr ? 'إفطار شعبي وفخاريات صخرية' : 'Heritage Breakfast & Stone Pots'}</option>
                  <option value="كوبونات وخصومات عامة">{isAr ? 'كوبونات وخصومات دورية عامة' : 'General Coupons & Discounts'}</option>
                </select>
              </div>

              {/* Privacy Notice */}
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[10px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isAr
                    ? 'نحترم خصوصيتك التامة، لا نشارك بياناتك إطلاقاً مع أي جهة خارجية، وتستطيع إلغاء الاشتراك في أي وقت.'
                    : 'We respect your privacy. Your data will never be shared with third parties.'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-2xl bg-[#141414] hover:bg-stone-900 text-[#d4af37] border-2 border-[#d4af37] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>{isAr ? 'تسجيل واشتراك في العروض' : 'Register for Exclusive Offers'}</span>
                <ArrowIcon className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
