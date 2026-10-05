import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await loginUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
