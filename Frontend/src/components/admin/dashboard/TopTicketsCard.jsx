import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../../Card';
import { siteConfig } from '../../../config/siteConfig';

export default function TopTicketsCard({ topTickets = [] }) {
  const tickets = topTickets || [];

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-aqua-50 dark:bg-aqua-950/80 text-aqua-600 dark:text-aqua-400">
              <Ticket className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
                Top Ticket Packages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Revenue and volume contribution by tier
              </p>
            </div>
          </div>
          <Link
            to="/admin/tickets"
            className="inline-flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-aqua-400 hover:text-ocean-800 dark:hover:text-aqua-300 font-heading"
          >
            <span>Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* List of Tickets */}
        {tickets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            No ticket performance data available yet.
          </div>
        ) : (
          <div className="space-y-4 my-5">
            {tickets.map((t, idx) => {
              const isTop = idx === 0;
              const percentage = Math.min(Math.max(t.percentage || 0, 0), 100);

              return (
                <div
                  key={t.id || idx}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-navy-900/50 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-navy-700/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-ocean-900 dark:text-white font-heading truncate">
                        {t.name}
                      </span>
                      {isTop && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-ocean-100 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-300 border border-ocean-200 dark:border-slate-700">
                          <Sparkles className="w-2.5 h-2.5 text-aqua-500" />
                          Top Seller
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-extrabold text-ocean-950 dark:text-white flex-shrink-0">
                      {siteConfig.currency} {(t.revenue || 0).toLocaleString('en-US')}
                    </span>
                  </div>

                  {/* Subtitle with pricing & bookings */}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2 font-mono">
                    <span>
                      {siteConfig.currency} {(t.price || 0).toLocaleString('en-US')} / person
                    </span>
                    <span>{t.bookingsCount || 0} reservation(s)</span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-navy-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-ocean-500 via-sky-500 to-aqua-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-heading">
                      {percentage.toFixed(1)}% of revenue
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Footer note */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500 text-center">
        Pricing in {siteConfig.currencyCode} ({siteConfig.currency}) • Live sync with Admissions
      </div>
    </Card>
  );
}
