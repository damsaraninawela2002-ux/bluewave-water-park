import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import {
  CalendarCheck,
  Ticket,
  Calendar,
  Receipt,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load your reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      toast.success('Reservation has been cancelled');
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
      // Reload bookings
      await fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to cancel reservation';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Retrieving your bookings..." />;
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-12 sm:py-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-300 border border-ocean-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Guest Reservations</span>
            </div>
            <h1 className="text-3xl font-extrabold text-ocean-900 dark:text-white font-heading">
              My Park Bookings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review, track, and manage your upcoming BlueWave visit dates.
            </p>
          </div>

          <Link to="/book">
            <Button variant="primary" size="md" icon={Ticket} className="shadow-coral">
              Book Another Pass
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <Card className="text-center py-20 px-8 border-slate-100 dark:border-slate-800 shadow-soft max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-ocean-50 dark:bg-navy-800 text-ocean-600 dark:text-aqua-400 flex items-center justify-center mx-auto mb-5">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-ocean-900 dark:text-white font-heading mb-2">
              No Bookings Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
              You haven't booked any park passes yet. Select your preferred date and dive into the fun!
            </p>
            <Link to="/book">
              <Button variant="primary" size="lg" icon={ArrowRight} className="shadow-coral">
                Book Your First Ticket
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const bStatus = booking.bookingStatus || booking.status || 'pending';
              const isPending = bStatus === 'pending';
              const bTicketType = booking.ticketType || booking.ticketName || 'Park Admission Ticket';
              const bTotal = Number(booking.totalPrice ?? booking.totalAmount ?? 0);
              const bPricePerTicket = booking.pricePerTicket ? Number(booking.pricePerTicket) : null;
              const bId = booking.bookingId || booking.id;

              return (
                <Card
                  key={booking.id || booking._id}
                  className="p-6 border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-soft-lg transition-all"
                >
                  {/* Left Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-ocean-900 dark:text-white font-heading">
                        {bTicketType}
                      </h3>
                      <Badge variant={bStatus}>{bStatus}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-aqua-600 dark:text-aqua-400" />
                        <span>Visit: <strong className="text-slate-800 dark:text-slate-200 font-heading">{booking.visitDate}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-ocean-600 dark:text-aqua-400" />
                        <span>Quantity: <strong className="text-slate-800 dark:text-slate-200 font-heading">{booking.quantity}</strong></span>
                      </div>

                      {bPricePerTicket && (
                        <div className="flex items-center gap-1.5">
                          <span>Price/ticket: <strong className="text-slate-800 dark:text-slate-200 font-heading">Rs. {bPricePerTicket.toLocaleString()}</strong></span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Total: <strong className="text-slate-800 dark:text-slate-200 font-heading">Rs. {bTotal.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      Booking ID: {bId}
                    </p>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {isPending ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={XCircle}
                        onClick={() => openCancelModal(booking)}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 focus:ring-red-300"
                      >
                        Cancel Booking
                      </Button>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block font-heading">
                          {bStatus === 'confirmed' ? '✓ Admission Confirmed' : 'Reservation Cancelled'}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Reservation?"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Are you sure you want to cancel your booking for{' '}
                <strong>{selectedBooking?.ticketType || selectedBooking?.ticketName}</strong> on{' '}
                <strong>{selectedBooking?.visitDate}</strong>?
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Once cancelled, this reservation cannot be reactivated. You will need to make a new booking.
            </p>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={cancelling}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelConfirm}
                isLoading={cancelling}
              >
                Yes, Cancel Reservation
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
