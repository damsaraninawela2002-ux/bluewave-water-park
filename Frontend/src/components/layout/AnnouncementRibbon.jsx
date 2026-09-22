import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function AnnouncementRibbon() {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('bluewave_announcement_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('bluewave_announcement_dismissed', 'true');
    } catch (e) {}
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="relative z-30 border-b border-cyan-500/30 bg-gradient-to-r from-[#0a87d6] via-[#0ea5d8] to-[#0e90c7] text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.15)]">
        <div className="mx-auto flex max-w-[1800px] items-center justify-center px-3 py-2 sm:px-5">
          <div className="flex w-full items-center justify-center gap-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white sm:text-sm md:text-[15px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 shadow-inner shadow-white/10">
              <Sparkles className="h-3.5 w-3.5 text-cyan-100 sm:h-4 sm:w-4" />
              <span className="font-extrabold">FAMILY DEAL</span>
            </span>

            <span className="text-white/95">
              Kids under 3 free with a family adult ticket!
            </span>

            <Link
              to="/book"
              className="inline-flex items-center gap-1 font-extrabold text-white transition-opacity hover:opacity-90"
            >
              <span>View Tickets</span>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="ml-3 hidden rounded-full border border-white/20 bg-white/5 px-1.5 py-1 text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            aria-label="Dismiss announcement"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden bg-[#021f36]">
        <svg
          viewBox="0 0 1440 16"
          preserveAspectRatio="none"
          className="block h-3 w-full"
          aria-hidden="true"
        >
          <path
            d="M0 8 C 55 8, 60 2, 115 2 S 175 14, 230 8 S 290 2, 345 8 S 405 14, 460 8 S 520 2, 575 8 S 635 14, 690 8 S 750 2, 805 8 S 865 14, 920 8 S 980 2, 1035 8 S 1095 14, 1150 8 S 1210 2, 1265 8 S 1325 14, 1380 8 S 1435 8, 1440 8"
            fill="none"
            stroke="#1ad1f1"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
