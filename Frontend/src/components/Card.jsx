import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-navy-800 rounded-2xl border border-slate-100/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-soft dark:shadow-black/20 p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-soft-lg dark:hover:shadow-black/40 hover:-translate-y-1' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
