import type { APIRoute } from 'astro';
import { categories, services } from '@/data/services';
import { industries, technologies, industryGroups } from '@/data/directories';
import { technologyShowcase, technologyTabs } from '@/data/technologyShowcase';

export const prerender = true;

type KnowledgeEntry = {
  id: string;
  kind: 'company' | 'service' | 'technology' | 'industry' | 'pricing' | 'process' | 'project' | 'faq';
  title: string;
  answer: string;
  keywords: string[];
  url?: string;
};

const serviceNames = services.map((service) => service.shortTitle);
const technologyNames = technologyShowcase.map((technology) => technology.name);
const industryNames = industries.map((industry) => industry.shortTitle);

const commonEntries: KnowledgeEntry[] = [
  {
    id: 'company-overview',
    kind: 'company',
    title: 'About SynoIT',
    answer: 'SynoIT is a digital product studio for strategy, web and product design, software development, mobile apps, AI automation, SEO, digital marketing, and dedicated delivery teams. We work with startups, SMEs, growing digital businesses, and enterprise teams.',
    keywords: ['about synoit', 'who are you', 'what do you do', 'company', 'agency', 'digital product studio', 'startup', 'sme', 'enterprise'],
    url: '/'
  },
  {
    id: 'services-overview',
    kind: 'service',
    title: 'Services overview',
    answer: `SynoIT covers ${categories.join(', ')}. Our services include ${serviceNames.join(', ')}. We can own an outcome end to end or join an existing team for a focused part of the work.`,
    keywords: ['all services', 'services offered', 'capabilities', 'what can you build', 'design development ai marketing', ...serviceNames],
    url: '/#signature'
  },
  {
    id: 'technologies-overview',
    kind: 'technology',
    title: 'Technology stack',
    answer: `Our working toolkit spans ${technologyTabs.slice(1).join(', ')}. It includes ${technologyNames.join(', ')}. We choose the stack after reviewing product goals, team context, integrations, performance, security, and long-term ownership.`,
    keywords: ['technologies', 'technology stack', 'tech stack', 'frameworks', 'languages', 'tools', 'platforms', ...technologyNames],
    url: '/technologies/'
  },
  {
    id: 'industries-overview',
    kind: 'industry',
    title: 'Industries we support',
    answer: `SynoIT has focused capabilities across ${industryGroups.map((group) => group.category).join(', ')}. That includes ${industryNames.join(', ')}. If your sector is not listed, we can still assess the workflow, compliance needs, users, and technical fit during discovery.`,
    keywords: ['industries', 'sectors', 'verticals', 'industry experience', 'who do you work with', ...industryNames],
    url: '/industries/'
  },
  {
    id: 'pricing-overview',
    kind: 'pricing',
    title: 'Pricing and estimates',
    answer: 'A discovery consultation is free. Published starting points are $1.9k+ for focused websites, landing pages, audits, and brand refreshes; $9.9k+ for product builds, SaaS MVPs, mobile apps, and integrations; and $39.9k+ for dedicated teams, AI systems, cloud platforms, and growth programs. Final scope, timeline, and price are confirmed after discovery.',
    keywords: ['price', 'pricing', 'cost', 'budget', 'rates', 'quote', 'estimate', 'package', 'how much', 'free consultation', '1.9k', '9.9k', '39.9k'],
    url: '/pricing/'
  },
  {
    id: 'delivery-process',
    kind: 'process',
    title: 'How projects work',
    answer: 'Projects move through four practical stages: discovery, strategy and scope, focused design and development sprints, then launch and growth. Priorities, demos, QA, risks, and decisions stay visible throughout delivery.',
    keywords: ['process', 'how it works', 'delivery', 'project stages', 'discovery', 'strategy', 'sprints', 'qa', 'launch', 'workflow'],
    url: '/#steps'
  },
  {
    id: 'project-timeline',
    kind: 'process',
    title: 'Project timelines',
    answer: 'Timing depends on scope, integrations, content readiness, and review speed. A focused urgent engagement may fit a 2–4 week window, a standard project often targets 1–2 months, and larger or more flexible builds commonly run 2–4 months or longer. SynoIT confirms a realistic plan after discovery.',
    keywords: ['timeline', 'how long', 'duration', 'delivery time', 'deadline', 'weeks', 'months', 'urgent', 'start date', 'availability'],
    url: '/pricing/#pricing'
  },
  {
    id: 'dedicated-team',
    kind: 'service',
    title: 'Dedicated teams',
    answer: 'SynoIT can assemble and manage a focused team across product, design, engineering, QA, AI, DevOps, and growth. The team can own a delivery stream or work alongside your internal specialists with clear responsibilities and reporting.',
    keywords: ['dedicated team', 'staff augmentation', 'hire developers', 'extend team', 'outsourcing', 'specialists', 'managed team', 'engineering team'],
    url: '/dedicated-team/'
  },
  {
    id: 'existing-team',
    kind: 'faq',
    title: 'Working with your existing team',
    answer: 'Yes. SynoIT can lead an outcome end to end or integrate with your product, design, engineering, and marketing teams for focused support. Scope, ownership, communication, and handoffs are agreed before delivery starts.',
    keywords: ['existing team', 'internal team', 'our developers', 'collaborate', 'work together', 'staff support', 'handoff'],
    url: '/dedicated-team/'
  },
  {
    id: 'post-launch-support',
    kind: 'faq',
    title: 'Support after launch',
    answer: 'Yes. SynoIT provides maintenance, monitoring, performance improvements, feature development, SEO, automation, analytics, and ongoing growth support after launch. The right support model depends on product risk and release frequency.',
    keywords: ['support after launch', 'maintenance', 'monitoring', 'ongoing support', 'post launch', 'bug fixes', 'optimization', 'retainer'],
    url: '/contact/'
  },
  {
    id: 'portfolio',
    kind: 'project',
    title: 'Selected project work',
    answer: 'The published portfolio includes Luminous Engineering, a responsive corporate website; NextGen Commerce, an ecommerce platform with inventory, payments, and recommendations; and HealthTrack Pro, a cross-platform health product concept with tracking and consultation workflows. Additional client work may be confidential.',
    keywords: ['portfolio', 'projects', 'case studies', 'past work', 'clients', 'examples', 'experience', 'luminous engineering', 'nextgen commerce', 'healthtrack pro'],
    url: '/projects/'
  },
  {
    id: 'contact-synoit',
    kind: 'company',
    title: 'Contact SynoIT',
    answer: 'You can reach SynoIT at support@synoit.com or on WhatsApp at +65 8203 4346. Use the contact form in this chat to prepare a clear project enquiry, or visit the contact page for all options.',
    keywords: ['contact', 'email', 'phone', 'whatsapp', 'talk to human', 'specialist', 'sales', 'support@synoit.com', '+65 8203 4346', 'get quote', 'book call'],
    url: '/contact/'
  },
  {
    id: 'locations',
    kind: 'company',
    title: 'Delivery locations',
    answer: 'SynoIT lists a Singapore headquarters, a Bangladesh delivery hub, and collaboration coverage connected to London and San Francisco. The team supports global delivery and remote collaboration across time zones.',
    keywords: ['location', 'office', 'where are you', 'country', 'singapore', 'bangladesh', 'dhaka', 'london', 'san francisco', 'time zone', 'remote'],
    url: '/contact/#inside'
  },
  {
    id: 'start-project',
    kind: 'process',
    title: 'Starting a project',
    answer: 'Start by sharing the business goal, target users, current product or systems, desired features, timeline, and an approximate budget range. SynoIT will review the brief, clarify the unknowns, recommend a service path, and outline the next delivery step.',
    keywords: ['start project', 'get started', 'brief', 'requirements', 'next step', 'proposal', 'onboarding', 'consultation'],
    url: '/contact/'
  }
];

