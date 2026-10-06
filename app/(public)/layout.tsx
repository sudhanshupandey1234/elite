import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getNavigationCMS, getSiteSettings, getPublishedServices, getPublishedSolutions } from '@/lib/cms';

export const revalidate = 0; // Dynamic rendering for instant CMS updates

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navItems, settings, services, solutions] = await Promise.all([
    getNavigationCMS(),
    getSiteSettings(),
    getPublishedServices(),
    getPublishedSolutions(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar
        navItems={navItems}
        services={services}
        solutions={solutions}
        brandName={settings.site_name}
      />
      <main className="flex-1 pt-20">{children}</main>
      <Footer
        settings={settings}
        services={services}
        solutions={solutions}
      />
    </div>
  );
}
