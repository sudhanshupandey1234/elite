import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const page = await prisma.customPage.findUnique({
        where: { id },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });
      return NextResponse.json({ page });
    }

    const pages = await prisma.customPage.findMany({
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ pages });
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
    const { title, slug, seoTitle, seoDesc, status = 'PUBLISHED', blocks = [] } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const page = await prisma.customPage.create({
      data: {
        title,
        slug: cleanSlug,
        seoTitle,
        seoDesc,
        status,
        blocks: {
          create: blocks.map((b: any, idx: number) => ({
            blockType: b.blockType || 'HERO',
            title: b.title || null,
            subtitle: b.subtitle || null,
            content: b.content || null,
            mediaUrl: b.mediaUrl || null,
            order: idx + 1,
            configJson: b.configJson || null,
          })),
        },
      },
      include: {
        blocks: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'CREATE',
        entity: 'CustomPage',
        entityId: page.id,
        detailsJson: JSON.stringify({ slug: cleanSlug, title }),
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, slug, seoTitle, seoDesc, status, blocks = [] } = body;

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const cleanSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') : undefined;

    // Delete existing blocks and recreate with updated config
    await prisma.pageBlock.deleteMany({
      where: { pageId: id },
    });

    const page = await prisma.customPage.update({
      where: { id },
      data: {
        title,
        slug: cleanSlug,
        seoTitle,
        seoDesc,
        status,
        blocks: {
          create: blocks.map((b: any, idx: number) => ({
            blockType: b.blockType || 'HERO',
            title: b.title || null,
            subtitle: b.subtitle || null,
            content: b.content || null,
            mediaUrl: b.mediaUrl || null,
            order: idx + 1,
            configJson: b.configJson || null,
          })),
        },
      },
      include: {
        blocks: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'UPDATE',
        entity: 'CustomPage',
        entityId: page.id,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    await prisma.customPage.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'DELETE',
        entity: 'CustomPage',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
