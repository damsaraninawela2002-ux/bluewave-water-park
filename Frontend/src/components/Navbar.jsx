import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  CalendarCheck,
  Ticket,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Waves,
  Clock,
  Compass,
  HelpCircle,
  Image as ImageIcon,
  Flame,
} from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import TopInfoBar from './layout/TopInfoBar';
import AnnouncementRibbon from './layout/AnnouncementRibbon';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'attractions' | 'tickets' | 'plan' | null
  const [mobileAccordion, setMobileAccordion] = useState({
    attractions: false,
    tickets: false,
    plan: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

  // Scroll listener for sticky blur & elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Keyboard Escape listener to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Helper for hash link navigation (e.g. #offers, #gallery, #faq)
  const handleHashLink = (e, hash) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);

    if (hash === 'park-info' || hash === 'hours') {
      navigate('/about#hours');
    } else if (hash === 'visitor-guidelines' || hash === 'guidelines') {
      navigate('/about#guidelines');
    } else if (location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${hash}`);
    }
  };

  // Dropdown hover helpers for desktop
  const handleDropdownEnter = (name) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileAccordion = (key) => {
    setMobileAccordion((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* LAYER A: Top Info Bar (scrolls away) */}
      <TopInfoBar />

      {/* LAYER B: Rotating Announcement Ribbon (scrolls away, dismissible) */}
      <AnnouncementRibbon />

      {/* LAYER C: Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-md shadow-ocean-950/5 dark:shadow-black/40 border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 sm:py-3'
            : 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/60 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="group focus:outline-none shrink-0">
              <Logo size="md" variant={isDark ? 'light' : 'dark'} />
            </Link>

            {/* Desktop Navigation Links with animated brand color underlines */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Home */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-semibold font-heading transition-colors group ${
                    isActive
                      ? 'text-ocean-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    <span
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-400 transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 scale-x-100'
                          : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                      }`}
                    />
                  </>
                )}
              </NavLink>

              {/* Attractions with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('attractions')}
                onMouseLeave={handleDropdownLeave}
              >
                <NavLink
                  to="/attractions"
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-semibold font-heading transition-colors flex items-center gap-1 group ${
                      isActive || location.pathname.startsWith('/attractions')
                        ? 'text-ocean-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                    }`
                  }
                  aria-expanded={activeDropdown === 'attractions'}
                  aria-haspopup="true"
                >
                  <span>Attractions</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'attractions' ? 'rotate-180 text-aqua-500' : ''
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 ${
                      location.pathname.startsWith('/attractions')
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                    }`}
                  />
                </NavLink>

                {/* Dropdown Menu */}
                {activeDropdown === 'attractions' && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white dark:bg-navy-800 shadow-xl shadow-ocean-950/10 dark:shadow-black/60 border border-slate-100 dark:border-slate-700/80 p-2 z-50 animate-fadeIn">
                    <Link
                      to="/attractions?category=SpeedBay"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ocean-50 dark:bg-navy-900 text-ocean-700 dark:text-aqua-400 flex items-center justify-center font-bold text-xs">
                        <Waves className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          SpeedBay
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          High-speed water slides & drops
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/attractions?category=SplashBay"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ocean-50 dark:bg-navy-900 text-ocean-700 dark:text-aqua-400 flex items-center justify-center font-bold text-xs">
                        <Waves className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          SplashBay
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Water splash & play area
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/attractions?category=ChillBay"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ocean-50 dark:bg-navy-900 text-ocean-700 dark:text-aqua-400 flex items-center justify-center font-bold text-xs">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          ChillBay
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Relaxation & leisure area
                        </p>
                      </div>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-700/60 mt-1 pt-1">
                      <Link
                        to="/attractions"
                        className="block px-3 py-1.5 text-[11px] font-semibold text-aqua-600 dark:text-aqua-400 hover:text-ocean-700 dark:hover:text-aqua-300 font-heading"
                      >
                        View All Attractions →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Tickets with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('tickets')}
                onMouseLeave={handleDropdownLeave}
              >
                <NavLink
                  to="/tickets"
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-semibold font-heading transition-colors flex items-center gap-1 group ${
                      isActive || location.pathname.startsWith('/tickets')
                        ? 'text-ocean-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                    }`
                  }
                  aria-expanded={activeDropdown === 'tickets'}
                  aria-haspopup="true"
                >
                  <span>Tickets</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'tickets' ? 'rotate-180 text-aqua-500' : ''
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 ${
                      location.pathname.startsWith('/tickets')
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                    }`}
                  />
                </NavLink>

                {/* Dropdown Menu */}
                {activeDropdown === 'tickets' && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white dark:bg-navy-800 shadow-xl shadow-ocean-950/10 dark:shadow-black/60 border border-slate-100 dark:border-slate-700/80 p-2 z-50 animate-fadeIn">
                    <Link
                      to="/tickets"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Adult Day Pass
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Ages 13 and above</p>
                      </div>
                      <span className="text-xs font-extrabold text-ocean-800 dark:text-aqua-400 font-heading">
                        Rs. 2,500
                      </span>
                    </Link>

                    <Link
                      to="/tickets"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Child Splash Pass
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Ages 3 to 12</p>
                      </div>
                      <span className="text-xs font-extrabold text-ocean-800 dark:text-aqua-400 font-heading">
                        Rs. 1,500
                      </span>
                    </Link>

                    <Link
                      to="/tickets"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Family Pass
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">2 Adults + 2 Children</p>
                      </div>
                      <span className="text-xs font-extrabold text-coral-600 dark:text-coral-400 font-heading">
                        Rs. 7,000
                      </span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-700/60 mt-1 pt-1">
                      <Link
                        to="/tickets"
                        className="block px-3 py-1.5 text-[11px] font-semibold text-aqua-600 dark:text-aqua-400 hover:text-ocean-700 dark:hover:text-aqua-300 font-heading"
                      >
                        Compare All Passes →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Your Visit with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('plan')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="relative px-3 py-2 text-sm font-semibold font-heading text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300 transition-colors flex items-center gap-1 group focus:outline-none"
                  aria-expanded={activeDropdown === 'plan'}
                  aria-haspopup="true"
                >
                  <span>Plan Your Visit</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'plan' ? 'rotate-180 text-aqua-500' : ''
                    }`}
                  />
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === 'plan' && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white dark:bg-navy-800 shadow-xl shadow-ocean-950/10 dark:shadow-black/60 border border-slate-100 dark:border-slate-700/80 p-2 z-50 animate-fadeIn">
                    <Link
                      to="/about#hours"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-aqua-600 dark:text-aqua-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Opening Hours & Location
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Schedules & directions</p>
                      </div>
                    </Link>

                    <Link
                      to="/about#guidelines"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-aqua-600 dark:text-aqua-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Visitor Guidelines
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Dress code & locker rentals</p>
                      </div>
                    </Link>

                    <a
                      href="#faq"
                      onClick={(e) => handleHashLink(e, 'faq')}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-aqua-600 dark:text-aqua-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          Frequently Asked Questions
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Everything you need to know</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Reviews Link */}
              <NavLink
                to="/reviews"
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-semibold font-heading transition-colors group ${
                    isActive
                      ? 'text-ocean-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Reviews</span>
                    <span
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                      }`}
                    />
                  </>
                )}
              </NavLink>

              {/* Contact Link */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-semibold font-heading transition-colors group ${
                    isActive
                      ? 'text-ocean-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Contact</span>
                    <span
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                      }`}
                    />
                  </>
                )}
              </NavLink>

              {/* My Bookings (Only when authenticated) */}
              {isAuthenticated && (
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-semibold font-heading transition-colors group ${
                      isActive
                        ? 'text-ocean-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-ocean-800 dark:hover:text-aqua-300'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>My Bookings</span>
                      <span
                        className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 ${
                          isActive
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              )}

              {/* Admin Panel (Only for admins) */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-semibold font-heading text-ocean-800 dark:text-aqua-400 hover:text-ocean-900 dark:hover:text-aqua-300 transition-colors group flex items-center gap-1`
                  }
                >
                  <ShieldCheck className="w-4 h-4 text-aqua-600" />
                  <span>Admin</span>
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-aqua-500 transition-all duration-300 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75" />
                </NavLink>
              )}
            </nav>

            {/* Right Action Area (ThemeToggle, Coral Book Now, User Avatar) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <ThemeToggle size="md" />

              {/* Coral "Book Now" Button */}
              <Link to="/book">
                <Button
                  variant="primary"
                  size="md"
                  icon={Ticket}
                  className="shadow-coral font-bold"
                >
                  Book Now
                </Button>
              </Link>

              {/* User Avatar Menu if logged in */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-aqua-400 bg-slate-50/80 dark:bg-navy-800 transition-all text-left focus:outline-none"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ocean-700 to-aqua-500 text-white flex items-center justify-center font-heading font-bold text-xs shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isProfileOpen ? 'rotate-180 text-ocean-700 dark:text-aqua-400' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 p-2 z-50 animate-fadeIn">
                      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                        <p className="text-sm font-bold text-ocean-900 dark:text-white font-heading truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-300">
                          {user?.role} Account
                        </span>
                      </div>

                      <Link
                        to="/my-bookings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-ocean-50 dark:hover:bg-navy-700 hover:text-ocean-700 dark:hover:text-aqua-400 transition-colors font-heading"
                      >
                        <CalendarCheck className="w-4 h-4 text-aqua-600" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        to="/book"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-ocean-50 dark:hover:bg-navy-700 hover:text-ocean-700 dark:hover:text-aqua-400 transition-colors font-heading"
                      >
                        <Ticket className="w-4 h-4 text-coral-500" />
                        <span>Book Tickets</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-navy-700 transition-colors font-heading"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-heading text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Actions: Theme Toggle + Hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle size="sm" />

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors focus:outline-none"
                aria-label="Toggle Navigation Drawer"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Height Slide-In Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[header-height] z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-navy-900 h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                {/* Header in drawer */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Logo size="sm" variant={isDark ? 'light' : 'dark'} />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Coral CTA in Drawer */}
                <Link
                  to="/book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" icon={Ticket} className="w-full justify-center shadow-coral">
                    Book Tickets Now
                  </Button>
                </Link>

                {/* Navigation Links & Accordions */}
                <nav className="space-y-1 pt-2">
                  <NavLink
                    to="/"
                    end
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800"
                  >
                    Home
                  </NavLink>

                  {/* Attractions Accordion */}
                  <div>
                    <button
                      onClick={() => toggleMobileAccordion('attractions')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800 text-left"
                    >
                      <span>Attractions</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileAccordion.attractions ? 'rotate-180 text-aqua-500' : ''
                        }`}
                      />
                    </button>
                    {mobileAccordion.attractions && (
                      <div className="pl-6 pr-2 py-1 space-y-1">
                        <Link
                          to="/attractions?category=SpeedBay"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          SpeedBay (High-Speed Slides)
                        </Link>
                        <Link
                          to="/attractions?category=SplashBay"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          SplashBay (Wave Pool & Splash)
                        </Link>
                        <Link
                          to="/attractions?category=ChillBay"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          ChillBay (Relaxation & Family)
                        </Link>
                        <Link
                          to="/attractions"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-bold text-aqua-600 dark:text-aqua-400"
                        >
                          View All Rides →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Tickets Accordion */}
                  <div>
                    <button
                      onClick={() => toggleMobileAccordion('tickets')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800 text-left"
                    >
                      <span>Tickets & Passes</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileAccordion.tickets ? 'rotate-180 text-coral-500' : ''
                        }`}
                      />
                    </button>
                    {mobileAccordion.tickets && (
                      <div className="pl-6 pr-2 py-1 space-y-1">
                        <Link
                          to="/tickets"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                        >
                          Adult Day Pass (Rs. 2,500)
                        </Link>
                        <Link
                          to="/tickets"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                        >
                          Child Splash Pass (Rs. 1,500)
                        </Link>
                        <Link
                          to="/tickets"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-bold text-coral-600 dark:text-coral-400"
                        >
                          Family Value Pass (Rs. 7,000)
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Plan Your Visit Accordion */}
                  <div>
                    <button
                      onClick={() => toggleMobileAccordion('plan')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800 text-left"
                    >
                      <span>Plan Your Visit</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileAccordion.plan ? 'rotate-180 text-aqua-500' : ''
                        }`}
                      />
                    </button>
                    {mobileAccordion.plan && (
                      <div className="pl-6 pr-2 py-1 space-y-1">
                        <Link
                          to="/about#hours"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          Opening Hours & Schedules
                        </Link>
                        <Link
                          to="/about#guidelines"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          Visitor Guidelines & Dress Code
                        </Link>
                        <a
                          href="#faq"
                          onClick={(e) => handleHashLink(e, 'faq')}
                          className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-aqua-500"
                        >
                          Frequently Asked Questions
                        </a>
                      </div>
                    )}
                  </div>

                  <NavLink
                    to="/reviews"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800"
                  >
                    Reviews
                  </NavLink>

                  <NavLink
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800"
                  >
                    Contact & Location
                  </NavLink>

                  {isAuthenticated && (
                    <NavLink
                      to="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-ocean-50 dark:hover:bg-navy-800"
                    >
                      My Bookings
                    </NavLink>
                  )}

                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl font-semibold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-navy-800"
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                </nav>
              </div>

              {/* Bottom user / auth area in mobile drawer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-aqua-100 dark:bg-aqua-950 text-aqua-800 dark:text-aqua-300">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2 px-3 rounded-xl bg-ocean-700 text-white text-xs font-semibold hover:bg-ocean-800 shadow-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
