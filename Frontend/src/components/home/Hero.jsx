import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { Sparkles, Ticket, Compass } from 'lucide-react';
import Button from '../Button';
import Bubbles from '../Bubbles';
import QuickBooking from './QuickBooking';

export default function Hero() {
  const [counts, setCounts] = useState({
    totalAttractions: 9,
    totalCategories: 3,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await bookingService.getPublicStats();
        if (stats?.totalAttractions) {
          setCounts({
            totalAttractions: stats.totalAttractions,
            totalCategories: stats.totalCategories || 3,
          });
        }
      } catch (err) {
        // Fallback already set
      }
    }
    loadStats();
  }, []);

  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-ocean-950 text-white pt-16 sm:pt-20 pb-28 sm:pb-36">
      {/* Background Image with CSS Gradient Fallback */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-aqua-950" />
        {!imgError && (
          <img
            src="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=2000&q=80"
            alt="BlueWave water park slides and swimming pools"
            width="2000"
            height="1200"
            loading="eager"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/95 via-ocean-950/70 to-ocean-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/85 via-ocean-950/50 to-transparent" />
      </div>

      <Bubbles count={20} />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white uppercase tracking-wider font-heading">
                BlueWave Water Park • Horana
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight leading-[1.12] text-white">
              Sri Lanka's Premier Water Park
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-ocean-100 leading-relaxed font-normal max-w-2xl mx-auto">
              Enjoy 9 water slides, wave lagoons, and dedicated kids splash zones. Book your tickets online for immediate entrance.
            </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/book" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={Ticket}
                className="w-full justify-center shadow-coral font-bold"
              >
                Book Tickets Now
              </Button>
            </Link>
            <Link to="/attractions" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={Compass}
                className="w-full justify-center border-white/30 text-white hover:bg-white/10"
              >
                Explore Attractions
              </Button>
            </Link>
          </div>

          {/* Floating Glass Quick Booking Card */}
            <QuickBooking />
          </div>
        </div>
      </div>

      {/* Layered Wave Divider at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-20 text-sand-50 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
