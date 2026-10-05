'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  MapPin,
  Plus,
  Trash2,
  AlertCircle,
  Building,
  Globe2,
  Compass,
} from 'lucide-react';

export default function AdminOfficesPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    region: 'North America',
    address: '',
    phone: '',
    email: '',
    timezone: 'UTC',
    isHQ: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOffices = async () => {
    try {
      const res = await fetch('/api/admin/offices');
      const data = await res.json();
      if (res.ok) setOffices(data.offices || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/offices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create office');
      setModalOpen(false);
      fetchOffices();
    } catch (err: any) {
      setError(err.message || 'Error saving office');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this office?')) return;
    try {
      await fetch(`/api/admin/offices?id=${id}`, { method: 'DELETE' });
      fetchOffices();
    } catch (e) {
      console.error(e);
    }
  };

  const countriesCount = new Set(offices.map((o) => o.country)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Organization & Locations"
        title="Global Offices & Regional Hubs"
        subtitle="Manage physical offices, development centers, executive headquarters, and contact endpoints."
        action={
          <button
            onClick={() => {
              setModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Office Location
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Operating Hubs"
          value={offices.length.toString()}
          subtitle="Global office facilities"
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Countries Represented"
          value={countriesCount.toString()}
          subtitle="International operational presence"
          icon={Globe2}
          color="green"
        />
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Loading office locations...
          </div>
        ) : offices.length === 0 ? (
          <div className="col-span-2 p-8 bg-white rounded-2xl border border-slate-200">
            <EmptyState
              title="No offices recorded"
              description="Add your first corporate office or regional development center."
              actionLabel="Add Office Location"
              onAction={() => setModalOpen(true)}
            />
          </div>
        ) : (
          offices.map((off) => (
            <div
              key={off.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {off.city}, {off.country}
                      </h3>
                    </div>
                  </div>
                  {off.isHQ && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Global HQ
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 pl-10 font-sans leading-relaxed">
                  {off.address}
                </div>
                <div className="text-[11px] text-slate-500 font-mono pl-10">
                  Timezone: <span className="font-semibold text-slate-700">{off.timezone}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="font-medium">{off.phone || off.email || 'Direct contact available'}</div>
                <button
                  onClick={() => handleDelete(off.id)}
                  className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Office"
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
        title="Add Global Office"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
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
              {saving ? 'Saving...' : 'Save Office'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
