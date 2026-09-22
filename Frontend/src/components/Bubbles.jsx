import React, { useMemo } from 'react';

/**
 * Bubbles component
 * Renders an animated water bubbles background effect with realistic rising,
 * glassy radial reflections, horizontal sway, and subtle wobble.
 *
 * @param {number} count - Total number of bubbles to render on desktop (default 25)
 * @param {string} className - Additional CSS classes for the container
 * @param {number} mobileCount - Number of bubbles active on mobile (default 12)
 */
export default function Bubbles({ count = 25, className = '', mobileCount = 12 }) {
  // Generate random values ONCE with useMemo
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      // Size: 8 to 60px
      const size = Math.round(8 + Math.random() * 52);
      // Left position: 0% to 100%
      const left = (Math.random() * 100).toFixed(2);
      // Duration: 8 to 20s
      const durationVal = 8 + Math.random() * 12;
      const dur = durationVal.toFixed(2);
      // Negative animation-delay so bubbles are already mid-air on initial page load
      const delay = (-1 * Math.random() * durationVal).toFixed(2);
      // Horizontal sway distance: 15 to 35px in either direction
      const swayDirection = Math.random() > 0.5 ? 1 : -1;
      const sway = (swayDirection * (15 + Math.random() * 20)).toFixed(1);
      // Opacity: 0.15 to 0.5
      const op = (0.15 + Math.random() * 0.35).toFixed(2);

      return {
        id: index,
        isDesktopOnly: index >= mobileCount,
        style: {
          '--size': `${size}px`,
          '--left': `${left}%`,
          '--dur': `${dur}s`,
          '--delay': `${delay}s`,
          '--sway': `${sway}px`,
          '--op': op,
        },
      };
    });
  }, [count, mobileCount]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className={`bubble bubble-local ${b.isDesktopOnly ? 'hidden sm:block' : ''}`}
          style={b.style}
        />
      ))}
    </div>
  );
}