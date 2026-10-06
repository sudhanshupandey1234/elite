'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  AlertCircle,
  Users,
  CheckCircle2,
  Building,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: '$160,000 - $220,000 + Equity',
    description: '',
    status: 'OPEN',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/admin/careers');
      const data = await res.json();
      if (res.ok) setJobs(data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create opening');
      setModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Error saving role');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this opening?')) return;
    try {
      await fetch(`/api/admin/careers?id=${id}`, { method: 'DELETE' });
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = jobs.filter((j) => j.status === 'OPEN').length;
  const totalApplications = jobs.reduce((acc, j) => acc + (j._count?.applications || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Careers & HR"
        title="Career Openings & Engineering Recruitment"
        subtitle="Manage public job postings, recruitment criteria, compensation packages, and applicant pipelines."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Users className="w-4 h-4 text-blue-600" />
              Review Applications
            </Link>
            <button
              onClick={() => {
                setModalOpen(true);
                setError('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Post Job Opening
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Openings"
          value={openCount.toString()}
          subtitle="Positions accepting candidates"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Total Candidate Pipeline"
          value={totalApplications.toString()}
          subtitle="Applied across all listings"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Global Locations"
          value={new Set(jobs.map((j) => j.location)).size.toString()}
          subtitle="Office hubs and remote"
          icon={Building}
          color="green"
        />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search job openings by title, department, or location..."
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Role Title</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Compensation Package</th>
                <th className="py-3.5 px-5">Candidates</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading career listings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <EmptyState
                      title="No job openings found"
                      description={
                        search
                          ? 'Try adjusting your search criteria.'
                          : 'Post your first career opening to start attracting top tech talent.'
                      }
                      actionLabel={search ? undefined : 'Post Job Opening'}
                      onAction={search ? undefined : () => setModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 text-sm">{j.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">/careers/{j.slug}</div>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700">{j.department}</td>
                    <td className="py-4 px-5 text-slate-600">{j.location}</td>
                    <td className="py-4 px-5 font-mono font-bold text-emerald-600">
                      {j.salaryRange || 'Competitive'}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {j._count?.applications || 0} Applicants
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/careers/${j.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="View Live Posting"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(j.id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Opening"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
        title="Post Career Opening"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
              <input
                type="text"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {saving ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
