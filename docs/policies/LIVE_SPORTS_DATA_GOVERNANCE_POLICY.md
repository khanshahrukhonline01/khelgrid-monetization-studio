# KhelGrid Live Sports Data Governance Policy

- **Owner:** KhelGrid product and engineering
- **Scope:** Frontend, backend/API, Supabase/Postgres, caches, analytics, administrators, contractors, providers and ad vendors
- **Status:** Proposed internal policy; effective after owner approval
- **Review:** Quarterly and after material provider, law, sport, market or advertising-policy changes

## 1. Purpose and limitation

KhelGrid will publish accurate, timely sports information only when source rights, contracts, privacy/security requirements and advertising policies permit it. This is an operational baseline, not a legal opinion, certification, or guarantee of acceptance by every organization, jurisdiction, sports body, data provider or advertising company. Obtain qualified legal review and required written approvals for each target market and use case.

## 2. Non-negotiable rules

1. **Rights before ingestion.** Do not ingest, cache, transform, display, archive, redistribute, monetize, use for ad targeting, or train models on live scores, play-by-play, statistics, fixtures, tables, odds, tracking data, images, video, commentary, logos or other third-party content unless law and the applicable written terms/license permit the exact use.
2. **Public does not mean licensed.** A public webpage, official source, API key, free trial, attribution, link or robots.txt entry does not by itself grant commercial display or redistribution rights.
3. **No prohibited scraping.** Never bypass authentication, paywalls, CAPTCHAs, rate limits or technical access controls. Automated collection is permitted only when source terms and applicable law allow it. Prefer licensed APIs, verified open data or written permission.
4. **Scope every permission.** Record allowed sports/leagues, fields, territories, domains, audience, commercial/ad use, caching, retention, refresh limits, attribution, derivative use, archives and termination requirements. Ambiguous or undocumented rights mean **not approved**.
5. **Trace and label data.** Each public item must be traceable to its source, ingestion time, source update time (when available), rights approval and validation status. Never label sample, inferred, delayed or stale data as live.
6. **Minimize and secure personal data.** Collect only what is necessary; document purpose and lawful basis and obtain consent/notice where required. Apply additional safeguards for children and sensitive data.
7. **Keep advertising independent.** Ads must not change scores, attribution, source validation or access controls. Do not use licensed data to trigger or target ads unless the licence expressly permits it.
8. **Fail closed.** If rights, provenance, freshness, accuracy or consent is uncertain, suppress the affected feed/field, show a truthful status and escalate. Never fabricate live data.

## 3. Data classification

- **Licensed live data:** written license covers the exact display, storage, territory and commercial uses.
- **Verified open data:** source license/terms checked for commercial use, attribution, modification, storage and redistribution.
- **Editorial/public facts:** independently verified facts used within applicable law; do not assume that a compilation, database, real-time feed, image or expressive text is free to reuse.
- **User-submitted:** unpublished until moderation, rights declaration, privacy review and verification.
- **Demo/test/synthetic:** prominently labelled demo/test; never presented as a real match, score, athlete, trial or venue.
- **Unverified/blocked:** no public display or monetization until resolved.

## 4. Required source register

Maintain a version-controlled source register and, where useful, a database record containing:

- Provider/source name, canonical URL, contact and source type.
- Contract/license reference, version, approval owner and date.
- Permitted sports, competitions, seasons, fields, territories and domains.
- Public display, commercial use, ad adjacency, analytics/derived-data, archival and prohibited-use permissions.
- Required attribution and separate image/logo/headshot rights.
- Rate limits, refresh frequency, freshness target, cache and retention rules.
- Personal-data categories, purpose, lawful basis/consent, subprocessors and cross-border transfer requirements.
- Credential owner and secret storage location (never the secret value), rotation date and incident contact.
- Expiry/renewal date, termination/deletion duties, current status and last review.

No current approved source-register entry means the source is disabled.

## 5. Frontend requirements

- Display data from KhelGrid's controlled backend API; do not expose provider credentials or call third-party endpoints directly when doing so exposes secrets or violates terms.
- Never ship provider secrets, Supabase service-role/secret keys, private tokens or privileged credentials in browser bundles, HTML, source maps, URLs, analytics or client-visible errors.
- Show attribution where required and a visible status/timestamp: **Live**, **Delayed**, **Last updated [time]**, **Unavailable** or **Demo data**. Show **Live** only when the source supports live use and freshness checks pass.
- Make source, timestamp and correction notices readable on mobile and accessible.
- Do not copy protected broadcasts, photos, video, commentary, logos or provider UI without permission. Link to an authorized original where appropriate.
- Never fabricate scores, fixtures, rankings, player profiles, trials, venues, availability or endorsements. Separate verified facts, editorial summaries and user submissions.
- Ads must be clearly distinguishable from editorial content and navigation. No deceptive placements, forced redirects, prohibited popups, artificial clicks/impressions, incentivized ad interactions or ad-triggered refreshes.
- Load non-essential ad/analytics technologies in line with applicable consent requirements, user choices, privacy notices and vendor policies. Honor withdrawal/opt-out signals; no dark patterns.
- Do not send personal data, precise location, authentication tokens or sensitive information in query strings, public logs, ad requests or analytics events.

## 6. Backend/API requirements

