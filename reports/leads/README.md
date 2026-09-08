# SynoIT prospect pipeline

Checked: 8 September 2026. [Live Google Sheet](https://docs.google.com/spreadsheets/d/1cHcoBJzON5haVRjGVoEkjH8T0XGdC6fEl23efhuzNp8/edit).

## Delivered

90 distinct research records in two tabs: **Website Prospects (32)** and **AI Automation Prospects (58)**. Each has 32 columns for source evidence, public business contacts, service fit, qualification and follow-up. Local TSV and JSON exports mirror the records. Frozen headers, two frozen identity columns and filters support tracking in Sheets.

This is a finite research batch across 22 countries, not an exhaustive census. Website candidates cover Canada, Ireland, Singapore, the UK and the US. Automation research covers:

Australia, Austria, Belgium, Canada, Denmark, Finland, France, Germany, Ireland, Italy, Luxembourg, Netherlands, New Zealand, Norway, Portugal, Singapore, Spain, Sweden, Switzerland, UAE, United Kingdom, United States.

## Evidence and qualification

- Website candidates originate from public business directories and business profiles. An omitted website link is a research signal, not proof that no website exists. Directory records and contacts can be stale. Exact-name searches were reviewed where usable; unresolved checks are labelled in Notes.
- Five retained businesses received live Google profile checks: London's Latrobe, Crockett Business Services, Bargate Services, Amory Nails-Art and Nice Noodle. Amory's website field links to WhatsApp. London's has an existing Vagaro booking page. These are disclosed so outreach does not falsely claim they lack booking tools.
- Nice Noodle has an August 2026 opening-news source and a matching Google location. This establishes a reported new opening, not legal incorporation. No registry-verified recently incorporated cohort was obtained. Other formation dates are unknown or explicitly attributed to directories.
- Automation contacts are published on company websites. Observed processes and proposed solutions occupy separate fields. Existing portals, chat and enterprise systems can reduce fit. No company has expressed buying intent in this research.
- Contact deliverability, budgets, decision-makers and current operating status have not all been verified. Phone country codes and business locations do not establish personal nationality. Blank cells mean not obtained, not absent.
- Records marked **Review first** have a stronger website/profile signal. **Discovery** has a concrete observed workflow to discuss. **Research** needs further verification. **Lower fit** identifies enterprise prospects with likely procurement/system barriers. These are qualitative priorities, not measured conversion scores.

## CRM use

All records start at Not contacted. Assign an Owner, confirm the website and contact channel, then record First contact, Last contact, Next follow-up, Reply or outcome, Budget and Currency. Suggested stages: Research, Qualified, Contacted, Replied, Discovery booked, Proposal sent, Won, Lost, Do not contact. The current stage is free text; no validation or automated outreach is configured.

Do not contact is initially Not assessed; this does not indicate permission to send marketing. Record contact preferences and suppression requests before outreach. No emails, WhatsApp messages or other outreach were sent.

For a discovery call, confirm the current website/tools, enquiry or task volume, time spent, exceptions, decision-maker, budget and desired launch date. For automation, propose a narrowly scoped pilot with a baseline and staff approval before any live consequential action.

## Sources and exclusions

Each row includes its exact public source URL and a checked date. Google profile and business social URLs are retained when relevant. Sources include company contact pages, BizSeek, AllBiz, BizIreland, FindSalon and HungryGoWhere. Raw scrape/search evidence is retained locally in the ignored `.firecrawl/` folder. Closed businesses, mismatched profiles and some poor-fit records were excluded. Similar business names were not assumed to be the same company.

Personal WhatsApp group-member phone numbers, photos and cross-site dossiers were not collected. An opt-in form shared by you or a group administrator can instead collect business name, business URL, preferred contact, service interest and consent to follow up.

## Further coverage

To expand responsibly, work in country/city/industry batches and deduplicate by business identity, source and phone. Verify each candidate against its current business profile and exact-name web search. For recently formed firms, capture a public registry entity ID and incorporation date, then separately verify trading activity and a public business contact. Remaining European countries and additional cities/sectors in covered countries have not been exhaustively researched. No recurring monitoring is configured.

Keep these prospect files outside public website assets. They are in reports/, not public/ or src/pages/.
