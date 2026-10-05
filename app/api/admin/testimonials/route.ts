import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const item = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        clientRole: body.clientRole,
        clientCompany: body.clientCompany || body.company || 'Enterprise Partner',
        feedback: body.feedback || body.content || '',
        rating: body.rating ? parseInt(body.rating) : 5,
        isFeatured: Boolean(body.isFeatured),
        status: body.status || 'PUBLISHED',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Testimonial',
      entityId: item.id,
      details: { clientName: item.clientName },
    });

    return NextResponse.json({ success: true, testimonial: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.testimonial.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Testimonial', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
