import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Ticket,
  CalendarCheck,
  Star,
  Mail,
  ArrowLeft,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { contactService } from '../services/contactService';
import Logo from './Logo';

export default function AdminSidebar({ isOpen, onClose, isMobile = false }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchUnread() {
      try {
        const data = await contactService.getUnreadCount();
        if (mounted && data?.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        // Silent fallback
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/attractions', label: 'Attractions', icon: Compass },
    { to: '/admin/tickets', label: 'Tickets', icon: Ticket },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/messages', label: 'Messages', icon: Mail, badge: unreadCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link to="/" onClick={handleLinkClick} className="focus:outline-none">
          <Logo size="sm" variant={isDark ? 'light' : 'dark'} />
        </Link>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
          Management
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold font-heading transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-ocean-50 to-aqua-50 dark:from-navy-800 dark:to-navy-800 text-ocean-800 dark:text-aqua-300 border-l-4 border-aqua-500 pl-3 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-ocean-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-navy-800'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-ocean-600 dark:text-aqua-400 flex-shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs animate-pulse">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin User Footer / Quick Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 bg-slate-50/50 dark:bg-navy-950/40">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-ocean-900 dark:hover:text-white hover:bg-white dark:hover:bg-navy-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Back to website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // If Mobile drawer
  if (isMobile) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-navy-900 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    );
  }

  // Desktop static sidebar
  return (
    <aside className="w-64 h-full flex-shrink-0 sticky top-0 h-screen">
      {content}
    </aside>
  );
}
