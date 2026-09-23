import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Motherly – Pregnancy Companion & Calculator',
  description:
    'A premium, private, bilingual pregnancy companion web application with gestational age calculations, week-by-week baby development, kick tracking, hydration, appointments, and checklists.',
  applicationName: 'Motherly',
  keywords: [
    'pregnancy tracker',
    'due date calculator',
    'pregnancy companion',
    'gestational age',
    'LMP calculator',
    'ultrasound due date',
    'গর্ভকালীন ট্র্যাকার',
    'প্রেগন্যান্সি ক্যালকুলেটর',
  ],
  authors: [{ name: 'Motherly Companion' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Motherly – Pregnancy Companion & Calculator',
    description: 'Your safe, elegant, and private bilingual pregnancy companion.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Motherly',
  },
};

export const viewport: Viewport = {
  themeColor: '#DE4A73',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-rose-100 selection:text-rose-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
