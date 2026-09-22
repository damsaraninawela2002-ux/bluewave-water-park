import React, { useEffect, useState } from 'react';
import { Search, X, Table, LayoutGrid, Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  { value: 'All', label: 'All Categories' },
  { value: 'SpeedBay', label: 'SpeedBay' },
  { value: 'SplashBay', label: 'SplashBay' },
  { value: 'ChillBay', label: 'ChillBay' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'name', label: 'Name (A – Z)' },
  { value: '-name', label: 'Name (Z – A)' },
];

export default function FiltersBar({
  search = '',
  onSearchChange,
  category = 'All',
  onCategoryChange,
  status = 'all',
  onStatusChange,
  sort = '-createdAt',
  onSortChange,
  viewMode = 'table',
  onViewModeChange,
  onResetFilters,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  // Sync external search reset
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const hasActiveFilters = search.trim() !== '' || category !== 'All' || status !== 'all';

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-slate-700/80 shadow-soft">
      {/* Left controls: Search & Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Debounced Search Box */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search attractions by name or keyword..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-aqua-400 font-sans transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-aqua-400 cursor-pointer font-heading"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-aqua-400 cursor-pointer font-heading"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-aqua-400 cursor-pointer font-heading"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button (Visible when filters are active) */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors font-heading cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right controls: View Mode Toggle */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-slate-700 self-start lg:self-auto">
        <button
          onClick={() => onViewModeChange('table')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
            viewMode === 'table'
              ? 'bg-white dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-ocean-900 dark:hover:text-white'
          }`}
          title="Table View"
        >
          <Table className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Table</span>
        </button>

        <button
          onClick={() => onViewModeChange('grid')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-ocean-900 dark:hover:text-white'
          }`}
          title="Grid View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grid</span>
        </button>
      </div>
    </div>
  );
}
