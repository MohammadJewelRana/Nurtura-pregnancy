import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Nurtura – Pregnancy Companion & Calculator',
  description:
    'A private, modern, bilingual pregnancy companion web application with gestational age calculations, week-by-week baby development, kick tracking, hydration, appointments, and checklists.',
  applicationName: 'Nurtura',
  keywords: [
    'pregnancy tracker',
    'due date calculator',
    'pregnancy companion',
    'gestational age',
    'LMP calculator',
    'ultrasound due date',
    'Nurtura pregnancy',
    'গর্ভকালীন ট্র্যাকার',
    'প্রেগন্যান্সি ক্যালকুলেটর',
  ],
  authors: [{ name: 'Nurtura Companion' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Nurtura – Pregnancy Companion & Calculator',
    description: 'Your safe, elegant, and private bilingual pregnancy companion.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Nurtura',
  },
};

export const viewport: Viewport = {
  themeColor: '#07111F',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-navy-bg text-text-primary selection:bg-emerald/20 selection:text-emerald">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
