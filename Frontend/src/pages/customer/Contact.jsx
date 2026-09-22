import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Bus,
  Car,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import { siteConfig } from '../../config/site';
import { contactService } from '../../services/contactService';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmittedSuccess(false);

    try {
      await contactService.submitContact(formData);
      toast.success('Your message has been received! Our guest concierge will reply shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
      if (err.response?.status === 429) {
        toast.error('Rate limit reached: Maximum 5 inquiries per hour. Please call or message on WhatsApp.');
      } else {
        toast.error(err.response?.data?.detail || 'Failed to send message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const travelIcons = {
    Bus: Bus,
    Car: Car,
    MapPin: Navigation,
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
            <span className="text-aqua-300 font-semibold">Contact & Location</span>
          </nav>

          <div className="max-w-3xl">
            <SectionHeading
              eyebrow="Guest Concierge"
              eyebrowIcon={Phone}
              lines={['Get in Touch', 'with Our Guest Team']}
              colors={['text-white', 'text-aqua-300']}
              align="left"
              subtitle="Have questions about tickets, group visits, or park amenities? Send us a message or contact our guest services desk."
              waveColor="text-aqua-400"
            />
          </div>
        </div>
      </section>

      {/* Main Form & Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-ocean-950 dark:text-white font-heading">
                Send Us an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill out the form below and our visitor support team will respond within 24 hours.
              </p>
            </div>

            {submittedSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Message Sent Successfully!</p>
                  <p className="mt-0.5">Thank you for reaching out. We have logged your inquiry and sent a confirmation to your email.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ruwan Perera"
                    className={`w-full rounded-xl border ${
                      errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    } bg-slate-50 dark:bg-navy-800/80 px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 transition`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ruwan@example.com"
                    className={`w-full rounded-xl border ${
                      errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    } bg-slate-50 dark:bg-navy-800/80 px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 transition`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Question regarding group bookings and cabana rentals"
                  className={`w-full rounded-xl border ${
                    errors.subject ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-navy-800/80 px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 transition`}
                />
                {errors.subject && <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
                    Your Message *
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formData.message.length} / 2000
                  </span>
                </div>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry, visit dates, estimated group size, or specific amenities needed..."
                  className={`w-full rounded-xl border ${
                    errors.message ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-navy-800/80 p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 transition`}
                />
                {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-heading shadow-sm transition"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Info Cards & WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft border border-ocean-800 dark:border-slate-700 space-y-6">
              <h3 className="text-xl font-bold font-heading text-white">
                Park Headquarters
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-aqua-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-white font-heading">Park Address</span>
                    <p className="text-ocean-100 mt-0.5 leading-relaxed">{siteConfig.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-aqua-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-white font-heading">Hotline & Bookings</span>
                    <a
                      href={`tel:${siteConfig.phoneTel}`}
                      className="text-ocean-100 hover:text-aqua-300 font-mono font-bold block mt-0.5 transition"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-aqua-400 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-white font-heading">Email Support</span>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-ocean-100 hover:text-aqua-300 block mt-0.5 transition"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-aqua-400 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-white font-heading">Operating Hours</span>
                    <p className="text-ocean-100 mt-0.5">{siteConfig.hoursWeekday}</p>
                    <p className="text-ocean-100">{siteConfig.hoursWeekend}</p>
                    <p className="text-[11px] text-aqua-300 mt-1">{siteConfig.hoursNotes}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Chat Button */}
              <div className="pt-2">
                <a
                  href={siteConfig.getWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm font-heading shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider mb-3">
                Follow Our Splash Channels
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {siteConfig.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800 hover:bg-ocean-50 dark:hover:bg-navy-700/80 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-ocean-600 dark:hover:text-aqua-300 transition"
                  >
                    <span>{s.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Interactive Map */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ocean-600 dark:text-aqua-400 font-heading">
                Interactive Coordinates
              </span>
              <h3 className="text-2xl font-extrabold text-ocean-950 dark:text-white font-heading">
                Find Us in Horana
              </h3>
            </div>
            <a
              href={siteConfig.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-ocean-700 dark:text-aqua-300 text-xs font-bold font-heading hover:bg-ocean-50 dark:hover:bg-navy-700 shadow-xs transition"
            >
              <Navigation className="w-4 h-4 text-ocean-600 dark:text-aqua-400" />
              <span>Get Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Map Frame Container with Dark Mode Invert Filter */}
          <div className="relative w-full h-96 sm:h-[460px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-soft">
            <iframe
              title="BlueWave Water Park Location Map"
              src={siteConfig.osmEmbedUrl}
              loading="lazy"
              className="w-full h-full border-0 filter dark:invert dark:hue-rotate-180 dark:brightness-90 dark:contrast-95 transition-all duration-300"
            />
          </div>
        </div>

        {/* Getting Here Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-600 dark:text-aqua-400 font-heading">
              Travel Logistics
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading mt-1">
              Getting to BlueWave
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Smooth connectivity via Southern Expressway (E01), Panadura-Ratnapura Road (A8), and direct shuttle transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteConfig.gettingHere.map((item, idx) => {
              const IconComp = travelIcons[item.icon] || MapPin;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-ocean-50 dark:bg-navy-800 text-ocean-600 dark:text-aqua-400 flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-ocean-950 dark:text-white font-heading mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
