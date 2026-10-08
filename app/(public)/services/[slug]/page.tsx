import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { ImgReveal } from '@/components/anim/ImgReveal';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

/** Convert a YouTube watch/shorts URL to an embed URL; returns null for direct file URLs. */
function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') {
      let id = '';
      if (host === 'youtu.be') id = u.pathname.slice(1);
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2];
      else if (u.pathname === '/embed/') id = u.pathname.split('/')[2];
      else id = u.searchParams.get('v') || '';
      id = id.split('?')[0].split('&')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    /* not a URL — treat as direct file */
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await safeQuery(() => prisma.service.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!service) return { title: 'Service Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const title = service.seoTitle || `${service.title} — Price & Dealer in Lucknow, UP | Elite Globex`;
  const description =
    service.seoDesc ||
    `${service.shortDesc} Get best price quotation in Lucknow, Uttar Pradesh. Genuine brands, installation & pan-India support. Call 7355223184.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/services/${service.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/services/${service.slug}`,
      ...(service.featuredImage ? { images: [{ url: service.featuredImage }] } : {}),
    },
  };
}

export const revalidate = 60;

export default async function ServiceDetailPage({ params }: Props) {
  const service = await safeQuery(() => prisma.service.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!service || service.status !== 'PUBLISHED') {
    notFound();
  }

  let features: string[] = [];
  let techStack: string[] = [];
  let processSteps: { step: string; title: string; desc: string }[] = [];
  let faqs: { q: string; a: string }[] = [];

  try {
    if (service.featuresJson) features = JSON.parse(service.featuresJson);
  } catch (e) {}

  try {
    if (service.techStackJson) techStack = JSON.parse(service.techStackJson);
  } catch (e) {}

  try {
    if (service.processJson) processSteps = JSON.parse(service.processJson);
  } catch (e) {}

  try {
    if (service.faqsJson) faqs = JSON.parse(service.faqsJson);
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDesc,
          provider: {
            '@type': 'LocalBusiness',
            name: 'Elite Globex',
            telephone: '+91-7355223184',
            email: 'eliteglobex4794@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Lucknow',
              addressRegion: 'Uttar Pradesh',
              addressCountry: 'IN',
            },
          },
          areaServed: 'IN',
          ...(service.featuredImage ? { image: service.featuredImage } : {}),
        }}
      />
      {faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.slice(0, 8).map((f: { q: string; a: string }) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="blue">{service.category}</Badge>
            <span className="text-xs text-slate-500 font-medium">Enterprise Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {service.shortDesc}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Engagement Specs
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Deployment SLA</span>
              <span className="font-semibold text-slate-900">99.99% Guaranteed</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Security Standard</span>
              <span className="font-semibold text-slate-900">SOC2 / ISO 27001</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">IP Ownership</span>
              <span className="font-semibold text-emerald-600">100% Client Owned</span>
            </div>
          </div>
          <Button href="/contact" variant="glow" className="w-full justify-center">
            Request Engagement Quote
          </Button>
        </div>
      </div>

      {/* Product Media — photo & video (shown when the admin adds them) */}
      {(service.featuredImage || service.videoUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.featuredImage && (
            <ImgReveal className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={service.featuredImage}
                alt={service.title}
                className="w-full h-72 object-cover"
              />
            </ImgReveal>
          )}
          {service.videoUrl &&
            (() => {
              const embed = youtubeEmbedUrl(service.videoUrl as string);
              return (
                <div className="rounded-3xl overflow-hidden border border-slate-200 bg-black aspect-video">
                  {embed ? (
                    <iframe
                      src={embed}
                      title={`${service.title} video`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={service.videoUrl as string} controls className="w-full h-full" />
                  )}
                </div>
              );
            })()}
        </div>
      )}

      {/* Full Description & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Architecture & Strategic Approach</h2>
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
            <p>{service.fullDesc}</p>
          </div>

          {/* Key Deliverables / Features */}
          {features.length > 0 && (
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Technical Deliverables & Capabilities</h3>
              <div className="space-y-2.5">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Tech Stack & Certifications */}
        <div className="lg:col-span-5 space-y-6">
          {techStack.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Technology Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Enterprise Delivery Standards</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every deliverable goes through automated static analysis, security penetration scans, and comprehensive test suites prior to staging promotion.
            </p>
          </div>
        </div>
      </div>

      {/* Process Workflow Steps */}
      {processSteps.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="purple">Execution Roadmap</Badge>
            <h2 className="text-3xl font-black text-slate-900">How We Deliver This Service</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm space-y-3"
              >
                <div className="text-2xl font-black text-blue-600 font-mono">{step.step}</div>
                <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service FAQs */}
      {faqs.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <Badge variant="cyan">Service FAQs</Badge>
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm space-y-2"
              >
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Ready to start with {service.title}?</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Connect with an EliteGlobex solution architect to review scope, timeline, and deliverables.
        </p>
        <div className="pt-2">
          <Button href="/contact" variant="glow">
            Book Architecture Discussion
          </Button>
        </div>
      </div>
    </div>
  );
}
