import React from 'react';
import { PieChart, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Card from '../../Card';

export default function StatusDonut({ counts = { confirmed: 0, pending: 0, cancelled: 0 } }) {
  const confirmed = counts.confirmed || 0;
  const pending = counts.pending || 0;
  const cancelled = counts.cancelled || 0;
  const total = confirmed + pending + cancelled;

  // Donut geometry
  const radius = 38;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages and stroke offsets
  const segments = [
    {
      key: 'confirmed',
      label: 'Confirmed',
      count: confirmed,
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400',
      icon: CheckCircle2,
      percent: total > 0 ? (confirmed / total) * 100 : 0,
      dashLength: total > 0 ? (confirmed / total) * circumference : 0,
    },
    {
      key: 'pending',
      label: 'Pending',
      count: pending,
      color: '#f59e0b', // amber-500
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-700 dark:text-amber-400',
      icon: Clock,
      percent: total > 0 ? (pending / total) * 100 : 0,
      dashLength: total > 0 ? (pending / total) * circumference : 0,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: cancelled,
      color: '#ef4444', // rose-500
      bgClass: 'bg-rose-500',
      textClass: 'text-rose-700 dark:text-rose-400',
      icon: XCircle,
      percent: total > 0 ? (cancelled / total) * 100 : 0,
      dashLength: total > 0 ? (cancelled / total) * circumference : 0,
    },
  ];

  // Calculate accumulated offsets for each segment
  let currentOffset = 0;
  const calculatedSegments = segments.map((seg) => {
    const dashOffset = -currentOffset;
    currentOffset += seg.dashLength;
    return { ...seg, dashOffset };
  });

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
          <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <PieChart className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
              Booking Status Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of guest reservations
            </p>
          </div>
        </div>

        {/* Donut Chart Visual */}
        <div className="relative flex items-center justify-center my-6">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-100 dark:text-navy-900/80"
              />

              {total === 0 ? (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-200 dark:text-slate-700"
                />
              ) : (
                calculatedSegments.map((seg) => (
                  <circle
                    key={seg.key}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${seg.dashLength} ${circumference}`}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap={total === 1 ? 'round' : 'butt'}
                    className="transition-all duration-700 ease-out hover:opacity-85"
                  />
                ))
              )}
            </svg>

            {/* Donut Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-ocean-950 dark:text-white tracking-tight">
                {total}
              </span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 font-heading uppercase tracking-wider">
                Total Passes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
        {calculatedSegments.map((seg) => {
          const Icon = seg.icon;
          return (
            <div
              key={seg.key}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-navy-900/50 hover:bg-slate-100/70 dark:hover:bg-navy-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${seg.bgClass}`} />
                <Icon className={`w-3.5 h-3.5 ${seg.textClass}`} />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 font-heading">
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{seg.count}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  ({seg.percent.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
