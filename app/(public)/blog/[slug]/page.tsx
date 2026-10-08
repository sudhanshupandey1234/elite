import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await safeQuery(() => prisma.blogPost.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.seoTitle || `${post.title} | EliteGlobex Blog`,
    description: post.seoDesc || post.excerpt,
  };
}

export const revalidate = 60;

export default async function BlogPostDetailPage({ params }: Props) {
  const post = await safeQuery(() => prisma.blogPost.findUnique({
    where: { slug: params.slug },
  }), null);

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  let tags: string[] = [];
  try {
    if (post.tagsJson) tags = JSON.parse(post.tagsJson);
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-6 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Badge variant="blue">{post.categoryName}</Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readingTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center gap-3.5 pt-4">
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{post.authorName}</div>
            <div className="text-xs text-slate-500">{post.authorRole}</div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="text-slate-700 leading-relaxed space-y-6 whitespace-pre-line text-sm sm:text-base">
        {post.content}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pt-8 border-t border-slate-200 flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Subscribe to EliteGlobex Engineering Updates</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Receive our quarterly architecture whitepapers and technical insights directly to your inbox.
        </p>
        <div className="pt-2">
          <Button href="/contact" variant="glow">
            Connect With Our Engineers
          </Button>
        </div>
      </div>
    </div>
  );
}
