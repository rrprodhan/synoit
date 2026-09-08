# SynoIT SEO and conversion audit

Date: 8 September 2026. Target: https://www.synoit.com/. Scope: live public pages, local Astro source and generated build. Changes are local and have not been deployed. Search rankings and AI recommendations are not guaranteed.

## Findings and changes

| Priority | Evidence before | Local change | Practical effect |
| --- | --- | --- | --- |
| High | `https://synoit.com/` responds with a 308 redirect to `https://www.synoit.com/`, while layout canonicals, structured data and sitemap configuration used the non-www host. | Matched site configuration, both layouts and all source schema URLs to the actual www destination. | Removes conflicting canonical-host signals after deployment. Hosting redirects were not changed. |
| High | Live `/robots.txt` returned 404 after the host redirect. | Added `public/robots.txt` with a general crawl allowance and the www sitemap-index URL. | Makes crawl policy and sitemap discovery explicit. A missing robots file alone was not proof of blocked indexing. |
| High | Homepage title and hero described a broad digital product studio across 22 services, without emphasizing the owner's three actual priorities. | Title, description, H1, opening copy, featured links, footer and Organization description now prioritize landing pages, portfolio websites and business automation. | Aligns page language and navigation with the intended customers and services. |
| High | No dedicated portfolio development URL existed. | Added `/services/portfolio-website-development/` through the existing service data/template, with deliverables, editing choices, process and FAQs. Navigation, footer, chat service data and sitemap derive from the same service data. | Creates an indexable page for portfolio website purchase intent. |
| High | Landing page page focused on design and generalized ROI wording. | Preserved `/services/landing-page-design/`; renamed the offer to design and development and added specific scope, enquiry connections, development details and pricing/dependency answers. | Covers implementation intent without creating a competing duplicate URL. |
| High | AI automation page gave generic workflow claims and two short FAQs. | Added concrete lead intake, support drafting, document processing and reporting use cases, plus approval, pilot selection, cost and rules-versus-AI explanations. | Gives buyers enough context to qualify a real automation project. |
| High | Homepage displayed 120+ specialists, 500+ delivered projects, 98% satisfaction, 24/7 coverage and 10+ years without supporting evidence in the repository. | Replaced homepage metric claims with the project approach and service choices; removed the duplicate 120+/500+ statement from `WhyChoose.astro`. | Avoids presenting unsupported metrics as proof. No new client results or testimonials were invented. |
| Medium | Service CTAs opened an empty email directly. Contact form said “Send message” but posted to `mailto:`. | Service CTAs pass the chosen service to contact. The form identifies its email-app behavior, selects the requested service, otherwise starts with “Not sure yet”, and prepares an encoded subject/body. | Clarifies what happens next; still requires an email app and user pressing send. No backend submission or delivery guarantee was added. |
| Medium | Numeric typography was reused for new homepage labels. | Scoped text sizing for the “Your next step”, Website and Automation labels. | Keeps the revised copy suitable for responsive cards. |

## Site structure and on-page review

The final build generates 65 HTML pages, with the sitemap integration retained. The source includes service, industry and technology directories and two editorial articles. A full generated-page inventory with titles, descriptions, H1 counts and canonical URLs is saved in `reports/seo-page-inventory.json`.

Priority-page content changes:

- **Homepage:** “Landing Pages, Portfolio Websites & AI Automation | SynoIT”; one H1 naming the three services, descriptive links to their service pages, plain explanations of websites and repetitive work.
- **Landing page service:** existing URL retained; title and H1 identify both design and development. New scope sections explain what can be included and FAQs explain quote inputs and when a full website is more suitable.
- **Portfolio service:** new self-contained page describes who it serves, case studies, contact paths, static versus CMS editing, launch inputs and quote factors.
- **AI automation:** specific business workflow examples, human review, integration constraints and recurring tool costs; no claimed time-saving percentages.
- **Contact:** metadata focuses on the three primary services, opening text asks for practical requirements, and form behavior is explicit.
- **Blog and pricing:** live content was collected and reviewed. Existing article content and pricing tiers were not rewritten without a substantiated editorial or commercial reason.

Strengths retained: static HTML output, English language declaration, canonical links, titles/descriptions, Open Graph and Twitter metadata, descriptive image alternatives, lazy loading for secondary visuals, a sitemap integration and structured service/organization/article data. Existing schema parses after host updates. FAQ content is useful to readers; this audit does not promise FAQ rich results.

## Keyword and content opportunities

These are **intent hypotheses**, not measured search volumes, difficulty scores or current rankings. GSC was not connected, so there is no click, impression, CTR, position, cannibalization or traffic-decay analysis.

| Intent cluster | Primary page | Supporting content to publish when examples are available |
| --- | --- | --- |
| landing page design and development; custom landing page for small business | `/services/landing-page-design/` | “Landing page or full website: what does a new service business need?” Include an actual scope comparison, costs when approved, and enquiry examples. |
| portfolio website development; freelancer or consultant portfolio website | `/services/portfolio-website-development/` | “What to include in a portfolio case study” with a real approved project and a breakdown of contribution and results. |
| AI automation services for small businesses; automate repetitive admin | `/services/ai-automation/` | “Which business task should you automate first?” Use an actual pilot with task frequency, baseline handling time, exception rate and running costs. |
| enquiry routing; CRM follow-up automation; support reply drafts | `/services/ai-automation/` initially | Separate use-case pages only when they can show distinct requirements, integrations, limitations and substantiated examples. |

