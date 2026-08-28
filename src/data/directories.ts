export interface DirectoryItem {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  proof: string;
  deliverables: string[];
  outcomes: string[];
}

export const technologies: DirectoryItem[] = [
  {
    slug: 'node-js',
    title: 'Node.js Development for Fast, Connected Products.',
    shortTitle: 'Node.js',
    category: 'Back-end / Front-end',
    description: 'SynoIT uses Node.js to build APIs, dashboards, integrations, and real-time product features that need speed, flexibility, and maintainable architecture.',
    proof: 'A practical JavaScript runtime for scalable backends, server-rendered experiences, and data-heavy product workflows.',
    deliverables: ['API architecture', 'Real-time features', 'Backend services', 'Third-party integrations', 'Performance tuning', 'Production deployment'],
    outcomes: ['Faster feature delivery', 'Unified JavaScript stack', 'Reliable integrations', 'Scalable backend systems']
  },
  {
    slug: 'react-js',
    title: 'React Interfaces Built for Clarity and Scale.',
    shortTitle: 'React JS',
    category: 'Back-end / Front-end',
    description: 'We build React applications with reusable components, predictable state, accessible UI, and performance-minded delivery.',
    proof: 'A strong fit for SaaS products, portals, dashboards, and interactive marketing experiences.',
    deliverables: ['Component systems', 'Frontend architecture', 'State management', 'Responsive UI', 'Accessibility review', 'Frontend performance'],
    outcomes: ['Reusable interface systems', 'Smooth user flows', 'Maintainable frontend code', 'Better product iteration']
  },
  {
    slug: 'next-js',
    title: 'Next.js Websites and Apps for SEO, Speed, and Growth.',
    shortTitle: 'Next JS',
    category: 'Back-end / Front-end',
    description: 'SynoIT uses Next.js for fast, search-friendly websites, app frontends, landing systems, and hybrid products that need strong content and product performance.',
    proof: 'A modern React framework for teams that need flexible rendering, clean routing, and reliable production delivery.',
    deliverables: ['App routing', 'SEO foundations', 'Server rendering', 'API routes', 'Analytics setup', 'Deployment support'],
    outcomes: ['Faster page loads', 'Stronger organic visibility', 'Flexible product architecture', 'Launch-ready web apps']
  },
  {
    slug: 'vue-js',
    title: 'Vue.js Development for Focused Product Interfaces.',
    shortTitle: 'Vue JS',
    category: 'Back-end / Front-end',
    description: 'We use Vue.js for approachable, polished interfaces where fast iteration, maintainability, and clear component structure matter.',
    proof: 'A good choice for admin panels, product modules, and teams that prefer a lighter frontend workflow.',
    deliverables: ['Vue components', 'SPA architecture', 'UI integration', 'Form workflows', 'API connection', 'QA support'],
    outcomes: ['Cleaner UI delivery', 'Fast iteration cycles', 'Stable product screens', 'Lower frontend complexity']
  },
  {
    slug: 'astro',
    title: 'Astro Sites Tuned for Speed and Editorial Control.',
    shortTitle: 'Astro',
    category: 'Back-end / Front-end',
    description: 'SynoIT builds Astro sites for brands that need rich visuals, excellent Lighthouse scores, and content that loads quickly across devices.',
    proof: 'A strong foundation for modern marketing sites, service pages, blogs, and conversion-focused content systems.',
    deliverables: ['Static site architecture', 'Component pages', 'Content collections', 'SEO metadata', 'Asset optimization', 'Build verification'],
    outcomes: ['Excellent Core Web Vitals', 'Lower JavaScript weight', 'Flexible content publishing', 'High-performing brand pages']
  },
  {
    slug: 'prismic',
    title: 'Prismic CMS for Structured Marketing Teams.',
    shortTitle: 'Prismic',
    category: 'CMS',
    description: 'We shape Prismic content models so marketing teams can publish pages, sections, and campaigns without breaking the design system.',
    proof: 'Ideal for brands that want reusable slices, clean governance, and developer-supported editorial control.',
    deliverables: ['Content modeling', 'Slice architecture', 'Page templates', 'Preview setup', 'Editorial workflow', 'CMS training'],
    outcomes: ['Reusable page building', 'Cleaner content governance', 'Faster campaign launches', 'Lower developer dependency']
  },
  {
    slug: 'sanity',
    title: 'Sanity CMS for Flexible Content Operations.',
    shortTitle: 'Sanity',
    category: 'CMS',
    description: 'SynoIT uses Sanity to build structured content studios for websites, blogs, landing pages, and product content operations.',
    proof: 'A flexible headless CMS for teams that need custom editorial workflows and content reuse.',
    deliverables: ['Schema design', 'Editorial studio', 'Preview workflow', 'Content migration', 'API integration', 'Author training'],
    outcomes: ['Structured content reuse', 'Custom publishing workflows', 'Scalable editorial systems', 'Reliable content APIs']
  },
  {
    slug: 'webflow',
    title: 'Webflow Builds for Fast, Managed Websites.',
    shortTitle: 'Webflow',
    category: 'CMS',
    description: 'We build Webflow websites with clean CMS structures, responsive layouts, thoughtful interactions, and launch-ready performance checks.',
    proof: 'Useful for marketing teams that need speed, visual control, and iteration without a full engineering queue.',
    deliverables: ['Webflow development', 'CMS collections', 'Responsive QA', 'Interaction setup', 'SEO basics', 'Launch support'],
    outcomes: ['Fast site launches', 'Easy page management', 'Polished interactions', 'Campaign-friendly updates']
  },
  {
    slug: 'aws',
    title: 'AWS Cloud Foundations for Reliable Products.',
    shortTitle: 'AWS',
    category: 'Cloud',
    description: 'SynoIT designs and supports AWS-backed applications with deployment automation, observability, security controls, and cost-aware architecture.',
    proof: 'A strong cloud option for scalable apps, APIs, storage, and production infrastructure.',
    deliverables: ['Cloud architecture', 'Deployment pipelines', 'Monitoring setup', 'Storage design', 'Security controls', 'Cost review'],
    outcomes: ['Reliable infrastructure', 'Scalable releases', 'Better visibility', 'Controlled cloud spend']
  },
  {
    slug: 'microsoft-azure',
    title: 'Microsoft Azure for Enterprise-Ready Cloud Systems.',
    shortTitle: 'Microsoft Azure',
    category: 'Cloud',
    description: 'We help teams use Azure for application hosting, integrations, identity-aware systems, and cloud modernization.',
    proof: 'A useful platform for Microsoft-aligned organizations, internal tools, and governed cloud environments.',
    deliverables: ['Azure architecture', 'App hosting', 'Identity integration', 'Data services', 'Security review', 'Operations handoff'],
    outcomes: ['Governed cloud delivery', 'Enterprise integration', 'Secure access patterns', 'Operational stability']
  },
  {
    slug: 'react-native',
    title: 'React Native Apps for Cross-Platform Launches.',
    shortTitle: 'React Native',
    category: 'Mobile Development',
    description: 'SynoIT builds React Native apps when teams need strong mobile UX, shared delivery across iOS and Android, and backend-connected product features.',
    proof: 'A practical path for MVPs, customer apps, internal tools, and products that need one codebase across platforms.',
    deliverables: ['Cross-platform app build', 'API integration', 'Mobile UI implementation', 'Push notifications', 'Release support', 'Performance QA'],
    outcomes: ['Faster mobile delivery', 'Shared product code', 'Native-feeling interfaces', 'Lower maintenance overhead']
  },
  {
    slug: 'flutter',
    title: 'Flutter Apps With Polished Cross-Platform UI.',
    shortTitle: 'Flutter',
    category: 'Mobile Development',
    description: 'We use Flutter for visually consistent mobile apps, prototypes, and cross-platform products that need smooth UI and controlled delivery.',
    proof: 'A strong fit for brand-sensitive mobile experiences and products that need consistent interface behavior.',
    deliverables: ['Flutter app build', 'Design implementation', 'Backend integration', 'State architecture', 'Testing support', 'App store release'],
    outcomes: ['Consistent mobile UI', 'Efficient app delivery', 'Strong prototype-to-product path', 'Release-ready builds']
  }
];

