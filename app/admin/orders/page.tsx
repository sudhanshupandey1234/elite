'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  PackageCheck,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Clock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit / Milestone Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [editStatus, setEditStatus] = useState('IN_DEVELOPMENT');
  const [editPaymentStatus, setEditPaymentStatus] = useState('PAID');
  const [editNotes, setEditNotes] = useState('');
  const [editSteps, setEditSteps] = useState<any[]>([]);

  // Create Form
  const [createForm, setCreateForm] = useState({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    serviceName: 'Cloud Infrastructure & Kubernetes',
    amount: '45000',
    status: 'IN_DEVELOPMENT',
    paymentStatus: 'PAID',
    notes: 'Sprint 1 initiated.',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openEditModal = (order: any) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditNotes(order.notes || '');

    let steps = [];
    try {
      steps = order.timelineStepsJson ? JSON.parse(order.timelineStepsJson) : [];
    } catch (e) {
      steps = [];
    }

    if (!steps || steps.length === 0) {
      steps = [
        { stage: 'Discovery & Architecture Scoping', completed: true },
        { stage: 'Infrastructure & IaC Pipeline Setup', completed: false },
        { stage: 'Core Development & Integration Sprints', completed: false },
        { stage: 'Zero-Trust Security & QA Audit', completed: false },
        { stage: 'Production Staging & Client Handover', completed: false },
      ];
    }

    setEditSteps(steps);
    setError('');
    setModalOpen(true);
  };

  const handleToggleStep = (index: number) => {
    setEditSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: editStatus,
          paymentStatus: editPaymentStatus,
          notes: editNotes,
          timelineSteps: editSteps,
        }),
      });

      if (!res.ok) throw new Error('Failed to update project order');
      setModalOpen(false);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Error updating order');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      if (!res.ok) throw new Error('Failed to create order');
      setCreateModalOpen(false);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Error creating order');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    try {
      await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerCompany && o.customerCompany.toLowerCase().includes(search.toLowerCase())) ||
      o.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalContract = orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const activeCount = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Operations & Delivery"
        title="Project Orders & Delivery Tracker"
        subtitle="Manage client contract IDs, milestone deliverable checklists, and real-time client tracking status."
        action={
          <button
            onClick={() => {
              setCreateModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Project Order
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={orders.length.toString()}
          subtitle="All contract engagements"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Active Sprints"
          value={activeCount.toString()}
          subtitle="In engineering / QA"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Completed Projects"
          value={completedCount.toString()}
          subtitle="Successfully delivered"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Total Contract Value"
          value={formatCurrency(totalContract)}
          subtitle="Aggregated portfolio"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by Order ID (e.g. EGX-1001), client name, or service..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        >
          <option value="ALL">All Delivery Statuses</option>
          <option value="ORDER_RECEIVED">Order Received</option>
          <option value="PROCESSING">Processing</option>
          <option value="IN_DEVELOPMENT">In Development</option>
          <option value="QUALITY_CHECK">Quality Check</option>
          <option value="READY">Ready</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Client / Organization</th>
                <th className="py-3.5 px-5">Service Engagement</th>
                <th className="py-3.5 px-5">Contract Value</th>
                <th className="py-3.5 px-5">Delivery Stage</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading project orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <EmptyState
                      title="No project orders found"
                      description={
                        search
                          ? 'Try adjusting your search criteria.'
                          : 'Create your first project order to begin tracking milestones and customer delivery.'
                      }
                      actionLabel={search ? undefined : 'Create Project Order'}
                      onAction={search ? undefined : () => setCreateModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-blue-600" />
                        <span>{ord.orderNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 text-sm">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-500">{ord.customerCompany}</div>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700">
                      {ord.serviceName}
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-emerald-600 text-sm">
                      {formatCurrency(ord.amount || 0)}
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={ord.paymentStatus} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/track-order?orderId=${encodeURIComponent(ord.orderNumber)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="View Public Tracker"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(ord)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Manage Milestones"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ord.id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Order"
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

      {/* Edit Milestones Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Manage Order: ${selectedOrder?.orderNumber}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <form onSubmit={handleSaveOrder} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="ORDER_RECEIVED">ORDER_RECEIVED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="IN_DEVELOPMENT">IN_DEVELOPMENT</option>
                  <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                  <option value="READY">READY</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PAID">PAID</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>

            {/* Milestones Stepper Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Milestone Deliverables Checklist (Syncs with Public Tracker)
              </label>
              <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {editSteps.map((step, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => handleToggleStep(idx)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={step.completed ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                      {idx + 1}. {step.stage || step.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sprint Notes / Progress Update</label>
              <textarea
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
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
                {saving ? 'Saving...' : 'Save Order Updates'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Order Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project Order"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name</label>
              <input
                type="text"
                required
                value={createForm.customerName}
                onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Email</label>
              <input
                type="email"
                required
                value={createForm.customerEmail}
                onChange={(e) => setCreateForm({ ...createForm, customerEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={createForm.customerCompany}
                onChange={(e) => setCreateForm({ ...createForm, customerCompany: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Value ($)</label>
              <input
                type="number"
                required
                value={createForm.amount}
                onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Service Engagement</label>
            <input
              type="text"
              required
              value={createForm.serviceName}
              onChange={(e) => setCreateForm({ ...createForm, serviceName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
