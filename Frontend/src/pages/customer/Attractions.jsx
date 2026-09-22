import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { attractionService } from '../../services/attractionService';
import { ATTRACTION_ZONES } from '../../config/attractionZones';
import { Compass, Waves, X, LayoutGrid, ArrowRight } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import SectionHeading from '../../components/SectionHeading';
import ZoneCard from '../../components/ZoneCard';
import { SkeletonCard } from '../../components/Loader';

export default function Attractions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    SpeedBay: 3,
    SplashBay: 3,
    ChillBay: 3,
  });
  const [totalCount, setTotalCount] = useState(9);

  // Load global counts once
  useEffect(() => {
    async function loadAllCounts() {
      try {
        const all = await attractionService.getAll();
        const calculated = { SpeedBay: 0, SplashBay: 0, ChillBay: 0 };
        all.forEach((item) => {
          if (calculated[item.category] !== undefined) {
            calculated[item.category] += 1;
          }
        });
        setCounts(calculated);
        setTotalCount(all.length);
      } catch (err) {
        console.error('Failed to load attraction counts:', err);
      }
    }
    loadAllCounts();
  }, []);

  // Load attractions for active category
  useEffect(() => {
    async function loadAttractions() {
      setLoading(true);
      try {
        const data = await attractionService.getAll(activeCategory);
        setAttractions(data);
      } catch (err) {
        console.error('Failed to load attractions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttractions();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    if (cat === 'All' || cat === activeCategory) {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };



  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 py-12 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto mb-10">
          <SectionHeading
            eyebrow="Discover The Park"
            eyebrowIcon={Compass}
            lines={['Explore Our', 'Park Attractions']}
            colors={['text-ocean-900 dark:text-white', 'text-aqua-600 dark:text-aqua-400']}
            subtitle="Explore speed slides, relaxing river streams, and dedicated play pools designed for visitors of all ages."
            align="center"
          />
        </div>

        {/* Filter Bar with "All Attractions" */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
                activeCategory === 'All'
                  ? 'bg-ocean-800 dark:bg-aqua-500 text-white shadow-soft ring-2 ring-ocean-800/30 dark:ring-aqua-400/30'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Attractions ({totalCount})</span>
            </button>

            {activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 font-heading transition"
                title="Clear category filter"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Attraction Categories: Responsive Grid (3 desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {ATTRACTION_ZONES.map((zone, idx) => {
            const isSelected = activeCategory === zone.category;
            const isThirdOnTablet = idx === 2;

            return (
              <div
                key={zone.id}
                className={`h-full flex flex-col ${
                  isThirdOnTablet
                    ? 'md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:max-w-none w-full'
                    : 'w-full'
                }`}
              >
                <ZoneCard
                  zone={zone}
                  count={counts[zone.category] || 0}
                  isActive={isSelected}
                  onClick={() => handleCategoryChange(zone.category)}
                  ctaText={isSelected ? 'Clear Filter' : zone.ctaText}
                />
              </div>
            );
          })}
        </div>

        {/* Section divider & active filter status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ocean-950 dark:text-white font-heading">
              {activeCategory === 'All' ? 'All Park Attractions' : `${activeCategory}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {attractions.length} of {totalCount} attractions
            </p>
          </div>
          {activeCategory !== 'All' && (
            <Link
              to={`/attractions/${activeCategory.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-aqua-600 dark:text-aqua-400 hover:underline font-heading"
            >
              <span>Explore Full {activeCategory} Details & Safety Rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Content Area: Grid or Skeleton or Empty State */}
        {loading ? (
          <SkeletonCard count={6} />
        ) : attractions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-navy-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-soft max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-400 flex items-center justify-center mx-auto mb-4">
              <Waves className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-ocean-900 dark:text-white font-heading mb-1">
              No Attractions Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              There are currently no attractions listed under the "{activeCategory}" category.
            </p>
            <button
              onClick={() => handleCategoryChange('All')}
              className="text-xs font-semibold text-aqua-600 dark:text-aqua-400 hover:underline font-heading"
            >
              View All Attractions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden p-0 flex flex-col h-full group border-slate-100 dark:border-slate-800"
              >
                {/* Image with zoom effect */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-ocean-950 via-ocean-900 to-aqua-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="aqua">{item.category}</Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-ocean-900 dark:text-white font-heading group-hover:text-ocean-700 dark:group-hover:text-aqua-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-aqua-500" />
                      All-Day Access
                    </span>
                    <span className="text-ocean-700 dark:text-aqua-400 font-semibold font-heading">
                      Included in Day Pass
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
