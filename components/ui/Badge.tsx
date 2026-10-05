import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'cyan' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'blue',
  size = 'md',
  className,
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    blue: 'bg-blue-600',
    cyan: 'bg-sky-600',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    slate: 'bg-slate-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border shadow-soft-sm select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}
