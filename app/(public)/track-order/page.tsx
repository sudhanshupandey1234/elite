'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Calendar,
  AlertCircle,
  FileCheck,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('EGX-1001');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to locate order reference.');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Error looking up project status.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="emerald">Completed & Deployed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="blue" dot>In Active Sprint</Badge>;
      case 'PENDING_REVIEW':
        return <Badge variant="amber">Pending Staging Approval</Badge>;
      case 'INITIATED':
        return <Badge variant="purple">Architecture Inception</Badge>;
      case 'CANCELLED':
        return <Badge variant="rose">Cancelled</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="emerald" size="sm">Fully Paid</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="cyan" size="sm">Milestone Paid</Badge>;
      case 'UNPAID':
        return <Badge variant="amber" size="sm">Invoice Pending</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="blue">Client Project Transparency</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Track Your <span className="gradient-text-blue">Project</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Enter your unique Project or Order Reference ID to view sprint progress, milestones, staging deployments, and delivery timeline.
        </p>
      </div>

      {/* Tracking Search Form */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <PackageCheck className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter Project ID (e.g. EGX-1001, EGX-1002)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 uppercase tracking-wider font-mono text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>
          <Button
            type="submit"
            variant="glow"
            size="lg"
            isLoading={loading}
            icon={<Search className="w-4 h-4" />}
          >
            Track Project
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <span>Sample Project IDs to test:</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('EGX-1001');
            }}
            className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-blue-600 font-mono font-semibold transition-colors"
          >
            EGX-1001
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('EGX-1002');
            }}
            className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-indigo-600 font-mono font-semibold transition-colors"
          >
            EGX-1002
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-sm text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Container */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Info Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">REFERENCE:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{order.orderNumber}</span>
                </div>
                <h3 className="text-lg font-bold text-blue-600 mt-0.5">
                  {order.serviceName}
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                {getStatusBadge(order.status)}
                {getPaymentBadge(order.paymentStatus)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Client Organization</span>
                </div>
                <div className="font-bold text-slate-900">{order.customerName}</div>
                <div className="text-[11px] text-slate-500">{order.customerCompany}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Project Inception</span>
                </div>
                <div className="font-bold text-slate-900">{formatDate(order.createdAt)}</div>
                <div className="text-[11px] text-slate-500">Sprint Cadence: Bi-Weekly</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated Completion</span>
                </div>
                <div className="font-bold text-emerald-700">
                  {order.expectedCompletion ? formatDate(order.expectedCompletion) : 'In Active Delivery'}
                </div>
                <div className="text-[11px] text-slate-500">On Track / Healthy</div>
              </div>
            </div>

            {order.notes && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
                <span className="font-bold text-blue-900">Architectural Note:</span> {order.notes}
              </div>
            )}
          </div>

          {/* Interactive Stepper Milestones */}
          {order.timelineSteps && order.timelineSteps.length > 0 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Delivery Milestone Progress</span>
              </h3>

              <div className="space-y-3.5">
                {order.timelineSteps.map((step: any, idx: number) => {
                  const isDone = step.completed;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                          : 'bg-slate-50/70 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-500 border border-slate-300'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${isDone ? 'text-slate-900' : 'text-slate-700'}`}>
                            {step.title}
                          </div>
                          {step.date && (
                            <div className="text-[11px] text-slate-500 font-mono">
                              Milestone Date: {step.date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        {isDone ? (
                          <Badge variant="emerald" size="sm">Completed</Badge>
                        ) : (
                          <Badge variant="slate" size="sm">In Pipeline</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Change Audit History */}
          {order.history && order.history.length > 0 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Audit Log History</h3>
              <div className="space-y-2.5">
                {order.history.map((h: any) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{h.status}</div>
                      {h.notes && <div className="text-slate-600 mt-0.5">{h.notes}</div>}
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {formatDate(h.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
