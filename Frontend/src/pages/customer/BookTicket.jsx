import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { bookingService } from '../../services/bookingService';
import {
  Ticket,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Edit3,
  Receipt,
  Clock,
  Check,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function BookTicket() {
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get('ticketType') || searchParams.get('type');
  const preselectedId = searchParams.get('ticketId');
  const preselectedDate = searchParams.get('date') || searchParams.get('visitDate');
  const preselectedQty = parseInt(searchParams.get('quantity') || searchParams.get('qty'), 10);
  const navigate = useNavigate();

  // 5-Step Stepper: 1: Ticket Type, 2: Visit Date, 3: Quantity, 4: Summary, 5: Confirmation
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [visitDate, setVisitDate] = useState(() => {
    if (preselectedDate) return preselectedDate;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [quantity, setQuantity] = useState(preselectedQty > 0 ? preselectedQty : 1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await ticketService.getAll();
        setTickets(data);

        // Preselection matching
        let matched = null;
        if (preselectedType) {
          const needle = preselectedType.toLowerCase();
          matched = data.find(
            (t) =>
              t.name.toLowerCase() === needle ||
              t.name.toLowerCase().startsWith(needle) ||
              (t.type && t.type.toLowerCase() === needle)
          );
        }
        if (!matched && preselectedId) {
          matched = data.find((t) => t.id === preselectedId || t._id === preselectedId);
        }

        if (matched) {
          setSelectedTicketId(matched.id || matched._id);
        } else if (data.length > 0) {
          setSelectedTicketId(data[0].id || data[0]._id);
        }

        if (preselectedDate && preselectedDate >= todayStr) {
          setVisitDate(preselectedDate);
        }
        if (preselectedQty >= 1 && preselectedQty <= 20) {
          setQuantity(preselectedQty);
        }
      } catch (err) {
        toast.error('Failed to load tickets. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, [preselectedType, preselectedId, preselectedDate, preselectedQty, todayStr]);

  const selectedTicket = tickets.find(
    (t) => (t.id || t._id) === selectedTicketId
  ) || tickets[0];

  const pricePerTicket = selectedTicket ? Number(selectedTicket.price || 0) : 0;
  const totalPrice = Math.round(pricePerTicket * quantity * 100) / 100;

  // Temporary booking reference preview for Step 5 pre-confirmation
  const [previewRef] = useState(() => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `BW-${new Date().getFullYear()}-${randomHex}`;
  });

  const stepsList = [
    { num: 1, label: 'Ticket Type' },
    { num: 2, label: 'Visit Date' },
    { num: 3, label: 'Quantity' },
    { num: 4, label: 'Summary' },
    { num: 5, label: 'Confirmation' },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!selectedTicket) {
        toast.error('Please choose a ticket type to continue');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!visitDate) {
        toast.error('Please select your visit date');
        return;
      }
      if (visitDate < todayStr) {
        toast.error('Visit date cannot be in the past');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (quantity < 1 || quantity > 20) {
        toast.error('Quantity must be between 1 and 20');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const ticketType = selectedTicket?.name || 'Adult Ticket';
      const result = await bookingService.createBooking(ticketType, visitDate, quantity);
      setConfirmedBooking(result);
      toast.success('Ticket reservation created successfully!');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to complete booking. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setStep(1);
    setQuantity(1);
  };

  if (loading) {
    return <FullPageLoader text="Loading admission tickets..." />;
  }

  // Quick Date presets
  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setVisitDate(d.toISOString().split('T')[0]);
  };

  const getDayName = (dateStr) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(dt);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-10 sm:py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
            Official Admission
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
            Book Park Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Choose your ticket pass, visit date, and party size in 5 simple steps.
          </p>
        </div>

        {/* 5-Step Stepper Bar */}
        {!confirmedBooking && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto relative px-2">
              {/* Background connector line */}
              <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0" />
              {/* Progress active connector line */}
              <div
                className="absolute left-6 top-5 -translate-y-1/2 h-1 bg-aqua-500 transition-all duration-300 z-0"
                style={{
                  width: `${((step - 1) / (stepsList.length - 1)) * 100}%`,
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                {stepsList.map((s) => {
                  const isCurrent = step === s.num;
                  const isPassed = step > s.num;

                  return (
                    <div key={s.num} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (s.num < step) setStep(s.num);
                        }}
                        disabled={s.num > step}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-200 ${
                          isCurrent
                            ? 'bg-ocean-800 dark:bg-aqua-500 text-white shadow-soft ring-4 ring-aqua-200 dark:ring-aqua-950/80 scale-105'
                            : isPassed
                            ? 'bg-aqua-500 text-white cursor-pointer hover:bg-aqua-600'
                            : 'bg-white dark:bg-navy-900 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                      </button>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold mt-2 font-heading transition-colors hidden sm:block ${
                          isCurrent
                            ? 'text-ocean-900 dark:text-white font-bold'
                            : isPassed
                            ? 'text-aqua-600 dark:text-aqua-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Mobile Step indicator label */}
            <div className="sm:hidden text-center mt-3">
              <span className="text-xs font-bold text-ocean-900 dark:text-white font-heading">
                Step {step} of 5: {stepsList[step - 1]?.label}
              </span>
            </div>
          </div>
        )}

        {/* Wizard Main Content Container */}
        <Card className="p-6 sm:p-10 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-soft-lg transition-all">
          {/* ========================================================
              STEP 1: Ticket Type
          ======================================================== */}
          {step === 1 && !confirmedBooking && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
                  Step 1 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Choose Your Ticket Type
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select between Adult, Child, or Family admission fetched live from park tickets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {tickets.map((t) => {
                  const tId = t.id || t._id;
                  const isSelected = (selectedTicket?.id || selectedTicket?._id) === tId;
                  const nameLower = t.name.toLowerCase();
                  const isFamily = nameLower.includes('family');
                  const isChild = nameLower.includes('child');
                  const isAdult = nameLower.includes('adult');

                  return (
                    <div
                      key={tId}
                      onClick={() => setSelectedTicketId(tId)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-aqua-500 bg-aqua-50/40 dark:bg-aqua-950/30 ring-4 ring-aqua-100 dark:ring-aqua-950/50 shadow-soft'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-navy-800/60'
                      }`}
                    >
                      {isFamily && (
                        <span className="absolute -top-3 right-4 bg-coral-500 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Best Value
                        </span>
                      )}
                      {isAdult && !isFamily && (
                        <span className="absolute -top-3 right-4 bg-ocean-600 dark:bg-aqua-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Popular
                        </span>
                      )}

                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-heading font-bold text-ocean-950 dark:text-white text-base sm:text-lg">
                            {t.name}
                          </h3>
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'border-aqua-500 bg-aqua-500 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {t.description || 'Full-day unlimited access to all water slides and park attractions.'}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-extrabold text-ocean-950 dark:text-white font-heading">
                            Rs. {Number(t.price || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                            {isFamily ? '/ group pass' : '/ person'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="primary" size="lg" onClick={handleNext} icon={ArrowRight} className="shadow-coral">
                  Continue to Visit Date
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: Visit Date
          ======================================================== */}
          {step === 2 && !confirmedBooking && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
                  Step 2 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Choose Visit Date
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select any upcoming date for your visit. Past dates are blocked.
                </p>
              </div>

              {/* Selected Ticket Mini-Banner */}
              <div className="p-4 rounded-2xl bg-ocean-50/60 dark:bg-navy-800/60 border border-ocean-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-ocean-100 dark:bg-navy-700 text-ocean-700 dark:text-aqua-300">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-400 block font-heading">Ticket Type:</span>
                    <span className="font-heading font-bold text-ocean-900 dark:text-white text-sm">
                      {selectedTicket?.name} (Rs. {pricePerTicket.toLocaleString()} ea)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-aqua-600 dark:text-aqua-400 hover:underline font-heading flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Change
                </button>
              </div>

              {/* Date Input with Quick Presets */}
              <div className="max-w-md mx-auto space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2 font-heading">
                    Pick a Calendar Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-aqua-400 transition-all font-sans font-semibold cursor-pointer"
                      required
                    />
                  </div>
                  {visitDate && (
                    <p className="text-xs font-medium text-aqua-600 dark:text-aqua-400 mt-2 font-heading">
                      Selected: <strong>{getDayName(visitDate)}</strong>
                    </p>
                  )}
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 font-heading">
                    Quick Select:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700 font-heading"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700 font-heading"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(7)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700 font-heading"
                    >
                      Next Week
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ocean-600 dark:text-aqua-400 flex-shrink-0" />
                  <span>Park hours: 10:00 AM – 7:00 PM every day.</span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={handleBack} icon={ArrowLeft}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={handleNext} icon={ArrowRight} className="shadow-coral">
                  Continue to Quantity
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: Quantity
          ======================================================== */}
          {step === 3 && !confirmedBooking && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
                  Step 3 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Select Number of Tickets
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Use the stepper control to pick between 1 and 20 passes.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6 pt-2">
                {/* Stepper Control */}
                <div className="bg-sand-50 dark:bg-navy-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-4 font-heading">
                    Number of Guests / Tickets
                  </span>

                  <div className="flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-slate-800 dark:text-white shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <div className="w-24 text-center">
                      <span className="font-heading font-extrabold text-4xl text-ocean-950 dark:text-white">
                        {quantity}
                      </span>
                      <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 font-heading mt-0.5">
                        {quantity > 1 ? 'tickets' : 'ticket'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      disabled={quantity >= 20}
                      className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-slate-800 dark:text-white shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
                    For corporate or private groups over 20 guests, please contact our events team.
                  </p>
                </div>

                {/* Live Price Calculator */}
                <div className="p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Ticket Type:</span>
                    <span className="font-semibold text-ocean-900 dark:text-white">{selectedTicket?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Price per Ticket:</span>
                    <span className="font-semibold text-ocean-900 dark:text-white">
                      Rs. {pricePerTicket.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Quantity:</span>
                    <span className="font-semibold text-ocean-900 dark:text-white">× {quantity}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-ocean-950 dark:text-white font-heading">Subtotal:</span>
                    <span className="text-xl font-extrabold text-coral-500 font-heading">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={handleBack} icon={ArrowLeft}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={handleNext} icon={ArrowRight} className="shadow-coral">
                  Continue to Summary
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: Booking Summary
          ======================================================== */}
          {step === 4 && !confirmedBooking && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
                  Step 4 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Booking Summary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Review your calculated booking details below. Click Edit on any row to adjust prior steps.
                </p>
              </div>

              {/* Summary Card with Edit Links */}
              <div className="bg-sand-50 dark:bg-navy-900/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                {/* 1. Ticket Type */}
                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-heading">
                      Ticket Type:
                    </span>
                    <span className="font-heading font-bold text-ocean-950 dark:text-white text-base">
                      {selectedTicket?.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-aqua-600 dark:text-aqua-400 hover:underline flex items-center gap-1 font-heading"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                {/* 2. Visit Date */}
                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-heading">
                      Visit Date:
                    </span>
                    <span className="font-heading font-bold text-ocean-950 dark:text-white text-base">
                      {visitDate} ({getDayName(visitDate)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-aqua-600 dark:text-aqua-400 hover:underline flex items-center gap-1 font-heading"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                {/* 3. Quantity */}
                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-heading">
                      Quantity:
                    </span>
                    <span className="font-heading font-bold text-ocean-950 dark:text-white text-base">
                      {quantity} {quantity > 1 ? 'tickets' : 'ticket'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-aqua-600 dark:text-aqua-400 hover:underline flex items-center gap-1 font-heading"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                {/* 4. Price per Ticket */}
                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-heading">
                      Price per Ticket:
                    </span>
                    <span className="font-heading font-semibold text-ocean-900 dark:text-slate-200">
                      Rs. {pricePerTicket.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">Read-only</span>
                </div>

                {/* 5. Total Price */}
                <div className="pt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-extrabold text-ocean-950 dark:text-white font-heading block">
                      Total Price:
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Calculated as {quantity} × Rs. {pricePerTicket.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-coral-500 font-heading">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={handleBack} icon={ArrowLeft}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={handleNext} icon={ArrowRight} className="shadow-coral">
                  Proceed to Confirmation
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 5: Booking Confirmation (Pre-confirm & Post-confirm)
          ======================================================== */}
          {step === 5 && !confirmedBooking && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400 font-heading">
                  Step 5 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Booking Confirmation
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Verify your details and click Confirm Booking to secure your reservation.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-sand-50 dark:bg-navy-900/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Provisional Booking ID:</span>
                  <span className="font-mono font-bold text-ocean-900 dark:text-aqua-300">
                    {previewRef}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Ticket Type:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {selectedTicket?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Visit Date:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {visitDate}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Quantity:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {quantity} {quantity > 1 ? 'tickets' : 'ticket'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Price per Ticket:</span>
                  <span className="font-semibold text-ocean-900 dark:text-slate-200">
                    Rs. {pricePerTicket.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-extrabold text-ocean-950 dark:text-white font-heading">
                    Total Price:
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-coral-500 font-heading">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Park Assurance Note */}
              <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  Your booking will be placed in <strong>pending</strong> status and confirmed by park staff.
                  Admission fee is verified at the park gate. Free cancellation is available anytime in My Bookings.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={handleBack} icon={ArrowLeft} disabled={submitting}>
                  Back to Summary
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirmBooking}
                  isLoading={submitting}
                  className="shadow-coral text-base px-8"
                  icon={CheckCircle2}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 5 SUCCESS: Booking Successful Screen
          ======================================================== */}
          {confirmedBooking && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-heading">
                  Reservation Successful
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
                  Booking Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Thank you! Your ticket order has been received and registered under your account.
                </p>
              </div>

              {/* Confirmed Booking Details */}
              <div className="max-w-lg mx-auto bg-sand-50 dark:bg-navy-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Booking ID:</span>
                  <span className="font-mono font-bold text-ocean-900 dark:text-aqua-300">
                    {confirmedBooking.bookingId || confirmedBooking.id}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Ticket Type:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {confirmedBooking.ticketType || confirmedBooking.ticketName}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Visit Date:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {confirmedBooking.visitDate}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Quantity:</span>
                  <span className="font-bold text-ocean-950 dark:text-white font-heading">
                    {confirmedBooking.quantity} {confirmedBooking.quantity > 1 ? 'tickets' : 'ticket'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Price per Ticket:</span>
                  <span className="font-semibold text-ocean-900 dark:text-slate-200">
                    Rs. {Number(confirmedBooking.pricePerTicket || pricePerTicket).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Booking Status:</span>
                  <Badge variant={confirmedBooking.bookingStatus || confirmedBooking.status || 'pending'}>
                    {confirmedBooking.bookingStatus || confirmedBooking.status || 'pending'}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-extrabold text-ocean-950 dark:text-white font-heading">
                    Total Price:
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-coral-500 font-heading">
                    Rs. {Number(confirmedBooking.totalPrice || confirmedBooking.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <Link to="/my-bookings" className="flex-1">
                  <Button variant="primary" size="lg" className="w-full justify-center shadow-coral">
                    View My Bookings
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={handleReset} className="flex-1 justify-center">
                  Book Another Ticket
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
