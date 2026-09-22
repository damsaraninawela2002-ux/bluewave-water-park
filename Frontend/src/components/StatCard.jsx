import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'ocean',
}) {
  const colorMap = {
    ocean: {
      gradientBar: 'from-ocean-600 via-sky-500 to-ocean-700',
      iconBox: 'bg-gradient-to-tr from-ocean-600 to-sky-500 text-white shadow-ocean-500/30',
      text: 'text-ocean-950',
      badge: 'bg-sky-50 text-sky-700',
    },
    aqua: {
      gradientBar: 'from-aqua-500 via-cyan-400 to-ocean-600',
      iconBox: 'bg-gradient-to-tr from-aqua-500 to-cyan-400 text-white shadow-aqua-500/30',
      text: 'text-ocean-950',
      badge: 'bg-cyan-50 text-cyan-700',
    },
    emerald: {
      gradientBar: 'from-emerald-500 via-teal-400 to-emerald-700',
      iconBox: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/30',
      text: 'text-ocean-950',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    coral: {
      gradientBar: 'from-coral-500 via-rose-400 to-orange-500',
      iconBox: 'bg-gradient-to-tr from-coral-500 to-orange-400 text-white shadow-coral-500/30',
      text: 'text-ocean-950',
      badge: 'bg-rose-50 text-rose-700',
    },
  };

  const scheme = colorMap[color] || colorMap.ocean;

  return (
    <Card className="relative overflow-hidden p-6 border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
      {/* Top Gradient Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${scheme.gradientBar}`} />

      <div className="flex items-center gap-5 pt-1">
        {Icon && (
          <div className={`p-3.5 rounded-2xl ${scheme.iconBox} shadow-md flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading mt-1 tracking-tight text-ocean-950 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
