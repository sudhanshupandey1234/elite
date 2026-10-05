'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ShieldCheck, Bell, Search } from 'lucide-react';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string | null;
  };
}

export function AdminHeader({ user }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft-xs">
      {/* Left Workspace Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Enterprise Operations Core
          </span>
        </div>
        <span className="hidden md:inline-block text-xs text-slate-400">|</span>
        <span className="hidden md:inline-block text-xs text-slate-500 font-medium">
          Production Environment
        </span>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 pr-3 border-r border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-soft-xs">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-blue-700 text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {user.name}
            </div>
            <div className="text-[11px] text-slate-500">{user.email}</div>
          </div>
          <StatusBadge status={user.role} size="sm" />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors shadow-soft-xs"
          title="Sign out of Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
