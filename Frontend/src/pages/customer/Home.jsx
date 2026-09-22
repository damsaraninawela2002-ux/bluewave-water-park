import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSlider from '../../components/home/HeroSlider';
import CategoryCards from '../../components/home/CategoryCards';
import PricingCards from '../../components/home/PricingCards';
import HowItWorks from '../../components/home/HowItWorks';
import ParkInfo from '../../components/home/ParkInfo';
import Reviews from '../../components/home/Reviews';
import FAQ from '../../components/home/FAQ';
import CtaBanner from '../../components/home/CtaBanner';
import ScrollReveal from '../../components/home/ScrollReveal';

export default function Home() {
  const location = useLocation();

  // Smooth scroll to target section if hash exists on mount or change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="flex flex-col min-h-screen bg-sand-50 dark:bg-navy-950 selection:bg-aqua-100 dark:selection:bg-aqua-950 selection:text-ocean-900 dark:selection:text-aqua-200 transition-colors duration-300">
      {/* 1. Hero Highlights Slider with verified images and CSS fallback */}
      <HeroSlider />

      {/* 2. Featured Park Attractions */}
      <ScrollReveal delay={100}>
        <CategoryCards />
      </ScrollReveal>

      {/* 3. Transparent Admission Passes */}
      <ScrollReveal delay={100}>
        <PricingCards />
      </ScrollReveal>

      {/* 4. Simple How It Works Timeline */}
      <ScrollReveal delay={100}>
        <HowItWorks />
      </ScrollReveal>

      {/* 5. Essential Park Information (Hours, Location, Guidelines) */}
      <ScrollReveal delay={100}>
        <ParkInfo />
      </ScrollReveal>

      {/* 6. Real Verified Guest Reviews */}
      <ScrollReveal delay={100}>
        <Reviews />
      </ScrollReveal>

      {/* 7. Frequently Asked Questions */}
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>

      {/* 8. Call to Action Banner */}
      <ScrollReveal delay={100}>
        <CtaBanner />
      </ScrollReveal>
    </div>
  );
}
