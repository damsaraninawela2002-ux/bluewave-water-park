import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * BubblesBackground
 * Site-wide persistent water bubbles background effect mounted once in App.jsx.
 * Floats from bottom to top across all pages without blocking clicks, scrolling,
 * or causing layout shift.
 */
export default function BubblesBackground() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Track window width on mount for mobile count decision
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Counts: ~25 on customer desktop, ~12 on customer mobile; ~8 on admin pages
  const totalCount = isAdmin ? (isMobile ? 5 : 8) : (isMobile ? 12 : 25);

  // Generate bubble properties ONCE with useMemo
  const bubbles = useMemo(() => {
    const list = [];

    // Main ambient bubbles (25 items)
    for (let i = 0; i < 25; i++) {
      // Size: 8px to 60px
      const size = Math.round(8 + Math.random() * 52);

      // Parallax effect: larger bubbles move slower (14-20s), smaller ones faster (8-13s)
      const sizeRatio = (size - 8) / 52;
      const durationVal = 8 + sizeRatio * 9 + Math.random() * 2.5;
      const dur = durationVal.toFixed(2);

      // Negative animation delay spread over duration (so bubbles are already mid-air)
      const delay = (-1 * Math.random() * durationVal).toFixed(2);

      // Horizontal position 0% to 100%
      const left = (Math.random() * 98 + 1).toFixed(2);

      // Horizontal sway amount (15px to 35px)
      const dir = Math.random() > 0.5 ? 1 : -1;
      const sway = (dir * (15 + Math.random() * 20)).toFixed(1);

      // Opacity: 0.15 to 0.5
      const op = (0.15 + Math.random() * 0.35).toFixed(2);

      list.push({
        id: `ambient-${i}`,
        style: {
          '--size': `${size}px`,
          '--left': `${left}%`,
          '--dur': `${dur}s`,
          '--delay': `${delay}s`,
          '--sway': `${sway}px`,
          '--op': op,
        },
      });
    }

    // Optional Polish: A cluster burst of 4 tiny bubbles rising close together from bottom
    const clusterAnchor = 25 + Math.random() * 50; // between 25% and 75%
    for (let c = 0; c < 4; c++) {
      const size = Math.round(8 + Math.random() * 8); // 8px to 16px
      const dur = (5.5 + Math.random() * 2).toFixed(2); // faster 5-7s burst
      const delay = (-1 * (c * 0.7 + Math.random() * 3)).toFixed(2);
      const left = (clusterAnchor + (Math.random() * 6 - 3)).toFixed(2);
      const sway = ((Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 12)).toFixed(1);
      const op = (0.2 + Math.random() * 0.25).toFixed(2);

      list.push({
        id: `burst-${c}`,
        style: {
          '--size': `${size}px`,
          '--left': `${left}%`,
          '--dur': `${dur}s`,
          '--delay': `${delay}s`,
          '--sway': `${sway}px`,
          '--op': op,
        },
      });
    }

    return list;
  }, []);

  // Filter count based on route & screen size
  const activeBubbles = bubbles.slice(0, totalCount);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-[15] select-none bubble-container"
      aria-hidden="true"
    >
      {activeBubbles.map((b) => (
        <span
          key={b.id}
          className={`bubble ${isAdmin ? 'opacity-40' : ''}`}
          style={b.style}
        />
      ))}
    </div>
  );
}
