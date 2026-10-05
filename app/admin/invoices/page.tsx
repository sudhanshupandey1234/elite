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
  Receipt,
  Plus,
  Trash2,
  AlertCircle,
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    subtotal: '25000',
    tax: '0',
    total: '25000',
    currency: 'USD',
    status: 'DRAFT',
    notes: 'Payment due within 30 days via Wire Transfer / SWIFT.',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/admin/invoices');
      const data = await res.json();
      if (res.ok) setInvoices(data.invoices || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to issue invoice');
      setModalOpen(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerCompany: '',
        subtotal: '25000',
        tax: '0',
        total: '25000',
        currency: 'USD',
        status: 'DRAFT',
        notes: 'Payment due within 30 days via Wire Transfer / SWIFT.',
      });
      fetchInvoices();
    } catch (err: any) {
      setError(err.message || 'Error issuing invoice');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/invoices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await fetch(`/api/admin/invoices?id=${id}`, { method: 'DELETE' });
      fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics calculation
  const totalInvoicesCount = invoices.length;
  const totalAmountSum = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const paidAmountSum = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + (inv.total || 0), 0);
  const pendingAmountSum = invoices
    .filter((inv) => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
    .reduce((acc, inv) => acc + (inv.total || 0), 0);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (inv.customerCompany && inv.customerCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Invoices & Finance"
        subtitle="Track milestone billings, issued tax invoices, SWIFT receivables, and client payment settlements."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Enterprise ERP', href: '/admin' },
          { label: 'Invoices & Billing' },
        ]}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Invoice</span>
          </button>
        }
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Invoices"
          value={totalInvoicesCount}
          description="Issued billing records"
          icon={<Receipt className="w-5 h-5" />}
          iconBg="blue"
        />
        <StatCard
          title="Total Billed"
          value={formatCurrency(totalAmountSum, 'USD')}
          description="Gross contract volume"
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="purple"
        />
        <StatCard
          title="Paid Receivables"
          value={formatCurrency(paidAmountSum, 'USD')}
          description="Collected funds"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="green"
        />
        <StatCard
          title="Pending Settlement"
          value={formatCurrency(pendingAmountSum, 'USD')}
          description="Unpaid & overdue total"
          icon={<Clock className="w-5 h-5" />}
          iconBg="amber"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by invoice #, customer name, company..."
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
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading invoices...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={<Receipt className="w-8 h-8" />}
            title="No invoices found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No invoices match your search criteria. Try resetting the filters.'
                : 'Create your first invoice to start tracking billing and client settlements.'
            }
            actionText={search || statusFilter !== 'ALL' ? undefined : 'Issue Invoice'}
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <DataTable>
          <TableHeader>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client & Organization</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Issued / Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow key={inv.id}>
                {/* Invoice # */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold font-mono text-slate-900 text-xs sm:text-sm">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">Tax Invoice</div>
                    </div>
                  </div>
                </TableCell>

                {/* Client / Organization */}
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-xs text-slate-500">
                      {inv.customerCompany || inv.customerEmail}
                    </div>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell>
                  <div className="font-black text-slate-900 text-sm">
                    {formatCurrency(inv.total, inv.currency || 'USD')}
                  </div>
                  {inv.tax > 0 && (
                    <div className="text-[10px] text-slate-400">
                      Incl. {formatCurrency(inv.tax, inv.currency)} Tax
                    </div>
                  )}
                </TableCell>

                {/* Dates */}
                <TableCell>
                  <div className="text-xs font-semibold text-slate-700">
                    Issued: {formatDate(inv.issueDate || inv.createdAt)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Due: {formatDate(inv.dueDate || inv.createdAt)}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv.id, e.target.value)}
                      className="text-xs font-semibold rounded-lg bg-white border border-slate-200 px-2 py-1 text-slate-700 focus:outline-none"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="SENT">Sent</option>
                      <option value="PAID">Paid</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
                      title="Delete Invoice"
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

      {/* Issue New Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-soft-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Issue New Invoice</h3>
                  <p className="text-xs text-slate-500">
                    Create a formal client billing item
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

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="e.g. Liam Henderson"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    placeholder="liam@clientcompany.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Company / Organization</label>
                <input
                  type="text"
                  value={formData.customerCompany}
                  onChange={(e) =>
                    setFormData({ ...formData, customerCompany: e.target.value })
                  }
                  placeholder="e.g. Trans-Atlantic Freight Corp"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Total Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total: e.target.value,
                        subtotal: e.target.value,
                      })
                    }
                    placeholder="25000"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Payment Terms & Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
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
                  {saving ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-soft-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {selectedInvoice.invoiceNumber}
                </span>
                <h3 className="text-xl font-black text-slate-900">Invoice Details</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-mono text-slate-900">{selectedInvoice.customerEmail}</span>
              </div>
              {selectedInvoice.customerCompany && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Company:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedInvoice.customerCompany}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-black text-base text-slate-900 font-mono">
                  {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status:</span>
                <StatusBadge status={selectedInvoice.status} size="sm" />
              </div>
              <div className="pt-2">
                <span className="text-slate-500 font-medium block mb-1">Notes:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedInvoice.notes || 'No extra notes provided.'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
