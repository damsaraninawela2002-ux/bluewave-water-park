import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullPageLoader from './Loader';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader text="Verifying your credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    toast.error('Access restricted to administrators only');
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
