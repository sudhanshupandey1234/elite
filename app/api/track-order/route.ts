import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trackOrderSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber } = trackOrderSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error:
            'Order reference not found. Please verify your Order ID (e.g. EGX-1001) or contact our client support desk.',
        },
        { status: 404 }
      );
    }

    let parsedTimeline = [];
    if (order.timelineStepsJson) {
      try {
        parsedTimeline = JSON.parse(order.timelineStepsJson);
      } catch (e) {
        parsedTimeline = [];
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerCompany: order.customerCompany,
        serviceName: order.serviceName,
        status: order.status,
        paymentStatus: order.paymentStatus,
        expectedCompletion: order.expectedCompletion,
        notes: order.notes,
        createdAt: order.createdAt,
        timelineSteps: parsedTimeline,
        history: order.statusHistory,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid Order ID' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Server error retrieving order status' },
      { status: 500 }
    );
  }
}
