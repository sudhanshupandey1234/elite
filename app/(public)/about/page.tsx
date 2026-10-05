import React from 'react';
import { Metadata } from 'next';
import {
  Globe,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us | Global Technology & Enterprise Engineering',
  description:
    'Discover EliteGlobex: Our mission, engineering principles, leadership approach, and global technology capabilities.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Architectural Rigor',
      desc: 'We engineer for zero-downtime, sub-100ms latency, and high concurrency from day one. No fragile shortcuts.',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Uncompromising Security',
      desc: 'Zero-trust architecture, automated vulnerability auditing, and strict SOC2/HIPAA compliance built into every deployment.',
      icon: <Lock className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Agile Velocity & Transparency',
      desc: 'Bi-weekly release cadences with continuous staging previews and clear milestone billing. You always know what is in flight.',
      icon: <Zap className="w-5 h-5 text-sky-600" />,
    },
    {
      title: '100% Client IP Ownership',
      desc: 'Complete source code, CI/CD blueprints, design systems, and cloud infrastructure belong entirely to our clients.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const leadershipRoles = [
    {
      name: 'Alexander Wright',
      role: 'Managing Director & Chief Architect',
      dept: 'Executive & Strategy',
      bio: '20+ years guiding enterprise cloud modernization, distributed financial systems, and global delivery practices.',
    },
    {
      name: 'Sarah Chen',
      role: 'Director of Engineering',
      dept: 'Platform Architecture & Delivery',
      bio: 'Specialist in high-scale Next.js architectures, Kubernetes orchestration, and multi-cloud resilience.',
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'Head of Artificial Intelligence',
      dept: 'AI & Data Engineering',
      bio: 'PhD in Machine Learning. Pioneer in domain-specific LLM fine-tuning and enterprise RAG systems.',
    },
    {
      name: 'Elena Rostova',
      role: 'Principal Cloud Architect',
      dept: 'Cloud & SRE',
      bio: 'Multi-cloud specialist across AWS, GCP, and Azure. Advocate for zero-downtime declarative infrastructure.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Enterprise Overview</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pioneering Mission-Critical <span className="gradient-text-blue">Digital Engineering</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          EliteGlobex was established to solve a critical enterprise challenge: bridging the gap between high-level consulting and high-velocity, reliable software execution.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
          <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To empower global enterprises and visionary innovators with resilient, cloud-native digital systems, intelligent AI pipelines, and bespoke automation that radically accelerate growth and operational excellence.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
          <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To be the world’s most trusted engineering partner for mission-critical software, setting the global standard for architectural elegance, data security, and collaborative innovation.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="purple">Engineering Principles</Badge>
          <h2 className="text-3xl font-black text-slate-900">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership & Engineering Squads */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="cyan">Leadership Team</Badge>
          <h2 className="text-3xl font-black text-slate-900">Architectural Leadership</h2>
          <p className="text-xs text-slate-500">
            Senior practitioners actively shaping technology strategies for our global clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipRoles.map((leader) => (
            <div
              key={leader.name}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-base text-blue-700">
                {leader.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{leader.name}</h3>
                <div className="text-xs text-blue-600 font-semibold">{leader.role}</div>
                <div className="text-[11px] text-slate-500">{leader.dept}</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Want to collaborate with our engineering team?</h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Reach out today to discuss your technical architecture or review our ongoing career opportunities.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button href="/contact" variant="glow">
            Contact Engineering Team
          </Button>
          <Button href="/careers" variant="secondary">
            View Careers
          </Button>
        </div>
      </div>
    </div>
  );
}
