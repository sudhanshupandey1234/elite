import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Projects & Case Studies | EliteGlobex',
  description:
    'Explore real architectural case studies, performance benchmarks, and measurable business outcomes delivered by EliteGlobex.',
};

export const revalidate = 60;

export default async function ProjectsCatalogPage() {
  const projects = await safeQuery(() => prisma.projectCaseStudy.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Case Studies & Outcomes</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Proven Engineering <span className="gradient-text-blue">Deliverables</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Deep dives into complex digital transformations, latency reductions, multi-region failovers, and enterprise deployments.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((prj) => {
          let metrics: { metric: string; label: string }[] = [];
          let techStack: string[] = [];
          try {
            if (prj.metricsJson) metrics = JSON.parse(prj.metricsJson);
          } catch (e) {}
          try {
            if (prj.techStackJson) techStack = JSON.parse(prj.techStackJson);
          } catch (e) {}

          return (
            <div
              key={prj.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="sm">{prj.industry}</Badge>
                  {prj.isSampleData && (
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Sample Case Study
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {prj.title}
                  </h2>
                  <div className="text-xs text-blue-600 font-semibold mt-1">
                    {prj.clientName}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {prj.shortDesc}
                  </p>
                </div>

                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    {metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-lg font-black text-slate-900">{m.metric}</div>
                        <div className="text-[11px] text-slate-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/projects/${prj.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
