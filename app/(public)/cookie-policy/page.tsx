import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Cookie Policy | EliteGlobex',
  description: 'Information on how EliteGlobex utilizes essential cookies and session security tokens.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <Badge variant="blue">Compliance</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Cookie Policy</h1>
        <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-slate-700 text-sm leading-relaxed space-y-6">
        <p>
          EliteGlobex uses strictly necessary cookies and secure session tokens (`egx_session_token`) to provide secure user authentication, role-based admin dashboard authorization, and CSRF protection.
        </p>
        <h2 className="text-lg font-bold text-slate-900">1. Strictly Necessary Cookies</h2>
        <p>
          These cookies are required for administrative login state persistence, session security, and protecting the integrity of API interactions. They do not track your activity across unrelated third-party websites.
        </p>
        <h2 className="text-lg font-bold text-slate-900">2. Managing Preferences</h2>
        <p>
          You can configure your browser settings to reject or delete cookies. However, disabling authentication cookies will prevent access to restricted client and administrator portal modules.
        </p>
      </div>
    </div>
  );
}