- Backend is the controlled boundary for provider calls, secrets, validation, normalization, caching and public API responses.
- Allowlist approved providers/endpoints and permitted fields. Enforce provider rate limits, quotas, timeouts, backoff and circuit breakers. Never evade limits by rotating keys or identities.
- Validate schemas, types, IDs, timestamps, event status and plausible state transitions. Retain raw payloads only when contract and retention policy permit; otherwise store minimum normalized fields and provenance.
- Record source ID, provider record ID, source update time, ingestion time, rights approval/version, validation result and last successful refresh.
- Apply authentication, authorization, input validation, output filtering, rate limits and abuse monitoring to write/admin endpoints. Public APIs expose only approved public fields.
- Treat provider payloads as untrusted input: escape output, prevent injection, reject unexpected HTML/URLs and never execute supplied markup/scripts.
- On outage, expired license, invalid data, quota exhaustion or suspected breach, stop publishing affected records and return a truthful stale/unavailable state.

## 7. Database and Supabase requirements

- Separate provider/license registry, normalized events, event updates, provenance, quality incidents and audit logs. Do not mix demo fixtures with production live data without an explicit status field.
- Each externally sourced record should include source ID, provider record ID where available, data status, source update time, ingestion time, last verification time, license/approval reference and retention/expiry metadata as appropriate.
- Use unique constraints for provider + provider record ID, idempotent upserts, foreign keys, UTC timestamps, allowed-status constraints and suitable indexes.
- Enable Row Level Security on exposed Supabase schemas/tables. Apply least privilege. Anonymous/public roles may read only explicitly approved public fields. Restrict credentials, raw payloads, personal data, admin decisions and audit records to authorized server roles.
- Never expose Supabase service-role/secret keys in the frontend. Store secrets server-side and rotate any exposed credential immediately.
- Review views, grants, functions, triggers, storage policies and RLS together. Use security-invoker views where supported and appropriate. Do not add privileged functions simply to bypass access policies.
- Backups, retention, deletion and exports must respect license terms, privacy obligations and available plan/resource limits. Do not retain data merely because storage is available.
- Version-control and review migrations. Test RLS as anonymous, authenticated, owner and admin roles; hiding a UI element is not access control.

## 8. Privacy and children

Maintain an accurate privacy notice describing data categories, purposes, lawful bases/consent, recipients and ad-tech vendors, retention, rights and contact routes. Assess the laws applicable to actual users and activities, including India's DPDP Act/Rules, GDPR/UK GDPR, US state privacy laws, COPPA and other child-protection rules where relevant. Do not assume one consent mechanism satisfies every jurisdiction. Apply required parental-consent and child-safety measures; avoid behavioural advertising to children unless explicitly lawful and approved. Provide required access, correction, deletion, withdrawal and complaint mechanisms. Document processors, transfers, retention and breach response.

## 9. Advertising and monetization

- Review each ad provider separately (including Google AdSense and any alternative network). Record current policies, consent requirements, territories, formats, prohibited content, traffic-quality rules, disclosures and approval status.
- Approval by one network does not imply approval by another. Do not place ads beside infringing, deceptive, unsafe, unverified or prohibited content.
- Never incentivize/request clicks, use click exchanges, fabricate traffic, auto-refresh to inflate impressions, disguise ads as navigation, or use prohibited redirects/popups.
- Use sports data for ad personalization, ad triggers or custom ad units only if the provider license explicitly permits it and privacy/advertising rules are satisfied.
- Verify ads.txt/app-ads.txt and other publisher verification files where required. Publish seller IDs only when confirmed from the actual network account.
- Recheck terms before enabling a new network or format and after material policy changes.

## 10. Incidents and enforcement

Immediately disable the affected source/field and open an incident for rights complaints, takedown requests, fabricated/stale live data, privacy/security events, provider restrictions, unexplained mismatches, ad-policy warnings or credential exposure. Preserve only lawful, necessary evidence. Notify providers, users, regulators and partners where required. Correct, delete or restrict affected data according to law and contract.

## 11. Release gates

A feed or monetized placement may go live only after all are checked:

- Source register and rights approval complete.
- Contract covers fields, display, territory, caching, retention and monetization.
- Attribution and freshness labels implemented.
- Backend validation, rate limits, failure handling and secret storage reviewed.
- Database schema, RLS/grants, retention and audit trail reviewed.
- Frontend, mobile and accessibility behavior tested.
- Privacy notice, consent/CMP and vendor disclosures reviewed for target markets.
- Network-specific ad policy and placement checked.
- Automated tests and production build pass.
- Owner approves release and a disable/rollback switch is tested.

## 12. Governance and reference links

Product owns feature intent; engineering owns technical enforcement; the data owner verifies source rights and accuracy; privacy/legal reviewers assess obligations; monetization owner verifies each network. Written exceptions must specify scope, expiry and compensating controls; no exception may override law or contract. Review quarterly.

Reference points (check current versions and the signed provider agreement):
- Google AdSense policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/publisherpolicies/
- India MeitY Acts and Policies / DPDP Rules: https://www.meity.gov.in/documents/act-and-policies
- EU GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- US FTC COPPA: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- The specific provider's current API terms and signed license.

**This policy is a proposed baseline. It does not establish that any specific KhelGrid feed, page, database or advertising account is compliant until implementation and evidence are reviewed.**
