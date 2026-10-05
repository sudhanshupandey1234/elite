'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import {
  Globe,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  RefreshCw,
  Sparkles,
  LayoutTemplate,
  AlertCircle,
  Sliders,
} from 'lucide-react';

export default function AdminHomepageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [hero, setHero] = useState<any>({
    heroEyebrow: '',
    heroTitle: '',
    heroHighlight: '',
    heroDescription: '',
    heroPrimaryBtnText: '',
    heroPrimaryBtnUrl: '',
    heroSecondaryBtnText: '',
    heroSecondaryBtnUrl: '',
    heroTrackBtnText: '',
    heroTrackBtnUrl: '',
    heroBadgeText: '',
    heroIsActive: true,
  });

  const [sections, setSections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections'>('hero');

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/website/homepage');
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHero(data.hero);
        if (data.sections) setSections(data.sections);
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load homepage CMS data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/website/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, sections }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Homepage content & sections updated successfully!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save changes.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recalculate order numbers
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setSections(newSections);
  };

  const toggleSection = (index: number) => {
    const newSections = [...sections];
    newSections[index].isActive = !newSections[index].isActive;
    setSections(newSections);
  };

  const updateSectionTitle = (index: number, field: 'title' | 'subtitle', val: string) => {
    const newSections = [...sections];
    newSections[index][field] = val;
    setSections(newSections);
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading Homepage CMS Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumb="CMS & Website"
        title="Homepage & Hero Customizer"
        subtitle="Customize hero headline, subtext, call-to-action buttons, and reorder or toggle any public section without touching code."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Live Site</span>
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Changes</span>
                </>
              )}
            </button>
          </div>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'hero'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Banner Content</span>
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'sections'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Section Order & Visibility ({sections.length})</span>
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hero Header & Taglines</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The primary focal element presented above the fold.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={hero.heroIsActive}
                onChange={(e) => setHero({ ...hero, heroIsActive: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">Hero Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Hero Eyebrow (Small Pill Badge)</label>
              <input
                type="text"
                value={hero.heroEyebrow || ''}
                onChange={(e) => setHero({ ...hero, heroEyebrow: e.target.value })}
                placeholder="GLOBAL TECHNOLOGY & DIGITAL SOLUTIONS"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">System Badge Status (Top Right)</label>
              <input
                type="text"
                value={hero.heroBadgeText || ''}
                onChange={(e) => setHero({ ...hero, heroBadgeText: e.target.value })}
                placeholder="Operational / 99.99% SLA"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Hero Main Title</label>
              <input
                type="text"
                value={hero.heroTitle || ''}
                onChange={(e) => setHero({ ...hero, heroTitle: e.target.value })}
                placeholder="Building Digital Solutions That Move"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Hero Gradient Highlight Text</label>
              <input
                type="text"
                value={hero.heroHighlight || ''}
                onChange={(e) => setHero({ ...hero, heroHighlight: e.target.value })}
                placeholder="Businesses Forward."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Hero Subtitle / Description</label>
            <textarea
              rows={3}
              value={hero.heroDescription || ''}
              onChange={(e) => setHero({ ...hero, heroDescription: e.target.value })}
              placeholder="EliteGlobex helps enterprises and ambitious companies design, build, and scale modern digital products..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons Configuration */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hero Call-to-Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Button 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-blue-700">Primary Glowing Button</span>
                <input
                  type="text"
                  value={hero.heroPrimaryBtnText || ''}
                  onChange={(e) => setHero({ ...hero, heroPrimaryBtnText: e.target.value })}
                  placeholder="Button Text (e.g. Explore Services)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={hero.heroPrimaryBtnUrl || ''}
                  onChange={(e) => setHero({ ...hero, heroPrimaryBtnUrl: e.target.value })}
                  placeholder="Target URL (e.g. /services)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              {/* Button 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-indigo-700">Secondary Action Button</span>
                <input
                  type="text"
                  value={hero.heroSecondaryBtnText || ''}
                  onChange={(e) => setHero({ ...hero, heroSecondaryBtnText: e.target.value })}
                  placeholder="Button Text (e.g. Start a Project)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={hero.heroSecondaryBtnUrl || ''}
                  onChange={(e) => setHero({ ...hero, heroSecondaryBtnUrl: e.target.value })}
                  placeholder="Target URL (e.g. /contact)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              {/* Button 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-sky-700">Outline Tracker Button</span>
                <input
                  type="text"
                  value={hero.heroTrackBtnText || ''}
                  onChange={(e) => setHero({ ...hero, heroTrackBtnText: e.target.value })}
                  placeholder="Button Text (e.g. Track Project)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={hero.heroTrackBtnUrl || ''}
                  onChange={(e) => setHero({ ...hero, heroTrackBtnUrl: e.target.value })}
                  placeholder="Target URL (e.g. /track-order)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-700">
              Reorder homepage components or toggle visibility. Changes will immediately sync to the public layout.
            </span>
            <span className="text-xs font-mono text-blue-700 font-bold">
              {sections.filter((s) => s.isActive).length} of {sections.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.sectionKey}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  section.isActive
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{section.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {section.sectionKey}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-3">
                        {section.title && <span>Heading: &quot;{section.title}&quot;</span>}
                        {section.subtitle && <span>Eyebrow: &quot;{section.subtitle}&quot;</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions & controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      title="Move Down"
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSection(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        section.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {section.isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Optional Editable Headings */}
                {section.isActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Display Heading Override
                      </label>
                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={(e) => updateSectionTitle(idx, 'title', e.target.value)}
                        placeholder="Leave blank for default"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Eyebrow / Subtitle Override
                      </label>
                      <input
                        type="text"
                        value={section.subtitle || ''}
                        onChange={(e) => updateSectionTitle(idx, 'subtitle', e.target.value)}
                        placeholder="Leave blank for default"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
