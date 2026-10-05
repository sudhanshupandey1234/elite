import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getSiteSettings } from '@/lib/cms';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    // Upsert all keys
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === 'string') {
        await prisma.siteSetting.upsert({
          where: { key },
          create: {
            key,
            value,
            group: key.startsWith('social_') ? 'social' : key.startsWith('footer_') ? 'footer' : 'general',
          },
          update: {
            value,
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'UPDATE',
        entity: 'SiteSetting',
        detailsJson: JSON.stringify({ keys: Object.keys(settings) }),
      },
    });

    const updated = await getSiteSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
