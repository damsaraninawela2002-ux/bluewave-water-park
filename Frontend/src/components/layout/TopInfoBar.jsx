import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Phone, Mail, User, LogOut, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

export default function TopInfoBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="hidden sm:block bg-ocean-950 dark:bg-navy-950 text-slate-300 border-b border-ocean-900/60 dark:border-slate-800/80 text-xs py-2 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hours & Quick Contact */}
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-aqua-400" />
            <span>{siteConfig.hoursSummary}</span>
          </span>
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="flex items-center gap-1.5 text-slate-300 hover:text-aqua-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-aqua-400" />
            <span>{siteConfig.phone}</span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-aqua-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-aqua-400" />
            <span>{siteConfig.email}</span>
          </a>
        </div>

        {/* Right: Auth links + ThemeToggle */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Hi, {user?.name?.split(' ')[0] || 'Member'}</span>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700/60 font-semibold">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-300">
              <Link to="/login" className="hover:text-aqua-300 transition-colors">
                Sign In
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/register" className="hover:text-aqua-300 transition-colors">
                Register
              </Link>
            </div>
          )}

          <div className="h-3.5 w-px bg-slate-800 dark:bg-slate-700" />

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />
        </div>
      </div>
    </div>
  );
}
