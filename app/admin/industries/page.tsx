'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  Building2,
  Plus,
  Trash2,
  ExternalLink,
  AlertCircle,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    summary: '',
    fullDesc: '',
    status: 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchIndustries = async () => {
    try {
      const res = await fetch('/api/admin/industries');
      const data = await res.json();
      if (res.ok) setIndustries(data.industries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create industry');
      setModalOpen(false);
      fetchIndustries();
    } catch (err: any) {
      setError(err.message || 'Error saving industry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this industry?')) return;
    try {
      await fetch(`/api/admin/industries?id=${id}`, { method: 'DELETE' });
      fetchIndustries();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = industries.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.summary && i.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = industries.filter((i) => i.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="CMS & Solutions"
        title="Industry Sectors & Verticals"
        subtitle="Manage industry vertical pages, specialized compliance standards, and sector architecture solutions."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Industry Sector
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Industries"
          value={industries.length.toString()}
          subtitle="Target enterprise sectors"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Live on Public Site"
          value={publishedCount.toString()}
          subtitle="Published sector pages"
          icon={Globe2}
          color="green"
        />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search industries by name or keywords..."
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Industry Sector</th>
                <th className="py-3.5 px-5">URL Route</th>
                <th className="py-3.5 px-5">Summary Scope</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading industry sectors...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <EmptyState
                      title="No industries found"
                      description={
                        search
                          ? 'Try modifying your search query.'
                          : 'Add your first industry vertical to showcase sector-specific architectures.'
                      }
                      actionLabel={search ? undefined : 'Add Industry Sector'}
                      onAction={search ? undefined : () => setModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 text-sm">{ind.name}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-500 text-xs">
                      /industries/{ind.slug}
                    </td>
                    <td className="py-4 px-5 text-slate-600 max-w-sm truncate">
                      {ind.summary || ind.shortDesc || 'Comprehensive enterprise solutions'}
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={ind.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/industries/${ind.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(ind.id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Industry"
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
        title="Add Industry Sector"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
            <textarea
              required
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Architectural Overview</label>
            <textarea
              required
              rows={3}
              value={formData.fullDesc}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
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
              {saving ? 'Saving...' : 'Save Industry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
