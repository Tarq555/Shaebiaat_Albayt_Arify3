import React, { useState } from 'react';
import { X, Flame, Star, Plus, Minus, Check, MapPin, Sparkles, MessageCircle, Phone, Edit3 } from 'lucide-react';
import { MenuItem, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useBodyScrollLock } from '../utils/scrollLock';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, quantity: number, portion: 'regular' | 'large' | 'family', notes?: string) => void;
  lang: Language;
  currency: Currency;
  catalogOnlyMode?: boolean;
  showPrices?: boolean;
  showDiscountPrices?: boolean;
  whatsappNumber?: string;
  isAdmin?: boolean;
  onEditDishAdmin?: (dish: MenuItem) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onAddToCart,
  lang,
  currency,
  catalogOnlyMode = true,
  showPrices = true,
  showDiscountPrices = false,
  whatsappNumber = RESTAURANT_INFO.whatsapp,
  isAdmin = false,
  onEditDishAdmin
}) => {
  const isAr = lang === 'ar';
  useBodyScrollLock(!!dish);

  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentPrice = dish ? dish.price : 0;
  const totalPrice = currentPrice * quantity;

  const handleAdd = () => {
    if (!dish) return;
    onAddToCart(dish, quantity, 'regular', specialNotes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const dishTitle = dish ? (isAr ? dish.titleAr : dish.titleEn) : '';
  const whatsappDishUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? `السلام عليكم ورحمة الله، أود الاستفسار وطلب طبق: (${dishTitle}) من شعبيات البيت الريفي بالرياض.`
      : `Hello, I would like to inquire about and order: (${dishTitle}) from Shaabiyat Al-Bait Al-Reefi in Riyadh.`
  )}`;

  React.useEffect(() => {
    if (!dish) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, onClose]);

  if (!dish) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/30 my-auto max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="close-dish-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer border border-white/20"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative h-56 sm:h-72 w-full bg-stone-900 shrink-0">
          <img
            src={dish.image}
            alt={isAr ? dish.titleAr : dish.titleEn}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              {dish.originRegion && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1 shadow-xs">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  {dish.originRegion}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div 
          className="p-5 sm:p-7 space-y-6 overflow-y-auto overscroll-contain touch-pan-y grow"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Title and Description */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#141414] font-heading">
                {isAr ? dish.titleAr : dish.titleEn}
              </h3>
              {showPrices && (
                showDiscountPrices && dish.originalPrice && dish.originalPrice > currentPrice ? (
                  <div className="flex flex-col items-end shrink-0">
                    <span className="line-through text-stone-400 text-xs font-semibold">
                      {formatPrice(dish.originalPrice, currency, isAr)}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#d4af37] font-heading">
                      {formatPrice(currentPrice, currency, isAr)}
                    </span>
                  </div>
                ) : (
                  <div className="text-lg sm:text-xl font-extrabold text-[#141414] font-heading shrink-0">
                    {formatPrice(currentPrice, currency, isAr)}
                  </div>
                )
              )}
            </div>

            <p className="text-sm text-stone-600 leading-relaxed font-body">
              {isAr ? dish.descAr : dish.descEn}
            </p>

            {/* Live Admin Edit Button */}
            {isAdmin && onEditDishAdmin && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onEditDishAdmin(dish);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#141414]"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isAr ? '✏️ تعديل بيانات وصورة هذا الصنف فوراً' : 'Edit This Dish & Photo Now'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Calories & Heritage Badge */}
          {dish.calories && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9f6] border border-stone-200">
              <span className="text-xs font-bold text-[#b8860b]">
                {isAr ? 'القيمة الغذائية التقريبية' : 'Approx. Nutritional Info'}
              </span>
              <span className="text-xs font-bold text-[#141414] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#b8860b]" />
                {dish.calories} {isAr ? 'سعرة حرارية' : 'kcal'}
              </span>
            </div>
          )}

          {/* Special Notes */}
          {!catalogOnlyMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                {isAr ? 'ملاحظات وتفضيلات خاصة (اختياري)' : 'Special Requests & Preferences (Optional)'}
              </label>
              <input
                type="text"
                id="dish-special-notes-input"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder={isAr ? 'مثال: حلبة زيادة، بدون بصل مقلي، سمن بلدي إضافي...' : 'e.g., Extra fenugreek, no fried onions, extra ghee...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-sm text-[#141414] placeholder:text-stone-400 focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-[#faf9f6] border-t border-stone-200 shrink-0">
          {catalogOnlyMode ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <div className="text-xs text-stone-600 text-center sm:text-start">
                <span className="font-bold text-[#141414] block">
                  {isAr ? '✨ متوفر يومياً بمقرنا الحصري بالرياض' : '✨ Available daily at Riyadh Flagship'}
                </span>
                <span>
                  {isAr ? 'استفسر أو اطلب مباشرة عبر الواتساب أو تفضل بزيارتنا' : 'Inquire directly via WhatsApp or visit us'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                <a
                  id="dish-modal-whatsapp-btn"
                  href={whatsappDishUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grow sm:grow-0 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{isAr ? 'طلب واستفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </a>

                <a
                  id="dish-modal-call-btn"
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="px-4 py-3 rounded-xl bg-white hover:bg-stone-100 text-[#141414] border border-stone-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="اتصال هاتفي"
                >
                  <Phone className="w-4 h-4 text-[#b8860b]" />
                  <span className="hidden sm:inline">{isAr ? 'اتصال' : 'Call'}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  id="decrease-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg bg-[#faf9f6] hover:bg-stone-100 text-[#141414] flex items-center justify-center font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-base text-[#141414]">
                  {quantity}
                </span>
                <button
                  id="increase-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-[#faf9f6] hover:bg-stone-100 text-[#141414] flex items-center justify-center font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Submit Button */}
              <button
                id="modal-confirm-add-cart-btn"
                onClick={handleAdd}
                className={`w-full sm:w-auto grow sm:grow-0 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{isAr ? 'تمت الإضافة بنجاح!' : 'Added to Cart!'}</span>
                  </>
                ) : (
                  <>
                    <span>{isAr ? 'إضافة إلى الطلب' : 'Add to Order'}</span>
                    {showPrices && (
                      <span className="px-2 py-0.5 rounded-md bg-[#d4af37] text-[#141414] font-heading text-sm font-extrabold">
                        {formatPrice(totalPrice, currency, isAr)}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
