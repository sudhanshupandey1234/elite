import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
  Cpu,
  Layers,
  Sparkles,
  Code2,
  Building2,
  CheckCircle2,
  LineChart,
  Briefcase,
  Users,
  Compass,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { getHomepageCMS, getSiteSettings, DEFAULT_HOMEPAGE_CONTENT } from '@/lib/cms';

export const revalidate = 0; // Dynamic rendering for instant CMS updates

export default async function HomePage() {
  const [
    cmsData,
    settings,
    services,
    solutions,
    industries,
    projects,
    blogPosts,
    testimonials,
    offices,
  ] = await Promise.all([
    getHomepageCMS(),
    getSiteSettings(),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.solution.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 3,
    }),
    prisma.industry.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 4,
    }),
    prisma.projectCaseStudy.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 3,
    }),
    prisma.officeLocation.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { isHQ: 'desc' },
      take: 4,
    }),
  ]);

  const hero = cmsData.hero || DEFAULT_HOMEPAGE_CONTENT;
  const sections = cmsData.sections || [];

  const capabilities = [
    { title: 'Web & Software', desc: 'Full-stack enterprise platforms', icon: <Code2 className="w-5 h-5 text-blue-600" /> },
    { title: 'AI & Automation', desc: 'Applied LLMs & intelligent workflows', icon: <Sparkles className="w-5 h-5 text-indigo-600" /> },
    { title: 'Cloud Solutions', desc: 'Scalable multi-cloud infrastructure', icon: <Server className="w-5 h-5 text-sky-600" /> },
    { title: 'Digital Transformation', desc: 'Modernizing legacy architectures', icon: <Compass className="w-5 h-5 text-emerald-600" /> },
  ];

  const processSteps = [
    { num: '01', title: 'Discover', desc: 'Deep dive into requirements, system audit & business alignment.' },
    { num: '02', title: 'Strategize', desc: 'Architecture blueprinting, security roadmap & technology selection.' },
    { num: '03', title: 'Design', desc: 'Interactive prototypes, UI/UX systems & component libraries.' },
    { num: '04', title: 'Build', desc: 'Agile sprint engineering, clean code & automated CI/CD pipelines.' },
    { num: '05', title: 'Launch', desc: 'Zero-downtime deployment, automated QA & performance tuning.' },
    { num: '06', title: 'Scale', desc: 'Continuous optimization, SLA monitoring & dedicated evolution.' },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Business-First Thinking',
      desc: 'We prioritize measurable commercial impact, cost efficiency, and time-to-market over technical hype.',
      icon: <LineChart className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '02',
      title: 'Modern Engineering',
      desc: 'Built with resilient microservices, typed TypeScript, and cloud-native standards engineered for high scale.',
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: '03',
      title: 'Scalable Architecture',
      desc: 'Infrastructure designed to handle exponential data growth, high concurrency, and global workloads.',
      icon: <Zap className="w-5 h-5 text-sky-600" />,
    },
    {
      num: '04',
      title: 'Long-Term Partnership',
      desc: 'Transparent collaboration with dedicated solution architects, sprint tracking, and ongoing support.',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
    },
  ];

  // Render individual sections
  const renderSection = (key: string, sectionConfig?: any) => {
    switch (key) {
      case 'hero':
        if (!hero.heroIsActive) return null;
        return (
          <section key="hero" className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
            {/* Subtle Ambient Background Gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-100/70 via-indigo-50/50 to-sky-100/60 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  {hero.heroEyebrow && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-soft-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span>{hero.heroEyebrow}</span>
                    </div>
                  )}

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                    {hero.heroTitle}{' '}
                    {hero.heroHighlight && (
                      <span className="gradient-text-blue">{hero.heroHighlight}</span>
                    )}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    {hero.heroDescription}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                    {hero.heroPrimaryBtnText && (
                      <Button
                        size="lg"
                        variant="glow"
                        href={hero.heroPrimaryBtnUrl || '/services'}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        {hero.heroPrimaryBtnText}
                      </Button>
                    )}
                    {hero.heroSecondaryBtnText && (
                      <Button
                        size="lg"
                        variant="secondary"
                        href={hero.heroSecondaryBtnUrl || '/contact'}
                      >
                        {hero.heroSecondaryBtnText}
                      </Button>
                    )}
                    {hero.heroTrackBtnText && (
                      <Button
                        size="lg"
                        variant="outline"
                        href={hero.heroTrackBtnUrl || '/track-order'}
                      >
                        {hero.heroTrackBtnText}
                      </Button>
                    )}
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-left">
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Enterprise</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Cloud Architecture</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SOC2 / ISO</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Security Standards</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Global</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Engineering Delivery</div>
                    </div>
                  </div>
                </div>

                {/* Right Abstract Technology Preview Composition */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200/90 p-6 md:p-8 shadow-soft-xl space-y-6">
                    {/* Visual Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          EG
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">System Architecture Hub</div>
                          <div className="text-[10px] text-slate-500">Live Enterprise Deployment</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {hero.heroBadgeText || 'Operational'}
                      </span>
                    </div>

                    {/* Layered Floating Product Cards */}
                    <div className="space-y-3.5">
                      {/* Card 1: Cloud & API */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center justify-between hover:shadow-soft-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                            <Server className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Multi-Cloud Infrastructure</div>
                            <div className="text-[11px] text-slate-500">Kubernetes & Automated Pipelines</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-600">99.99% SLA</span>
                      </div>

                      {/* Card 2: AI & Data */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center justify-between hover:shadow-soft-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Cognitive AI Pipelines</div>
                            <div className="text-[11px] text-slate-500">Domain-Trained Enterprise RAG</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-indigo-600">High Velocity</span>
                      </div>

                      {/* Card 3: Security & Governance */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm flex items-center justify-between hover:shadow-soft-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Zero-Trust IAM & Security</div>
                            <div className="text-[11px] text-slate-500">End-to-End Encryption & RBAC</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Compliant</span>
                      </div>
                    </div>

                    {/* Micro Stats Banner */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Continuous Delivery</span>
                      </div>
                      <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                        <span>View Case Studies</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'trust_strip':
        return (
          <section key="trust_strip" className="border-y border-slate-200/80 bg-slate-50/70 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {sectionConfig?.title || 'Technology that helps teams build, scale and transform'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {capabilities.map((cap) => (
                  <div
                    key={cap.title}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md hover:border-slate-300 transition-all flex flex-col items-start gap-2.5"
                  >
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {cap.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cap.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Visual Composition */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 text-white shadow-soft-xl space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      Transforming Ideas Into Enterprise Reality
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      We blend deep engineering expertise with strategic product design to help modern organizations build enduring technological advantage.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/20 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-white">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Full lifecycle software engineering and DevOps</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Architected for security, compliance, and velocity</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Dedicated cross-functional engineering pods</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
                    >
                      <span>Learn More About Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Narrative & Feature Points */}
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <div className="space-y-3">
                  <Badge variant="blue">{sectionConfig?.subtitle || 'About EliteGlobex'}</Badge>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {sectionConfig?.title || 'Technology Built Around Your Business Goals.'}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed">
                    EliteGlobex operates as an integrated technical partner for global enterprises and forward-looking scale-ups. From early architecture design and AI implementation to custom ERP solutions and cloud migrations, we build resilient digital foundations that power sustainable growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-xs font-black text-blue-600 tracking-wider">01</span>
                    <h4 className="text-sm font-bold text-slate-900">Business-Focused</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every line of code and architectural decision aligns directly with strategic outcomes.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-xs font-black text-indigo-600 tracking-wider">02</span>
                    <h4 className="text-sm font-bold text-slate-900">Scalable Systems</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Engineered with modern microservices, typed APIs, and cloud-native resilience.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-xs font-black text-sky-600 tracking-wider">03</span>
                    <h4 className="text-sm font-bold text-slate-900">End-to-End</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      From discovery and UI/UX design to automated deployment and lifecycle support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="blue">{sectionConfig?.subtitle || 'Our Engineering Practices'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Solutions Built for Modern Businesses'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Comprehensive technology services designed to solve complex challenges and accelerate digital execution.
                </p>
              </div>
              <Button variant="secondary" href="/services" icon={<ArrowRight className="w-4 h-4" />}>
                View All Services
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services/${svc.slug}`}
                  className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-blue-300 hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Layers className="w-5 h-5" />
                      </div>
                      {svc.category && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {svc.category}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {svc.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );

      case 'solutions':
        return (
          <section key="solutions" className="bg-slate-50/80 border-y border-slate-200/80 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="purple">{sectionConfig?.subtitle || 'Proprietary Platforms'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Enterprise Software Suites'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Turnkey, enterprise-grade software platforms engineered by EliteGlobex to accelerate operational performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {solutions.map((sol) => {
                  let features: string[] = [];
                  try {
                    if (sol.featuresJson) features = JSON.parse(sol.featuresJson);
                  } catch (e) {}

                  return (
                    <div
                      key={sol.id}
                      className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                            {sol.category || 'Enterprise Platform'}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 mt-1">{sol.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            {sol.shortDesc}
                          </p>
                        </div>

                        {features.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            {features.slice(0, 3).map((f: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100">
                        <Button
                          variant="secondary"
                          className="w-full justify-center"
                          href={`/solutions/${sol.slug}`}
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Explore Platform
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'industries':
        return (
          <section key="industries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="cyan">{sectionConfig?.subtitle || 'Domain Specialization'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Tailored Solutions for Regulated Industries'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Navigating complex compliance, specialized data models, and industry standards across global sectors.
                </p>
              </div>
              <Button variant="secondary" href="/industries" icon={<ArrowRight className="w-4 h-4" />}>
                View All Industries
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((ind) => (
                <Link
                  key={ind.id}
                  href={`/industries/${ind.slug}`}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-blue-300 hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ind.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                        {ind.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                    <span>Explore Sector</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );

      case 'why_us':
        return (
          <section key="why_us" className="bg-slate-50/80 border-y border-slate-200/80 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="blue">{sectionConfig?.subtitle || 'Why EliteGlobex'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Why Businesses Choose EliteGlobex'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  We combine enterprise engineering rigor with startup agility to deliver exceptional digital outcomes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyChooseUs.map((item) => (
                  <div
                    key={item.num}
                    className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        {item.icon}
                      </div>
                      <span className="text-xs font-black text-slate-400 font-mono">{item.num}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'process':
        return (
          <section key="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="indigo">{sectionConfig?.subtitle || 'Delivery Methodology'}</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {sectionConfig?.title || 'How We Work'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                A battle-tested 6-stage engineering process guaranteeing transparency, architectural excellence, and on-time delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {processSteps.map((step) => (
                <div
                  key={step.num}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm relative flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-blue-600 tracking-wider font-mono block mb-2">
                      {step.num}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        return (
          <section key="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="blue">{sectionConfig?.subtitle || 'Featured Case Studies'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Proven Enterprise Impact'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Explore how we have engineered scalable solutions for modern organizations worldwide.
                </p>
              </div>
              <Button variant="secondary" href="/projects" icon={<ArrowRight className="w-4 h-4" />}>
                View All Projects
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => {
                let techStack: string[] = [];
                try {
                  if (proj.techStackJson) techStack = JSON.parse(proj.techStackJson);
                } catch (e) {}

                return (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          {proj.industry || 'Enterprise Project'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Case Study</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {proj.shortDesc}
                        </p>
                      </div>

                      {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {techStack.slice(0, 3).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                      <span>View Full Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );

      case 'testimonials':
        if (!testimonials || testimonials.length === 0) return null;
        return (
          <section key="testimonials" className="bg-slate-50/80 border-y border-slate-200/80 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge variant="emerald">{sectionConfig?.subtitle || 'Client Testimonials'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Trusted by Forward-Thinking Leaders'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  What technology leaders and corporate partners say about engineering with EliteGlobex.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-5"
                  >
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      &ldquo;{t.feedback}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-soft-sm">
                        {t.clientName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.clientName}</div>
                        <div className="text-[11px] text-slate-500">
                          {t.clientRole} {t.clientCompany && `• ${t.clientCompany}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'blog':
        if (!blogPosts || blogPosts.length === 0) return null;
        return (
          <section key="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="blue">{sectionConfig?.subtitle || 'Insights & Ideas'}</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {sectionConfig?.title || 'Latest Engineering Perspectives'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Articles and technical deep dives on cloud architecture, AI workflows, and software scale.
                </p>
              </div>
              <Button variant="secondary" href="/blog" icon={<ArrowRight className="w-4 h-4" />}>
                Read All Articles
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-lg hover:border-slate-300 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                        {post.categoryName || 'Engineering'}
                      </span>
                      <span>{post.readingTime ? `${post.readingTime}` : 'Article'}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-soft-2xl">
              {/* Background subtle light effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none" />

              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{sectionConfig?.subtitle || 'Let’s Build Something Enduring'}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {sectionConfig?.title || settings.cta_heading || 'Have a project in mind?'}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {settings.cta_subheading || 'Let\'s turn your idea into a scalable digital solution. Our principal architects are ready to evaluate your requirements and scope your milestones.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="glow"
                    href={settings.cta_btn_url || '/contact'}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {settings.cta_btn_text || 'Start a Conversation'}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    href="/services"
                  >
                    Explore Services
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Filter and order active sections
  const activeSections = sections.filter((s: any) => s.isActive);

  return (
    <div className="space-y-24 sm:space-y-32">
      <OrganizationJsonLd />
      {activeSections.map((section: any) => renderSection(section.sectionKey, section))}
    </div>
  );
}
