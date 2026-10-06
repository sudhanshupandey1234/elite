import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Layers, Sparkles, CheckCircle2, Shield, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GeM, Tenders, AMC & Bulk Supply Solutions',
  description:
    'Elite Globex solutions: GeM portal registration & bidding, government tenders, institutional orders, rate contracts, installation, AMC & bulk IT supply across India.',
  alternates: { canonical: '/solutions' },
};

export const revalidate = 60;

export default async function SolutionsCatalogPage() {
  const solutions = await prisma.solution.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="purple">Proprietary Software Systems</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Enterprise Solutions Built for <span className="gradient-text-blue">Speed & Agility</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Pre-architected, modular software suites engineered to solve complex operational, security, and knowledge bottlenecks.
        </p>
      </div>

      {/* Solutions List */}
      <div className="space-y-8">
        {solutions.map((sol) => {
          let features: string[] = [];
          let benefits: string[] = [];
          let techStack: string[] = [];
          try {
            if (sol.featuresJson) features = JSON.parse(sol.featuresJson);
          } catch (e) {}
          try {
            if (sol.benefitsJson) benefits = JSON.parse(sol.benefitsJson);
          } catch (e) {}
          try {
            if (sol.techStackJson) techStack = JSON.parse(sol.techStackJson);
          } catch (e) {}

          return (
            <div
              key={sol.id}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="purple" size="sm">{sol.category}</Badge>
                    {sol.pricingModel && (
                      <span className="text-xs text-slate-500 font-mono">
                        Pricing: {sol.pricingModel}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {sol.name}
                  </h2>
                  <p className="text-sm font-semibold text-indigo-600">
                    {sol.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sol.shortDesc}
                  </p>

                  {features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {features.slice(0, 4).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {techStack.map((tech) => (
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

                <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center lg:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Deployment Highlights
                  </div>
                  {benefits.length > 0 && (
                    <div className="space-y-2 text-xs text-slate-700">
                      {benefits.map((b, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-soft-sm">
                          {b}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    href={`/solutions/${sol.slug}`}
                    variant="glow"
                    className="w-full justify-center"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Platform Specs
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
