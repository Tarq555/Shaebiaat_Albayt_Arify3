import React, { useState } from 'react';
import {
  HelpCircle, Plus, Trash2, Edit2, Check, Save, RotateCcw,
  Sparkles, ArrowUp, ArrowDown, Truck, Clock, Calendar, Users,
  CreditCard, PhoneCall
} from 'lucide-react';
import { Language, FaqItem } from '../types';
import { DEFAULT_FAQS } from '../data/restaurantData';

interface AdminFaqTabProps {
  lang: Language;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
}

export const AdminFaqTab: React.FC<AdminFaqTabProps> = ({
  lang,
  faqs,
  onUpdateFaqs
}) => {
  const isAr = lang === 'ar';
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding/editing
  const [questionAr, setQuestionAr] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [answerAr, setAnswerAr] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [iconName, setIconName] = useState('HelpCircle');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionAr.trim() || !answerAr.trim()) {
      alert(isAr ? 'يرجى إدخال نص السؤال والإجابة بالعربي على الأقل' : 'Please provide question and answer');
      return;
    }

    if (editingId) {
      const updated = faqs.map(item =>
        item.id === editingId
          ? {
              ...item,
              questionAr: questionAr.trim(),
              questionEn: questionEn.trim() || questionAr.trim(),
              answerAr: answerAr.trim(),
              answerEn: answerEn.trim() || answerAr.trim(),
              iconName
            }
          : item
      );
      onUpdateFaqs(updated);
      showToast(isAr ? 'تم تحديث السؤال والإجابة بنجاح!' : 'FAQ item updated successfully!');
    } else {
      const newItem: FaqItem = {
        id: `faq-${Date.now()}`,
        questionAr: questionAr.trim(),
        questionEn: questionEn.trim() || questionAr.trim(),
        answerAr: answerAr.trim(),
        answerEn: answerEn.trim() || answerAr.trim(),
        iconName
      };
      onUpdateFaqs([...faqs, newItem]);
      showToast(isAr ? 'تمت إضافة السؤال والإجابة بنجاح!' : 'New FAQ item added!');
    }

    resetForm();
  };

  const resetForm = () => {
    setQuestionAr('');
    setQuestionEn('');
    setAnswerAr('');
    setAnswerEn('');
    setIconName('HelpCircle');
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setQuestionAr(item.questionAr);
    setQuestionEn(item.questionEn);
    setAnswerAr(item.answerAr);
    setAnswerEn(item.answerEn);
    setIconName(item.iconName || 'HelpCircle');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا السؤال وإجابته؟' : 'Delete this FAQ item?')) {
      const filtered = faqs.filter(item => item.id !== id);
      onUpdateFaqs(filtered);
      showToast(isAr ? 'تم حذف السؤال' : 'FAQ item deleted');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const newItems = [...faqs];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onUpdateFaqs(newItems);
  };

  const handleResetDefaults = () => {
    if (confirm(isAr ? 'استعادة الأسئلة الشائعة الافتراضية؟' : 'Reset to default FAQs?')) {
      onUpdateFaqs(DEFAULT_FAQS);
      showToast(isAr ? 'تمت استعادة الأسئلة الافتراضية' : 'Default FAQs restored');
    }
  };

  const iconOptions = [
    { name: 'HelpCircle', label: isAr ? 'استفسار عام' : 'General' },
    { name: 'Clock', label: isAr ? 'أوقات العمل' : 'Hours' },
    { name: 'Truck', label: isAr ? 'التوصيل' : 'Delivery' },
    { name: 'Calendar', label: isAr ? 'الولائم والطلب المسبق' : 'Pre-orders' },
    { name: 'Users', label: isAr ? 'العائلات والجلسات' : 'Family Majlis' },
    { name: 'CreditCard', label: isAr ? 'طرق الدفع ومدى' : 'Payments' },
    { name: 'PhoneCall', label: isAr ? 'الاتصال والحجز' : 'Call & Booking' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#faf9f6] p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#b8860b]" />
            <h4 className="font-bold text-base sm:text-lg text-[#141414] font-heading">
              {isAr ? 'إدارة الأسئلة الشائعة وإجاباتها' : 'FAQ & Answers Manager'}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            {isAr
              ? 'أنت تجيب على جميع الأسئلة بنفسك؛ يمكنك تعديل أي سؤال وإجابته وصياغته حسب رغبتك التامة.'
              : 'You have full control to author questions and write your own custom answers.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdding && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>{isAr ? 'إضافة سؤال وإجابة جديدة' : 'Add New FAQ'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#141414] transition-colors cursor-pointer"
            title={isAr ? 'استعادة الأسئلة الافتراضية' : 'Reset to Defaults'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#faf9f6] p-5 sm:p-6 rounded-2xl border-2 border-[#d4af37]/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h4 className="font-bold text-sm sm:text-base text-[#141414] font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>
                {editingId
                  ? (isAr ? 'تعديل السؤال والإجابة' : 'Edit FAQ Item')
                  : (isAr ? 'إضافة سؤال وجواب جديد' : 'Add New Question & Answer')}
              </span>
            </h4>

            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-stone-500 hover:text-[#141414] px-3 py-1.5 rounded-lg bg-white border border-stone-200 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>

          {/* Question in Arabic & English */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'نص السؤال بالعربي' : 'Question (Arabic)'} *
              </label>
              <input
                type="text"
                required
                value={questionAr}
                onChange={(e) => setQuestionAr(e.target.value)}
                placeholder="مثال: هل يمكن حجز جلسة عائلية أو ولائم مسبقاً؟"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'نص السؤال بالإنجليزي (اختياري)' : 'Question (English)'}
              </label>
              <input
                type="text"
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="e.g. How can I book a family majlis or feast in advance?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Answer in Arabic & English */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'صيغة إجابتك بالعربي (أجب بالطريقة التي تناسبك)' : 'Your Answer (Arabic)'} *
              </label>
              <textarea
                required
                rows={4}
                value={answerAr}
                onChange={(e) => setAnswerAr(e.target.value)}
                placeholder="اكتب إجابتك الشافية والواضحة للعملاء هنا..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37] leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'صيغة إجابتك بالإنجليزي (اختياري)' : 'Your Answer (English)'}
              </label>
              <textarea
                rows={3}
                value={answerEn}
                onChange={(e) => setAnswerEn(e.target.value)}
                placeholder="Write English answer here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37] leading-relaxed"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              {isAr ? 'أيقونة السؤال' : 'Question Icon'}
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(opt => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setIconName(opt.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    iconName === opt.name
                      ? 'bg-[#141414] text-[#d4af37] border-[#d4af37]'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#141414] bg-[#d4af37] hover:bg-[#e5c158] shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isAr ? 'حفظ إجابتي' : 'Save Answer') : (isAr ? 'نشر السؤال والإجابة' : 'Publish FAQ')}</span>
            </button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((item, index) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#d4af37]/40 space-y-3 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#faf9f6] text-[#b8860b] border border-[#d4af37]/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>

                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#141414] font-heading">
                    {isAr ? item.questionAr : item.questionEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-body whitespace-pre-line bg-[#faf9f6] p-3 rounded-xl border border-stone-100">
                    {isAr ? item.answerAr : item.answerEn}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, 'up')}
                  className="p-1.5 rounded-lg bg-[#faf9f6] hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تقديم' : 'Move Up'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={index === faqs.length - 1}
                  onClick={() => moveItem(index, 'down')}
                  className="p-1.5 rounded-lg bg-[#faf9f6] hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تأخير' : 'Move Down'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#d4af37]/20 text-stone-700 hover:text-[#b8860b] transition-colors cursor-pointer"
                  title={isAr ? 'تعديل الإجابة أو السؤال' : 'Edit'}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
