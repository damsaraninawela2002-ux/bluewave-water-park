import React from 'react';
import { Sparkles, Calendar, Compass, Clock, MapPin, Activity } from 'lucide-react';
import Card from '../../Card';
import { siteConfig } from '../../../config/siteConfig';

export default function QuickOverviewCards({ quickOverview = {} }) {
  const busiestDay = quickOverview?.busiestDay || 'Saturday';
  const mostPopularCategory = quickOverview?.mostPopularCategory || 'SpeedBay';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {/* 1. Busiest Day */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-ocean-500 to-sky-400 text-white shadow-sm flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
              Peak Attendance Day
            </div>
            <div className="text-xl font-extrabold text-ocean-950 dark:text-white font-heading mt-0.5 truncate">
              {busiestDay}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Highest guest turnstile traffic
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Top Attraction Category */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-aqua-500 to-cyan-400 text-white shadow-sm flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
              Dominant Attraction Zone
            </div>
            <div className="text-xl font-extrabold text-ocean-950 dark:text-white font-heading mt-0.5 truncate">
              {mostPopularCategory}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Leading zone by ride inventory
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Park Operating Hours & Location */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
              Active Park Hours
            </div>
            <div className="text-base font-extrabold text-ocean-950 dark:text-white font-heading mt-0.5 truncate">
              9:00 AM – 7:30 PM
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              Horana Water Park
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
