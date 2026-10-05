import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: body.excerpt,
        content: body.content,
        authorName: body.authorName || user.name,
        authorRole: body.authorRole || 'Engineering Contributor',
        categoryName: body.categoryName || 'Engineering',
        readingTime: body.readingTime || '5 min read',
        tagsJson: typeof body.tagsJson === 'string' ? body.tagsJson : JSON.stringify(body.tagsJson || []),
        status: body.status || 'PUBLISHED',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'BlogPost',
      entityId: post.id,
      details: { title: post.title },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        authorName: data.authorName,
        categoryName: data.categoryName,
        readingTime: data.readingTime,
        status: data.status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'BlogPost',
      entityId: updated.id,
      details: { title: updated.title },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'BlogPost', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
