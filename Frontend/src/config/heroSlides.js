/**
 * Hero Slides Configuration
 * Verified high-resolution water-park photography from Unsplash with clean, professional copy.
 */
export const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/2.jpeg',
    alt: 'Swimmers enjoying outdoor resort water slides and crystal blue pools on a sunny day',
    badge: 'BLUEWAVE WATER PARK • HORANA',
    badgeColor: 'bg-white/15 text-white border-white/20',
    headline: 'Make a Splash, Make Memories',
    headlineLines: ['Make a Splash,', 'Make Memories'],
    subtitle: 'Explore exciting water slides, wave lagoons, and fun-filled splash zones for the whole family. Book your tickets online and make your next day unforgettable.',
    primaryCta: { label: 'Book Tickets', to: '/book' },
    secondaryCta: { label: 'Explore Attractions', to: '/attractions' },
  },
  {
    id: 2,
    image: '/images/q.jpeg',
    alt: 'Sunny tropical beach-like wave pool with refreshing turquoise water',
    badge: 'FAMILY ADMISSION',
    badgeColor: 'bg-white/15 text-white border-white/20',
    headline: 'A Full Day of Fun for the Whole Family',
    headlineLines: ['A Full Day of Fun', 'for the Whole Family'],
    subtitle: 'All-inclusive passes covering 2 adults and 2 children, with complimentary locker rental and unlimited lazy river access.',
    primaryCta: { label: 'View Ticket Passes', to: '/tickets' },
    secondaryCta: { label: 'Plan Your Visit', to: '/about', isHash: false },
  },
  {
    id: 3,
    image: '/images/2.jpeg',
    alt: 'High-speed speed slide dropping into sparkling crystal pool water',
    badge: 'SPEEDBAY & SPLASHBAY',
    badgeColor: 'bg-white/15 text-white border-white/20',
    headline: 'Speed, Slides, and Nonstop Thrills',
    headlineLines: ['Speed, Slides,', 'and Nonstop Thrills'],
    subtitle: 'Race down high-speed slides, twist through thrilling turns, and make a splash in our action-packed pools designed for unforgettable adventures.',
    primaryCta: { label: 'Explore SpeedBay', to: '/attractions?category=SpeedBay' },
    secondaryCta: { label: 'Check Park Hours', to: '/about#hours', isHash: false },
  },
  {
    id: 4,
    image: '/images/m.jpeg',
    alt: 'Colorful kids water play structure with tipping buckets and shallow water',
    badge: 'CHILLBAY HAVEN',
    badgeColor: 'bg-white/15 text-white border-white/20',
    headline: 'Little Adventures, Big Smiles',
    headlineLines: ['Little Adventures,', 'Big Smiles'],
    subtitle: 'Safe splash zones, gentle slides, and fun water play areas designed especially for kids and toddlers.',
    primaryCta: { label: 'View ChillBay', to: '/attractions?category=ChillBay' },
    secondaryCta: { label: 'Visitor Guidelines', to: '/about#guidelines', isHash: false },
  },
];
