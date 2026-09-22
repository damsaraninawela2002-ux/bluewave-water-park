import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    id: 'faq-1',
    question: 'What are the park\'s opening hours and best arrival times?',
    answer:
      'BlueWave is open Tuesday through Sunday. Weekday hours (Tue–Fri) are 9:30 AM to 6:00 PM, and weekends & public holidays are 9:00 AM to 7:30 PM (Park remains closed on Mondays for regular maintenance). We recommend arriving 30 minutes before opening to secure preferred locker locations and enjoy the slides with minimal wait times.',
  },
  {
    id: 'faq-2',
    question: 'What is included with different ticket types?',
    answer:
      'Our General Day Pass includes full-day park admission and unlimited access to all water slides, wave pools, and lazy river tubes. The Kids Splash Pass is tailored for children under 120cm with full access to the Splash Kingdom and toddler lagoons. The Family Value Pass covers 2 adults and 2 children with complimentary standard locker rental included.',
  },
  {
    id: 'faq-3',
    question: 'Are there height, weight, or age restrictions for thrill slides?',
    answer:
      'Yes, safety is our utmost priority. High-thrill extreme slides like the Kamikaze and Tornado Bowl require a minimum height of 120cm (approx 4ft) and a maximum individual rider weight limit of 120kg. Family tube slides and lazy rivers have no minimum height when accompanied by an adult, and life jackets are provided free of charge.',
  },
  {
    id: 'faq-4',
    question: 'What swimwear is permitted, and what should I bring?',
    answer:
      'Proper synthetic swimwear (polyester, nylon, or lycra) is mandatory on all rides for hygiene and slide safety. Denim, cotton shirts with metal zippers, and loose jewelry are prohibited. We recommend bringing waterproof sunscreen, your own pool towel, flip-flops, and a waterproof phone pouch. Secure digital lockers are available for rent on site.',
  },
  {
    id: 'faq-5',
    question: 'Can I cancel or reschedule my ticket booking?',
    answer:
      'Yes! If your booking status is "Pending" or if you need to reschedule before your visit date, you can cancel or update your booking directly from your "My Bookings" page. For approved bookings, rescheduling to another open date is supported free of charge up to 24 hours prior to your booked arrival time.',
  },
  {
    id: 'faq-6',
    question: 'Do you offer group discounts, birthday parties, or private events?',
    answer:
      'BlueWave welcomes school excursions, birthday celebrations, and corporate team outings of 15 guests or more! Special group rates, dedicated shaded cabanas, and catered meal packages are available upon request. Please reach out to our team at damsaraninawela2002@gmail.com or call our hotline (+94 11 234 5678) to coordinate group bookings.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white dark:bg-navy-900 transition-colors duration-300 relative scroll-mt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-ocean-700 dark:text-aqua-400 uppercase tracking-widest font-heading mb-2">
            Help & Information
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about tickets, ride restrictions, and park policies.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-ocean-300 dark:border-aqua-500/50 bg-ocean-50/40 dark:bg-navy-800 shadow-sm shadow-ocean-100 dark:shadow-none'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-navy-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 rounded-2xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-header-${idx}`}
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg font-heading">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-ocean-600 dark:bg-aqua-500 text-white dark:text-navy-950 rotate-180'
                        : 'bg-slate-100 dark:bg-navy-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-header-${idx}`}
                    className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100/60 dark:border-slate-700/60"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Card */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-aqua-50/40 dark:from-navy-800 dark:to-navy-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-ocean-100 dark:bg-aqua-950 text-ocean-700 dark:text-aqua-400 flex items-center justify-center shrink-0 text-xl">
              💬
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Still have questions?</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Contact our park concierge for custom inquiries or special needs.</p>
            </div>
          </div>
          <a
            href="mailto:damsaraninawela2002@gmail.com"
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-navy-700 border border-slate-200 dark:border-slate-600 text-ocean-700 dark:text-aqua-300 font-semibold text-sm hover:bg-ocean-50 dark:hover:bg-navy-600 transition shrink-0 shadow-sm"
          >
            Email Concierge
          </a>
        </div>
      </div>
    </section>
  );
}
