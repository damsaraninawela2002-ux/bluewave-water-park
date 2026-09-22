import React, { useEffect, useState } from 'react';
import { attractionService } from '../../services/attractionService';
import { ATTRACTION_ZONES } from '../../config/attractionZones';
import ZoneCard from '../ZoneCard';
import SectionHeading from '../SectionHeading';
import { Compass } from 'lucide-react';

export default function CategoryCards() {
  const [counts, setCounts] = useState({
    SpeedBay: 3,
    SplashBay: 3,
    ChillBay: 3,
  });

  useEffect(() => {
    async function loadAttractions() {
      try {
        const list = await attractionService.getAll();
        const calculated = { SpeedBay: 0, SplashBay: 0, ChillBay: 0 };
        list.forEach((item) => {
          if (calculated[item.category] !== undefined) {
            calculated[item.category] += 1;
          }
        });
        setCounts(calculated);
      } catch (err) {
        // Fallback default is already set
      }
    }
    loadAttractions();
  }, []);

  return (
    <section
      id="attractions"
      className="py-16 sm:py-24 bg-sand-50 dark:bg-navy-950/70 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <SectionHeading
            eyebrow="Park Attractions"
            eyebrowIcon={Compass}
            lines={['Explore Our', 'Attraction Zones']}
            colors={['text-ocean-950 dark:text-white', 'text-aqua-600 dark:text-aqua-400']}
            subtitle="From high-speed vertical water slides to rolling ocean waves and peaceful leisure lagoons."
            align="center"
          />
        </div>

        {/* 
          Responsive Grid:
          - Desktop (lg:): 3 cards in one row
          - Tablet (md:): 2 cards per row
          - Mobile (base): 1 card per row
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {ATTRACTION_ZONES.map((zone, idx) => {
            // On 2-column tablet layout, center the 3rd card cleanly
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
                  count={counts[zone.category] || 3}
                  to={`/attractions/${zone.id}`}
                  ctaText={zone.ctaText}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
