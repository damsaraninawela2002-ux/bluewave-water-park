import React, { useEffect, useState } from 'react';
import {
  Star,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  MessageSquareQuote,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState('all');

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
      console.error('Failed to load admin reviews:', err);
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewService.deleteReview(deleteTarget.id);
      toast.success('Review deleted successfully.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesStar = starFilter === 'all' || String(r.rating) === starFilter;
    return matchesSearch && matchesStar;
  });

  if (loading) {
    return <FullPageLoader text="Loading customer reviews..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-300 border border-ocean-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
            <MessageSquareQuote className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Moderation & Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor and moderate real reviews submitted by verified guests with confirmed bookings.
          </p>
        </div>

        {summary && (
          <div className="flex items-center gap-3 bg-white dark:bg-navy-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-lg font-heading">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{summary.averageRating.toFixed(1)}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-heading">
              {summary.totalReviews} Total Reviews
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-navy-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-soft">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or review comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-navy-850 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-400 font-heading uppercase mr-1">Rating:</span>
          {['all', '5', '4', '3', '2', '1'].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-heading whitespace-nowrap transition ${
                starFilter === star
                  ? 'bg-ocean-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {star === 'all' ? 'All' : `${star} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table Card */}
      <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            No customer reviews found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Guest</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Comment</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
                {filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ocean-900 dark:text-white font-heading">
                          {rev.userName}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" title="Verified Guest" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 font-bold font-mono">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(rev)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <p>
              Are you sure you want to remove the review by{' '}
              <strong>{deleteTarget?.userName}</strong>? This action will adjust the park's aggregate average rating.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 text-xs italic text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
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
