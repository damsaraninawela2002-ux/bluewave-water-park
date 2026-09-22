import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageSquarePlus,
  Trash2,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import SectionHeading from '../../components/SectionHeading';
import RatingBreakdown from '../../components/reviews/RatingBreakdown';
import ReviewModal from '../../components/reviews/ReviewModal';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

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
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters & Sorting
  const [selectedStar, setSelectedStar] = useState(null); // '5' | '4' | etc. or null
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest'
  const [visibleCount, setVisibleCount] = useState(6);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [revData, sumData] = await Promise.all([
        reviewService.getReviews(),
        reviewService.getReviewSummary(),
      ]);
      setReviews(revData || []);
      setSummary(sumData);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and Sort logic
  const filteredReviews = reviews
    .filter((r) => {
      if (!selectedStar) return true;
      return String(r.rating) === String(selectedStar);
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      // Default: newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewService.deleteReview(deleteTarget.id);
      toast.success('Review deleted.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'BG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative bg-ocean-900 text-white pt-12 pb-20 border-b border-ocean-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-ocean-200/80 mb-6 font-heading">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-aqua-400" />
            <span className="text-aqua-300 font-semibold">Guest Reviews</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="Verified Visitors"
                eyebrowIcon={ShieldCheck}
                lines={['What Our', 'Visitors Say']}
                colors={['text-white', 'text-aqua-300']}
                align="left"
                subtitle="Feedback and ratings from guests who booked their visit to BlueWave Water Park."
                waveColor="text-aqua-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm font-heading shadow-sm transition"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        {/* Top Summary Card */}
        <div className="mb-10">
          <RatingBreakdown
            summary={summary}
            activeFilter={selectedStar}
            onSelectFilter={setSelectedStar}
          />
        </div>

        {/* Filter Tabs & Sort Controls */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedStar(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading transition ${
                selectedStar === null
                  ? 'bg-ocean-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => {
              const count = summary?.starCounts?.[String(s)] || 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStar(selectedStar === String(s) ? null : String(s))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-heading flex items-center gap-1 transition ${
                    selectedStar === String(s)
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{s}</span>
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-200 dark:bg-navy-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              No reviews found matching the selected star filter.
            </p>
            <button
              type="button"
              onClick={() => setSelectedStar(null)}
              className="mt-4 px-4 py-2 rounded-xl bg-ocean-600 text-white text-xs font-bold font-heading"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedReviews.map((rev, idx) => {
                const isAuthor = isAuthenticated && user && String(user.id) === String(rev.userId);
                const canDelete = isAuthor || isAdmin;

                return (
                  <div
                    key={rev.id || idx}
                    className="relative bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800/90 shadow-soft flex flex-col justify-between hover:shadow-card-hover transition-all"
                  >
                    <div>
                      {/* Top Row: Stars + Verified Badge + Delete Button */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= rev.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                              }`}
                            />
                          ))}
                          <span className="ml-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                            {rev.rating}.0
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Visit</span>
                          </span>

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(rev)}
                              title={isAdmin ? 'Delete Review (Admin)' : 'Delete My Review'}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${
                            AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                          } flex items-center justify-center text-white font-bold text-xs shadow-xs`}
                        >
                          {getInitials(rev.userName)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-heading">
                            {rev.userName}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {formatRelativeDate(rev.createdAt)}
                          </p>
                        </div>
                      </div>

                      {isAuthor && (
                        <span className="text-[10px] font-semibold text-ocean-600 dark:text-aqua-400 px-2 py-0.5 rounded-md bg-ocean-50 dark:bg-navy-800">
                          Your Review
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredReviews.length && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm font-heading hover:bg-slate-50 dark:hover:bg-navy-800 transition shadow-xs"
                >
                  Load More Reviews ({filteredReviews.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={loadData}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this review by{' '}
            <strong className="text-slate-900 dark:text-white">{deleteTarget?.userName}</strong>? This action cannot be undone.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800 text-xs italic text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
            "{deleteTarget?.comment}"
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
