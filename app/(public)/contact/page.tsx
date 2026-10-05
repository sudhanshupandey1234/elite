'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Cloud Architecture & DevOps',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'Cloud Architecture & DevOps',
    'AI & Machine Learning Solutions',
    'Custom Web & Enterprise Software',
    'Mobile App Engineering (iOS & Android)',
    'Digital Transformation & Automation',
    'UI/UX & Product Design',
    'Enterprise ERP Platform Consultation',
    'Other / General Partnership',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          service: formData.service,
          message: formData.message,
          sourcePage: '/contact',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue">Connect with EliteGlobex</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Let’s Discuss Your Next <span className="gradient-text-blue">Technical Milestone</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Whether you need a dedicated engineering squad, a turnkey cloud migration, or an AI agent architecture review, our principal consultants are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-xs text-slate-500">
                All inquiries are protected by standard mutual confidentiality obligations.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Dispatched</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-slate-900 font-semibold">{formData.name}</span>. Your inquiry has been routed to our technical solutions team. A principal architect will respond within 24 hours.
                </p>
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        service: 'Cloud Architecture & DevOps',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Sterling"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="david@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Enterprises"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Service of Interest <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Project Overview & Timeline <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your objectives, existing architecture, and preferred launch timeline..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white resize-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={loading}
                    className="w-full sm:w-auto"
                  >
                    Send Inbound Enquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Contact Information & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Direct Communication</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Direct Inquiries</div>
                  <div className="text-slate-500">contact@eliteglobex.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Global Desk</div>
                  <div className="text-slate-500 font-mono">+1 (800) 555-ELITE / +44 20 7946 0920</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Operational Coverage</div>
                  <div className="text-slate-500">24/7 Global Engineering Operations</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Global Headquarters</div>
                  <div className="text-slate-500">100 Bishopsgate, Level 24, London, EC2N 4AG, UK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 text-sm font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>Enterprise SLA Commitment</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We respond to all verified corporate inquiries within one business day. For urgent critical incident support, contracted clients should utilize their dedicated P1 Slack/PagerDuty channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
