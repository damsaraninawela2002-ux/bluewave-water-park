import React from 'react';
import { Edit2, Trash2, Power } from 'lucide-react';
import Card from '../../Card';
import Badge from '../../Badge';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

export default function AttractionCard({
  item,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const isActive = item.isActive !== false;

  return (
    <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col group">
      {/* Top Image Container with category & status overlay */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-navy-900">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Category badge top left */}
        <div className="absolute top-3 left-3">
          <Badge variant={item.category}>{item.category}</Badge>
        </div>

        {/* Status badge top right */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isActive
                ? 'bg-emerald-500/90 text-white'
                : 'bg-slate-800/90 text-slate-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-white animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'Active' : 'Inactive'}</span>
          </span>
        </div>

        {/* Name overlay on bottom of image for punchy presentation */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <h3 className="text-lg font-bold text-white font-heading truncate drop-shadow-md">
            {item.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
          {/* Active Switch Toggle */}
          <button
            onClick={() => onToggleStatus(item)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-heading transition-colors cursor-pointer ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-navy-700'
            }`}
            title={isActive ? 'Click to deactivate' : 'Click to activate'}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Published' : 'Hidden'}</span>
          </button>

          {/* Edit & Delete Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-ocean-700 dark:hover:text-aqua-300 hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors border border-slate-200/80 dark:border-slate-700 cursor-pointer"
              title="Edit Attraction"
              aria-label={`Edit ${item.name}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-slate-200/80 dark:border-slate-700 cursor-pointer"
              title="Delete Attraction"
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
