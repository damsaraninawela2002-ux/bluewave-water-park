import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Clock } from 'lucide-react';
import Card from '../../Card';

export default function RecentMessagesCard({ recentMessages = [] }) {
  const messages = recentMessages || [];

  const formatDate = (isoString) => {
    try {
      if (!isoString) return 'Just now';
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return 'Just now';
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <Mail className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
                Visitor Inquiries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contact form submissions & questions
              </p>
            </div>
          </div>
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-aqua-400 hover:text-ocean-800 dark:hover:text-aqua-300 font-heading"
          >
            <span>Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Message list */}
        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            No contact inquiries received.
          </div>
        ) : (
          <div className="space-y-3.5 my-4">
            {messages.map((msg, idx) => {
              const isUnread = msg.status === 'new';

              return (
                <div
                  key={msg.id || idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isUnread
                      ? 'bg-sky-50/60 dark:bg-navy-900/90 border-sky-200/80 dark:border-sky-800/60'
                      : 'bg-slate-50/70 dark:bg-navy-900/50 border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-navy-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 ring-4 ring-sky-200 dark:ring-sky-950 flex-shrink-0 animate-pulse" />
                      )}
                      <span className="text-xs font-bold text-ocean-950 dark:text-white font-heading truncate">
                        {msg.name || 'Anonymous Visitor'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-ocean-900 dark:text-slate-200 truncate mb-1">
                    {msg.subject || 'General Inquiry'}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="truncate">{msg.email}</span>
                    <span
                      className={`font-semibold uppercase tracking-wider ${
                        isUnread ? 'text-sky-600 dark:text-aqua-400' : 'text-slate-400'
                      }`}
                    >
                      {isUnread ? 'New' : 'Read'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Forwarded to damsaraninawela2002@gmail.com</span>
        <Clock className="w-3.5 h-3.5" />
      </div>
    </Card>
  );
}
