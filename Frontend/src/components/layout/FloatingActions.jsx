import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Back To Top Button (Appears after 400px scroll) */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`w-11 h-11 rounded-full bg-white dark:bg-navy-800 text-ocean-700 dark:text-aqua-400 border border-slate-200 dark:border-slate-700/80 shadow-lg shadow-ocean-950/15 flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:bg-ocean-50 dark:hover:bg-navy-700 hover:-translate-y-1 ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll back to top"
        title="Scroll back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* WhatsApp Chat Floating Action Button */}
      <a
        href={siteConfig.getWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/35 flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:scale-105"
        aria-label="Chat with Us on WhatsApp"
      >
        <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-xs" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.245-.587-.494-.507-.677-.517-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.911 1.23 3.112.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.086 1.78-.727 2.031-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.516 2 2.025 6.49 2.025 12.013c0 1.84.498 3.567 1.365 5.053L2 22l5.068-1.33c1.44.787 3.08 1.237 4.825 1.237 5.524 0 10.015-4.49 10.015-10.014C21.908 6.49 17.417 2 12.04 2zm0 18.243c-1.579 0-3.056-.424-4.333-1.164l-.311-.18-3.218.844.859-3.136-.198-.316a8.212 8.212 0 01-1.26-4.278c0-4.55 3.702-8.252 8.25-8.252 4.549 0 8.25 3.702 8.25 8.252 0 4.55-3.701 8.249-8.25 8.249z" />
        </svg>

        {/* Motion-safe subtle pulse ring */}
        <span className="motion-safe:animate-ping absolute -inset-1 rounded-full bg-[#25D366]/40 pointer-events-none" />

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md">
          Chat with Us
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90" />
        </span>
      </a>
    </div>
  );
}
