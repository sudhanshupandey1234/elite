import { prisma } from '@/lib/prisma';

// Default Fallback Hero & CMS Settings
export const DEFAULT_HOMEPAGE_CONTENT = {
  id: 'default',
  heroEyebrow: 'GLOBAL TECHNOLOGY & DIGITAL SOLUTIONS',
  heroTitle: 'Building Digital Solutions That Move',
  heroHighlight: 'Businesses Forward.',
  heroDescription:
    'EliteGlobex helps enterprises and ambitious companies design, build, and scale modern digital products, cloud platforms, and intelligent technology solutions with predictable velocity.',
  heroPrimaryBtnText: 'Explore Our Services',
  heroPrimaryBtnUrl: '/services',
  heroSecondaryBtnText: 'Start a Project',
  heroSecondaryBtnUrl: '/contact',
  heroTrackBtnText: 'Track Project',
  heroTrackBtnUrl: '/track-order',
  heroBadgeText: 'Operational',
  heroIsActive: true,
};

export const DEFAULT_HOMEPAGE_SECTIONS = [
  { sectionKey: 'hero', name: 'Hero Banner', title: 'Main Hero', subtitle: null, order: 1, isActive: true },
  { sectionKey: 'trust_strip', name: 'Trust & Tech Logos', title: 'Trusted By Global Leaders', subtitle: null, order: 2, isActive: true },
  { sectionKey: 'about', name: 'Who We Are / Metrics', title: 'Empowering Global Enterprises', subtitle: 'Our Heritage & Delivery Standards', order: 3, isActive: true },
  { sectionKey: 'services', name: 'Core Services Grid', title: 'Specialized Engineering & Cloud Capabilities', subtitle: 'End-to-end technical excellence', order: 4, isActive: true },
  { sectionKey: 'solutions', name: 'Enterprise Solutions / Products', title: 'Pre-Engineered Enterprise Solutions', subtitle: 'Accelerate time-to-market with production-grade architectures', order: 5, isActive: true },
  { sectionKey: 'industries', name: 'Industries We Serve', title: 'Tailored Industry Solutions', subtitle: 'Deep domain expertise across regulated and fast-moving sectors', order: 6, isActive: true },
  { sectionKey: 'why_us', name: 'Why Choose EliteGlobex', title: 'Why Global Leaders Choose EliteGlobex', subtitle: 'Engineering excellence meets enterprise reliability', order: 7, isActive: true },
  { sectionKey: 'process', name: 'Delivery Methodology', title: 'Our 4-Phase Delivery Framework', subtitle: 'Agile execution with institutional rigor', order: 8, isActive: true },
  { sectionKey: 'projects', name: 'Featured Case Studies', title: 'Proven Results in Production', subtitle: 'Real-world impact delivered for enterprise clients', order: 9, isActive: true },
  { sectionKey: 'testimonials', name: 'Client Testimonials', title: 'What Our Partners Say', subtitle: 'Endorsements from executives and engineering leaders', order: 10, isActive: true },
  { sectionKey: 'blog', name: 'Latest Insights / Blog', title: 'Engineering & Technology Insights', subtitle: 'Perspectives from our senior architects and technologists', order: 11, isActive: true },
  { sectionKey: 'cta', name: 'Bottom Call to Action', title: 'Ready to Transform Your Digital Infrastructure?', subtitle: 'Speak with a principal solutions architect today.', order: 12, isActive: true },
];

