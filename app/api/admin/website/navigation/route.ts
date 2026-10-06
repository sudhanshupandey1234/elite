import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getNavigationCMS } from '@/lib/cms';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.navigationItem.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const count = await prisma.navigationItem.count();

    const item = await prisma.navigationItem.create({
      data: {
        label: body.label,
        href: body.href,
        order: body.order || count + 1,
        hasDropdown: !!body.hasDropdown,
        dropdownType: body.dropdownType || null,
        isSpecial: !!body.isSpecial,
        isActive: body.isActive !== undefined ? body.isActive : true,
        target: body.target || '_self',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'CREATE',
        entity: 'NavigationItem',
        entityId: item.id,
        detailsJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Batch reorder / update
    if (Array.isArray(body.items)) {
      for (let i = 0; i < body.items.length; i++) {
        const it = body.items[i];
        if (it.id) {
          await prisma.navigationItem.update({
            where: { id: it.id },
            data: {
              label: it.label,
              href: it.href,
              order: i + 1,
              hasDropdown: !!it.hasDropdown,
              dropdownType: it.dropdownType || null,
              isSpecial: !!it.isSpecial,
              isActive: it.isActive !== undefined ? it.isActive : true,
              target: it.target || '_self',
            },
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    // Single item update
    if (body.id) {
      const updated = await prisma.navigationItem.update({
        where: { id: body.id },
        data: {
          label: body.label,
          href: body.href,
          order: body.order,
          hasDropdown: body.hasDropdown,
          dropdownType: body.dropdownType,
          isSpecial: body.isSpecial,
          isActive: body.isActive,
          target: body.target,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.navigationItem.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'DELETE',
        entity: 'NavigationItem',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
