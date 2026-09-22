import React from 'react';
import { Calendar, Users } from 'lucide-react';
import Card from '../../Card';
import Badge from '../../Badge';
import { siteConfig } from '../../../config/siteConfig';

export default function UpcomingVisitsCard({ upcomingVisits = [] }) {
  const visits = upcomingVisits || [];

  const parseDateParts = (isoDate) => {
    try {
      if (!isoDate) return { month: 'DATE', day: '--' };
      const [year, month, day] = isoDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        month: monthNames[date.getMonth()] || 'MTH',
        day: date.getDate(),
        weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      };
    } catch {
      return { month: 'DATE', day: '--', weekday: '' };
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
          <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
              Upcoming Park Arrivals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Next scheduled visitor check-ins
            </p>
          </div>
        </div>

        {/* Content list */}
        {visits.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            No scheduled visits in upcoming queue.
          </div>
        ) : (
          <div className="space-y-3.5 my-4">
            {visits.map((v, idx) => {
              const { month, day, weekday } = parseDateParts(v.visitDate);

              return (
                <div
                  key={v.id || idx}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/70 dark:bg-navy-900/50 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-navy-700/50 transition-all"
                >
                  {/* Stylized Date Badge */}
                  <div className="flex-shrink-0 w-12 text-center rounded-xl overflow-hidden border border-ocean-200/80 dark:border-slate-700 bg-white dark:bg-navy-800 shadow-xs">
                    <div className="bg-ocean-600 dark:bg-ocean-800 text-white text-[10px] font-bold py-0.5 uppercase tracking-wider font-heading">
                      {month}
                    </div>
                    <div className="py-1">
                      <div className="text-base font-extrabold font-mono text-ocean-950 dark:text-white leading-tight">
                        {day}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        {weekday}
                      </div>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-ocean-950 dark:text-white font-heading truncate">
                        {v.customerName || 'Guest'}
                      </span>
                      <Badge variant={v.bookingStatus || v.status} size="sm">
                        {v.bookingStatus || v.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {v.ticketType || v.ticketName}
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-ocean-500" />
                        {v.quantity} guest{v.quantity > 1 ? 's' : ''}
                      </span>
                      <span className="font-bold text-ocean-900 dark:text-aqua-300">
                        {siteConfig.currency} {Number(v.totalPrice ?? v.totalAmount ?? 0).toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Gate Staff Scanner Ready</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </Card>
  );
}
