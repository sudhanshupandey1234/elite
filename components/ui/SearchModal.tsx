'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, FileText, Layers, Briefcase, HelpCircle, Code } from 'lucide-react';
import { Modal } from './Modal';

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'Service' | 'Solution' | 'Project' | 'Blog' | 'FAQ';
}

const QUICK_INDEX: SearchResultItem[] = [
  { id: '1', title: 'Cloud Architecture & DevOps', description: 'Zero-downtime multi-cloud infrastructure and Kubernetes', url: '/services/cloud-architecture-devops', type: 'Service' },
  { id: '2', title: 'AI & Machine Learning Solutions', description: 'Custom LLMs, RAG, and autonomous agent orchestration', url: '/services/ai-machine-learning', type: 'Service' },
  { id: '3', title: 'Custom Web & Enterprise Software', description: 'Next.js, TypeScript, and modern microservices architecture', url: '/services/full-stack-web-engineering', type: 'Service' },
  { id: '4', title: 'Mobile App Engineering', description: 'Cross-platform iOS and Android applications with React Native', url: '/services/mobile-app-development', type: 'Service' },
  { id: '5', title: 'OmniCloud Enterprise ERP', description: 'Unified Operations, Financials, and Supply Chain Platform', url: '/solutions/omnicloud-erp', type: 'Solution' },
  { id: '6', title: 'CogniFlow AI Intelligence Suite', description: 'Enterprise semantic search and autonomous knowledge assistant', url: '/solutions/cogniflow-ai', type: 'Solution' },
  { id: '7', title: 'SecureShield Zero-Trust IAM', description: 'Identity, Access Management & Threat Governance', url: '/solutions/secureshield-iam', type: 'Solution' },
  { id: '8', title: 'Global Payment Gateway Modernization', description: 'Scaling to 25,000 TPS with 99.999% availability', url: '/projects/fintech-core-modernization', type: 'Project' },
  { id: '9', title: 'HIPAA Telehealth Platform', description: 'Encrypted video consultations and FHIR EHR sync', url: '/projects/telehealth-realtime-platform', type: 'Project' },
  { id: '10', title: 'Autonomous Enterprise AI Agents 2026', description: 'The shift from passive LLMs to autonomous enterprise workflows', url: '/blog/future-of-enterprise-ai-agents-2026', type: 'Blog' },
  { id: '11', title: 'Multi-Cloud Resilience Strategies', description: 'Designing vendor-agnostic infrastructure across AWS and GCP', url: '/blog/multi-cloud-resilience-strategies', type: 'Blog' },
  { id: '12', title: 'How does EliteGlobex initiate engagements?', description: 'Discovery and architecture sprint breakdown', url: '/faqs', type: 'FAQ' },
  { id: '13', title: 'Security & Compliance Standards (SOC2, HIPAA)', description: 'Data privacy and encryption guarantees', url: '/faqs', type: 'FAQ' },
  { id: '14', title: 'Order Tracking System', description: 'Look up live progress and milestone stages with your Order ID', url: '/track-order', type: 'Service' },
];

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = query.trim()
    ? QUICK_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_INDEX.slice(0, 6);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Service':
        return <Code className="w-4 h-4 text-blue-600" />;
      case 'Solution':
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case 'Project':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Blog':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'FAQ':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, solutions, case studies, blog..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-base transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No matching resources found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="w-full text-left flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-slate-100 border border-slate-200/80 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-2" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Search across EliteGlobex ecosystem</span>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700 font-mono text-[11px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
