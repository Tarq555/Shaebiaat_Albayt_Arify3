/**
 * Logical Input Validation Utilities for Shaabiyat Al-Bait Al-Reefi
 * Enforces strict real-world validation rules:
 * - Email: Must include @ and valid domain (e.g. user@domain.com)
 * - Saudi Phone: Must start with +966 or 05 (or 966), valid Saudi mobile format (9-10 digits)
 * - Full Name: Must contain only letters (Arabic or English) and spaces, minimum 2 characters
 * - Positive Numbers: For prices, calories, portions, quantities
 */

// Email regex enforcing proper user@domain.extension format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Saudi Mobile regex:
// Starts with +9665, 9665, or 05 followed by 8 digits (total 9 digits after country code or 10 digits with 05)
export const SAUDI_PHONE_REGEX = /^(?:\+9665|9665|05)\d{8}$/;

// Letters-only Name regex: Arabic characters (\u0600-\u06FF), Latin letters (a-zA-Z), and spaces/hyphens
export const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s'-]{2,50}$/;

/**
 * Validates an email address.
 * Requires presence of '@' and a valid domain format.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  if (!trimmed.includes('@')) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Sanitizes phone input in real time to allow only digits and an optional leading '+'
 */
export function sanitizePhoneInput(value: string): string {
  if (!value) return '';
  // Preserve leading '+' if present, remove all non-digits elsewhere
  const hasPlus = value.startsWith('+');
  const digitsOnly = value.replace(/\D/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Normalizes phone number for checking (removes spaces, dashes, parentheses)
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[\s\-()]/g, '');
}

/**
 * Validates a Saudi phone number.
 * Must start with +966 or 05 (e.g., +966508283561 or 0508283561).
 */
export function isValidSaudiPhone(phone: string): boolean {
  if (!phone) return false;
  const normalized = normalizePhone(phone);
  
  // Must start with +966 or 05 (or 966)
  const startsCorrectly = normalized.startsWith('+966') || normalized.startsWith('05') || normalized.startsWith('966');
  if (!startsCorrectly) return false;

  return SAUDI_PHONE_REGEX.test(normalized);
}

/**
 * Sanitizes name input in real time: strips numbers and punctuation symbols.
 * Only allows Arabic/English letters, spaces, hyphens, and apostrophes.
 */
export function sanitizeNameInput(value: string): string {
  if (!value) return '';
  // Remove numbers and unwanted symbols
  return value.replace(/[0-9!@#$%^&*()_+=~`[\]{}|\\:;"<>,.?/]/g, '');
}

/**
 * Validates a person's name.
 * Must be letters only (Arabic or English), at least 2 characters, no digits or symbols.
 */
export function isValidName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  // Disallow any digits
  if (/\d/.test(trimmed)) return false;
  return NAME_REGEX.test(trimmed);
}

/**
 * Validates positive number (e.g., prices, calories, guests)
 */
export function isValidPositiveNumber(val: number | string, min = 1): boolean {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return !isNaN(num) && num >= min;
}

export interface ValidationResult {
  isValid: boolean;
  messageAr: string;
  messageEn: string;
}

/**
 * Helper to get detailed validation result for Name
 */
export function validateNameField(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      messageAr: 'الاسم مطلوب (يجب أن يحتوي على حروف فقط)',
      messageEn: 'Name is required (letters only)'
    };
  }
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      messageAr: 'الاسم يجب أن يحتوي على حروف فقط بدون أرقام',
      messageEn: 'Name must contain letters only, no numbers'
    };
  }
  if (trimmed.length < 2) {
    return {
      isValid: false,
      messageAr: 'الاسم قصير جداً (حرفين على الأقل)',
      messageEn: 'Name is too short (minimum 2 letters)'
    };
  }
  if (!isValidName(trimmed)) {
    return {
      isValid: false,
      messageAr: 'الاسم غير صالح (يرجى كتابة حروف عربية أو إنجليزية فقط)',
      messageEn: 'Invalid name (letters only)'
    };
  }
  return { isValid: true, messageAr: '', messageEn: '' };
}

/**
 * Helper to get detailed validation result for Phone
 */
export function validatePhoneField(phone: string): ValidationResult {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return {
      isValid: false,
      messageAr: 'رقم الهاتف مطلوب (يجب أن يبدأ بـ 05 أو +966)',
      messageEn: 'Phone is required (must start with 05 or +966)'
    };
  }
  if (!normalized.startsWith('05') && !normalized.startsWith('+966') && !normalized.startsWith('966')) {
    return {
      isValid: false,
      messageAr: 'رقم التواصل يجب أن يبدأ بـ 05 أو +966 (أرقام فقط)',
      messageEn: 'Phone must start with 05 or +966'
    };
  }
  if (!isValidSaudiPhone(normalized)) {
    return {
      isValid: false,
      messageAr: 'رقم الجوال غير مكتمل (مثال: 0508283561 أو +966508283561)',
      messageEn: 'Invalid phone format (e.g. 0508283561 or +966508283561)'
    };
  }
  return { isValid: true, messageAr: '', messageEn: '' };
}

/**
 * Helper to get detailed validation result for Email
 */
export function validateEmailField(email: string, isRequired = true): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    if (!isRequired) return { isValid: true, messageAr: '', messageEn: '' };
    return {
      isValid: false,
      messageAr: 'البريد الإلكتروني مطلوب (يجب أن يحتوي على @)',
      messageEn: 'Email is required (must include @)'
    };
  }
  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      messageAr: 'البريد الإلكتروني يجب أن يحتوي على علامة @ واسم النطاق',
      messageEn: 'Email must contain @ and a valid domain'
    };
  }
  if (!isValidEmail(trimmed)) {
    return {
      isValid: false,
      messageAr: 'صيغة البريد الإلكتروني غير صحيحة (مثال: name@example.com)',
      messageEn: 'Invalid email address format (e.g. name@example.com)'
    };
  }
  return { isValid: true, messageAr: '', messageEn: '' };
}
