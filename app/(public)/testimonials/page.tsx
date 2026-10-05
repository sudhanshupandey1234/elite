import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Reviews & Partner Testimonials | EliteGlobex',
  description:
    'Read real reviews and feedback from technology leaders, CTOs, and product directors partnering with EliteGlobex.',
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Client Satisfaction</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          What Technology Leaders <span className="gradient-text-blue">Say About Us</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Our reputation is built on architectural discipline, on-time delivery, and long-term technical value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-6 hover:border-slate-300 hover:shadow-soft-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                {t.projectType && (
                  <Badge variant="slate" size="sm">{t.projectType}</Badge>
                )}
              </div>

              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;{t.feedback}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-soft-sm">
                {t.clientName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{t.clientName}</div>
                <div className="text-xs text-blue-600 font-semibold">{t.clientRole}</div>
                <div className="text-[11px] text-slate-500">{t.clientCompany}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Partner with EliteGlobex for your next deployment</h3>
        <div className="pt-2">
          <Button href="/contact" variant="glow">
            Start a Conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
