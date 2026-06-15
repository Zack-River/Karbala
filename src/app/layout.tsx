import type { Metadata } from "next";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "كربلاء",
    "الإمام الحسين",
    "محاضرات",
    "إسلامي",
    "تعليم",
    "وعي",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: SITE_NAME,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import { Noto_Kufi_Arabic, Noto_Sans_Arabic, Scheherazade_New, Cinzel } from "next/font/google";

const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-kufi",
  display: "swap",
});

const notoSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${kufi.variable} ${notoSans.variable} ${scheherazade.variable} ${cinzel.variable} font-kufi bg-karbala-dark text-karbala-primary antialiased relative min-h-screen`}>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "وعي يمر من كربلاء",
              "url": "https://qarbla.com",
              "description": "منصة تعليمية إسلامية متميزة تقدم محتوى معرفي حول نهضة الإمام الحسين (ع)",
              "inLanguage": "ar"
            })
          }}
        />
        {/* Global Noise Overlay (if not applied via globals.css) */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: "url('/noise-texture.png')" }}></div>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
