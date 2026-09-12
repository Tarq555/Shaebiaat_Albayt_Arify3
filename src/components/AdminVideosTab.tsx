import React, { useState, useEffect, useRef } from 'react';
import {
  Film, Plus, Trash2, Edit3, Eye, EyeOff, Upload,
  Check, X, Video, Play, Pause, AlertCircle, Volume2,
  Sparkles, ExternalLink, CheckCircle2
} from 'lucide-react';
import { Language, CinematicVideoItem } from '../types';
import { DragDropImageUpload } from './DragDropImageUpload';
import cinematicPoster from '../assets/images/cinematic_yemeni_feast_1788815778188.jpg';

interface AdminVideosTabProps {
  lang: Language;
}

const DEFAULT_VIDEOS: CinematicVideoItem[] = [
  {
    id: 'cinematic-drone-feast-1',
    titleAr: 'إعلان الافتتاح السينمائي الفاخر 4K',
    titleEn: 'Cinematic Grand Opening 4K Commercial',
    descAr: 'لقطة درون سينمائية واقعية لمطعم يمني أنيق وقت الغروب، تقترب بنعومة من الواجهة ثم تنتقل بانسيابية إلى مائدة فاخرة تضم الفحسة الحجرية الفائرة واللحم المندي مع الأرز وبخار طبيعي دافئ.',
    descEn: 'Cinematic 4K drone shot approaching the elegant facade at sunset, transitioning smoothly to a banquet table with sizzling hot Fahsa and royal mandi meat under golden lighting.',
    badgeAr: 'درون سينمائي 4K • مائدة فاخرة',
    badgeEn: '4K Drone Cinema • Royal Feast',
    videoUrl: '/restaurant_video.mp4',
    posterUrl: cinematicPoster,
    hidden: false
  },
  {
    id: 'cinematic-mandi-kitchen-2',
    titleAr: 'كواليس التنور ومندي الحطب الملكي',
    titleEn: 'Behind The Scenes: Royal Mandi Tandoor',
    descAr: 'تغطية وثائقية حصرية لطريقة تسوية اللحم البلدي الطازج في براميل التنور مع بهارات البيت الريفي الخاصة وجمر الحطب الطبيعي.',
    descEn: 'Exclusive coverage of slow-roasting fresh local meat in heritage tandoor pits with authentic spices and natural embers.',
    badgeAr: 'كواليس التنور • جمر وحطب',
    badgeEn: 'Tandoor Kitchen • Ember Roasted',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    hidden: false
  }
];

