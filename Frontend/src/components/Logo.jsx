import React from 'react';

export default function Logo({
  size = 'md',
  variant = 'dark',
  showWordmark = true,
  className = '',
}) {
  const sizeMap = {
    sm: {
      badge: 'w-8 h-8 rounded-xl',
      svg: 32,
      title: 'text-lg leading-none',
      subtitle: 'text-[8px] tracking-[0.24em] mt-0.5',
      gap: 'gap-2',
    },
    md: {
      badge: 'w-10 h-10 rounded-2xl',
      svg: 40,
      title: 'text-2xl leading-tight',
      subtitle: 'text-[9.5px] tracking-[0.26em] mt-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      badge: 'w-14 h-14 rounded-2xl',
      svg: 56,
      title: 'text-3xl leading-tight',
      subtitle: 'text-[11px] tracking-[0.28em] mt-1',
      gap: 'gap-3',
    },
  };

  const s = sizeMap[size] || sizeMap.md;
  const isDarkVariant = variant === 'dark';

  return (
    <div className={`inline-flex items-center ${s.gap} select-none ${className}`}>
      {/* Icon Badge */}
      <div
        className={`${s.badge} relative flex items-center justify-center shadow-aqua overflow-hidden flex-shrink-0 bg-gradient-to-tr from-ocean-800 via-ocean-600 to-aqua-400 p-1.5`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Sun / Droplet Accent in top right */}
          <circle cx="34" cy="12" r="4.5" fill="url(#sunGrad)" opacity="0.95" />
          <circle cx="34" cy="12" r="6.5" stroke="#FEF08A" strokeWidth="0.8" opacity="0.4" />

          {/* Wave Layer 1: Deep back wave */}
          <path
            d="M4 36C11 36 15 31 22 31C29 31 33 34 44 34V44H4V36Z"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />

          {/* Wave Layer 2: Mid flowing wave */}
          <path
            d="M4 31C13 31 17 25 25 25C33 25 36 29 44 28V44H4V31Z"
            fill="#FFFFFF"
            fillOpacity="0.55"
          />

          {/* Wave Layer 3: Main cresting wave with curl */}
          <path
            d="M4 25C12 25 16 18 24 18C31 18 35 22 41 20C42.8 19.4 43.5 18 43 16.5C42.5 15 40.5 15.5 39 17C35 20.5 30 15 23 15C15 15 11 22 4 22V25Z"
            fill="url(#crestGrad)"
          />

          {/* Bottom base fill */}
          <path
            d="M4 38C12 38 18 35 26 35C34 35 38 38 44 38V44H4V38Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-heading font-extrabold tracking-tight ${s.title}`}>
            <span className={isDarkVariant ? 'text-ocean-950' : 'text-white'}>
              Blue
            </span>
            <span
              className={
                isDarkVariant
                  ? 'bg-gradient-to-r from-aqua-500 via-aqua-600 to-ocean-600 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-aqua-300 via-aqua-400 to-cyan-300 bg-clip-text text-transparent'
              }
            >
              Wave
            </span>
          </span>
          <span
            className={`font-heading font-bold uppercase ${s.subtitle} ${
              isDarkVariant ? 'text-ocean-700/80' : 'text-aqua-300/90'
            }`}
          >
            WATER PARK
          </span>
        </div>
      )}
    </div>
  );
}
