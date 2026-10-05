import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const attendance = await prisma.attendance.findMany({
    include: {
      employee: { select: { firstName: true, lastName: true, employeeId: true, department: true } },
    },
    orderBy: { date: 'desc' },
  });

  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, firstName: true, lastName: true, employeeId: true },
  });

  return NextResponse.json({ attendance, employees });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const record = await prisma.attendance.create({
      data: {
        employeeId: body.employeeId,
        date: body.date ? new Date(body.date) : new Date(),
        status: body.status || 'PRESENT',
        checkIn: body.checkIn || '09:00 AM',
        checkOut: body.checkOut || '05:30 PM',
        remarks: body.remarks || body.notes || null,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Attendance',
      entityId: record.id,
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logging failed' }, { status: 500 });
  }
}
