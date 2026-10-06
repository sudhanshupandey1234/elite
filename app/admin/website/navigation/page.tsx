'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  MoveUp,
  MoveDown,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';

export default function AdminNavigationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form state for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    hasDropdown: false,
    dropdownType: 'none',
    isSpecial: false,
    isActive: true,
    target: '_self',
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/website/navigation');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to fetch navigation items.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      label: '',
      href: '',
      hasDropdown: false,
      dropdownType: 'none',
      isSpecial: false,
      isActive: true,
      target: '_self',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      href: item.href,
      hasDropdown: item.hasDropdown,
      dropdownType: item.dropdownType || 'none',
      isSpecial: item.isSpecial,
      isActive: item.isActive,
      target: item.target || '_self',
    });
    setModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      ...formData,
      dropdownType: formData.hasDropdown && formData.dropdownType !== 'none' ? formData.dropdownType : null,
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch('/api/admin/website/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/website/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setMessage({
          type: 'success',
          text: editingItem ? 'Navigation item updated!' : 'Navigation item created!',
        });
        setModalOpen(false);
        fetchItems();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save item.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return;
    try {
      const res = await fetch(`/api/admin/website/navigation?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        setMessage({ type: 'success', text: 'Navigation link deleted.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    newItems.forEach((it, idx) => {
      it.order = idx + 1;
    });

    setItems(newItems);

    // Save batch reorder
    try {
      await fetch('/api/admin/website/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleItemActive = async (index: number) => {
    const newItems = [...items];
    newItems[index].isActive = !newItems[index].isActive;
    setItems(newItems);

    try {
      await fetch('/api/admin/website/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newItems[index].id, isActive: newItems[index].isActive }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="CMS & Website"
        title="Navigation Menu Builder"
        subtitle="Manage public header navigation, dropdown mega-menus, pill highlights, and route sorting."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Nav Link
          </button>
        }
      />

      {/* Alert */}
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

      {/* Items List */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="py-3 px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Active Navbar Items ({items.length})</span>
          <span>Order & Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading navigation items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No navigation items created yet. Click &quot;Add Nav Link&quot; to build your menu.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`py-3.5 px-5 flex items-center justify-between gap-4 transition-colors ${
                  item.isActive ? 'hover:bg-slate-50/80' : 'opacity-50 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{item.label}</span>
                      {item.hasDropdown && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          Dropdown: {item.dropdownType}
                        </span>
                      )}
                      {item.isSpecial && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Pill Highlight
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-500">{item.href}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-20 text-slate-600 transition-colors"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-20 text-slate-600 transition-colors"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleItemActive(idx)}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                    title={item.isActive ? 'Hide' : 'Show'}
                  >
                    {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Edit Link"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Navigation Link' : 'Add New Navigation Link'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Link Label</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. Solutions, Case Studies, Pricing"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Target URL / Path</label>
            <input
              type="text"
              required
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              placeholder="e.g. /services, /about, /page/whitepaper"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDropdown}
                onChange={(e) => setFormData({ ...formData, hasDropdown: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">Enable Dropdown</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">Special Pill Style</span>
            </label>
          </div>

          {formData.hasDropdown && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Dropdown Content Source</label>
              <select
                value={formData.dropdownType}
                onChange={(e) => setFormData({ ...formData, dropdownType: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="services">Published Services (Auto-Populated)</option>
                <option value="solutions">Published Solutions / Products (Auto-Populated)</option>
                <option value="custom">Custom Sub-links</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Open Target</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="_self">Same Tab (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Visibility</label>
              <select
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Navigation Link'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
