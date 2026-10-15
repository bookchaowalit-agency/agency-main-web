import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import './globals.css';
import { siteConfig } from '@/lib/site-config';

const notoSansThai = localFont({
  src: [
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '500', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans-thai',
  display: 'swap',
});

const notoSerifThai = localFont({
  src: [
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-serif-thai',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.metadataUrl),
  title: {
    default: 'Solo Empire Group — Specialist Agencies',
    template: '%s — Solo Empire Group',
  },
  description: 'Fourteen specialist agency verticals built on one shared core.',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'Solo Empire Group',
    title: 'Solo Empire Group — Specialist Agencies',
    description: 'Fourteen specialist agency verticals built on one shared core.',
  },
  twitter: { card: 'summary', title: 'Solo Empire Group — Specialist Agencies', description: 'Fourteen specialist agency verticals built on one shared core.' },
  ...(siteConfig.publicUrl ? { alternates: { canonical: siteConfig.publicUrl } } : {}),
  ...(siteConfig.isIndexable
    ? { robots: { index: true, follow: true } }
    : { robots: { index: false, follow: false } }),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${notoSerifThai.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
        {children}
      </body>
    </html>
  );
}
