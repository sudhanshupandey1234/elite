'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MoveUp,
  MoveDown,
  X,
  Layers,
} from 'lucide-react';

export default function AdminPagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editor mode
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(null);

  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDesc: '',
    status: 'PUBLISHED',
    blocks: [] as any[],
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/website/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to fetch custom pages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleStartCreate = () => {
    setCurrentPage(null);
    setPageForm({
      title: '',
      slug: '',
      seoTitle: '',
      seoDesc: '',
      status: 'PUBLISHED',
      blocks: [
        {
          blockType: 'HERO',
          title: 'Welcome to Our New Initiative',
          subtitle: 'INNOVATION & TECHNOLOGY',
          content: 'We empower organizations through scalable digital architectures and robust engineering.',
          mediaUrl: '',
          configJson: JSON.stringify({ primaryBtnText: 'Get In Touch', primaryBtnUrl: '/contact' }),
        },
      ],
    });
    setIsEditing(true);
  };

  const handleStartEdit = (page: any) => {
    setCurrentPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      seoTitle: page.seoTitle || '',
      seoDesc: page.seoDesc || '',
      status: page.status || 'PUBLISHED',
      blocks: page.blocks || [],
    });
    setIsEditing(true);
  };

  const handleAddBlock = (type: string) => {
    const newBlock: any = {
      blockType: type,
      title: 'Section Heading',
      subtitle: 'Eyebrow text',
      content: 'Detailed description text here...',
      mediaUrl: '',
      configJson: '',
    };

    if (type === 'FEATURES_GRID') {
      newBlock.configJson = JSON.stringify({
        items: [
          { title: 'Feature One', desc: 'High-velocity architecture engineered for scale.' },
          { title: 'Feature Two', desc: 'Bank-grade zero trust security and encryption.' },
          { title: 'Feature Three', desc: 'Continuous deployment with automated CI/CD.' },
        ],
      });
    } else if (type === 'FAQ_ACCORDION') {
      newBlock.configJson = JSON.stringify({
        faqs: [
          { q: 'How does onboarding work?', a: 'Our lead architects conduct initial discovery and provide scoping within 48 hours.' },
          { q: 'What compliance standards are supported?', a: 'We build systems adhering to SOC2, ISO27001, and HIPAA protocols.' },
        ],
      });
    } else if (type === 'CTA_BANNER') {
      newBlock.configJson = JSON.stringify({
        btnText: 'Contact Our Team',
        btnUrl: '/contact',
      });
    }

    setPageForm({
      ...pageForm,
      blocks: [...pageForm.blocks, newBlock],
    });
  };

  const handleRemoveBlock = (index: number) => {
    const updated = [...pageForm.blocks];
    updated.splice(index, 1);
    setPageForm({ ...pageForm, blocks: updated });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const updated = [...pageForm.blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPageForm({ ...pageForm, blocks: updated });
  };

  const handleBlockChange = (index: number, field: string, value: any) => {
    const updated = [...pageForm.blocks];
    updated[index][field] = value;
    setPageForm({ ...pageForm, blocks: updated });
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let res;
      if (currentPage) {
        res = await fetch('/api/admin/website/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentPage.id, ...pageForm }),
        });
      } else {
        res = await fetch('/api/admin/website/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageForm),
        });
      }

      if (res.ok) {
        setMessage({
          type: 'success',
          text: currentPage ? 'Custom page updated!' : 'Custom page created!',
        });
        setIsEditing(false);
        fetchPages();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save page.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      const res = await fetch(`/api/admin/website/pages?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPages(pages.filter((p) => p.id !== id));
        setMessage({ type: 'success', text: 'Page deleted successfully.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <PageHeader
        breadcrumb="CMS & Website"
        title="Custom Landing Pages Builder"
        subtitle="Build custom URL pages (e.g. /page/enterprise-guide, /page/partnership) with dynamic blocks without touching code."
        action={
          !isEditing && (
            <button
              onClick={handleStartCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          )
        }
      />

      {/* Alert Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* List View */}
      {!isEditing && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="py-3 px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Published Pages ({pages.length})</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading pages...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No custom pages created yet"
                description="Click 'Create New Page' to build a custom landing page with modular blocks."
                actionLabel="Create New Page"
                onAction={handleStartCreate}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pages.map((p) => (
                <div
                  key={p.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">{p.title}</span>
                      <StatusBadge status={p.status || 'PUBLISHED'} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-mono text-blue-600 font-medium">/page/{p.slug}</span>
                      <span>•</span>
                      <span>{p.blocks?.length || 0} Content Blocks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/page/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs flex items-center gap-1.5 transition-colors border border-blue-200 font-semibold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Blocks</span>
                    </button>
                    <button
                      onClick={() => handleDeletePage(p.id)}
                      className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor / Page Builder View */}
      {isEditing && (
        <form onSubmit={handleSavePage} className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {currentPage ? `Editing: ${currentPage.title}` : 'Create New Dynamic Landing Page'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Page Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Page Title</label>
                <input
                  type="text"
                  required
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  placeholder="e.g. Global Partner Ecosystem"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">URL Slug (/page/[slug])</label>
                <input
                  type="text"
                  required
                  value={pageForm.slug}
                  onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                  placeholder="e.g. partner-ecosystem"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Publication Status</label>
                <select
                  value={pageForm.status}
                  onChange={(e) => setPageForm({ ...pageForm, status: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">SEO Title Tag (Optional)</label>
                <input
                  type="text"
                  value={pageForm.seoTitle}
                  onChange={(e) => setPageForm({ ...pageForm, seoTitle: e.target.value })}
                  placeholder="SEO Title for Google Search"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">SEO Meta Description (Optional)</label>
                <input
                  type="text"
                  value={pageForm.seoDesc}
                  onChange={(e) => setPageForm({ ...pageForm, seoDesc: e.target.value })}
                  placeholder="Compelling meta description for search engines"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Blocks Builder Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Page Content Blocks</h3>
                <p className="text-xs text-slate-500">
                  Add, configure, or reorder visual sections for this landing page.
                </p>
              </div>

              {/* Block Types Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddBlock('HERO')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 border border-blue-200"
                >
                  + Hero
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('TEXT_IMAGE')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 border border-indigo-200"
                >
                  + Text & Media
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('FEATURES_GRID')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold hover:bg-cyan-100 border border-cyan-200"
                >
                  + Features Grid
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('FAQ_ACCORDION')}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 border border-purple-200"
                >
                  + FAQ Accordion
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('CTA_BANNER')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200"
                >
                  + CTA Banner
                </button>
              </div>
            </div>

            {/* Blocks List */}
            <div className="space-y-4">
              {pageForm.blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                        Block: {block.blockType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded border border-slate-200 text-slate-600 disabled:opacity-20"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === pageForm.blocks.length - 1}
                        className="p-1.5 rounded border border-slate-200 text-slate-600 disabled:opacity-20"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(idx)}
                        className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Block Heading</label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => handleBlockChange(idx, 'title', e.target.value)}
                        placeholder="Block Title"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Eyebrow / Subtitle</label>
                      <input
                        type="text"
                        value={block.subtitle || ''}
                        onChange={(e) => handleBlockChange(idx, 'subtitle', e.target.value)}
                        placeholder="Eyebrow text"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Content / Description</label>
                    <textarea
                      rows={2}
                      value={block.content || ''}
                      onChange={(e) => handleBlockChange(idx, 'content', e.target.value)}
                      placeholder="Block descriptive text or details"
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                    />
                  </div>

                  {block.blockType === 'TEXT_IMAGE' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Media Image URL</label>
                      <input
                        type="text"
                        value={block.mediaUrl || ''}
                        onChange={(e) => handleBlockChange(idx, 'mediaUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
                      />
                    </div>
                  )}

                  {/* JSON Config if present */}
                  {block.configJson && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 font-mono">
                        Block Config (JSON)
                      </label>
                      <textarea
                        rows={3}
                        value={block.configJson}
                        onChange={(e) => handleBlockChange(idx, 'configJson', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none font-mono text-[11px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Page...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Page</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
