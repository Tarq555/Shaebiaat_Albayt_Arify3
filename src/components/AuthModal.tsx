import React, { useState } from 'react';
import {
  X, User, Phone, Mail, CheckCircle2,
  ArrowLeft, ArrowRight, AlertCircle, LogOut
} from 'lucide-react';
import { Language, MemberUser } from '../types';
import {
  validateNameField, validatePhoneField, validateEmailField,
  sanitizeNameInput, sanitizePhoneInput
} from '../utils/validation';
import { useBodyScrollLock } from '../utils/scrollLock';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentMember: MemberUser | null;
  onMemberLogin: (member: MemberUser) => void;
  onMemberLogout: () => void;
  isAdmin?: boolean;
  onAdminLoginSuccess?: () => void;
  onOpenAdminLogin?: () => void;
  initialTab?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentMember,
  onMemberLogin,
  onMemberLogout,
  onOpenAdminLogin
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Lock background scroll when open
  useBodyScrollLock(isOpen);

  // Member form state
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const clean = sanitizeNameInput(val);
    setName(clean);
    if (touched.name) {
      const res = validateNameField(clean);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.contact) {
      const res = validateEmailField(val, true);
      setErrors((prev) => ({ ...prev, contact: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const clean = sanitizePhoneInput(val);
    setPhone(clean);
    if (touched.contact) {
      const res = validatePhoneField(clean);
      setErrors((prev) => ({ ...prev, contact: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleBlur = (field: 'name' | 'contact') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      const res = validateNameField(name);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    } else if (field === 'contact') {
      if (contactMethod === 'email') {
        const res = validateEmailField(email, true);
        setErrors((prev) => ({ ...prev, contact: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
      } else {
        const res = validatePhoneField(phone);
        setErrors((prev) => ({ ...prev, contact: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
      }
    }
  };

  // Submit Member Sign In
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, contact: true });

    const nameValidation = validateNameField(name);
    let contactValid = true;
    let contactError: string | undefined = undefined;

    if (contactMethod === 'email') {
      const emailRes = validateEmailField(email, true);
      if (!emailRes.isValid) {
        contactValid = false;
        contactError = isAr ? emailRes.messageAr : emailRes.messageEn;
      }
    } else {
      const phoneRes = validatePhoneField(phone);
      if (!phoneRes.isValid) {
        contactValid = false;
        contactError = isAr ? phoneRes.messageAr : phoneRes.messageEn;
      }
    }

    const newErrors: { name?: string; contact?: string } = {};
    if (!nameValidation.isValid) newErrors.name = isAr ? nameValidation.messageAr : nameValidation.messageEn;
    if (!contactValid) newErrors.contact = contactError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newMember: MemberUser = {
      name: name.trim(),
      phone: contactMethod === 'phone' ? phone.trim() : (phone.trim() || 'لم يُحدد'),
      email: contactMethod === 'email' ? email.trim() : (email.trim() || undefined),
      loginTime: Date.now()
    };

    // Save subscriber into the leads database
    try {
      const savedSubs = localStorage.getItem('al_bait_marketing_subscribers');
      const subscribers = savedSubs ? JSON.parse(savedSubs) : [];
      const newSub = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        contactType: contactMethod,
        phone: contactMethod === 'phone' ? phone.trim() : '',
        email: contactMethod === 'email' ? email.trim() : '',
        createdAt: new Date().toISOString(),
        source: 'تسجيل الدخول للموقع'
      };
      localStorage.setItem('al_bait_marketing_subscribers', JSON.stringify([newSub, ...subscribers]));
    } catch {
      // ignore
    }

    onMemberLogin(newMember);
    setIsSuccess(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-auto max-h-[90dvh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#141414] text-white flex items-center justify-between border-b border-[#d4af37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {isAr ? 'تسجيل الدخول للموقع' : 'Website Sign In'}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {isAr ? 'تسجيل بيانات العملاء والزوار' : 'Guest & Member Sign In'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Account View */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain touch-pan-y grow">
          {/* If Already Logged In */}
          {currentMember && !isSuccess ? (
            <div className="space-y-5 text-center py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#141414] font-heading">
                  {isAr ? `أهلاً بك، ${currentMember.name}` : `Welcome back, ${currentMember.name}`}
                </h4>
                <p className="text-xs text-stone-500 mt-1" dir="ltr">
                  {currentMember.phone}
                </p>
                {currentMember.email && (
                  <p className="text-xs text-stone-400 mt-0.5" dir="ltr">
                    {currentMember.email}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  {isAr ? 'متابعة التصفح' : 'Continue Browsing'}
                </button>
                <button
                  type="button"
                  onClick={onMemberLogout}
                  className="py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'خروج' : 'Logout'}</span>
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            /* Success State after first login */
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#141414] font-heading">
                  {isAr ? 'تم تسجيل الدخول بنجاح!' : 'Sign In Successful!'}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  {isAr
                    ? `أهلاً بك يا ${name}، تم تسجيل بياناتك بنجاح في الموقع.`
                    : `Welcome ${name}, your details have been saved.`}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                {isAr ? 'متابعة التصفح' : 'Continue Browsing'}
              </button>
            </div>
          ) : (
            /* Member Sign In Form */
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'الاسم الكريم' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder={isAr ? 'مثال: محمد السعيد' : 'e.g. John Doe'}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                    errors.name
                      ? 'border-red-400 bg-red-50/40 text-red-900'
                      : 'border-stone-300 focus:border-[#d4af37] bg-white'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Contact Method Selection (Email primary, Phone alternative) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {isAr ? 'وسيلة التواصل' : 'Contact Details'} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setContactMethod('email');
                        setErrors((prev) => ({ ...prev, contact: undefined }));
                      }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        contactMethod === 'email'
                          ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      <span>{isAr ? 'إيميل (الأساسي)' : 'Email'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContactMethod('phone');
                        setErrors((prev) => ({ ...prev, contact: undefined }));
                      }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        contactMethod === 'phone'
                          ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>{isAr ? 'رقم الهاتف (بديل)' : 'Phone'}</span>
                    </button>
                  </div>
                </div>

                {contactMethod === 'email' ? (
                  <div>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => handleBlur('contact')}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                        errors.contact
                          ? 'border-red-400 bg-red-50/40 text-red-900'
                          : 'border-stone-300 focus:border-[#d4af37] bg-white'
                      }`}
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      {isAr ? 'النمط المفضل والأولوي لتسجيل وتوثيق الحساب' : 'Preferred and primary sign-in method'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => handleBlur('contact')}
                      placeholder="05XXXXXXXX"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                        errors.contact
                          ? 'border-red-400 bg-red-50/40 text-red-900'
                          : 'border-stone-300 focus:border-[#d4af37] bg-white'
                      }`}
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      {isAr ? 'خيار بديل لمن يفضل استخدام رقم الجوال أو الواتساب' : 'Alternative option via mobile phone number'}
                    </p>
                  </div>
                )}

                {errors.contact && (
                  <p className="text-red-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.contact}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#d4af37]/40"
                >
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
