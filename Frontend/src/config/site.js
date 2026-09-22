/**
 * Centralized Site Configuration for BlueWave Water Park
 * Single source of truth for branding, contact info, coordinates, hours, and travel guides.
 */
export const siteConfig = {
  name: 'BlueWave Water Park',
  tagline: "Sri Lanka's Premier Splash Destination",
  currency: 'Rs.',
  currencyCode: 'LKR',

  // Contact Details
  address: 'BlueWave Water Park, Horana, Sri Lanka',
  phone: '077 509 6262',
  phoneTel: '0775096262',
  phoneTelLink: 'tel:0775096262',
  email: 'damsaraninawela2002@gmail.com',
  inquiriesEmail: 'damsaraninawela2002@gmail.com',

  // Geographic coordinates for Horana Park
  coordinates: {
    lat: 6.7147,
    lng: 80.0616,
  },

  // OpenStreetMap embed URL (no API key required)
  // Bounding box centered around Horana
  osmEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=80.0466%2C6.7047%2C80.0766%2C6.7247&layer=mapnik&marker=6.7147%2C80.0616',

  // Google Maps Directions External Link
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=6.7147,80.0616',

  // Operating Hours
  hoursSummary: 'Open Tue – Sun: 9:00 AM – 7:30 PM (Closed Mon)',
  hoursWeekday: 'Tue – Fri: 09:30 AM – 6:00 PM',
  hoursWeekend: 'Sat – Sun: 09:00 AM – 7:30 PM',
  hoursHoliday: 'Public Holidays: 09:00 AM – 8:00 PM',
  hoursNotes: 'Slides close 15 minutes before park closing. Closed Mondays for deep filtration maintenance.',

  // WhatsApp Integration
  whatsappNumber: '94775096262',
  whatsappDefaultMessage: "Hi BlueWave! I'd like to know more about tickets and packages.",
  getWhatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      this.whatsappDefaultMessage
    )}`;
  },

  // Getting Here Information
  gettingHere: [
    {
      title: 'By Express Bus & Transit',
      desc: 'Take any Panadura-Ratnapura (Route 120 / Route 450) or Colombo-Horana express bus to Horana Central Bus Terminal. Our park shuttle runs every 20 minutes directly to the main ticket plaza.',
      icon: 'Bus',
    },
    {
      title: 'By Car & On-Site Parking',
      desc: 'Easily accessible via Southern Expressway (E01) Gelanigama or Kahathuduwa interchange, connecting to Panadura-Horana Road (A8). Secure on-site parking for 400+ vehicles with dedicated EV chargers.',
      icon: 'Car',
    },
    {
      title: 'Nearby Landmarks',
      desc: 'Situated just 5 minutes from Horana town center, amidst lush tropical greenery along the gentle water canal corridors of Western Province.',
      icon: 'MapPin',
    },
  ],

  // Social Media Links
  socials: [
    { name: 'Facebook', url: 'https://facebook.com', handle: '@BlueWavePark' },
    { name: 'Instagram', url: 'https://instagram.com', handle: '@bluewavepark' },
    { name: 'YouTube', url: 'https://youtube.com', handle: 'BlueWaveWaterPark' },
    { name: 'TripAdvisor', url: 'https://tripadvisor.com', handle: 'BlueWave Horana' },
  ],
};

export default siteConfig;
