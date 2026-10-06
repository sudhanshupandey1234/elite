import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCustomPage } from '@/lib/cms';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 0; // Dynamic rendering for instant CMS updates

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getCustomPage(params.slug);
  if (!page) {
    return {
      title: 'Page Not Found | EliteGlobex',
    };
  }
  return {
    title: page.seoTitle || `${page.title} | EliteGlobex`,
    description: page.seoDesc || `${page.title} - Custom page by EliteGlobex`,
  };
}

export default async function CustomDynamicPage({ params }: PageProps) {
  const page = await getCustomPage(params.slug);

  if (!page || page.status !== 'PUBLISHED') {
    notFound();
  }

  const renderBlock = (block: any) => {
    let config: any = {};
    try {
      if (block.configJson) {
        config = JSON.parse(block.configJson);
      }
    } catch (e) {}

    switch (block.blockType) {
      case 'HERO':
        return (
          <section
            key={block.id}
            className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-100"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-sky-100/50 blur-[120px] pointer-events-none rounded-full" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
              {block.subtitle && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>{block.subtitle}</span>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {block.title}
              </h1>
              {block.content && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  {block.content}
                </p>
              )}
              {config.primaryBtnText && (
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button
                    size="lg"
                    variant="glow"
                    href={config.primaryBtnUrl || '/contact'}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {config.primaryBtnText}
                  </Button>
                </div>
              )}
            </div>
          </section>
        );

      case 'TEXT_IMAGE':
        return (
          <section key={block.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                {block.subtitle && <Badge variant="blue">{block.subtitle}</Badge>}
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {block.title}
                </h2>
                <div className="text-slate-600 space-y-3 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {block.content}
                </div>
              </div>
              <div>
                {block.mediaUrl ? (
                  <img
                    src={block.mediaUrl}
                    alt={block.title || 'Page block image'}
                    className="rounded-3xl border border-slate-200 shadow-soft-lg w-full object-cover max-h-[450px]"
                  />
                ) : (
                  <div className="rounded-3xl bg-slate-100 border border-slate-200 p-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span>No media attached</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'FEATURES_GRID':
        const items = Array.isArray(config.items) ? config.items : [];
        return (
          <section key={block.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              {block.subtitle && <Badge variant="indigo">{block.subtitle}</Badge>}
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {block.title}
              </h2>
              {block.content && (
                <p className="text-slate-600 text-sm sm:text-base">{block.content}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm hover:shadow-soft-md transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title || item}</h3>
                  {item.desc && <p className="text-xs text-slate-600">{item.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'CTA_BANNER':
        return (
          <section key={block.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-soft-xl">
              <div className="max-w-2xl mx-auto space-y-5 relative z-10">
                {block.subtitle && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{block.subtitle}</span>
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{block.title}</h2>
                {block.content && (
                  <p className="text-slate-300 text-sm sm:text-base">{block.content}</p>
                )}
                <div className="pt-2">
                  <Button
                    size="lg"
                    variant="glow"
                    href={config.btnUrl || '/contact'}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {config.btnText || 'Get In Touch'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );

      case 'FAQ_ACCORDION':
        const faqs = Array.isArray(config.faqs) ? config.faqs : [];
        return (
          <section key={block.id} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="text-center space-y-3">
              {block.subtitle && <Badge variant="cyan">{block.subtitle}</Badge>}
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{block.title}</h2>
              {block.content && <p className="text-slate-600 text-sm">{block.content}</p>}
            </div>
            <div className="space-y-4">
              {faqs.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2"
                >
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{f.q || f.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {f.a || f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return (
          <section key={block.id} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{block.title}</h2>
            <div className="text-slate-600 whitespace-pre-line leading-relaxed">
              {block.content}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="py-8 space-y-12">
      {page.blocks && page.blocks.length > 0 ? (
        page.blocks.map(renderBlock)
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900">{page.title}</h1>
          <p className="text-slate-500">This page has no content blocks yet.</p>
        </div>
      )}
    </div>
  );
}
