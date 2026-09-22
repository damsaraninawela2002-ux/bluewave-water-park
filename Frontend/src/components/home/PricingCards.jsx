import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { Check, Ticket, Sparkles, ArrowRight, Star } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { SkeletonCard } from '../Loader';

export default function PricingCards() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await ticketService.getAll();
        setTickets(data);
      } catch (err) {
        console.error('Failed to load tickets for pricing section:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const getInclusions = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('family')) {
      return [
        'Covers 2 Adults and 2 Children (Ages 3+)',
        'Full-day unlimited access to all 9 attractions',
        'Complimentary family locker access for the day',
        'Priority entrance lane & sun lounger access',
        'Free life vest rental for children',
      ];
    }
    if (lower.includes('child')) {
      return [
        'Full-day access for ages 3 to 12',
        'Unlimited access to Kids Splash Kingdom & Lagoon',
        'Gentle animal slides & shallow wave beach',
        'Complimentary child safety life jacket',
        'Direct supervision lifeguard zones',
      ];
    }
    // Default Adult
    return [
      'Full-day unlimited access for ages 13 and above',
      'All high-thrill vertical & vortex waterslides',
      'Continuous 4-foot rolling ocean wave arena',
      'Lazy River Loop single & double tubes included',
      'Heated pool showers & changing lounge access',
    ];
  };

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-navy-950 border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-ocean-700 dark:text-aqua-400 uppercase tracking-widest font-heading mb-2">
            Admission Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Transparent Day Passes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            All tickets include unlimited same-day ride access with no booking fees or hidden charges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tickets.map((t) => {
              const isBestValue = t.name.toLowerCase().includes('family');
              const inclusions = getInclusions(t.name);

              return (
                <div
                  key={t.id}
                  className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                    isBestValue
                      ? 'bg-ocean-900 dark:bg-navy-900 text-white shadow-xl md:-translate-y-2 border-2 border-aqua-400'
                      : 'bg-sand-50/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800 text-ocean-950 dark:text-white hover:border-ocean-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Package Badge */}
                  {isBestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-coral-500 text-white text-[11px] font-bold font-heading shadow-xs uppercase tracking-wider">
                      Family Package
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <h3
                        className={`text-xl sm:text-2xl font-extrabold font-heading ${
                          isBestValue ? 'text-white' : 'text-ocean-950 dark:text-white'
                        }`}
                      >
                        {t.name}
                      </h3>
                      <p
                        className={`text-xs mt-1.5 leading-relaxed ${
                          isBestValue ? 'text-ocean-200' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {t.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-slate-200/40 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-bold opacity-75">Rs.</span>
                        <span
                          className={`text-4xl sm:text-5xl font-extrabold font-heading tracking-tight ${
                            isBestValue ? 'text-aqua-300' : 'text-ocean-900 dark:text-white'
                          }`}
                        >
                          {t.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold opacity-60 ml-1">/ day</span>
                      </div>
                    </div>

                    {/* Checklist */}
                    <ul className="space-y-3 mb-8">
                      {inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isBestValue
                                ? 'bg-aqua-400/20 text-aqua-300'
                                : 'bg-ocean-100 dark:bg-navy-800 text-ocean-700 dark:text-aqua-300'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span
                            className={isBestValue ? 'text-ocean-100 leading-snug' : 'text-slate-700 dark:text-slate-300 leading-snug'}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <div>
                    <Link to={`/book?ticketId=${t.id}`} className="block">
                      <Button
                        variant={isBestValue ? 'primary' : 'outline'}
                        size="md"
                        icon={ArrowRight}
                        className={`w-full justify-center font-bold text-xs sm:text-sm ${
                          isBestValue
                            ? 'shadow-coral py-3.5'
                            : 'border-slate-300 dark:border-slate-700 text-ocean-800 dark:text-aqua-300 hover:bg-ocean-50 dark:hover:bg-navy-800'
                        }`}
                      >
                        Book {t.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
