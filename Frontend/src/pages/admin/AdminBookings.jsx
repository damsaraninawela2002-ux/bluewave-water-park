import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { Check, X, CalendarCheck, Search, AlertCircle, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

import { siteConfig } from '../../config/siteConfig';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    booking: null,
    targetStatus: null, // 'confirmed' or 'cancelled'
    loading: false,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load guest bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openStatusModal = (booking, targetStatus) => {
    setConfirmModal({
      isOpen: true,
      booking,
      targetStatus,
      loading: false,
    });
  };

  const closeStatusModal = () => {
    setConfirmModal({
      isOpen: false,
      booking: null,
      targetStatus: null,
      loading: false,
    });
  };

  const executeStatusChange = async () => {
    const { booking, targetStatus } = confirmModal;
    if (!booking || !targetStatus) return;

    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      await bookingService.updateBookingStatus(booking.id, targetStatus);
      toast.success(
        targetStatus === 'confirmed'
          ? `Booking #${booking.id.slice(0, 8)} confirmed successfully!`
          : `Booking #${booking.id.slice(0, 8)} cancelled.`
      );
      closeStatusModal();
      await fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update booking status';
      toast.error(msg);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const filtered = bookings.filter((b) => {
    const bStatus = (b.bookingStatus || b.status || '').toLowerCase();
    const matchesStatus = statusFilter === 'all' || bStatus === statusFilter.toLowerCase();
    const searchLower = searchTerm.trim().toLowerCase();
    const ticketTypeStr = (b.ticketType || b.ticketName || '').toLowerCase();
    const idStr = (b.bookingId || b.id || '').toLowerCase();
    const matchesSearch =
      !searchLower ||
      (b.userName && b.userName.toLowerCase().includes(searchLower)) ||
      (b.userEmail && b.userEmail.toLowerCase().includes(searchLower)) ||
      ticketTypeStr.includes(searchLower) ||
      idStr.includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts for badges
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => (b.bookingStatus || b.status) === 'pending').length,
    confirmed: bookings.filter((b) => (b.bookingStatus || b.status) === 'confirmed').length,
    cancelled: bookings.filter((b) => (b.bookingStatus || b.status) === 'cancelled').length,
  };

  if (loading) {
    return <FullPageLoader text="Loading all guest reservations..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-950 text-ocean-800 dark:text-aqua-300 border border-ocean-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
            <CalendarCheck className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Reservations Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Manage Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review incoming guest passes, confirm reservations, or process cancellations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-heading transition-all whitespace-nowrap ${
                statusFilter === st.key
                  ? 'bg-ocean-800 dark:bg-aqua-600 text-white dark:text-navy-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-600'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  statusFilter === st.key
                    ? 'bg-ocean-900 dark:bg-aqua-700 text-aqua-300 dark:text-white'
                    : 'bg-white dark:bg-navy-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {counts[st.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-aqua-400 transition-all font-sans"
          />
        </div>
      </div>

      {/* Bookings Data Table */}
      <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/70 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Ticket Type</th>
                <th className="px-6 py-4">Visit Date</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Total Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    No bookings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const bStatus = b.bookingStatus || b.status || 'pending';
                  const bTicketType = b.ticketType || b.ticketName || 'Park Admission';
                  const bTotal = b.totalPrice ?? b.totalAmount ?? 0;
                  const bId = b.bookingId || b.id || '';

                  return (
                    <tr key={b.id || b._id} className="hover:bg-slate-50/50 dark:hover:bg-navy-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-ocean-950 dark:text-white font-heading block">
                          {b.userName || 'Guest User'}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{b.userEmail}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          ID: {bId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                        {bTicketType}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        {b.visitDate}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        {b.quantity}
                      </td>
                      <td className="px-6 py-4 font-bold text-ocean-950 dark:text-white font-heading">
                        {siteConfig.currency} {Number(bTotal).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={bStatus}>{bStatus}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {/* If pending: Confirm button AND Cancel button */}
                        {bStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => openStatusModal(b, 'confirmed')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-heading text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
                              title="Confirm Booking"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                            <button
                              onClick={() => openStatusModal(b, 'cancelled')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-heading text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
                              title="Cancel Booking"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {/* If confirmed: Cancel button */}
                        {bStatus === 'confirmed' && (
                          <button
                            onClick={() => openStatusModal(b, 'cancelled')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-heading text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
                            title="Cancel Booking"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* If cancelled: no action buttons */}
                        {bStatus === 'cancelled' && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-2">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal for Confirm / Cancel Actions */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeStatusModal}
        title={confirmModal.targetStatus === 'confirmed' ? 'Confirm Guest Booking' : 'Cancel Reservation'}
      >
        <div className="space-y-4">
          {confirmModal.targetStatus === 'confirmed' ? (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold font-heading">Confirm Admission Pass</p>
                <p className="text-emerald-800 dark:text-emerald-300 mt-1">
                  Confirm reservation for{' '}
                  <span className="font-bold text-emerald-950 dark:text-white">
                    {confirmModal.booking?.userName || 'the guest'}
                  </span>{' '}
                  ({confirmModal.booking?.ticketType || confirmModal.booking?.ticketName}, {confirmModal.booking?.quantity} pass(es) on{' '}
                  {confirmModal.booking?.visitDate})?
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold font-heading">Cancel Guest Reservation</p>
                <p className="text-rose-800 dark:text-rose-300 mt-1">
                  Are you sure you want to cancel the booking for{' '}
                  <span className="font-bold text-rose-950 dark:text-white">
                    {confirmModal.booking?.userName || 'the guest'}
                  </span>
                  ? This will invalidate their admission pass for{' '}
                  {confirmModal.booking?.visitDate}.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button variant="ghost" size="sm" onClick={closeStatusModal}>
              Dismiss
            </Button>
            {confirmModal.targetStatus === 'confirmed' ? (
              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={executeStatusChange}
                isLoading={confirmModal.loading}
              >
                Yes, Confirm Booking
              </Button>
            ) : (
              <Button
                variant="danger"
                size="md"
                onClick={executeStatusChange}
                isLoading={confirmModal.loading}
              >
                Yes, Cancel Reservation
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
