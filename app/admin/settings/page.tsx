'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'EliteGlobex',
    tagline: 'Building Digital Solutions for a Smarter Future',
    site_description: 'Global Technology & Digital Engineering Platform delivering enterprise cloud, AI, and scalable digital solutions.',
    contact_email: 'contact@eliteglobex.com',
    contact_phone: '+1 (800) 555-ELITE',
    hq_address: '100 Bishopsgate, Level 24, London, EC2N 4AG, United Kingdom',
    support_hours: '24/7 Global Enterprise Support',
    footer_about: 'EliteGlobex is a premier digital engineering and enterprise technology consultancy helping forward-thinking enterprises design, develop, and scale mission-critical software solutions.',
    footer_copyright: '© 2026 EliteGlobex Inc. All rights reserved.',
    social_linkedin: 'https://linkedin.com/company/eliteglobex',
    social_twitter: 'https://twitter.com/eliteglobex',
    social_github: 'https://github.com/eliteglobex',
    social_youtube: 'https://youtube.com',
    cta_heading: 'Ready to build something transformative?',
    cta_subheading: 'Schedule an executive discovery session with our lead architects to discuss your technical roadmap.',
    cta_btn_text: 'Schedule Architecture Review',
    cta_btn_url: '/contact',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load site settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Website settings saved and applied successfully!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save settings.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading platform settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Administration"
        title="Site Settings & Global Branding"
        subtitle="Update corporate branding, contact emails, phone numbers, footer bio, social links, and bottom CTA banners."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        }
      />

      {/* Alert Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Company Branding */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Brand & Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Brand Name</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="EliteGlobex"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Tagline (Under Logo)</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Global Technology & Solutions"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Default Meta Description</label>
            <textarea
              rows={2}
              value={settings.site_description || ''}
              onChange={(e) => handleChange('site_description', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span>Public Contact Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Public Contact Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contact@eliteglobex.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Main Phone Number</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+1 (800) 555-ELITE"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Global Headquarters Address</label>
              <input
                type="text"
                value={settings.hq_address || ''}
                onChange={(e) => handleChange('hq_address', e.target.value)}
                placeholder="100 Bishopsgate, Level 24, London, EC2N 4AG, UK"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Support Availability Hours</label>
              <input
                type="text"
                value={settings.support_hours || ''}
                onChange={(e) => handleChange('support_hours', e.target.value)}
                placeholder="24/7 Global Enterprise Support"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Footer & Legal */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Footer & Legal Info</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Footer About Bio</label>
            <textarea
              rows={2}
              value={settings.footer_about || ''}
              onChange={(e) => handleChange('footer_about', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Copyright Line</label>
            <input
              type="text"
              value={settings.footer_copyright || ''}
              onChange={(e) => handleChange('footer_copyright', e.target.value)}
              placeholder="© 2026 EliteGlobex Inc. All rights reserved."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Share2 className="w-5 h-5 text-blue-600" />
            <span>Social Media Profiles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">LinkedIn URL</label>
              <input
                type="text"
                value={settings.social_linkedin || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/eliteglobex"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Twitter / X URL</label>
              <input
                type="text"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                placeholder="https://twitter.com/eliteglobex"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">GitHub URL</label>
              <input
                type="text"
                value={settings.social_github || ''}
                onChange={(e) => handleChange('social_github', e.target.value)}
                placeholder="https://github.com/eliteglobex"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">YouTube Channel</label>
              <input
                type="text"
                value={settings.social_youtube || ''}
                onChange={(e) => handleChange('social_youtube', e.target.value)}
                placeholder="https://youtube.com/@eliteglobex"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Bottom CTA Banner */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Global Bottom Call-To-Action (CTA)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">CTA Main Heading</label>
              <input
                type="text"
                value={settings.cta_heading || ''}
                onChange={(e) => handleChange('cta_heading', e.target.value)}
                placeholder="Have a project in mind?"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">CTA Subtext</label>
              <input
                type="text"
                value={settings.cta_subheading || ''}
                onChange={(e) => handleChange('cta_subheading', e.target.value)}
                placeholder="Let's turn your idea into a scalable digital solution..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">CTA Button Text</label>
              <input
                type="text"
                value={settings.cta_btn_text || ''}
                onChange={(e) => handleChange('cta_btn_text', e.target.value)}
                placeholder="Start a Conversation"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">CTA Button URL</label>
              <input
                type="text"
                value={settings.cta_btn_url || ''}
                onChange={(e) => handleChange('cta_btn_url', e.target.value)}
                placeholder="/contact"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving All Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Apply Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
