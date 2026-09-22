import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Persistent Effects & Layout
import BubblesBackground from './components/BubblesBackground';
import FloatingActions from './components/layout/FloatingActions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Customer Pages
import Home from './pages/customer/Home';
import Attractions from './pages/customer/Attractions';
import Tickets from './pages/customer/Tickets';
import BookTicket from './pages/customer/BookTicket';
import MyBookings from './pages/customer/MyBookings';
import Reviews from './pages/customer/Reviews';
import Contact from './pages/customer/Contact';
import About from './pages/customer/About';
import AttractionDetails from './pages/customer/AttractionDetails';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAttractions from './pages/admin/AdminAttractions';
import AdminTickets from './pages/admin/AdminTickets';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMessages from './pages/admin/AdminMessages';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isDark } = useTheme();

  return (
    <>
      {/* Dynamic Themed Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? '#16243A' : '#0C4A6E',
            color: '#FFFFFF',
            border: isDark ? '1px solid rgba(51, 65, 85, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '12px 18px',
            fontSize: '13px',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: isDark ? '0 10px 25px -3px rgba(0, 0, 0, 0.5)' : '0 10px 25px -3px rgba(3, 105, 161, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#06B6D4',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: isDark ? '#881337' : '#E11D48',
              color: '#FFFFFF',
            },
          },
        }}
      />

      {/* Site-wide Rising Water Bubbles Background */}
      <BubblesBackground />

      {/* Main Content Layout Container (Above bubbles with relative z-10) */}
      <div className="flex flex-col min-h-screen bg-sand-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative z-10">
        {/* Render 3-Layer Customer Navbar only when not in /admin routes */}
        {!isAdminRoute && <Navbar />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/attractions/speedbay" element={<AttractionDetails slug="speedbay" />} />
            <Route path="/attractions/splashbay" element={<AttractionDetails slug="splashbay" />} />
            <Route path="/attractions/chillbay" element={<AttractionDetails slug="chillbay" />} />
            <Route path="/attractions/:slug" element={<AttractionDetails />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Protected Routes */}
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes Nested in AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="attractions" element={<AdminAttractions />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Render Customer Footer only when not in /admin routes */}
        {!isAdminRoute && <Footer />}

        {/* Floating Action Buttons (WhatsApp & Back-to-Top) on customer routes */}
        {!isAdminRoute && <FloatingActions />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
