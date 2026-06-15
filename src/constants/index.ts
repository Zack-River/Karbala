// ─── Application Constants ───

export const SITE_NAME = "وعيٌ يمرّ من كربلاء";
export const SITE_NAME_EN = "Wa'y min Karbala";
export const SITE_DESCRIPTION =
  "منصة تعليمية إسلامية متميزة تقدم موسم معرفي مكون من ١٣ ليلة";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ─── Navigation Links ───

export const NAV_LINKS = [
  { label: "الرئيسية", href: "/karbala" },
  { label: "الليالي", href: "/karbala#nights" },
  { label: "البطاقات", href: "/karbala/cards" },
  { label: "المجالس", href: "/karbala/majalis" },
  { label: "المعرض", href: "/karbala/gallery" },
] as const;

export const NAV_CTA = {
  label: "جدول المحاضرات",
  href: "/karbala#nights",
} as const;

// ─── Admin Navigation ───

export const ADMIN_NAV_LINKS = [
  { label: "لوحة التحكم", href: "/admin", icon: "dashboard" },
  { label: "الموسم", href: "/admin/season", icon: "season" },
  { label: "الشيخ", href: "/admin/sheikh", icon: "sheikh" },
  { label: "الليالي", href: "/admin/nights", icon: "nights" },
  { label: "الاختبارات", href: "/admin/quizzes", icon: "quizzes" },
  { label: "البطاقات", href: "/admin/cards", icon: "cards" },
  { label: "المصادر", href: "/admin/resources", icon: "resources" },
  { label: "المرفقات", href: "/admin/attachments", icon: "attachments" },
  { label: "المجالس", href: "/admin/majalis", icon: "majalis" },
  { label: "المعرض", href: "/admin/gallery", icon: "gallery" },
] as const;

// ─── Status Labels ───

export const NIGHT_STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
  hidden: "مخفي",
};

export const CARD_TYPE_LABELS: Record<string, string> = {
  quote: "اقتباس",
  reflection: "تأمل",
  visual: "بصري",
  benefit: "فوائد",
  question: "أسئلة",
  note: "ملاحظات",
  excerpt: "مقتطفات محاضرة",
};

export const CARD_IMAGE_POSITION_LABELS: Record<string, string> = {
  top: "أعلى النص",
  bottom: "أسفل النص",
  left: "يسار النص",
  right: "يمين النص",
  background: "خلفية",
};

export const QUIZ_MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 3, message: "استمر في التعلم، كل خطوة تقرّبك من الوعي الحسيني" },
  { min: 4, max: 6, message: "أداء جيد! واصل مراجعة محتوى الليلة" },
  { min: 7, max: 8, message: "ممتاز! معرفتك بالموضوع قوية" },
  { min: 9, max: 10, message: "رائع! أتقنت محتوى هذه الليلة" },
] as const;

export const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  book: "كتاب",
  article: "مقال",
  video: "فيديو",
  website: "موقع",
};

export const ATTACHMENT_TYPE_LABELS: Record<string, string> = {
  audio: "صوتي",
  pdf: "PDF",
  image: "صورة",
};

// ─── Supabase Storage Buckets ───

export const STORAGE_BUCKETS = {
  images: "images",
  audio: "audio",
  pdf: "pdf",
  gallery: "gallery",
} as const;
