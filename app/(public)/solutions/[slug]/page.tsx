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
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const solution = await prisma.solution.findUnique({
    where: { slug: params.slug },
  });

  if (!solution) return { title: 'Solution Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const title = solution.seoTitle || `${solution.name} — GeM, Tenders & AMC Services in India | Elite Globex`;
  const description =
    solution.seoDesc ||
    `${solution.shortDesc} Elite Globex Lucknow — end-to-end support, transparent pricing & pan-India service. Call 7355223184.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/solutions/${solution.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/solutions/${solution.slug}`,
    },
  };
}

export const revalidate = 60;

export default async function SolutionDetailPage({ params }: Props) {
  const solution = await prisma.solution.findUnique({
    where: { slug: params.slug },
  });

  if (!solution || solution.status !== 'PUBLISHED') {
    notFound();
  }

  let features: string[] = [];
  let benefits: string[] = [];
  let techStack: string[] = [];

  try {
    if (solution.featuresJson) features = JSON.parse(solution.featuresJson);
  } catch (e) {}
  try {
    if (solution.benefitsJson) benefits = JSON.parse(solution.benefitsJson);
  } catch (e) {}
  try {
    if (solution.techStackJson) techStack = JSON.parse(solution.techStackJson);
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <Link
          href="/solutions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Solutions</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200">
        <div className="lg:col-span-8 space-y-4">
          <Badge variant="purple">{solution.category}</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {solution.name}
          </h1>
          <p className="text-base sm:text-lg text-indigo-600 font-semibold">
            {solution.tagline}
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {solution.shortDesc}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Platform Availability
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">License Model</span>
              <span className="font-semibold text-slate-900">{solution.pricingModel || 'Custom Enterprise'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Deployment</span>
              <span className="font-semibold text-slate-900">Cloud / Hybrid / VPC</span>
            </div>
          </div>
          <Button href="/contact" variant="glow" className="w-full justify-center">
            Request Live Platform Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">System Architecture & Overview</h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{solution.fullDesc}</p>
            </div>
          </div>

          {features.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-slate-900">Key Capabilities & Features</h3>
              <div className="space-y-2.5">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {benefits.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Enterprise ROI & Business Impact</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {benefits.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Underlying Technology Stack</span>
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
