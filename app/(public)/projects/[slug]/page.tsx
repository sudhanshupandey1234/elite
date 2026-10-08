import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await safeQuery(() => prisma.projectCaseStudy.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!project) return { title: 'Case Study Not Found' };

  return {
    title: `${project.title} | EliteGlobex Case Study`,
    description: project.shortDesc,
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const project = await safeQuery(() => prisma.projectCaseStudy.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!project || project.status !== 'PUBLISHED') {
    notFound();
  }

  let results: string[] = [];
  let techStack: string[] = [];
  let metrics: { metric: string; label: string }[] = [];

  try {
    if (project.resultsJson) results = JSON.parse(project.resultsJson);
  } catch (e) {}
  try {
    if (project.techStackJson) techStack = JSON.parse(project.techStackJson);
  } catch (e) {}
  try {
    if (project.metricsJson) metrics = JSON.parse(project.metricsJson);
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Case Studies</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="blue">{project.industry}</Badge>
            {project.isSampleData && (
              <span className="text-xs text-slate-400 font-semibold uppercase">
                Sample Development Case Study
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="text-sm font-semibold text-blue-600">
            Client Profile: {project.clientName}
          </p>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {project.shortDesc}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Engagement Summary
          </div>
          {metrics.length > 0 && (
            <div className="space-y-2.5">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-center justify-between">
                  <span className="text-xs text-slate-500">{m.label}</span>
                  <span className="text-lg font-black text-slate-900">{m.metric}</span>
                </div>
              ))}
            </div>
          )}
          <Button href="/contact" variant="glow" className="w-full justify-center">
            Inquire About Similar Architecture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          {/* Challenge */}
          <div className="space-y-3 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>The Technical Challenge</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Solution */}
          <div className="space-y-3 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>The EliteGlobex Solution</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Measurable Results & Outcomes</span>
              </h3>
              <div className="space-y-2.5">
                {results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {techStack.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Technologies Utilized</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
