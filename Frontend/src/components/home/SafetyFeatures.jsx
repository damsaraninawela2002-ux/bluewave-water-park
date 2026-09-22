import React from 'react';
import { ShieldCheck, Droplets, HeartHandshake, Key, Sparkles } from 'lucide-react';
import Card from '../Card';

export default function SafetyFeatures() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Certified Lifeguards',
      desc: 'Over 40 internationally accredited, CPR-certified water safety professionals on active vigilance at every pool, slide, and lagoon.',
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Droplets,
      title: 'Clean Filtered Water',
      desc: 'Continuous 24/7 dual UV sterilization and advanced multi-stage eco-filtration ensuring crystal-clear, hygienic pool water at all times.',
      color: 'from-aqua-500 to-ocean-600',
      iconBg: 'bg-aqua-50 text-aqua-600',
    },
    {
      icon: HeartHandshake,
      title: 'Family Friendly Facilities',
      desc: 'Private nursing suites, complimentary toddler life vests, shaded poolside cabanas, and child-safe zero-depth splash zones.',
      color: 'from-ocean-600 to-ocean-800',
      iconBg: 'bg-ocean-50 text-ocean-700',
    },
    {
      icon: Key,
      title: 'Lockers & Changing Rooms',
      desc: 'Spacious air-conditioned changing lounges with private rain showers, hair dryers, and contactless RFID digital security lockers.',
      color: 'from-coral-500 to-orange-500',
      iconBg: 'bg-coral-50 text-coral-600',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-sand-50 dark:bg-navy-950/60 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 text-xs font-semibold uppercase tracking-widest font-heading mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Our Commitment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Safety & Comfort First
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Your family’s well-being and relaxation are built into every splash, slide, and service across BlueWave.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card
              key={i}
              className="relative overflow-hidden p-6 bg-white dark:bg-navy-900 border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-card-hover transition-all duration-300 rounded-3xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${f.iconBg} dark:bg-navy-800 dark:text-aqua-300 flex items-center justify-center shadow-xs`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              {/* Bottom Subtle Accent */}
              <div className={`mt-6 h-1 w-10 rounded-full bg-gradient-to-r ${f.color}`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
