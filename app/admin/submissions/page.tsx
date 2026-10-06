'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  Building,
  Clock,
  Inbox,
  CheckCheck,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (res.ok) setSubmissions(data.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'READ' ? 'UNREAD' : 'READ';
    try {
      await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchSubmissions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact submission?')) return;
    try {
      await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      fetchSubmissions();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(search.toLowerCase())) ||
      s.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'UNREAD'
        ? s.status !== 'READ' && s.status !== 'CONVERTED_TO_LEAD'
        : s.status === 'READ' || s.status === 'CONVERTED_TO_LEAD';
    return matchesSearch && matchesStatus;
  });

  const unreadCount = submissions.filter(
    (s) => s.status !== 'READ' && s.status !== 'CONVERTED_TO_LEAD'
  ).length;
  const readCount = submissions.length - unreadCount;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="CRM & Inbound"
        title="Contact Form Inquiries"
        subtitle="Review prospective client inquiries, project scopes, consultation bookings, and contact messages."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Inbound Messages"
          value={submissions.length.toString()}
          subtitle="All received form inquiries"
          icon={Inbox}
          color="blue"
        />
        <StatCard
          title="Pending Action"
          value={unreadCount.toString()}
          subtitle="Requires review / response"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Responded / Resolved"
          value={readCount.toString()}
          subtitle="Processed inquiries"
          icon={CheckCheck}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search inquiries by sender name, email, company, or message..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        >
          <option value="ALL">All Statuses ({submissions.length})</option>
          <option value="UNREAD">Needs Response ({unreadCount})</option>
          <option value="READ">Resolved / Responded ({readCount})</option>
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Loading contact inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <EmptyState
              title="No inquiries found"
              description={
                search
                  ? 'Try modifying your search keywords.'
                  : 'Contact messages submitted through the website forms will appear here in real-time.'
              }
            />
          </div>
        ) : (
          filtered.map((sub) => {
            const isRead = sub.status === 'READ' || sub.status === 'CONVERTED_TO_LEAD';
            return (
              <div
                key={sub.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isRead
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-blue-200 ring-1 ring-blue-500/10 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                      <StatusBadge status={isRead ? 'RESOLVED' : 'PENDING'} />
                      {sub.service && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {sub.service}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={`mailto:${sub.email}`}
                          className="hover:underline text-blue-600 font-medium"
                        >
                          {sub.email}
                        </a>
                      </div>
                      {sub.phone && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub.phone}</span>
                        </div>
                      )}
                      {sub.company && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{sub.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400 font-medium">
                    {formatDate(sub.createdAt)}
                  </div>
                </div>

                <div className="pt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 mt-3 font-sans">
                  {sub.message}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Source Page:{' '}
                    <span className="font-mono text-slate-600 font-medium">
                      {sub.sourcePage || '/contact'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(sub.id, sub.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        isRead
                          ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isRead ? 'Mark as Unread' : 'Mark as Responded'}
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Inbound"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
