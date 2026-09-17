import type { Metadata } from 'next';
import { Noto_Sans_Thai, Noto_Serif_Thai } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { siteConfig } from '@/lib/site-config';

const sans = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-thai',
  display: 'swap',
});

const serif = Noto_Serif_Thai({
  subsets: ['thai'],
  weight: ['400', '600', '700'],
  variable: '--font-serif-thai',
  display: 'swap',
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
    <html lang="th" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
        {children}
      </body>
    </html>
  );
}
