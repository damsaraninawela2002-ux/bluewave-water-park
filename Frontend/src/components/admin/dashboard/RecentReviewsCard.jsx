import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquareQuote, ArrowRight, User } from 'lucide-react';
import Card from '../../Card';

export default function RecentReviewsCard({ recentReviews = [] }) {
  const reviews = recentReviews || [];

  const formatDate = (isoString) => {
    try {
      if (!isoString) return 'Recent';
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return 'Recent';
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
                Recent Guest Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified visitor ratings & experiences
              </p>
            </div>
          </div>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-aqua-400 hover:text-ocean-800 dark:hover:text-aqua-300 font-heading"
          >
            <span>Public Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            No guest reviews posted yet.
          </div>
        ) : (
          <div className="space-y-3.5 my-4">
            {reviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="p-3 rounded-xl bg-slate-50/70 dark:bg-navy-900/50 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-navy-700/50 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                      {(rev.userName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-ocean-950 dark:text-white font-heading truncate">
                      {rev.userName || 'Verified Guest'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= (rev.rating || 5)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 ml-1 font-mono">
                    {rev.rating}.0
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Public reviews require confirmed booking</span>
        <MessageSquareQuote className="w-4 h-4 text-slate-400" />
      </div>
    </Card>
  );
}
