import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const applications = await prisma.jobApplication.findMany({
    include: {
      job: { select: { title: true, department: true, location: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ applications });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status, notes },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'JobApplication',
      entityId: updated.id,
      details: { candidate: updated.candidateName, status: updated.status },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
