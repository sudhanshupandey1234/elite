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
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Star,
  Shield,
} from 'lucide-react';

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'Enterprise Platform',
    shortDesc: '',
    fullDesc: '',
    pricingModel: 'Custom Enterprise',
    status: 'PUBLISHED',
    isFeatured: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSolutions = async () => {
    try {
      const res = await fetch('/api/admin/solutions');
      const data = await res.json();
      if (res.ok) setSolutions(data.solutions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      category: 'Enterprise Platform',
      shortDesc: '',
      fullDesc: '',
      pricingModel: 'Custom Enterprise',
      status: 'PUBLISHED',
      isFeatured: true,
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (sol: any) => {
    setEditing(sol);
    setFormData({
      name: sol.name,
      slug: sol.slug,
      tagline: sol.tagline || '',
      category: sol.category || 'Enterprise Platform',
      shortDesc: sol.shortDesc || '',
      fullDesc: sol.fullDesc || '',
      pricingModel: sol.pricingModel || 'Custom Enterprise',
      status: sol.status || 'PUBLISHED',
      isFeatured: !!sol.isFeatured,
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
        const res = await fetch('/api/admin/solutions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...formData }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/admin/solutions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            featuresJson: JSON.stringify(['Enterprise Ready', 'Multi-tenant Architecture', 'SOC2 Compliant']),
            techStackJson: JSON.stringify(['Next.js', 'PostgreSQL', 'Docker']),
          }),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      setModalOpen(false);
      fetchSolutions();
    } catch (err: any) {
      setError(err.message || 'Error saving software product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software product?')) return;
    try {
      await fetch(`/api/admin/solutions?id=${id}`, { method: 'DELETE' });
      fetchSolutions();
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics
  const totalCount = solutions.length;
  const publishedCount = solutions.filter((s) => s.status === 'PUBLISHED').length;
  const featuredCount = solutions.filter((s) => s.isFeatured).length;

  const filtered = solutions.filter((sol) => {
    const matchesSearch =
      sol.name.toLowerCase().includes(search.toLowerCase()) ||
      (sol.tagline && sol.tagline.toLowerCase().includes(search.toLowerCase())) ||
      (sol.category && sol.category.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || sol.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Software Solutions & Products CMS"
        subtitle="Manage proprietary enterprise platforms (e.g. OmniCloud ERP, CogniFlow AI, SecureShield IAM), architecture modules, and documentation."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Website CMS', href: '/admin' },
          { label: 'Solutions & Products' },
        ]}
        actions={
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Software Product</span>
          </button>
        }
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Platforms"
          value={totalCount}
          description="Proprietary software suites"
          icon={<Building2 className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Published Live"
          value={publishedCount}
          description="Active on /solutions"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Featured Showcase"
          value={featuredCount}
          description="Highlighted on Homepage"
          icon={<Star className="w-5 h-5" />}
          iconBg="purple"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by product name, tagline, category..."
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

      {/* Solutions Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading software products...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={<Building2 className="w-8 h-8" />}
            title="No software products found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No platforms match your filters.'
                : 'Create your first proprietary software platform to showcase products on the public site.'
            }
            actionText={search || statusFilter !== 'ALL' ? undefined : 'Add Platform'}
            onAction={openCreate}
          />
        </div>
      ) : (
        <DataTable>
          <TableHeader>
            <TableHead>Platform & Tagline</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Pricing Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((sol) => (
              <TableRow key={sol.id}>
                {/* Name & Slug */}
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                      <span>{sol.name}</span>
                      {sol.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{sol.tagline}</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      /solutions/{sol.slug}
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {sol.category || 'Platform'}
                  </span>
                </TableCell>

                {/* Pricing Model */}
                <TableCell>
                  <span className="text-xs font-semibold text-slate-700">
                    {sol.pricingModel || 'Custom Enterprise'}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={sol.status} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/solutions/${sol.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(sol)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sol.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                      title="Delete Product"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-soft-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editing ? 'Edit Software Platform' : 'Add Software Platform'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proprietary product specifications, tagline, and pricing model
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
                  <label className="text-xs font-bold text-slate-700">Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. OmniCloud ERP"
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
                    placeholder="e.g. omnicloud-erp"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tagline *</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Enterprise Operations, Financials & Supply Chain"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Enterprise Platform"
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
                  placeholder="Short description displayed on cards and overview grids..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Description & Architecture</label>
                <textarea
                  rows={3}
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="Detailed platform architecture, module breakdown, security..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pricing Model</label>
                  <input
                    type="text"
                    value={formData.pricingModel}
                    onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                    placeholder="Custom Quote"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer self-end">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-semibold">Featured</span>
                </label>
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
                  {saving ? 'Saving...' : editing ? 'Update Platform' : 'Create Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
