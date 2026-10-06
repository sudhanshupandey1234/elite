import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // rebuild sitemap at most once an hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/solutions`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/industries`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/faqs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/offices`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [services, solutions, industries] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.solution.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.industry.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamic = [
      ...services.map((s) => ({
        url: `${siteUrl}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...solutions.map((s) => ({
        url: `${siteUrl}/solutions/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...industries.map((i) => ({
        url: `${siteUrl}/industries/${i.slug}`,
        lastModified: i.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // Database unreachable at build time — serve static pages only.
    // Next revalidation (revalidate = 3600) will retry the DB.
  }

  return [...staticPages, ...dynamic];
}
