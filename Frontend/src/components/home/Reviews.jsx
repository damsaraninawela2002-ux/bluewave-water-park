import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquarePlus, ArrowRight, Quote, ShieldCheck } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import ReviewModal from '../reviews/ReviewModal';
import SectionHeading from '../SectionHeading';

function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch (e) {
    return 'Recently';
  }
}

const AVATAR_GRADIENTS = [
  'from-ocean-500 to-aqua-500',
  'from-coral-500 to-amber-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-ocean-500',
  'from-aqua-500 to-cyan-600',
  'from-purple-500 to-pink-500',
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const loadData = async () => {
    try {
      const [revData, sumData] = await Promise.all([
        reviewService.getReviews(8).catch(() => []),
        reviewService.getReviewSummary().catch(() => null),
      ]);
      setReviews(revData || []);
      setSummary(sumData);
    } catch (err) {
      console.error('Failed to load reviews for Home section:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Smooth switch function for crossfade
  const switchReview = useCallback(
    (nextIdx) => {
      if (prefersReducedMotion) {
        setCurrentIndex(nextIdx);
        return;
      }
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setIsFading(false);
      }, 250);
    },
    [prefersReducedMotion]
  );

  // Auto-rotating timer
  useEffect(() => {
    if (isPaused || prefersReducedMotion || reviews.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      switchReview((currentIndex + 1) % reviews.length);
    }, 5500);

    return () => clearInterval(timerRef.current);
  }, [isPaused, prefersReducedMotion, reviews.length, currentIndex, switchReview]);

  const current = reviews[currentIndex] || null;

  const getInitials = (name) => {
    if (!name) return 'BG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const total = summary?.totalReviews || reviews.length || 0;
  const avg = summary?.averageRating ? Number(summary.averageRating).toFixed(1) : '4.8';
  const starCounts = summary?.starCounts || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
  const starLevels = [5, 4, 3, 2, 1];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-navy-950/70 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-14">
          <SectionHeading
            eyebrow="Guest Feedback"
            lines={['What Our', 'Visitors Say']}
            colors={['text-ocean-900 dark:text-white', 'text-aqua-600 dark:text-aqua-400']}
            subtitle="Authentic reviews submitted by guests with verified ticket reservations."
            align="center"
          />
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            <div className="lg:col-span-5 h-80 bg-slate-200 dark:bg-navy-800 animate-pulse rounded-3xl" />
            <div className="lg:col-span-7 h-80 bg-slate-200 dark:bg-navy-800 animate-pulse rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Left Column: Soft Aqua Rating Summary Card & Action Pair */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-aqua-50/60 dark:bg-navy-900/80 border border-aqua-100/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
              <div>
                {/* Score & Stars */}
                <div className="flex items-baseline justify-between gap-4 pb-5 border-b border-aqua-100 dark:border-slate-800">
                  <div>
                    <span className="text-5xl sm:text-6xl font-black text-ocean-950 dark:text-white font-heading tracking-tight">
                      {avg}
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">
                      / 5.0
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(Number(avg))
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                      {total} verified {total === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>

                {/* Slim Star Bars */}
                <div className="space-y-2 pt-5">
                  {starLevels.map((stars) => {
                    const count = starCounts[String(stars)] || 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 w-10 flex-shrink-0 font-heading text-slate-700 dark:text-slate-300 font-semibold">
                          <span>{stars}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>

                        {/* Bar Track */}
                        <div className="flex-1 h-1.5 rounded-full bg-white dark:bg-navy-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 dark:bg-amber-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {/* Count */}
                        <span className="w-10 text-right font-mono text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons Pair */}
              <div className="mt-8 pt-6 border-t border-aqua-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs sm:text-sm font-heading shadow-sm transition"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
                <Link
                  to="/reviews"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm font-heading shadow-xs transition"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Auto-Rotating Single Review Spotlight Card */}
            <div
              className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-soft relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Watermark Quote Icon */}
              <div className="absolute top-6 right-8 text-slate-100 dark:text-slate-800/60 pointer-events-none select-none">
                <Quote className="w-16 h-16 opacity-75" />
              </div>

              {reviews.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No verified reviews yet. Be the first to share your experience!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-700 text-white text-xs font-bold font-heading"
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                <>
                  {/* Spotlight Review Content with Crossfade */}
                  <div
                    className={`transition-opacity duration-300 ease-in-out ${
                      isFading ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (current?.rating || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-heading">
                        {current?.rating}.0 / 5.0
                      </span>
                    </div>

                    {/* Review Quote in Larger Serif / Italic Style */}
                    <blockquote className="font-serif italic text-lg sm:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed font-normal min-h-[6.5rem]">
                      "{current?.comment}"
                    </blockquote>
                  </div>

                  {/* Author Row & Dot Navigation */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Author Details */}
                    <div
                      className={`flex items-center gap-3.5 transition-opacity duration-300 ${
                        isFading ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-tr ${
                          AVATAR_GRADIENTS[currentIndex % AVATAR_GRADIENTS.length]
                        } flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0`}
                      >
                        {getInitials(current?.userName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-heading">
                          {current?.userName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Verified Guest
                          </span>
                          <span>•</span>
                          <span>{formatRelativeDate(current?.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-1.5 sm:self-center" aria-label="Review pagination">
                      {reviews.map((r, idx) => (
                        <button
                          key={r.id || idx}
                          type="button"
                          onClick={() => switchReview(idx)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            idx === currentIndex
                              ? 'w-6 h-2 bg-ocean-600 dark:bg-aqua-500'
                              : 'w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-400'
                          }`}
                          aria-label={`Go to review ${idx + 1}`}
                          aria-current={idx === currentIndex ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={loadData}
      />
    </section>
  );
}
