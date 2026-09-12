import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ArrowRight, CheckCircle2, Flame, MapPin, Phone, User, Utensils } from 'lucide-react';
import { CartItem, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useBodyScrollLock } from '../utils/scrollLock';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  lang: Language;
  currency: Currency;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
  currency
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useBodyScrollLock(isOpen);

  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('5');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // Price calculations
  const calculateItemPrice = (item: CartItem) => {
    const mult = item.portion === 'regular' ? 1 : item.portion === 'large' ? 1.4 : 2.2;
    return Math.round(item.dish.price * mult) * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const deliveryFee = orderType === 'delivery' ? 500 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert(isAr ? 'يرجى إدخال الاسم ورقم الهاتف للمتابعة' : 'Please enter your name and phone number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const confirmation = {
        orderId: `YEM-${Math.floor(100000 + Math.random() * 900000)}`,
        name: customerName,
        phone: customerPhone,
        type: orderType,
        table: tableNumber,
        address: deliveryAddress,
        items: [...cartItems],
        total: grandTotal,
        time: new Date().toLocaleTimeString(isAr ? 'ar-YE' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setOrderConfirmed(confirmation);
      setIsSubmitting(false);
      onClearCart();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end touch-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-s border-[#d4af37]/35 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#faf9f6] border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141414] font-heading">
                {isAr ? 'سلة الطلبات والمأكولات' : 'Your Order & Feasts'}
              </h3>
              <span className="text-xs text-[#b8860b] font-semibold">
                {cartItems.length} {isAr ? 'أصناف مختارة' : 'items selected'}
              </span>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div 
          className="grow overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-6 space-y-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {orderConfirmed ? (
            /* Order Receipt Confirmation View */
            <div className="text-center space-y-5 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#b8860b] uppercase tracking-wider">
                  {isAr ? 'تم استلام طلبك بنجاح' : 'Order Received Successfully'}
                </span>
                <h3 className="text-2xl font-extrabold text-[#141414] font-heading">
                  {isAr ? 'طلبك قيد التحضير في التنور' : 'Cooking in the Tandoor Now!'}
                </h3>
                <p className="text-xs text-stone-500 font-body">
                  {isAr ? `رقم الفاتورة: #${orderConfirmed.orderId}` : `Invoice Number: #${orderConfirmed.orderId}`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 text-start space-y-3 text-xs">
                <div className="flex justify-between font-bold text-sm text-[#141414] pb-2 border-b border-stone-200">
                  <span>{isAr ? 'العميل' : 'Customer'}: {orderConfirmed.name}</span>
                  <span>{orderConfirmed.phone}</span>
                </div>

                <div className="space-y-1.5 text-stone-600 font-body">
                  <p>
                    <strong>{isAr ? 'نوع الخدمة' : 'Service'}: </strong>
                    {orderConfirmed.type === 'dine-in'
                      ? `${isAr ? 'جلسة داخلية - طاولة' : 'Dine-In - Table'} ${orderConfirmed.table}`
                      : orderConfirmed.type === 'takeaway'
                      ? (isAr ? 'استلام من المطعم' : 'Takeaway')
                      : `${isAr ? 'توصيل إلى' : 'Delivery to'}: ${orderConfirmed.address}`}
                  </p>
                  <p>
                    <strong>{isAr ? 'وقت الطلب' : 'Time'}: </strong> {orderConfirmed.time}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-sm text-[#141414]">
                  <span>{isAr ? 'الإجمالي المدفوع' : 'Total Amount'}</span>
                  <span className="text-[#b8860b]">{formatPrice(orderConfirmed.total, currency, isAr)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#d4af37]/30 flex items-center gap-2 text-xs text-[#141414] font-bold">
                <Flame className="w-4 h-4 shrink-0 text-[#b8860b]" />
                <span>{isAr ? 'سيصلك إشعار بالاتصال عند جهوزية الوجبة وتقديمها ساخنة.' : 'Our team is preparing your feast with fresh herbs and country ghee.'}</span>
              </div>

              <button
                id="receipt-done-btn"
                onClick={() => {
                  setOrderConfirmed(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm shadow-md cursor-pointer"
              >
                {isAr ? 'تم ومتابعة التصفح' : 'Done & Continue'}
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#faf9f6] border border-stone-200 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="font-bold text-lg text-[#141414]">
                {isAr ? 'سلة الطلبات فارغة' : 'Your cart is empty'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto font-body">
                {isAr
                  ? 'استعرض قائمة الطعام الشعبية واكتشف أشهى المأكولات التراثية.'
                  : 'Browse our traditional menu and discover Yemeni culinary heritage.'}
              </p>
              <button
                id="cart-browse-menu-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs shadow-xs cursor-pointer"
              >
                {isAr ? 'تصفح قائمة الطعام' : 'Browse Menu'}
              </button>
            </div>
          ) : (
            /* Cart Items List & Order Options */
            <div className="space-y-6">
              
              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((item, index) => {
                  const itemPrice = calculateItemPrice(item);
                  return (
                    <div
                      key={`${item.dish.id}-${item.portion}-${index}`}
                      className="p-3.5 rounded-2xl bg-[#faf9f6] border border-stone-200 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.dish.image}
                        alt={item.dish.titleAr}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        referrerPolicy="no-referrer"
                      />

                      <div className="grow space-y-1">
                        <h4 className="font-bold text-sm text-[#141414] leading-tight">
                          {isAr ? item.dish.titleAr : item.dish.titleEn}
                        </h4>
                        
                        <div className="flex items-center gap-2 text-xs text-[#b8860b] font-semibold">
                          <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-800 text-[10px]">
                            {item.portion === 'regular'
                              ? (isAr ? 'فردي' : 'Regular')
                              : item.portion === 'large'
                              ? (isAr ? 'مزدوج' : 'Large')
                              : (isAr ? 'عائلي' : 'Family')}
                          </span>
                          <span className="font-price font-bold text-[#141414]">
                            {formatPrice(itemPrice, currency, isAr)}
                          </span>
                        </div>

                        {item.specialNotes && (
                          <p className="text-[11px] text-stone-500 italic">
                            "{item.specialNotes}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-stone-400 hover:text-red-700 p-1 cursor-pointer transition-colors"
                          title={isAr ? 'حذف' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-[#faf9f6] hover:bg-stone-200 text-[#141414] flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#141414]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-[#faf9f6] hover:bg-stone-200 text-[#141414] flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Order Service Mode Selection */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                  {isAr ? 'طريقة الاستلام وتناول الطعام' : 'Dining / Service Mode'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dine-in', labelAr: 'جلسة بالمطعم', labelEn: 'Dine-in Majlis' },
                    { id: 'takeaway', labelAr: 'سفري واستلام', labelEn: 'Takeaway' },
                    { id: 'delivery', labelAr: 'توصيل طلبات', labelEn: 'Delivery' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setOrderType(mode.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        orderType === mode.id
                          ? 'bg-[#141414] text-[#d4af37] border-[#d4af37] shadow-xs'
                          : 'bg-[#faf9f6] text-stone-700 border-stone-200 hover:border-[#d4af37]/40'
                      }`}
                    >
                      {isAr ? mode.labelAr : mode.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details Form */}
              <form id="cart-order-form" onSubmit={handleCheckout} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#b8860b]" />
                      <span>{isAr ? 'الاسم الكريم' : 'Full Name'} *</span>
                    </label>
                    <input
                      type="text"
                      id="cart-customer-name"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'مثال: أبو محمد' : 'e.g. Tariq'}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#b8860b]" />
                      <span>{isAr ? 'رقم الهاتف / الواتساب' : 'Phone Number'} *</span>
                    </label>
                    <input
                      type="tel"
                      id="cart-customer-phone"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+966 5..."
                      className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {orderType === 'dine-in' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-[#b8860b]" />
                      <span>{isAr ? 'رقم الطاولة أو اسم الجلسة' : 'Table / Majlis Number'}</span>
                    </label>
                    <input
                      type="text"
                      id="cart-table-number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder={isAr ? 'طاولة رقم ٥ أو ديوان العائلة' : 'Table #5 or VIP Majlis'}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                    />
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#b8860b]" />
                      <span>{isAr ? 'عنوان التوصيل في الرياض' : 'Delivery Address in Riyadh'} *</span>
                    </label>
                    <input
                      type="text"
                      id="cart-delivery-address"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={isAr ? 'اسم الحي، الشارع، أقرب معلم بالرياض...' : 'District, Street, Landmark in Riyadh...'}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">
                    {isAr ? 'ملاحظات إضافية للطلب' : 'Additional Order Notes'}
                  </label>
                  <input
                    type="text"
                    id="cart-order-notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: تجهيز الشاي بعد الأكل مباشرة...' : 'e.g., Serve tea right after the meal...'}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Footer Billing Breakdown & Confirm Button */}
        {cartItems.length > 0 && !orderConfirmed && (
          <div className="p-4 sm:p-5 bg-[#faf9f6] border-t border-stone-200 space-y-3">
            
            <div className="space-y-1.5 text-xs text-stone-600 font-body">
              <div className="flex justify-between">
                <span>{isAr ? 'مجموع المأكولات' : 'Subtotal'}</span>
                <span className="font-price font-bold text-[#141414]">{formatPrice(subtotal, currency, isAr)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>{isAr ? 'رسوم التوصيل السريع' : 'Delivery Fee'}</span>
                  <span className="font-price font-bold text-[#141414]">{formatPrice(deliveryFee, currency, isAr)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base text-[#141414] pt-1.5 border-t border-stone-200">
                <span>{isAr ? 'الإجمالي النهائي' : 'Total Amount'}</span>
                <span className="font-price text-[#b8860b]">{formatPrice(grandTotal, currency, isAr)}</span>
              </div>
            </div>

            <button
              id="confirm-order-submit-btn"
              type="submit"
              form="cart-order-form"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-black disabled:opacity-60 text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>{isAr ? 'جاري إرسال الطلب للمطبخ...' : 'Sending order to kitchen...'}</span>
              ) : (
                <>
                  <span>{isAr ? 'تأكيد وإرسال الطلب للتنور' : 'Confirm & Send Order to Kitchen'}</span>
                  <ArrowIcon className="w-4 h-4 text-[#d4af37]" />
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
