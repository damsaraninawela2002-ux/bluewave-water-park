import React, { useState, useMemo } from 'react';
import { DollarSign, CalendarCheck, TrendingUp, Award } from 'lucide-react';
import Card from '../../Card';
import { siteConfig } from '../../../config/siteConfig';

export default function RevenueChart({ data = [] }) {
  const [metric, setMetric] = useState('revenue'); // 'revenue' | 'bookings'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Ensure we have 14 points or fallback
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Generate dummy 14 days
    const result = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      result.push({
        date: d.toISOString().slice(0, 10),
        revenue: 0,
        bookings: 0,
      });
    }
    return result;
  }, [data]);

  // Compute metrics summary
  const summary = useMemo(() => {
    let totalRev = 0;
    let totalBook = 0;
    let maxRev = 0;
    let peakRevDay = null;

    chartData.forEach((item) => {
      totalRev += item.revenue || 0;
      totalBook += item.bookings || 0;
      if ((item.revenue || 0) >= maxRev) {
        maxRev = item.revenue || 0;
        peakRevDay = item.date;
      }
    });

    const avgDaily = chartData.length > 0 ? totalRev / chartData.length : 0;
    return {
      totalRevenue: totalRev,
      totalBookings: totalBook,
      avgDailyRevenue: avgDaily,
      peakDay: peakRevDay,
      peakRevenue: maxRev,
    };
  }, [chartData]);

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 44;

  const usableWidth = svgWidth - paddingLeft - paddingRight;
  const usableHeight = svgHeight - paddingTop - paddingBottom;
  const zeroY = svgHeight - paddingBottom;

  // Values calculation
  const values = chartData.map((d) => (metric === 'revenue' ? d.revenue : d.bookings));
  const rawMax = Math.max(...values, 0);
  // Give 15% top headroom, or minimum safe scale
  const maxValue = rawMax === 0 ? (metric === 'revenue' ? 10000 : 5) : rawMax * 1.18;

  // Generate points coordinates
  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i / Math.max(chartData.length - 1, 1)) * usableWidth;
    const val = metric === 'revenue' ? d.revenue : d.bookings;
    const y = zeroY - (val / maxValue) * usableHeight;
    return { x, y, raw: d, val };
  });

  // Generate smooth cubic bezier SVG path
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Area path (closed at bottom)
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;
  }, [linePath, points, zeroY]);

  // Grid steps (4 horizontal guide lines)
  const gridSteps = [0, 0.33, 0.66, 1];

  // Helper date formatter
  const formatDateLabel = (isoDate) => {
    try {
      const parts = isoDate.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m = monthNames[parseInt(parts[1], 10) - 1];
      const d = parseInt(parts[2], 10);
      return `${m} ${d}`;
    } catch {
      return isoDate;
    }
  };

  const formatTooltipDate = (isoDate) => {
    try {
      const [year, month, day] = isoDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    } catch {
      return isoDate;
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
      {/* Chart Top Header & Metric Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-ocean-50 dark:bg-ocean-950/80 text-ocean-600 dark:text-aqua-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-ocean-950 dark:text-white font-heading">
              14-Day Performance Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological admissions revenue and bookings activity
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200/70 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setMetric('revenue')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
              metric === 'revenue'
                ? 'bg-white dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-ocean-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue ({siteConfig.currency})</span>
          </button>

          <button
            onClick={() => setMetric('bookings')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
              metric === 'bookings'
                ? 'bg-white dark:bg-navy-700 text-ocean-700 dark:text-aqua-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-ocean-900 dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Bookings Count</span>
          </button>
        </div>
      </div>

      {/* Mini Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">
            14-Day Confirmed
          </div>
          <div className="text-base font-extrabold text-ocean-900 dark:text-white font-heading mt-0.5">
            {siteConfig.currency} {summary.totalRevenue.toLocaleString('en-US')}
          </div>
        </div>

        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">
            Daily Average
          </div>
          <div className="text-base font-extrabold text-ocean-900 dark:text-white font-heading mt-0.5">
            {siteConfig.currency} {Math.round(summary.avgDailyRevenue).toLocaleString('en-US')}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">
              Peak Volume Day
            </div>
            <div className="text-sm font-extrabold text-ocean-900 dark:text-white font-heading mt-0.5">
              {summary.peakDay ? formatDateLabel(summary.peakDay) : 'N/A'}
            </div>
          </div>
          <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-x-auto pt-2">
        <div className="min-w-[580px] relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area Gradient for Revenue */}
              <linearGradient id="chartRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>

              {/* Area Gradient for Bookings */}
              <linearGradient id="chartBookingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
              </linearGradient>

              {/* Line Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines and Y-Axis Labels */}
            {gridSteps.map((step, idx) => {
              const yVal = zeroY - step * usableHeight;
              const numericLabel = Math.round(step * maxValue);
              const displayLabel =
                metric === 'revenue'
                  ? `${numericLabel >= 1000 ? `${(numericLabel / 1000).toFixed(0)}k` : numericLabel}`
                  : `${numericLabel}`;

              return (
                <g key={idx} className="transition-opacity">
                  <line
                    x1={paddingLeft}
                    y1={yVal}
                    x2={svgWidth - paddingRight}
                    y2={yVal}
                    stroke="currentColor"
                    strokeDasharray={idx === 0 ? 'none' : '4 4'}
                    className="text-slate-200 dark:text-slate-700/60"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={yVal + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono font-medium"
                  >
                    {displayLabel}
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            <path
              d={areaPath}
              fill={`url(#${metric === 'revenue' ? 'chartRevenueGrad' : 'chartBookingsGrad'})`}
              className="transition-all duration-300"
            />

            {/* Line Path */}
            <path
              d={linePath}
              fill="none"
              stroke={metric === 'revenue' ? '#0284c7' : '#10b981'}
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Active Vertical Guideline on Hover */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <g>
                <line
                  x1={points[hoveredIndex].x}
                  y1={paddingTop}
                  x2={points[hoveredIndex].x}
                  y2={zeroY}
                  stroke={metric === 'revenue' ? '#0284c7' : '#10b981'}
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                  className="opacity-75"
                />
              </g>
            )}

            {/* Data Points and Interaction Circles */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible enlarged hit target */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Outer halo when active */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill={metric === 'revenue' ? '#0284c7' : '#10b981'}
                      opacity="0.25"
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Inner Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '5' : '3.5'}
                    fill="#ffffff"
                    stroke={metric === 'revenue' ? '#0284c7' : '#10b981'}
                    strokeWidth={isHovered ? '2.5' : '2'}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* X-Axis Date Labels */}
            {chartData.map((d, idx) => {
              const x = paddingLeft + (idx / Math.max(chartData.length - 1, 1)) * usableWidth;
              // Show label every other day, or first and last
              const isFirst = idx === 0;
              const isLast = idx === chartData.length - 1;
              const isEven = idx % 2 === 0;

              if (!isEven && !isFirst && !isLast) return null;

              return (
                <text
                  key={idx}
                  x={x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-heading font-medium tracking-tight"
                >
                  {formatDateLabel(d.date)}
                </text>
              );
            })}
          </svg>

          {/* Floating Tooltip HTML Overlay */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full z-20 transition-all duration-100 ease-out"
              style={{
                left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                top: `${(points[hoveredIndex].y / svgHeight) * 100}%`,
                marginTop: '-12px',
              }}
            >
              <div className="px-3 py-2 rounded-xl bg-ocean-950 text-white dark:bg-navy-900 border border-ocean-700/60 dark:border-slate-700 shadow-xl text-xs font-sans whitespace-nowrap">
                <div className="font-bold text-slate-200 border-b border-ocean-800/80 dark:border-slate-800 pb-1 mb-1 font-heading text-[11px]">
                  {formatTooltipDate(chartData[hoveredIndex].date)}
                </div>
                <div className="flex items-center gap-2 text-aqua-300 font-semibold">
                  <DollarSign className="w-3 h-3 text-aqua-400" />
                  <span>
                    Revenue: {siteConfig.currency}{' '}
                    {(chartData[hoveredIndex].revenue || 0).toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium mt-0.5">
                  <CalendarCheck className="w-3 h-3 text-emerald-400" />
                  <span>
                    Bookings: {chartData[hoveredIndex].bookings || 0} reservation(s)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
