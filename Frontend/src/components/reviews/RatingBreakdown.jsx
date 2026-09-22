import React from 'react';
import { Star } from 'lucide-react';

export default function RatingBreakdown({
  summary,
  activeFilter = null,
  onSelectFilter = null,
}) {
  const total = summary?.totalReviews || 0;
  const avg = (summary?.averageRating || 0).toFixed(1);
  const starCounts = summary?.starCounts || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

  const starLevels = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Left: Big Score & Stars */}
        <div className="text-center sm:text-left sm:pr-8 sm:border-r border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="text-5xl sm:text-6xl font-black text-ocean-950 dark:text-white font-heading tracking-tight">
            {avg}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(Number(avg))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Based on {total} verified {total === 1 ? 'review' : 'reviews'}
          </p>
          <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
            100% Verified Guests
          </span>
        </div>

        {/* Right: Progress Bars per Star */}
        <div className="flex-1 w-full space-y-2.5">
          {starLevels.map((stars) => {
            const count = starCounts[String(stars)] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isSelected = activeFilter === String(stars);

            return (
              <button
                key={stars}
                type="button"
                onClick={() => onSelectFilter && onSelectFilter(isSelected ? null : String(stars))}
                disabled={!onSelectFilter}
                className={`w-full flex items-center gap-3 text-xs text-left group transition-opacity ${
                  onSelectFilter ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                } ${isSelected ? 'font-bold text-ocean-600 dark:text-aqua-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <div className="flex items-center gap-1 w-14 flex-shrink-0 font-heading">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                {/* Bar Track */}
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-r from-ocean-600 to-aqua-500'
                        : 'bg-amber-400 dark:bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Percentage & Count */}
                <span className="w-12 text-right font-mono text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
