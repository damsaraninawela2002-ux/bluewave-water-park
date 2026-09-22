import React from 'react';

/**
 * SectionHeading
 * Reusable two-tone script display heading for prominent section titles across the BlueWave frontend.
 * Uses the custom Caveat script font (`font-script`) at display scale (48px - 72px+)
 * with two distinct brand colors and a subtle original wave swash accent.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow] - Optional upper badge/category text
 * @param {React.ComponentType} [props.eyebrowIcon] - Optional Lucide icon beside the eyebrow
 * @param {string[]} props.lines - Array of 2 lines rendered in the script font
 * @param {string[]} [props.colors] - Two color classes [line1Color, line2Color]
 * @param {'center' | 'left'} [props.align='center'] - Alignment of heading and wave
 * @param {string} [props.subtitle] - Optional descriptive paragraph below the heading
 * @param {boolean} [props.showWave=true] - Whether to show the wave swash accent
 * @param {string} [props.waveColor] - Custom color for the wave accent stroke
 * @param {'default' | 'hero'} [props.size='default'] - Size variant
 * @param {string} [props.className=''] - Extra wrapper styling
 */
export default function SectionHeading({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  lines = [],
  colors = ['text-ocean-900 dark:text-white', 'text-aqua-600 dark:text-aqua-400'],
  align = 'center',
  subtitle,
  showWave = true,
  waveColor = 'text-aqua-500 dark:text-aqua-400',
  size = 'default',
  className = '',
}) {
  const isLeft = align === 'left';
  const line1Color = colors[0] || 'text-ocean-900 dark:text-white';
  const line2Color = colors[1] || 'text-aqua-600 dark:text-aqua-400';

  const sizeClasses =
    size === 'hero'
      ? 'text-5xl sm:text-6xl lg:text-[4.75rem]'
      : 'text-4xl sm:text-6xl lg:text-7xl';

  return (
    <div className={`flex flex-col ${isLeft ? 'items-start text-left' : 'items-center text-center'} ${className}`}>
      {/* Optional Eyebrow Badge */}
      {eyebrow && (
        <div className="mb-3.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-ocean-200/80 dark:border-slate-700 bg-ocean-50/90 dark:bg-navy-800 text-ocean-700 dark:text-aqua-300 font-heading shadow-xs">
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />}
            <span>{eyebrow}</span>
          </span>
        </div>
      )}

      {/* Two-Tone Script Headline */}
      <h2
        className={`font-script font-bold tracking-wide leading-[1.08] ${sizeClasses} select-none drop-shadow-xs`}
      >
        {lines[0] && <span className={`block ${line1Color}`}>{lines[0]}</span>}
        {lines[1] && <span className={`block ${line2Color} mt-0.5 sm:mt-1`}>{lines[1]}</span>}
      </h2>

      {/* Decorative Wave Swash Accent */}
      {showWave && (
        <div className={`mt-3 sm:mt-4 ${isLeft ? '' : 'mx-auto'}`}>
          <svg
            className={`h-3 w-32 sm:w-44 ${waveColor}`}
            viewBox="0 0 160 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 8.5C23 3.5 43 13.5 63 8.5C83 3.5 103 13.5 123 8.5C141 4 151 8 157 9"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Subtitle in clean sans typography */}
      {subtitle && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
