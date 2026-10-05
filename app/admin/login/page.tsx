'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@eliteglobex.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="/logo.png"
              alt="EliteGlobex"
              className="h-12 w-auto object-contain rounded-xl shadow-md"
            />
            <div className="text-left">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-0.5">
                ELITE<span className="text-blue-600">GLOBEX</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block -mt-0.5">
                Admin & ERP Gateway
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 pt-3">Authorized Access Portal</h1>
          <p className="text-xs text-slate-500">
            Sign in to manage CMS content, CRM pipelines, ERP operations, and system telemetry.
          </p>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eliteglobex.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Authenticate & Enter'}
              </button>
            </div>
          </form>

          {/* Quick One-Click Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Quick One-Click Demo Roles:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCredentials('admin@eliteglobex.com', 'Admin@123456')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <div className="font-bold text-blue-700 text-[11px]">Super Admin</div>
                <div className="text-[10px] text-slate-500 truncate">admin@eliteglobex.com</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('sarah.manager@eliteglobex.com', 'Manager@123456')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <div className="font-bold text-indigo-700 text-[11px]">Operations Mgr</div>
                <div className="text-[10px] text-slate-500 truncate">sarah.manager@...</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('hr@eliteglobex.com', 'HRAdmin@123456')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <div className="font-bold text-purple-700 text-[11px]">HR Admin</div>
                <div className="text-[10px] text-slate-500 truncate">hr@eliteglobex.com</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('james.eng@eliteglobex.com', 'Staff@123456')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <div className="font-bold text-emerald-700 text-[11px]">Staff Engineer</div>
                <div className="text-[10px] text-slate-500 truncate">james.eng@...</div>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <span>← Back to Public Corporate Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
