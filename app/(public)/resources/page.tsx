import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Download, ShieldCheck, Cpu, Database, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Resources, Whitepapers & Guides | EliteGlobex',
  description:
    'Download technical whitepapers, multi-cloud architecture blueprints, zero-trust security reports, and enterprise checklists.',
};

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Enterprise Multi-Cloud Resilience Blueprint (2026 Edition)',
      category: 'Architecture Whitepaper',
      desc: 'A comprehensive guide on deploying multi-region Kubernetes clusters with zero data loss failovers across AWS and GCP.',
      pages: '28 Pages PDF',
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Autonomous AI Agents in High-Security Environments',
      category: 'AI Engineering Report',
      desc: 'Evaluating vector retrieval latency, prompt injection mitigation, and domain fine-tuning for regulated financial and health apps.',
      pages: '36 Pages PDF',
      icon: <Database className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Zero-Trust IAM & SOC2 Type II Audit Readiness Guide',
      category: 'Security Framework',
      desc: 'Step-by-step checklist to achieve continuous compliance, ephemeral credential rotation, and automated audit logging.',
      pages: '19 Pages PDF',
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    },
    {
      title: 'Micro-Frontend & Server Actions Performance Playbook',
      category: 'Web Engineering',
      desc: 'Best practices for scaling Next.js App Router applications to 10M+ daily dynamic requests with sub-100ms response times.',
      pages: '22 Pages PDF',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Knowledge Base</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Whitepapers, Blueprints & <span className="gradient-text-blue">Technical Guides</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          In-depth architectural research and implementation frameworks published by the EliteGlobex engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res) => (
          <div
            key={res.title}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-soft-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  {res.icon}
                </div>
                <Badge variant="slate" size="sm">{res.category}</Badge>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">{res.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {res.desc}
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500">
                Format: {res.pages}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button href="/contact" variant="secondary" className="w-full justify-center" icon={<Download className="w-4 h-4" />}>
                Request Full Document Access
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