export const DEFAULT_NAVIGATION_ITEMS = [
  { label: 'Services', href: '/services', order: 1, hasDropdown: true, dropdownType: 'services', isSpecial: false, isActive: true, target: '_self' },
  { label: 'Solutions', href: '/solutions', order: 2, hasDropdown: true, dropdownType: 'solutions', isSpecial: false, isActive: true, target: '_self' },
  { label: 'Industries', href: '/industries', order: 3, hasDropdown: false, dropdownType: null, isSpecial: false, isActive: true, target: '_self' },
  { label: 'Case Studies', href: '/projects', order: 4, hasDropdown: false, dropdownType: null, isSpecial: false, isActive: true, target: '_self' },
  { label: 'Company', href: '/about', order: 5, hasDropdown: false, dropdownType: null, isSpecial: false, isActive: true, target: '_self' },
  { label: 'Insights', href: '/blog', order: 6, hasDropdown: false, dropdownType: null, isSpecial: false, isActive: true, target: '_self' },
  { label: 'Careers', href: '/careers', order: 7, hasDropdown: false, dropdownType: null, isSpecial: false, isActive: true, target: '_self' },
  { label: 'Track Project', href: '/track-order', order: 8, hasDropdown: false, dropdownType: null, isSpecial: true, isActive: true, target: '_self' },
];

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  site_name: 'EliteGlobex',
  tagline: 'Building Digital Solutions for a Smarter Future',
  site_logo_text: 'EliteGlobex',
  site_description: 'Global Technology & Digital Engineering Platform delivering enterprise cloud, AI, and scalable digital solutions.',
  contact_email: 'contact@eliteglobex.com',
  contact_phone: '+1 (800) 555-ELITE',
  hq_address: '100 Bishopsgate, Level 24, London, EC2N 4AG, United Kingdom',
  support_hours: '24/7 Global Enterprise Support',
  footer_about: 'EliteGlobex is a premier digital engineering and enterprise technology consultancy helping forward-thinking enterprises design, develop, and scale mission-critical software solutions.',
  footer_copyright: `© ${new Date().getFullYear()} EliteGlobex Inc. All rights reserved.`,
  social_linkedin: 'https://linkedin.com/company/eliteglobex',
  social_twitter: 'https://twitter.com/eliteglobex',
  social_github: 'https://github.com/eliteglobex',
  social_youtube: 'https://youtube.com',
  cta_heading: 'Ready to build something transformative?',
  cta_subheading: 'Schedule an executive discovery session with our lead architects to discuss your technical roadmap.',
  cta_btn_text: 'Schedule Architecture Review',
  cta_btn_url: '/contact',
};

/**
 * Get Site Settings dictionary
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, string> = { ...DEFAULT_SITE_SETTINGS };
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Get Homepage Hero & Section Configurations
 */
export async function getHomepageCMS() {
  try {
    let hero = await prisma.homepageContent.findUnique({
      where: { id: 'default' },
    });

    if (!hero) {
      try {
        hero = await prisma.homepageContent.create({
          data: DEFAULT_HOMEPAGE_CONTENT,
        });
      } catch {
        hero = DEFAULT_HOMEPAGE_CONTENT as any;
      }
    }

    let sections = await prisma.homepageSection.findMany({
      orderBy: { order: 'asc' },
    });

    if (!sections || sections.length === 0) {
      try {
        await prisma.homepageSection.createMany({
          data: DEFAULT_HOMEPAGE_SECTIONS,
        });
        sections = await prisma.homepageSection.findMany({
          orderBy: { order: 'asc' },
        });
      } catch {
        sections = DEFAULT_HOMEPAGE_SECTIONS as any;
      }
    }

    return { hero, sections };
  } catch (error) {
    console.error('Error fetching homepage CMS:', error);
    return {
      hero: DEFAULT_HOMEPAGE_CONTENT,
      sections: DEFAULT_HOMEPAGE_SECTIONS,
    };
  }
}

/**
 * Get Navigation Items (with hierarchical / dropdown support)
 */
export async function getNavigationCMS() {
  try {
    let navItems = await prisma.navigationItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    if (!navItems || navItems.length === 0) {
      try {
        await prisma.navigationItem.createMany({
          data: DEFAULT_NAVIGATION_ITEMS,
        });
        navItems = await prisma.navigationItem.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
        });
      } catch {
        navItems = DEFAULT_NAVIGATION_ITEMS as any;
      }
    }

    return navItems;
  } catch (error) {
    console.error('Error fetching navigation CMS:', error);
    return DEFAULT_NAVIGATION_ITEMS;
  }
}

/**
 * Get Published Services
 */
export async function getPublishedServices() {
  try {
    return await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Get Published Solutions (Products)
 */
export async function getPublishedSolutions() {
  try {
    return await prisma.solution.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return [];
  }
}

/**
 * Get Published Industries
 */
export async function getPublishedIndustries() {
  try {
    return await prisma.industry.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
}

/**
 * Get Published Case Studies / Projects
 */
export async function getPublishedProjects() {
  try {
    return await prisma.projectCaseStudy.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Get Published Testimonials
 */
export async function getPublishedTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Get Published FAQs
 */
export async function getPublishedFAQs() {
  try {
    return await prisma.fAQ.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

/**
 * Get Published Blog Posts
 */
export async function getPublishedBlogPosts(limit = 6) {
  try {
    return await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get Office Locations
 */
export async function getActiveOffices() {
  try {
    return await prisma.officeLocation.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { isHQ: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching offices:', error);
    return [];
  }
}

/**
 * Get Custom Dynamic Page by Slug
 */
export async function getCustomPage(slug: string) {
  try {
    return await prisma.customPage.findUnique({
      where: { slug },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching custom page ${slug}:`, error);
    return null;
  }
}
