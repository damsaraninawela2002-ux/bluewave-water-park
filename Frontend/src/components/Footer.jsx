import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, Shield, Award, Sparkles, MessageSquareQuote } from 'lucide-react';
import Logo from './Logo';
import Bubbles from './Bubbles';
import { siteConfig } from '../config/site';

export default function Footer() {
  return (
    <footer className="relative bg-ocean-950 dark:bg-navy-950 text-slate-300 mt-auto overflow-hidden transition-colors duration-300">
      {/* Animated rising bubbles in footer background */}
      <Bubbles count={20} mobileCount={8} />

      {/* Wave SVG Divider at Top */}
      <div className="w-full overflow-hidden leading-none relative z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-14 text-sand-50 dark:text-navy-950 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block focus:outline-none">
              <Logo size="md" variant="light" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka's premier coastal water park destination offering adrenaline-pumping waterslides, giant wave lagoons, and world-class family memories.
            </p>
            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-2">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-8 h-8 rounded-xl bg-ocean-900/80 border border-ocean-800/80 flex items-center justify-center text-xs text-slate-300 hover:text-aqua-300 hover:bg-ocean-800 hover:scale-105 transition-all shadow-xs"
                >
                  {s.name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest mb-4">
              Explore Park
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/attractions" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Park Attractions & Zones
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Day Passes & Packages
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Instant Online Booking
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Guest Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Contact & Map Directions
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  View & Manage Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operating Hours */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest mb-4">
              Opening Hours
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-aqua-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">{siteConfig.hoursWeekday}</p>
                  <p className="text-[11px] text-slate-400">Slides close at 5:45 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-aqua-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">{siteConfig.hoursWeekend}</p>
                  <p className="text-[11px] text-slate-400">Regular weekend schedule</p>
                </div>
              </li>
              <li className="text-[11px] text-aqua-300/80 pt-1">
                {siteConfig.hoursNotes}
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Contact */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest mb-4">
              Visit & Contact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-aqua-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-aqua-400 flex-shrink-0" />
                <a href={siteConfig.phoneTelLink || `tel:${siteConfig.phoneTel}`} className="text-slate-400 hover:text-white transition">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-aqua-400 flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="text-slate-400 hover:text-white transition">
                  {siteConfig.email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-aqua-300 hover:text-white font-heading transition"
                >
                  <span>Interactive Map & Directions →</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-6 border-t border-ocean-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} BlueWave Water Park. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Horana, Sri Lanka</span>
            <span>&bull;</span>
            <span>Customer Service: {siteConfig.phone}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
