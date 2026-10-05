import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: IconInput,
  title,
  description,
  actionText,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  const btnLabel = actionLabel || actionText;

  const renderIcon = () => {
    if (!IconInput) {
      return <Inbox className="w-6 h-6 text-blue-600" />;
    }
    if (React.isValidElement(IconInput)) {
      return IconInput;
    }
    if (typeof IconInput === 'function' || (typeof IconInput === 'object' && IconInput !== null)) {
      const IconComp = IconInput as React.ComponentType<{ className?: string }>;
      return <IconComp className="w-6 h-6 text-blue-600" />;
    }
    return <Inbox className="w-6 h-6 text-blue-600" />;
  };

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
        {renderIcon()}
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>
      {btnLabel && (onAction || actionHref) && (
        <div className="mt-5">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {btnLabel}
            </a>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {btnLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