export const AdminVideosTab: React.FC<AdminVideosTabProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  // Section visibility
  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('al_bait_show_video_section');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Videos list
  const [videos, setVideos] = useState<CinematicVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_cinematic_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: CinematicVideoItem) => {
            if (item.videoUrl && item.videoUrl.includes('commondatastorage.googleapis.com') && item.id === 'cinematic-drone-feast-1') {
              return { ...item, videoUrl: '/restaurant_video.mp4' };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error('Error reading cinematic videos', e);
    }
    return DEFAULT_VIDEOS;
  });

  // Modals & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CinematicVideoItem | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<CinematicVideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [badgeAr, setBadgeAr] = useState('');
  const [badgeEn, setBadgeEn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [videoFileUploading, setVideoFileUploading] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize with other components via localStorage and custom event
  const saveVideosList = (newList: CinematicVideoItem[]) => {
    setVideos(newList);
    try {
      localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(newList));
      window.dispatchEvent(new Event('al_bait_videos_updated'));
    } catch (e) {
      console.error('Error saving videos to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle entire section visibility
  const handleToggleSectionVisibility = () => {
    const next = !isSectionVisible;
    setIsSectionVisible(next);
    try {
      localStorage.setItem('al_bait_show_video_section', JSON.stringify(next));
      window.dispatchEvent(new Event('al_bait_show_video_section_updated'));
      showToast(next ? (isAr ? 'تم إظهار قسم الفيديو للزوار' : 'Video section visible') : (isAr ? 'تم إخفاء قسم الفيديو بالكامل' : 'Video section hidden'));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle individual video visibility (Hide/Show)
  const handleToggleVideoHidden = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = videos.map((v) => {
      if (v.id === id) {
        const nextHidden = !v.hidden;
        showToast(
          nextHidden
            ? (isAr ? `تم إخفاء الفيديو: "${v.titleAr}" عن الزوار` : `Video hidden: "${v.titleEn}"`)
            : (isAr ? `تم إظهار الفيديو: "${v.titleAr}" للزوار` : `Video now visible: "${v.titleEn}"`)
        );
        return { ...v, hidden: nextHidden };
      }
      return v;
    });
    saveVideosList(updated);
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setTitleAr('فيديو سينمائي جديد لمائدة ولائم البيت الريفي');
    setTitleEn('New Cinematic Banquet Video');
    setDescAr('تغطية وثائقية عالية الدقة لطريقة تسوية أطباق المندي والفحسة الحجرية الفائرة.');
    setDescEn('High resolution documentary coverage of royal mandi and sizzling stone pot fahsa.');
    setBadgeAr('تغطية خاصة 4K');
    setBadgeEn('Special 4K Feature');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setPosterUrl(cinematicPoster);
    setIsHidden(false);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (vid: CinematicVideoItem) => {
    setEditingVideo(vid);
    setTitleAr(vid.titleAr);
    setTitleEn(vid.titleEn);
    setDescAr(vid.descAr);
    setDescEn(vid.descEn);
    setBadgeAr(vid.badgeAr || '');
    setBadgeEn(vid.badgeEn || '');
    setVideoUrl(vid.videoUrl);
    setPosterUrl(vid.posterUrl);
    setIsHidden(!!vid.hidden);
    setIsModalOpen(true);
  };

  // Handle local video file upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert(isAr ? 'يرجى اختيار ملف فيديو صالح (MP4, WebM, QuickTime)' : 'Please select a valid video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert(isAr ? 'حجم ملف الفيديو كبير جداً (أكثر من 100MB). يفضل استخدام رابط فيديو مباشر.' : 'Video file too large (>100MB).');
      return;
    }

    setVideoFileUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setVideoFileUploading(false);
    showToast(isAr ? 'تم تحميل ملف الفيديو من جهازك بنجاح!' : 'Video file selected from device!');
  };

  // Save video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !videoUrl.trim()) {
      alert(isAr ? 'يرجى كتابة عنوان الفيديو ورابط/ملف الفيديو' : 'Please provide video title and file/URL');
      return;
    }

    if (editingVideo) {
      // Update
      const updated = videos.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              titleAr: titleAr.trim(),
              titleEn: titleEn.trim() || titleAr.trim(),
              descAr: descAr.trim(),
              descEn: descEn.trim() || descAr.trim(),
              badgeAr: badgeAr.trim() || undefined,
              badgeEn: badgeEn.trim() || undefined,
              videoUrl: videoUrl.trim(),
              posterUrl: posterUrl.trim() || cinematicPoster,
              hidden: isHidden
            }
          : v
      );
      saveVideosList(updated);
      showToast(isAr ? 'تم تحديث بيانات الفيديو بنجاح!' : 'Video updated successfully!');
    } else {
      // Add new
      const newVid: CinematicVideoItem = {
        id: `vid-${Date.now()}`,
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim() || titleAr.trim(),
        descAr: descAr.trim(),
        descEn: descEn.trim() || descAr.trim(),
        badgeAr: badgeAr.trim() || undefined,
        badgeEn: badgeEn.trim() || undefined,
        videoUrl: videoUrl.trim(),
        posterUrl: posterUrl.trim() || cinematicPoster,
        hidden: isHidden
      };
      saveVideosList([...videos, newVid]);
      showToast(isAr ? 'تمت إضافة الفيديو الجديد بنجاح!' : 'New video added successfully!');
    }

    setIsModalOpen(false);
  };

  // Confirm delete video
  const handleConfirmDelete = () => {
    if (!videoToDelete) return;
    const updated = videos.filter((v) => v.id !== videoToDelete.id);
    saveVideosList(updated);
    showToast(isAr ? `تم حذف الفيديو "${videoToDelete.titleAr}" بنجاح!` : 'Video deleted successfully!');
    setVideoToDelete(null);
  };

  // Visible vs Hidden stats
  const visibleCount = videos.filter((v) => !v.hidden).length;
  const hiddenCount = videos.filter((v) => v.hidden).length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-2xl bg-[#141414] text-[#d4af37] border border-[#d4af37] text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#faf9f6] p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#141414] text-[#d4af37] flex items-center justify-center shadow-xs">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-[#141414] font-heading">
                {isAr ? '🎥 إدارة الفيديوهات السينمائية والتغطيات (إضافة وإخفاء)' : 'Cinematic Videos Manager (Add & Hide)'}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#141414] text-[11px] font-bold border border-[#d4af37]/30">
                {videos.length} {isAr ? 'فيديو' : 'Videos'}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {isAr
                ? 'إضافة فيديوهات جديدة من جهازك أو بالرابط، والتحكم بإخفاء أو إظهار أي فيديو للزوار بنقرة زر واحدة.'
                : 'Add new videos from your device or URL, and toggle visibility to hide or show any video.'}
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Whole Section */}
          <button
            type="button"
            onClick={handleToggleSectionVisibility}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isSectionVisible
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
            }`}
            title={isAr ? 'إظهار أو إخفاء قسم الفيديو بالكامل في الصفحة الرئيسية' : 'Toggle section on homepage'}
          >
            {isSectionVisible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-500" />}
            <span>
              {isSectionVisible
                ? (isAr ? 'قسم الفيديو: معروض بالرئيسية' : 'Section: Visible')
                : (isAr ? 'قسم الفيديو: مخفي بالكامل' : 'Section: Hidden')}
            </span>
          </button>

          {/* Add Video Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/50 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'إضافة فيديو سينمائي جديد' : 'Add New Video'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-bold block">{isAr ? 'إجمالي الفيديوهات:' : 'Total Videos:'}</span>
            <span className="text-2xl font-black text-[#141414] font-mono">{videos.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 font-bold block">{isAr ? 'الفيديوهات المعروضة للزوار:' : 'Visible to Visitors:'}</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">{visibleCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-bold block">{isAr ? 'الفيديوهات المخفية حالياً:' : 'Hidden Videos:'}</span>
            <span className="text-2xl font-black text-amber-700 font-mono">{hiddenCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* List of Videos with Direct Hide/Show Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-sm text-[#141414] flex items-center gap-2 font-heading">
            <Film className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'قائمة الفيديوهات المعرفة في الموقع:' : 'Registered Videos List:'}</span>
          </h5>
          <span className="text-xs text-stone-500">
            {isAr ? '💡 يمكنك النقر على زر "إخفاء / إظهار" لأي فيديو للتحكم بعرضه فوراً' : '💡 Click hide/show to toggle visibility instantly'}
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Film className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-bold text-stone-700">{isAr ? 'لا توجد فيديوهات حالياً' : 'No videos yet'}</p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة أول فيديو سينمائي' : 'Add First Video'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid, index) => {
              const isVidHidden = !!vid.hidden;

              return (
                <div
                  key={vid.id}
                  className={`relative rounded-2xl border overflow-hidden transition-all bg-white flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isVidHidden ? 'border-amber-300/80 bg-amber-50/20' : 'border-stone-200'
                  }`}
                >
                  {/* Top Preview */}
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={vid.posterUrl}
                      alt={vid.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = cinematicPoster;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge & Order */}
                    <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                        #{index + 1}
                      </span>
                      {vid.badgeAr && (
                        <span className="px-2 py-0.5 rounded-md bg-[#d4af37] text-[#141414] text-[10px] font-extrabold shadow-xs">
                          {isAr ? vid.badgeAr : vid.badgeEn}
                        </span>
                      )}
                    </div>

                    {/* Visibility Indicator Tag */}
                    <div className="absolute top-2.5 end-2.5">
                      {isVidHidden ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{isAr ? 'مخفي عن الزوار' : 'Hidden'}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'معروض للزوار ✓' : 'Visible ✓'}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 start-2.5 end-2.5 text-white">
                      <h4 className="font-bold text-sm leading-snug line-clamp-1 font-heading text-white">
                        {isAr ? vid.titleAr : vid.titleEn}
                      </h4>
                      <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                        {isAr ? vid.descAr : vid.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Body & Controls */}
                  <div className="p-4 space-y-3 grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-700">{isAr ? 'رابط الملف:' : 'Source:'}</span>
                        <span className="font-mono text-[10px] text-stone-500 line-clamp-1 max-w-[200px]" dir="ltr">
                          {vid.videoUrl.startsWith('blob:') ? (isAr ? 'ملف محلي مرفوع' : 'Uploaded local file') : vid.videoUrl}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-2">
                      {/* 🌟 Hide / Show Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleVideoHidden(vid.id, e)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                          isVidHidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isVidHidden ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>{isAr ? 'إظهار هذا الفيديو للزوار' : 'Show this Video'}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>{isAr ? 'إخفاء هذا الفيديو' : 'Hide this Video'}</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(vid)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#141414] hover:text-white text-stone-700 transition-colors cursor-pointer border border-stone-200"
                        title={isAr ? 'تعديل الفيديو' : 'Edit video'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setVideoToDelete(vid)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer border border-stone-200"
                        title={isAr ? 'حذف الفيديو' : 'Delete video'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setVideoToDelete(null)}
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
                {isAr ? 'تأكيد حذف الفيديو السينمائي' : 'Confirm Deleting Video'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? `هل أنت متأكد من رغبتك في حذف الفيديو "${videoToDelete.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete video "${videoToDelete.titleEn}"?`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'نعم، احذف الآن' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col my-auto max-h-[92dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#141414] text-white flex items-center justify-between border-b border-[#d4af37]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white font-heading">
                    {editingVideo
                      ? (isAr ? `تعديل الفيديو: ${editingVideo.titleAr}` : `Edit Video: ${editingVideo.titleEn}`)
                      : (isAr ? 'إضافة فيديو سينمائي جديد' : 'Add New Cinematic Video')}
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    {isAr ? 'ارفع ملف فيديو من جهازك أو ضع رابط مباشر مع تحديد حالة العرض' : 'Upload video from device or provide direct link with visibility state'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveVideo} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* 1. Video Source (Device File Upload or URL) */}
              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#d4af37]" />
                    <span>{isAr ? '1. مصدر الفيديو (رفع ملف من جهازك أو رابط مباشر):' : '1. Video Source (Upload or URL):'}</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#d4af37] bg-[#141414] px-2 py-0.5 rounded">
                    MP4 / WebM / 4K
                  </span>
                </div>

                {/* Upload from device button */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={videoFileUploading}
                    className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-[#d4af37]" />
                    <span>{videoFileUploading ? (isAr ? 'جاري التحميل...' : 'Uploading...') : (isAr ? 'رفع ملف فيديو من جهازك' : 'Upload Video File')}</span>
                  </button>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleVideoFileChange}
                  />
                  <span className="text-xs text-stone-500">{isAr ? 'أو اكتب الرابط المباشر أدناه:' : 'Or enter direct URL below:'}</span>
                </div>

                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:border-[#d4af37]"
                  dir="ltr"
                />
              </div>

              {/* 2. Poster Image with Drag & Drop */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isAr ? '2. صورة غلاف الفيديو (Poster):' : '2. Video Poster Thumbnail:'}</span>
                </label>
                <DragDropImageUpload
                  currentImage={posterUrl}
                  onImageChange={(newPoster) => setPosterUrl(newPoster)}
                  lang={lang}
                  labelAr="إسقاط أو رفع صورة غلاف الفيديو"
                  labelEn="Drop or Upload Video Poster"
                  subLabelAr="اسحب وأفلت صورة الغلاف هنا، أو اضغط للاختيار من جهازك"
                  aspectRatio="video"
                  maxWidth={1400}
                  maxHeight={800}
                  compact={true}
                />
              </div>

              {/* 3. Title Ar / En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'عنوان الفيديو بالعربية:' : 'Title (Arabic):'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: إعلان الافتتاح السينمائي 4K"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'العنوان بالإنجليزية (اختياري):' : 'Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Grand Opening 4K Commercial"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* 4. Description Ar / En */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {isAr ? 'وصف الفيديو بالعربية:' : 'Description (Arabic):'}
                </label>
                <textarea
                  rows={2}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="وصف مشهي أو تعريفي يظهر بجانب الفيديو..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#d4af37] resize-none"
                />
              </div>

              {/* 5. Badge Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'الشارة العلوية بالعربية (اختياري):' : 'Badge Tag (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={badgeAr}
                    onChange={(e) => setBadgeAr(e.target.value)}
                    placeholder="مثال: لقطة درون 4K • ولائم ملكية"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'الشارة بالإنجليزية:' : 'Badge Tag (English):'}
                  </label>
                  <input
                    type="text"
                    value={badgeEn}
                    onChange={(e) => setBadgeEn(e.target.value)}
                    placeholder="e.g. 4K Drone Cinema"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 6. Visibility Switch (Hide/Show control inside form) */}
              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-[#141414] flex items-center gap-1.5">
                    {isHidden ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                    <span>{isAr ? 'حالة ظهور هذا الفيديو للزوار:' : 'Visitor Visibility:'}</span>
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    {isHidden
                      ? (isAr ? 'الفيديو سيكون مخفياً عن الزوار ومتاحاً للمعاينة في لوحة التحكم فقط' : 'Hidden from visitors, visible in admin only')
                      : (isAr ? 'الفيديو سيكون معروضاً للزوار في مشغل الفيديو بالصفحة الرئيسية' : 'Visible on the homepage')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHidden(!isHidden)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isHidden
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isHidden ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مخفي حالياً' : 'Hidden'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'معروض للزوار ✓' : 'Visible ✓'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'حفظ الفيديو' : 'Save Video'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
