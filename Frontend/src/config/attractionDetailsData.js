/**
 * Attraction Details Configuration for BlueWave Water Park
 * Unique data, themes, and photography for SpeedBay, SplashBay, and ChillBay.
 */

export const ATTRACTION_DETAILS = {
  speedbay: {
    slug: 'speedbay',
    name: 'SpeedBay',
    tagline: 'High-Speed Water Slides',
    headline: 'Feel the Rush at SpeedBay',
    description:
      'Experience the excitement of high-speed water slides, steep drops, sharp turns, and thrilling splash landings. SpeedBay is designed for visitors who love adventure, speed, and an adrenaline-filled water park experience.',
    features: [
      'High-Speed Water Slides',
      'Steep Drops',
      'Fast Twisting Turns',
      'Thrilling Splash Landings',
      'Adventure-Focused Attractions',
    ],
    suitableFor:
      'Teenagers and adults who enjoy high-energy water attractions.',
    safetyInformation:
      'All rides must follow the posted safety instructions and height requirements. Visitors must follow lifeguard instructions before and during every ride.',
    visitorInformation: [
      'Check ride height requirements before entering.',
      'Follow all safety instructions.',
      'Secure loose belongings before riding.',
      'Follow lifeguard guidance at all times.',
    ],
    cta: 'Book Your SpeedBay Adventure',
    buttonText: 'Book Tickets',
    heroImage: '/images/1.jpeg',
    heroFallback: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=2000&q=80',
    theme: {
      accentColor: 'text-aqua-500 dark:text-aqua-400',
      taglineColor: 'text-aqua-600 dark:text-aqua-300',
      badgeBg: 'bg-aqua-500 text-white',
      badgeBorder: 'border-aqua-400',
      glowBg: 'from-aqua-500/20 via-ocean-600/10 to-transparent',
      pillBg: 'bg-aqua-50 dark:bg-aqua-950/60 text-aqua-700 dark:text-aqua-300 border-aqua-200 dark:border-aqua-800',
      cardBorder: 'border-aqua-200 dark:border-aqua-900/50',
      cardHover: 'hover:border-aqua-400 dark:hover:border-aqua-600',
      cardIconBg: 'bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400',
      ctaBg: 'bg-gradient-to-r from-ocean-950 via-ocean-900 to-aqua-950',
      ctaButton: 'bg-aqua-500 hover:bg-aqua-600 text-white shadow-lg shadow-aqua-500/25',
      intensityLabel: 'Extreme Adventure',
      intensityLevel: '5 / 5',
      minHeight: '120 cm (48 in)',
    },
    gallery: [
      {
        url: '/images/m.jpeg',
        caption: 'High-speed slide drops and thrilling vertical descents',
      },
      {
        url: '/images/a.png',
        caption: 'Speed slide twists with crystal splash landings',
      },
      {
        url:'/images/b.png',
        caption: 'Multi-lane racing flumes for friendly competitions',
      },
      {
        url:'/images/p.png',

        caption: 'Sparkling pool runouts engineered with highest safety margins',
      },
      {
        url: '/images/c.png',
        caption: 'Panoramic view of SpeedBay adrenaline tower',
      },
    ],
  },

  splashbay: {
    slug: 'splashbay',
    name: 'SplashBay',
    tagline: 'Water Splash & Play Area',
    headline: 'Make a Splash at SplashBay',
    description:
      'Enjoy refreshing waves, splash zones, and interactive water activities at SplashBay. This area is perfect for families and visitors who want to enjoy exciting water activities in a fun and relaxed environment.',
    features: [
      'Wave Pool',
      'Interactive Splash Zones',
      'Water Play Areas',
      'Family-Friendly Activities',
      'Refreshing Pool Experiences',
    ],
    suitableFor:
      'Families, teenagers, and visitors looking for fun water activities.',
    safetyInformation:
      'Visitors should follow pool rules, depth warnings, and lifeguard instructions. Children should remain supervised by a responsible adult.',
    visitorInformation: [
      'Follow pool safety rules.',
      'Children must be supervised.',
      'Check water depth before entering.',
      'Follow lifeguard instructions.',
    ],
    cta: 'Enjoy the Splash',
    buttonText: 'Book Tickets',
    heroImage: '/images/3.png',
    heroFallback: 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&w=2000&q=80',
    theme: {
      accentColor: 'text-ocean-500 dark:text-ocean-400',
      taglineColor: 'text-ocean-600 dark:text-aqua-300',
      badgeBg: 'bg-ocean-700 text-white',
      badgeBorder: 'border-ocean-500',
      glowBg: 'from-ocean-500/20 via-aqua-600/10 to-transparent',
      pillBg: 'bg-ocean-50 dark:bg-ocean-950/60 text-ocean-700 dark:text-ocean-300 border-ocean-200 dark:border-ocean-800',
      cardBorder: 'border-ocean-200 dark:border-ocean-900/50',
      cardHover: 'hover:border-ocean-400 dark:hover:border-ocean-600',
      cardIconBg: 'bg-ocean-50 dark:bg-ocean-950 text-ocean-600 dark:text-aqua-400',
      ctaBg: 'bg-gradient-to-r from-ocean-950 via-ocean-900 to-navy-950',
      ctaButton: 'bg-ocean-600 hover:bg-ocean-700 text-white shadow-lg shadow-ocean-600/25',
      intensityLabel: 'Family Fun & Waves',
      intensityLevel: '3 / 5',
      minHeight: 'All Heights (Life Vests Provided)',
    },
    gallery: [
      {
        url: '/images/r.png',
        caption: 'Expansive wave pool with rhythmic ocean-like crests',
      },
      {
        url: '/images/b.png',
        caption: 'Interactive fountain sprays and water splash arches',
      },
      {
        url:'/images/1.jpeg',
        caption: 'Giant wave lagoon surf shows and family swimming',
      },
      {
        url:'/images/p.png',
        caption: 'Interactive tipping buckets and multi-level splash structures',
      },
      {
        url: '/images/d.jpeg',
        caption: 'Refreshing leisure shallows for all ages',
      },
      {
        url: '/images/3.png',
        caption: 'Sun-drenched pool decks surrounding SplashBay',
      },
    ],
  },

  chillbay: {
    slug: 'chillbay',
    name: 'ChillBay',
    tagline: 'Relaxation & Leisure Area',
    headline: 'Slow Down and Enjoy ChillBay',
    description:
      'Take a relaxing break at ChillBay with gentle water activities, shallow splash areas, and family-friendly spaces. It is designed for visitors who want to enjoy the water at a comfortable and relaxing pace.',
    features: [
      'Kids Splash Zone',
      'Gentle Water Slides',
      'Shallow Water Play',
      'Family Relaxation Areas',
      'Gentle Water Activities',
    ],
    suitableFor:
      'Families with young children, toddlers, and visitors looking for a calmer water experience.',
    safetyInformation:
      'Children should always be supervised by a responsible adult. Follow the recommended age, height, and water-depth guidelines for each attraction.',
    visitorInformation: [
      'Supervise children at all times.',
      'Stay within designated areas.',
      'Follow water-depth signs.',
      'Follow lifeguard instructions.',
    ],
    cta: 'Discover ChillBay',
    buttonText: 'Book Tickets',
    heroImage: '/images/2.jpeg',
    heroFallback: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2000&q=80',
    theme: {
      accentColor: 'text-coral-500 dark:text-coral-400',
      taglineColor: 'text-coral-600 dark:text-coral-300',
      badgeBg: 'bg-coral-500 text-white',
      badgeBorder: 'border-coral-400',
      glowBg: 'from-coral-500/20 via-amber-600/10 to-transparent',
      pillBg: 'bg-coral-50 dark:bg-coral-950/60 text-coral-700 dark:text-coral-300 border-coral-200 dark:border-coral-800',
      cardBorder: 'border-coral-200 dark:border-coral-900/50',
      cardHover: 'hover:border-coral-400 dark:hover:border-coral-600',
      cardIconBg: 'bg-coral-50 dark:bg-coral-950 text-coral-600 dark:text-coral-400',
      ctaBg: 'bg-gradient-to-r from-ocean-950 via-slate-900 to-coral-950',
      ctaButton: 'bg-coral-500 hover:bg-coral-600 text-white shadow-lg shadow-coral-500/25',
      intensityLabel: 'Peaceful & Gentle',
      intensityLevel: '1 / 5',
      minHeight: 'No Minimum Height (Toddler Friendly)',
    },
    gallery: [
      {
        url: '/images/2.jpeg',
        caption: 'Colorful kids play structure with gentle water slides and mini buckets',
      },
      {
        url: '/images/c.png',
        caption: 'Sun-drenched loungers and zero-depth entry wading areas',
      },
      {
        url: '/images/2.jpeg',
        caption: 'Serene lazy river drift surrounded by lush greenery',
      },
      {
        url: '/images/p.png',
        caption: 'Safe shallow splash pad designed especially for toddlers',
      },
      {
        url:'/images/d.jpeg',
        caption: 'Shaded family cabanas for all-day private relaxation',
      },
      {
        url:'/images/m.jpeg',
        caption: 'Gentle bubbling water streams and relaxing poolside amenities',
      },
    ],
  },
};
