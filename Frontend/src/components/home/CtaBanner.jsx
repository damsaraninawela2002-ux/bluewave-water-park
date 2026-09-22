import React from 'react';
import { Link } from 'react-router-dom';
import Bubbles from '../Bubbles';

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-navy-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-800 text-white shadow-xl p-8 sm:p-12 lg:p-16 border border-ocean-800/80">
          {/* Animated rising water bubbles */}
          <Bubbles count={14} mobileCount={6} />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold text-aqua-300 uppercase tracking-widest font-heading mb-3">
              Plan Your Visit
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Ready for a Refreshing Day on the Water?
            </h2>

            <p className="mt-4 text-base text-ocean-100 max-w-xl mx-auto leading-relaxed">
              Book your passes online to secure your preferred date and skip the ticket counter queues at the entrance.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/book"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-md transition-colors text-center font-heading"
              >
                Book Tickets Now
              </Link>
              <Link
                to="/attractions"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-sm backdrop-blur-xs transition-colors text-center font-heading"
              >
                View Attractions
              </Link>
            </div>

            {/* Highlights row */}
            <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-ocean-100">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-aqua-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant Ticket Confirmation</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-aqua-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>100% Secure Reservation</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-aqua-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast Gate Entry (No Lines)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
