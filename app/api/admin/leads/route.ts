import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        serviceInterest: body.serviceInterest || 'General Enquiry',
        estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : null,
        source: body.source || 'MANUAL',
        status: body.status || 'NEW',
        priority: body.priority || 'MEDIUM',
        notes: body.notes,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Lead',
      entityId: lead.id,
      details: { name: lead.name, email: lead.email },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
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

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: data.status,
        priority: data.priority,
        notes: data.notes,
        estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : undefined,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'Lead',
      entityId: updated.id,
      details: { status: updated.status, priority: updated.priority },
    });

    return NextResponse.json({ success: true, lead: updated });
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

    await prisma.lead.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Lead', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
