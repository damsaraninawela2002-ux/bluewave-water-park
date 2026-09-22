import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / verify token on mount
  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout(false);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

// Helper to extract real error messages from backend responses or network errors
function getErrorMessage(error, defaultMessage = 'An unexpected error occurred') {
  if (!error) return defaultMessage;

  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    if (Array.isArray(data.detail)) {
      return data.detail.map((err) => err.msg || err.message || JSON.stringify(err)).join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot connect to backend server. Please make sure the API is running on http://localhost:8000';
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
}

  const login = async (email, password) => {
    try {
      const data = await authService.login(email.trim(), password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error, 'Invalid email or password');
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name.trim(), email.trim(), password);
      toast.success('Account created successfully! Please sign in.');
      return data;
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
