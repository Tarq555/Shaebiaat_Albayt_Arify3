import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Trash2, Edit2, Check, X,
  ArrowLeft, ArrowRight, Shield, Download, RefreshCw,
  Sparkles, UtensilsCrossed, Phone, MessageCircle, ShoppingBag,
  Eye, EyeOff, FileText, CheckCircle2, ChevronDown
} from 'lucide-react';
import { Language, Currency, RestaurantInfoType, SiteDisplaySettings, MenuItem } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { formatPrice } from '../utils/currency';

export interface TableMenuItemRow {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  calories?: number;
  notes?: string;
}

const DEFAULT_TABLE_MENU_ITEMS: TableMenuItemRow[] = [
  { id: 't-1', name: 'نفر مندي لحم ضأن بلدي مع الرز الشعبي', category: 'ولائم ومندي', size: 'نفر (1-2 شخص)', price: 78, calories: 1250, notes: 'مطبوخ على حطب السمر الطبيعي' },
  { id: 't-2', name: 'نصف حبة مندي دجاج محمر مع الرز', category: 'ولائم ومندي', size: 'نصف حبة', price: 26, calories: 780, notes: 'مع الشطة والدقوس البلدي' },
  { id: 't-3', name: 'حبة كاملة مندي دجاج على الحطب', category: 'ولائم ومندي', size: 'حبة كاملة', price: 48, calories: 1560, notes: 'تكفي 2-3 أشخاص' },
  { id: 't-4', name: 'حنيذ لحم تيس بلدي في التنور', category: 'ولائم ومندي', size: 'نفر', price: 82, calories: 1190, notes: 'متبل بالبهارات الريفية' },
  { id: 't-5', name: 'مدفون لحم بالقصدير على الجمر', category: 'ولائم ومندي', size: 'نفر', price: 86, calories: 1260, notes: 'لحم طري ذايب' },
  { id: 't-6', name: 'كبسة حاشي برية بالرز النثري', category: 'ولائم ومندي', size: 'نفر', price: 65, calories: 1180, notes: 'لحم حاشي بلدي طازج' },
  { id: 't-7', name: 'فحسة لحم بلدي بالمقلى الحجري الفائر', category: 'فخاريات حجرية', size: 'مقلى حجر', price: 32, calories: 680, notes: 'تفور بالحلبة والمرق المركز' },
  { id: 't-8', name: 'سلتة تراثية تقليدية بالمقلى الحجري', category: 'فخاريات حجرية', size: 'مقلى حجر', price: 24, calories: 490, notes: 'بالخضار والحلبة والسمن' },
  { id: 't-9', name: 'عقدة دجاج صعدة بالخضار والتوابل', category: 'فخاريات حجرية', size: 'صحن وسط', price: 28, calories: 540, notes: 'مسبكة بمرق الدجاج الطبيعي' },
  { id: 't-10', name: 'كبدة حاشي طازجة على الصاج', category: 'صاج ومقلقل', size: 'صحن صاج', price: 32, calories: 420, notes: 'محمرة بالبصل والفلفل' },
  { id: 't-11', name: 'مقلقل لحم غنم بلدي بالطماطم والفلفل', category: 'صاج ومقلقل', size: 'صحن صاج', price: 34, calories: 580, notes: 'لحم مقطع صغير بتتبيلة خاصة' },
  { id: 't-12', name: 'تقاطيع ولحم راس متبل ومحمر', category: 'صاج ومقلقل', size: 'صحن', price: 28, calories: 510, notes: 'نكهة شعبية أصيلة' },
  { id: 't-13', name: 'فول قلابة جمرية بالسمن البلدي', category: 'إفطار وشعبيات', size: 'فخار', price: 14, calories: 340, notes: 'مطبوخ على الفحم' },
  { id: 't-14', name: 'شكشوكة عدنية بالجبن البلدي', category: 'إفطار وشعبيات', size: 'صحن', price: 16, calories: 380, notes: 'بيض بلدي مع الخضار والجبن' },
  { id: 't-15', name: 'مطبق لحم مفروم مقرمش بالفرن', category: 'إفطار وشعبيات', size: 'حبة مقطعة', price: 15, calories: 450, notes: 'مع الليمون والفلفل' },
  { id: 't-16', name: 'خبز ملوح يمني طازج من التنور', category: 'مخبوزات التنور', size: 'رغيف كبير', price: 3, calories: 290, notes: 'مورق بالسمن الطبيعي' },
  { id: 't-17', name: 'عريكة ملكي بالقشطة والعسل البلدي والتمر', category: 'حلا ومعصوب', size: 'صحن ملكي', price: 26, calories: 880, notes: 'مع الكاجو والمكسرات' },
  { id: 't-18', name: 'معصوب بالقشطة والعسل والموز', category: 'حلا ومعصوب', size: 'صحن', price: 22, calories: 720, notes: 'فطير يمني مهروس' },
  { id: 't-19', name: 'بنت الصحن بالسمن البلدي وحبة البركة', category: 'حلا ومعصوب', size: 'طبق دائري', price: 28, calories: 690, notes: 'طبقات رقيقة بالعسل الدوعني' },
  { id: 't-20', name: 'براد شاي عدني كرك بالهيل والزعفران', category: 'مشروبات ساخنة', size: 'براد وسط', price: 12, calories: 160, notes: 'حليب مبخر مع البهارات' },
  { id: 't-21', name: 'قهوة قشر يمنية بالزنجبيل والقرفة', category: 'مشروبات ساخنة', size: 'دلة صغيرة', price: 10, calories: 45, notes: 'خفيفة وصحية بعد الوجبات' }
];

