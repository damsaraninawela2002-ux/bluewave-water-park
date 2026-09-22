import React, { useEffect, useState, useRef } from 'react';
import { bookingService } from '../../services/bookingService';
import { Compass, Ticket, Users, Layers } from 'lucide-react';
import Card from '../Card';

function CountUp({ end, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuad
      const current = Math.floor(progress * (2 - progress) * end);
      setCount(current);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function StatsStrip() {
  const [stats, setStats] = useState({
    totalAttractions: 9,
    totalTickets: 3,
    totalBookings: 12,
    totalCategories: 3,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await bookingService.getPublicStats();
        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.warn('Using default public stats:', err);
      } finally {
        setLoaded(true);
      }
    }
    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Park Attractions',
      value: stats.totalAttractions,
      suffix: '',
      icon: Compass,
      color: 'from-ocean-600 to-sky-500',
      textColor: 'text-ocean-900 dark:text-white',
      subtitle: 'Slides, lagoons & splash zones',
    },
    {
      label: 'Admission Passes',
      value: stats.totalTickets,
      suffix: ' Tiers',
      icon: Ticket,
      color: 'from-aqua-500 to-ocean-600',
      textColor: 'text-ocean-900 dark:text-white',
      subtitle: 'Individual & family packages',
    },
    {
      label: 'Happy Bookings',
      value: stats.totalBookings,
      suffix: '+',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-ocean-900 dark:text-white',
      subtitle: 'Reservations placed online',
    },
    {
      label: 'Aquatic Realms',
      value: stats.totalCategories,
      suffix: ' Zones',
      icon: Layers,
      color: 'from-coral-500 to-rose-500',
      textColor: 'text-ocean-900 dark:text-white',
      subtitle: 'Thrills, waves, & toddlers',
    },
  ];

  return (
    <div className="relative -mt-16 sm:-mt-20 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statItems.map((item, idx) => (
          <Card
            key={idx}
            className="relative overflow-hidden p-5 sm:p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />

            <div className="flex items-center gap-3.5 mb-2">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
                {item.label}
              </p>
            </div>

            <p className={`text-2xl sm:text-4xl font-extrabold font-heading ${item.textColor} tracking-tight`}>
              {loaded ? <CountUp end={item.value} /> : item.value}
              <span className="text-base sm:text-xl font-bold text-aqua-600 dark:text-aqua-400 ml-0.5">
                {item.suffix}
              </span>
            </p>

            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 truncate">
              {item.subtitle}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
