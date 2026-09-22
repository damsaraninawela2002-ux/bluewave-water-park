import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium font-heading rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-coral-500 hover:bg-coral-600 text-white shadow-coral hover:shadow-lg focus:ring-coral-400',
    secondary:
      'bg-ocean-700 hover:bg-ocean-800 text-white shadow-soft hover:shadow-lg focus:ring-ocean-500',
    aqua:
      'bg-aqua-500 hover:bg-aqua-600 text-white shadow-aqua hover:shadow-lg focus:ring-aqua-400',
    outline:
      'border-2 border-ocean-700 text-ocean-700 hover:bg-ocean-50 focus:ring-ocean-500',
    ghost:
      'text-slate-600 hover:text-ocean-900 hover:bg-ocean-50 focus:ring-slate-300',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-md focus:ring-red-400',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
