import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, PlusCircle, Ticket, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function DashboardHeader({ onRefresh, refreshing }) {
  const { user } = useAuth();
  const adminName = user?.name ? user.name.split(' ')[0] : 'Admin';

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-300 border border-ocean-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
          <ShieldCheck className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
          <span>Administration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
          Welcome back, {adminName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
          <span>{todayFormatted}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Online</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 active:scale-95 transition-all font-heading shadow-xs disabled:opacity-60 cursor-pointer"
          title="Refresh dashboard metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-ocean-600 dark:text-aqua-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>

        <Link to="/admin/attractions">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-heading shadow-xs cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5 text-ocean-600 dark:text-aqua-400" />
            <span>+ Add Attraction</span>
          </button>
        </Link>

        <Link to="/admin/tickets">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-heading shadow-xs cursor-pointer">
            <Ticket className="w-3.5 h-3.5 text-ocean-600 dark:text-aqua-400" />
            <span>+ Add Ticket</span>
          </button>
        </Link>

        <Link to="/admin/bookings">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white transition-all font-heading shadow-md hover:shadow-ocean-700/20 active:scale-95 cursor-pointer">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>View Bookings</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
