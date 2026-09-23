'use client';

import React, { Suspense } from 'react';
import { TrackingHub } from '@/components/tracking/TrackingHub';

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-charcoal-400">Loading tracking hub...</div>}>
      <TrackingHub />
    </Suspense>
  );
}
