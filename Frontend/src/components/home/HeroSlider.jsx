import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { siteConfig } from '../../config/siteConfig';
import { HERO_SLIDES } from '../../config/heroSlides';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Ticket,
  ArrowRight,
  Tag,
} from 'lucide-react';
import Button from '../Button';
import SectionHeading from '../SectionHeading';
import QuickBooking from './QuickBooking';

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [imageErrors, setImageErrors] = useState({});

  const progressTimerRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const goToSlide = useCallback((index) => {
    setCurrentIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Tab visibility listener (pause autoplay when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Autoplay and progress bar interval
  useEffect(() => {
    if (isPaused) {
      clearInterval(progressTimerRef.current);
      return;
    }

    const stepInterval = 50; // update progress every 50ms
    const stepIncrement = (stepInterval / SLIDE_DURATION) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepInterval);

    return () => clearInterval(progressTimerRef.current);
  }, [isPaused, nextSlide]);

  // Touch Swipe for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    if (deltaX > 50) {
      nextSlide(); // Swiped left -> next
    } else if (deltaX < -50) {
      prevSlide(); // Swiped right -> prev
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const handleHashClick = (e, hash) => {
    e.preventDefault();
    const el = document.getElementById(hash.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-ocean-950 text-white min-h-[600px] sm:min-h-[680px] lg:min-h-[760px] flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="BlueWave Water Park Featured Highlights"
    >
      {/* Background Slides with Ken Burns Crossfade & Ocean-to-Aqua Fallback */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const isErrored = imageErrors[slide.id];
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              {/* Graceful CSS gradient fallback shown immediately while loading or if photo fails */}
              <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-aqua-950" />

              {/* Verified high-resolution photo */}
              {!isErrored && (
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width="2000"
                  height="1200"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(slide.id)}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  style={{ aspectRatio: '2000/1200' }}
                />
              )}

              {/* Dark gradient overlay for optimal readability in both light/dark */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/95 via-ocean-950/70 to-ocean-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/85 via-ocean-950/50 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Main Slide Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 w-full flex-grow flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Two-Tone Script Section Heading */}
          <SectionHeading
            eyebrow={HERO_SLIDES[currentIndex].badge}
            lines={HERO_SLIDES[currentIndex].headlineLines || [HERO_SLIDES[currentIndex].headline, '']}
            colors={['text-white', 'text-aqua-300']}
            align="left"
            size="hero"
            subtitle={HERO_SLIDES[currentIndex].subtitle}
            showWave={true}
            waveColor="text-aqua-400"
          />

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to={HERO_SLIDES[currentIndex].primaryCta.to}>
              <Button
                variant="primary"
                size="lg"
                icon={Ticket}
                className="shadow-coral font-bold"
              >
                {HERO_SLIDES[currentIndex].primaryCta.label}
              </Button>
            </Link>

            {HERO_SLIDES[currentIndex].secondaryCta && (
              HERO_SLIDES[currentIndex].secondaryCta.isHash ? (
                <a
                  href={HERO_SLIDES[currentIndex].secondaryCta.to}
                  onClick={(e) => handleHashClick(e, HERO_SLIDES[currentIndex].secondaryCta.to)}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/15 backdrop-blur-xs font-semibold"
                  >
                    {HERO_SLIDES[currentIndex].secondaryCta.label}
                  </Button>
                </a>
              ) : (
                <Link to={HERO_SLIDES[currentIndex].secondaryCta.to}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/15 backdrop-blur-xs font-semibold"
                  >
                    {HERO_SLIDES[currentIndex].secondaryCta.label}
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Quick Booking Widget */}
          <div className="pt-4">
            <QuickBooking />
          </div>
        </div>
      </div>

      {/* Navigation Controls & Progress Bar */}
      <div className="relative z-10 w-full pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex items-center gap-2.5">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full h-2.5 ${
                  idx === currentIndex
                    ? 'w-8 bg-aqua-400'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Left & Right Glass Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 focus:outline-none"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 focus:outline-none"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thin Progress Bar Along Bottom of Hero Controls */}
        <div className="w-full bg-white/15 h-1 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-aqua-400 to-coral-400 h-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Theme-Adaptive Wave Divider at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none overflow-hidden z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-16 wave-fill-sand"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
