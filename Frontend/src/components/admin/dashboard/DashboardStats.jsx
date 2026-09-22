import React, { useEffect, useState } from 'react';
import {
  Users,
  CalendarCheck,
  DollarSign,
  Clock,
  Compass,
  Ticket,
  Star,
  Mail,
  AlertCircle,
} from 'lucide-react';
import Card from '../../Card';
import { siteConfig } from '../../../config/siteConfig';

/**
 * Smooth Animated Count-Up Hook for numbers and currency
 */
function useAnimatedNumber(targetValue, duration = 900) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const numericTarget = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue) || 0;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericTarget - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
}

function StatItem({ item }) {
  const animatedNumber = useAnimatedNumber(item.rawNumber);

  let formattedValue = '';
  if (item.type === 'currency') {
    formattedValue = `${siteConfig.currency} ${Math.round(animatedNumber).toLocaleString('en-US')}`;
  } else if (item.type === 'decimal') {
    formattedValue = `${animatedNumber.toFixed(1)} / 5.0`;
  } else {
    formattedValue = Math.round(animatedNumber).toLocaleString('en-US');
  }

  const Icon = item.icon;

  return (
    <Card className="relative overflow-hidden p-5 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 group">
      {/* Top Gradient Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading truncate">
              {item.title}
            </span>
            {item.highlightBadge && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700 animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                Action
              </span>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold font-heading mt-2 tracking-tight text-ocean-950 dark:text-white">
            {formattedValue}
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-medium truncate">
            {item.subtitle}
          </p>
        </div>

        {/* Icon Badge */}
        <div className={`p-3 rounded-2xl ${item.iconBox} shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardStats({ totals = {}, bookingStatusCounts = {} }) {
  const pendingCount = totals.pendingBookings ?? bookingStatusCounts.pending ?? 0;
  const unreadCount = totals.unreadMessages ?? 0;

  const statItems = [
    {
      title: 'Total Customers',
      rawNumber: totals.totalCustomers ?? 0,
      type: 'integer',
      subtitle: 'Registered accounts',
      icon: Users,
      gradient: 'from-ocean-600 via-sky-500 to-ocean-700',
      iconBox: 'bg-gradient-to-tr from-ocean-600 to-sky-500 shadow-ocean-500/25',
    },
    {
      title: 'Total Bookings',
      rawNumber: totals.totalBookings ?? 0,
      type: 'integer',
      subtitle: 'All-time passes issued',
      icon: CalendarCheck,
      gradient: 'from-aqua-500 via-cyan-400 to-ocean-600',
      iconBox: 'bg-gradient-to-tr from-aqua-500 to-cyan-400 shadow-aqua-500/25',
    },
    {
      title: 'Total Revenue',
      rawNumber: totals.totalRevenue ?? 0,
      type: 'currency',
      subtitle: 'Confirmed reservations',
      icon: DollarSign,
      gradient: 'from-emerald-500 via-teal-400 to-emerald-700',
      iconBox: 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/25',
    },
    {
      title: 'Pending Bookings',
      rawNumber: pendingCount,
      type: 'integer',
      subtitle: pendingCount > 0 ? 'Requires confirmation' : 'Queue all cleared',
      icon: Clock,
      gradient: 'from-amber-500 via-yellow-400 to-orange-500',
      iconBox: 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/25',
      highlightBadge: pendingCount > 0,
    },
    {
      title: 'Total Attractions',
      rawNumber: totals.totalAttractions ?? 9,
      type: 'integer',
      subtitle: 'Operational rides & zones',
      icon: Compass,
      gradient: 'from-indigo-600 via-purple-500 to-indigo-700',
      iconBox: 'bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-indigo-500/25',
    },
    {
      title: 'Ticket Packages',
      rawNumber: totals.totalTickets ?? 3,
      type: 'integer',
      subtitle: 'Active pass tiers',
      icon: Ticket,
      gradient: 'from-teal-500 via-cyan-400 to-teal-700',
      iconBox: 'bg-gradient-to-tr from-teal-500 to-cyan-400 shadow-teal-500/25',
    },
    {
      title: 'Guest Rating',
      rawNumber: totals.averageRating ?? 4.8,
      type: 'decimal',
      subtitle: `${totals.totalReviews ?? 0} verified reviews`,
      icon: Star,
      gradient: 'from-coral-500 via-rose-400 to-amber-500',
      iconBox: 'bg-gradient-to-tr from-coral-500 to-rose-400 shadow-coral-500/25',
    },
    {
      title: 'Inquiries',
      rawNumber: totals.unreadMessages ?? 0,
      type: 'integer',
      subtitle: unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All inquiries read',
      icon: Mail,
      gradient: 'from-rose-500 via-pink-400 to-rose-700',
      iconBox: 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/25',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {statItems.map((item, index) => (
        <StatItem key={index} item={item} />
      ))}
    </div>
  );
}
