import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Clock, ArrowRight, User, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog & Technology Insights | EliteGlobex',
  description:
    'Read articles, technical whitepapers, and engineering updates on AI, multi-cloud, Next.js, and enterprise systems by EliteGlobex.',
};

export const revalidate = 60;

export default async function BlogCatalogPage() {
  const posts = await safeQuery(() => prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">EliteGlobex Editorial</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Engineering Insights & <span className="gradient-text-blue">Perspectives</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Deep dives into software architecture, scalable data pipelines, enterprise AI deployment, and modern development standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          let tags: string[] = [];
          try {
            if (post.tagsJson) tags = JSON.parse(post.tagsJson);
          } catch (e) {}

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <Badge variant="blue" size="sm">{post.categoryName}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <div className="text-slate-900 font-semibold">{post.authorName}</div>
                  <div className="text-[11px] text-slate-500">{post.authorRole}</div>
                </div>
                <div className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
