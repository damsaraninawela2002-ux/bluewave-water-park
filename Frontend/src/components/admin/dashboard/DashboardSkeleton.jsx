import React from 'react';
import Card from '../../Card';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
        <div>
          <div className="h-5 w-40 bg-slate-200 dark:bg-navy-700 rounded-full mb-2" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-navy-700 rounded-xl" />
          <div className="h-4 w-48 bg-slate-100 dark:bg-navy-800 rounded-lg mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-200 dark:bg-navy-700 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 dark:bg-navy-700 rounded-xl" />
        </div>
      </div>

      {/* 8 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-5 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-200 dark:bg-navy-700 rounded" />
                <div className="h-7 w-28 bg-slate-300 dark:bg-navy-600 rounded-lg" />
                <div className="h-3 w-24 bg-slate-100 dark:bg-navy-800 rounded" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-navy-700" />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-navy-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-24 bg-slate-200 dark:bg-navy-700 rounded" />
                <div className="h-5 w-32 bg-slate-300 dark:bg-navy-600 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton: 8 cols + 4 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 h-80 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="h-5 w-48 bg-slate-200 dark:bg-navy-700 rounded mb-4" />
            <div className="h-56 w-full bg-slate-100 dark:bg-navy-900 rounded-xl" />
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card className="p-6 h-80 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="h-5 w-36 bg-slate-200 dark:bg-navy-700 rounded mb-4" />
            <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-navy-900 mx-auto mt-6" />
          </Card>
        </div>
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 h-72 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="h-5 w-40 bg-slate-200 dark:bg-navy-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-8 w-full bg-slate-100 dark:bg-navy-900 rounded" />
              <div className="h-8 w-full bg-slate-100 dark:bg-navy-900 rounded" />
              <div className="h-8 w-full bg-slate-100 dark:bg-navy-900 rounded" />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card className="p-6 h-72 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="h-5 w-36 bg-slate-200 dark:bg-navy-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-slate-100 dark:bg-navy-900 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 dark:bg-navy-900 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
