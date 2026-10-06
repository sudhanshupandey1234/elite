import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = await prisma.industry.findUnique({
    where: { slug: params.slug },
  });

  if (!industry) return { title: 'Industry Not Found' };

  return {
    title: industry.seoTitle || `${industry.name} Software Engineering | EliteGlobex`,
    description: industry.seoDesc || industry.summary,
  };
}

export const revalidate = 60;

export default async function IndustryDetailPage({ params }: Props) {
  const industry = await prisma.industry.findUnique({
    where: { slug: params.slug },
  });

  if (!industry || industry.status !== 'PUBLISHED') {
    notFound();
  }

  let challenges: string[] = [];
  let solutions: string[] = [];

  try {
    if (industry.challengesJson) challenges = JSON.parse(industry.challengesJson);
  } catch (e) {}
  try {
    if (industry.solutionsJson) solutions = JSON.parse(industry.solutionsJson);
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <Link
          href="/industries"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Industries</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200">
        <div className="lg:col-span-8 space-y-4">
          <Badge variant="cyan">Industry Blueprint</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {industry.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {industry.summary}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sector Engagement
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            We provide dedicated industry squads with deep domain certifications to ensure compliance from day one.
          </p>
          <Button href="/contact" variant="glow" className="w-full justify-center">
            Consult Industry Architect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Domain Overview & Engineering Mandate</h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{industry.fullDesc}</p>
            </div>
          </div>

          {solutions.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-slate-900">EliteGlobex Specialized Solutions</h3>
              <div className="space-y-2.5">
                {solutions.map((sol, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800">{sol}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {challenges.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Key Industry Bottlenecks Solved</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                {challenges.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
