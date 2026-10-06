import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const offices = await prisma.officeLocation.findMany({ orderBy: [{ isHQ: 'desc' }, { createdAt: 'asc' }] });
  return NextResponse.json({ offices });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const office = await prisma.officeLocation.create({
      data: {
        name: body.name || `${body.city} Innovation Hub`,
        city: body.city,
        country: body.country,
        state: body.state || null,
        address: body.address,
        phone: body.phone,
        email: body.email,
        workingHours: body.workingHours || 'Mon - Fri: 9:00 AM - 6:00 PM (Local)',
        isHQ: Boolean(body.isHQ),
        status: body.status || 'ACTIVE',
      },
    });
    return NextResponse.json({ success: true, office }, { status: 201 });
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

    await prisma.officeLocation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
