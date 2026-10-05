'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  Users,
  Plus,
  Trash2,
  AlertCircle,
  Building2,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    salary: '140000',
    status: 'ACTIVE',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/admin/hr/employees');
      const data = await res.json();
      if (res.ok) setEmployees(data.employees || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create employee');
      setModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      setError(err.message || 'Error creating employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee record?')) return;
    try {
      await fetch(`/api/admin/hr/employees?id=${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.designation.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter((e) => e.status === 'ACTIVE').length;
  const deptCount = new Set(employees.map((e) => e.department)).size;
  const totalPayroll = employees.reduce((acc, e) => acc + (Number(e.salary) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="HR & Organization"
        title="Employee Directory & Roster"
        subtitle="Manage engineering talent records, role designations, department allocations, and compensation."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Onboard New Employee
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Headcount"
          value={employees.length.toString()}
          subtitle="Staff and engineers"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Status"
          value={activeCount.toString()}
          subtitle="Full-time active roster"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Departments"
          value={deptCount.toString()}
          subtitle="Functional divisions"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Annual Payroll"
          value={formatCurrency(totalPayroll)}
          subtitle="Total compensation"
          icon={DollarSign}
          color="orange"
        />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search employees by name, corporate email, department, or title..."
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Employee</th>
                <th className="py-3.5 px-5">Employee ID</th>
                <th className="py-3.5 px-5">Department & Role</th>
                <th className="py-3.5 px-5">Annual Salary</th>
                <th className="py-3.5 px-5">Joining Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading employee directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <EmptyState
                      title="No employees found"
                      description={
                        search
                          ? 'Try modifying your search criteria.'
                          : 'Onboard your first team member to start managing company HR records.'
                      }
                      actionLabel={search ? undefined : 'Onboard Employee'}
                      onAction={search ? undefined : () => setModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.firstName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600 font-medium">
                      {emp.employeeId}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900">{emp.designation}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{emp.department}</div>
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-emerald-600">
                      {emp.salary ? formatCurrency(emp.salary) : 'Confidential'}
                    </td>
                    <td className="py-4 px-5 text-slate-500 text-xs">
                      {formatDate(emp.joinDate || emp.joiningDate || emp.createdAt)}
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        title="Onboard New Employee"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary ($ / yr)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
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
              {saving ? 'Saving...' : 'Confirm Onboarding'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
