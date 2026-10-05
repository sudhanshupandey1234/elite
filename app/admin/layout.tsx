import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  // If user is not authenticated, render children directly (which is the login page or redirects)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Admin Sidebar */}
      <AdminSidebar userRole={user.role} />

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
          }}
        />
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
