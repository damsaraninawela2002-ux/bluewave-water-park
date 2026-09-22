import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { Ticket, Check, HelpCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SectionHeading from '../../components/SectionHeading';
import { SkeletonCard } from '../../components/Loader';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await ticketService.getAll();
        setTickets(data);
      } catch (err) {
        console.error('Failed to load tickets:', err);
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
        'Admission for 2 Adults & 2 Children',
        'Unlimited access to all 9 park attractions',
        'Complimentary secure digital locker rental',
        'Direct admission with instant digital QR pass',
        'Full day access to wave pool and lazy river',
      ];
    }
    if (lower.includes('child')) {
      return [
        'Full day access for ages 3 to 11',
        'Access to Splash Cove and kids play pools',
        'Complimentary life jacket rental for young swimmers',
        'Zero-depth splash pad and fountain area',
        'Free entrance for children under age 3',
      ];
    }
    return [
      'Full day unlimited access for guests 12+',
      'Access to water slides and tube rides',
      'Wave lagoon and lazy river access',
      'Lounge chairs and shaded relaxation areas',
      'Certified lifeguard coverage at all attractions',
    ];
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-14">
          <SectionHeading
            eyebrow="Admission Passes"
            eyebrowIcon={Ticket}
            lines={['Simple & Transparent', 'Admission Pricing']}
            colors={['text-ocean-900 dark:text-white', 'text-aqua-600 dark:text-aqua-400']}
            subtitle="No booking fees, no surprise taxes at checkout. Choose your pass and reserve your day at BlueWave."
            align="center"
          />
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <SkeletonCard count={3} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {tickets.map((t) => {
              const isFamily = t.name.toLowerCase().includes('family');
              const inclusions = getInclusions(t.name);

              return (
                <Card
                  key={t.id}
                  className={`relative flex flex-col justify-between p-8 sm:p-10 transition-all duration-300 ${
                    isFamily
                      ? 'border-2 border-coral-400 dark:border-coral-500 shadow-soft-lg scale-100 lg:-translate-y-1'
                      : 'border border-slate-200 dark:border-slate-800 shadow-soft'
                  }`}
                >
                  {isFamily && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-coral-500 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm font-heading">
                        Best Value Package
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-ocean-900 dark:text-white font-heading">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[36px]">
                      {t.description}
                    </p>

                    <div className="my-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-extrabold text-ocean-900 dark:text-white font-heading">
                        Rs. {Number(t.price).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold ml-2">
                        {isFamily ? '/ package' : '/ guest'}
                      </span>
                    </div>

                    <div className="space-y-3 pt-2 mb-8">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
                        What's Included:
                      </p>
                      {inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={`/book?ticketId=${t.id}`} className="mt-auto">
                    <Button
                      variant={isFamily ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full justify-center"
                    >
                      Book {t.name}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQs Box */}
        <div className="mt-20 max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-ocean-900 dark:text-white font-heading">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-bold text-ocean-900 dark:text-slate-200 font-heading">Can I cancel my booking?</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">Yes, you can easily cancel any pending reservation directly from your "My Bookings" page with zero penalties.</p>
            </div>
            <div>
              <p className="font-bold text-ocean-900 dark:text-slate-200 font-heading">What if it rains on my visit date?</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">BlueWave offers a weather guarantee! If the park must close due to severe weather for more than 90 minutes, you will receive a complimentary return voucher.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
