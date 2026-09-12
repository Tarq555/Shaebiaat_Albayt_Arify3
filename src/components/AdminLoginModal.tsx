import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Delete } from 'lucide-react';
import { Language } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  lang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const isAr = lang === 'ar';
  useBodyScrollLock(isOpen);

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && pin.length === 4) {
      verifyPin(pin);
    }
  }, [isOpen, pin]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitClick(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  const verifyPin = (enteredPin: string) => {
    setError('');
    const savedPin = localStorage.getItem('al_bait_admin_pin');
    const effectivePin = (savedPin && savedPin.trim().length >= 4) ? savedPin.trim() : '8899';
    const trimmed = enteredPin.trim();

    if (trimmed === effectivePin) {
      sessionStorage.setItem('al_bait_session_auth', Date.now().toString());
      setPin('');
      onLoginSuccess();
      onClose();
    } else {
      setIsShaking(true);
      setError(
        isAr
          ? 'رمز المرور غير صحيح! يرجى المحاولة مرة أخرى.'
          : 'Incorrect Security PIN! Please try again.'
      );
      setTimeout(() => {
        setPin('');
        setIsShaking(false);
      }, 600);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-sm bg-[#141414] text-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black border border-[#d4af37]/50 text-[#d4af37] flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight font-heading text-white">
                {isAr ? 'بوابة إدارة المطعم' : 'Admin Security Vault'}
              </span>
              <span className="block text-[10px] text-[#d4af37]">
                {isAr ? 'وصول مقيّد وخاص للمالك' : 'Restricted Manager Access'}
              </span>
            </div>
          </div>

          <button
            id="close-admin-vault-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vault Body */}
        <div className="px-6 py-4 space-y-5 relative z-10 text-center">
          
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white font-heading">
              {isAr ? 'أدخل الرمز السري للمدير' : 'Enter 4-Digit Security PIN'}
            </h4>
            <p className="text-[11px] text-stone-400 font-body">
              {isAr ? 'للتحكم بالقائمة، تعديل الأسعار، ومتابعة الحجوزات' : 'To manage dishes, update prices & view bookings'}
            </p>
          </div>

          {/* 4 PIN Dots / Indicators */}
          <div className={`flex items-center justify-center gap-4 py-2 ${isShaking ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isFilled
                      ? 'bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.9)] scale-115'
                      : 'bg-stone-800 border border-stone-700'
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Numpad */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-[260px] mx-auto" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitClick(digit)}
                className="h-12 rounded-2xl bg-stone-900 hover:bg-black active:scale-95 border border-stone-800 hover:border-[#d4af37] text-white font-bold text-lg transition-all duration-150 flex items-center justify-center shadow-xs cursor-pointer select-none"
              >
                {digit}
              </button>
            ))}
            
            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-2xl bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-bold transition-all flex items-center justify-center cursor-pointer select-none"
            >
              {isAr ? 'مسح' : 'Clear'}
            </button>

            {/* Zero */}
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="h-12 rounded-2xl bg-stone-900 hover:bg-black active:scale-95 border border-stone-800 hover:border-[#d4af37] text-white font-bold text-lg transition-all duration-150 flex items-center justify-center shadow-xs cursor-pointer select-none"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-2xl bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-all flex items-center justify-center cursor-pointer select-none"
              title="Delete"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAr ? 'نظام أمان مشفر' : 'Encrypted Security'}</span>
            </span>

            <span className="text-[10px] text-stone-400">
              {isAr ? 'جلسة خاصة' : 'Private Session'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
