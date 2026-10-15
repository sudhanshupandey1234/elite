import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/cms';

// Public, cacheable contact/branding settings for client components
// (e.g. the contact page's "Direct Communication" card). Only exposes
// safe public fields — never secrets.
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(
    {
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      hq_address: settings.hq_address,
      support_hours: settings.support_hours,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
