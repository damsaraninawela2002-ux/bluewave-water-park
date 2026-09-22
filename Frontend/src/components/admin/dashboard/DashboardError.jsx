import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../../Card';

export default function DashboardError({ error, onRetry }) {
  return (
    <Card className="p-8 sm:p-12 text-center max-w-lg mx-auto border-rose-200/80 dark:border-rose-900/60 bg-white dark:bg-navy-800 shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-900/60 shadow-inner">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-extrabold text-ocean-950 dark:text-white font-heading">
        Unable to Load Telemetry Data
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
        {error || 'An error occurred while connecting to the BlueWave administration metrics server.'}
      </p>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-heading font-semibold text-xs transition-all shadow-md hover:shadow-ocean-700/25 active:scale-95 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </Card>
  );
}
