import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  adminUserStatic,
  faqs,
  homepageContentData,
  homepageSections,
  industries,
  officeLocationData,
  services,
  siteSettings,
  solutions,
} from './seed-data';

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
      ...adminUserStatic,
    },
  });
  console.log('✅ Admin user created');

  // 3. Site Settings (real company info — editable via Admin → Settings)
  for (const setting of siteSettings) {
    await prisma.siteSetting.create({ data: setting });
  }
  console.log('✅ Site settings created');

  // 4. Homepage hero content (editable via Admin → Website → Homepage)
  await prisma.homepageContent.upsert({
    where: { id: 'default' },
    update: {},
    create: { ...homepageContentData },
  });
  console.log('✅ Homepage hero content created');

  // 5. Homepage sections (editable via Admin → Website → Homepage)
  // Sections without content yet (projects, testimonials, blog) start inactive —
  // the admin can enable them once entries are added via the panel.
  for (const s of homepageSections) {
    await prisma.homepageSection.create({ data: s });
  }
  console.log('✅ Homepage sections created');

  // 6. Products & Services — from the official Elite Globex brochure
  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  console.log('✅ Services created (10 real products & services)');

  // 7. Solutions — All types of bids & services we provide
  for (const sol of solutions) {
    await prisma.solution.create({ data: sol });
  }
  console.log('✅ Solutions created (8 bid & service types)');

  // 8. Industries — Our Clients
  for (const ind of industries) {
    await prisma.industry.create({ data: ind });
  }
  console.log('✅ Industries created (4 client segments)');

  // 9. FAQs — real answers about the business
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs created');

  // 10. Office location — Registered Office (editable via Admin → Offices)
  await prisma.officeLocation.create({ data: officeLocationData });
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
