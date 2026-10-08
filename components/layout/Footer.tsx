import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface FooterProps {
  settings?: Record<string, string>;
  services?: Array<{ title: string; slug: string }>;
  solutions?: Array<{ name: string; slug: string }>;
}

export function Footer({ settings = {}, services = [], solutions = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const brandName = settings.site_name || 'ELITEGLOBEX';
  const brandTagline = settings.tagline || 'Global Technology & Solutions';
  const brandDescription = settings.footer_about || settings.site_description || 'Architecting mission-critical digital systems, multi-cloud platforms, applied AI pipelines, and enterprise software solutions for forward-thinking organizations.';
  const contactAddress = settings.hq_address || '100 Bishopsgate, Level 24, London, EC2N 4AG, UK';
  const contactEmail = settings.contact_email || 'contact@eliteglobex.com';
  const contactPhone = settings.contact_phone || '+1 (800) 555-ELITE';
  const copyrightText = settings.footer_copyright || `© ${currentYear} ${brandName} Inc. All rights reserved. Global enterprise technology consultancy.`;

  const defaultServicesLinks = [
    { name: 'Cloud Architecture & DevOps', href: '/services/cloud-architecture-devops' },
    { name: 'AI & Machine Learning', href: '/services/ai-machine-learning' },
    { name: 'Custom Web & Software', href: '/services/full-stack-web-engineering' },
    { name: 'Mobile App Engineering', href: '/services/mobile-app-development' },
    { name: 'Digital Transformation', href: '/services/digital-transformation-automation' },
    { name: 'UI/UX & Product Design', href: '/services/ui-ux-product-design' },
  ];

  const servicesLinks = services.length > 0
    ? services.slice(0, 6).map(s => ({ name: s.title, href: `/services/${s.slug}` }))
    : defaultServicesLinks;

  const defaultSolutionsLinks = [
    { name: 'OmniCloud ERP Suite', href: '/solutions/omnicloud-erp' },
    { name: 'CogniFlow AI Intelligence', href: '/solutions/cogniflow-ai' },
    { name: 'SecureShield Zero-Trust IAM', href: '/solutions/secureshield-iam' },
    { name: 'Track Active Project / Order', href: '/track-order' },
  ];

  const solutionsLinks = solutions.length > 0
    ? solutions.slice(0, 4).map(s => ({ name: s.name, href: `/solutions/${s.slug}` }))
    : defaultSolutionsLinks;

  const companyLinks = [
    { name: 'About EliteGlobex', href: '/about' },
    { name: 'Industries Served', href: '/industries' },
    { name: 'Case Studies / Portfolio', href: '/projects' },
    { name: 'Client Testimonials', href: '/testimonials' },
    { name: 'Global Offices', href: '/offices' },
    { name: 'Careers & Open Roles', href: '/careers' },
    { name: 'Blog & Insights', href: '/blog' },
    { name: 'Media & Resources', href: '/resources' },
    { name: 'Frequently Asked Questions', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-conditions' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200/90 pt-16 pb-12 relative overflow-hidden text-slate-600">
      {/* Subtle top ambient shape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={brandName}
                width={360}
                height={287}
                className="h-11 w-auto object-contain rounded-lg shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {brandName}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                  {brandTagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              {brandDescription}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{contactAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{contactPhone}</span>
              </div>
            </div>

            {/* Enterprise Certifications Badge */}
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-semibold shadow-soft-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SOC2 Type II Ready</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-semibold shadow-soft-sm">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>ISO 27001 / HIPAA</span>
              </div>
            </div>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {servicesLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions & Platforms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Platforms & Tools
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {solutionsLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-6 mb-3">
              Client Portal
            </h4>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-xs text-blue-600 font-semibold shadow-soft-sm transition-colors"
            >
              <span>Live Order Tracker</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Corporate Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Corporate
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {companyLinks.slice(0, 6).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {copyrightText}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {legalLinks.map((legal) => (
              <Link
                key={legal.name}
                href={legal.href}
                className="hover:text-slate-800 transition-colors"
              >
                {legal.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
