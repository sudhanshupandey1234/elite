import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getHomepageCMS } from '@/lib/cms';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getHomepageCMS();
    return NextResponse.json(data);
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
    const { hero, sections } = body;

    // Update Hero Content
    if (hero) {
      await prisma.homepageContent.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          heroEyebrow: hero.heroEyebrow || '',
          heroTitle: hero.heroTitle || '',
          heroHighlight: hero.heroHighlight || '',
          heroDescription: hero.heroDescription || '',
          heroPrimaryBtnText: hero.heroPrimaryBtnText || '',
          heroPrimaryBtnUrl: hero.heroPrimaryBtnUrl || '/services',
          heroSecondaryBtnText: hero.heroSecondaryBtnText || '',
          heroSecondaryBtnUrl: hero.heroSecondaryBtnUrl || '/contact',
          heroTrackBtnText: hero.heroTrackBtnText || '',
          heroTrackBtnUrl: hero.heroTrackBtnUrl || '/track-order',
          heroBadgeText: hero.heroBadgeText || 'Operational',
          heroIsActive: hero.heroIsActive !== undefined ? hero.heroIsActive : true,
        },
        update: {
          heroEyebrow: hero.heroEyebrow,
          heroTitle: hero.heroTitle,
          heroHighlight: hero.heroHighlight,
          heroDescription: hero.heroDescription,
          heroPrimaryBtnText: hero.heroPrimaryBtnText,
          heroPrimaryBtnUrl: hero.heroPrimaryBtnUrl,
          heroSecondaryBtnText: hero.heroSecondaryBtnText,
          heroSecondaryBtnUrl: hero.heroSecondaryBtnUrl,
          heroTrackBtnText: hero.heroTrackBtnText,
          heroTrackBtnUrl: hero.heroTrackBtnUrl,
          heroBadgeText: hero.heroBadgeText,
          heroIsActive: hero.heroIsActive,
        },
      });
    }

    // Update Sections (ordering and active status)
    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (s.sectionKey) {
          await prisma.homepageSection.upsert({
            where: { sectionKey: s.sectionKey },
            create: {
              sectionKey: s.sectionKey,
              name: s.name || s.sectionKey,
              title: s.title,
              subtitle: s.subtitle,
              order: i + 1,
              isActive: s.isActive !== undefined ? s.isActive : true,
              customConfigJson: s.customConfigJson || null,
            },
            update: {
              name: s.name,
              title: s.title,
              subtitle: s.subtitle,
              order: i + 1,
              isActive: s.isActive,
              customConfigJson: s.customConfigJson,
            },
          });
        }
      }
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'UPDATE',
        entity: 'HomepageCMS',
        detailsJson: JSON.stringify({ updatedHero: !!hero, sectionCount: sections?.length }),
      },
    });

    const updatedData = await getHomepageCMS();
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error('Error saving homepage CMS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
