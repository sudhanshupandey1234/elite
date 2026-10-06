import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ employees });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const employeeId = body.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        department: body.department || 'Engineering',
        designation: body.designation || 'Senior Engineer',
        employmentType: body.employmentType || 'Full-time',
        joiningDate: body.joiningDate ? new Date(body.joiningDate) : new Date(),
        status: body.status || 'ACTIVE',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Employee',
      entityId: employee.id,
      details: { name: `${employee.firstName} ${employee.lastName}`, code: employee.employeeId },
    });

    return NextResponse.json({ success: true, employee }, { status: 201 });
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

    await prisma.employee.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Employee', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
