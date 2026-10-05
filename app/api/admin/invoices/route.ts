import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    include: {
      order: { select: { orderNumber: true, serviceName: true } },
    },
    orderBy: { issueDate: 'desc' },
  });

  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const invoiceNumber = body.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`;

    const total = parseFloat(body.total || body.totalAmount || '0');
    const subtotal = parseFloat(body.subtotal || total.toString());
    const tax = parseFloat(body.tax || body.taxAmount || '0');

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: body.orderId || null,
        customerName: body.customerName || body.clientName,
        customerEmail: body.customerEmail || body.clientEmail,
        customerCompany: body.customerCompany || body.clientCompany,
        subtotal,
        tax,
        total,
        currency: body.currency || 'USD',
        status: body.status || 'DRAFT',
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        itemsJson: typeof body.itemsJson === 'string' ? body.itemsJson : JSON.stringify(body.itemsJson || [{ description: 'Professional Engineering Services', quantity: 1, unitPrice: total, total }]),
        notes: body.notes,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Invoice',
      entityId: invoice.id,
      details: { invoiceNumber: invoice.invoiceNumber, amount: invoice.total },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'Invoice',
      entityId: updated.id,
      details: { status: updated.status },
    });

    return NextResponse.json({ success: true, invoice: updated });
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

    await prisma.invoice.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Invoice', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
