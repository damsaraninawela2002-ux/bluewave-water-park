import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves, Mail, Lock, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-sand-50 dark:bg-navy-950 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-navy-900 rounded-3xl shadow-soft-lg border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Water-Themed Visual Showcase */}
        <div className="relative bg-ocean-900 p-8 sm:p-12 text-white flex flex-col justify-between">
          {/* Logo & Headline */}
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8 focus:outline-none">
              <Logo size="md" variant="light" />
            </Link>

            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-aqua-200 uppercase tracking-wider mb-4 font-heading">
              Guest Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight mb-4">
              Welcome to BlueWave
            </h1>
            <p className="text-sm text-ocean-100/90 leading-relaxed max-w-md">
              Access your bookings, retrieve admission passes, and manage your visit details.
            </p>
          </div>

          {/* Quick Demo Credentials Widget */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-aqua-200 mb-3 font-heading">
              Instant Demo Fill:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@bluewave.com', 'admin@123')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all text-xs font-medium font-heading"
              >
                <ShieldCheck className="w-4 h-4 text-aqua-300 flex-shrink-0" />
                <div>
                  <span className="block font-bold">Admin Account</span>
                  <span className="block text-[10px] text-ocean-200">admin@bluewave.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('nimal@example.com', 'Customer@123')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all text-xs font-medium font-heading"
              >
                <UserCheck className="w-4 h-4 text-coral-300 flex-shrink-0" />
                <div>
                  <span className="block font-bold">Customer Account</span>
                  <span className="block text-[10px] text-ocean-200">nimal@example.com</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Modern Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 dark:text-white font-heading">
              Sign In to Your Account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-coral"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-ocean-700 dark:text-aqua-400 hover:text-ocean-800 dark:hover:text-aqua-300 hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}