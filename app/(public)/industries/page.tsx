import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve | Enterprise Software Engineering',
  description:
    'Tailored digital transformation and software architectures across FinTech, Healthcare, Supply Chain, and EdTech by EliteGlobex.',
};

export const revalidate = 60;

export default async function IndustriesCatalogPage() {
  const industries = await safeQuery(() => prisma.industry.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="cyan">Sector Expertise</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Domain-Specific <span className="gradient-text-blue">Engineering Solutions</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Deep regulatory knowledge, compliance frameworks, and specialized architectures engineered for the high-stakes demands of global industries.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {industries.map((ind) => {
          let challenges: string[] = [];
          let solutionsList: string[] = [];
          try {
            if (ind.challengesJson) challenges = JSON.parse(ind.challengesJson);
          } catch (e) {}
          try {
            if (ind.solutionsJson) solutionsList = JSON.parse(ind.solutionsJson);
          } catch (e) {}

          return (
            <div
              key={ind.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <Badge variant="cyan" size="sm">Regulated Domain</Badge>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{ind.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {ind.summary}
                  </p>
                </div>

                {solutionsList.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tailored Architecture Modules:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {solutionsList.slice(0, 3).map((sol, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                >
                  <span>Read Industry Solutions Guide</span>
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
