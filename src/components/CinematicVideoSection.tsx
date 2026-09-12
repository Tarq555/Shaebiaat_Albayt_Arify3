import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Sparkles,
  Film, Settings, Plus, Trash2, Edit3, Eye, EyeOff, Upload,
  Check, X, Video, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { Language, CinematicVideoItem } from '../types';
import { DragDropImageUpload } from './DragDropImageUpload';
import cinematicPoster from '../assets/images/cinematic_yemeni_feast_1788815778188.jpg';

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
  }
];

interface CinematicVideoSectionProps {
  lang: Language;
  isAdmin?: boolean;
}

export const CinematicVideoSection: React.FC<CinematicVideoSectionProps> = ({
  lang,
  isAdmin = false
}) => {
  const isAr = lang === 'ar';

  // Persistence for video visibility
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('al_bait_show_video_section');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Persistence for videos list
  const [videos, setVideos] = useState<CinematicVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_cinematic_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: CinematicVideoItem) => {
            if (item.videoUrl && item.videoUrl.includes('commondatastorage.googleapis.com')) {
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

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay mode state (persisted in localStorage)
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('al_bait_video_autoplay');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleAutoPlayMode = () => {
    const next = !isAutoPlay;
    setIsAutoPlay(next);
    try {
      localStorage.setItem('al_bait_video_autoplay', JSON.stringify(next));
    } catch (e) {
      console.error('Error saving autoplay preference', e);
    }
    if (videoRef.current) {
      if (next) {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Autoplay attempt with retry on component mount or video switch
  useEffect(() => {
    setHasVideoError(false);
    if (!videoRef.current) return;

    if (isAutoPlay) {
      videoRef.current.muted = true;
      setIsMuted(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasVideoError(false);
          })
          .catch((err) => {
            console.warn('Initial autoplay paused by browser, trying with muted policy:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {
                setIsPlaying(false);
              });
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeVideoIndex, isAutoPlay]);

  // Admin Management Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CinematicVideoItem | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form states
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [badgeAr, setBadgeAr] = useState('');
  const [badgeEn, setBadgeEn] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(videos));
    } catch (e) {
      console.error('Error saving cinematic videos', e);
    }
  }, [videos]);

  // Synchronize across tabs and modals via custom events
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('al_bait_cinematic_videos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideos(parsed);
          }
        }
        const savedVis = localStorage.getItem('al_bait_show_video_section');
        if (savedVis !== null) {
          setIsVisible(JSON.parse(savedVis));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('al_bait_videos_updated', handleSync);
    window.addEventListener('al_bait_show_video_section_updated', handleSync);
    return () => {
      window.removeEventListener('al_bait_videos_updated', handleSync);
      window.removeEventListener('al_bait_show_video_section_updated', handleSync);
    };
  }, []);

  const handleToggleHideCurrentVideo = (id: string) => {
    setVideos((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, hidden: !v.hidden } : v));
      try {
        localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(updated));
        window.dispatchEvent(new Event('al_bait_videos_updated'));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleToggleSectionVisibility = () => {
    const next = !isVisible;
    setIsVisible(next);
    try {
      localStorage.setItem('al_bait_show_video_section', JSON.stringify(next));
      window.dispatchEvent(new Event('al_bait_show_video_section_updated'));
    } catch (e) {
      console.error('Error saving visibility', e);
    }
  };

  // Compute displayed videos depending on admin status
  const displayVideos = isAdmin ? videos : videos.filter((v) => !v.hidden);
  const safeActiveIndex = Math.min(activeVideoIndex, Math.max(0, displayVideos.length - 1));
  const currentVideo = displayVideos[safeActiveIndex] || displayVideos[0] || videos[0];

  // Video play/pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  // Open Edit for a video
  const openEditModal = (vid: CinematicVideoItem) => {
    setEditingVideo(vid);
    setIsAddMode(false);
    setTitleAr(vid.titleAr);
    setTitleEn(vid.titleEn);
    setDescAr(vid.descAr);
    setDescEn(vid.descEn);
    setVideoUrl(vid.videoUrl);
    setPosterUrl(vid.posterUrl);
    setBadgeAr(vid.badgeAr || '');
    setBadgeEn(vid.badgeEn || '');
    setIsHidden(vid.hidden || false);
    setIsManageModalOpen(true);
  };

  // Open Add New Video
  const openAddModal = () => {
    setEditingVideo(null);
    setIsAddMode(true);
    setTitleAr('فيديو إضافي لمائدة ولائم الحطب');
    setTitleEn('Additional Banquet Video');
    setDescAr('تصوير ماكرو عالي الدقة يبرز تفاصيل اللحم والمندي والبخار المتصاعد.');
    setDescEn('High resolution showcase of royal mandi platters and fresh flatbread.');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setPosterUrl(cinematicPoster);
    setBadgeAr('لقطة طعام 4K');
    setBadgeEn('4K Food Shot');
    setIsHidden(false);
    setIsManageModalOpen(true);
  };

  // Save edited or added video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !videoUrl.trim()) return;

    if (isAddMode) {
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
      const updated = [...videos, newVid];
      setVideos(updated);
      try {
        localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(updated));
        window.dispatchEvent(new Event('al_bait_videos_updated'));
      } catch {}
      setActiveVideoIndex(updated.length - 1);
    } else if (editingVideo) {
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
      setVideos(updated);
      try {
        localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(updated));
        window.dispatchEvent(new Event('al_bait_videos_updated'));
      } catch {}
    }

    setIsManageModalOpen(false);
  };

  // Delete a video
  const handleDeleteVideo = (id: string) => {
    if (videos.length <= 1) {
      alert(isAr ? 'يجب الإبقاء على فيديو واحد على الأقل، أو يمكنك إخفاء القسم بالكامل.' : 'Must keep at least one video, or hide the section.');
      return;
    }
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الفيديو؟' : 'Delete this video?')) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      try {
        localStorage.setItem('al_bait_cinematic_videos', JSON.stringify(updated));
        window.dispatchEvent(new Event('al_bait_videos_updated'));
      } catch {}
      setActiveVideoIndex(0);
    }
  };

  // Handle local video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 50MB for video blob)
    if (file.size > 50 * 1024 * 1024) {
      alert(isAr ? 'حجم ملف الفيديو كبير جداً. يرجى اختيار فيديو أقل من 50 ميغابايت أو وضع رابط مباشر.' : 'Video file too large. Please select a file under 50MB or use a URL.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
  };

  // If hidden and not admin, or if all videos hidden for visitors, return null
  if (!isAdmin && (!isVisible || displayVideos.length === 0)) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#111111] text-white border-y border-[#d4af37]/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Admin Bar (When logged in) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/80 border border-[#d4af37]/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-bold text-stone-200">
                {isAr ? 'لوحة إدارة الفيديو السينمائي' : 'Cinematic Video Controls'}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isVisible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isVisible ? (isAr ? 'معروض للزوار ✓' : 'Visible ✓') : (isAr ? 'مخفي عن الزوار ✕' : 'Hidden ✕')}
              </span>
              {currentVideo?.hidden && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  <span>{isAr ? 'هذا الفيديو مخفي' : 'Video Hidden'}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Show/Hide Entire Section Toggle */}
              <button
                onClick={handleToggleSectionVisibility}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isVisible ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isVisible ? (isAr ? 'إخفاء القسم' : 'Hide Section') : (isAr ? 'إظهار القسم' : 'Show Section')}</span>
              </button>

              {/* Hide / Unhide Active Video */}
              {currentVideo && (
                <button
                  onClick={() => handleToggleHideCurrentVideo(currentVideo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentVideo.hidden
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={currentVideo.hidden ? (isAr ? 'إلغاء إخفاء هذا الفيديو' : 'Unhide video') : (isAr ? 'إخفاء هذا الفيديو عن الزوار' : 'Hide video from visitors')}
                >
                  {currentVideo.hidden ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
                  <span>{currentVideo.hidden ? (isAr ? 'إلغاء إخفاء الفيديو' : 'Unhide Video') : (isAr ? 'إخفاء هذا الفيديو' : 'Hide Video')}</span>
                </button>
              )}

              {/* Edit Current Video */}
              {currentVideo && (
                <button
                  onClick={() => openEditModal(currentVideo)}
                  className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استبدال / تعديل الفيديو' : 'Edit / Replace Video'}</span>
                </button>
              )}

              {/* Add Video Beside It */}
              <button
                onClick={openAddModal}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'إضافة فيديو بجانبه' : 'Add Video Beside It'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? (currentVideo?.badgeAr || 'إعلان سينمائي 4K') : (currentVideo?.badgeEn || '4K Cinematic Commercial')}</span>
              </div>
              {currentVideo?.hidden && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <EyeOff className="w-3 h-3" />
                  <span>{isAr ? 'مخفي عن الزوار' : 'Hidden from visitors'}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
              {isAr ? currentVideo?.titleAr : currentVideo?.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-body">
              {isAr ? currentVideo?.descAr : currentVideo?.descEn}
            </p>
          </div>

          {/* Right side controls: switcher and Autoplay/Manual mode controller */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {isAdmin && (
              <button
                onClick={toggleAutoPlayMode}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  isAutoPlay
                    ? 'bg-[#d4af37] text-[#141414] border-[#d4af37] shadow-md hover:bg-amber-400'
                    : 'bg-stone-900 text-stone-200 border-white/20 hover:bg-stone-800'
                }`}
                title={isAr ? 'التبديل بين التشغيل التلقائي واليدوي' : 'Toggle between auto-play and manual play'}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isAutoPlay ? 'bg-emerald-600 animate-pulse' : 'bg-stone-500'}`} />
                <span>
                  {isAr
                    ? (isAutoPlay ? 'وضع التشغيل: تلقائي' : 'وضع التشغيل: يدوي')
                    : (isAutoPlay ? 'Mode: Auto-play' : 'Mode: Manual')}
                </span>
              </button>
            )}

            {/* Multiple Videos Switcher */}
            {displayVideos.length > 1 && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/15 overflow-x-auto">
                {displayVideos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setActiveVideoIndex(idx);
                      setIsPlaying(true);
                      setHasVideoError(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      activeVideoIndex === idx
                        ? 'bg-[#d4af37] text-[#141414] shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isAr ? `فيديو ${idx + 1}` : `Video ${idx + 1}`}</span>
                    {isAdmin && vid.hidden && (
                      <span className="text-[10px] text-amber-400 font-normal flex items-center gap-0.5" title={isAr ? 'مخفي عن الزوار' : 'Hidden from visitors'}>
                        <EyeOff className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4K Cinematic Video Player Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black aspect-video max-h-[640px] w-full group">
          
          {/* Main HTML5 Video */}
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            poster={currentVideo.posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setHasVideoError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
          />

          {/* Fallback image if video cannot be loaded or during buffering */}
          {hasVideoError && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
              <img
                src={currentVideo.posterUrl}
                alt="Cinematic Yemeni Feast"
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white font-bold text-sm mb-2">
                  {isAr ? 'عرض اللقطة السينمائية 4K عالية الدقة' : 'Displaying 4K Cinematic Visual'}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => openEditModal(currentVideo)}
                    className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#141414] font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحديث رابط الفيديو' : 'Update Video Link'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Elegant Dark Vignette Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

          {/* Top Info Overlay */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{isAr ? '4K سينمائي أصيل' : 'Authentic 4K'}</span>
            </div>

            <div className="text-right rtl:text-left text-stone-200 text-xs font-semibold bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              <span>{isAr ? 'شعبيات البيت الريفي بالرياض' : 'Al-Bait Al-Reefi Riyadh'}</span>
            </div>
          </div>

          {/* Big Center Play/Pause Trigger */}
          <button
            onClick={togglePlay}
            className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#141414]/80 hover:bg-[#141414] text-[#d4af37] border-2 border-[#d4af37] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
              isPlaying
                ? 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                : 'opacity-100 scale-105 ring-4 ring-[#d4af37]/40 animate-pulse'
            }`}
            aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37]" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37] translate-x-0.5 rtl:-translate-x-0.5" />
            )}
          </button>

          {/* Bottom Player Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'إيقاف' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-stone-300" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
              </button>

              <div className="text-xs font-semibold text-stone-200 hidden sm:block">
                <span>{isAr ? currentVideo.titleAr : currentVideo.titleEn}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => openEditModal(currentVideo)}
                  className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'تعديل هذا الفيديو' : 'Edit'}</span>
                </button>
              )}

              <button
                onClick={toggleFullScreen}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="شاشة كاملة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Admin Video Editor & Add Modal */}
      {isManageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsManageModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-2xl bg-[#1c1c1c] text-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 flex flex-col max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-black/80 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {isAddMode
                      ? (isAr ? 'إضافة فيديو سينمائي جديد إلى جانبه' : 'Add New Video Beside It')
                      : (isAr ? 'استبدال / تعديل الفيديو السينمائي' : 'Edit / Replace Video')}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {isAr ? 'يمكنك وضع رابط MP4 مباشر أو رفع ملف فيديو من جهازك' : 'Provide a direct MP4 URL or upload a file'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsManageModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveVideo} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              
              {/* Video URL or File Upload */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <label className="block text-xs font-bold text-[#d4af37]">
                  {isAr ? 'رابط ملف الفيديو (MP4 / WebM / CDN):' : 'Video URL (MP4 / WebM):'}
                </label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/20 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#d4af37]"
                />

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {isAr ? 'أو اختر ملف فيديو من جهازك مباشرة:' : 'Or upload video file from device:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{isAr ? 'رفع ملف فيديو' : 'Upload Video'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* Poster Image Drag & Drop / Upload */}
              <div className="space-y-1.5">
                <DragDropImageUpload
                  currentImage={posterUrl}
                  onImageChange={(newImg) => setPosterUrl(newImg)}
                  lang={lang}
                  labelAr="إسقاط أو رفع صورة غلاف الفيديو (Poster)"
                  labelEn="Drop or Upload Video Poster"
                  subLabelAr="اسحب الصورة هنا أو اختر من جهازك (تظهر كغلاف قبل تشغيل الفيديو)"
                  aspectRatio="video"
                  maxWidth={1600}
                  maxHeight={900}
                />
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder={cinematicPoster}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs text-stone-300 focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              {/* Hide / Unhide Toggle */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'حالة ظهور هذا الفيديو للزوار:' : 'Video Visitor Visibility:'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {isHidden
                      ? (isAr ? 'الفيديو مخفي عن الزوار (يظهر لك فقط في وضع الإدارة)' : 'Hidden from regular visitors')
                      : (isAr ? 'الفيديو معروض ومرئي لجميع الزوار' : 'Visible to all visitors')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHidden(!isHidden)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isHidden
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isHidden ? (isAr ? 'مخفي' : 'Hidden') : (isAr ? 'معروض' : 'Visible')}</span>
                </button>
              </div>

              {/* Title AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    {isAr ? 'العنوان بالعربية:' : 'Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    {isAr ? 'العنوان بالإنجليزية:' : 'Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">
                  {isAr ? 'الوصف بالعربية:' : 'Description (Arabic):'}
                </label>
                <textarea
                  rows={2}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#d4af37]"
                />
              </div>

              {/* Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    {isAr ? 'شارة الفيديو (عربي):' : 'Badge (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={badgeAr}
                    onChange={(e) => setBadgeAr(e.target.value)}
                    placeholder="درون سينمائي 4K"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    {isAr ? 'شارة الفيديو (إنجليزي):' : 'Badge (English):'}
                  </label>
                  <input
                    type="text"
                    value={badgeEn}
                    onChange={(e) => setBadgeEn(e.target.value)}
                    placeholder="4K Drone Cinema"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {!isAddMode && editingVideo && videos.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(editingVideo.id)}
                    className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف هذا الفيديو' : 'Delete Video'}</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManageModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-[#141414] text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'حفظ الفيديو' : 'Save Video'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
