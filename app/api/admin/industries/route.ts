import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const industries = await prisma.industry.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ industries });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const industry = await prisma.industry.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: body.summary || body.shortDesc || '',
        fullDesc: body.fullDesc || '',
        challengesJson: typeof body.challengesJson === 'string' ? body.challengesJson : JSON.stringify(body.challengesJson || []),
        solutionsJson: typeof body.solutionsJson === 'string' ? body.solutionsJson : JSON.stringify(body.solutionsJson || []),
        status: body.status || 'PUBLISHED',
      },
    });
    return NextResponse.json({ success: true, industry }, { status: 201 });
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

    await prisma.industry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