export const industries: DirectoryItem[] = [
  {
    slug: 'healthcare-software-development',
    title: 'Healthcare Software Development With Secure, Human-Centered UX.',
    shortTitle: 'Healthcare Software Development',
    category: 'Healthcare',
    description: 'SynoIT helps healthcare teams design and build patient portals, clinical workflows, scheduling systems, telehealth experiences, and secure operational tools.',
    proof: 'We focus on trust, accessibility, clear task flows, and data-aware delivery for healthcare products.',
    deliverables: ['Patient portals', 'Healthcare UX', 'Telehealth workflows', 'Secure dashboards', 'Appointment systems', 'QA documentation'],
    outcomes: ['Clearer patient journeys', 'Better operational workflows', 'Accessible interfaces', 'More reliable health products']
  },
  {
    slug: 'healthcare-it-consulting',
    title: 'Healthcare IT Consulting for Safer Digital Decisions.',
    shortTitle: 'Healthcare IT Consulting',
    category: 'Healthcare',
    description: 'We help healthcare organizations scope platforms, modernize workflows, evaluate technical risk, and plan digital delivery with practical guardrails.',
    proof: 'Useful before a build, migration, redesign, or automation program that touches sensitive health workflows.',
    deliverables: ['Digital roadmap', 'Workflow audit', 'Platform planning', 'Integration review', 'Security considerations', 'Implementation scope'],
    outcomes: ['Sharper project scope', 'Lower delivery risk', 'Better technology choices', 'Clearer modernization path']
  },
  {
    slug: 'telemedicine-app-development',
    title: 'Telemedicine App Development for Connected Care.',
    shortTitle: 'Telemedicine App Development',
    category: 'Healthcare',
    description: 'SynoIT builds telemedicine experiences for patient intake, appointment booking, video workflows, provider dashboards, and follow-up communication.',
    proof: 'We align product design, secure backend flows, and mobile-first access around real care delivery.',
    deliverables: ['Patient onboarding', 'Consultation flows', 'Provider dashboards', 'Notifications', 'Payment integration', 'Release support'],
    outcomes: ['Simpler remote care', 'Better patient access', 'Connected provider workflows', 'Reliable launch foundations']
  },
  {
    slug: 'education-software-development',
    title: 'Education Software Development for Learning at Scale.',
    shortTitle: 'Education Software Development',
    category: 'Education',
    description: 'We design and build learning platforms, portals, content systems, and management tools for education providers and training teams.',
    proof: 'SynoIT focuses on usability, progress tracking, content governance, and reliable access across devices.',
    deliverables: ['Learning portals', 'Student dashboards', 'Course systems', 'Assessment flows', 'Admin tools', 'Analytics setup'],
    outcomes: ['Better learner engagement', 'Cleaner admin workflows', 'Scalable course delivery', 'Accessible learning experiences']
  },
  {
    slug: 'lms-development-services',
    title: 'LMS Development Services for Structured Training.',
    shortTitle: 'LMS Development Services',
    category: 'Education',
    description: 'SynoIT builds LMS experiences for courses, cohorts, assessments, certifications, reporting, and internal training programs.',
    proof: 'A practical fit for teams that need flexible learning delivery without fighting a generic platform.',
    deliverables: ['Course architecture', 'Learner profiles', 'Progress tracking', 'Assessment tools', 'Certificates', 'Admin reporting'],
    outcomes: ['Clear training paths', 'Measurable learning progress', 'Reusable course systems', 'Better learner retention']
  },
  {
    slug: 'school-management-software',
    title: 'School Management Software for Daily Operations.',
    shortTitle: 'School Management Software',
    category: 'Education',
    description: 'We create school portals and management tools for admissions, attendance, communications, payments, reporting, and staff workflows.',
    proof: 'Built around the actual operational rhythm of schools, administrators, teachers, students, and families.',
    deliverables: ['Admin dashboards', 'Attendance workflows', 'Parent portals', 'Payment flows', 'Reporting tools', 'Role permissions'],
    outcomes: ['Lower admin load', 'Clearer communication', 'Better reporting', 'More connected school operations']
  },
  {
    slug: 'financial-software-development',
    title: 'Financial Software Development for Secure Digital Services.',
    shortTitle: 'Financial Software Development',
    category: 'Finance',
    description: 'SynoIT helps finance teams design and build customer portals, fintech products, dashboards, payment workflows, and internal tools.',
    proof: 'We prioritize security-minded architecture, trustworthy UX, clean data flows, and clear compliance collaboration.',
    deliverables: ['Fintech platforms', 'Customer dashboards', 'Payment workflows', 'Data visualization', 'KYC flows', 'QA support'],
    outcomes: ['Trustworthy user journeys', 'Secure workflow foundations', 'Clear financial data views', 'Scalable product delivery']
  },
  {
    slug: 'banking-app-development',
    title: 'Banking App Development With Clear, Confident UX.',
    shortTitle: 'Banking App Development',
    category: 'Finance',
    description: 'We build digital banking interfaces, account flows, support journeys, and backend-connected mobile or web experiences.',
    proof: 'Designed for clarity, accessibility, auditability, and the high trust expectations of financial users.',
    deliverables: ['Account flows', 'Mobile interfaces', 'Transaction UI', 'Secure authentication', 'Support workflows', 'Testing support'],
    outcomes: ['Better customer confidence', 'Reduced task friction', 'More reliable releases', 'Accessible banking journeys']
  },
  {
    slug: 'payment-integration-services',
    title: 'Payment Integration Services for Digital Products.',
    shortTitle: 'Payment Integration Services',
    category: 'Finance',
    description: 'SynoIT connects payment providers, checkout flows, subscriptions, invoices, and reporting into websites, apps, and internal systems.',
    proof: 'We shape payment flows around security, conversion, error handling, and operational visibility.',
    deliverables: ['Checkout integration', 'Subscription flows', 'Invoice logic', 'Webhook handling', 'Payment reporting', 'QA testing'],
    outcomes: ['Smoother checkout', 'Reliable payment events', 'Cleaner finance operations', 'Better conversion paths']
  },
  {
    slug: 'transportation-software-development',
    title: 'Transportation Software Development for Moving Operations.',
    shortTitle: 'Transportation Software Development',
    category: 'Transportation and Logistics',
    description: 'We build dispatch tools, logistics portals, delivery dashboards, booking flows, and operational systems for transportation teams.',
    proof: 'SynoIT connects UX, workflow automation, and system integration around time-sensitive operations.',
    deliverables: ['Dispatch dashboards', 'Booking systems', 'Driver workflows', 'Tracking interfaces', 'Operations portals', 'Integration support'],
    outcomes: ['Better dispatch visibility', 'Faster coordination', 'Cleaner customer updates', 'More efficient logistics workflows']
  },
  {
    slug: 'logistics-app-development',
    title: 'Logistics App Development for Teams in Motion.',
    shortTitle: 'Logistics App Development',
    category: 'Transportation and Logistics',
    description: 'SynoIT creates mobile and web apps for route planning, delivery updates, fleet workflows, inventory visibility, and customer communication.',
    proof: 'Built for reliability, responsive interfaces, and workflows that hold up outside the office.',
    deliverables: ['Mobile operations apps', 'Tracking views', 'Route workflows', 'Driver communication', 'Customer notifications', 'Backend integration'],
    outcomes: ['Faster field updates', 'More visible operations', 'Reduced manual coordination', 'Reliable mobile workflows']
  },
  {
    slug: 'supply-chain-software-development',
    title: 'Supply Chain Software Development for Better Visibility.',
    shortTitle: 'Supply Chain Software Development',
    category: 'Transportation and Logistics',
    description: 'We help teams build supply-chain dashboards, vendor portals, inventory systems, and integration layers that improve operational visibility.',
    proof: 'A good fit for teams replacing spreadsheets, disconnected systems, or slow reporting workflows.',
    deliverables: ['Inventory dashboards', 'Vendor portals', 'Data integrations', 'Workflow automation', 'Reporting tools', 'Role-based access'],
    outcomes: ['Clearer supply visibility', 'Lower manual work', 'Better partner workflows', 'Faster operational decisions']
  },
  {
    slug: 'ai-consulting-services',
    title: 'AI Consulting Services for Practical Automation.',
    shortTitle: 'AI Consulting Services',
    category: 'Machine Learning & AI',
    description: 'SynoIT helps teams find AI opportunities, evaluate feasibility, define guardrails, and plan automation that fits real business workflows.',
    proof: 'We focus on useful AI adoption, not novelty: clear use cases, measurable value, secure data access, and human oversight.',
    deliverables: ['AI opportunity audit', 'Workflow mapping', 'Feasibility review', 'Data readiness', 'Risk controls', 'Implementation roadmap'],
    outcomes: ['Sharper AI priorities', 'Lower automation risk', 'Clearer ROI cases', 'Responsible AI adoption']
  },
  {
    slug: 'ai-development-services',
    title: 'AI Development Services for Real Product Workflows.',
    shortTitle: 'AI Development Services',
    category: 'Machine Learning & AI',
    description: 'We build AI-enabled workflows, assistants, data tools, and product features that help teams move faster while preserving quality control.',
    proof: 'SynoIT connects model capability to interface design, backend logic, evaluation, and operational support.',
    deliverables: ['AI product features', 'Assistant workflows', 'Data pipelines', 'Prompt systems', 'Evaluation loops', 'Monitoring support'],
    outcomes: ['Useful AI features', 'Faster internal workflows', 'Better knowledge access', 'Measurable automation quality']
  },
  {
    slug: 'chatgpt-integration',
    title: 'ChatGPT Integration for Websites, Apps, and Teams.',
    shortTitle: 'ChatGPT Integration',
    category: 'Machine Learning & AI',
    description: 'SynoIT integrates ChatGPT-powered experiences into support flows, internal tools, knowledge bases, onboarding, and product workflows.',
    proof: 'We combine interface design, secure integration, prompt architecture, and evaluation so AI feels reliable in daily use.',
    deliverables: ['AI assistant design', 'Knowledge integration', 'Prompt workflows', 'Access controls', 'Quality checks', 'Analytics setup'],
    outcomes: ['Faster support', 'Better internal knowledge use', 'More helpful product workflows', 'Controlled AI behavior']
  }
];

export const technologyGroups = groupDirectory(technologies);
export const industryGroups = groupDirectory(industries);

export function groupDirectory(items: DirectoryItem[]) {
  const groups = new Map<string, DirectoryItem[]>();
  items.forEach((item) => {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  });
  return Array.from(groups, ([category, items]) => ({ category, items }));
}

export function getTechnology(slug: string) {
  return technologies.find((item) => item.slug === slug);
}

export function getIndustry(slug: string) {
  return industries.find((item) => item.slug === slug);
}
