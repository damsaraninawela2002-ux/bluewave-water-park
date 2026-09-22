import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Menu, ShieldCheck, User, LogOut, ArrowLeft } from 'lucide-react';

import ThemeToggle from './ThemeToggle';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ocean-950/60 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Collapsible Sidebar */}
      <AdminSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile
      />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar showing Admin Name & Controls */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Left: Mobile Drawer Trigger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-ocean-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 md:hidden transition-colors"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-7 h-7 rounded-lg bg-ocean-50 dark:bg-navy-800 text-ocean-700 dark:text-aqua-400 items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-ocean-900 dark:text-white font-heading">
                Admin Console
              </span>
            </div>
          </div>

          {/* Right: Admin Profile Info, ThemeToggle & Quick Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle size="sm" />

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ocean-700 to-aqua-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-ocean-900 dark:text-white font-heading block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-semibold text-aqua-700 dark:text-aqua-400 uppercase tracking-wider">
                  Admin Access
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
