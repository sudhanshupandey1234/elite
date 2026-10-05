import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { serviceSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        category: validated.category,
        shortDesc: validated.shortDesc,
        fullDesc: validated.fullDesc,
        featuresJson: typeof validated.featuresJson === 'string' ? validated.featuresJson : JSON.stringify(validated.featuresJson || []),
        techStackJson: typeof validated.techStackJson === 'string' ? validated.techStackJson : JSON.stringify(validated.techStackJson || []),
        processJson: typeof validated.processJson === 'string' ? validated.processJson : JSON.stringify(validated.processJson || []),
        faqsJson: typeof validated.faqsJson === 'string' ? validated.faqsJson : JSON.stringify(validated.faqsJson || []),
        status: validated.status || 'PUBLISHED',
        order: validated.order || 0,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Service',
      entityId: service.id,
      details: { title: service.title, slug: service.slug },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        featuresJson: typeof data.featuresJson === 'string' ? data.featuresJson : JSON.stringify(data.featuresJson),
        techStackJson: typeof data.techStackJson === 'string' ? data.techStackJson : JSON.stringify(data.techStackJson),
        status: data.status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'Service',
      entityId: updated.id,
      details: { title: updated.title },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: 'DELETE',
      entity: 'Service',
      entityId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
