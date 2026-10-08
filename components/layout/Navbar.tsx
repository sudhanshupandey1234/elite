'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Code,
  Shield,
  Briefcase,
  Compass,
  FileText,
  PackageCheck,
  Building,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/ui/SearchModal';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { cn } from '@/lib/utils';
import { gsap } from '@/components/anim/gsap-setup';
import { motionPrefs } from '@/components/anim/motion';

interface NavbarProps {
  navItems?: Array<{
    name?: string;
    label?: string;
    href: string;
    hasDropdown?: boolean;
    dropdownType?: string | null;
    isSpecial?: boolean;
    target?: string;
  }>;
  services?: Array<{
    title: string;
    shortDesc?: string;
    slug: string;
  }>;
  solutions?: Array<{
    name: string;
    tagline?: string | null;
    slug: string;
  }>;
  brandName?: string;
}

export function Navbar({ navItems: propNavItems, services: propServices, solutions: propSolutions, brandName }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Subtle entrance: navbar slides down + fades in on page load
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const { reduced, mobile } = motionPrefs();
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: mobile ? -10 : -18,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const defaultNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Services',
      href: '/services',
      hasDropdown: true,
      dropdownType: 'services',
    },
    {
      name: 'Solutions',
      href: '/solutions',
      hasDropdown: true,
      dropdownType: 'solutions',
    },
    { name: 'Industries', href: '/industries' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Track Order', href: '/track-order', isSpecial: true },
    { name: 'Contact', href: '/contact' },
  ];

  const navLinks = (propNavItems && propNavItems.length > 0)
    ? propNavItems.map(item => ({
        name: item.label || item.name || 'Link',
        href: item.href,
        hasDropdown: !!item.hasDropdown,
        dropdownType: item.dropdownType,
        isSpecial: !!item.isSpecial,
        target: item.target || '_self',
      }))
    : defaultNavLinks;

  const defaultServicesList = [
    {
      title: 'Cloud Architecture & DevOps',
      desc: 'Kubernetes, multi-cloud platforms, and IaC automation',
      href: '/services/cloud-architecture-devops',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
    },
    {
      title: 'AI & Machine Learning',
      desc: 'Domain LLMs, enterprise RAG, and intelligent automation',
      href: '/services/ai-machine-learning',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
    },
    {
      title: 'Custom Web & Software',
      desc: 'High-velocity Next.js, microservices & scalable systems',
      href: '/services/full-stack-web-engineering',
      icon: <Code className="w-4 h-4 text-sky-600" />,
    },
    {
      title: 'Mobile App Engineering',
      desc: 'Native-grade iOS & Android architectures with React Native',
      href: '/services/mobile-app-development',
      icon: <Briefcase className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Digital Transformation',
      desc: 'Modernizing legacy stacks & end-to-end automation',
      href: '/services/digital-transformation-automation',
      icon: <Compass className="w-4 h-4 text-amber-600" />,
    },
    {
      title: 'UI/UX & Product Design',
      desc: 'Design systems, user research & conversion-first design',
      href: '/services/ui-ux-product-design',
      icon: <FileText className="w-4 h-4 text-rose-600" />,
    },
  ];

  const servicesList = (propServices && propServices.length > 0)
    ? propServices.map((s, idx) => ({
        title: s.title,
        desc: s.shortDesc || 'Enterprise capability',
        href: `/services/${s.slug}`,
        icon: idx % 2 === 0 ? <Layers className="w-4 h-4 text-blue-600" /> : <Sparkles className="w-4 h-4 text-indigo-600" />
      }))
    : defaultServicesList;

  const defaultSolutionsList = [
    {
      name: 'OmniCloud ERP',
      tagline: 'Enterprise Operations, Financials & Supply Chain',
      href: '/solutions/omnicloud-erp',
      icon: <Building className="w-4 h-4 text-blue-600" />,
    },
    {
      name: 'CogniFlow AI',
      tagline: 'Enterprise Semantic Knowledge Assistant',
      href: '/solutions/cogniflow-ai',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
    },
    {
      name: 'SecureShield IAM',
      tagline: 'Zero-Trust Identity, Access & Compliance',
      href: '/solutions/secureshield-iam',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
    },
  ];

  const solutionsList = (propSolutions && propSolutions.length > 0)
    ? propSolutions.map((sol, idx) => ({
        name: sol.name,
        tagline: sol.tagline || 'Enterprise Platform',
        href: `/solutions/${sol.slug}`,
        icon: idx % 2 === 0 ? <Building className="w-4 h-4 text-blue-600" /> : <Shield className="w-4 h-4 text-purple-600" />
      }))
    : defaultSolutionsList;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'glass-nav py-3 shadow-soft-sm'
            : 'bg-white/80 backdrop-blur-sm py-4 border-b border-slate-100'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="EliteGlobex"
              className="h-10 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                ELITE<span className="text-blue-600">GLOBEX</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                Global Technology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown && link.dropdownType === 'services') {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <Link
                      href="/services"
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    {/* Services Dropdown */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-[21rem] p-2.5 rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] z-50 animate-fade-in space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 mb-1">
                          Our Products
                        </div>
                        {servicesList.map((svc) => (
                          <Link
                            key={svc.title}
                            href={svc.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-white group-hover:border-blue-200 transition-colors shrink-0">
                              {svc.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {svc.title}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                                {svc.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="pt-1.5 border-t border-slate-100">
                          <Link
                            href="/services"
                            className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold"
                          >
                            <span>View All Services</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (link.hasDropdown && link.dropdownType === 'solutions') {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setSolutionsDropdown(true)}
                    onMouseLeave={() => setSolutionsDropdown(false)}
                  >
                    <Link
                      href="/solutions"
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    {/* Solutions Dropdown */}
                    {solutionsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-[21rem] p-2.5 rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] z-50 animate-fade-in space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 mb-1">
                          Our Solutions
                        </div>
                        {solutionsList.map((sol) => (
                          <Link
                            key={sol.name}
                            href={sol.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-white group-hover:border-blue-200 transition-colors shrink-0">
                              {sol.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {sol.name}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                                {sol.tagline}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5',
                    link.isSpecial
                      ? 'text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80'
                      : isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {link.isSpecial && <PackageCheck className="w-3.5 h-3.5 text-sky-600" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Search EliteGlobex (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Start a project CTA */}
            <Button
              size="sm"
              variant="glow"
              onClick={() => setProjectModalOpen(true)}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Start a Project
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-white/98 backdrop-blur-2xl pt-24 pb-8 px-6 overflow-y-auto">
          <div className="space-y-1 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-semibold transition-colors',
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <Button
              variant="glow"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                setProjectModalOpen(true);
              }}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Start a Project
            </Button>
            <Button
              variant="secondary"
              href="/contact"
              className="w-full justify-center"
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}

      {/* Global Search and Project Consultation Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </>
  );
}
