import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Users, ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';

export default function QuickBooking() {
  return (
    <div className="w-full max-w-[1500px] mx-auto mt-10 sm:mt-14 relative z-20 px-2 sm:px-4">
      <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-3 md:gap-5">
        <div className="relative flex-1 min-h-[150px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b1f34]/90 shadow-[0_18px_55px_rgba(3,9,20,0.5)] backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#ff4d6d] via-[#ff4d6d] to-[#1ad0d3]" />
          <div className="absolute left-[-34px] bottom-[-26px] h-24 w-24 rounded-full bg-[#1ec7de]/20 blur-md" />
          <div className="absolute right-10 top-14 h-8 w-8 rounded-full bg-white/10 blur-[2px]" />
          <div className="absolute right-14 bottom-8 h-10 w-10 rounded-full bg-[#2dd4bf]/20 blur-md" />

          <div className="relative flex h-full items-center justify-between gap-5 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-aqua-200 shadow-inner shadow-white/10">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-300/80">Instant Entry</p>
                <p className="mt-1 text-lg font-extrabold text-white">BlueWave Pass</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-100">
              <Sparkles className="h-3.5 w-3.5 text-aqua-300" />
              Fast track
            </div>
          </div>
        </div>

        <Link
          to="/book"
          className="group relative flex min-h-[150px] flex-1 items-center justify-center overflow-hidden rounded-[26px] border border-[#7de6d7]/30 bg-gradient-to-r from-[#13c5be] via-[#14cdb7] to-[#12aeb6] shadow-[0_20px_45px_rgba(18,180,168,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_30%)]" />
          <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm">
            <Users className="h-5 w-5" />
          </div>
          <div className="relative flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className="text-lg font-black uppercase tracking-[0.12em] text-white sm:text-xl">
              Happy Bookings
            </span>
          </div>
          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </Link>

        <div className="relative flex-1 min-h-[150px] overflow-hidden rounded-[26px] border border-[#ffb4bf]/30 bg-gradient-to-r from-[#ff5f6d] via-[#ff4f63] to-[#ff3d5d] shadow-[0_18px_45px_rgba(255,71,97,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.24),transparent_25%)]" />
          <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90">
            <Ticket className="h-4 w-4" />
          </div>
          <div className="absolute right-8 top-10 h-12 w-12 rounded-full border border-white/15 bg-white/10" />
          <div className="absolute right-12 bottom-8 h-6 w-6 rounded-full border border-white/15 bg-white/10" />

          <div className="relative flex h-full items-center justify-end px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3 text-white/95">
              <div className="h-10 w-10 rounded-full border border-white/15 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Limited</span>
                <span className="text-base font-extrabold">Deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
