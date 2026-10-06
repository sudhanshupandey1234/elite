import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  href,
  icon,
  iconPosition = 'right',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 border border-blue-600 hover:-translate-y-0.5',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow hover:-translate-y-0.5',
    outline:
      'bg-transparent hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20',
    glow:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5',
  };

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {content}
    </button>
  );
}
