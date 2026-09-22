import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, X, AlertCircle, CheckCircle2, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

export default function ReviewModal({ isOpen, onClose, onReviewSubmitted }) {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const RATING_LABELS = {
    1: 'Poor - Not satisfied',
    2: 'Fair - Needs improvement',
    3: 'Good - Had fun',
    4: 'Very Good - Thoroughly enjoyed',
    5: 'Exceptional - Outstanding splash day!',
  };

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      setErrorMessage('Your review comment must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await reviewService.createReview({
        rating,
        comment: comment.trim(),
      });
      toast.success('Thank you! Your verified review has been published.');
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
      const detail = err.response?.data?.detail;
      if (detail) {
        setErrorMessage(detail);
      } else if (err.response?.status === 409) {
        setErrorMessage('You have already submitted a review. Each guest can leave one review.');
      } else if (err.response?.status === 400) {
        setErrorMessage('Only visitors with at least one confirmed booking can review.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ocean-950/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 z-10 transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aqua-50 dark:bg-aqua-950/60 text-ocean-700 dark:text-aqua-300 border border-aqua-200/80 dark:border-aqua-800/40 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
            <ShieldCheck className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Verified Guest Review</span>
          </div>
          <h3 className="text-2xl font-extrabold text-ocean-950 dark:text-white font-heading">
            Share Your Experience
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Help other families and thrill seekers plan their ideal splash visit to BlueWave.
          </p>
        </div>

        {/* Not Authenticated Guard */}
        {!isAuthenticated ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-ocean-50 dark:bg-navy-800 text-ocean-600 dark:text-aqua-400 mx-auto flex items-center justify-center">
              <LogIn className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-ocean-900 dark:text-white font-heading">
              Please Sign In to Review
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Reviews are exclusively reserved for verified BlueWave guests with confirmed ticket bookings.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-heading font-semibold text-sm shadow-md transition"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Callout */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
                <div className="leading-relaxed">
                  <p className="font-bold">Cannot Post Review</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-aqua-400 transition-transform hover:scale-110 active:scale-95"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= activeRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-ocean-700 dark:text-aqua-300 mt-2 font-heading">
                {RATING_LABELS[activeRating]}
              </p>
            </div>

            {/* Comment Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
                  Your Review Comment
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    comment.length > 480
                      ? 'text-rose-500'
                      : comment.length >= 10
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {comment.length} / 500 chars (min 10)
                </span>
              </div>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                placeholder="What slides did you enjoy most? How was the water hygiene, wave pool, and amenities? Share your tips with future splashers!"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/80 p-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 dark:focus:ring-aqua-400 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 text-xs sm:text-sm font-semibold font-heading transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || comment.trim().length < 10}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-ocean-600 to-aqua-600 hover:from-ocean-700 hover:to-aqua-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold font-heading shadow-md transition flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
