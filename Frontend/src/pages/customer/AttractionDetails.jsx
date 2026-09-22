import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ticket,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Waves,
  HeartHandshake,
  Compass,
  AlertCircle,
  Eye,
  Maximize2,
  X,
  ChevronRight,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SectionHeading from '../../components/SectionHeading';
import { ATTRACTION_DETAILS } from '../../config/attractionDetailsData';

export default function AttractionDetails({ slug: propSlug }) {
  const params = useParams();
  const navigate = useNavigate();
  const currentSlug = (propSlug || params.slug || 'speedbay').toLowerCase();

  const attraction = ATTRACTION_DETAILS[currentSlug];
  const [imgError, setImgError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Scroll to top upon mounting or when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setImgError(false);
    setSelectedImage(null);
  }, [currentSlug]);

  if (!attraction) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-20 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-ocean-100 dark:bg-ocean-900/60 text-ocean-700 dark:text-aqua-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-ocean-950 dark:text-white font-heading mb-2">
            Attraction Zone Not Found
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            The attraction zone you are looking for does not exist or may have been moved.
          </p>
          <Link to="/attractions">
            <Button variant="primary" icon={ArrowLeft}>
              Back to All Attractions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { theme } = attraction;

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 transition-colors duration-300">
      {/* ========================================================
          1. LARGE HERO IMAGE & HEADER
          ======================================================== */}
      <section className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] bg-ocean-950 flex flex-col justify-between overflow-hidden">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-aqua-950" />
          {!imgError && (
            <img
              src={attraction.heroImage}
              alt={`${attraction.name} - ${attraction.tagline}`}
              width="2000"
              height="1200"
              loading="eager"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
              style={{ aspectRatio: '2000/1200' }}
            />
          )}
          {/* Dual Multi-layer Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/75 to-ocean-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/90 via-ocean-950/60 to-transparent" />
        </div>

        {/* Top Floating Navigation Bar (Back to Attractions) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 w-full flex items-center justify-between">
          <Link
            to="/attractions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold font-heading border border-white/20 transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Attractions</span>
          </Link>

          {/* Sibling Zone Switcher Pills */}
          <div className="hidden sm:flex items-center gap-2 bg-black/30 backdrop-blur-md p-1 rounded-2xl border border-white/10">
            {Object.values(ATTRACTION_DETAILS).map((zone) => {
              const isCurr = zone.slug === currentSlug;
              return (
                <Link
                  key={zone.slug}
                  to={`/attractions/${zone.slug}`}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-heading transition-all ${
                    isCurr
                      ? `${zone.theme.badgeBg} text-white shadow-xs`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {zone.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Hero Text Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl space-y-5">
            {/* Category / Attraction Name Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-aqua-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-white font-heading">
                {attraction.name} Zone
              </span>
            </div>

            {/* Headline with Two-Tone Styling */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.1]">
              {attraction.headline}
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-2xl font-bold font-script text-aqua-300">
              {attraction.tagline}
            </p>

            {/* Lead Description */}
            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl pt-1">
              {attraction.description}
            </p>

            {/* Key Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2 font-heading font-semibold">
                <Zap className="w-3.5 h-3.5 text-aqua-400" />
                <span>Intensity: {theme.intensityLabel} ({theme.intensityLevel})</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2 font-heading font-semibold">
                <Users className="w-3.5 h-3.5 text-aqua-400" />
                <span>Min Height: {theme.minHeight}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2 font-heading font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
                <span>Included in All Day Passes</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/book">
                <Button variant="primary" size="lg" icon={Ticket} className="shadow-coral font-bold">
                  {attraction.buttonText}
                </Button>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-bold font-heading border border-white/25 transition-all shadow-xs"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE BODY CONTENT CONTAINER
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 sm:space-y-24">
        
        {/* ======================================================
            2. FEATURES & SUITABILITY SECTION
            ====================================================== */}
        <section id="features" className="scroll-mt-28 space-y-8">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider font-heading mb-3 border ${theme.pillBg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zone Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ocean-950 dark:text-white font-heading">
              What Makes {attraction.name} Extraordinary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Engineered for world-class aquatic enjoyment, discover the key features built into this zone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Features List Cards (Left: 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5 text-aqua-500" />
                <span>Featured Attractions & Amenities</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attraction.features.map((feature, idx) => (
                  <Card
                    key={idx}
                    className={`p-5 rounded-2xl bg-white dark:bg-navy-900 border transition-all duration-300 ${theme.cardBorder} ${theme.cardHover} hover:shadow-card-hover flex items-start gap-3.5`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${theme.cardIconBg}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ocean-950 dark:text-white font-heading leading-tight">
                        {feature}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Fully maintained & supervised by certified lifeguards
                      </p>
                    </div>
                  </Card>
                ))}

                {/* Additional 6th Perk Card */}
                <Card className={`p-5 rounded-2xl bg-white dark:bg-navy-900 border transition-all duration-300 ${theme.cardBorder} ${theme.cardHover} flex items-start gap-3.5`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${theme.cardIconBg}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ocean-950 dark:text-white font-heading leading-tight">
                      Express Entry Access
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Included with every valid general admission pass
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Suitable For Card (Right: 5 Cols) */}
            <div className="lg:col-span-5">
              <Card className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-sand-100 dark:from-navy-900 dark:to-navy-800 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.cardIconBg}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-heading">
                      Target Audience
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-ocean-950 dark:text-white font-heading">
                      Suitable For
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-sm font-semibold text-ocean-950 dark:text-white leading-relaxed">
                    {attraction.suitableFor}
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Safety-inspected queues and clear entry signage</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Life jackets freely provided for swimmers and non-swimmers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Dedicated poolside seating & shaded recovery zones</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/book" className="block w-full">
                    <Button variant="primary" size="md" icon={Ticket} className="w-full justify-center shadow-coral">
                      Book Admission Pass
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ======================================================
            3. VISITOR INFORMATION & SAFETY GUIDELINES
            ====================================================== */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 7. Visitor Information */}
            <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-400 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
                      Guest Checklist
                    </span>
                    <h3 className="text-xl font-bold text-ocean-950 dark:text-white font-heading">
                      Visitor Information
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {attraction.visitorInformation.map((info, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/80 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-aqua-100 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold font-mono">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                        {info}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Lockers available near entrance</span>
                <Link to="/about#guidelines" className="text-aqua-600 dark:text-aqua-400 font-bold hover:underline">
                  View Full Park Rules &rarr;
                </Link>
              </div>
            </Card>

            {/* 8. Safety Information */}
            <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
                      Health & Protection
                    </span>
                    <h3 className="text-xl font-bold text-ocean-950 dark:text-white font-heading">
                      Safety Information
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed mb-6">
                  <p className="font-semibold">{attraction.safetyInformation}</p>
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Stationed certified lifeguards at all slide exits and pool perimeters</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Daily morning mechanical inspections and water pH testing</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>First-aid response facility staffed 100% of open hours</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Emergency Hotline: 011 234 5678</span>
                <Link to="/contact" className="text-aqua-600 dark:text-aqua-400 font-bold hover:underline">
                  Contact Lifeguard Desk &rarr;
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* ======================================================
            4. IMAGE GALLERY
            ====================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider font-heading mb-3 border ${theme.pillBg}`}>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual Tour</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading">
                {attraction.name} Photo Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore real park highlights from our {attraction.name} zone.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Click any photo to enlarge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attraction.gallery.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(item)}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-ocean-950 cursor-pointer shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-ocean-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold leading-snug line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md text-white/80 group-hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-navy-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative max-h-[75vh] w-full flex items-center justify-center bg-black">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-4 sm:p-6 bg-navy-950 text-white border-t border-white/10">
                <p className="text-sm font-semibold font-heading">{selectedImage.caption}</p>
                <p className="text-xs text-aqua-400 mt-1">{attraction.name} • BlueWave Water Park</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            5. BOOK TICKETS CTA BANNER
            ====================================================== */}
        <section className={`rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl ${theme.ctaBg}`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-aqua-300 font-heading">
              <Ticket className="w-3.5 h-3.5" />
              <span>Instant Digital Admission</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight">
              {attraction.cta}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Secure your day pass online in seconds. Includes full access to {attraction.name}, crystal clear wave lagoons, and all 9 BlueWave park attractions with no hidden surcharges.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link to="/book">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Ticket}
                  className="shadow-coral font-bold px-8"
                >
                  {attraction.buttonText}
                </Button>
              </Link>
              <Link
                to="/attractions"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold font-heading border border-white/20 transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Attractions</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
