import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { ShieldCheck, Activity, UserCheck, Terminal, Clock, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const logs = await prisma.auditLog.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const createCount = logs.filter((l) => l.action === 'CREATE').length;
  const updateCount = logs.filter((l) => l.action === 'UPDATE').length;
  const deleteCount = logs.filter((l) => l.action === 'DELETE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Security & Governance"
        title="System & Mutation Audit Trail"
        subtitle="Immutable compliance logs tracking all administrative data modifications, authentication events, and role permissions."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Recorded Events"
          value={logs.length.toString()}
          subtitle="Recent system mutations"
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard
          title="Creations & Inserts"
          value={createCount.toString()}
          subtitle="New database records"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Updates & Modifies"
          value={updateCount.toString()}
          subtitle="Config & status changes"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Action Type</th>
                <th className="py-3.5 px-5">Target Entity</th>
                <th className="py-3.5 px-5">Entity ID</th>
                <th className="py-3.5 px-5">Actor / User</th>
                <th className="py-3.5 px-5">Payload Details</th>
                <th className="py-3.5 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <StatusBadge status={log.action} />
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900">{log.entity}</td>
                  <td className="py-4 px-5 font-mono text-slate-500 text-[11px]">
                    {log.entityId || '—'}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900">
                      {log.user?.name || log.userName || 'SYSTEM_AUTOMATION'}
                    </div>
                    {log.user?.role && (
                      <div className="text-[10px] font-mono text-blue-600 font-medium">{log.user.role}</div>
                    )}
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-500 text-[11px] max-w-xs truncate">
                    {log.detailsJson || '—'}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-slate-500 text-[11px]">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
