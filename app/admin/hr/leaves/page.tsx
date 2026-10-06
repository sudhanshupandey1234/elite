'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/admin/hr/leaves');
      const data = await res.json();
      if (res.ok) setLeaves(data.leaves || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/hr/leaves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchLeaves();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter((l) => l.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="HR & Organization"
        title="Leave & PTO Management"
        subtitle="Review employee time-off applications, approve sabbaticals, and manage engineering sprint coverage."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Review"
          value={pendingCount.toString()}
          subtitle="Awaiting HR sign-off"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Approved PTOs"
          value={approvedCount.toString()}
          subtitle="Scheduled time-off"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Rejected / Void"
          value={rejectedCount.toString()}
          subtitle="Declined requests"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Employee</th>
                <th className="py-3.5 px-5">Leave Type</th>
                <th className="py-3.5 px-5">Duration Range</th>
                <th className="py-3.5 px-5">Reason</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No leave requests found"
                      description="Employee PTO and sabbatical applications will appear here for management review."
                    />
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 text-sm">
                        {l.employee.firstName} {l.employee.lastName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium">{l.employee.department}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600">
                      {formatDate(l.startDate)} → {formatDate(l.endDate)}
                    </td>
                    <td className="py-4 px-5 text-slate-700 max-w-xs">{l.reason}</td>
                    <td className="py-4 px-5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      {l.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'APPROVED')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'REJECTED')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          Reviewed: {l.reviewedBy || 'HR Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
