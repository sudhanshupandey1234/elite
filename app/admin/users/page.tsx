import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { Users, Shield, UserCheck, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      status: true,
      createdAt: true,
    },
  });

  const superAdmins = users.filter((u) => u.role === 'SUPER_ADMIN').length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Security & Access"
        title="Administrative Users & RBAC Permissions"
        subtitle="Manage administrative user accounts, departmental roles, and access tiers across the platform."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total User Accounts"
          value={users.length.toString()}
          subtitle="Provisioned administrative users"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Accounts"
          value={activeUsers.toString()}
          subtitle="Authorized active credentials"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Super Admins"
          value={superAdmins.toString()}
          subtitle="Root policy controllers"
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Corporate Email</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Access Tier (RBAC)</th>
                <th className="py-3.5 px-5">Account Status</th>
                <th className="py-3.5 px-5 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-600 text-xs">{u.email}</td>
                  <td className="py-4 px-5 text-slate-700 font-medium">{u.department || 'Operations'}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-slate-500 text-[11px]">
                    {formatDate(u.createdAt)}
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
