import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | EliteGlobex Corporate Governance',
  description: 'Enterprise privacy policy, GDPR/CCPA data governance standards, and information security safeguards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <Badge variant="blue">Data Protection & Privacy</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Commitment to Enterprise Data Privacy</h2>
          <p>
            EliteGlobex Group Inc. (&ldquo;EliteGlobex&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting the confidentiality, integrity, and security of information provided by our clients, partners, candidates, and website visitors. We adhere to global data protection regulations including the EU/UK General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and SOC2 Type II privacy guidelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Scope and Collection of Information</h2>
          <p>
            We collect information strictly necessary to provide engineering services, respond to enterprise consultation requests, process job applications, and fulfill contractual deliverables. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Contact details (Full Name, Corporate Email, Phone Number, Organization).</li>
            <li>Technical scope details, budget parameters, and architectural requirements.</li>
            <li>Employment application details (resumes, portfolios, GitHub links).</li>
            <li>Telemetry and access logs required for audit traceability and cyber defense.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Zero Third-Party Monetization</h2>
          <p>
            EliteGlobex does not sell, rent, or lease corporate or personal data to third parties. Data is processed exclusively to deliver requested engineering services, invoice active milestones, and maintain secure system operations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Data Encryption and Retention</h2>
          <p>
            All data in transit is encrypted using TLS 1.3 standards. Data at rest is encrypted utilizing AES-256 standards with strict role-based access control (RBAC) and immutable audit logging.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact Data Privacy Officer</h2>
          <p>
            For inquiries regarding data protection, right to erasure, or data processing agreements (DPAs), contact our legal compliance team at <span className="text-blue-600 font-mono font-semibold">privacy@eliteglobex.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
