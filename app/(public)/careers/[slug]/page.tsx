'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function CareerJobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    experienceYears: '',
    portfolioUrl: '',
    linkedInUrl: '',
    gitHubUrl: '',
    resumeText: '',
    coverLetter: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/careers/job?slug=${slug}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          candidateName: formData.candidateName,
          email: formData.email,
          phone: formData.phone,
          experienceYears: formData.experienceYears,
          portfolioUrl: formData.portfolioUrl || undefined,
          linkedInUrl: formData.linkedInUrl || undefined,
          gitHubUrl: formData.gitHubUrl || undefined,
          resumeText: formData.resumeText,
          coverLetter: formData.coverLetter || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading position details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Job Position Not Found</h1>
        <p className="text-sm text-slate-600">This role may have been closed or filled.</p>
        <Button href="/careers" variant="secondary">Back to Careers</Button>
      </div>
    );
  }

  let skills: string[] = [];
  try {
    if (job.skillsJson) skills = JSON.parse(job.skillsJson);
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Open Roles</span>
        </Link>
      </div>

      {/* Role Header */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">{job.department}</Badge>
          <Badge variant="slate">{job.employmentType}</Badge>
          {job.salaryRange && (
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {job.salaryRange}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{job.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>{job.experience}</span>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">About the Role & Responsibilities</h2>
        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
          {job.description}
        </div>
      </div>

      {/* Application Form */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6" id="apply">
        <h2 className="text-2xl font-bold text-slate-900">Apply for this Position</h2>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Application Successfully Submitted</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Thank you, {formData.candidateName}. Our talent acquisition team has received your application for <span className="text-slate-900 font-semibold">{job.title}</span> and will review your profile shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maya@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Years of Relevant Experience <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  placeholder="e.g. 5+ years"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">GitHub / Code Repository</label>
                <input
                  type="url"
                  value={formData.gitHubUrl}
                  onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Portfolio / Personal Site</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Resume / Key Experience Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.resumeText}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                placeholder="Paste your resume summary, top architectural accomplishments, or links to credentials..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white resize-none transition-colors"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="glow" size="lg" isLoading={submitting} className="w-full sm:w-auto">
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
