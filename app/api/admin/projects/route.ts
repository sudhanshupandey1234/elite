import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = await prisma.projectCaseStudy.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const project = await prisma.projectCaseStudy.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        clientName: body.clientName,
        industry: body.industry,
        shortDesc: body.shortDesc,
        challenge: body.challenge,
        solution: body.solution,
        resultsJson: typeof body.resultsJson === 'string' ? body.resultsJson : JSON.stringify(body.resultsJson || []),
        metricsJson: typeof body.metricsJson === 'string' ? body.metricsJson : JSON.stringify(body.metricsJson || []),
        techStackJson: typeof body.techStackJson === 'string' ? body.techStackJson : JSON.stringify(body.techStackJson || []),
        isFeatured: body.isFeatured || false,
        isSampleData: body.isSampleData || false,
        status: body.status || 'PUBLISHED',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'ProjectCaseStudy',
      entityId: project.id,
      details: { title: project.title },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
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
    const updated = await prisma.projectCaseStudy.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        clientName: data.clientName,
        industry: data.industry,
        shortDesc: data.shortDesc,
        challenge: data.challenge,
        solution: data.solution,
        isFeatured: data.isFeatured,
        isSampleData: data.isSampleData,
        status: data.status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'ProjectCaseStudy',
      entityId: updated.id,
      details: { title: updated.title },
    });

    return NextResponse.json({ success: true, project: updated });
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

    await prisma.projectCaseStudy.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'ProjectCaseStudy', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
