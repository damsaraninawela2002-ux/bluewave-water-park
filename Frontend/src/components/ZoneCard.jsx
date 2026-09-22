import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

/**
 * ZoneCard
 * Modern, professional attraction card for BlueWave Water Park categories:
 * - SpeedBay (High-Speed Water Slides)
 * - SplashBay (Water Splash & Play Area)
 * - ChillBay (Relaxation & Leisure Area)
 *
 * @param {Object} props
 * @param {Object} props.zone - Zone definition (category, title, tagline, description, image, theme, ctaText)
 * @param {number} [props.count=0] - Live attraction count
 * @param {string} [props.to] - Destination route link
 * @param {Function} [props.onClick] - Optional click handler (for category filter selection)
 * @param {boolean} [props.isActive=false] - Whether this zone card is currently active/selected
 * @param {string} [props.ctaText] - Custom CTA text (defaults to zone.ctaText or "Explore {title}")
 * @param {string} [props.className=''] - Optional outer wrapper styling
 */
export default function ZoneCard({
  zone,
  count = 0,
  to,
  onClick,
  isActive = false,
  ctaText,
  className = '',
}) {
  const { title, category, tagline, description, image, fallbackImage, theme = {} } = zone;
  const [imgSrc, setImgSrc] = useState(image);
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayTitle = title || category;
  const displayCta = ctaText || zone.ctaText || `Explore ${displayTitle}`;

  const cardContent = (
    <div
      className={`group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border transition-all duration-300 select-none ${
        isActive
          ? `ring-4 ${theme.activeRing || 'ring-aqua-500'} border-transparent shadow-soft-lg scale-[1.01]`
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-soft hover:shadow-soft-xl hover:-translate-y-1.5'
      } ${className}`}
    >
      {/* 1. Large Image Area */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-gradient-to-br from-ocean-900 to-navy-950">
        {/* Skeleton loader / gradient under image */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-ocean-800/50 to-navy-950/80 transition-opacity duration-500 ${
            imgLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <img
          src={imgSrc}
          alt={`${displayTitle} - ${tagline}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (fallbackImage && imgSrc !== fallbackImage) {
              setImgSrc(fallbackImage);
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Elegant Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 dark:from-navy-950 dark:via-black/40 dark:to-transparent" />

        {/* Top-Left Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-heading font-extrabold text-xs uppercase tracking-wider shadow-md backdrop-blur-xs border border-white/25 ${
              theme.badgeBg || 'bg-ocean-800 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{displayTitle}</span>
          </div>
        </div>

        {/* Top-Right Pill: Active indicator OR Live Attractions count */}
        {isActive ? (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-ocean-950 text-xs font-extrabold uppercase tracking-wider font-heading shadow-md">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Active</span>
            </span>
          </div>
        ) : count > 0 ? (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white/95 text-[11px] font-semibold border border-white/20 shadow-xs font-heading">
              <Sparkles className="w-3 h-3 text-aqua-300" />
              <span>{count} {count === 1 ? 'Ride' : 'Attractions'}</span>
            </span>
          </div>
        ) : null}
      </div>

      {/* 2. Card Content Area: Tagline, Title, Description, and Pinned CTA */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white dark:bg-navy-900 transition-colors">
        <div className="space-y-2.5">
          {/* Tagline */}
          <span
            className={`block text-xs font-extrabold uppercase tracking-wider font-heading ${
              theme.taglineColor || 'text-aqua-600 dark:text-aqua-400'
            }`}
          >
            {tagline}
          </span>

          {/* Attraction Name */}
          <h3 className="text-2xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight group-hover:text-aqua-600 dark:group-hover:text-aqua-400 transition-colors duration-200">
            {displayTitle}
          </h3>

          {/* Focus / Short Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
            {description}
          </p>
        </div>

        {/* 3. Pinned CTA Button */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
          <div
            className={`w-full py-3 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs ${
              theme.btnBg || 'bg-ocean-800 hover:bg-ocean-900 text-white'
            }`}
          >
            <span>{isActive ? 'Currently Viewing' : displayCta}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full cursor-pointer focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="block h-full cursor-pointer focus:outline-none">
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
