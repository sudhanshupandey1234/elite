import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200/90 p-6 md:p-8 shadow-soft-sm transition-all duration-300 relative overflow-hidden',
        hover &&
          'hover:border-slate-300 hover:shadow-soft-lg hover:-translate-y-1',
        glow && 'hover:shadow-glow-blue hover:border-blue-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4 space-y-1.5', className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-lg font-bold text-slate-900 tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-slate-600 leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('pt-2', className)}>{children}</div>;
}
