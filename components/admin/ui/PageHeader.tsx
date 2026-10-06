import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  breadcrumb?: string | Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  breadcrumb,
  actions,
  action,
  badge,
}: PageHeaderProps) {
  const normalizedBreadcrumbs: Array<{ label: string; href?: string }> = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;
    if (typeof breadcrumb === 'string') {
      return [{ label: 'Admin', href: '/admin' }, { label: breadcrumb }];
    }
    if (Array.isArray(breadcrumb)) {
      return breadcrumb;
    }
    return [];
  }, [breadcrumbs, breadcrumb]);

  const actionElements = actions || action;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
      <div className="space-y-1.5">
        {normalizedBreadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            {normalizedBreadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                {b.href ? (
                  <a
                    href={b.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {b.label}
                  </a>
                ) : (
                  <span className="text-slate-700">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionElements && (
        <div className="flex items-center flex-wrap gap-3 self-start md:self-center shrink-0">
          {actionElements}
        </div>
      )}
    </div>
  );
}
