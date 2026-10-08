import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, ExternalLink, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Offices & Worldwide Presence | EliteGlobex',
  description:
    'EliteGlobex global presence across London, New York, Singapore, and Dubai delivering 24/7 enterprise engineering.',
};

export const revalidate = 60;

export default async function OfficesPage() {
  const offices = await safeQuery(() => prisma.officeLocation.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { isHQ: 'desc' },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Global Footprint</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Operating Across Key <span className="gradient-text-blue">Tech Capitals</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Our distributed engineering squads and regional client desks ensure round-the-clock architecture support, instant incident response, and local regulatory alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {offices.map((off) => (
          <div
            key={off.id}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6 hover:border-slate-300 hover:shadow-soft-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{off.name}</h2>
                  <div className="text-xs text-slate-500 font-medium">{off.city}, {off.country}</div>
                </div>
              </div>
              {off.isHQ && (
                <Badge variant="blue" size="sm">Global HQ</Badge>
              )}
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{off.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-mono">{off.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{off.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{off.workingHours}</span>
              </div>
            </div>

            {off.mapUrl && (
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={off.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
