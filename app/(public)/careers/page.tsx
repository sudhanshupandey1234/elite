import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Open Engineering Positions | EliteGlobex',
  description:
    'Join our global engineering team. Explore open roles in full-stack architecture, AI/ML, cloud DevOps, and UI/UX design.',
};

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await safeQuery(() => prisma.jobPosition.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  }), []);

  const perks = [
    'Competitive global compensation + equity grants',
    'Flexible hybrid & 100% remote working options',
    'Annual $3,000 professional development & conference budget',
    'Comprehensive international health & dental insurance',
    'Latest Apple hardware and home workstation allowance',
    'Generous paid parental leave and sabbatical programs',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Join EliteGlobex</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Build Mission-Critical Systems with{' '}
          <span className="gradient-text-blue">World-Class Engineers</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We are looking for ambitious problem solvers, distributed systems engineers, and product designers passionate about building high-scale technology.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center sm:text-left">
          Why Engineers Choose EliteGlobex
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((perk, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Open Positions ({jobs.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Showing active global listings</span>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => {
            let skills: string[] = [];
            try {
              if (job.skillsJson) skills = JSON.parse(job.skillsJson);
            } catch (e) {}

            return (
              <div
                key={job.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="blue" size="sm">{job.department}</Badge>
                    <Badge variant="slate" size="sm">{job.employmentType}</Badge>
                    {job.salaryRange && (
                      <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {job.salaryRange}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{job.experience}</span>
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skills.slice(0, 5).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <Button
                    href={`/careers/${job.slug}`}
                    variant="glow"
                    size="md"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Role & Apply
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
