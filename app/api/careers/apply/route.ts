import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jobApplicationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = jobApplicationSchema.parse(body);

    // Verify job position exists
    const job = await prisma.jobPosition.findUnique({
      where: { id: validated.jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Specified job position does not exist or has closed.' },
        { status: 404 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: validated.jobId,
        candidateName: validated.candidateName,
        email: validated.email,
        phone: validated.phone,
        coverLetter: validated.coverLetter || null,
        portfolioUrl: validated.portfolioUrl || null,
        linkedInUrl: validated.linkedInUrl || null,
        gitHubUrl: validated.gitHubUrl || null,
        experienceYears: validated.experienceYears || null,
        resumeUrl: validated.resumeText || 'Submitted via online portal',
        status: 'SUBMITTED',
      },
    });

    await logAuditEvent({
      action: 'CREATE',
      entity: 'JobApplication',
      entityId: application.id,
      details: {
        candidateName: validated.candidateName,
        email: validated.email,
        jobTitle: job.title,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been received. Our recruitment team will review your profile.',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Job application error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid application submission' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal error submitting job application' },
      { status: 500 }
    );
  }
}
