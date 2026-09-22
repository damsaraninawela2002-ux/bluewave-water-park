import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80',
    aqua: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
    ocean: 'bg-sky-50 text-sky-800 border-sky-200/80',
    coral: 'bg-rose-50 text-rose-600 border-rose-200/80',
    admin: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };

  // Resolve status variants automatically
  let resolvedVariant = variant;
  if (typeof children === 'string') {
    const val = children.toLowerCase();
    if (val === 'pending') resolvedVariant = 'pending';
    else if (val === 'confirmed') resolvedVariant = 'confirmed';
    else if (val === 'cancelled') resolvedVariant = 'cancelled';
    else if (val.includes('water slides')) resolvedVariant = 'aqua';
    else if (val.includes('wave pool')) resolvedVariant = 'ocean';
    else if (val.includes('kids area')) resolvedVariant = 'coral';
    else if (val === 'admin') resolvedVariant = 'admin';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-heading ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[resolvedVariant] || variantStyles.default} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {children}
    </span>
  );
}
