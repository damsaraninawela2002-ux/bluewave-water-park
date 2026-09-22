import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Shirt,
  ShieldCheck,
  Waves,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Card from '../Card';
import SectionHeading from '../SectionHeading';
import { siteConfig } from '../../config/site';

export default function ParkInfo() {
  const hoursData = [
    { day: 'Tuesday – Friday', hours: siteConfig.hoursWeekday.replace('Tue – Fri: ', ''), notes: 'Slides close at 5:45 PM' },
    { day: 'Saturday & Sunday', hours: siteConfig.hoursWeekend.replace('Sat – Sun: ', ''), notes: 'Peak hours, hourly surf shows' },
    { day: 'Public Holidays', hours: siteConfig.hoursHoliday.replace('Public Holidays: ', ''), notes: 'Live music & evening splash lights' },
  ];

  const guidelines = [
    {
      icon: Waves,
      title: 'Height & Age Regulations',
      desc: 'Thrill slides require a minimum height of 120 cm (approx 4ft). Children under 12 must be accompanied by an adult in all pool areas.',
      color: 'bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-400',
    },
    {
      icon: Shirt,
      title: 'Approved Swimwear Only',
      desc: 'Standard nylon/lycra swimsuits, rash guards, or burkinis required. Cotton clothing, denim, and garments with zippers or metal rivets are strictly prohibited on slides.',
      color: 'bg-aqua-50 dark:bg-aqua-950 text-aqua-700 dark:text-aqua-300',
    },
    {
      icon: ShieldCheck,
      title: 'Water Safety & Health Guidelines',
      desc: 'Life vests provided complimentary for non-swimmers and toddlers. Showering is mandatory before entering any pool or lagoon attraction.',
      color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
    },
    {
      icon: AlertCircle,
      title: 'Prohibited Items & Lockers',
      desc: 'Outside food, glass bottles, and sharp items are prohibited. Secure digital contactless lockers are available for daily rental inside changing pavilions.',
      color: 'bg-coral-50 dark:bg-coral-950 text-coral-600 dark:text-coral-400',
    },
  ];

  return (
    <section
      id="park-info"
      className="py-16 sm:py-20 bg-white dark:bg-navy-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-14">
          <SectionHeading
            eyebrow="Visitor Information"
            lines={['Plan Your Visit', 'to BlueWave Park']}
            colors={['text-ocean-900 dark:text-white', 'text-aqua-600 dark:text-aqua-400']}
            subtitle="Park operating hours, Horana park location, and essential visitor guidelines for a great day on the water."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Column 1: Operating Hours & Location Card */}
          <div className="space-y-8">
            {/* Hours Card */}
            <Card className="p-6 sm:p-8 bg-white dark:bg-navy-800 border-slate-200/80 dark:border-slate-700/80 shadow-soft rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-aqua-100 dark:bg-aqua-950 text-aqua-700 dark:text-aqua-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ocean-950 dark:text-white font-heading">
                    Operating Schedules
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {siteConfig.hoursSummary}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700/80">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <tbody>
                    {hoursData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-slate-100 dark:border-slate-700/80 last:border-b-0 ${
                          idx % 2 === 0
                            ? 'bg-slate-50/60 dark:bg-navy-900/50'
                            : 'bg-white dark:bg-navy-800'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-ocean-950 dark:text-white font-heading">
                          {row.day}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-ocean-700 dark:text-aqua-400">
                          {row.hours}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {row.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Location & Contact Card with Map Preview */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-950 dark:from-navy-900 dark:via-navy-800 dark:to-navy-950 text-white rounded-3xl shadow-soft border border-ocean-800 dark:border-slate-700 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-heading text-white">
                  Location & Guest Support
                </h3>
                <Link
                  to="/contact"
                  className="text-xs font-bold text-aqua-300 hover:text-white flex items-center gap-1 font-heading transition"
                >
                  <span>Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-aqua-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">BlueWave Water Park</p>
                    <p className="text-ocean-200">{siteConfig.address}</p>
                    <span className="inline-block mt-1 text-[11px] text-aqua-300">
                      Free secure on-site parking for 400+ vehicles
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <Phone className="w-5 h-5 text-aqua-400 flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] uppercase text-ocean-300 font-bold">
                      Hotline & Inquiries
                    </span>
                    <span className="text-white font-mono font-bold">{siteConfig.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <Mail className="w-5 h-5 text-aqua-400 flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] uppercase text-ocean-300 font-bold">
                      Email Support
                    </span>
                    <span className="text-white">{siteConfig.email}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Mini-Map Preview Linking to /contact */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="relative h-36 rounded-2xl overflow-hidden border border-white/15">
                  <iframe
                    title="BlueWave Location Mini Map"
                    src={siteConfig.osmEmbedUrl}
                    loading="lazy"
                    className="w-full h-full border-0 pointer-events-none filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-ocean-950/20 hover:bg-ocean-950/0 transition-colors" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ocean-200">Horana, Sri Lanka</span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 font-bold text-aqua-300 hover:text-white font-heading"
                  >
                    <span>View Interactive Map & Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Column 2: Visitor Guidelines as Icon List Cards */}
          <div id="visitor-guidelines" className="space-y-4 scroll-mt-28">
            <h3 className="text-xl font-extrabold text-ocean-950 dark:text-white font-heading mb-2">
              Visitor Guidelines & Park Rules
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              We are committed to delivering the highest international standards of hygiene, safety, and comfort for all our guests.
            </p>

            {guidelines.map((g, idx) => (
              <Card
                key={idx}
                className="p-5 sm:p-6 bg-white dark:bg-navy-800 border-slate-200/80 dark:border-slate-700/80 shadow-soft hover:shadow-card-hover transition-all rounded-2xl flex items-start gap-4"
              >
                <div className={`p-3 rounded-2xl ${g.color} flex-shrink-0 mt-0.5`}>
                  <g.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-ocean-950 dark:text-white font-heading">
                    {g.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
