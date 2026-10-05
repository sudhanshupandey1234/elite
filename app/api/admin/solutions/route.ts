import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const solutions = await prisma.solution.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ solutions });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const solution = await prisma.solution.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: body.tagline || '',
        category: body.category || 'Enterprise Platform',
        shortDesc: body.shortDesc,
        fullDesc: body.fullDesc,
        featuresJson: typeof body.featuresJson === 'string' ? body.featuresJson : JSON.stringify(body.featuresJson || []),
        benefitsJson: typeof body.benefitsJson === 'string' ? body.benefitsJson : JSON.stringify(body.benefitsJson || []),
        techStackJson: typeof body.techStackJson === 'string' ? body.techStackJson : JSON.stringify(body.techStackJson || []),
        pricingModel: body.pricingModel || 'Custom Enterprise',
        status: body.status || 'PUBLISHED',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Solution',
      entityId: solution.id,
      details: { name: solution.name },
    });

    return NextResponse.json({ success: true, solution }, { status: 201 });
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
    const updated = await prisma.solution.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        category: data.category,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        pricingModel: data.pricingModel,
        status: data.status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'Solution',
      entityId: updated.id,
      details: { name: updated.name },
    });

    return NextResponse.json({ success: true, solution: updated });
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

    await prisma.solution.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Solution', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
