'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Code2,
  Layers,
  Building2,
  Briefcase,
  FileText,
  Star,
  HelpCircle,
  MapPin,
  TrendingUp,
  MessageSquare,
  PackageCheck,
  Receipt,
  Users,
  Clock,
  CalendarDays,
  UserCheck,
  Shield,
  Activity,
  Settings,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  allowedRoles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({
  userRole = 'SUPER_ADMIN',
}: {
  userRole?: string;
}) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Website CMS & Pages',
      items: [
        {
          name: 'Homepage & Hero',
          href: '/admin/website/homepage',
          icon: <Globe className="w-4 h-4" />,
        },
        {
          name: 'Navigation Menu',
          href: '/admin/website/navigation',
          icon: <Layers className="w-4 h-4" />,
        },
        {
          name: 'Custom Landing Pages',
          href: '/admin/website/pages',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: 'Services',
          href: '/admin/services',
          icon: <Code2 className="w-4 h-4" />,
        },
        {
          name: 'Solutions & Products',
          href: '/admin/solutions',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          name: 'Industries',
          href: '/admin/industries',
          icon: <Briefcase className="w-4 h-4" />,
        },
        {
          name: 'Case Studies / Projects',
          href: '/admin/projects',
          icon: <Star className="w-4 h-4" />,
        },
        {
          name: 'Blog Articles',
          href: '/admin/blog',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: 'Careers & Positions',
          href: '/admin/careers',
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: 'Testimonials',
          href: '/admin/testimonials',
          icon: <Star className="w-4 h-4" />,
        },
        {
          name: 'FAQs Manager',
          href: '/admin/faqs',
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          name: 'Global Offices',
          href: '/admin/offices',
          icon: <MapPin className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Enterprise ERP & Operations',
      items: [
        {
          name: 'CRM & Sales Leads',
          href: '/admin/leads',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          name: 'Inbound Submissions',
          href: '/admin/submissions',
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          name: 'Client Orders & Tracking',
          href: '/admin/orders',
          icon: <PackageCheck className="w-4 h-4" />,
        },
        {
          name: 'Invoices & Finance',
          href: '/admin/invoices',
          icon: <Receipt className="w-4 h-4" />,
        },
        {
          name: 'Employees Directory',
          href: '/admin/hr/employees',
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: 'Attendance Tracker',
          href: '/admin/hr/attendance',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          name: 'Leave Requests',
          href: '/admin/hr/leaves',
          icon: <CalendarDays className="w-4 h-4" />,
        },
        {
          name: 'Job Applications',
          href: '/admin/careers/applications',
          icon: <UserCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'System & Governance',
      items: [
        {
          name: 'User Accounts & RBAC',
          href: '/admin/users',
          icon: <Shield className="w-4 h-4" />,
        },
        {
          name: 'Audit Logs & Telemetry',
          href: '/admin/audit-logs',
          icon: <Activity className="w-4 h-4" />,
        },
        {
          name: 'Platform Settings',
          href: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="EliteGlobex"
            className="h-9 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900 leading-tight">
              ELITE<span className="text-blue-600">GLOBEX</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
              Admin & ERP Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 p-3 space-y-6">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-soft-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {/* Active Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
                  )}

                  <span
                    className={cn(
                      'transition-colors',
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.name}</span>

                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Switcher to Public Site */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-soft-xs"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>View Live Website</span>
          </span>
          <span className="text-[11px] text-slate-400">↗</span>
        </Link>
      </div>
    </aside>
  );
}
