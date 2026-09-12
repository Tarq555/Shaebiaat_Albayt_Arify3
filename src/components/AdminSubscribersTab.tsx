import React, { useState, useEffect } from 'react';
import {
  Users, Mail, Phone, Search, Download, Trash2,
  Calendar, CheckCircle2, MessageSquare, Tag, Shield, Plus, X, Check,
  AlertTriangle, CheckSquare, Square
} from 'lucide-react';
import { Language } from '../types';
import { MarketingSubscriber } from './OffersSubscriptionModal';

const DEFAULT_SUBSCRIBERS: MarketingSubscriber[] = [
  {
    id: 'SUB-101',
    name: 'أبو فهد القحطاني',
    phone: '0501234567',
    email: 'abu.fahad@gmail.com',
    preferredChannel: 'whatsapp',
    interest: 'ولائم ومناسبات خاصة',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'SUB-102',
    name: 'سلطان المطيري',
    phone: '0559876543',
    email: 'sultan.m@hotmail.com',
    preferredChannel: 'both',
    interest: 'عروض الغداء اليومية',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'SUB-103',
    name: 'عبدالله السبيعي',
    phone: '0543219876',
    email: 'a.subaie@outlook.com',
    preferredChannel: 'whatsapp',
    interest: 'الخصومات الملكية والكوبونات',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

interface AdminSubscribersTabProps {
  lang: Language;
}

export const AdminSubscribersTab: React.FC<AdminSubscribersTabProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [subscribers, setSubscribers] = useState<MarketingSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_marketing_subscribers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const altSaved = localStorage.getItem('al_bait_subscribers');
      if (altSaved) {
        const parsedAlt = JSON.parse(altSaved);
        if (Array.isArray(parsedAlt) && parsedAlt.length > 0) return parsedAlt;
      }
    } catch (e) {
      console.error('Error loading subscribers', e);
    }
    return DEFAULT_SUBSCRIBERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'email' | 'both'>('all');
  
  // Selected IDs for batch deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Confirmation Modals State (replaces blocked window.confirm)
  const [subscriberToDelete, setSubscriberToDelete] = useState<MarketingSubscriber | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  // Status Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Add Subscriber State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [newInterest, setNewInterest] = useState('ولائم ومناسبات خاصة');
  const [addError, setAddError] = useState('');

  // Persist subscribers whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('al_bait_marketing_subscribers', JSON.stringify(subscribers));
    } catch (e) {
      console.error('Error saving subscribers', e);
    }
  }, [subscribers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim()) {
      setAddError(isAr ? 'يرجى إدخال اسم العميل' : 'Please enter customer name');
      return;
    }
    if (!newPhone.trim()) {
      setAddError(isAr ? 'يرجى إدخال رقم الجوال' : 'Please enter phone number');
      return;
    }

    const createdSub: MarketingSubscriber = {
      id: `SUB-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newPhone.trim()}@guest.local`,
      preferredChannel: newChannel,
      interest: newInterest,
      createdAt: new Date().toISOString()
    };

    setSubscribers((prev) => [createdSub, ...prev]);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setIsAddOpen(false);
    showToast(isAr ? `تمت إضافة المشترك «${createdSub.name}» بنجاح` : `Subscriber added successfully`);
  };

  // Confirm Single Delete
  const handleConfirmSingleDelete = () => {
    if (!subscriberToDelete) return;
    const targetName = subscriberToDelete.name;
    const targetId = subscriberToDelete.id;

    setSubscribers((prev) => prev.filter((s) => s.id !== targetId));
    setSelectedIds((prev) => prev.filter((id) => id !== targetId));
    setSubscriberToDelete(null);

    showToast(isAr ? `تم حذف المشترك «${targetName}» بنجاح` : `Subscriber deleted`);
  };

  // Confirm Batch Delete
  const handleConfirmBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;

    setSubscribers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setIsBatchDeleteModalOpen(false);

    showToast(isAr ? `تم حذف ${count} من المشتركين بنجاح` : `${count} subscribers deleted`);
  };

  // Toggle selection for one subscriber
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle selection for all filtered subscribers
  const handleToggleSelectAll = () => {
    if (filtered.length === 0) return;
    const allFilteredIds = filtered.map((s) => s.id);
    const areAllSelected = allFilteredIds.every((id) => selectedIds.includes(id));

    if (areAllSelected) {
      // Unselect filtered ones
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleExportCsv = (onlySelected = false) => {
    const listToExport = onlySelected
      ? subscribers.filter((s) => selectedIds.includes(s.id))
      : subscribers;

    if (listToExport.length === 0) {
      showToast(isAr ? 'لا يوجد مشتركون للتصدير حالياً' : 'No subscribers to export');
      return;
    }

    const headers = ['ID', 'الاسم', 'رقم الهاتف', 'البريد الإلكتروني', 'قناة التواصل', 'الاهتمام', 'تاريخ التسجيل'];
    const rows = listToExport.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      s.preferredChannel,
      `"${s.interest}"`,
      new Date(s.createdAt).toLocaleDateString('ar-SA')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al_bait_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(isAr ? `تم تصدير ${listToExport.length} مشترك بنجاح` : `Exported ${listToExport.length} subscribers`);
  };

  const filtered = subscribers.filter((sub) => {
    const matchSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChannel = filterChannel === 'all' || sub.preferredChannel === filterChannel;
    return matchSearch && matchChannel;
  });

  const areAllFilteredSelected =
    filtered.length > 0 && filtered.every((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/50 shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
        <div>
          <h3 className="text-base font-bold text-[#141414] font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-[#b8860b]" />
            <span>{isAr ? 'قائمة المشتركين في العروض والتسويق (Leads)' : 'Marketing Subscribers & Leads'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isAr
              ? `إجمالي المشتركين المحفوظين: ${subscribers.length} مشترك (يمكنك حذف أي شخص بضغطة زر أو تحديد عدة أشخاص)`
              : `Total Saved Subscribers: ${subscribers.length} (delete individually or in bulk)`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Manual Add Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة مشترك يدوياً' : 'Add Subscriber'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => handleExportCsv(false)}
            className="px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-stone-900 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير الكل (Excel / CSV)' : 'Export All (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Multi-selection Action Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-950 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs sm:text-sm font-bold">
              {isAr
                ? `تم تحديد ${selectedIds.length} من المشتركين`
                : `${selectedIds.length} subscribers selected`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              {isAr ? 'إلغاء التحديد' : 'Deselect'}
            </button>
            <button
              onClick={() => handleExportCsv(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{isAr ? 'تصدير المحددين' : 'Export Selected'}</span>
            </button>
            <button
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {isAr
                  ? `حذف المشتركين المحددين (${selectedIds.length})`
                  : `Delete Selected (${selectedIds.length})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-3 start-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم، رقم الجوال أو البريد...' : 'Search by name, phone, email...'}
            className="w-full ps-9 pe-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37] bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterChannel('all')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'all'
                ? 'bg-[#141414] text-[#d4af37]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setFilterChannel('whatsapp')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'واتساب' : 'WhatsApp'}
          </button>
          <button
            onClick={() => setFilterChannel('email')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'email'
                ? 'bg-[#141414] text-[#d4af37]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'إيميل' : 'Email'}
          </button>
          <button
            onClick={() => setFilterChannel('both')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'both'
                ? 'bg-[#d4af37] text-[#141414]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'كلاهما' : 'Both'}
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
          <Users className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
          <p>{isAr ? 'لا توجد بيانات مشتركين مطابقة حالياً.' : 'No matching subscribers found.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-xs text-start">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    title={isAr ? 'تحديد / إلغاء تحديد الكل' : 'Select / Deselect all'}
                    className="p-1 rounded text-stone-500 hover:text-[#b8860b] cursor-pointer"
                  >
                    {areAllFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#b8860b]" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-start">{isAr ? 'الاسم الكامل' : 'Name'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'الجوال' : 'Phone'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'القناة المفضلة' : 'Channel'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'الاهتمام' : 'Interest'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'تاريخ التسجيل' : 'Date'}</th>
                <th className="py-3 px-3 text-center">{isAr ? 'حذف' : 'Delete'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((sub) => {
                const isSelected = selectedIds.includes(sub.id);
                return (
                  <tr
                    key={sub.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-50/60' : 'hover:bg-stone-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(sub.id)}
                        className="p-1 rounded text-stone-400 hover:text-[#b8860b] cursor-pointer"
                        title={isAr ? 'تحديد هذا المشترك' : 'Select'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#b8860b]" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#141414] whitespace-nowrap">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-stone-800 whitespace-nowrap" dir="ltr">
                      <a
                        href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-600 inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{sub.phone}</span>
                      </a>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-600 whitespace-nowrap" dir="ltr">
                      <a href={`mailto:${sub.email}`} className="hover:text-[#b8860b] inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{sub.email}</span>
                      </a>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#b8860b] border border-amber-200">
                        {sub.preferredChannel === 'whatsapp' ? 'واتساب' : sub.preferredChannel === 'email' ? 'إيميل' : 'واتساب وإيميل'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 whitespace-nowrap">
                      {sub.interest}
                    </td>
                    <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSubscriberToDelete(sub)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-white hover:bg-red-600 transition-colors cursor-pointer border border-transparent hover:border-red-600"
                        title={isAr ? `حذف المشترك ${sub.name}` : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* In-App Confirmation Modal for Single Delete (Iframe-safe, no window.confirm) */}
      {subscriberToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSubscriberToDelete(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h4 className="text-base font-bold text-stone-900 font-heading">
                {isAr ? 'تأكيد حذف المشترك' : 'Confirm Deletion'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? `هل أنت متأكد من رغبتك في حذف المشترك «${subscriberToDelete.name}» (${subscriberToDelete.phone}) من قائمة المشتركين؟`
                  : `Are you sure you want to delete ${subscriberToDelete.name} (${subscriberToDelete.phone})?`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubscriberToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {isAr ? 'تراجع / إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'نعم، احذف الآن' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal for Batch Delete */}
      {isBatchDeleteModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsBatchDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h4 className="text-base font-bold text-stone-900 font-heading">
                {isAr
                  ? `تأكيد حذف ${selectedIds.length} من المشتركين`
                  : `Confirm Deleting ${selectedIds.length} Subscribers`}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? `سيتم حذف جميع المشتركين المحددين (${selectedIds.length}) نهائياً من قاعدة البيانات. هل تريد الاستمرار؟`
                  : `All selected subscribers (${selectedIds.length}) will be removed permanently. Do you wish to continue?`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف الجماعي' : 'Confirm Bulk Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Subscriber Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-[#141414] text-white flex items-center justify-between border-b border-[#d4af37]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? 'إضافة مشترك جديد يدوياً' : 'Add New Subscriber Manually'}
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    {isAr ? 'حفظ العميل في قاعدة بيانات المشتركين الدائمة' : 'Save client to persistent subscribers'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="p-4 sm:p-5 space-y-3.5">
              {addError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200 font-bold">
                  {addError}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'اسم المشترك / العميل:' : 'Subscriber Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="محمد العتيبي"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'رقم الجوال:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  dir="ltr"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'قناة التواصل:' : 'Channel:'}
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37] bg-white"
                  >
                    <option value="whatsapp">واتساب</option>
                    <option value="email">إيميل</option>
                    <option value="both">كلاهما</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'الاهتمام:' : 'Interest:'}
                  </label>
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37] bg-white"
                  >
                    <option value="ولائم ومناسبات خاصة">ولائم ومناسبات</option>
                    <option value="عروض الغداء اليومية">عروض الغداء</option>
                    <option value="الخصومات الملكية والكوبونات">كوبونات وخصومات</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'حفظ المشترك' : 'Save Subscriber'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
