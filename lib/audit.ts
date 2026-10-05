import prisma from './prisma';

export async function logAuditEvent(params: {
  userId?: string | null;
  userName?: string | null;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  entity: string;
  entityId?: string | null;
  details?: Record<string, any> | string;
  ipAddress?: string | null;
}) {
  try {
    const detailsJson =
      typeof params.details === 'object'
        ? JSON.stringify(params.details)
        : params.details || null;

    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        detailsJson,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
