import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const jobs = await prisma.jobPosition.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const job = await prisma.jobPosition.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        department: body.department || 'Engineering',
        location: body.location || 'Remote (Global)',
        employmentType: body.type || body.employmentType || 'Full-time',
        experience: body.experienceLevel || body.experience || 'Senior Level',
        salaryRange: body.salaryRange,
        description: body.description,
        requirementsJson: typeof body.requirementsJson === 'string' ? body.requirementsJson : JSON.stringify(body.requirementsJson || []),
        responsibilitiesJson: typeof body.responsibilitiesJson === 'string' ? body.responsibilitiesJson : JSON.stringify(body.responsibilitiesJson || []),
        skillsJson: typeof body.skillsJson === 'string' ? body.skillsJson : JSON.stringify(body.skillsJson || []),
        status: body.status || 'OPEN',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'JobPosition',
      entityId: job.id,
      details: { title: job.title },
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
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

    await prisma.jobPosition.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'JobPosition', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
