import React from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div
      className={cn(
        'w-full bg-white border border-slate-200 rounded-2xl shadow-soft-sm overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50/80 border-b border-slate-200">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHead({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <th
      className={cn(
        'px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        align === 'left' && 'text-left',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors hover:bg-slate-50/70',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <td
      className={cn(
        'px-6 py-4 text-xs sm:text-sm text-slate-700 align-middle',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        align === 'left' && 'text-left',
        className
      )}
    >
      {children}
    </td>
  );
}
