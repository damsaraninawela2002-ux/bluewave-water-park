import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  ArrowRight,
  Check,
  X,
  User,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Card from '../../Card';
import Badge from '../../Badge';
import Modal from '../../Modal';
import { bookingService } from '../../../services/bookingService';
import { siteConfig } from '../../../config/siteConfig';
import toast from 'react-hot-toast';

export default function RecentBookingsCard({ recentBookings = [], onStatusUpdated }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    booking: null,
    targetStatus: null, // 'confirmed' | 'cancelled'
  });
  const [processing, setProcessing] = useState(false);

  const openActionModal = (booking, targetStatus) => {
    setModalState({
      isOpen: true,
      booking,
      targetStatus,
    });
  };

  const closeModal = () => {
    if (processing) return;
    setModalState({ isOpen: false, booking: null, targetStatus: null });
  };

  const handleConfirmAction = async () => {
    if (!modalState.booking || !modalState.targetStatus) return;
    setProcessing(true);
    const { booking, targetStatus } = modalState;

    try {
      await bookingService.updateBookingStatus(booking.id, targetStatus);
      toast.success(
        `Booking for ${booking.customerName || 'Guest'} has been ${targetStatus}.`
      );
      closeModal();
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to update booking status. Please try again.';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        {/* Card Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-ocean-50 dark:bg-ocean-950/80 text-ocean-600 dark:text-aqua-400">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
                Recent Guest Bookings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Latest visitor transactions with rapid status resolution
              </p>
            </div>
          </div>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-ocean-700 dark:text-aqua-400 hover:text-ocean-900 dark:hover:text-aqua-300 font-heading"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Content */}
        {recentBookings.length === 0 ? (
          <div className="py-14 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            No guest bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 sm:px-6 py-3.5">Customer</th>
                  <th className="px-5 sm:px-6 py-3.5">Ticket Package</th>
                  <th className="px-5 sm:px-6 py-3.5">Visit Date</th>
                  <th className="px-5 sm:px-6 py-3.5">Quantity</th>
                  <th className="px-5 sm:px-6 py-3.5">Total Amount</th>
                  <th className="px-5 sm:px-6 py-3.5">Status</th>
                  <th className="px-5 sm:px-6 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
                {recentBookings.map((b) => {
                  const bStatus = b.bookingStatus || b.status || 'pending';
                  const isPending = bStatus.toLowerCase() === 'pending';
                  const bTicketType = b.ticketType || b.ticketName || 'General Admission';
                  const bTotal = b.totalPrice ?? b.totalAmount ?? 0;

                  return (
                    <tr
                      key={b.id || b._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-navy-700/50 transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-ocean-50 dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {(b.customerName || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-ocean-900 dark:text-white font-heading block truncate">
                              {b.customerName || 'Guest'}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">
                              {b.customerEmail || 'No email provided'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 sm:px-6 py-4 text-slate-700 dark:text-slate-200 font-medium">
                        {bTicketType}
                      </td>

                      <td className="px-5 sm:px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        {b.visitDate}
                      </td>

                      <td className="px-5 sm:px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-700 text-xs font-semibold">
                          {b.quantity} pass{b.quantity > 1 ? 'es' : ''}
                        </span>
                      </td>

                      <td className="px-5 sm:px-6 py-4 font-bold text-ocean-950 dark:text-white font-heading">
                        {siteConfig.currency} {Number(bTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-5 sm:px-6 py-4">
                        <Badge variant={bStatus}>{bStatus}</Badge>
                      </td>

                      <td className="px-5 sm:px-6 py-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => openActionModal(b, 'confirmed')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200/80 dark:border-emerald-800 transition-all cursor-pointer font-heading"
                              title="Confirm reservation"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                            <button
                              onClick={() => openActionModal(b, 'cancelled')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200/80 dark:border-rose-800 transition-all cursor-pointer font-heading"
                              title="Cancel reservation"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.targetStatus === 'confirmed'
            ? 'Confirm Guest Reservation'
            : 'Cancel Guest Reservation'
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-slate-700">
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                modalState.targetStatus === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {modalState.targetStatus === 'confirmed' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-ocean-950 dark:text-white mb-1">
                {modalState.targetStatus === 'confirmed'
                  ? 'Are you sure you want to approve this reservation?'
                  : 'Are you sure you want to cancel this reservation?'}
              </p>
              <p>
                Guest: <strong className="text-ocean-900 dark:text-white">{modalState.booking?.customerName}</strong>
              </p>
              <p>
                Pass: {modalState.booking?.ticketType || modalState.booking?.ticketName} ({modalState.booking?.quantity} passes)
              </p>
              <p>
                Visit Date: <strong className="font-mono">{modalState.booking?.visitDate}</strong>
              </p>
              <p>
                Total: <strong className="text-ocean-900 dark:text-white">{siteConfig.currency} {Number(modalState.booking?.totalPrice ?? modalState.booking?.totalAmount ?? 0).toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={closeModal}
              disabled={processing}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-600 transition-colors font-heading cursor-pointer disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={processing}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all font-heading shadow-md cursor-pointer disabled:opacity-50 ${
                modalState.targetStatus === 'confirmed'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {modalState.targetStatus === 'confirmed' ? 'Yes, Confirm Pass' : 'Yes, Cancel Pass'}
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
