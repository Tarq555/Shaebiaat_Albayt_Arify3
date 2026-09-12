export type Language = 'ar' | 'en';

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  badge?: string;
  count?: number;
  iconName: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface MenuItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number; // Price in Saudi Riyal (SAR)
  originalPrice?: number; // السعر القديم قبل الخصم (للعروض متى ما رغب بإظهاره)
  categoryId: CategoryId;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isChefSpecial?: boolean;
  prepTimeMinutes: number;
  serves: string;
  calories?: number;
  image: string;
  originRegion?: string;
  ingredientsAr?: string[];
  ingredientsEn?: string[];
  spiceLevel?: 1 | 2 | 3 | 4;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  portion: 'regular' | 'large' | 'family';
  specialNotes?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor-majlis' | 'outdoor-terrace' | 'family-section' | 'vip-room';
  specialOccasion?: string;
  notes?: string;
  createdAt: string;
}

export interface HeroConfig {
  badgeAr: string;
  badgeEn: string;
  titleLine1Ar: string;
  titleLine1En: string;
  titleHighlightAr: string;
  titleHighlightEn: string;
  definitionAr: string;
  definitionEn: string;
  bgImage: string;
  overlayOpacity: number; // 20 to 85 percent
  exploreBtnTextAr: string;
  exploreBtnTextEn: string;
  contactBtnTextAr: string;
  contactBtnTextEn: string;
  bookBtnTextAr: string;
  bookBtnTextEn: string;
  pillar1TitleAr: string;
  pillar1DescAr: string;
  pillar2TitleAr: string;
  pillar2DescAr: string;
  pillar3TitleAr: string;
  pillar3DescAr: string;
}

export interface SocialLinks {
  tiktok?: string;
  instagram?: string;
  snapchat?: string;
  twitter?: string;
  youtube?: string;
}

export interface ShowSocialLinks {
  tiktok: boolean;
  instagram: boolean;
  snapchat: boolean;
  twitter: boolean;
  youtube: boolean;
}

export interface RestaurantInfoType {
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coordinatesDisplay: string;
  googleMapsUrl: string;
  directionsUrl: string;
  mapEmbedUrl: string;
  openingHoursAr: string;
  openingHoursEn: string;
  email: string;
  establishedYear: string;
  buildingPhoto: string;
  socialLinks: SocialLinks;
  showSocialLinks: ShowSocialLinks;
  readyMenuUrl?: string;
  readyMenuTitleAr?: string;
  readyMenuTitleEn?: string;
  enableReadyMenu?: boolean;
}

export interface FaqItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  iconName?: string;
}

export interface MenuWarehouseItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl: string;
  category?: string;
  createdAt?: string;
}

export interface SiteDisplaySettings {
  catalogOnlyMode: boolean; // True = display/catalog only (no cart/payment); False = full online cart ordering
  showPrices: boolean;
  showDiscountPrices?: boolean; // خيار إظهار أو إخفاء السعر القديم والجديد (مخفي حالياً حسب طلب المستخدم)
  enableAnnouncementBar: boolean;
  announcementTextAr: string;
  announcementTextEn: string;
  exclusiveBranchNoticeAr: string;
  exclusiveBranchNoticeEn: string;
  showDishesMenu: boolean; // Control whether individual dishes grid is displayed (false by default per user request)
  showMenuWarehouse: boolean; // Control whether the menu warehouse/uploaded catalog images are displayed
  readyMenuUrl?: string;
  readyMenuTitleAr?: string;
  readyMenuTitleEn?: string;
  enableReadyMenu?: boolean;
  enableTableMenuPage?: boolean; // Control existence of standalone Table Menu without photos
  showHeaderTopStrip?: boolean; // Control whether quick links, popular dishes, location & hours top bar is shown at the header
  showSignInButton?: boolean; // التحكم بإظهار أو إخفاء زر تسجيل الدخول
  showReservationButton?: boolean; // خيار إظهار أو إخفاء زر حجز جلسة عائلية أو ديوان (مخفي حالياً، ويمكن إظهاره متى ما أراد المستخدم)
  // تخصيص جميع نصوص وعناوين الموقع (عريض وعادي)
  categoriesBadgeAr?: string;
  categoriesTitleAr?: string;
  categoriesSubtitleAr?: string;
  menuTitleAr?: string;
  menuSubtitleAr?: string;
  galleryBadgeAr?: string;
  galleryTitleAr?: string;
  gallerySubtitleAr?: string;
  videoBadgeAr?: string;
  videoTitleAr?: string;
  videoSubtitleAr?: string;
  faqBadgeAr?: string;
  faqTitleAr?: string;
  faqSubtitleAr?: string;
  contactBadgeAr?: string;
  contactTitleAr?: string;
  contactSubtitleAr?: string;
  footerAboutAr?: string;
  footerCopyrightAr?: string;
  extraBoldText?: boolean;
}

export type HomepageSectionId = 'hero' | 'categories' | 'dishes' | 'gallery' | 'video' | 'faq' | 'contact';

export interface HomepageSectionConfig {
  id: HomepageSectionId;
  nameAr: string;
  nameEn: string;
  enabled: boolean;
}

export interface SpecialOffer {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  badgeAr: string;
  badgeEn: string;
  validUntilAr: string;
  validUntilEn: string;
  itemsIncludedAr: string[];
  itemsIncludedEn: string[];
  image: string;
  couponCode?: string;
  isPopular?: boolean;
}

export interface CinematicVideoItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr?: string;
  badgeEn?: string;
  videoUrl: string;
  posterUrl: string;
  hidden?: boolean;
}

export interface MemberUser {
  name: string;
  phone: string;
  email?: string;
  loginTime: number;
  discountCode?: string;
}

export interface StoryConfig {
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  paragraph1Ar: string;
  paragraph1En: string;
  paragraph2Ar: string;
  paragraph2En: string;
  chefQuoteAr: string;
  chefQuoteEn: string;
}

export type Currency = 'SAR';

export type AdminTab = 'texts' | 'warehouse' | 'faqs' | 'dishes' | 'categories' | 'photos' | 'videos' | 'hero' | 'display' | 'restaurant' | 'security' | 'reservations' | 'subscribers';
