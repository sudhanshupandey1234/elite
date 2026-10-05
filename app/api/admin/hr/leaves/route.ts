import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const leaves = await prisma.leaveRequest.findMany({
    include: {
      employee: { select: { firstName: true, lastName: true, employeeId: true, department: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ leaves });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy: user.name,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'LeaveRequest',
      entityId: updated.id,
      details: { status: updated.status, approver: user.name },
    });

    return NextResponse.json({ success: true, leave: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
