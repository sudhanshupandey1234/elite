import { NextResponse } from 'next/server';
import { logoutUser, getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST() {
  const user = await getAuthenticatedUser();
  if (user) {
    await logAuditEvent({
      userId: user.id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: user.id,
    });
  }

  await logoutUser();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
