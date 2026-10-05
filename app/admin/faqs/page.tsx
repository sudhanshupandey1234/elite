'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  HelpCircle,
  Plus,
  Trash2,
  AlertCircle,
  Layers,
  MessageCircleQuestion,
} from 'lucide-react';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Engagements & Process',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (res.ok) setFaqs(data.faqs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create FAQ');
      setModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      setError(err.message || 'Error saving FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (e) {
      console.error(e);
    }
  };

  const categoriesCount = new Set(faqs.map((f) => f.category)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="CMS & Knowledge"
        title="Knowledge Base & FAQ Management"
        subtitle="Manage live questions & answers, categorize client queries, and streamline technical discovery on the public site."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add FAQ Question
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Questions"
          value={faqs.length.toString()}
          subtitle="Public knowledge base items"
          icon={MessageCircleQuestion}
          color="blue"
        />
        <StatCard
          title="FAQ Categories"
          value={categoriesCount.toString()}
          subtitle="Topic groupings"
          icon={Layers}
          color="purple"
        />
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <EmptyState
              title="No FAQs recorded"
              description="Add frequently asked questions to help prospective enterprise clients understand the technical engagement process."
              actionLabel="Add FAQ Question"
              onAction={() => setModalOpen(true)}
            />
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {faq.answer}
              </p>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add FAQ Question"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Question</label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
            <textarea
              required
              rows={4}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
              {saving ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
