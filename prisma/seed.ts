import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EliteGlobex database seed...');

  // 1. Clean existing records safely
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

  // 2. Create Admin Users
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@eliteglobex.com',
      passwordHash: hashedPassword,
      name: 'Alexander Wright',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      department: 'Executive Leadership',
      phone: '+1 (555) 019-2834',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'sarah.chen@eliteglobex.com',
      passwordHash: hashedPassword,
      name: 'Sarah Chen',
      role: 'MANAGER',
      status: 'ACTIVE',
      department: 'Engineering & Delivery',
      phone: '+1 (555) 019-5821',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('✅ Admin users created');

  // 3. Create Site Settings
  const settings = [
    { key: 'site_name', value: 'EliteGlobex', description: 'Company brand name', group: 'general' },
    { key: 'tagline', value: 'Building Digital Solutions for a Smarter Future', description: 'Hero tagline', group: 'general' },
    { key: 'contact_email', value: 'contact@eliteglobex.com', description: 'Public contact email', group: 'contact' },
    { key: 'contact_phone', value: '+1 (800) 555-ELITE', description: 'Main phone number', group: 'contact' },
    { key: 'hq_address', value: '100 Bishopsgate, Level 24, London, EC2N 4AG, United Kingdom', description: 'Global Headquarters', group: 'contact' },
    { key: 'support_hours', value: '24/7 Global Enterprise Support', description: 'Support availability', group: 'general' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }

  // 4. Create Services
  const services = [
    {
      slug: 'cloud-architecture-devops',
      title: 'Cloud Architecture & DevOps',
      category: 'Cloud',
      icon: 'Cloud',
      order: 1,
      isFeatured: true,
      shortDesc: 'Resilient multi-cloud infrastructure, automated CI/CD pipelines, Kubernetes orchestration, and cost optimization.',
      fullDesc: 'We architect highly scalable, zero-downtime multi-cloud environments tailored for high-growth enterprises. From containerization with Docker and Kubernetes to infrastructure as code with Terraform, our DevOps engineers streamline release velocity while enforcing rigorous SOC2 and ISO27001 security standards.',
      featuresJson: JSON.stringify([
        'Zero-downtime Kubernetes cluster deployments',
        'Automated CI/CD pipelines with GitHub Actions & ArgoCD',
        'Infrastructure as Code (Terraform, Pulumi)',
        'FinOps & Multi-cloud cost optimization (AWS, Azure, GCP)',
        '24/7 Site Reliability Engineering (SRE) & Observability',
      ]),
      techStackJson: JSON.stringify(['AWS', 'Google Cloud', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Grafana']),
      processJson: JSON.stringify([
        { step: '01', title: 'Architecture Audit', desc: 'Deep dive analysis of current compute, networking, and latency bottlenecks.' },
        { step: '02', title: 'IaC Blueprinting', desc: 'Modular infrastructure as code definitions with isolated staging and production VPCs.' },
        { step: '03', title: 'Pipeline Automation', desc: 'Secure automated testing, artifact caching, and rolling zero-downtime deployments.' },
        { step: '04', title: 'Telemetry & SRE', desc: 'Real-time APM telemetry, automated anomaly alerts, and continuous optimization.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Which cloud providers do you specialize in?', a: 'We are certified across AWS, Google Cloud Platform (GCP), and Microsoft Azure, offering single and multi-cloud architectures.' },
        { q: 'Can you migrate legacy on-prem workloads?', a: 'Yes, we execute phased cloud migrations with automated data replication and rollback guarantees.' },
      ]),
      seoTitle: 'Enterprise Cloud Architecture & DevOps Solutions | EliteGlobex',
      seoDesc: 'Accelerate digital scale with resilient cloud engineering, Kubernetes orchestration, and automated CI/CD pipelines.',
    },
    {
      slug: 'ai-machine-learning',
      title: 'AI & Machine Learning Solutions',
      category: 'AI & Data',
      icon: 'Cpu',
      order: 2,
      isFeatured: true,
      shortDesc: 'Custom LLM fine-tuning, predictive analytics, computer vision, and autonomous agent orchestration.',
      fullDesc: 'Empower enterprise operations with intelligent artificial intelligence pipelines. We develop bespoke predictive algorithms, fine-tune domain-specific LLMs with retrieval-augmented generation (RAG), and embed high-speed inference microservices into your core business applications.',
      featuresJson: JSON.stringify([
        'Domain-specific Large Language Model fine-tuning & RAG',
        'Predictive forecasting & fraud detection models',
        'Real-time Computer Vision & OCR pipelines',
        'Autonomous AI agent workflows for customer support & analytics',
        'MLOps model monitoring, drift detection, and retraining',
      ]),
      techStackJson: JSON.stringify(['PyTorch', 'TensorFlow', 'LangChain', 'OpenAI', 'Pinecone', 'FastAPI', 'Hugging Face', 'MLflow']),
      processJson: JSON.stringify([
        { step: '01', title: 'Data Readiness Evaluation', desc: 'Data cleaning, vectorization feasibility, and governance assessment.' },
        { step: '02', title: 'Model Prototyping', desc: 'Benchmarking state-of-the-art architectures against domain baselines.' },
        { step: '03', title: 'RAG & Agent Pipeline', desc: 'Integrating vector embeddings, semantic retrieval, and guardrails.' },
        { step: '04', title: 'MLOps Deployment', desc: 'High-throughput low-latency inference endpoints with drift telemetry.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'How do you protect proprietary training data?', a: 'All models are deployed within your isolated private VPC or dedicated tenant with zero third-party data leakage.' },
      ]),
      seoTitle: 'Enterprise AI & Machine Learning Engineering | EliteGlobex',
      seoDesc: 'Harness bespoke generative AI, RAG pipelines, and predictive intelligence engineered for mission-critical operations.',
    },
    {
      slug: 'full-stack-web-engineering',
      title: 'Custom Web & Enterprise Software',
      category: 'Engineering',
      icon: 'Code',
      order: 3,
      isFeatured: true,
      shortDesc: 'Scalable Next.js, Node.js, and microservices architectures with blazing performance and modular design systems.',
      fullDesc: 'We construct high-velocity web platforms and mission-critical enterprise portals. Leveraging Next.js App Router, TypeScript, GraphQL/REST APIs, and distributed microservices, we build platforms that handle millions of requests with sub-100ms render speeds.',
      featuresJson: JSON.stringify([
        'Next.js 14+ Server-Side Rendering & Edge caching',
        'TypeScript enterprise codebase architecture',
        'Complex state management and real-time WebSockets',
        'Component design systems with Tailwind & Storybook',
        'Robust automated unit, integration, and E2E testing',
      ]),
      techStackJson: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Redis']),
      processJson: JSON.stringify([
        { step: '01', title: 'System Specs & Architecture', desc: 'Domain-driven design, data modeling, and API contract specifications.' },
        { step: '02', title: 'Interactive UI Prototypes', desc: 'High-fidelity Figma component design systems and user journey flows.' },
        { step: '03', title: 'Iterative Sprint Delivery', desc: 'Bi-weekly sprint releases with continuous preview deployments.' },
        { step: '04', title: 'Global Edge Deployment', desc: 'CDN edge acceleration, audit logging, and enterprise security hardening.' },
      ]),
      faqsJson: JSON.stringify([
        { q: 'Do you provide maintenance and feature roadmaps?', a: 'Yes, we offer SLA-backed ongoing development, security patching, and scaling support.' },
      ]),
      seoTitle: 'Custom Enterprise Web & Software Development | EliteGlobex',
      seoDesc: 'Deliver performant, high-scale web platforms engineered with Next.js, TypeScript, and modern microservices.',
    },
    {
      slug: 'mobile-app-development',
      title: 'Mobile App Engineering (iOS & Android)',
      category: 'Engineering',
      icon: 'Smartphone',
      order: 4,
      isFeatured: true,
      shortDesc: 'High-performance native and cross-platform mobile apps with seamless offline synchronization and biometrics.',
      fullDesc: 'From consumer apps with delightful micro-interactions to secure enterprise field tools, our mobile team delivers iOS and Android solutions with React Native and native Swift/Kotlin.',
      featuresJson: JSON.stringify([
        'Cross-platform React Native & Flutter solutions',
        'Biometric authentication (FaceID, Fingerprint)',
        'Offline-first architecture with SQLite & sync engines',
        'Push notification pipelines and deep-linking',
        'App Store and Google Play enterprise compliance',
      ]),
      techStackJson: JSON.stringify(['React Native', 'Swift', 'Kotlin', 'Flutter', 'Firebase', 'GraphQL', 'SQLite']),
      processJson: JSON.stringify([
        { step: '01', title: 'Mobile UX/UI Design', desc: 'Native touch gestures, accessible typography, and intuitive navigation.' },
        { step: '02', title: 'Native Bridge Architecture', desc: 'High-speed hardware integrations including camera, Bluetooth, and GPS.' },
        { step: '03', title: 'Cross-Device QA', desc: 'Automated testing across 50+ real physical device configurations.' },
        { step: '04', title: 'Store Launch', desc: 'Expedited App Store and Google Play submission and analytics setup.' },
      ]),
      seoTitle: 'Mobile App Development Services | EliteGlobex',
      seoDesc: 'Transform your mobile strategy with native-grade iOS & Android applications built for enterprise scale.',
    },
    {
      slug: 'digital-transformation-automation',
      title: 'Digital Transformation & Automation',
      category: 'Strategy',
      icon: 'Workflow',
      order: 5,
      isFeatured: false,
      shortDesc: 'Modernize legacy systems, automate complex manual workflows, and interconnect ERP/CRM ecosystems.',
      fullDesc: 'Eliminate operational bottlenecks by bridging legacy silos with automated, event-driven integrations. We connect disparate ERPs, CRMs, inventory managers, and customer channels into unified digital hubs.',
      featuresJson: JSON.stringify([
        'Legacy monolithic system modernization & strangler pattern',
        'Event-driven workflow automation (Kafka, RabbitMQ, Webhooks)',
        'CRM/ERP integration pipelines (Salesforce, SAP, NetSuite)',
        'Robotic Process Automation (RPA) & document ingestion',
      ]),
      techStackJson: JSON.stringify(['Apache Kafka', 'Zapier Enterprise', 'Temporal.io', 'Node.js', 'PostgreSQL', 'Docker']),
      processJson: JSON.stringify([
        { step: '01', title: 'Value Stream Mapping', desc: 'Mapping manual delays, cost drains, and fragmented data handoffs.' },
        { step: '02', title: 'Unified Integration Hub', desc: 'Event-driven middleware and secure webhook connectors.' },
        { step: '03', title: 'Automated Orchestration', desc: 'Automating multi-step approvals, data syncs, and notifications.' },
        { step: '04', title: 'Impact Dashboarding', desc: 'Real-time tracking of hours saved and workflow execution speeds.' },
      ]),
      seoTitle: 'Enterprise Digital Transformation & Automation | EliteGlobex',
      seoDesc: 'Modernize legacy workflows with event-driven automation, ERP sync, and process re-engineering.',
    },
    {
      slug: 'ui-ux-product-design',
      title: 'UI/UX & Product Design',
      category: 'Design',
      icon: 'Palette',
      order: 6,
      isFeatured: false,
      shortDesc: 'Human-centered user research, high-conversion design systems, interactive prototypes, and usability testing.',
      fullDesc: 'Great software starts with deeply understood user journeys. Our product designers combine behavioral research with sleek, modern design systems to create digital experiences that delight users and drive conversion.',
      featuresJson: JSON.stringify([
        'End-to-end design systems with complete token libraries',
        'Interactive Figma prototypes with realistic motion',
        'Qualitative user research & cognitive walkthroughs',
        'Design-to-code automated handoff specs for engineering',
      ]),
      techStackJson: JSON.stringify(['Figma', 'Storybook', 'Framer', 'Tailwind CSS', 'Zeroheight', 'Adobe XD']),
      processJson: JSON.stringify([
        { step: '01', title: 'Discovery & Personas', desc: 'Stakeholder interviews, customer journey mapping, and pain point mapping.' },
        { step: '02', title: 'Wireframes & Architecture', desc: 'Information architecture, low-fi wireframing, and workflow validation.' },
        { step: '03', title: 'Design System Creation', desc: 'Accessible color palettes, typography scales, and modular components.' },
        { step: '04', title: 'High-Fidelity Delivery', desc: 'Pixel-perfect production assets, interaction guides, and token sync.' },
      ]),
      seoTitle: 'Enterprise UI/UX & Digital Product Design | EliteGlobex',
      seoDesc: 'Elevate brand authority with human-centered UI/UX design systems engineered for conversion.',
    },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  console.log('✅ Services created');

  // 5. Create Solutions
  const solutions = [
    {
      slug: 'omnicloud-erp',
      name: 'OmniCloud Enterprise ERP',
      tagline: 'Unified Operations, Financials, and Supply Chain Intelligence',
      category: 'Enterprise',
      shortDesc: 'A modular, cloud-native ERP consolidating inventory, procurement, invoices, and workforce management into a single real-time cockpit.',
      fullDesc: 'OmniCloud ERP is designed for mid-market and enterprise organizations seeking agility without the bloat of traditional legacy suites. Features real-time ledger accounting, multi-warehouse inventory tracking, automated vendor purchase orders, and multi-currency billing.',
      featuresJson: JSON.stringify([
        'Multi-entity & multi-currency financial consolidation',
        'Real-time inventory and multi-warehouse tracking',
        'Automated procurement with vendor scorecards',
        'Role-based granular access control and audit trail',
        'Customizable executive KPI dashboards',
      ]),
      techStackJson: JSON.stringify(['Next.js', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'AWS']),
      benefitsJson: JSON.stringify([
        'Reduce month-end closing time by up to 65%',
        'Eliminate stockout risks with automated reorder thresholds',
        'Complete SOC2 Type II compliance readiness',
      ]),
      pricingModel: 'Tiered Enterprise License',
      isFeatured: true,
      seoTitle: 'OmniCloud ERP - Enterprise Resource Planning System | EliteGlobex',
      seoDesc: 'Unify inventory, finance, and operations with OmniCloud ERP by EliteGlobex.',
    },
    {
      slug: 'cogniflow-ai',
      name: 'CogniFlow AI Intelligence Suite',
      tagline: 'Generative AI & Semantic Knowledge Engine for Enterprises',
      category: 'AI & Data',
      shortDesc: 'Connect enterprise data lakes to domain-specific AI agents for instant document analysis, customer support, and predictive insights.',
      fullDesc: 'CogniFlow AI indexes millions of internal documents, customer tickets, and knowledge bases into high-speed vector embeddings, enabling employees and customers to query complex data with natural language in milliseconds.',
      featuresJson: JSON.stringify([
        'Hybrid Semantic & Keyword Vector Search',
        'Automated document summarization and contract clause analysis',
        'Omnichannel customer concierge agents (Web, Slack, WhatsApp)',
        'Zero data training leakage with private VPC deployments',
      ]),
      techStackJson: JSON.stringify(['Python', 'LangChain', 'FastAPI', 'Pinecone', 'OpenAI', 'React']),
      benefitsJson: JSON.stringify([
        'Accelerate internal research time by 4x',
        'Resolve 70% of tier-1 customer inquiries autonomously',
      ]),
      pricingModel: 'Usage-Based + Enterprise Core',
      isFeatured: true,
      seoTitle: 'CogniFlow AI - Enterprise Knowledge & Agent Platform | EliteGlobex',
      seoDesc: 'Unlock your enterprise knowledge with CogniFlow AI by EliteGlobex.',
    },
    {
      slug: 'secureshield-iam',
      name: 'SecureShield Zero-Trust IAM',
      tagline: 'Identity, Access Management & Threat Governance',
      category: 'Cybersecurity',
      shortDesc: 'Continuous identity verification, adaptive multi-factor authentication, and automated compliance auditing for distributed teams.',
      fullDesc: 'SecureShield IAM provides unified single sign-on (SSO), context-aware conditional access policies, and automated role provisioning across all corporate cloud assets.',
      featuresJson: JSON.stringify([
        'SAML 2.0 & OpenID Connect enterprise SSO integration',
        'Adaptive MFA based on geolocation and device posture',
        'Automated SCIM user provisioning and deprovisioning',
        'Real-time anomaly detection and compromised credential alerting',
      ]),
      techStackJson: JSON.stringify(['OAuth 2.0', 'OIDC', 'Node.js', 'Redis', 'PostgreSQL', 'HashiCorp Vault']),
      benefitsJson: JSON.stringify([
        'Prevent 99.9% of credential-stuffing account takeovers',
        'Instant one-click employee offboarding across 50+ SaaS tools',
      ]),
      pricingModel: 'Per Seat / Monthly',
      isFeatured: true,
      seoTitle: 'SecureShield IAM - Zero-Trust Identity Management | EliteGlobex',
      seoDesc: 'Protect enterprise assets with SecureShield Zero-Trust Identity Management by EliteGlobex.',
    },
  ];

  for (const sol of solutions) {
    await prisma.solution.create({ data: sol });
  }
  console.log('✅ Solutions created');

  // 6. Create Industries
  const industries = [
    {
      slug: 'fintech-banking',
      name: 'FinTech & Banking',
      icon: 'DollarSign',
      summary: 'High-frequency transaction engines, PCI-DSS compliant gateways, and automated fraud prevention.',
      fullDesc: 'Financial institutions require sub-millisecond execution speeds, absolute reliability, and ironclad regulatory compliance. We design ledger systems, payment routers, and algorithmic risk engines built for financial scale.',
      challengesJson: JSON.stringify([
        'Legacy core banking bottlenecks and high maintenance overhead',
        'Stringent compliance mandates (PCI-DSS, PSD2, KYC/AML)',
        'Escalating fraud attacks in real-time transactions',
      ]),
      solutionsJson: JSON.stringify([
        'Event-sourced micro-ledgers with immutable audit trails',
        'AI-driven real-time fraud scoring under 25ms',
        'Open Banking API integration layers',
      ]),
      isFeatured: true,
      seoTitle: 'FinTech & Banking Digital Engineering | EliteGlobex',
      seoDesc: 'Scalable financial software architecture, PCI-DSS compliance, and modern banking platforms.',
    },
    {
      slug: 'healthcare-life-sciences',
      name: 'Healthcare & Life Sciences',
      icon: 'Activity',
      summary: 'HIPAA-compliant telemedicine, electronic health record (EHR) integrations, and clinical data pipelines.',
      fullDesc: 'We construct secure, interoperable health technology ecosystems that streamline clinical workflows and improve patient outcomes while rigorously adhering to HIPAA, GDPR, and FHIR standards.',
      challengesJson: JSON.stringify([
        'Fragmented patient records across legacy EHR systems',
        'Strict health privacy regulations and encryption requirements',
        'High latency in clinical diagnostic data transmission',
      ]),
      solutionsJson: JSON.stringify([
        'FHIR/HL7 compliant data interoperability microservices',
        'Zero-knowledge encrypted telemedicine video & messaging',
        'Automated appointment scheduling & patient portal suites',
      ]),
      isFeatured: true,
      seoTitle: 'Healthcare & Life Sciences Software Solutions | EliteGlobex',
      seoDesc: 'HIPAA-compliant health tech platforms, EHR integrations, and patient portals.',
    },
    {
      slug: 'supply-chain-logistics',
      name: 'Logistics & Supply Chain',
      icon: 'Truck',
      summary: 'Real-time fleet telemetry, multi-warehouse routing optimization, and automated customs tracking.',
      fullDesc: 'Modern logistics demands complete end-to-end visibility. We build dispatch engines, GPS tracking portals, and predictive replenishment tools that keep supply chains resilient against global disruptions.',
      challengesJson: JSON.stringify([
        'Blind spots in cross-border cargo transit',
        'Inefficient route dispatching leading to inflated fuel costs',
        'Manual bill-of-lading and customs document processing',
      ]),
      solutionsJson: JSON.stringify([
        'IoT GPS container tracking with temperature & shock sensors',
        'Dynamic route optimization algorithms reducing miles driven',
        'Automated OCR document ingestion for shipping manifests',
      ]),
      isFeatured: true,
      seoTitle: 'Logistics & Supply Chain Technology Solutions | EliteGlobex',
      seoDesc: 'Smart fleet telemetry, warehouse automation, and predictive route optimization.',
    },
    {
      slug: 'education-edtech',
      name: 'Education & EdTech',
      icon: 'GraduationCap',
      summary: 'Interactive learning management platforms, virtual classrooms, and adaptive student assessment engines.',
      fullDesc: 'We empower universities, institutions, and training providers with scalable LMS platforms, live interactive video classrooms, and AI-driven personalized learning paths.',
      challengesJson: JSON.stringify([
        'Student disengagement in passive asynchronous courses',
        'Scaling video streaming during high-concurrency exams',
        'Lack of granular learner progress analytics',
      ]),
      solutionsJson: JSON.stringify([
        'Gamified learning management systems with real-time badges',
        'Low-latency WebRTC interactive virtual classrooms',
        'Adaptive assessment algorithms that adjust question difficulty',
      ]),
      isFeatured: false,
      seoTitle: 'EdTech & Digital Learning Platforms | EliteGlobex',
      seoDesc: 'Interactive learning management systems and virtual classroom platforms.',
    },
  ];

  for (const ind of industries) {
    await prisma.industry.create({ data: ind });
  }
  console.log('✅ Industries created');

  // 7. Create Project Case Studies (clearly marked as sample data)
  const caseStudies = [
    {
      slug: 'fintech-core-modernization',
      title: 'Global Payment Gateway Modernization',
      clientName: 'International FinTech Enterprise (Sample Client)',
      industry: 'FinTech & Banking',
      shortDesc: 'Re-architecting a legacy payment infrastructure to support 15,000+ transactions per second with 99.999% uptime.',
      challenge: 'The client faced high transaction failure rates during peak shopping seasons due to monolithic database locking and legacy on-premise infrastructure.',
      solution: 'EliteGlobex deployed an event-driven microservices architecture on AWS with Kubernetes, Redis distributed caching, and Kafka event streams.',
      resultsJson: JSON.stringify([
        'Achieved sub-45ms global payment settlement latency',
        'Scaled to 25,000 peak TPS with zero dropped transactions',
        'Reduced cloud hosting overhead by 38% via automated pod scaling',
      ]),
      techStackJson: JSON.stringify(['AWS', 'Kubernetes', 'Go', 'Kafka', 'PostgreSQL', 'Redis', 'Terraform']),
      metricsJson: JSON.stringify([
        { metric: '99.999%', label: 'Platform Availability' },
        { metric: '45ms', label: 'Avg Latency' },
        { metric: '38%', label: 'Infrastructure Savings' },
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isSampleData: true,
    },
    {
      slug: 'telehealth-realtime-platform',
      title: 'HIPAA-Compliant Remote Healthcare Suite',
      clientName: 'Leading Health Network (Sample Client)',
      industry: 'Healthcare & Life Sciences',
      shortDesc: 'Delivering end-to-end encrypted video consultations, electronic prescriptions, and automated EHR record synchronization.',
      challenge: 'Patients struggled with difficult portal logins, while physicians suffered administrative burnout from manually copying consultation notes into EHRs.',
      solution: 'Developed a unified web and mobile application featuring WebRTC secure streaming, automated AI consultation transcription, and direct FHIR EHR integration.',
      resultsJson: JSON.stringify([
        'Connected over 120,000 successful virtual consultations',
        'Physicians saved an average of 1.5 hours daily on note-taking',
        'Zero security incidents with 100% HIPAA audit pass score',
      ]),
      techStackJson: JSON.stringify(['Next.js', 'React Native', 'WebRTC', 'FastAPI', 'PostgreSQL', 'FHIR/HL7']),
      metricsJson: JSON.stringify([
        { metric: '120k+', label: 'Consultations Completed' },
        { metric: '1.5 hrs', label: 'Daily Physician Time Saved' },
        { metric: '100%', label: 'HIPAA Audit Compliance' },
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isSampleData: true,
    },
    {
      slug: 'smart-logistics-telemetry',
      title: 'Global Fleet Telemetry & Dispatch System',
      clientName: 'Trans-Atlantic Freight Corp (Sample Client)',
      industry: 'Logistics & Supply Chain',
      shortDesc: 'Real-time IoT sensor ingestion and automated multi-stop route optimization across 2,400 active long-haul trucks.',
      challenge: 'Frequent cargo route delays and lack of temperature visibility led to millions in perishable goods spoilage annually.',
      solution: 'Engineered an IoT gateway capturing temperature, speed, and GPS telematics every 5 seconds, combined with automated AI re-routing algorithms.',
      resultsJson: JSON.stringify([
        'Reduced perishable shipment spoilage by 82%',
        'Decreased total fleet fuel expenditures by 14.5%',
        'Real-time customer tracking portal with 98% satisfaction rating',
      ]),
      techStackJson: JSON.stringify(['Python', 'Docker', 'TimescaleDB', 'React', 'Mapbox', 'RabbitMQ']),
      metricsJson: JSON.stringify([
        { metric: '82%', label: 'Spoilage Reduction' },
        { metric: '14.5%', label: 'Fuel Cost Savings' },
        { metric: '2,400+', label: 'Active Connected Trucks' },
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isSampleData: true,
    },
  ];

  for (const cs of caseStudies) {
    await prisma.projectCaseStudy.create({ data: cs });
  }
  console.log('✅ Case studies created');

  // 8. Create Blog Posts
  const blogPosts = [
    {
      slug: 'future-of-enterprise-ai-agents-2026',
      title: 'The Shift from Passive LLMs to Autonomous Enterprise AI Agents',
      excerpt: 'How modern businesses are deploying domain-bounded autonomous agents with vector retrieval to execute end-to-end workflows.',
      content: `### The Next Frontier in Enterprise AI

Over the past three years, generative AI has evolved from simple text completion chatbots into sophisticated **multi-agent orchestration systems**. Today's enterprises do not simply need an LLM to write email drafts—they need autonomous systems that can safely query databases, verify compliance constraints, and execute transactional operations.

#### Key Architectural Pillars for Autonomous Agents:
1. **Deterministic Guardrails:** Ensuring LLM outputs are validated against strict Zod or JSON schemas before touching production APIs.
2. **Retrieval-Augmented Generation (RAG):** Grounding model reasoning in real-time, permission-aware company knowledge bases.
3. **Audit Trails & Observability:** Recording every intermediate step taken by an agent for complete organizational transparency.

At EliteGlobex, our AI engineering practice builds production-ready agent pipelines that adhere to enterprise security mandates while slashing operational latency.`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      authorName: 'Dr. Marcus Vance',
      authorRole: 'Head of Artificial Intelligence',
      categoryName: 'Artificial Intelligence',
      tagsJson: JSON.stringify(['AI', 'LLM', 'Enterprise', 'Machine Learning', 'Automation']),
      readingTime: '6 min read',
      isFeatured: true,
      status: 'PUBLISHED',
      seoTitle: 'The Shift to Autonomous Enterprise AI Agents | EliteGlobex Blog',
      seoDesc: 'Explore how enterprise AI agents and RAG pipelines are transforming digital workflows in 2026.',
    },
    {
      slug: 'multi-cloud-resilience-strategies',
      title: 'Building Resilient Multi-Cloud Architectures for Zero Downtime',
      excerpt: 'Strategic blueprints for designing portable, vendor-agnostic infrastructure across AWS, Google Cloud, and Azure.',
      content: `### Beyond Single Cloud Vendor Lock-In

Cloud outages and price increases have pushed forward-thinking CTOs toward **hybrid and multi-cloud resilience**. Designing for portability requires discipline in containerization, declarative infrastructure, and database replication.

#### Strategies for Multi-Cloud Success:
- **Stateless Workloads on Kubernetes:** Abstracting underlying virtual machines allows instantaneous failover between cloud providers.
- **Global Anycast DNS & Edge Routing:** Directing client traffic seamlessly to healthy regions during localized outages.
- **Active-Passive Database Sync:** Maintaining read-replicas in secondary clouds with automated promotion triggers.

Discover how EliteGlobex helps enterprise clients achieve 99.999% availability with multi-cloud engineering.`,
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
      authorName: 'Elena Rostova',
      authorRole: 'Principal Cloud Architect',
      categoryName: 'Cloud Engineering',
      tagsJson: JSON.stringify(['Cloud', 'DevOps', 'Kubernetes', 'AWS', 'Azure', 'SRE']),
      readingTime: '5 min read',
      isFeatured: true,
      status: 'PUBLISHED',
      seoTitle: 'Multi-Cloud Resilience Strategies | EliteGlobex Blog',
      seoDesc: 'Learn how to architect zero-downtime multi-cloud infrastructure with Kubernetes and Terraform.',
    },
    {
      slug: 'modern-web-performance-metrics',
      title: 'Architecting for Sub-100ms Core Web Vitals at Scale',
      excerpt: 'Techniques for Next.js App Router optimization, edge caching, image pipelines, and minimal JavaScript payloads.',
      content: `### Performance Is Revenue

Every 100 milliseconds of web page latency directly impacts conversion rates and search rankings. In modern web engineering, speed is not an afterthought—it is a core architectural requirement.

#### Key Optimization Techniques:
1. **Server Components (RSC):** Sending pure HTML over the wire without massive JavaScript bundles.
2. **Streaming & Suspense:** Rendering critical above-the-fold UI instantly while background data fetches stream in.
3. **Edge Image Compression:** Dynamic WebP/AVIF transformations tailored to client device viewports.

Explore how EliteGlobex builds websites and applications that feel instantaneous on any network.`,
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      authorName: 'David Kalu',
      authorRole: 'Lead Frontend Architect',
      categoryName: 'Web Engineering',
      tagsJson: JSON.stringify(['Next.js', 'Performance', 'React', 'TypeScript', 'SEO']),
      readingTime: '4 min read',
      isFeatured: false,
      status: 'PUBLISHED',
      seoTitle: 'Architecting for Sub-100ms Core Web Vitals | EliteGlobex Blog',
      seoDesc: 'Deep dive into Next.js App Router performance optimizations and modern web speed strategies.',
    },
  ];

  for (const bp of blogPosts) {
    await prisma.blogPost.create({ data: bp });
  }
  console.log('✅ Blog posts created');

  // 9. Create Career Job Openings
  const jobs = [
    {
      slug: 'senior-full-stack-architect',
      title: 'Senior Full-Stack Architect (Next.js & Cloud)',
      department: 'Engineering',
      location: 'London, UK / Hybrid or Global Remote',
      employmentType: 'Full-time',
      experience: '5+ Years',
      salaryRange: '$130,000 - $170,000 + Equity',
      description: 'We are seeking an experienced Full-Stack Architect to lead the design and execution of high-scale enterprise platforms for our global client portfolio.',
      responsibilitiesJson: JSON.stringify([
        'Architect scalable, modular web applications using Next.js, TypeScript, and Node.js microservices',
        'Lead code reviews, enforce design systems, and mentor mid-level engineers',
        'Collaborate with product and design leads to turn complex business needs into elegant architectures',
        'Ensure rigorous automated test coverage and zero-downtime deployment pipelines',
      ]),
      requirementsJson: JSON.stringify([
        '5+ years professional experience building production web applications at scale',
        'Deep expertise in TypeScript, React/Next.js App Router, Prisma, and PostgreSQL',
        'Demonstrated experience with AWS or GCP cloud deployments and Docker containerization',
        'Strong communication skills and leadership mindset',
      ]),
      skillsJson: JSON.stringify(['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'AWS', 'GraphQL']),
    },
    {
      slug: 'senior-ai-ml-engineer',
      title: 'Senior AI / Machine Learning Engineer',
      department: 'Artificial Intelligence',
      location: 'New York, USA / Hybrid or Remote',
      employmentType: 'Full-time',
      experience: '4+ Years',
      salaryRange: '$140,000 - $185,000 + Equity',
      description: 'Join our AI practice to develop bespoke LLM fine-tuning pipelines, RAG systems, and computer vision models for enterprise clients.',
      responsibilitiesJson: JSON.stringify([
        'Develop and deploy state-of-the-art RAG architectures and autonomous agent systems',
        'Benchmark and fine-tune open-weight models (Llama, Mistral) for domain-specific tasks',
        'Build low-latency inference APIs using FastAPI and Triton inference servers',
        'Collaborate with client stakeholders to ensure data privacy and AI safety',
      ]),
      requirementsJson: JSON.stringify([
        'Strong background in Python, PyTorch, LangChain, and vector databases (Pinecone, Milvus)',
        'Demonstrated track record of deploying ML models to production environments',
        'Understanding of model quantization, caching, and token optimization',
      ]),
      skillsJson: JSON.stringify(['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Pinecone', 'MLOps', 'Docker']),
    },
    {
      slug: 'lead-ui-ux-product-designer',
      title: 'Lead UI/UX & Product Designer',
      department: 'Design',
      location: 'Global Remote',
      employmentType: 'Full-time',
      experience: '4+ Years',
      salaryRange: '$110,000 - $150,000',
      description: 'Lead visual design systems and user journey experiences for next-generation web and mobile products.',
      responsibilitiesJson: JSON.stringify([
        'Design complete UI component libraries and design tokens in Figma',
        'Conduct stakeholder workshops and user research sessions',
        'Create interactive prototypes and micro-animation specifications',
      ]),
      requirementsJson: JSON.stringify([
        'Exceptional portfolio demonstrating clean, high-end corporate and SaaS interfaces',
        'Mastery of Figma, auto-layout, components, and token architectures',
        'Solid understanding of HTML/CSS constraints and responsive layouts',
      ]),
      skillsJson: JSON.stringify(['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Tailwind CSS']),
    },
  ];

  for (const job of jobs) {
    await prisma.jobPosition.create({ data: job });
  }
  console.log('✅ Job positions created');

  // 10. Create FAQs
  const faqs = [
    {
      question: 'How does EliteGlobex initiate a new client engagement?',
      answer: 'Our typical engagement begins with a 1-to-2 week Discovery & Architecture Sprint. We evaluate your business objectives, review existing technical assets, establish target architecture blueprints, and provide fixed-scope milestones with clear timelines.',
      category: 'Process',
      order: 1,
      isPopular: true,
    },
    {
      question: 'What security standards and compliance frameworks do you follow?',
      answer: 'All our engineering workflows adhere to SOC2 Type II, ISO/IEC 27001, GDPR, and HIPAA compliance standards. We implement zero-trust access controls, automated dependency vulnerability scanning, and encrypted data pipelines at rest and in transit.',
      category: 'Security',
      order: 2,
      isPopular: true,
    },
    {
      question: 'Can you work with our existing in-house engineering team?',
      answer: 'Absolutely. We operate both as a turnkey end-to-end product engineering partner and as specialized co-development squads that integrate seamlessly into your existing Git workflows, Jira boards, and sprint cadences.',
      category: 'General',
      order: 3,
      isPopular: true,
    },
    {
      question: 'How do you handle intellectual property and source code ownership?',
      answer: 'Upon delivery and milestone settlement, 100% of the custom intellectual property, source code, design files, and deployment configurations belong exclusively to your organization.',
      category: 'General',
      order: 4,
      isPopular: false,
    },
    {
      question: 'Do you offer post-launch maintenance, monitoring, and SLAs?',
      answer: 'Yes. We offer Tier-1 to Tier-3 24/7 Site Reliability Engineering (SRE) support packages, including automated uptime monitoring, guaranteed response times under 15 minutes for critical incidents, and scheduled monthly feature releases.',
      category: 'Services',
      order: 5,
      isPopular: true,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs created');

  // 11. Create Global Office Locations
  const offices = [
    {
      name: 'London Global Headquarters',
      country: 'United Kingdom',
      state: 'Greater London',
      city: 'London',
      address: '100 Bishopsgate, Level 24, EC2N 4AG',
      phone: '+44 20 7946 0920',
      email: 'london@eliteglobex.com',
      mapUrl: 'https://maps.google.com/?q=100+Bishopsgate+London',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM GMT',
      isHQ: true,
      status: 'ACTIVE',
    },
    {
      name: 'New York Innovation Hub',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      address: 'One World Trade Center, 48th Floor, NY 10007',
      phone: '+1 (212) 555-0188',
      email: 'nyc@eliteglobex.com',
      mapUrl: 'https://maps.google.com/?q=One+World+Trade+Center+New+York',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
      isHQ: false,
      status: 'ACTIVE',
    },
    {
      name: 'Singapore Asia-Pacific Desk',
      country: 'Singapore',
      state: 'Central Region',
      city: 'Singapore',
      address: 'Marina Bay Financial Centre, Tower 1, Level 32',
      phone: '+65 6789 0123',
      email: 'apac@eliteglobex.com',
      mapUrl: 'https://maps.google.com/?q=Marina+Bay+Financial+Centre+Singapore',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM SGT',
      isHQ: false,
      status: 'ACTIVE',
    },
    {
      name: 'Dubai MENA Center',
      country: 'United Arab Emirates',
      state: 'Dubai',
      city: 'Dubai',
      address: 'Dubai International Financial Centre (DIFC), Gate Building 4',
      phone: '+971 4 312 8800',
      email: 'mena@eliteglobex.com',
      mapUrl: 'https://maps.google.com/?q=DIFC+Dubai',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM GST',
      isHQ: false,
      status: 'ACTIVE',
    },
  ];

  for (const off of offices) {
    await prisma.officeLocation.create({ data: off });
  }
  console.log('✅ Offices created');

  // 12. Create Testimonials (marked as sample data)
  const testimonials = [
    {
      clientName: 'David Sterling (Sample Reviewer)',
      clientRole: 'Chief Technology Officer',
      clientCompany: 'Apex Global Capital',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      feedback: 'EliteGlobex architected our multi-region financial ledger in record time. Their engineering rigor, attention to latency, and zero-downtime transition exceeded all expectations.',
      rating: 5,
      projectType: 'Cloud & FinTech Modernization',
      isFeatured: true,
      isSampleData: true,
    },
    {
      clientName: 'Dr. Evelyn Martinez (Sample Reviewer)',
      clientRole: 'VP of Digital Innovation',
      clientCompany: 'CareFront Health Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      feedback: 'The HIPAA-compliant telehealth platform engineered by EliteGlobex reduced our physician documentation backlog by over 30% within the first two months of deployment.',
      rating: 5,
      projectType: 'Healthcare Web & Mobile',
      isFeatured: true,
      isSampleData: true,
    },
    {
      clientName: 'Marcus Thorne (Sample Reviewer)',
      clientRole: 'Head of Operations',
      clientCompany: 'Vanguard Freight & Logistics',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      feedback: 'The real-time telemetry dashboard and IoT routing system transformed how our dispatchers handle long-haul shipments. High reliability and superb UI responsiveness.',
      rating: 5,
      projectType: 'Supply Chain Automation',
      isFeatured: true,
      isSampleData: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('✅ Testimonials created');

  // 13. Create Sample Employees (HR Module)
  const employees = [
    {
      employeeId: 'EMP-101',
      firstName: 'Alexander',
      lastName: 'Wright',
      email: 'alexander.wright@eliteglobex.com',
      phone: '+1 (555) 019-2834',
      department: 'Executive',
      designation: 'Managing Director & Chief Architect',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      skillsJson: JSON.stringify(['Cloud Architecture', 'System Strategy', 'Distributed Systems']),
    },
    {
      employeeId: 'EMP-102',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@eliteglobex.com',
      phone: '+1 (555) 019-5821',
      department: 'Engineering',
      designation: 'Director of Engineering',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      skillsJson: JSON.stringify(['Next.js', 'PostgreSQL', 'Kubernetes', 'Engineering Leadership']),
    },
    {
      employeeId: 'EMP-103',
      firstName: 'Dr. Marcus',
      lastName: 'Vance',
      email: 'marcus.vance@eliteglobex.com',
      phone: '+1 (555) 019-9402',
      department: 'AI & Data',
      designation: 'Head of Artificial Intelligence',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      skillsJson: JSON.stringify(['Python', 'PyTorch', 'Vector Databases', 'LLM Fine-Tuning']),
    },
    {
      employeeId: 'EMP-104',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@eliteglobex.com',
      phone: '+1 (555) 019-3312',
      department: 'Cloud & DevOps',
      designation: 'Principal Cloud Architect',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      skillsJson: JSON.stringify(['AWS', 'GCP', 'Terraform', 'SRE', 'CI/CD']),
    },
    {
      employeeId: 'EMP-105',
      firstName: 'Liam',
      lastName: 'O\'Connor',
      email: 'liam.oconnor@eliteglobex.com',
      phone: '+1 (555) 019-7711',
      department: 'Design',
      designation: 'Staff Product Designer',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      skillsJson: JSON.stringify(['Figma', 'Design Systems', 'Micro-Interactions', 'UX Research']),
    },
  ];

  for (const emp of employees) {
    const createdEmp = await prisma.employee.create({ data: emp });

    // Add sample attendance for this employee
    await prisma.attendance.create({
      data: {
        employeeId: createdEmp.id,
        date: new Date(),
        checkIn: '08:55 AM',
        checkOut: '05:45 PM',
        status: 'PRESENT',
        remarks: 'On time, active sprint execution',
      },
    });
  }
  console.log('✅ Employees & Attendance records created');

  // 14. Create Sample Orders (for tracking & order management)
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'EGX-1001',
      customerName: 'Enterprise FinTech Partners',
      customerEmail: 'finance@enterprisefin.example.com',
      customerPhone: '+1 (555) 304-9812',
      customerCompany: 'Enterprise FinTech Inc.',
      serviceName: 'Cloud Architecture & DevOps Infrastructure',
      amount: 48500.0,
      currency: 'USD',
      status: 'IN_DEVELOPMENT',
      paymentStatus: 'PAID',
      expectedCompletion: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      assignedToId: adminUser.id,
      notes: 'Phase 2: Multi-region Kubernetes cluster deployment underway.',
      timelineStepsJson: JSON.stringify([
        { stage: 'Order Received', date: '2026-03-01', completed: true, description: 'Engagement scope and technical specifications signed.' },
        { stage: 'Processing & Discovery', date: '2026-03-05', completed: true, description: 'Architecture blueprints and VPC network mapping completed.' },
        { stage: 'In Development', date: '2026-03-12', completed: true, description: 'Terraform IaC scripts and Kubernetes staging clusters deployed.' },
        { stage: 'Quality Check & Audit', date: 'Pending', completed: false, description: 'Automated penetration testing and load testing.' },
        { stage: 'Ready for Rollout', date: 'Pending', completed: false, description: 'Final production handover and DNS switchover.' },
        { stage: 'Completed', date: 'Pending', completed: false, description: 'Production sign-off and 24/7 SLA monitoring active.' },
      ]),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'EGX-1002',
      customerName: 'Aura Health Systems',
      customerEmail: 'ops@aurahealth.example.com',
      customerCompany: 'Aura Health Global',
      serviceName: 'HIPAA Telehealth Web & Mobile Application',
      amount: 62000.0,
      currency: 'USD',
      status: 'QUALITY_CHECK',
      paymentStatus: 'PAID',
      expectedCompletion: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      assignedToId: managerUser.id,
      notes: 'Final HIPAA penetration test in progress.',
      timelineStepsJson: JSON.stringify([
        { stage: 'Order Received', date: '2026-02-15', completed: true, description: 'Contract initiated.' },
        { stage: 'Processing & Discovery', date: '2026-02-20', completed: true, description: 'UI/UX clinical flow designed.' },
        { stage: 'In Development', date: '2026-03-02', completed: true, description: 'WebRTC and EHR integration complete.' },
        { stage: 'Quality Check & Audit', date: '2026-03-20', completed: true, description: 'Undergoing third-party SOC2/HIPAA security audit.' },
        { stage: 'Ready for Rollout', date: 'Pending', completed: false, description: 'App Store submission.' },
        { stage: 'Completed', date: 'Pending', completed: false, description: 'Final launch.' },
      ]),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'EGX-1003',
      customerName: 'Nextera Retail Labs',
      customerEmail: 'digital@nexteraretail.example.com',
      customerCompany: 'Nextera Retail Group',
      serviceName: 'Next.js E-Commerce Platform & Design System',
      amount: 35000.0,
      currency: 'USD',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      expectedCompletion: new Date('2026-03-10'),
      notes: 'Successfully deployed to global production edge.',
      timelineStepsJson: JSON.stringify([
        { stage: 'Order Received', date: '2026-01-10', completed: true, description: 'Project initialized.' },
        { stage: 'Processing', date: '2026-01-18', completed: true, description: 'Wireframes approved.' },
        { stage: 'In Development', date: '2026-02-05', completed: true, description: 'Components built.' },
        { stage: 'Quality Check', date: '2026-02-28', completed: true, description: 'Performance 100 on Lighthouse.' },
        { stage: 'Ready for Rollout', date: '2026-03-05', completed: true, description: 'Client sign-off.' },
        { stage: 'Completed', date: '2026-03-10', completed: true, description: 'Live on production domains.' },
      ]),
    },
  });

  console.log('✅ Orders created');

  // 15. Create Sample Invoices & Payment Records
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      orderId: order1.id,
      customerName: 'Enterprise FinTech Inc.',
      customerEmail: 'finance@enterprisefin.example.com',
      customerAddress: '500 Madison Ave, New York, NY 10022',
      subtotal: 45000.0,
      tax: 3500.0,
      discount: 0.0,
      total: 48500.0,
      currency: 'USD',
      status: 'PAID',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      itemsJson: JSON.stringify([
        { description: 'Multi-Cloud Architecture Blueprint & IaC Terraform Codebase', quantity: 1, unitPrice: 28000.0, total: 28000.0 },
        { description: 'Automated CI/CD Pipeline & Kubernetes Cluster Hardening', quantity: 1, unitPrice: 17000.0, total: 17000.0 },
      ]),
      notes: 'Payment received in full via Wire Transfer. Thank you for partnering with EliteGlobex.',
    },
  });

  await prisma.paymentRecord.create({
    data: {
      paymentRef: 'PAY-2026-881',
      orderId: order1.id,
      customerName: 'Enterprise FinTech Inc.',
      amount: 48500.0,
      currency: 'USD',
      method: 'WIRE',
      status: 'SUCCESS',
      transactionRef: 'WT-NYC-9842109',
      notes: 'Cleared via Citibank corporate treasury.',
    },
  });

  // 16. Create Sample Leads (CRM Module)
  const leads = [
    {
      name: 'Victoria Hawthorne',
      email: 'v.hawthorne@meridianbank.example.com',
      phone: '+1 (555) 892-1140',
      company: 'Meridian Capital Bank',
      serviceInterest: 'AI & Machine Learning Solutions',
      source: 'WEBSITE',
      status: 'QUALIFIED',
      priority: 'HIGH',
      estimatedValue: 75000.0,
      notes: 'Interested in bespoke fraud detection model for their merchant portal. Demo scheduled for next Tuesday.',
      assignedToId: adminUser.id,
    },
    {
      name: 'James Thornton',
      email: 'jthornton@zenithlogistics.example.com',
      phone: '+44 20 7123 4567',
      company: 'Zenith Global Logistics',
      serviceInterest: 'Digital Transformation & Automation',
      source: 'REFERRAL',
      status: 'PROPOSAL',
      priority: 'URGENT',
      estimatedValue: 95000.0,
      notes: 'Sent enterprise proposal for fleet telemetry integration.',
      assignedToId: managerUser.id,
    },
    {
      name: 'Samantha Reed',
      email: 'sreed@cloudscale.example.com',
      phone: '+1 (555) 432-8819',
      company: 'CloudScale SaaS',
      serviceInterest: 'Cloud Architecture & DevOps',
      source: 'WEBSITE',
      status: 'NEW',
      priority: 'MEDIUM',
      estimatedValue: 40000.0,
      notes: 'Submitted inquiry via contact form requesting Kubernetes migration audit.',
    },
  ];

  for (const l of leads) {
    await prisma.lead.create({ data: l });
  }
  console.log('✅ Leads created');

  // 17. Create Internal ERP Project & Tasks
  const project = await prisma.internalProject.create({
    data: {
      name: 'Enterprise Telehealth Portal Core Release',
      code: 'PRJ-HLTH-02',
      clientName: 'Aura Health Global',
      description: 'HIPAA-compliant video streaming and EHR integration milestone delivery.',
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: new Date('2026-02-15'),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budget: 62000.0,
      leadEmployeeId: managerUser.id,
    },
  });

  await prisma.projectTask.create({
    data: {
      projectId: project.id,
      title: 'Conduct automated load testing on WebRTC signaling servers',
      description: 'Simulate 5,000 concurrent video sessions and log packet loss ratios.',
      assigneeId: adminUser.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      estimatedHours: 16.0,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.projectTask.create({
    data: {
      projectId: project.id,
      title: 'Finalize FHIR patient records encryption audit',
      description: 'Verify field-level AES-256 GCM encryption on sensitive health identifiers.',
      assigneeId: managerUser.id,
      status: 'TODO',
      priority: 'URGENT',
      estimatedHours: 8.0,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Internal Projects & Tasks created');
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
