'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Footprints, Droplet, Scale, Smile } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { KickTracker } from './KickTracker';
import { WaterTracker } from './WaterTracker';
import { WeightTracker } from './WeightTracker';
import { MoodTracker } from './MoodTracker';

type TrackingTab = 'kicks' | 'water' | 'weight' | 'mood';

export function TrackingHub() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TrackingTab) || 'kicks';

  const [activeTab, setActiveTab] = useState<TrackingTab>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as TrackingTab;
    if (tab && ['kicks', 'water', 'weight', 'mood'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs: { id: TrackingTab; label: string; icon: React.ElementType }[] = [
    { id: 'kicks', label: t.dashboard.logMovement, icon: Footprints },
    { id: 'water', label: t.dashboard.logWater, icon: Droplet },
    { id: 'weight', label: t.dashboard.weightTrack, icon: Scale },
    { id: 'mood', label: t.dashboard.moodTrack, icon: Smile },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-plum-950 dark:text-white">
          {t.tracking.hubTitle}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
          {t.tracking.hubSubtitle}
        </p>
      </div>

      {/* Tabs navigation bar */}
      <div className="flex p-1.5 rounded-2xl bg-white dark:bg-[#1E1722] border border-[#EFE8DE] dark:border-[#332537] shadow-subtle overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-plum-700 text-white shadow-subtle'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:text-plum-800 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'kicks' && <KickTracker />}
        {activeTab === 'water' && <WaterTracker />}
        {activeTab === 'weight' && <WeightTracker />}
        {activeTab === 'mood' && <MoodTracker />}
      </div>
    </div>
  );
}
