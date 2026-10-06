'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  Clock,
  Plus,
  AlertCircle,
  CheckCircle2,
  Laptop,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    status: 'PRESENT',
    notes: 'On-schedule engineering sprint sync',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/admin/hr/attendance');
      const data = await res.json();
      if (res.ok) {
        setAttendance(data.attendance || []);
        setEmployees(data.employees || []);
        if (data.employees?.length > 0 && !formData.employeeId) {
          setFormData((prev) => ({ ...prev, employeeId: data.employees[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/hr/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to record attendance');
      setModalOpen(false);
      fetchAttendance();
    } catch (err: any) {
      setError(err.message || 'Error recording attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
  const remoteCount = attendance.filter((a) => a.status === 'REMOTE').length;
  const exceptionCount = attendance.filter((a) => a.status !== 'PRESENT' && a.status !== 'REMOTE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="HR & Organization"
        title="Attendance & Shift Logs"
        subtitle="Global engineering check-ins, remote sprint logs, and shift availability records."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Record Attendance Log
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="On-Site Present"
          value={presentCount.toString()}
          subtitle="Office campus logged"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Remote Active"
          value={remoteCount.toString()}
          subtitle="Telecommute engineers"
          icon={Laptop}
          color="blue"
        />
        <StatCard
          title="Exceptions / Leaves"
          value={exceptionCount.toString()}
          subtitle="Late or absent shifts"
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Employee & ID</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Shift Status</th>
                <th className="py-3.5 px-5">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading attendance logs...
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <EmptyState
                      title="No attendance entries recorded"
                      description="Create the first attendance check-in log for engineering shifts."
                      actionLabel="Record Attendance"
                      onAction={() => setModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 text-sm">
                        {att.employee.firstName} {att.employee.lastName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {att.employee.employeeId}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700">
                      {att.employee.department}
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600">
                      {formatDate(att.date)}
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={att.status} />
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      {att.remarks || att.notes || 'Standard shift log'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Shift Attendance"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="PRESENT">PRESENT (Office Campus)</option>
              <option value="REMOTE">REMOTE (Telecommute)</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="ABSENT">ABSENT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Shift Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
