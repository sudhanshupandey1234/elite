'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import {
  DataTable,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/admin/ui/DataTable';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Building,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientName: '',
    industry: 'Financial Technology',
    shortDesc: '',
    challenge: '',
    solution: '',
    isFeatured: false,
    isSampleData: false,
    status: 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok) setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      title: '',
      slug: '',
      clientName: '',
      industry: 'Financial Technology',
      shortDesc: '',
      challenge: '',
      solution: '',
      isFeatured: false,
      isSampleData: false,
      status: 'PUBLISHED',
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (prj: any) => {
    setEditing(prj);
    setFormData({
      title: prj.title,
      slug: prj.slug,
      clientName: prj.clientName,
      industry: prj.industry,
      shortDesc: prj.shortDesc,
      challenge: prj.challenge,
      solution: prj.solution,
      isFeatured: prj.isFeatured,
      isSampleData: prj.isSampleData,
      status: prj.status,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editing) {
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...formData }),
        });
        if (!res.ok) throw new Error('Failed to update project');
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create project');
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Error saving case study');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics
  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === 'PUBLISHED').length;
  const featuredCount = projects.filter((p) => p.isFeatured).length;
  const realCount = projects.filter((p) => !p.isSampleData).length;

  const filtered = projects.filter((prj) => {
    const matchesSearch =
      prj.title.toLowerCase().includes(search.toLowerCase()) ||
      prj.clientName.toLowerCase().includes(search.toLowerCase()) ||
      prj.industry.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || prj.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Case Studies & Projects"
        subtitle="Manage verified customer case studies, engineering challenges, architecture solutions, and technology stacks."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Website CMS', href: '/admin' },
          { label: 'Case Studies' },
        ]}
        actions={
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case Study</span>
          </button>
        }
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={totalCount}
          description="Portfolio case studies"
          icon={<Briefcase className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Published Live"
          value={publishedCount}
          description="Visible on /projects"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Featured Showcase"
          value={featuredCount}
          description="Highlighted on Homepage"
          icon={<Star className="w-5 h-5" />}
          iconBg="amber"
        />
        <StatCard
          title="Verified Client Deliverables"
          value={realCount}
          description="Non-sample records"
          icon={<Building className="w-5 h-5" />}
          iconBg="purple"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by project title, client, industry..."
        />

        <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading case studies...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title="No case studies found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No projects match your current filters.'
                : 'Create your first project case study to showcase your engineering achievements.'
            }
            actionText={search || statusFilter !== 'ALL' ? undefined : 'Add Case Study'}
            onAction={openCreate}
          />
        </div>
      ) : (
        <DataTable>
          <TableHeader>
            <TableHead>Case Study & Overview</TableHead>
            <TableHead>Client & Sector</TableHead>
            <TableHead>Highlights</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((prj) => (
              <TableRow key={prj.id}>
                {/* Title & Slug */}
                <TableCell>
                  <div className="max-w-md">
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                      {prj.title}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      /projects/{prj.slug}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                      {prj.shortDesc}
                    </div>
                  </div>
                </TableCell>

                {/* Client / Sector */}
                <TableCell>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {prj.clientName}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">{prj.industry}</div>
                  </div>
                </TableCell>

                {/* Badges / Flags */}
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {prj.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ★ Featured
                      </span>
                    )}
                    {prj.isSampleData ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Sample Demo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Client
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={prj.status} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/projects/${prj.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(prj)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                      title="Edit Case Study"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prj.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                      title="Delete Case Study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-soft-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editing ? 'Edit Case Study' : 'Create Case Study'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Portfolio case study details and architecture blueprint
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Next-Gen Core Banking Platform"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. core-banking-platform"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Client / Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Global FinTech Leader"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Industry Sector *</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Financial Technology"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Short Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief summary of the engagement..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">The Challenge</label>
                <textarea
                  rows={2}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="What operational or architectural problem was solved?"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">The Solution & Architecture</label>
                <textarea
                  rows={2}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How did EliteGlobex engineer the solution?"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-semibold">Feature on Home</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSampleData}
                    onChange={(e) => setFormData({ ...formData, isSampleData: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-semibold">Mark as Demo Data</span>
                </label>

                <div className="space-y-1">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-soft-xs"
                >
                  {saving ? 'Saving...' : editing ? 'Update Case Study' : 'Create Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
