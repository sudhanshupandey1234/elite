'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatCard } from '@/components/admin/ui/StatCard';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import {
  UserCheck,
  Search,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/careers/applications');
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/careers/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchApplications();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.title && app.job.title.toLowerCase().includes(search.toLowerCase()));
    const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  const submittedCount = applications.filter((a) => a.status === 'SUBMITTED').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const offeredCount = applications.filter((a) => a.status === 'OFFERED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Careers & HR"
        title="Candidate Applications & Tech Pipeline"
        subtitle="Review engineering resumes, repository links, interview progress, and candidate screening stages."
        action={
          <Link
            href="/admin/careers"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            Manage Job Openings
          </Link>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="New Submissions"
          value={submittedCount.toString()}
          subtitle="Awaiting initial screening"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Technical Shortlist"
          value={shortlistedCount.toString()}
          subtitle="In technical interview loop"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Job Offers Extended"
          value={offeredCount.toString()}
          subtitle="Final hiring offers"
          icon={Award}
          color="green"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search applicants by name, email, or role..."
          />
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        >
          <option value="ALL">All Application Stages</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="SHORTLISTED">Shortlisted (Tech Interview)</option>
          <option value="OFFERED">Offered</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Loading candidate applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <EmptyState
              title="No applications found"
              description={
                search
                  ? 'Try modifying your search or stage filters.'
                  : 'Candidate submissions submitted through the careers portal will appear here.'
              }
            />
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-base">{app.candidateName}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {app.job?.title || 'Engineering Role'}
                    </span>
                    {app.experienceYears && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {app.experienceYears}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline font-medium">
                        {app.email}
                      </a>
                    </div>
                    {app.phone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">Candidate Stage:</span>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="REVIEWING">REVIEWING</option>
                    <option value="SHORTLISTED">SHORTLISTED (Tech Interview)</option>
                    <option value="OFFERED">OFFERED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {app.gitHubUrl && (
                  <a
                    href={app.gitHubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span>GitHub / Repo</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {app.linkedInUrl && (
                  <a
                    href={app.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </a>
                )}
                {app.portfolioUrl && (
                  <a
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-purple-600 hover:bg-purple-50 inline-flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span>Portfolio Website</span>
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                  </a>
                )}
              </div>

              {/* Resume summary */}
              {app.resumeText && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  <span className="font-semibold text-slate-900 block mb-1">Resume Highlights:</span>
                  {app.resumeText}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