const serviceEntries: KnowledgeEntry[] = services.flatMap((service) => {
  const main: KnowledgeEntry = {
    id: `service-${service.slug}`,
    kind: 'service',
    title: service.shortTitle,
    answer: `${service.description} Typical scope includes ${service.deliverables.slice(0, 4).join(', ')}. Expected outcomes include ${service.outcomes.slice(0, 3).join(', ')}.`,
    keywords: [service.slug, service.title, service.category, service.proof, ...service.deliverables, ...service.outcomes],
    url: `/services/${service.slug}/`
  };

  const faqEntries = service.faqs.map((faq, index): KnowledgeEntry => ({
    id: `service-${service.slug}-faq-${index + 1}`,
    kind: 'faq',
    title: faq.q,
    answer: faq.a,
    keywords: [service.shortTitle, service.category, faq.q, ...service.deliverables],
    url: `/services/${service.slug}/#faq`
  }));

  return [main, ...faqEntries];
});

const technologyEntries: KnowledgeEntry[] = technologies.map((technology) => ({
  id: `technology-${technology.slug}`,
  kind: 'technology',
  title: technology.shortTitle,
  answer: `${technology.description} Typical work includes ${technology.deliverables.slice(0, 4).join(', ')}.`,
  keywords: [technology.slug, technology.title, technology.category, technology.proof, ...technology.deliverables, ...technology.outcomes],
  url: `/technologies/${technology.slug}/`
}));

const detailedTechnologyNames = new Set(technologies.flatMap((technology) => [technology.shortTitle.toLowerCase(), technology.slug.replaceAll('-', ' ')]));
const showcaseEntries: KnowledgeEntry[] = technologyShowcase
  .filter((technology) => !detailedTechnologyNames.has(technology.name.toLowerCase()))
  .map((technology) => ({
    id: `technology-stack-${technology.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    kind: 'technology',
    title: technology.name,
    answer: `${technology.name} is part of SynoIT’s ${technology.category} toolkit. We confirm whether it is the right fit after reviewing the product, existing stack, integrations, performance needs, and long-term maintenance plan.`,
    keywords: [technology.name, technology.category, 'technology', 'framework', 'tool', 'stack'],
    url: '/technologies/'
  }));

const industryEntries: KnowledgeEntry[] = industries.map((industry) => ({
  id: `industry-${industry.slug}`,
  kind: 'industry',
  title: industry.shortTitle,
  answer: `${industry.description} Relevant delivery can include ${industry.deliverables.slice(0, 4).join(', ')}.`,
  keywords: [industry.slug, industry.title, industry.category, industry.proof, ...industry.deliverables, ...industry.outcomes],
  url: `/industries/${industry.slug}/`
}));

const payload = {
  version: 1,
  assistant: 'Synova',
  source: 'SynoIT website',
  collections: {
    services: serviceNames,
    technologies: technologyNames,
    industries: industryNames
  },
  entries: [...commonEntries, ...serviceEntries, ...technologyEntries, ...showcaseEntries, ...industryEntries]
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff'
  }
});
