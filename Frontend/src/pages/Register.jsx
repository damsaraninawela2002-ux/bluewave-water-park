import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/login');
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-sand-50 dark:bg-navy-950 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-navy-900 rounded-3xl shadow-soft-lg border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Water-Themed Visual Showcase */}
        <div className="relative bg-ocean-900 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8 focus:outline-none">
              <Logo size="md" variant="light" />
            </Link>

            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-aqua-200 uppercase tracking-wider mb-4 font-heading">
              New Account
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight mb-4">
              Join BlueWave Water Park
            </h1>
            <p className="text-sm text-ocean-100/90 leading-relaxed max-w-md">
              Create an account to book admission passes online, manage reservations, and view digital tickets.
            </p>
          </div>

          {/* Benefits list */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-ocean-100">
              <CheckCircle2 className="w-4 h-4 text-aqua-300 flex-shrink-0" />
              <span>Instant digital ticket delivery with QR code entry</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ocean-100">
              <CheckCircle2 className="w-4 h-4 text-aqua-300 flex-shrink-0" />
              <span>Free cancellation on pending reservations</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ocean-100">
              <CheckCircle2 className="w-4 h-4 text-aqua-300 flex-shrink-0" />
              <span>Simple booking history and receipt management</span>
            </div>
          </div>
        </div>

        {/* Right: Modern Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 dark:text-white font-heading">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Start your splash adventure with BlueWave Water Park.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jane Doe"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password (min. 6 characters)"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="new-password"
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-coral mt-2"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-ocean-700 dark:text-aqua-400 hover:text-ocean-800 dark:hover:text-aqua-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}