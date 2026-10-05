import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Terms of Service | EliteGlobex Enterprise Agreement',
  description: 'Enterprise terms of service, engagement protocols, intellectual property ownership, and liability standards.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <Badge variant="blue">Legal Agreement</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Enterprise Engagements & Statements of Work</h2>
          <p>
            All custom software development, cloud architecture deployments, and advisory retainers are governed by executed Master Services Agreements (MSA) and project-specific Statements of Work (SOW).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Intellectual Property (IP) Transfer</h2>
          <p>
            Upon full settlement of milestone invoices specified in an active SOW, all rights, titles, and interests in the custom deliverables, source code repositories, and proprietary architectures developed specifically for the client transfer 100% to the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Mutual Non-Disclosure & Confidentiality</h2>
          <p>
            Both parties agree to hold in strict confidence all proprietary technical data, source code, business logic, customer records, and operational designs disclosed during discovery and execution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Service Level Commitments & Warranties</h2>
          <p>
            EliteGlobex warrants that all delivered software conforms in all material respects with the technical specifications outlined in the approved SOW. Standard bug warranty periods extend 90 days post-production deployment.
          </p>
        </section>
      </div>
    </div>
  );
}
