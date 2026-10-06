import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  description?: string;
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  iconBg?: 'blue' | 'green' | 'purple' | 'amber' | 'slate' | 'rose' | 'orange' | 'red';
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'slate' | 'rose' | 'orange' | 'red';
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  description,
  icon: IconInput,
  iconBg,
  color = 'blue',
}: StatCardProps) {
  const chosenColor = iconBg || color;

  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const supportingText = subtitle || description;

  const renderIcon = () => {
    if (React.isValidElement(IconInput)) {
      return IconInput;
    }
    if (typeof IconInput === 'function' || (typeof IconInput === 'object' && IconInput !== null)) {
      const IconComp = IconInput as React.ComponentType<{ className?: string }>;
      return <IconComp className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
            colorStyles[chosenColor] || colorStyles.blue
          )}
        >
          {renderIcon()}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {(change || supportingText) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {change && (
              <span
                className={cn(
                  'font-semibold',
                  changeType === 'positive' && 'text-emerald-600',
                  changeType === 'negative' && 'text-rose-600',
                  changeType === 'neutral' && 'text-slate-500'
                )}
              >
                {change}
              </span>
            )}
            {supportingText && <span className="text-slate-500">{supportingText}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
