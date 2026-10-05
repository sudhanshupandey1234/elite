import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: {
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const orderNumber = body.orderNumber || `EGX-${Math.floor(1000 + Math.random() * 9000)}`;

    const defaultTimeline = [
      { stage: 'Discovery & Architecture Scoping', completed: true, date: new Date().toISOString() },
      { stage: 'Infrastructure & IaC Pipeline Setup', completed: false },
      { stage: 'Core Development & Integration Sprints', completed: false },
      { stage: 'Zero-Trust Security & QA Audit', completed: false },
      { stage: 'Production Staging & Client Handover', completed: false },
    ];

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerCompany: body.customerCompany,
        serviceName: body.serviceName,
        status: body.status || 'ORDER_RECEIVED',
        paymentStatus: body.paymentStatus || 'PENDING',
        amount: parseFloat(body.totalAmount || body.amount || '0'),
        notes: body.notes,
        expectedCompletion: body.expectedCompletion ? new Date(body.expectedCompletion) : null,
        timelineStepsJson: JSON.stringify(body.timelineSteps || defaultTimeline),
        statusHistory: {
          create: [
            {
              status: body.status || 'ORDER_RECEIVED',
              note: 'Order created in ERP platform',
              updatedBy: user.name,
            },
          ],
        },
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CREATE',
      entity: 'Order',
      entityId: order.id,
      details: { orderNumber: order.orderNumber, customer: order.customerName },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, paymentStatus, notes, timelineSteps, totalAmount, amount } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const statusChanged = status && status !== existing.status;

    // Update order
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        notes: notes !== undefined ? notes : undefined,
        amount: totalAmount !== undefined ? parseFloat(totalAmount) : (amount !== undefined ? parseFloat(amount) : undefined),
        timelineStepsJson: timelineSteps ? JSON.stringify(timelineSteps) : undefined,
      },
    });

    // Log history entry if status changed
    if (statusChanged) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: status,
          note: `Status shifted to ${status}`,
          updatedBy: user.name,
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE',
      entity: 'Order',
      entityId: updated.id,
      details: { orderNumber: updated.orderNumber, status: updated.status },
    });

    return NextResponse.json({ success: true, order: updated });
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

    await prisma.order.delete({ where: { id } });
    await logAuditEvent({ userId: user.id, action: 'DELETE', entity: 'Order', entityId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
