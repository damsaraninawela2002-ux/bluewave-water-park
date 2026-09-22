import React from 'react';
import { Ticket, CalendarCheck, QrCode } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Choose Your Passes',
      desc: 'Select from individual day passes or the all-inclusive family package and pick your visit date.',
      icon: Ticket,
    },
    {
      number: '2',
      title: 'Book Online in Minutes',
      desc: 'Complete your booking with immediate confirmation. No booking fees or hidden gate surcharges.',
      icon: CalendarCheck,
    },
    {
      number: '3',
      title: 'Direct Turnstile Entry',
      desc: 'Show your digital reservation reference at the park entrance and proceed directly into the park.',
      icon: QrCode,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-sand-50 dark:bg-navy-950/40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-ocean-700 dark:text-aqua-400 uppercase tracking-widest font-heading mb-2">
            Easy Online Booking
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Plan your visit in three simple steps before arriving at the park.
          </p>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => (
            <div
              key={s.number}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-soft"
            >
              {/* Numbered Icon Circle */}
              <div className="relative mb-5">
                <div className="w-14 h-14 rounded-2xl bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-400 flex items-center justify-center border border-ocean-100 dark:border-slate-700">
                  <s.icon className="w-6 h-6" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-aqua-500 text-white font-heading font-bold text-xs flex items-center justify-center shadow-xs">
                  {s.number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading mb-2">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
