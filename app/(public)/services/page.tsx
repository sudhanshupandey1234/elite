import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Code2, Layers, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IT Products & Equipment — Computers, Printers, Panels, Studio Setups',
  description:
    'Shop IT products from Elite Globex Lucknow: computers, printers & scanners, interactive panels, online class studio setups, servers, toner cartridges, drones, TVs & more — with installation & support.',
  alternates: { canonical: '/services' },
};

export const revalidate = 60;

export default async function ServicesCatalogPage() {
  const services = await safeQuery(() => prisma.service.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Enterprise Engineering Services</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Specialized Capabilities Engineered for{' '}
          <span className="gradient-text-blue">Maximum Scale</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          From multi-cloud infrastructure and applied AI agents to high-velocity web and mobile platforms, explore our full spectrum of enterprise capabilities.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((svc) => {
          let features: string[] = [];
          let techStack: string[] = [];
          try {
            features = JSON.parse(svc.featuresJson);
          } catch (e) {
            features = [];
          }
          try {
            techStack = JSON.parse(svc.techStackJson);
          } catch (e) {
            techStack = [];
          }

          return (
            <div
              key={svc.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-blue-300 hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {svc.featuredImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 -mx-1">
                    <img
                      src={svc.featuredImage}
                      alt={svc.title}
                      className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Code2 className="w-6 h-6" />
                  </div>
                  {svc.category && <Badge variant="cyan" size="sm">{svc.category}</Badge>}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {svc.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>

                {features.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Core Highlights
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
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

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={`/services/${svc.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                >
                  <span>Explore Service Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Consultation Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Need a custom technical roadmap?</h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Our senior solutions architects can conduct an initial architecture discovery to evaluate your system requirements.
        </p>
        <div className="pt-2">
          <Button href="/contact" variant="glow">
            Book an Architecture Discovery Session
          </Button>
        </div>
      </div>
    </div>
  );
}
