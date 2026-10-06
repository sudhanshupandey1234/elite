import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    // 1. Create Contact Submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        company: validated.company || null,
        service: validated.service || 'General Enquiry',
        message: validated.message,
        sourcePage: validated.sourcePage || '/contact',
        status: 'UNREAD',
      },
    });

    // 2. Automatically create or update CRM Lead
    const lead = await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        company: validated.company || null,
        serviceInterest: validated.service || 'General Enquiry',
        source: 'WEBSITE',
        status: 'NEW',
        priority: 'MEDIUM',
        notes: `Initial message from ${validated.sourcePage || 'Contact form'}:\n${validated.message}`,
      },
    });

    // 3. Record Audit Log
    await logAuditEvent({
      action: 'CREATE',
      entity: 'Lead',
      entityId: lead.id,
      details: {
        email: validated.email,
        service: validated.service,
        source: validated.sourcePage,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been received. Our team will contact you shortly.',
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact submission error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid form data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error processing enquiry' },
      { status: 500 }
    );
  }
}
