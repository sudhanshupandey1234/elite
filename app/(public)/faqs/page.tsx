'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const FAQ_DATA = [
  {
    category: 'Engagements & Process',
    items: [
      {
        q: 'How does EliteGlobex initiate enterprise software engagements?',
        a: 'We begin with a 1-to-2 week Discovery & Architecture Sprint where our principal engineers map system dependencies, define infrastructure as code (IaC), establish milestone deliverables, and execute mutual non-disclosure agreements (NDAs).',
      },
      {
        q: 'What engagement models do you support?',
        a: 'We provide three primary models: (1) Dedicated Engineering Squads for long-term platform velocity, (2) Fixed-Scope Milestone Deliverables for turnkey solutions, and (3) Architecture Advisory & SRE Retainers for mission-critical oversight.',
      },
      {
        q: 'Who retains the intellectual property (IP) of code written by EliteGlobex?',
        a: '100% of the intellectual property, code repositories, cloud infrastructure scripts, and design tokens belong exclusively to our client upon delivery.',
      },
    ],
  },
  {
    category: 'Security, Compliance & Hosting',
    items: [
      {
        q: 'What security standards and compliance frameworks do you enforce?',
        a: 'All architectures adhere to Zero-Trust principles, automated SAST/DAST pipeline testing, SOC2 Type II controls, and ISO 27001 standards. Healthcare systems are designed to HIPAA/FHIR specifications.',
      },
      {
        q: 'Where are client applications hosted and deployed?',
        a: 'We deploy directly into your private cloud tenancies (AWS, Google Cloud, Microsoft Azure, or on-premise Kubernetes clusters). We never lock clients into proprietary hosting infrastructure.',
      },
    ],
  },
  {
    category: 'Order Tracking & Support',
    items: [
      {
        q: 'How does the Live Order Tracker work?',
        a: 'Every active project receives a unique Order Reference (e.g. EGX-1001). Clients can visit our Track Order portal at any time to review real-time milestones, completed sprint deliverables, and deployment staging URLs.',
      },
      {
        q: 'Do you offer post-launch 24/7 SLA maintenance?',
        a: 'Yes, we offer Tier 1 to Tier 3 24/7 Site Reliability Engineering (SRE) support with guaranteed 15-minute response times for critical severity incidents.',
      },
    ],
  },
];

export default function FAQsPage() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_DATA.map((cat) => {
    const items = cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(query.toLowerCase()) ||
        item.a.toLowerCase().includes(query.toLowerCase()) ||
        cat.category.toLowerCase().includes(query.toLowerCase())
    );
    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="amber">Knowledge & Clarifications</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked <span className="gradient-text-blue">Questions</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about our engineering standards, delivery workflow, security safeguards, and engagement models.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions by keyword (e.g., security, IP, order tracking, discovery)..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            No questions matched your search query. Please feel free to contact us directly.
          </div>
        ) : (
          filteredCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>{cat.category}</span>
              </h2>

              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!expanded[key];

                  return (
                    <div
                      key={itemIdx}
                      className="rounded-2xl bg-white border border-slate-200 shadow-soft-sm overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        <span className="text-sm sm:text-base">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Have a question not listed here?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Our solutions architecture team is available to answer any technical or procedural inquiries.
        </p>
        <div className="pt-2">
          <Button href="/contact" variant="glow">
            Contact Support Desk
          </Button>
        </div>
      </div>
    </div>
  );
}
