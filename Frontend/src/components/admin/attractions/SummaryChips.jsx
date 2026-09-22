import React from 'react';
import { Compass, Waves, Baby, Sparkles } from 'lucide-react';

export default function SummaryChips({
  counts = { total: 0, SpeedBay: 0, SplashBay: 0, ChillBay: 0 },
  activeCategory = 'All',
  onSelectCategory,
}) {
  const chips = [
    {
      label: 'All Attractions',
      category: 'All',
      count: counts.total || 0,
      icon: Compass,
      color: 'ocean',
      activeClass: 'bg-ocean-800 text-white dark:bg-ocean-600 shadow-md',
      inactiveClass:
        'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-700',
    },
    {
      label: 'SpeedBay',
      category: 'SpeedBay',
      count: counts['SpeedBay'] || 0,
      icon: Sparkles,
      color: 'aqua',
      activeClass: 'bg-aqua-600 text-white dark:bg-aqua-500 shadow-md',
      inactiveClass:
        'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-700',
    },
    {
      label: 'SplashBay',
      category: 'SplashBay',
      count: counts['SplashBay'] || 0,
      icon: Waves,
      color: 'blue',
      activeClass: 'bg-sky-700 text-white dark:bg-sky-600 shadow-md',
      inactiveClass:
        'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-700',
    },
    {
      label: 'ChillBay',
      category: 'ChillBay',
      count: counts['ChillBay'] || 0,
      icon: Baby,
      color: 'coral',
      activeClass: 'bg-rose-600 text-white dark:bg-rose-500 shadow-md',
      inactiveClass:
        'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-700',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = activeCategory === chip.category;

        return (
          <button
            key={chip.category}
            onClick={() => onSelectCategory(chip.category)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold font-heading transition-all duration-150 cursor-pointer ${
              isActive ? chip.activeClass : chip.inactiveClass
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{chip.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
