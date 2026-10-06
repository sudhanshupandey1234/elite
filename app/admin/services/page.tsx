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
import { Code2, Plus, Edit2, Trash2, ExternalLink, Layers, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';
import { MediaUploader } from '@/components/admin/ui/MediaUploader';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Cloud & Infrastructure',
    shortDesc: '',
    fullDesc: '',
    features: 'Multi-Region Kubernetes, Zero-Downtime Migration, 99.99% SLA Guarantee',
    techStack: 'Kubernetes, Terraform, AWS, Docker',
    featuredImage: '',
    videoUrl: '',
    status: 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (res.ok) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Cloud & Infrastructure',
      shortDesc: '',
      fullDesc: '',
      features: 'Multi-Region Kubernetes, Zero-Downtime Migration, 99.99% SLA Guarantee',
      techStack: 'Kubernetes, Terraform, AWS, Docker',
      featuredImage: '',
      videoUrl: '',
      status: 'PUBLISHED',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (svc: any) => {
    setEditingService(svc);
    let feats = '';
    let techs = '';
    try {
      const parsedFeats = JSON.parse(svc.featuresJson);
      feats = Array.isArray(parsedFeats) ? parsedFeats.join(', ') : svc.featuresJson;
    } catch (e) {
      feats = svc.featuresJson;
    }
    try {
      const parsedTechs = JSON.parse(svc.techStackJson);
      techs = Array.isArray(parsedTechs) ? parsedTechs.join(', ') : svc.techStackJson;
    } catch (e) {
      techs = svc.techStackJson;
    }

    setFormData({
      title: svc.title,
      slug: svc.slug,
      category: svc.category,
      shortDesc: svc.shortDesc,
      fullDesc: svc.fullDesc,
      features: feats,
      techStack: techs,
      featuredImage: svc.featuredImage || '',
      videoUrl: svc.videoUrl || '',
      status: svc.status,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const featsArr = formData.features.split(',').map((f) => f.trim()).filter(Boolean);
    const techsArr = formData.techStack.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      shortDesc: formData.shortDesc,
      fullDesc: formData.fullDesc,
      featuredImage: formData.featuredImage,
      videoUrl: formData.videoUrl,
      featuresJson: JSON.stringify(featsArr),
      techStackJson: JSON.stringify(techsArr),
      processJson: JSON.stringify(['Discovery', 'Architecture', 'Execution', 'Release']),
      status: formData.status,
    };

    try {
      if (editingService) {
        const res = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingService.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update service');
      } else {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create service');
      }

      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      setError(err.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service practice?')) return;
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalCount = services.length;
  const publishedCount = services.filter((s) => s.status === 'PUBLISHED').length;
  const categoriesCount = new Set(services.map((s) => s.category)).size;

  const filtered = services.filter((svc) => {
    const matchesSearch =
      svc.title.toLowerCase().includes(search.toLowerCase()) ||
      svc.category.toLowerCase().includes(search.toLowerCase()) ||
      svc.shortDesc.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || svc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Engineering Services CMS"
        subtitle="Manage technical practices, architecture offerings, capabilities, and delivery processes."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Website CMS', href: '/admin' },
          { label: 'Services' },
        ]}
        actions={
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service Practice</span>
          </button>
        }
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Practices"
          value={totalCount}
          description="Defined technical capabilities"
          icon={<Code2 className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Published Live"
          value={publishedCount}
          description="Active on /services"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Practice Categories"
          value={categoriesCount}
          description="Cloud, AI, DevOps, Full-Stack"
          icon={<Layers className="w-5 h-5" />}
          iconBg="purple"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by practice name, category, keywords..."
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

      {/* Services Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading engineering services...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={<Code2 className="w-8 h-8" />}
            title="No services found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No practices match your filters.'
                : 'Create your first service practice to start offering digital engineering capabilities.'
            }
            actionText={search || statusFilter !== 'ALL' ? undefined : 'Add Practice'}
            onAction={openCreateModal}
          />
        </div>
      ) : (
        <DataTable>
          <TableHeader>
            <TableHead>Service Practice & Slug</TableHead>
            <TableHead>Practice Category</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((svc) => (
              <TableRow key={svc.id}>
                {/* Title & Slug */}
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                      {svc.title}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      /services/{svc.slug}
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {svc.category}
                  </span>
                </TableCell>

                {/* Summary */}
                <TableCell>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-md leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={svc.status} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/services/${svc.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEditModal(svc)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                      title="Delete Service"
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
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingService ? 'Edit Service Practice' : 'Create Service Practice'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Technical offering details and core architectural features
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
                  <label className="text-xs font-bold text-slate-700">Practice Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cloud Architecture & DevOps"
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
                    placeholder="e.g. cloud-architecture-devops"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Cloud & Infrastructure"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PUBLISHED">Published (Live on site)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Short description displayed on cards and overview pages..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Description & Methodology</label>
                <textarea
                  rows={3}
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="Comprehensive technical scope, architecture standards, and delivery models..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MediaUploader
                  kind="image"
                  label="Product Photo"
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  hint="Shown on the product card and detail page."
                />
                <MediaUploader
                  kind="video"
                  label="Product Video"
                  value={formData.videoUrl}
                  onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  hint="Shown on the product detail page."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Key Features (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Technology Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="Kubernetes, Terraform, AWS, Docker, TypeScript"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
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
                  {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
