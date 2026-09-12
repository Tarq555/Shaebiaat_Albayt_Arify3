import { Currency } from '../types';

// Standard Saudi Riyal base rates for Riyadh Flagship - SAR ONLY
const RATES: Record<string, { rate: number; symbolAr: string; symbolEn: string }> = {
  SAR: { rate: 1, symbolAr: 'ر.س', symbolEn: 'SAR' },
};

export function formatPrice(amountInSar: number, _currency: Currency = 'SAR', isAr: boolean = true): string {
  // Always strictly in Saudi Riyal (SAR)
  const normalizedSar = amountInSar > 350 ? Math.round(amountInSar / 65) : amountInSar;
  const info = RATES.SAR;
  const converted = normalizedSar * info.rate;

  const formattedNumber = Number.isInteger(Math.round(converted * 10) / 10)
    ? Math.round(converted).toString()
    : (Math.round(converted * 10) / 10).toFixed(1);

  return `${formattedNumber} ${isAr ? info.symbolAr : info.symbolEn}`;
}
