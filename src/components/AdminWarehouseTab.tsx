import React, { useState } from 'react';
import {
  BookOpen, Plus, Trash2, Edit2, Check, Upload, Image as ImageIcon,
  Eye, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Save, Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, MenuWarehouseItem, SiteDisplaySettings } from '../types';
import { compressImageFile } from '../utils/imageUpload';

interface AdminWarehouseTabProps {
  lang: Language;
  warehouseItems: MenuWarehouseItem[];
  onUpdateWarehouseItems: (items: MenuWarehouseItem[]) => void;
  siteSettings: SiteDisplaySettings;
  onUpdateSiteSettings: (settings: SiteDisplaySettings) => void;
}

export const AdminWarehouseTab: React.FC<AdminWarehouseTabProps> = ({
  lang,
  warehouseItems,
  onUpdateWarehouseItems,
  siteSettings,
  onUpdateSiteSettings
}) => {
  const isAr = lang === 'ar';
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for new item
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('ولائم ولحوم');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const compressed = await compressImageFile(e.target.files[0], 1600, 2200, 0.88);
        setImageUrl(compressed);
        showToast(isAr ? 'تم تحميل وضغط الصورة بنجاح!' : 'Image uploaded successfully!');
      } catch (err) {
        alert(isAr ? 'تعذر تحميل الصورة، يرجى المحاولة بصورة أخرى' : 'Failed to process image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert(isAr ? 'يرجى تحميل صورة للمنيو أو إدخال رابط الصورة' : 'Please provide a menu image');
      return;
    }

    if (editingId) {
      // Update existing
      const updated = warehouseItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              titleAr: titleAr.trim() || item.titleAr,
              titleEn: titleEn.trim() || titleAr.trim() || item.titleEn,
              category: category.trim() || 'قائمة الطعام',
              descriptionAr: descriptionAr.trim(),
              descriptionEn: descriptionEn.trim(),
              imageUrl: imageUrl.trim()
            }
          : item
      );
      onUpdateWarehouseItems(updated);
      showToast(isAr ? 'تم تحديث صفحة المنيو في المستودع!' : 'Menu page updated!');
    } else {
      // Create new
      const newItem: MenuWarehouseItem = {
        id: `wh-${Date.now()}`,
        titleAr: titleAr.trim() || (isAr ? `صفحة منيو جديدة (${warehouseItems.length + 1})` : `New Menu Page (${warehouseItems.length + 1})`),
        titleEn: titleEn.trim() || titleAr.trim() || `Menu Page ${warehouseItems.length + 1}`,
        category: category.trim() || 'قائمة الطعام',
        descriptionAr: descriptionAr.trim(),
        descriptionEn: descriptionEn.trim(),
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      onUpdateWarehouseItems([...warehouseItems, newItem]);
      showToast(isAr ? 'تمت إضافة صفحة المنيو إلى المستودع بنجاح!' : 'Menu page added to warehouse!');
    }

    resetForm();
  };

  const resetForm = () => {
    setTitleAr('');
    setTitleEn('');
    setCategory('ولائم ولحوم');
    setDescriptionAr('');
    setDescriptionEn('');
    setImageUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (item: MenuWarehouseItem) => {
    setEditingId(item.id);
    setTitleAr(item.titleAr);
    setTitleEn(item.titleEn);
    setCategory(item.category || 'ولائم ولحوم');
    setDescriptionAr(item.descriptionAr || '');
    setDescriptionEn(item.descriptionEn || '');
    setImageUrl(item.imageUrl);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه الصفحة من المستودع؟' : 'Delete this menu page from warehouse?')) {
      const filtered = warehouseItems.filter(item => item.id !== id);
      onUpdateWarehouseItems(filtered);
      showToast(isAr ? 'تم حذف الصفحة من المستودع' : 'Menu page deleted');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= warehouseItems.length) return;
    const newItems = [...warehouseItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onUpdateWarehouseItems(newItems);
  };

  const toggleDishesMenu = () => {
    const updated = { ...siteSettings, showDishesMenu: !siteSettings.showDishesMenu };
    onUpdateSiteSettings(updated);
    showToast(updated.showDishesMenu ? (isAr ? 'تم تفعيل منيو الأطباق الفردية' : 'Dishes menu enabled') : (isAr ? 'تم إخفاء منيو الأطباق الفردية' : 'Dishes menu hidden'));
  };

  const toggleWarehouse = () => {
    const updated = { ...siteSettings, showMenuWarehouse: !siteSettings.showMenuWarehouse };
    onUpdateSiteSettings(updated);
    showToast(updated.showMenuWarehouse ? (isAr ? 'تم تفعيل مستودع المنيو المصور' : 'Menu warehouse enabled') : (isAr ? 'تم إخفاء مستودع المنيو' : 'Menu warehouse hidden'));
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Control Card: Show/Hide Menu & Warehouse */}
      <div className="bg-[#faf9f6] p-5 sm:p-6 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
          <BookOpen className="w-5 h-5 text-[#b8860b]" />
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#141414] font-heading">
              {isAr ? 'التحكم في إظهار وإخفاء المنيو والمستودع' : 'Menu & Warehouse Visibility'}
            </h4>
            <p className="text-xs text-stone-500">
              {isAr ? 'أنت المتحكم الكامل في ما يظهر لزوار موقع المطعم.' : 'You have full control over what visitors see.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Toggle 1: Menu Warehouse */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#141414]">
                  {isAr ? 'مستودع المنيو المصور (البروشورات)' : 'Menu Warehouse & Brochures'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  siteSettings.showMenuWarehouse ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  {siteSettings.showMenuWarehouse ? (isAr ? 'ظاهر للزوار' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isAr ? 'يعرض صور وصفحات المنيو الجاهزة التي تضيفها بنفسك.' : 'Displays the ready menu pages and photos you upload.'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleWarehouse}
              className="text-stone-700 hover:text-[#141414] transition-colors cursor-pointer"
            >
              {siteSettings.showMenuWarehouse ? (
                <ToggleRight className="w-9 h-9 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-stone-400" />
              )}
            </button>
          </div>

          {/* Toggle 2: Dishes Menu */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#141414]">
                  {isAr ? 'منيو الأطباق التفصيلي (القديم)' : 'Detailed Dishes Menu (Old)'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  siteSettings.showDishesMenu ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {siteSettings.showDishesMenu ? (isAr ? 'ظاهر للزوار' : 'Visible') : (isAr ? 'محذوف ومخفي حالياً' : 'Hidden as requested')}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isAr ? 'تم إخفاؤه بناءً على طلبك، ويمكنك إعادة تفعيله في أي وقت.' : 'Currently hidden per your request. You can re-enable anytime.'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDishesMenu}
              className="text-stone-700 hover:text-[#141414] transition-colors cursor-pointer"
            >
              {siteSettings.showDishesMenu ? (
                <ToggleRight className="w-9 h-9 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-stone-400" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Warehouse Items Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#141414] font-heading flex items-center gap-2">
            <span>{isAr ? 'صفحات وقوائم المنيو في المستودع' : 'Menu Pages in Warehouse'}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#b8860b] text-xs font-bold">
              {warehouseItems.length} {isAr ? 'صفحة' : 'pages'}
            </span>
          </h3>
          <p className="text-xs text-stone-500">
            {isAr ? 'يمكنك رفع صور جديدة، تعديل العناوين، وإعادة ترتيب الصفحات.' : 'Upload new pages, edit descriptions, and reorder.'}
          </p>
        </div>

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
            <span>{isAr ? 'إضافة صفحة / صورة جديدة للمستودع' : 'Add New Page / Photo'}</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSaveNewItem} className="bg-[#faf9f6] p-5 sm:p-6 rounded-2xl border-2 border-[#d4af37]/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h4 className="font-bold text-sm sm:text-base text-[#141414] font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>
                {editingId
                  ? (isAr ? 'تعديل صفحة المنيو' : 'Edit Menu Page')
                  : (isAr ? 'إضافة صفحة أو بروشور جديد إلى المستودع' : 'Add New Menu Page to Warehouse')}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'عنوان الصفحة بالعربي' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: قائمة ولائم التيوس والمندي والحنيذ"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'عنوان الصفحة بالإنجليزي (اختياري)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Mandi & Firewood Feasts Page"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'القسم أو التصنيف' : 'Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="مثال: ولائم ولحوم، فخاريات، إفطار، مشروبات..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {isAr ? 'وصف مختصر للصفحة' : 'Short Description'}
              </label>
              <input
                type="text"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="مثال: صفحة الذبائح والولائم الكاملة على حطب السمر"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Image Upload or URL */}
          <div className="space-y-2 p-4 bg-white rounded-xl border border-stone-200">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'صورة الصفحة أو البروشور' : 'Menu Page Image'} *
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4 text-[#d4af37]" />
                <span>{isUploading ? (isAr ? 'جاري الضغط والرفع...' : 'Processing...') : (isAr ? 'رفع صورة من الجهاز' : 'Upload from Device')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              <div className="relative grow">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="أو ضع رابط صورة المنيو المباشر هنا..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-[#141414] focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>
            </div>

            {imageUrl && (
              <div className="pt-2 flex items-center gap-4">
                <div className="w-20 h-28 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs text-stone-500">
                  <span className="text-emerald-700 font-bold block">{isAr ? 'تم تجهيز الصورة للمستودع' : 'Image ready'}</span>
                  <span>{isAr ? 'ستظهر هذه الصفحة بدقة عالية داخل مستودع المنيو بالموقع' : 'This page will display in high resolution in the warehouse'}</span>
                </div>
              </div>
            )}
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
              <span>{editingId ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة إلى المستودع الآن' : 'Add to Warehouse')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Warehouse Items List */}
      <div className="space-y-3">
        {warehouseItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-300 space-y-2">
            <ImageIcon className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-stone-600">
              {isAr ? 'المستودع فارغ حالياً' : 'Warehouse is currently empty'}
            </p>
            <p className="text-xs text-stone-400">
              {isAr ? 'اضغط على زر "إضافة صفحة / صورة جديدة" لرفع صفحات المنيو الخاصة بك.' : 'Click "Add New Page" to upload your menu catalogs.'}
            </p>
          </div>
        ) : (
          warehouseItems.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#d4af37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                {/* Thumbnail */}
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#faf9f6] text-[#b8860b] border border-[#d4af37]/30">
                      {isAr ? `صفحة ${index + 1}` : `Page ${index + 1}`}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[#141414] font-heading">
                    {isAr ? item.titleAr : item.titleEn}
                  </h4>

                  {(item.descriptionAr || item.descriptionEn) && (
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {isAr ? item.descriptionAr : item.descriptionEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, 'up')}
                  className="p-2 rounded-lg bg-[#faf9f6] hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تقديم الصفحة' : 'Move Up'}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={index === warehouseItems.length - 1}
                  onClick={() => moveItem(index, 'down')}
                  className="p-2 rounded-lg bg-[#faf9f6] hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title={isAr ? 'تأخير الصفحة' : 'Move Down'}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-[#d4af37]/20 text-stone-700 hover:text-[#b8860b] transition-colors cursor-pointer"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
