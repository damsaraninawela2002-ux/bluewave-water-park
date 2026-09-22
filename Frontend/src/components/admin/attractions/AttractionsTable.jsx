import React from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../Card';
import Badge from '../../Badge';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';

export default function AttractionsTable({
  attractions = [],
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const formatDate = (isoString) => {
    if (!isoString) return 'Established';
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch {
      return 'Established';
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-5 sm:px-6 py-3.5">Attraction</th>
              <th className="px-5 sm:px-6 py-3.5">Category</th>
              <th className="px-5 sm:px-6 py-3.5">Description</th>
              <th className="px-5 sm:px-6 py-3.5 text-center">Status</th>
              <th className="px-5 sm:px-6 py-3.5">Created Date</th>
              <th className="px-5 sm:px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
            {attractions.map((item) => {
              const isActive = item.isActive !== false;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-navy-700/50 transition-colors"
                >
                  {/* Thumbnail & Name */}
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-navy-900 shadow-xs flex-shrink-0"
                      />
                      <span className="font-bold text-ocean-950 dark:text-white font-heading">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
                    <Badge variant={item.category}>{item.category}</Badge>
                  </td>

                  {/* Truncated Description */}
                  <td className="px-5 sm:px-6 py-3.5 max-w-xs text-slate-600 dark:text-slate-300 truncate">
                    {item.description}
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="px-5 sm:px-6 py-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-heading transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-navy-700'
                      }`}
                      title={isActive ? 'Click to deactivate' : 'Click to activate'}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-5 sm:px-6 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 sm:px-6 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-ocean-700 dark:hover:text-aqua-300 hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors cursor-pointer"
                        title="Edit Attraction"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Attraction"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
