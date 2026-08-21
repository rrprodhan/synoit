export type ServiceCategory = 'Design' | 'Development' | 'AI Services' | 'Digital Marketing';

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  description: string;
  proof: string;
  deliverables: string[];
  processTitle: string;
  process: { title: string; text: string }[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: 'web-design',
    title: 'Websites That Look Premium and Convert Better.',
    shortTitle: 'Web Design',
    category: 'Design',
    description: 'At SynoIT, we design strategic, conversion-focused websites for startups, SMEs, and growing brands. Every page is built to strengthen trust, communicate value clearly, and move visitors toward action.',
    proof: 'Our website design services cover strategy, UX, interface design, and design systems so your team gets a complete solution, not just attractive screens.',
    deliverables: ['UX Research & Discovery', 'Sitemap & Wireframing', 'UI Design & Brand Alignment', 'Responsive Design', 'Interaction & Motion Design', 'Developer-Ready Handoff'],
    processTitle: 'Our Website Design Process',
    process: [
      { title: 'Discovery & Strategy', text: 'We learn your product, audience, and growth goals to define a focused design direction.' },
      { title: 'Structure & Wireframes', text: 'We shape content flow, key pages, and conversion paths before visual design begins.' },
      { title: 'Visual Design & Prototyping', text: 'We craft a refined interface and interactive prototype to validate the experience.' },
      { title: 'Handoff & Launch Support', text: 'SynoIT collaborates with development to preserve quality and launch with confidence.' }
    ],
    outcomes: ['Stronger first impression', 'Clearer conversion paths', 'Responsive page systems', 'Motion that supports usability'],
    faqs: [
      { q: 'Do you redesign existing websites?', a: 'Yes. We can audit your current site, keep what works, and rebuild the experience around clearer positioning, stronger usability, and conversion goals.' },
      { q: 'Can your design team work with our developers?', a: 'Yes. We provide organized files, reusable components, annotations, and implementation support.' }
    ]
  },
  {
    slug: 'web-development',
    title: 'Scalable Websites and Web Apps Built for Real Growth.',
    shortTitle: 'Web Development',
    category: 'Development',
    description: 'We design and build high-performance digital products for startups, SMBs, and enterprises. From business websites to complex platforms, SynoIT delivers secure, maintainable, and conversion-focused development.',
    proof: 'End-to-end web development services that help you launch faster, reduce technical risk, and scale with confidence.',
    deliverables: ['Custom Website Development', 'Web Application Development', 'Legacy Modernization', 'API & Third-Party Integrations', 'Security & Performance Optimization', 'Maintenance & Growth Support'],
    processTitle: 'Our Development Process',
    process: [
      { title: 'Discovery & Scoping', text: 'We map business objectives, features, user roles, and success metrics.' },
      { title: 'Solution Architecture', text: 'We define stack, data flow, integrations, and delivery plan.' },
      { title: 'Agile Development', text: 'Sprint-based development with regular demos, QA cycles, and progress visibility.' },
      { title: 'Launch & Iteration', text: 'Controlled release, monitoring, and data-driven improvements post-launch.' }
    ],
    outcomes: ['Fast, SEO-friendly websites', 'Secure application foundations', 'Clean integrations', 'Maintainable codebases'],
    faqs: [
      { q: 'Can you build both marketing sites and platforms?', a: 'Yes. We handle business websites, portals, dashboards, SaaS products, and custom workflows.' },
      { q: 'Do you support projects after launch?', a: 'Yes. We provide maintenance, performance improvements, monitoring, and roadmap support.' }
    ]
  },
  {
    slug: 'ui-ux-design',
    title: 'User-Centered Design That Feels Natural and Performs Better.',
    shortTitle: 'UI/UX Design',
    category: 'Design',
    description: 'We craft intuitive digital experiences for web and mobile products. SynoIT combines UX strategy, modern interface design, and product thinking to help teams reduce friction and improve conversion.',
    proof: 'From discovery to high-fidelity prototypes, we build UX foundations that support product growth.',
    deliverables: ['Discovery & UX Research', 'Information Architecture', 'UI Design Systems', 'Interactive Prototyping', 'Accessibility-First UI', 'Conversion Optimization'],
    processTitle: 'Our UI/UX Process',
    process: [
      { title: 'Product Discovery', text: 'Define user needs, business objectives, and measurable success criteria.' },
      { title: 'UX Architecture', text: 'Build page structure, task flows, and navigation logic around user intent.' },
      { title: 'UI Exploration', text: 'Create modern visuals that fit your brand and improve readability.' },
      { title: 'Validation', text: 'Test, refine, and hand off production-ready assets for implementation.' }
    ],
    outcomes: ['Reduced user friction', 'Reusable design systems', 'Accessible interfaces', 'Conversion-focused journeys'],
    faqs: [
      { q: 'Do you create clickable prototypes?', a: 'Yes. We build prototypes for stakeholder alignment, usability review, and smoother development handoff.' },
      { q: 'Can UX work happen before engineering?', a: 'Yes. UX discovery and prototyping are often the best way to reduce build risk before development starts.' }
    ]
  },
  {
    slug: 'product-audit',
    title: 'Turn Product Friction Into Growth Opportunities.',
    shortTitle: 'Product Audit',
    category: 'Design',
    description: 'SynoIT runs structured UX and product audits to uncover usability blockers, conversion leaks, and technical friction. We translate findings into a practical improvement roadmap your team can execute.',
    proof: 'Comprehensive audit outputs designed for immediate execution by product, design, and development teams.',
    deliverables: ['Usability Review', 'Issue Detection', 'Prioritized Roadmap', 'UI Consistency Audit', 'Conversion Funnel Review', 'Design Improvement Plan'],
    processTitle: 'Our Product Audit Process',
    process: [
      { title: 'Scope & Objectives', text: 'Define target journeys, user segments, and business metrics to evaluate.' },
      { title: 'Audit Execution', text: 'Review flows, screens, and interactions using UX and conversion criteria.' },
      { title: 'Findings & Severity', text: 'Document issues with evidence, priority score, and business impact.' },
      { title: 'Action Plan', text: 'Deliver a phased roadmap your team can implement quickly and confidently.' }
    ],
    outcomes: ['Prioritized product fixes', 'Conversion leak detection', 'Usability clarity', 'Better design consistency'],
    faqs: [
      { q: 'How long does a product audit take?', a: 'Most audits are completed in 1 to 3 weeks depending on product size and complexity.' },
      { q: 'Will you implement the recommendations?', a: 'We can deliver only the audit or continue into design and development execution.' }
    ]
  },
  {
    slug: 'landing-page-design',
    title: 'High-Converting Landing Pages for Campaign Growth.',
    shortTitle: 'Landing Page Design',
    category: 'Design',
    description: 'SynoIT builds strategic landing pages that align offer, audience, and messaging. We focus on clarity, trust signals, and conversion flow to maximize ROI from your paid and organic traffic.',
    proof: 'A complete landing-page design service built to support launch speed, message clarity, and conversion performance.',
    deliverables: ['Conversion-Focused Layouts', 'Fast Loading Experience', 'A/B Testing Ready', 'Copy + Visual Direction', 'CTA Optimization', 'Analytics Integration'],
    processTitle: 'Our Landing Page Workflow',
    process: [
      { title: 'Campaign Alignment', text: 'Clarify offer, audience, traffic source, and conversion objective.' },
      { title: 'Wireframe & Messaging', text: 'Shape content hierarchy and CTA flow around one primary action.' },
      { title: 'Visual Design', text: 'Create a polished responsive page that builds trust quickly.' },
      { title: 'Launch & Optimize', text: 'Prepare tracking, variants, and improvements based on campaign performance.' }
    ],
    outcomes: ['Higher campaign clarity', 'Sharper CTAs', 'Testing-ready sections', 'Better paid traffic ROI'],
    faqs: [
      { q: 'Can you write the landing page copy?', a: 'Yes. We align copy and visual hierarchy so each section supports the offer.' },
      { q: 'Can pages be built after design?', a: 'Yes. SynoIT can design, develop, launch, and optimize the page.' }
    ]
  },
  {
    slug: 'branding',
    title: 'Build a Brand People Remember and Trust.',
    shortTitle: 'Branding',
    category: 'Design',
    description: 'SynoIT helps businesses define positioning, clarify messaging, and create visual systems that scale. We turn fragmented brand assets into a cohesive identity that supports growth.',
    proof: 'Strategy-led branding services designed for clarity, consistency, and long-term market relevance.',
    deliverables: ['Visual Identity Design', 'Brand Guidelines', 'Brand Strategy', 'Messaging & Tone of Voice', 'Brand-to-Digital Implementation', 'Rebranding Support'],
    processTitle: 'Our Branding Process',
    process: [
      { title: 'Discovery', text: 'Understand business goals, audience, and market context.' },
      { title: 'Strategy', text: 'Define positioning, differentiation, and core messaging pillars.' },
      { title: 'Identity Design', text: 'Build visual language and communication style around strategy.' },
      { title: 'Rollout', text: 'Deliver guidelines and assets for practical cross-channel implementation.' }
    ],
    outcomes: ['Clearer positioning', 'Consistent visual language', 'Trust-building identity', 'Scalable brand guidelines'],
    faqs: [
      { q: 'How long does branding take?', a: 'Most projects take 2 to 8 weeks depending on scope, research depth, and revision cycles.' },
      { q: 'Can you apply the brand to our website?', a: 'Yes. We can translate the brand system into web pages, landing pages, and product interfaces.' }
    ]
  },
  {
    slug: 'mobile-app-design',
    title: 'Mobile Experiences Designed for Retention and Growth.',
    shortTitle: 'Mobile App Design',
    category: 'Design',
    description: 'SynoIT designs high-impact mobile interfaces for iOS and Android products. We focus on usability, visual clarity, and behavior-driven UX so your app feels intuitive from first tap.',
    proof: 'End-to-end mobile design services from research and UX architecture to polished UI systems.',
    deliverables: ['Platform-Native UX', 'Interaction & Gesture Design', 'Offline-Aware Experiences', 'User Flows & Information Architecture', 'Interactive Prototyping', 'Design Systems for Mobile'],
    processTitle: 'Our Mobile App Design Process',
    process: [
      { title: 'Research & Discovery', text: 'Understand users, use cases, and business goals behind the app.' },
      { title: 'Flow & Wireframing', text: 'Map journeys and screen-level structure before visual design.' },
      { title: 'UI Design & Prototype', text: 'Craft high-fidelity interfaces and interaction prototypes for validation.' },
      { title: 'Handoff & Support', text: 'Deliver development-ready assets and support implementation.' }
    ],
    outcomes: ['Platform-native patterns', 'Retention-focused flows', 'Gesture-aware interactions', 'Development-ready UI kits'],
    faqs: [
      { q: 'Do you design for both iOS and Android?', a: 'Yes. We design mobile experiences that respect platform guidelines and user expectations.' },
      { q: 'Can you prototype app interactions?', a: 'Yes. We create interactive prototypes to validate flows before development.' }
    ]
  },
  {
    slug: 'rebranding',
    title: 'Rebrand With Clarity, Not Guesswork.',
    shortTitle: 'Rebranding',
    category: 'Design',
    description: 'SynoIT helps growing companies refresh brand identity without losing core equity. We align positioning, messaging, and visual language so your brand matches where your business is going next.',
    proof: 'A structured rebranding service that balances strategic repositioning with practical implementation.',
    deliverables: ['Brand Evolution Strategy', 'Stakeholder Alignment', 'Market Repositioning', 'Visual Identity Refresh', 'Messaging Realignment', 'Rollout Support'],
    processTitle: 'Our Rebranding Process',
    process: [
      { title: 'Audit & Discovery', text: 'Evaluate current brand strengths, gaps, and market perception.' },
      { title: 'Positioning Reset', text: 'Define differentiated positioning and core messaging principles.' },
      { title: 'Identity Redesign', text: 'Build updated visual and verbal identity systems based on strategy.' },
      { title: 'Transition & Rollout', text: 'Plan and execute rebrand adoption across channels and teams.' }
    ],
    outcomes: ['Sharper market fit', 'Aligned stakeholders', 'Modernized identity', 'Confident rollout'],
    faqs: [
      { q: 'How long does rebranding take?', a: 'Most rebranding projects take 4 to 12 weeks depending on scope and stakeholder alignment.' },
      { q: 'Can we keep parts of our current brand?', a: 'Yes. We define what to keep, refine, and rebuild to protect useful equity.' }
    ]
  },
  {
    slug: 'pitch-deck-design',
    title: 'Investor Pitch Decks Built to Explain, Convince, and Close.',
    shortTitle: 'Pitch Deck Design',
    category: 'Design',
    description: 'SynoIT designs pitch decks that transform complex ideas into clear, compelling narratives. We help startups and growth-stage teams present traction, vision, and business potential with confidence.',
    proof: 'From message strategy to polished slide design, we create decks ready for investors, partners, and high-stakes presentations.',
    deliverables: ['Narrative-First Storytelling', 'Data Visualization', 'Investor Ready', 'Messaging Refinement', 'Branded Slide Design', 'Fundraising & Sales Decks'],
    processTitle: 'Our Pitch Deck Process',
    process: [
      { title: 'Discovery & Brief', text: 'Capture business model, audience, goals, and available data.' },
      { title: 'Story Structure', text: 'Shape a persuasive narrative from problem to traction and ask.' },
      { title: 'Design Execution', text: 'Create branded slides with clear hierarchy and visual rhythm.' },
      { title: 'Review & Finalization', text: 'Refine the deck until it is presentation-ready.' }
    ],
    outcomes: ['Clearer fundraising story', 'Investor-ready visuals', 'Better data storytelling', 'Sharper value proposition'],
    faqs: [
      { q: 'Can you improve an existing deck?', a: 'Yes. We can restructure the narrative, sharpen messaging, and redesign the slides.' },
      { q: 'Do you design sales decks too?', a: 'Yes. We create decks for fundraising, partnerships, sales, and strategic presentations.' }
    ]
  },
  {
    slug: 'software-development',
    title: 'Software Products Built for Scale, Stability, and Speed.',
    shortTitle: 'Software Development',
    category: 'Development',
    description: 'SynoIT designs and develops custom software products that solve operational challenges, improve team productivity, and accelerate business growth. We cover product strategy, engineering, integration, and long-term support.',
    proof: 'A complete software development lifecycle from discovery and architecture to deployment and optimization.',
    deliverables: ['Custom Product Development', 'System Integration', 'Cloud-Native Engineering', 'Security & Compliance', 'Legacy Modernization', 'Maintenance & Support'],
    processTitle: 'Our Software Development Process',
    process: [
      { title: 'Discovery & Planning', text: 'Define objectives, priorities, and project scope with your stakeholders.' },
      { title: 'Architecture & Design', text: 'Establish system design, data structures, and integration requirements.' },
      { title: 'Agile Implementation', text: 'Sprint-based development with QA cycles and continuous feedback.' },
      { title: 'Launch & Growth', text: 'Production rollout, observability setup, and ongoing optimization.' }
    ],
    outcomes: ['Custom operational systems', 'Secure data handling', 'Integrated workflows', 'Long-term product support'],
    faqs: [
      { q: 'Can you modernize legacy software?', a: 'Yes. We upgrade old systems into maintainable modern platforms with minimal disruption.' },
      { q: 'Do you build internal tools?', a: 'Yes. We build portals, dashboards, workflow systems, and customer-facing software.' }
    ]
  },
  {
    slug: 'webflow-development',
    title: 'Webflow Websites That Launch Fast and Scale Cleanly.',
    shortTitle: 'Webflow Development',
    category: 'Development',
    description: 'SynoIT helps brands move from static pages to dynamic Webflow experiences. We combine conversion-focused design, clean CMS structure, and performance-ready builds for marketing and growth teams.',
    proof: 'End-to-end Webflow execution from page strategy and UI implementation to CMS setup and launch support.',
    deliverables: ['Custom Webflow Builds', 'Rapid Deployment', 'CMS Architecture', 'Animation & Interactions', 'Performance Optimization', 'Maintenance & Iteration'],
    processTitle: 'Our Webflow Workflow',
    process: [
      { title: 'Discovery & Scope', text: 'Define goals, page requirements, and conversion targets.' },
      { title: 'Design Translation', text: 'Translate approved UI into responsive, component-based Webflow builds.' },
      { title: 'CMS & Content Setup', text: 'Configure collections, templates, and editor-friendly content workflows.' },
      { title: 'Launch & Optimization', text: 'Publish, QA, and optimize based on analytics and campaign performance.' }
    ],
    outcomes: ['Fast launch cycles', 'Editor-friendly CMS', 'Performance-focused pages', 'Campaign-ready iterations'],
    faqs: [
      { q: 'How long does Webflow development take?', a: 'Most projects are completed in 1 to 4 weeks, depending on page count and CMS complexity.' },
      { q: 'Can you maintain Webflow sites?', a: 'Yes. We support updates, new pages, CMS changes, and optimization.' }
    ]
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile Apps That Engage Users and Drive Growth.',
    shortTitle: 'Mobile App Development',
    category: 'Development',
    description: 'SynoIT builds high-performance mobile products for startups and enterprises. From MVP launches to large-scale platforms, we deliver smooth UX, reliable architecture, and scalable backend connectivity.',
    proof: 'Complete mobile product development from discovery and architecture to release and optimization.',
    deliverables: ['Cross-Platform Development', 'Native App Development', 'Backend & API Integration', 'Mobile UX/UI Implementation', 'Security & Stability', 'Release & Support'],
    processTitle: 'Our Mobile Development Process',
    process: [
      { title: 'Discovery & Roadmap', text: 'Define user needs, core features, and release priorities.' },
      { title: 'Architecture & Setup', text: 'Establish app structure, backend integration, and technical foundations.' },
      { title: 'Agile Development', text: 'Sprint-based development with QA cycles and regular progress demos.' },
      { title: 'Launch & Optimization', text: 'Store deployment, monitoring, and iterative improvements post-release.' }
    ],
    outcomes: ['Reliable app foundations', 'Smooth mobile UX', 'Backend connectivity', 'Store launch support'],
    faqs: [
      { q: 'Do you build cross-platform apps?', a: 'Yes. We can build cross-platform or native apps based on product needs.' },
      { q: 'Can you handle backend APIs?', a: 'Yes. We build or integrate secure APIs, auth, cloud services, and analytics.' }
    ]
  },
  {
    slug: 'mvp-development',
    title: 'Launch Early. Validate Fast. Build With Confidence.',
    shortTitle: 'MVP Development',
    category: 'Development',
    description: 'SynoIT helps startups and product teams build MVPs that prove demand quickly. We focus on core functionality, rapid delivery, and real user feedback to reduce risk before scaling.',
    proof: 'A practical MVP delivery model focused on speed, learning, and scalable technical foundations.',
    deliverables: ['Rapid MVP Build', 'Hypothesis Validation', 'Iterate & Scale', 'Feature Prioritization', 'Core Integrations', 'Feedback & Metrics Setup'],
    processTitle: 'Our MVP Delivery Process',
    process: [
      { title: 'Discovery & Scope', text: 'Define target users, core problem, and minimum success criteria.' },
      { title: 'MVP Blueprint', text: 'Prioritize features, user flows, and technical approach for fast execution.' },
      { title: 'Build & Test', text: 'Sprint-based development with QA, demo checkpoints, and fast refinements.' },
      { title: 'Launch & Learn', text: 'Go live, collect insights, and shape the next release roadmap from data.' }
    ],
    outcomes: ['Focused first release', 'Faster market validation', 'Core integrations', 'Metrics-led roadmap'],
    faqs: [
      { q: 'How fast can an MVP launch?', a: 'Timelines vary by scope, but focused MVPs can often reach a usable first release in weeks.' },
      { q: 'Can the MVP scale later?', a: 'Yes. We design the foundation so the product can grow after validation.' }
    ]
  },
  {
    slug: 'chatbot-development',
    title: 'AI Chatbots That Automate Support and Drive Conversions.',
    shortTitle: 'Chatbot Development',
    category: 'AI Services',
    description: 'SynoIT builds conversational AI solutions for customer support, lead qualification, and workflow automation. We design bot journeys that feel natural while delivering measurable business outcomes.',
    proof: 'End-to-end chatbot development services from strategy and conversation design to integration and optimization.',
    deliverables: ['AI-Powered Conversations', '24/7 Support', 'Multi-Channel Integration', 'Conversation Flow Design', 'CRM & Knowledge Integration', 'Analytics & Optimization'],
    processTitle: 'Our Chatbot Development Process',
    process: [
      { title: 'Use-Case Discovery', text: 'Identify high-impact chatbot scenarios for your business and users.' },
      { title: 'Flow & Logic Design', text: 'Create conversation paths, fallback logic, and escalation workflows.' },
      { title: 'Integration & Launch', text: 'Integrate with your platforms and deploy across selected channels.' },
      { title: 'Monitor & Improve', text: 'Measure outcomes and refine responses using real conversation data.' }
    ],
    outcomes: ['Faster first response', 'Qualified leads', 'Knowledge-grounded answers', 'Escalation workflows'],
    faqs: [
      { q: 'Can chatbots connect to our CRM?', a: 'Yes. We connect bots with CRM, docs, websites, support systems, and internal tools.' },
      { q: 'Can humans take over conversations?', a: 'Yes. We design escalation paths and human-in-the-loop controls when needed.' }
    ]
  },
  {
    slug: 'ai-automation',
    title: 'Automate Repetitive Work With Practical AI.',
    shortTitle: 'AI Automation',
    category: 'AI Services',
    description: 'We design and deploy AI automation workflows that reduce manual effort, improve speed, and increase operational consistency across your business.',
    proof: 'End-to-end AI automation capabilities from workflow planning to deployment and optimization.',
    deliverables: ['Workflow Mapping', 'Tool Integration', 'AI Task Handling', 'Routing Logic', 'Approval Workflows', 'Monitoring & Tuning'],
    processTitle: 'Our Automation Process',
    process: [
      { title: 'Discovery', text: 'Audit current operations and identify repetitive work streams.' },
      { title: 'Architecture', text: 'Design robust automation logic with governance and fallback paths.' },
      { title: 'Implementation', text: 'Build and integrate automation flows into your real environment.' },
      { title: 'Optimization', text: 'Monitor outcomes and continuously tune performance and accuracy.' }
    ],
    outcomes: ['Reduced manual effort', 'Consistent operations', 'Connected tools', 'Governed AI workflows'],
    faqs: [
      { q: 'What tasks can AI automate?', a: 'Classification, summarization, routing, response drafting, reporting, and structured workflow steps are common candidates.' },
      { q: 'Can automations include approvals?', a: 'Yes. We add governance, permissions, and fallback paths where business risk requires control.' }
    ]
  },
  {
    slug: 'ai-agent',
    title: 'AI Agents That Handle Real Business Tasks.',
    shortTitle: 'AI Agent Development',
    category: 'AI Services',
    description: 'We build intelligent AI agents for sales, support, operations, and internal productivity with secure data handling and human-in-the-loop control.',
    proof: 'Custom AI agents tailored to your workflows, domain, and compliance needs.',
    deliverables: ['Support Agents', 'Operations Agents', 'Knowledge Agents', 'Tool-Using Workflows', 'Memory Strategy', 'Guardrails & Evaluation'],
    processTitle: 'Our AI Agent Process',
    process: [
      { title: 'Use-Case Definition', text: 'Define task boundaries, data sources, and success criteria for your agent.' },
      { title: 'Architecture & Guardrails', text: 'Build secure orchestration, memory strategy, and quality safeguards.' },
      { title: 'Development & Testing', text: 'Implement agent flows, integrate tools, and validate output quality.' },
      { title: 'Deployment & Tuning', text: 'Launch with observability and continuously optimize behavior over time.' }
    ],
    outcomes: ['Task-specific agents', 'Tool orchestration', 'Human oversight', 'Observable performance'],
    faqs: [
      { q: 'Can agents use private data?', a: 'Yes. We design retrieval and permission layers so agents can work with approved internal sources.' },
      { q: 'How do you reduce AI risk?', a: 'We add guardrails, scope boundaries, evaluation, logging, and human review where appropriate.' }
    ]
  },
  {
    slug: 'ai-saas',
    title: 'Build and Launch AI SaaS Products Faster.',
    shortTitle: 'AI SaaS',
    category: 'AI Services',
    description: 'We help founders and businesses design, develop, and scale AI-powered SaaS products with strong UX, secure architecture, and growth-ready foundations.',
    proof: 'Complete AI SaaS execution support from product definition to launch and scaling.',
    deliverables: ['Product Strategy', 'SaaS Architecture', 'AI Feature Engineering', 'Billing-Ready Foundations', 'Analytics', 'Launch Support'],
    processTitle: 'Our AI SaaS Process',
    process: [
      { title: 'Product Discovery', text: 'Define audience, business model, and core AI product scope.' },
      { title: 'MVP Delivery', text: 'Build a lean but robust first release to validate market demand quickly.' },
      { title: 'Launch & Growth', text: 'Deploy with observability, analytics, and go-to-market support.' },
      { title: 'Scale & Optimize', text: 'Improve retention, performance, and monetization with ongoing releases.' }
    ],
    outcomes: ['Market-ready AI products', 'Scalable SaaS architecture', 'AI copilots and search', 'Growth-ready analytics'],
    faqs: [
      { q: 'Can SynoIT start from just an idea?', a: 'Yes. We can help shape positioning, product scope, MVP roadmap, and launch plan.' },
      { q: 'Do you build AI features into SaaS?', a: 'Yes. We implement AI search, copilots, recommendations, and automation features.' }
    ]
  },
  {
    slug: 'ai-integration',
    title: 'Connect AI to Your Existing Product Stack.',
    shortTitle: 'AI Integration',
    category: 'AI Services',
    description: 'We integrate AI capabilities into your applications, internal tools, and workflows without disrupting your current architecture.',
    proof: 'AI integration services designed for production stability, security, and business value.',
    deliverables: ['LLM & API Integration', 'Data Grounding', 'Governance & Safety', 'Prompt Systems', 'Model Routing', 'Monitoring'],
    processTitle: 'Our AI Integration Process',
    process: [
      { title: 'System Review', text: 'Assess architecture, data flow, and integration constraints.' },
      { title: 'Integration Blueprint', text: 'Define service boundaries, model routing, and reliability strategy.' },
      { title: 'Implementation', text: 'Build adapters, prompts, and governance layer into your platform.' },
      { title: 'Monitoring', text: 'Track output quality, performance, and unit economics post-launch.' }
    ],
    outcomes: ['AI inside current tools', 'Grounded outputs', 'Permission-aware flows', 'Production monitoring'],
    faqs: [
      { q: 'Can you use our own documents?', a: 'Yes. We can ground AI responses in approved docs, product data, and knowledge bases.' },
      { q: 'Can this work with our existing app?', a: 'Yes. We design integrations around your current architecture and release constraints.' }
    ]
  },
  {
    slug: 'cms-development',
    title: 'CMS Platforms That Empower Teams to Publish Faster.',
    shortTitle: 'CMS Development',
    category: 'Development',
    description: 'SynoIT builds custom CMS solutions for growing businesses that need speed, flexibility, and control. We design editor-friendly workflows so marketing and content teams can publish without engineering bottlenecks.',
    proof: 'A complete CMS implementation approach from strategy and architecture to rollout and optimization.',
    deliverables: ['Editor-Friendly Experience', 'Role-Based Access', 'Headless Architecture', 'Content Model Design', 'System Integrations', 'Maintenance & Optimization'],
    processTitle: 'Our CMS Delivery Process',
    process: [
      { title: 'Discovery & Audit', text: 'Assess current content workflows, pain points, and growth requirements.' },
      { title: 'CMS Architecture', text: 'Define content models, governance rules, and integration points.' },
      { title: 'Implementation', text: 'Build the CMS and configure editorial workflows for daily operations.' },
      { title: 'Launch & Enablement', text: 'Train teams, document standards, and support post-launch optimization.' }
    ],
    outcomes: ['Faster publishing', 'Better content governance', 'Headless flexibility', 'Lower engineering dependency'],
    faqs: [
      { q: 'How long does CMS development take?', a: 'Typical delivery ranges from 3 to 10 weeks depending on complexity and integrations.' },
      { q: 'Can you connect CMS with other systems?', a: 'Yes. We integrate CMS platforms with CRM, analytics, search, and external services.' }
    ]
  },
  {
    slug: 'cloud-app-development',
    title: 'Cloud Applications Built for Reliability and Rapid Growth.',
    shortTitle: 'Cloud App Development',
    category: 'Development',
    description: 'SynoIT engineers cloud-native applications that are secure, scalable, and ready for real-world traffic. We combine modern architecture, automation, and observability to help teams ship faster with confidence.',
    proof: 'Comprehensive cloud application development services from architecture to production optimization.',
    deliverables: ['Cloud Architecture Design', 'Observability & Monitoring', 'Cloud Security Engineering', 'Migration & Modernization', 'CI/CD & Automation', 'Performance & Cost Optimization'],
    processTitle: 'Our Cloud Development Process',
    process: [
      { title: 'Assessment & Planning', text: 'Define requirements, constraints, and cloud strategy aligned with business goals.' },
      { title: 'Architecture & Build', text: 'Implement resilient cloud app foundations and service integrations.' },
      { title: 'Automation & Security', text: 'Set up CI/CD, governance, and security controls for production confidence.' },
      { title: 'Operate & Optimize', text: 'Monitor app health and optimize performance and cost over time.' }
    ],
    outcomes: ['Scalable architecture', 'Improved reliability', 'Secure deployments', 'Observable systems'],
    faqs: [
      { q: 'Which cloud platforms do you support?', a: 'We design for AWS, Azure, or GCP based on your business needs.' },
      { q: 'How long does cloud app development take?', a: 'Timelines vary by scope, but most projects launch initial versions in 6 to 16 weeks.' }
    ]
  },
  {
    slug: 'social-media-marketing',
    title: 'Build Influence, Not Just Followers.',
    shortTitle: 'Social Media Marketing',
    category: 'Digital Marketing',
    description: 'SynoIT creates story-led social media strategies that grow your visibility, strengthen community trust, and generate measurable business outcomes across the platforms your audience uses every day.',
    proof: 'Full-service social media management for startups, growing brands, and established businesses.',
    deliverables: ['Social Strategy Planning', 'Content Creation', 'Community Management', 'Paid Social Campaigns', 'Platform Growth Management', 'Reporting & Optimization'],
    processTitle: 'Our Social Media Process',
    process: [
      { title: 'Discovery & Audit', text: 'We assess your brand voice, channel performance, and audience behavior.' },
      { title: 'Strategy & Calendar', text: 'We create channel strategy, content pillars, posting cadence, and campaign plans.' },
      { title: 'Execution & Engagement', text: 'We publish content, manage engagement, and run paid promotions where needed.' },
      { title: 'Measure & Scale', text: 'We review outcomes, optimize creatives, and scale what drives results.' }
    ],
    outcomes: ['Stronger brand visibility', 'Better audience engagement', 'Campaign accountability', 'Platform-specific growth'],
    faqs: [
      { q: 'Which platforms do you support?', a: 'We support Facebook, Instagram, LinkedIn, X, YouTube, and other channels based on your audience.' },
      { q: 'Can you handle paid campaigns?', a: 'Yes. We plan and manage paid social for lead generation, retargeting, and acquisition.' }
    ]
  },
  {
    slug: 'seo',
    title: 'SEO That Turns Rankings Into Revenue.',
    shortTitle: 'Search Engine Optimization',
    category: 'Digital Marketing',
    description: 'SynoIT delivers growth-focused SEO strategies for businesses and agencies. We combine technical SEO, content optimization, authority building, and AI-search visibility to increase qualified traffic, leads, and sales.',
    proof: 'Comprehensive SEO services designed to improve visibility across traditional search and AI-powered discovery platforms.',
    deliverables: ['Technical SEO', 'Content SEO Strategy', 'Authority Building', 'Local & Maps SEO', 'Ecommerce SEO', 'AI & GEO Visibility'],
    processTitle: 'Our SEO Process',
    process: [
      { title: 'Audit & Benchmark', text: 'Analyze technical health, keyword footprint, and competitor landscape.' },
      { title: 'Strategy & Prioritization', text: 'Set a phased roadmap across on-page, technical, and off-page SEO opportunities.' },
      { title: 'Execution', text: 'Implement optimization tasks and publish search-focused content consistently.' },
      { title: 'Reporting & Optimization', text: 'Track rankings, traffic, leads, and iterate strategy based on performance data.' }
    ],
    outcomes: ['Technical SEO foundations', 'Search-intent content', 'Authority growth', 'AI search visibility'],
    faqs: [
      { q: 'Do you optimize for AI search?', a: 'Yes. We include generative engine visibility alongside traditional SEO work.' },
      { q: 'Do you handle local SEO?', a: 'Yes. We optimize Google Business Profile, maps visibility, and local ranking signals.' }
    ]
  }
];

export const categories = ['Design', 'Development', 'AI Services', 'Digital Marketing'] as const;

export const featuredServices = services.filter((service) =>
  ['web-development', 'ui-ux-design', 'mobile-app-development', 'software-development', 'branding', 'cloud-app-development'].includes(service.slug)
);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
