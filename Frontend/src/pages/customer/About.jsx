import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  Sparkles,
  Ticket,
  CheckCircle2,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SectionHeading from '../../components/SectionHeading';
import { siteConfig } from '../../config/site';

export default function About() {
  const location = useLocation();

  // Scroll to anchor on mount or when location.hash changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  const hoursData = [
    {
      day: 'Tuesday – Friday',
      hours: siteConfig.hoursWeekday.replace('Tue – Fri: ', ''),
      notes: 'Water slides close at 5:45 PM',
      highlight: false,
    },
    {
      day: 'Saturday & Sunday',
      hours: siteConfig.hoursWeekend.replace('Sat – Sun: ', ''),
      notes: 'Peak days, hourly wave lagoon sessions',
      highlight: true,
    },
    {
      day: 'Public Holidays',
      hours: siteConfig.hoursHoliday.replace('Public Holidays: ', ''),
      notes: 'Live aquatic shows & extended splash hours',
      highlight: false,
    },
  ];

  const guidelines = [
    {
      icon: Waves,
      title: 'Height & Age Regulations',
      desc: 'High-speed slides require a minimum height of 120 cm (approx 4ft). Children under 12 must be supervised by an adult at all times.',
      color: 'bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-400',
    },
    {
      icon: Shirt,
      title: 'Approved Swimwear Only',
      desc: 'Standard nylon/lycra swimsuits, rash guards, or burkinis required. Cotton clothing, denim, and apparel with metal zippers or rivets are strictly prohibited on slides.',
      color: 'bg-aqua-50 dark:bg-aqua-950 text-aqua-700 dark:text-aqua-300',
    },
    {
      icon: ShieldCheck,
      title: 'Water Safety & Health Guidelines',
      desc: 'Life vests are provided complimentary for non-swimmers and toddlers. Showering is mandatory prior to entering any pool, lagoon, or slide attraction.',
      color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
    },
    {
      icon: AlertCircle,
      title: 'Prohibited Items & Lockers',
      desc: 'Outside food, glassware, alcoholic beverages, and sharp objects are strictly disallowed. Secure contactless digital lockers are available inside changing pavilions.',
      color: 'bg-coral-50 dark:bg-coral-950 text-coral-600 dark:text-coral-400',
    },
  ];

  const parkHighlights = [
    {
      title: 'World-Class Water Attractions',
      desc: 'Featuring thrilling speed slides, expansive wave lagoons, and gentle family rivers engineered to international safety standards.',
    },
    {
      title: 'Certified Lifeguards on Duty',
      desc: 'Over 40 internationally accredited lifeguards stationed throughout the park to ensure a safe, carefree adventure for every visitor.',
    },
    {
      title: 'Pristine Water Quality',
      desc: 'Advanced multi-stage UV and automated filtration systems ensuring crystal clear, hygienic water across all zones every single day.',
    },
    {
      title: 'Family Comfort & Amenities',
      desc: 'Shaded cabanas, premium lounger pavilions, hygienic changing facilities, baby care rooms, and delicious food dining options.',
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 1. Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="ABOUT BLUEWAVE WATER PARK"
            lines={['Plan Your Visit,', 'Experience The Splash']}
            colors={['text-ocean-950 dark:text-white', 'text-aqua-500']}
            align="center"
            size="large"
            subtitle="Everything you need to know about our park hours, visitor guidelines, and amenities before you arrive in Horana."
            showWave={true}
            waveColor="text-aqua-400"
          />
        </div>

        {/* 2. Welcome & Park Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-aqua-50 dark:bg-aqua-950/60 border border-aqua-200 dark:border-aqua-800 text-xs font-semibold text-aqua-700 dark:text-aqua-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sri Lanka's Premier Aquatic Haven</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading leading-tight">
              A World of Endless Water Adventure in Horana
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Nestled in the lush landscapes of Horana, BlueWave Water Park is designed to deliver adrenaline-fueled excitement, refreshing family leisure, and unforgettable tropical memories.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              From the extreme drops of SpeedBay to the gentle ripples of ChillBay and our massive wave lagoon, every corner is engineered for comfort, safety, and nonstop joy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {parkHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-aqua-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-ocean-950 dark:text-white font-heading">
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/tickets">
                <Button variant="primary" size="md" icon={Ticket} className="shadow-coral">
                  View Admission Passes
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="md">
                  Get Driving Directions
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 aspect-video lg:aspect-4/3 bg-ocean-950">
              <img
                src="/images/c.png"
                alt="BlueWave Water Park Slides and Pool Area"
                width="1200"
                height="900"
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-aqua-300">Horana, Sri Lanka</p>
                <p className="text-lg font-bold font-heading">400+ Free Parking Spaces & Full Resort Amenities</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Park Hours & Schedules Section */}
        <section id="hours" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-700 dark:text-aqua-300 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Operating Schedules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading">
              Park Hours & Entry Times
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              We welcome guests throughout the week with peak weekend wave programming and seasonal activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hoursData.map((item, idx) => (
              <Card
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-br from-ocean-900 to-navy-900 text-white border-aqua-500/50 shadow-xl shadow-aqua-500/10'
                    : 'bg-white dark:bg-navy-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      item.highlight ? 'text-aqua-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Schedule
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      item.highlight
                        ? 'bg-aqua-400/20 text-aqua-300'
                        : 'bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-extrabold font-heading mb-2 ${
                    item.highlight ? 'text-white' : 'text-ocean-950 dark:text-white'
                  }`}
                >
                  {item.day}
                </h3>
                <p
                  className={`text-2xl sm:text-3xl font-black font-heading mb-4 ${
                    item.highlight ? 'text-aqua-400' : 'text-ocean-600 dark:text-aqua-400'
                  }`}
                >
                  {item.hours}
                </p>
                <p
                  className={`text-xs leading-relaxed ${
                    item.highlight ? 'text-ocean-200' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.notes}
                </p>
              </Card>
            ))}
          </div>

          {/* Location & Contact Strip */}
          <div
            id="location"
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-soft scroll-mt-28"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-ocean-950 dark:text-white font-heading">
                    Park Location
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {siteConfig.address}
                  </p>
                  <p className="text-xs text-aqua-600 dark:text-aqua-400 mt-1 font-semibold">
                    Free on-site parking for 400+ vehicles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <div className="p-3 rounded-2xl bg-ocean-50 dark:bg-ocean-950 text-ocean-600 dark:text-aqua-400 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-ocean-950 dark:text-white font-heading">
                    Inquiries & Hotline
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-mono font-bold">
                    {siteConfig.phone}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Customer support available 8:00 AM – 8:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-ocean-950 dark:text-white font-heading">
                    Email Support
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {siteConfig.email}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-xs text-aqua-600 dark:text-aqua-400 mt-1 font-bold hover:underline"
                  >
                    <span>View Interactive Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Visitor Guidelines & Safety Regulations */}
        <section id="guidelines" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety & Regulations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading">
              Visitor Guidelines & Park Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Please review these guidelines to ensure a safe, comfortable, and memorable visit for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((g, idx) => (
              <Card
                key={idx}
                className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/80 dark:border-slate-800 shadow-soft rounded-3xl flex items-start gap-5 hover:shadow-card-hover transition-all"
              >
                <div className={`p-4 rounded-2xl ${g.color} flex-shrink-0 mt-0.5`}>
                  <g.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading mb-2">
                    {g.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Bottom Call to Action */}
        <div className="rounded-3xl bg-gradient-to-r from-ocean-950 via-ocean-900 to-navy-950 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Ready for Your BlueWave Splash?
            </h3>
            <p className="text-xs sm:text-sm text-ocean-200 leading-relaxed">
              Book your tickets online today to secure guaranteed admission, avoid ticket queues, and unlock instant digital entry passes.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link to="/book">
                <Button variant="primary" size="lg" icon={Ticket} className="shadow-coral font-bold">
                  Book Online Tickets
                </Button>
              </Link>
              <Link to="/attractions">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  Explore All Attractions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
