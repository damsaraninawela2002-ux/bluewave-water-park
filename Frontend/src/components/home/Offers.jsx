import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, Flame, Users, Clock, Gift } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

const OFFERS = [
  {
    id: 'family-special',
    badge: 'BEST VALUE',
    badgeVariant: 'bg-coral-500 text-white',
    title: 'Family Weekend Special',
    subtitle: '2 Adults + 2 Kids All-Day Pass',
    price: 'Rs. 7,000',
    originalPrice: 'Rs. 8,000',
    description:
      'Includes complete park admission, free standard locker rental, and unlimited tube access in all lazy river & surf lagoons.',
    validUntil: 'Valid on Weekends & Holidays',
    highlight: 'Complimentary standard locker rental included',
    icon: Gift,
  },
  {
    id: 'kids-splash-day',
    badge: 'HOT DEAL',
    badgeVariant: 'bg-aqua-500 text-white',
    title: 'Kids Splash Day',
    subtitle: 'Under 3 Enter Free',
    price: 'Rs. 1,500',
    originalPrice: null,
    description:
      'Children under 3 years enjoy 100% free park access with any adult ticket. Unlimited fun in Splash Kingdom and shallow creek pools.',
    validUntil: 'Valid Daily through Season',
    highlight: 'Includes certified safety life jacket rental',
    icon: Sparkles,
  },
  {
    id: 'early-bird',
    badge: 'LIMITED TIME',
    badgeVariant: 'bg-amber-500 text-white',
    title: 'Early Bird Morning Entry',
    subtitle: 'Arrive Before 10:00 AM',
    price: 'From Rs. 2,250',
    originalPrice: 'Rs. 2,500',
    description:
      'Beat the queues and get first access to the high-thrill slides! Check in before 10:00 AM on weekdays to enjoy optimal slide times.',
    validUntil: 'Tuesday to Friday Only',
    highlight: 'Priority entrance & zero slide waiting times',
    icon: Clock,
  },
  {
    id: 'group-advantage',
    badge: 'GROUP PASS',
    badgeVariant: 'bg-purple-600 text-white',
    title: 'Group Booking Advantage',
    subtitle: '15+ Guests Celebration',
    price: 'Custom Rates',
    originalPrice: null,
    description:
      'Special group concession rates, dedicated shaded cabana reservation, and catering coordination for birthday parties & corporate outings.',
    validUntil: 'Advance Reservation Required',
    highlight: 'Private shaded cabana reservation & dedicated host',
    icon: Users,
  },
];

export default function Offers() {
  return (
    <section id="offers" className="py-20 bg-sand-50 dark:bg-navy-950 transition-colors duration-300 scroll-mt-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-100 dark:bg-coral-950/60 border border-coral-200 dark:border-coral-800 text-coral-600 dark:text-coral-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Flame className="w-3.5 h-3.5 text-coral-500" />
            <span>Exclusive Water Park Promotions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Special Deals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-amber-500">Seasonal Offers</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Maximize your splash day value! Take advantage of our limited-time bundles and special passes crafted for families, friends, and early risers.
          </p>
        </div>

        {/* Offers Cards: Horizontal Snap Carousel on Mobile, 4-col on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <div
                key={offer.id}
                className="min-w-[290px] sm:min-w-0 snap-center rounded-3xl bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-slate-700/80 p-6 flex flex-col justify-between shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 relative group"
              >
                {/* Card Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs ${offer.badgeVariant}`}
                  >
                    {offer.badge}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-ocean-50 dark:bg-navy-700 text-ocean-600 dark:text-aqua-400 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-ocean-700 dark:group-hover:text-aqua-300 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs font-semibold text-ocean-600 dark:text-aqua-400">
                    {offer.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px]">
                    {offer.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                      {offer.price}
                    </span>
                    {offer.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {offer.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Highlight pill */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{offer.highlight}</span>
                  </div>

                  {/* Validity */}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{offer.validUntil}</span>
                  </p>
                </div>

                {/* Book Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Link
                    to="/book"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-ocean-50 dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 font-bold text-xs hover:bg-coral-500 hover:text-white dark:hover:bg-coral-500 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span>Claim Offer & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
