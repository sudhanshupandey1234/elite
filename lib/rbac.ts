export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'SALES' | 'MANAGER' | 'EMPLOYEE' | 'EDITOR';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'dashboard:view',
    'cms:*',
    'crm:*',
    'orders:*',
    'invoices:*',
    'payments:*',
    'projects:*',
    'hr:*',
    'users:*',
    'audit:view',
    'settings:*',
  ],
  MANAGER: [
    'dashboard:view',
    'cms:read',
    'crm:*',
    'orders:*',
    'invoices:read',
    'projects:*',
    'hr:read',
    'hr:leaves',
    'hr:attendance',
  ],
  SALES: [
    'dashboard:view',
    'crm:*',
    'orders:read',
    'orders:create',
    'invoices:read',
  ],
  HR: [
    'dashboard:view',
    'hr:*',
    'careers:*',
    'applications:*',
  ],
  EDITOR: [
    'dashboard:view',
    'cms:*',
    'media:*',
  ],
  EMPLOYEE: [
    'dashboard:view',
    'projects:tasks',
    'hr:my-attendance',
    'hr:my-leaves',
  ],
};

export function hasPermission(role: string, requiredPermission: string): boolean {
  const userRole = (role as Role) || 'EMPLOYEE';
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  if (permissions.includes('*')) return true;
  if (permissions.includes(requiredPermission)) return true;

  // Check wildcards like cms:*
  const [domain] = requiredPermission.split(':');
  if (permissions.includes(`${domain}:*`)) return true;

  return false;
}
