import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import {
  TrendingUp,
  PackageCheck,
  Receipt,
  Users,
  ArrowRight,
  Activity,
  Plus,
  Layers,
  Code2,
  FileText,
  Star,
  DollarSign,
  Globe,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export const revalidate = 0; // Fresh metrics on load

export default async function AdminDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch real data from Neon PostgreSQL
  const [
    leadsCount,
    newLeadsCount,
    ordersCount,
    activeOrdersCount,
    employeesCount,
    invoices,
    recentLeads,
    recentOrders,
    recentAudits,
    servicesCount,
    solutionsCount,
    blogCount,
    projectCount,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'IN_DEVELOPMENT' } }),
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.invoice.findMany(),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.service.count(),
    prisma.solution.count(),
    prisma.blogPost.count(),
    prisma.projectCaseStudy.count(),
  ]);

  // Compute Financial Aggregates
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Page Header */}
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle="Real-time enterprise overview, client orders, incoming leads, and financial settlements."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/website/homepage"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Homepage CMS</span>
            </Link>
            <Link
              href="/admin/leads"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-soft-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New CRM Lead</span>
            </Link>
          </div>
        }
      />

      {/* 4 Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Billed"
          value={formatCurrency(totalInvoiced, 'USD')}
          description={`${formatCurrency(totalPaid, 'USD')} collected`}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Client Orders"
          value={ordersCount}
          description={`${activeOrdersCount} in active sprint delivery`}
          icon={<PackageCheck className="w-5 h-5" />}
          iconBg="purple"
        />
        <StatCard
          title="Inbound Leads"
          value={leadsCount}
          description={`${newLeadsCount} awaiting first response`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Core Team"
          value={employeesCount}
          description="Active verified staff"
          icon={<Users className="w-5 h-5" />}
          iconBg="amber"
        />
      </div>

      {/* CMS Content Quick Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/services"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-soft-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Services
              </div>
              <div className="text-[11px] text-slate-500">{servicesCount} Published</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/solutions"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-soft-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Solutions / Products
              </div>
              <div className="text-[11px] text-slate-500">{solutionsCount} Platforms</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/projects"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-soft-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Case Studies
              </div>
              <div className="text-[11px] text-slate-500">{projectCount} Projects</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/blog"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-soft-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Articles & Blog
              </div>
              <div className="text-[11px] text-slate-500">{blogCount} Insights</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Main Two-Column Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders & Inbound Leads */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Orders Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Client Orders</h3>
                  <p className="text-xs text-slate-500">Live order tracking and milestone progress</p>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No orders recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors rounded-xl px-2 -mx-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          • {ord.customerName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ord.serviceName}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-xs">
                        {formatCurrency(ord.amount, ord.currency)}
                      </span>
                      <StatusBadge status={ord.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CRM Leads Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Inbound Sales Leads</h3>
                  <p className="text-xs text-slate-500">New customer inquiries and pipeline opportunities</p>
                </div>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Manage CRM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No inbound leads recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors rounded-xl px-2 -mx-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.email} {lead.company && `• ${lead.company}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {lead.serviceInterest && (
                        <span className="hidden sm:inline-block text-xs text-slate-600">
                          {lead.serviceInterest}
                        </span>
                      )}
                      <StatusBadge status={lead.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Snapshot & Audit Activity */}
        <div className="lg:col-span-4 space-y-8">
          {/* Financial Summary */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-3 border-b border-slate-100">
              <Receipt className="w-4 h-4 text-blue-600" />
              <span>Receivables Overview</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-black text-slate-900 font-mono">
                  {formatCurrency(totalInvoiced, 'USD')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Collected Revenue:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  {formatCurrency(totalPaid, 'USD')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Pending Settlement:</span>
                <span className="font-bold text-amber-600 font-mono">
                  {formatCurrency(totalInvoiced - totalPaid, 'USD')}
                </span>
              </div>
            </div>

            <Link
              href="/admin/invoices"
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold text-center block transition-colors border border-slate-200 mt-4"
            >
              Open Finance Hub →
            </Link>
          </div>

          {/* Audit Activity Stream */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-3 border-b border-slate-100">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Live Audit Telemetry</span>
            </div>

            {recentAudits.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No telemetry recorded yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentAudits.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {a.userName || 'System'}{' '}
                        <span className="font-normal text-slate-500">
                          {a.action.toLowerCase()} {a.entity}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatDate(a.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/admin/audit-logs"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold block text-center pt-2"
            >
              View Full Audit Logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
