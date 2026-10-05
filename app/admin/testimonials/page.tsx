'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  Star,
  Plus,
  Trash2,
  AlertCircle,
  Award,
  Sparkles,
  Building,
} from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: 'CTO & VP Engineering',
    clientCompany: '',
    feedback: '',
    rating: '5',
    isFeatured: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create testimonial');
      setModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (e) {
      console.error(e);
    }
  };

  const featuredCount = testimonials.filter((t) => t.isFeatured).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="CMS & Social Proof"
        title="Client Testimonials & Executive Reviews"
        subtitle="Manage verified enterprise client testimonials, leadership ratings, and featured homepage endorsements."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Endorsement
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Endorsements"
          value={testimonials.length.toString()}
          subtitle="Verified executive reviews"
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Featured on Homepage"
          value={featuredCount.toString()}
          subtitle="Highlighted in hero reviews"
          icon={Sparkles}
          color="orange"
        />
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Loading client reviews...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-2 p-8 bg-white rounded-2xl border border-slate-200">
            <EmptyState
              title="No testimonials recorded"
              description="Add verified executive testimonials to enhance corporate social proof across the platform."
              actionLabel="Add Endorsement"
              onAction={() => setModalOpen(true)}
            />
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.isFeatured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans">
                  &ldquo;{t.feedback || t.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{t.clientName}</div>
                  <div className="text-[11px] text-slate-500">
                    {t.clientRole} · <span className="font-medium text-slate-700">{t.clientCompany || t.company}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Endorsement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Executive Endorsement"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Name</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Dr. Julian Vance"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                placeholder="e.g. BioSynthetix Therapeutics"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Executive Title</label>
            <input
              type="text"
              required
              value={formData.clientRole}
              onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Testimonial Quote</label>
            <textarea
              required
              rows={3}
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
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
              {saving ? 'Saving...' : 'Save Endorsement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
