'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/context/LanguageContext';
import { PregnancyProvider } from '@/context/PregnancyContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ServiceWorkerRegister } from '@/components/common/ServiceWorkerRegister';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <PregnancyProvider>
          <ServiceWorkerRegister />
          <AppLayout>{children}</AppLayout>
        </PregnancyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