Avoid mass-producing near-identical country/city service pages. International targeting needs actual service availability, region-specific buying context and trustworthy evidence; a list of wealthy countries is not adequate content differentiation. Keep one primary URL per intent, then use descriptive internal links from relevant articles and projects.

## Search comparison and limitations

Firecrawl searches sampled three results for each of two queries. They are a small search sample, not a fixed-country rank report.

- **“landing page development services small business”** returned [Canva's landing-page builder](https://www.canva.com/create/landing-pages/), [Zapier's landing-page builder comparison](https://zapier.com/blog/best-landing-page-builders/) and [Leadpages' local-service builder article](https://leadpages.com/blog/best-landing-page-builders-for-local-services-2026). Canva directly presents DIY creation. This suggests the page must make the custom implementation offer clear to distinguish it from software-builder intent. It does **not** establish that these sites outrank SynoIT in every market or why an algorithm ranks them.
- **“AI automation services small business agency”** produced noisy results about starting an agency, plus community/social content. This sample was inadequate for identifying direct service competitors. No competitor authority or ranking conclusions are drawn from it.
- SynoIT was not present in those two returned three-result samples. This is not an AI answer citation baseline, brand visibility score or share-of-voice measurement.

The invoked GEO and MaxAEO guidance was reviewed for crawl access, self-contained service explanations and evidence quality. A complete 10–15-prompt, multi-intent answer-engine citation baseline was **not performed**. No before/after AI-visibility improvement is claimed. The local content work should be treated as a discoverability foundation until actual deployment and measurement.

## Data-source availability

- **Firecrawl:** authenticated and used for site map, homepage, landing page, AI automation, contact, pricing, blog and search samples. Raw evidence is saved under `.firecrawl/seo-*` (intentionally ignored by Git).
- **GSC SEO & Content Planner:** returned the authorized SynoIT organization, then `GSC_NOT_CONNECTED`. Connect Search Console in [SMEPost integrations](https://smepost.io/org/vgrCyhtEZ8c3W1Wcvn06/integrations) to establish the real query/page baseline. No organization ID is needed for manual setup.
- **SEOmatic:** no callable connector tools available in this session. Its Search Console, backlink and traffic-decay audit could not be completed. Public-page/source review continued independently. Connector setup: https://seomatic.ai/developers/mcp.
- No paid search-volume estimates, backlink data, conversion analytics or Core Web Vitals field data were available. No fabricated audit score is supplied.

## Validation

- `npm run build`: succeeds, 65 pages generated and sitemap-index created.
- Generated HTML checked across every page: exactly one H1; nonempty title and description; unique titles and www canonical URLs; JSON-LD parseable; all local `<a>` target paths resolve to generated pages/assets.
- `git diff --check`: passes.
- Local browser checks: portfolio page at 390px viewport has `scrollWidth = 390`; contact URL selects “Portfolio Website Development”, preserves a clean canonical without query parameters, and shows the email-app disclosure. No email or WhatsApp message was sent.
- No live deployment, live reindex request or new analytics integration was performed. Test the hosted form handoff and production redirects again after deployment.

## Remaining priorities

1. **Confirm trust claims:** verify existing office addresses/global-hub claims, project examples, team claims and any testimonials throughout the remaining site against real business records. This pass removed the prominent unsupported homepage metrics, not every claim across every page.
2. **Provide conversion evidence:** add approved actual website screenshots and case studies for the three services; publish results only with a documented baseline, measurement period and client permission.
3. **Connect GSC and track enquiries:** establish service-page impressions/clicks and measure actual enquiries. A site-wide analytics implementation needs the owner's chosen platform and privacy configuration. Avoid treating a mailto click as a successfully delivered lead.
4. **Review after deployment:** confirm the new robots file, www sitemap and canonical URLs are served; request indexing for the new portfolio URL in the correct Search Console property. Review trends after enough data accumulates rather than interpreting one day as a result.
5. **Improve social image compatibility:** the existing default image is SVG (`/og.svg`). Create and verify a branded raster share image and update default metadata as a follow-up.
6. **Measure actual performance:** homepage has substantial animation and third-party script behavior. Run mobile Lighthouse and review real-user CWV when available; no performance score is claimed by this audit.
7. **Prioritize useful editorial proof:** current CMS/software-model articles are broader than the owner's main offer. The proposed small-business decision guides should be written around actual expertise and examples, not published merely to increase page count.

## Sources and rerun inputs

Live pages collected on 8 September 2026:

- https://www.synoit.com/ — title, opening content, claims, navigation.
- https://www.synoit.com/services/landing-page-design/ — design-oriented service scope.
- https://www.synoit.com/services/ai-automation/ — existing workflows and FAQs.
- https://www.synoit.com/contact/ — enquiry paths and mailto form.
- https://www.synoit.com/pricing/ — existing pricing/estimator context.
- https://www.synoit.com/blog/ — current editorial coverage.
- https://synoit.com/ and https://synoit.com/robots.txt — direct HTTP headers verified host redirect and robots 404.

Rerun: `firecrawl-seo-audit`; site `https://www.synoit.com/`; keywords `landing page development services small business`, `portfolio website development`, `AI automation services small business`; output Markdown plus generated-page JSON inventory. Compare deployed markup to this report and load authorized GSC data when connected.
