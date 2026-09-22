import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-aqua-500`} />
    </div>
  );
}

export function SkeletonCard({ count = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 p-6 shadow-soft animate-pulse flex flex-col gap-4"
        >
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700/80 rounded-xl" />
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-700/80 rounded-md w-1/2" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700/80 rounded-full w-1/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded w-4/5" />
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/80 flex justify-between items-center">
            <div className="h-8 bg-slate-200 dark:bg-slate-700/80 rounded w-1/3" />
            <div className="h-9 bg-slate-200 dark:bg-slate-700/80 rounded-xl w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FullPageLoader({ text = 'Loading BlueWave experiences...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-aqua-200 dark:border-aqua-950 border-t-aqua-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🌊</span>
      </div>
      <p className="mt-4 text-ocean-900 dark:text-slate-100 font-heading font-medium text-sm animate-pulse">
        {text}
      </p>
    </div>
  );
}