interface TableMenuPageProps {
  lang: Language;
  currency: Currency;
  onReturnToHome: () => void;
  isAdmin: boolean;
  restaurantInfo?: RestaurantInfoType;
  siteSettings: SiteDisplaySettings;
  onUpdateSiteSettings: (settings: SiteDisplaySettings) => void;
  onQuickAddToCart?: (dish: MenuItem) => void;
}

export const TableMenuPage: React.FC<TableMenuPageProps> = ({
  lang,
  currency,
  onReturnToHome,
  isAdmin,
  restaurantInfo,
  siteSettings,
  onUpdateSiteSettings,
  onQuickAddToCart
}) => {
  const isAr = lang === 'ar';
  const info = restaurantInfo || RESTAURANT_INFO;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const isEnabled = siteSettings.enableTableMenuPage !== false;

  // Persisted Table Items State
  const [items, setItems] = useState<TableMenuItemRow[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_qr_table_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading table menu', e);
    }
    return DEFAULT_TABLE_MENU_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('al_bait_qr_table_menu', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving table menu', e);
    }
  }, [items]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add Item Modal (No photo needed!)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('ولائم ومندي');
  const [sizeInput, setSizeInput] = useState('نفر');
  const [priceInput, setPriceInput] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [addError, setAddError] = useState('');

  // Editing Row
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCalories, setEditCalories] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return Array.from(set);
  }, [items]);

  // Filtered rows
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const matchSearch =
        it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (it.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || it.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [items, searchQuery, selectedCategory]);

  // Handle Add Item (Without any photo!)
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!nameInput.trim()) {
      setAddError(isAr ? 'يرجى كتابة اسم الصنف' : 'Please enter item name');
      return;
    }

    const priceNum = parseFloat(priceInput);
    if (isNaN(priceNum) || priceNum < 0) {
      setAddError(isAr ? 'يرجى إدخال سعر صحيح بالأرقام' : 'Please enter a valid numeric price');
      return;
    }

    const calNum = parseInt(caloriesInput, 10);

    const newRow: TableMenuItemRow = {
      id: `table-item-${Date.now()}`,
      name: nameInput.trim(),
      category: categoryInput.trim() || (isAr ? 'عام' : 'General'),
      size: sizeInput.trim() || (isAr ? 'نفر' : 'Standard'),
      price: priceNum,
      calories: isNaN(calNum) ? undefined : calNum,
      notes: notesInput.trim() || undefined
    };

    setItems((prev) => [newRow, ...prev]);
    setNameInput('');
    setPriceInput('');
    setCaloriesInput('');
    setNotesInput('');
    setIsAddModalOpen(false);
  };

  // Handle Edit Row
  const handleStartEdit = (row: TableMenuItemRow) => {
    setEditingRowId(row.id);
    setEditName(row.name);
    setEditCategory(row.category);
    setEditSize(row.size);
    setEditPrice(row.price.toString());
    setEditCalories(row.calories ? row.calories.toString() : '');
    setEditNotes(row.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const priceNum = parseFloat(editPrice) || 0;
    const calNum = parseInt(editCalories, 10);

    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              name: editName.trim(),
              category: editCategory.trim() || it.category,
              size: editSize.trim() || it.size,
              price: priceNum,
              calories: isNaN(calNum) ? undefined : calNum,
              notes: editNotes.trim() || undefined
            }
          : it
      )
    );
    setEditingRowId(null);
  };

  // Handle Delete Row
  const handleDeleteRow = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الصنف من الجدول؟' : 'Delete this item from table?')) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  // Toggle Page Enable/Disable
  const handleTogglePageStatus = () => {
    const updated = {
      ...siteSettings,
      enableTableMenuPage: !isEnabled
    };
    onUpdateSiteSettings(updated);
  };

  // If page is disabled and user is NOT admin: show polite unavailable message
  if (!isEnabled && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-stone-200 text-stone-600 flex items-center justify-center mb-4 shadow-xs">
          <EyeOff className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#141414] font-heading mb-2">
          {isAr ? 'صفحة منيو الطاولات غير مفعلة حالياً' : 'Table Menu Page is Currently Inactive'}
        </h2>
        <p className="text-sm text-stone-600 max-w-md mb-6">
          {isAr
            ? 'تم إيقاف عرض جدول أصناف الطاولات مؤقتاً من قبل الإدارة. يرجى تصفح الموقع الرئيسي أو التواصل معنا مباشرة.'
            : 'The table menu page is temporarily disabled by management. Please visit our home page or contact us.'}
        </p>
        <button
          onClick={onReturnToHome}
          className="px-6 py-3 rounded-2xl bg-[#141414] text-[#d4af37] font-bold text-sm hover:bg-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#141414] font-body flex flex-col">
      
      {/* 1. Admin Management Banner (When logged in as Admin) */}
      {isAdmin && (
        <div className="bg-[#141414] text-white px-4 py-2.5 border-b border-[#d4af37]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            <span className="font-bold">
              {isAr ? 'لوحة تحكم صفحة منيو الطاولات (جدول الأصناف بدون صور)' : 'Table Menu Management Bar (No-photo table)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Existence of Page */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl">
              <span>{isAr ? 'حالة الصفحة للزوار:' : 'Visitor Availability:'}</span>
              <button
                type="button"
                onClick={handleTogglePageStatus}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                  isEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isEnabled ? (isAr ? 'مفعلة ✓' : 'Active ✓') : (isAr ? 'معطلة ✕' : 'Disabled ✕')}
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-[#d4af37] text-[#141414] font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة صنف للجدول' : 'Add Table Item'}</span>
            </button>

            {/* Reset Defaults */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm(isAr ? 'استعادة الجدول الافتراضي؟' : 'Reset to default table?')) {
                  setItems(DEFAULT_TABLE_MENU_ITEMS);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title={isAr ? 'استعادة الجدول الافتراضي' : 'Reset defaults'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Standalone Page Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToHome}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={isAr ? 'العودة للموقع الرئيسي' : 'Back to main website'}
            >
              <ArrowIcon className="w-4 h-4 text-[#b8860b]" />
              <span className="hidden sm:inline">{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>

            <div className="border-s border-stone-300 ps-3">
              <h1 className="text-base sm:text-lg font-extrabold text-[#141414] font-heading flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? 'جدول الأصناف والأسعار' : 'Menu & Price Table'}</span>
              </h1>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                isAr ? 'السلام عليكم، أود الطلب من قائمة الأصناف' : 'Hello, I would like to order from the items menu'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isAr ? 'طلب عبر واتساب' : 'WhatsApp Order'}</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. Main Body Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative grow max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في جدول الأصناف (مندي، فحسة، لحم، معصوب...)' : 'Search table dishes...'}
                className="w-full ps-9 pe-4 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#d4af37]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Total items badge */}
            <div className="flex items-center gap-2 text-xs text-stone-600 justify-end">
              <span>{isAr ? 'إجمالي الأصناف المعروضة:' : 'Total items:'}</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#141414]">
                {filteredItems.length}
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isAr ? 'جميع الأقسام' : 'All Categories'} ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Table Representation (No Photos, Clean & Super Fast) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#141414] text-white border-b border-[#d4af37]/30 text-start">
                  <th className="py-3 px-3 w-12 text-center text-stone-400 font-mono">#</th>
                  <th className="py-3 px-4 font-bold text-white">{isAr ? 'اسم الصنف' : 'Dish Name'}</th>
                  <th className="py-3 px-3 font-bold text-[#d4af37]">{isAr ? 'القسم' : 'Category'}</th>
                  <th className="py-3 px-3 font-bold text-stone-300">{isAr ? 'الحجم / الحصة' : 'Portion / Size'}</th>
                  <th className="py-3 px-3 font-bold text-white text-center">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="py-3 px-3 font-bold text-stone-400 text-center">{isAr ? 'السعرات' : 'Calories'}</th>
                  <th className="py-3 px-4 font-bold text-stone-300 hidden md:table-cell">{isAr ? 'ملاحظات' : 'Notes'}</th>
                  {isAdmin && (
                    <th className="py-3 px-3 font-bold text-[#d4af37] text-center w-28">{isAr ? 'إجراءات الإدارة' : 'Actions'}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-body">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="py-12 text-center text-stone-500">
                      <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      <p className="font-bold">{isAr ? 'لا توجد أصناف مطابقة للبحث' : 'No items match your search'}</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((row, idx) => {
                    const isEditing = editingRowId === row.id;

                    if (isEditing) {
                      return (
                        <tr key={row.id} className="bg-amber-50/50">
                          <td className="py-2 px-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editSize}
                              onChange={(e) => setEditSize(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs text-center font-bold"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={editCalories}
                              onChange={(e) => setEditCalories(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3 hidden md:table-cell">
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEdit(row.id)}
                                className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                                title={isAr ? 'حفظ' : 'Save'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingRowId(null)}
                                className="p-1 rounded-md bg-stone-200 text-stone-700 hover:bg-stone-300 cursor-pointer"
                                title={isAr ? 'إلغاء' : 'Cancel'}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 text-center text-stone-400 font-mono text-xs">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-[#141414]">
                          {row.name}
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] font-medium">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-700 font-medium">
                          {row.size}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-[#141414] font-price">
                          {formatPrice(row.price, currency)}
                        </td>
                        <td className="py-3 px-3 text-center text-stone-500 font-mono text-xs">
                          {row.calories ? `${row.calories} ك` : '—'}
                        </td>
                        <td className="py-3 px-4 text-stone-500 text-xs hidden md:table-cell">
                          {row.notes || '—'}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleStartEdit(row)}
                                className="p-1.5 rounded-lg text-stone-600 hover:text-[#141414] hover:bg-stone-100 transition-colors cursor-pointer"
                                title={isAr ? 'تعديل السطر' : 'Edit Row'}
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#b8860b]" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title={isAr ? 'حذف من الجدول' : 'Delete Row'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 5. Add New Item Modal (No photo required!) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg border border-stone-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#141414] text-[#d4af37] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141414] font-heading">
                    {isAr ? 'إضافة صنف جديد لجدول المنيو (بدون صورة)' : 'Add New Table Item (No Photo)'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {isAr ? 'يكفي ملء الاسم والسعر والحجم لإدراجه مباشرة' : 'Name, price and size are sufficient'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isAr ? 'اسم الصنف *' : 'Dish Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={isAr ? 'مثال: مدفون لحم بلدي في التنور' : 'e.g. Madfoon Lamb'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'القسم *' : 'Category *'}
                  </label>
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder={isAr ? 'ولائم ومندي، فخاريات...' : 'Mains, Pottery...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'الحجم / الحصة *' : 'Portion / Size *'}
                  </label>
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder={isAr ? 'نفر، حبة كاملة، مقلى حجر...' : 'Single, Full, Stone pot...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'السعر (بالريال) *' : 'Price (SAR) *'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="45"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isAr ? 'السعرات الحرارية (اختياري)' : 'Calories (Optional)'}
                  </label>
                  <input
                    type="number"
                    value={caloriesInput}
                    onChange={(e) => setCaloriesInput(e.target.value)}
                    placeholder="750"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isAr ? 'ملاحظات وتفاصيل إضافية (اختياري)' : 'Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder={isAr ? 'يقدم مع الرز والدقوس الحار...' : 'Served with fragrant rice...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                />
              </div>

              {addError && (
                <p className="text-red-600 text-xs font-bold">{addError}</p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#141414] text-[#d4af37] font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  {isAr ? 'حفظ وإدراج في الجدول' : 'Save to Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
