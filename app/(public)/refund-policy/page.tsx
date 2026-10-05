import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Refund & Milestone Policy | EliteGlobex',
  description: 'Enterprise milestone payment structures, dispute resolution, and sprint refund policies.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <Badge variant="blue">Commercial Terms</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Refund & Milestone Policy</h1>
        <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-slate-700 text-sm leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-slate-900">1. Milestone-Based Commercial Model</h2>
        <p>
          EliteGlobex operates primarily on milestone-based delivery sprints and time-and-materials statements of work. Each milestone is defined with explicit acceptance criteria before work commences.
        </p>
        <h2 className="text-lg font-bold text-slate-900">2. Acceptance and Review Windows</h2>
        <p>
          Clients have a standard 10-business-day review period upon milestone delivery in staging to verify deliverables against acceptance criteria. If deliverables do not satisfy specifications, our engineering team performs remediation sprints at no additional cost.
        </p>
        <h2 className="text-lg font-bold text-slate-900">3. Cancellation and Tranche Refunds</h2>
        <p>
          In the event of project termination prior to sprint completion, unearned advance funds for uncommenced milestone tranches are refunded pro-rata within 14 business days.
        </p>
      </div>
    </div>
  );
}
