import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EliteGlobex database seed (real business data)...');

  // 1. Clean existing records safely (FK-safe order)
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.pageBlock.deleteMany();
  await prisma.customPage.deleteMany();
  await prisma.redirectRule.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.homepageContent.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosition.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();
  await prisma.projectTask.deleteMany();
  await prisma.internalProject.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.service.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.projectCaseStudy.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.officeLocation.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin User (env-driven; used for /admin/login)
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@eliteglobex.com',
      passwordHash: hashedPassword,
      name: 'Ayush Pandey',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      department: 'Elite Globex',
      phone: '7355223184',
    },
  });
  console.log('✅ Admin user created');

  // 3. Site Settings (real company info — editable via Admin → Settings)
  const settings = [
    { key: 'site_name', value: 'Elite Globex', description: 'Company brand name', group: 'general' },
    { key: 'tagline', value: 'Your every problem has one solution', description: 'Hero tagline', group: 'general' },
    { key: 'motto', value: 'Everything, Everywhere, For Everyone', description: 'Brand motto', group: 'general' },
    { key: 'site_description', value: 'Elite Globex is a trusted and reliable supplier of IT products, technology solutions and government procurement services across India.', description: 'SEO / meta description', group: 'seo' },
    { key: 'contact_person', value: 'Ayush Pandey', description: 'Primary contact person', group: 'contact' },
    { key: 'contact_email', value: 'eliteglobex4794@gmail.com', description: 'Public contact email', group: 'contact' },
    { key: 'contact_phone', value: '7355223184', description: 'Main phone number', group: 'contact' },
    { key: 'hq_address', value: 'Vineet Khand 6, Gomtinagar, Lucknow – 226010 (Uttar Pradesh), India', description: 'Headquarters address', group: 'contact' },
    { key: 'support_hours', value: 'Pan India Service Support', description: 'Support availability', group: 'general' },
    { key: 'footer_about', value: 'Elite Globex is a trusted and reliable supplier of IT products, technology solutions and government procurement services. We are committed to delivering high-quality products, genuine support and complete end-to-end solutions for our clients across India.', description: 'Footer about text', group: 'footer' },
    { key: 'footer_copyright', value: `© ${new Date().getFullYear()} Elite Globex. All rights reserved.`, description: 'Footer copyright', group: 'footer' },
    { key: 'cta_heading', value: 'Get in Touch Today', description: 'Bottom CTA heading', group: 'general' },
    { key: 'cta_subheading', value: "Let's build a smarter tomorrow together!", description: 'Bottom CTA subheading', group: 'general' },
    { key: 'cta_btn_text', value: 'Contact Us', description: 'Bottom CTA button text', group: 'general' },
    { key: 'cta_btn_url', value: '/contact', description: 'Bottom CTA button URL', group: 'general' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }
  console.log('✅ Site settings created');

  // 4. Homepage hero content (editable via Admin → Website → Homepage)
  await prisma.homepageContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroEyebrow: 'IT SOLUTIONS & GOVERNMENT PROCUREMENT',
      heroTitle: 'Your Trusted Partner in',
      heroHighlight: 'IT Solutions & Government Procurement',
      heroDescription:
        'Elite Globex is a trusted and reliable supplier of IT products, technology solutions and government procurement services — delivering high-quality products, genuine support and complete end-to-end solutions for clients across India.',
      heroPrimaryBtnText: 'Explore Products & Services',
      heroPrimaryBtnUrl: '/services',
      heroSecondaryBtnText: 'Get in Touch',
      heroSecondaryBtnUrl: '/contact',
      heroTrackBtnText: 'Track Order',
      heroTrackBtnUrl: '/track-order',
      heroBadgeText: 'Pan India',
      heroIsActive: true,
    },
  });
  console.log('✅ Homepage hero content created');

  // 5. Homepage sections (editable via Admin → Website → Homepage)
  // Sections without content yet (projects, testimonials, blog) start inactive —
  // the admin can enable them once entries are added via the panel.
  const sections = [
    { sectionKey: 'hero', name: 'Hero Banner', title: 'Main Hero', subtitle: null, order: 1, isActive: true },
    { sectionKey: 'trust_strip', name: 'Trust Strip', title: 'Trusted by Government & Institutions', subtitle: 'Quality Products | Competitive Pricing | End-to-End Support', order: 2, isActive: true },
    { sectionKey: 'about', name: 'Who We Are', title: 'About Elite Globex', subtitle: 'Your Complete IT & Government Procurement Partner', order: 3, isActive: true },
    { sectionKey: 'services', name: 'Products & Services Grid', title: 'Our Products & Services', subtitle: 'A complete range of IT products and solutions', order: 4, isActive: true },
    { sectionKey: 'solutions', name: 'Bids & Services', title: 'All Types of Bids & Services We Provide', subtitle: 'From GeM to state tenders — complete support', order: 5, isActive: true },
    { sectionKey: 'industries', name: 'Our Clients', title: 'Our Clients', subtitle: 'Who we serve across India', order: 6, isActive: true },
    { sectionKey: 'why_us', name: 'Why Choose Us', title: 'Why Choose Us?', subtitle: 'Technology | Trust | Together', order: 7, isActive: true },
    { sectionKey: 'projects', name: 'Case Studies', title: 'Case Studies', subtitle: null, order: 8, isActive: false },
    { sectionKey: 'testimonials', name: 'Client Testimonials', title: 'What Our Clients Say', subtitle: null, order: 9, isActive: false },
    { sectionKey: 'blog', name: 'Latest Insights / Blog', title: 'Insights', subtitle: null, order: 10, isActive: false },
    { sectionKey: 'cta', name: 'Bottom Call to Action', title: 'Get in Touch Today', subtitle: "Let's build a smarter tomorrow together!", order: 11, isActive: true },
  ];
  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }
  console.log('✅ Homepage sections created');

  // 6. Products & Services — from the official Elite Globex brochure
  const services = [
    {
      slug: 'online-class-studio-setup',
      title: 'Online Class Studio Setup',
      category: 'Services',
      icon: 'Video',
      order: 1,
      isFeatured: true,
      shortDesc: 'Complete setup for live & recorded online classes with professional audio-video solutions.',
      fullDesc:
        'End-to-end online class studio setup for schools, colleges, coaching institutes and training centres. We design and install complete teaching studios with professional cameras, microphones, lighting, green screens and streaming software — everything you need for high-quality live and recorded online classes.',
      featuresJson: JSON.stringify([
        'Professional cameras, microphones & lighting setup',
        'Green screen / chroma studio configuration',
        'Live streaming & recording software setup',
        'Acoustic treatment guidance for classrooms',
        'On-site installation with complete testing',
      ]),
      techStackJson: JSON.stringify(['PTZ Cameras', 'Condenser Microphones', 'Studio Lighting', 'OBS / Streaming Software', 'Interactive Displays']),
      processJson: JSON.stringify([
        { step: '01', title: 'Requirement Study', desc: 'Understand your room size, audience and teaching format.' },
        { step: '02', title: 'Equipment Selection', desc: 'Genuine branded cameras, audio and lighting matched to your budget.' },
        { step: '03', title: 'Installation', desc: 'Complete on-site studio installation, wiring and calibration.' },
        { step: '04', title: 'Training & Support', desc: 'Hands-on training plus ongoing technical support.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you set up studios for schools and coaching institutes?', a: 'Yes — we set up complete online class studios for schools, colleges, coaching centres and corporate training rooms across India.' },
        { q: 'Is installation included?', a: 'Yes, on-site installation, configuration and testing are included with every studio setup.' },
      ]),
      seoTitle: 'Online Class Studio Setup Services in India | Elite Globex',
      seoDesc: 'Complete online teaching studio setup — cameras, audio, lighting and streaming solutions with installation across India.',
    },
    {
      slug: 'interactive-panel',
      title: 'Interactive Panel',
      category: 'Products',
      icon: 'Presentation',
      order: 2,
      isFeatured: true,
      shortDesc: 'Smart boards for better engagement and collaboration.',
      fullDesc:
        'Interactive flat panels / smart boards that make classrooms, boardrooms and training halls more engaging. Genuine branded panels with multi-touch, 4K display, built-in whiteboard software and wireless screen sharing — supplied with installation and support.',
      featuresJson: JSON.stringify([
        'Multi-touch 4K interactive displays',
        'Built-in digital whiteboard & annotation tools',
        'Wireless screen sharing from any device',
        'Ideal for classrooms, offices & training halls',
        'Installation and after-sales support included',
      ]),
      techStackJson: JSON.stringify(['4K UHD Display', 'Infrared Multi-Touch', 'Android / Windows', 'Wireless Casting']),
      processJson: JSON.stringify([
        { step: '01', title: 'Site Assessment', desc: 'Room size and mounting requirements evaluated.' },
        { step: '02', title: 'Panel Selection', desc: 'Right size and brand selected for your use case.' },
        { step: '03', title: 'Installation', desc: 'Wall mounting / floor stand installation with calibration.' },
        { step: '04', title: 'Handover', desc: 'Demo, training and support documentation provided.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Which sizes are available?', a: 'Interactive panels are available in multiple sizes — contact us with your room dimensions and we will recommend the right one.' },
      ]),
      seoTitle: 'Interactive Panel / Smart Board Supplier India | Elite Globex',
      seoDesc: 'Buy genuine interactive flat panels and smart boards with installation and Pan India support.',
    },
    {
      slug: 'computer',
      title: 'Computer',
      category: 'Products',
      icon: 'Monitor',
      order: 3,
      isFeatured: true,
      shortDesc: 'Desktops, laptops and workstations for every need.',
      fullDesc:
        'Desktops, laptops and high-performance workstations from genuine authorized brands — for offices, educational institutions, government departments and bulk procurement. Custom configurations available for labs, offices and specialized workloads.',
      featuresJson: JSON.stringify([
        'Desktops, laptops & workstations from genuine brands',
        'Custom configurations for labs and offices',
        'Bulk supply for institutions & government orders',
        'Licensed OS and software options',
        'Warranty with on-site support options',
      ]),
      techStackJson: JSON.stringify(['Windows', 'Leading OEM Brands', 'SSD Storage', 'Business & Gaming Series']),
      processJson: JSON.stringify([
        { step: '01', title: 'Requirement Gathering', desc: 'Usage, quantity and budget finalized.' },
        { step: '02', title: 'Quotation', desc: 'Best-price quotation with genuine brand options.' },
        { step: '03', title: 'Supply & Setup', desc: 'Delivery, OS installation and network setup.' },
        { step: '04', title: 'Support', desc: 'Warranty handling and AMC options available.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you supply computers in bulk for schools or offices?', a: 'Yes — bulk supply for computer labs, offices and institutional orders is one of our core strengths, including GeM and tender supply.' },
      ]),
      seoTitle: 'Computer, Laptop & Workstation Supplier India | Elite Globex',
      seoDesc: 'Desktops, laptops and workstations from genuine brands with bulk supply and Pan India support.',
    },
    {
      slug: 'printer-scanner',
      title: 'Printer, Scanner',
      category: 'Products',
      icon: 'Printer',
      order: 4,
      isFeatured: false,
      shortDesc: 'High-performance printing and scanning solutions.',
      fullDesc:
        'Laser and inkjet printers, multi-function devices and high-speed scanners for offices and institutions. We supply genuine machines plus original and compatible toner cartridges, with installation and maintenance support.',
      featuresJson: JSON.stringify([
        'Laser, inkjet & multi-function printers',
        'High-speed document scanners',
        'Original & compatible toner cartridges',
        'Bulk toner supply for institutions',
        'Installation and service support',
      ]),
      techStackJson: JSON.stringify(['Laser Printing', 'Duplex Scanning', 'Network Printing', 'High-Yield Toners']),
      processJson: JSON.stringify([
        { step: '01', title: 'Need Analysis', desc: 'Print volume and features mapped to the right machine.' },
        { step: '02', title: 'Quotation', desc: 'Machine + toner bundle pricing shared.' },
        { step: '03', title: 'Installation', desc: 'Network printer setup and driver configuration.' },
        { step: '04', title: 'Consumables', desc: 'Ongoing toner cartridge supply available.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you supply toner cartridges separately?', a: 'Yes — original and compatible toner cartridges for all major brands, including bulk institutional supply.' },
      ]),
      seoTitle: 'Printer & Scanner Supplier India | Elite Globex',
      seoDesc: 'High-performance printers, scanners and toner cartridges with installation and support.',
    },
    {
      slug: 'server-nas-software',
      title: 'Server, NAS, Software',
      category: 'Products',
      icon: 'Server',
      order: 5,
      isFeatured: true,
      shortDesc: 'Reliable servers, storage solutions and licensed software.',
      fullDesc:
        'Rack and tower servers, NAS storage solutions and licensed software for businesses and institutions that need reliable, secure infrastructure. Proper sizing, genuine licensing and deployment support included.',
      featuresJson: JSON.stringify([
        'Rack & tower servers sized for your workload',
        'NAS storage for backup and file sharing',
        'Genuine licensed software (OS, productivity, security)',
        'Deployment and configuration support',
        'AMC options for critical infrastructure',
      ]),
      techStackJson: JSON.stringify(['Windows Server', 'NAS Storage', 'RAID Configuration', 'Licensed Software']),
      processJson: JSON.stringify([
        { step: '01', title: 'Infrastructure Study', desc: 'Workload, users and storage needs assessed.' },
        { step: '02', title: 'Solution Design', desc: 'Right-sized server, NAS and licensing proposed.' },
        { step: '03', title: 'Deployment', desc: 'Installation, RAID setup and software licensing.' },
        { step: '04', title: 'Maintenance', desc: 'AMC and remote support options available.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you provide licensed software only?', a: 'Yes — we supply only genuine licensed software with proper billing and license documentation.' },
      ]),
      seoTitle: 'Server, NAS Storage & Licensed Software India | Elite Globex',
      seoDesc: 'Reliable servers, NAS storage and genuine licensed software with deployment support.',
    },
    {
      slug: 'toner-cartridge',
      title: 'Toner Cartridge',
      category: 'Products',
      icon: 'Droplets',
      order: 6,
      isFeatured: false,
      shortDesc: 'Original and compatible cartridges for all major brands.',
      fullDesc:
        'Original and high-quality compatible toner cartridges for all major printer brands. Ideal for offices, schools and government departments with regular bulk requirements — consistent supply with competitive pricing.',
      featuresJson: JSON.stringify([
        'Original cartridges from leading brands',
        'Quality-tested compatible cartridges',
        'All major printer models covered',
        'Bulk / rate-contract supply available',
        'Pan India delivery',
      ]),
      techStackJson: JSON.stringify(['OEM Toners', 'Compatible Toners', 'High-Yield Cartridges']),
      processJson: JSON.stringify([
        { step: '01', title: 'Model Mapping', desc: 'Share your printer models; we match the right cartridges.' },
        { step: '02', title: 'Quotation', desc: 'Unit and bulk pricing shared transparently.' },
        { step: '03', title: 'Supply', desc: 'Scheduled delivery as per your consumption.' },
        { step: '04', title: 'Repeat Orders', desc: 'Easy reordering with consistent pricing.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you offer bulk toner supply on contract?', a: 'Yes — we handle bulk and rate-contract toner supply for institutions and offices.' },
      ]),
      seoTitle: 'Toner Cartridge Supplier India | Elite Globex',
      seoDesc: 'Original and compatible toner cartridges for all major brands with bulk supply.',
    },
    {
      slug: 'general-order',
      title: 'General Order',
      category: 'Procurement',
      icon: 'Package',
      order: 7,
      isFeatured: false,
      shortDesc: 'Supply of all types of office, IT and non-IT items.',
      fullDesc:
        'One vendor for all your general procurement — office supplies, IT accessories, electrical items, furniture and non-IT goods. We handle mixed-item orders, quotations and timely delivery so your purchase department deals with a single reliable partner.',
      featuresJson: JSON.stringify([
        'All types of office, IT and non-IT items',
        'Single-vendor convenience for mixed orders',
        'Transparent quotations with GST billing',
        'Timely Pan India delivery',
        'Ideal for institutional & departmental purchase',
      ]),
      techStackJson: JSON.stringify(['Office Supplies', 'IT Accessories', 'Furniture', 'Electrical Goods']),
      processJson: JSON.stringify([
        { step: '01', title: 'Item List', desc: 'Share your requirement list in any format.' },
        { step: '02', title: 'Consolidated Quote', desc: 'Single quotation covering all items.' },
        { step: '03', title: 'Supply', desc: 'Sourced, packed and delivered together.' },
        { step: '04', title: 'Billing', desc: 'Proper GST invoice for your records.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Can you handle mixed IT and non-IT orders together?', a: 'Yes — that is exactly what our General Order service is for: one order, one vendor, one invoice.' },
      ]),
      seoTitle: 'General Order Supplier — Office, IT & Non-IT Items | Elite Globex',
      seoDesc: 'Supply of all types of office, IT and non-IT items with single-vendor convenience.',
    },
    {
      slug: 'software',
      title: 'Software',
      category: 'Products',
      icon: 'AppWindow',
      order: 8,
      isFeatured: false,
      shortDesc: 'Productivity, security, business and custom software solutions.',
      fullDesc:
        'Genuine licensed software — operating systems, productivity suites, antivirus & security, business applications and custom software solutions. Proper licensing documentation with every purchase; volume licensing for institutions available.',
      featuresJson: JSON.stringify([
        'Operating systems & productivity suites',
        'Antivirus & endpoint security solutions',
        'Business & accounting software',
        'Custom software solutions on requirement',
        'Volume licensing for institutions',
      ]),
      techStackJson: JSON.stringify(['Windows', 'Microsoft 365', 'Antivirus Suites', 'Tally / Business Apps']),
      processJson: JSON.stringify([
        { step: '01', title: 'Licensing Need', desc: 'Users, devices and software mapped.' },
        { step: '02', title: 'Best Licensing', desc: 'Most economical genuine licensing option proposed.' },
        { step: '03', title: 'Delivery', desc: 'License keys with proper documentation.' },
        { step: '04', title: 'Renewals', desc: 'Renewal reminders and re-licensing support.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Is the software genuine and licensed?', a: 'Yes — 100% genuine licensed software with proper billing and license proof. No pirated software, ever.' },
      ]),
      seoTitle: 'Licensed Software Supplier India | Elite Globex',
      seoDesc: 'Genuine licensed software — productivity, security and business applications.',
    },
    {
      slug: 'drone-camera',
      title: 'Drone Camera',
      category: 'Products',
      icon: 'Camera',
      order: 9,
      isFeatured: false,
      shortDesc: 'For surveillance, mapping, inspection and research.',
      fullDesc:
        'Camera drones for surveillance, land mapping, infrastructure inspection, agriculture and research applications. We help you select the right drone for your use case and support institutional and government procurement requirements.',
      featuresJson: JSON.stringify([
        'High-resolution aerial imaging drones',
        'For surveillance, mapping & inspection',
        'Research and agricultural applications',
        'Institutional & tender supply supported',
        'Guidance on compliant operation',
      ]),
      techStackJson: JSON.stringify(['4K Aerial Cameras', 'GPS Navigation', 'Extended Flight Time']),
      processJson: JSON.stringify([
        { step: '01', title: 'Use-Case Study', desc: 'Application and range requirements understood.' },
        { step: '02', title: 'Model Selection', desc: 'Right drone recommended for the job.' },
        { step: '03', title: 'Supply', desc: 'Genuine unit with warranty documentation.' },
        { step: '04', title: 'Support', desc: 'Basic operation guidance provided.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Can institutions buy drones through GeM/tender via you?', a: 'Yes — we support institutional and government drone procurement with proper documentation.' },
      ]),
      seoTitle: 'Drone Camera Supplier India | Elite Globex',
      seoDesc: 'Camera drones for surveillance, mapping, inspection and research applications.',
    },
    {
      slug: 'tv-ac',
      title: 'TV, AC',
      category: 'Products',
      icon: 'Tv',
      order: 10,
      isFeatured: false,
      shortDesc: 'Smart TVs and energy-efficient air conditioners.',
      fullDesc:
        'Smart TVs for classrooms, offices, lobbies and digital signage, plus energy-efficient air conditioners for institutional and commercial spaces. Genuine brands with manufacturer warranty and installation support.',
      featuresJson: JSON.stringify([
        'Smart TVs in multiple sizes for display & signage',
        'Energy-efficient split & cassette ACs',
        'Genuine brands with manufacturer warranty',
        'Bulk supply for institutions & offices',
        'Installation support available',
      ]),
      techStackJson: JSON.stringify(['4K Smart TVs', 'Digital Signage', 'Inverter ACs', 'Commercial Cooling']),
      processJson: JSON.stringify([
        { step: '01', title: 'Requirement', desc: 'Sizes, quantities and room details finalized.' },
        { step: '02', title: 'Quotation', desc: 'Brand options with best pricing shared.' },
        { step: '03', title: 'Delivery', desc: 'Safe delivery and unboxing.' },
        { step: '04', title: 'Installation', desc: 'Mounting and AC installation support arranged.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you supply TVs and ACs in bulk?', a: 'Yes — bulk supply for schools, offices and institutions with installation support.' },
      ]),
      seoTitle: 'Smart TV & AC Supplier India | Elite Globex',
      seoDesc: 'Smart TVs and energy-efficient air conditioners with bulk supply and installation.',
    },
  ];
  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  console.log('✅ Services created (10 real products & services)');

  // 7. Solutions — All types of bids & services we provide
  const solutions = [
    {
      slug: 'gem-marketplace',
      name: 'Government e-Marketplace (GeM)',
      tagline: 'Complete GeM procurement assistance',
      category: 'Procurement',
      shortDesc: 'End-to-end support for buying and selling on the Government e-Marketplace.',
      fullDesc:
        'Complete assistance for Government e-Marketplace (GeM) transactions — product listing, bid participation, order fulfillment and documentation. We help institutions procure the right products and help the process run smoothly with complete support.',
      featuresJson: JSON.stringify([
        'GeM bid participation & documentation',
        'Product supply against GeM orders',
        'Complete procurement assistance',
        'Timely delivery with proper invoicing',
      ]),
      techStackJson: JSON.stringify(['GeM Portal', 'IT Products', 'Office Supplies']),
      benefitsJson: JSON.stringify(['Single experienced vendor', 'Genuine products with warranty', 'Pan India delivery', 'Complete documentation support']),
      pricingModel: 'Custom Quote',
      isFeatured: true,
      seoTitle: 'GeM Procurement Support | Elite Globex',
      seoDesc: 'Complete Government e-Marketplace (GeM) procurement assistance and product supply.',
    },
    {
      slug: 'government-tenders',
      name: 'State & Central Government Tenders',
      tagline: 'Tender supply with complete documentation',
      category: 'Procurement',
      shortDesc: 'Product supply and support for state and central government tenders.',
      fullDesc:
        'We participate in and fulfill state and central government tenders for IT and non-IT products — with genuine products, competitive pricing, proper documentation and on-time delivery as per tender terms.',
      featuresJson: JSON.stringify([
        'Tender documentation & compliance',
        'Genuine branded product supply',
        'Competitive bid pricing',
        'Delivery as per tender schedules',
      ]),
      techStackJson: JSON.stringify(['Tender Portals', 'IT Hardware', 'Documentation']),
      pricingModel: 'Custom Quote',
      isFeatured: true,
      seoTitle: 'Government Tender Supply | Elite Globex',
      seoDesc: 'State & central government tender supply for IT and non-IT products.',
    },
    {
      slug: 'institutional-orders',
      name: 'Institutional & Departmental Orders',
      tagline: 'Reliable supply for institutions',
      category: 'Procurement',
      shortDesc: 'Dedicated supply for schools, colleges, departments and PSUs.',
      fullDesc:
        'Schools, colleges, universities, government departments and PSUs rely on us for computers, printers, studio setups, furniture and general orders — with quotations, GST billing and dependable delivery.',
      featuresJson: JSON.stringify([
        'Quotation & rate finalization support',
        'Bulk supply with staged delivery',
        'GST-compliant billing',
        'Dedicated account coordination',
      ]),
      techStackJson: JSON.stringify(['IT Products', 'Furniture', 'Lab Equipment']),
      pricingModel: 'Custom Quote',
      isFeatured: false,
      seoTitle: 'Institutional Order Supply | Elite Globex',
      seoDesc: 'Product supply for educational institutions, departments and PSUs.',
    },
    {
      slug: 'rate-contracts',
      name: 'Rate Contracts / Framework Agreements',
      tagline: 'Long-term pricing, on-demand supply',
      category: 'Procurement',
      shortDesc: 'Fixed-rate supply agreements for recurring requirements.',
      fullDesc:
        'Rate contracts and framework agreements that lock in pricing for your recurring product needs — toner cartridges, computers, stationery and more. Order on demand at pre-agreed rates without repeated tendering.',
      featuresJson: JSON.stringify([
        'Pre-agreed fixed pricing',
        'On-demand ordering against contract',
        'Covers IT & non-IT consumables',
        'Simplified repeat procurement',
      ]),
      techStackJson: JSON.stringify(['Consumables', 'IT Hardware', 'Office Supplies']),
      pricingModel: 'Custom Quote',
      isFeatured: false,
      seoTitle: 'Rate Contract Supply | Elite Globex',
      seoDesc: 'Rate contracts and framework agreements for recurring product supply.',
    },
    {
      slug: 'custom-quotations',
      name: 'Custom Quotations',
      tagline: 'Transparent pricing for any requirement',
      category: 'Services',
      shortDesc: 'Detailed quotations tailored to your exact requirement list.',
      fullDesc:
        'Send us your requirement — a product list, a tender BOQ or just an idea — and receive a detailed, transparent quotation with genuine brand options and clear timelines.',
      featuresJson: JSON.stringify([
        'Line-item detailed quotations',
        'Multiple brand options where relevant',
        'GST-inclusive transparent pricing',
        'Quick turnaround on quotes',
      ]),
      techStackJson: JSON.stringify(['All Product Categories']),
      pricingModel: 'Custom Quote',
      isFeatured: false,
      seoTitle: 'Custom Product Quotations | Elite Globex',
      seoDesc: 'Transparent custom quotations for IT and non-IT product requirements.',
    },
    {
      slug: 'installation-maintenance',
      name: 'Installation & Maintenance',
      tagline: 'Professional setup, done right',
      category: 'Services',
      shortDesc: 'On-site installation and setup for everything we supply.',
      fullDesc:
        'Professional installation for interactive panels, studio setups, servers, networks, printers and ACs — with proper testing, calibration and handover documentation.',
      featuresJson: JSON.stringify([
        'On-site professional installation',
        'Configuration, calibration & testing',
        'Cable management & clean setup',
        'Handover with demo & documentation',
      ]),
      techStackJson: JSON.stringify(['AV Systems', 'Networking', 'Display Mounting']),
      pricingModel: 'Custom Quote',
      isFeatured: false,
      seoTitle: 'Installation & Maintenance Services | Elite Globex',
      seoDesc: 'Professional on-site installation and maintenance for IT products.',
    },
    {
      slug: 'amc-support',
      name: 'AMC / Support Services',
      tagline: 'Keep everything running smoothly',
      category: 'Services',
      shortDesc: 'Annual maintenance contracts and dependable support.',
      fullDesc:
        'Annual Maintenance Contracts (AMC) and support services for your IT infrastructure — computers, printers, networks and AV systems. Preventive maintenance, breakdown support and a single point of contact.',
      featuresJson: JSON.stringify([
        'Comprehensive & non-comprehensive AMC',
        'Preventive maintenance visits',
        'Breakdown support with SLAs',
        'Single point of contact',
      ]),
      techStackJson: JSON.stringify(['IT Infrastructure', 'Printers', 'Networks', 'AV Systems']),
      pricingModel: 'Custom Quote',
      isFeatured: false,
      seoTitle: 'AMC & IT Support Services | Elite Globex',
      seoDesc: 'Annual maintenance contracts and support services for IT infrastructure.',
    },
    {
      slug: 'bulk-supply',
      name: 'Bulk Supply & Long-Term Contracts',
      tagline: 'Scale supply with your growth',
      category: 'Procurement',
      shortDesc: 'High-volume supply with staged delivery and contract pricing.',
      fullDesc:
        'Bulk supply programs for large rollouts — computer labs, office setups, multi-location deployments. Staged delivery schedules, dedicated coordination and long-term contract pricing.',
      featuresJson: JSON.stringify([
        'High-volume & multi-location supply',
        'Staged delivery scheduling',
        'Dedicated project coordination',
        'Long-term contract pricing',
      ]),
      techStackJson: JSON.stringify(['Bulk IT Hardware', 'Furniture', 'Project Rollouts']),
      pricingModel: 'Custom Quote',
      isFeatured: true,
      seoTitle: 'Bulk Supply & Long-Term Contracts | Elite Globex',
      seoDesc: 'Bulk product supply with staged delivery and long-term contract pricing.',
    },
  ];
  for (const sol of solutions) {
    await prisma.solution.create({ data: sol });
  }
  console.log('✅ Solutions created (8 bid & service types)');

  // 8. Industries — Our Clients
  const industries = [
    {
      slug: 'government-departments',
      name: 'Government Departments',
      icon: 'Landmark',
      summary: 'Trusted supplier for state & central government departments.',
      fullDesc:
        'We serve state and central government departments with IT products, office supplies and general orders — through GeM, tenders and direct orders — with complete documentation and dependable delivery.',
      challengesJson: JSON.stringify(['Strict procurement compliance', 'Tight delivery schedules', 'Genuine product requirements']),
      solutionsJson: JSON.stringify(['GeM & tender fulfillment', 'Complete documentation support', 'Pan India delivery network']),
      isFeatured: true,
      seoTitle: 'Government Department Supplier | Elite Globex',
      seoDesc: 'IT and general product supply for government departments via GeM and tenders.',
    },
    {
      slug: 'educational-institutions',
      name: 'Educational Institutions',
      icon: 'GraduationCap',
      summary: 'Complete technology partner for schools, colleges & universities.',
      fullDesc:
        'Schools, colleges, coaching institutes and universities rely on Elite Globex for computer labs, online class studios, interactive panels, printers and bulk supplies — with installation and support.',
      challengesJson: JSON.stringify(['Budget-conscious bulk buying', 'Need for installation & training', 'Long-term maintenance']),
      solutionsJson: JSON.stringify(['Bulk lab & classroom supply', 'Studio & smart-class installation', 'AMC and support options']),
      isFeatured: true,
      seoTitle: 'Education Technology Supplier | Elite Globex',
      seoDesc: 'IT products, smart classes and studio setups for educational institutions.',
    },
    {
      slug: 'corporate-houses',
      name: 'Corporate Houses',
      icon: 'Building2',
      summary: 'IT infrastructure & office supply for growing businesses.',
      fullDesc:
        'Corporate offices and growing businesses get computers, servers, software licensing, AV systems and office supplies from a single vendor — with quotations, GST billing and professional installation.',
      challengesJson: JSON.stringify(['Multi-location requirements', 'Standardized IT procurement', 'Minimal downtime']),
      solutionsJson: JSON.stringify(['Standardized hardware supply', 'Licensed software & servers', 'AMC-backed support']),
      isFeatured: false,
      seoTitle: 'Corporate IT Supplier | Elite Globex',
      seoDesc: 'IT infrastructure and office product supply for corporate houses.',
    },
    {
      slug: 'psu-organizations',
      name: 'PSUs & Organizations',
      icon: 'Users',
      summary: 'Dependable procurement partner for PSUs and large organizations.',
      fullDesc:
        'Public sector undertakings and large organizations trust Elite Globex for tender-based supply, rate contracts and bulk orders — delivered with proper documentation and accountability.',
      challengesJson: JSON.stringify(['Tender compliance', 'Large-volume logistics', 'Audit-ready documentation']),
      solutionsJson: JSON.stringify(['Tender & rate-contract execution', 'Staged bulk delivery', 'Complete audit documentation']),
      isFeatured: false,
      seoTitle: 'PSU & Organization Supplier | Elite Globex',
      seoDesc: 'Procurement partner for PSUs and large organizations.',
    },
  ];
  for (const ind of industries) {
    await prisma.industry.create({ data: ind });
  }
  console.log('✅ Industries created (4 client segments)');

  // 9. FAQs — real answers about the business
  const faqs = [
    {
      question: 'What products and services does Elite Globex deal in?',
      answer:
        'We deal in online class studio setups, interactive panels, computers, printers & scanners, servers, NAS & software, toner cartridges, drone cameras, TVs & ACs — plus general orders covering all types of office, IT and non-IT items.',
      category: 'General',
      order: 1,
      isPopular: true,
    },
    {
      question: 'Do you help with GeM orders and government tenders?',
      answer:
        'Yes. We specialize in all government orders & bids — from Government e-Marketplace (GeM) to state and central tenders. We provide complete procurement assistance with genuine products, proper documentation and on-time delivery.',
      category: 'Services',
      order: 2,
      isPopular: true,
    },
    {
      question: 'Do you provide installation and after-sales support?',
      answer:
        'Yes. Installation is included with studio setups, interactive panels, servers and other installed products. We also offer AMC and ongoing support services across India.',
      category: 'Services',
      order: 3,
      isPopular: true,
    },
    {
      question: 'Which areas do you serve?',
      answer:
        'We operate with a Pan India service network — supplying and supporting clients across the country.',
      category: 'General',
      order: 4,
      isPopular: false,
    },
    {
      question: 'How can I get a quotation for my requirement?',
      answer:
        'Call us on 7355223184 or use the contact form with your requirement list. We will share a detailed, transparent quotation with genuine brand options and GST billing.',
      category: 'Pricing',
      order: 5,
      isPopular: true,
    },
    {
      question: 'Are your products genuine and branded?',
      answer:
        'Yes. We supply authorized, genuine brands with manufacturer warranty wherever applicable — plus quality-tested compatible options (like toner cartridges) where they make sense.',
      category: 'General',
      order: 6,
      isPopular: false,
    },
  ];
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs created');

  // 10. Office location — Registered Office (editable via Admin → Offices)
  await prisma.officeLocation.create({
    data: {
      name: 'Registered Office',
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      address: 'Vineet Khand 6, Gomtinagar, Lucknow – 226010 (Uttar Pradesh), India',
      postalCode: '226010',
      phone: '7355223184',
      email: 'eliteglobex4794@gmail.com',
      workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM (IST)',
      isHQ: true,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Office location created');

  // 11. Left empty on purpose — add real entries anytime via /admin:
  // Testimonials, Case Studies, Blog Posts, Job Openings, Office Locations,
  // Employees, Orders, Invoices, Leads, Internal Projects.
  // (No fake demo data — everything the admin adds will be real.)
  console.log('ℹ️  Skipped demo operational data — add real entries via /admin');

  console.log('🎉 EliteGlobex database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
