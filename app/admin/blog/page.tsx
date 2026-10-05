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
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Clock,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryName: 'Artificial Intelligence',
    authorName: 'Engineering Editorial Team',
    authorRole: 'Senior Research Team',
    readingTime: '6 min read',
    status: 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryName: 'Artificial Intelligence',
      authorName: 'Engineering Editorial Team',
      authorRole: 'Senior Research Team',
      readingTime: '6 min read',
      status: 'PUBLISHED',
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (post: any) => {
    setEditing(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      categoryName: post.categoryName || 'Technology',
      authorName: post.authorName || 'EliteGlobex Editorial',
      authorRole: post.authorRole || 'Lead Technologist',
      readingTime: post.readingTime || '5 min read',
      status: post.status || 'PUBLISHED',
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
        const res = await fetch('/api/admin/blog', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...formData }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            tagsJson: JSON.stringify(['Engineering', 'Architecture', 'Cloud']),
          }),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      setModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      setError(err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length;
  const draftCount = posts.filter((p) => p.status === 'DRAFT').length;

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.authorName.toLowerCase().includes(search.toLowerCase()) ||
      post.categoryName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Blog & Technical Insights CMS"
        subtitle="Publish engineering whitepapers, research articles, cloud architecture guides, and technology insights."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Website CMS', href: '/admin' },
          { label: 'Blog & Articles' },
        ]}
        actions={
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        }
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Articles"
          value={totalCount}
          description="Published & draft insights"
          icon={<FileText className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Live Articles"
          value={publishedCount}
          description="Visible on /blog"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Drafts in Progress"
          value={draftCount}
          description="Unpublished works"
          icon={<Clock className="w-5 h-5" />}
          iconBg="amber"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by article title, author, category..."
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

      {/* Posts Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading blog articles...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No articles found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No blog articles match your current filters.'
                : 'Write your first technical article to start sharing engineering insights.'
            }
            actionText={search || statusFilter !== 'ALL' ? undefined : 'Write Article'}
            onAction={openCreate}
          />
        </div>
      ) : (
        <DataTable>
          <TableHeader>
            <TableHead>Article Title & Excerpt</TableHead>
            <TableHead>Author & Role</TableHead>
            <TableHead>Category & Read Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post.id}>
                {/* Title & Slug */}
                <TableCell>
                  <div className="max-w-md">
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                      {post.title}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      /blog/{post.slug}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                      {post.excerpt}
                    </p>
                  </div>
                </TableCell>

                {/* Author */}
                <TableCell>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {post.authorName}
                    </div>
                    <div className="text-xs text-slate-500">{post.authorRole}</div>
                  </div>
                </TableCell>

                {/* Category & Reading Time */}
                <TableCell>
                  <div className="space-y-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {post.categoryName}
                    </span>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                      title="View Public Article"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(post)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                      title="Delete Article"
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
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editing ? 'Edit Article' : 'Write New Article'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Editorial content, author attribution, and publication status
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
                  <label className="text-xs font-bold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Scaling Enterprise Kubernetes on Multi-Cloud"
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
                    placeholder="e.g. scaling-enterprise-kubernetes"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    placeholder="e.g. Cloud Architecture"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Alexander Wright"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Reading Time</label>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Compelling abstract displayed on article cards..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Article Content (Markdown / Text)</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article body content..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="PUBLISHED">Published (Live on site)</option>
                  <option value="DRAFT">Draft</option>
                </select>
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
                  {saving ? 'Saving...' : editing ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
