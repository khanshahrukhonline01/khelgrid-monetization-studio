# KhelGrid Live Sports Data Standard Operating Procedure (SOP)

**Status:** Proposed for review and approval  
**Scope:** All sports/competitions, frontend, backend/API, Supabase/Postgres, caches, analytics, admins, providers and ad vendors  
**Owner:** KhelGrid product and engineering  
**Related policy:** docs/policies/LIVE_SPORTS_DATA_GOVERNANCE_POLICY.md

## 1. Objective

Operate a repeatable pipeline that ingests, validates, stores and displays sports data only from approved sources, with honest freshness labels, secure credentials, appropriate rights, privacy controls and advertising safeguards.

## 2. Roles

- **Product/data owner:** Defines needed fields and intended uses.
- **Rights reviewer:** Verifies terms/license and maintains the source register; escalates ambiguity.
- **Backend engineer:** Implements provider calls, validation, limits, provenance and outage handling.
- **Database owner:** Reviews schema, migrations, grants, RLS, retention and backups.
- **Frontend engineer:** Implements status labels, attribution, accessibility and fallback states.
- **Privacy/security reviewer:** Reviews personal data, consent, vendors, children and security.
- **Monetization owner:** Reviews each ad network's policies and placement rules.
- **Release approver:** Confirms release gates and rollback.

Small teams may combine roles, but approvals and decisions must be recorded.

## 3. Approve a source before use

1. Identify the provider, official endpoint, sports, leagues, fields and intended user experience.
2. Read current terms and obtain a written license/permission when required.
3. Confirm public display, commercial use, ad adjacency, territories, cache/refresh limits, retention, attribution, derivative use, archives and termination/deletion duties.
4. Route personal data, athlete images, children's data, tracking/location, odds, video or commentary for additional privacy/legal review.
5. Record the contract reference, allowed uses, limits, owner, expiry, attribution and status in the source register.
6. Mark the source approved, restricted, expired, under review or blocked. Only approved sources may power production feeds; restricted sources are used only within their documented scope.
7. If permission is unclear, stop and seek written clarification. Do not scrape or circumvent controls to test access.

## 4. Integrate and ingest

1. Store credentials only in server-side secret storage. Do not commit them or put secrets in Vite variables prefixed with VITE_, because those values are exposed to browser code.
2. Build a server-side adapter for the approved provider with an endpoint and field allowlist.
3. Respect rate limits; use bounded retries, backoff, timeouts, quotas and circuit breakers. Never evade limits by rotating keys or identities.
4. Normalize payloads and validate required fields, IDs, timestamps/time zones, event state, score types, source identity and plausible transitions. Reject malformed data; do not invent missing values.
5. Use idempotent upserts and deduplicate by provider + provider record ID where available.
6. Record source provenance, ingestion time, source update time and the relevant rights approval/version.
7. Log fetch success/failure, latency, rate-limit responses, validation errors and last successful refresh. Never log secrets or unnecessary personal data.
8. Retain raw provider payloads only if the contract and retention policy allow it.
9. Test with sanitized fixtures or provider sandbox data. Do not invent production events to make the site appear live.

## 5. Record metadata

Adapt the following to the existing schema after reviewing it; do not create duplicate tables without a schema audit.

- Stable internal event ID
- Provider/source ID and provider event ID
- Sport, competition, season and event status
- Approved normalized score/statistic fields
- source_updated_at (provider timestamp, when supplied)
- ingested_at (when KhelGrid received it)
- last_verified_at
- data_status (live, delayed, scheduled, final, stale, unavailable or demo)
- Rights approval reference/version
- Validation status and correction/version reference where needed
- Expiry or retention class where required

Use UTC internally and format times for the viewer. Add appropriate uniqueness rules, foreign keys, constraints and indexes. This is a target model, not authorization to migrate without reviewing the actual schema.

## 6. Freshness and public status

Set a documented freshness threshold per provider/feed based on contract terms and expected update cadence; do not assume one threshold fits all sports.

- **Live:** The provider supports live distribution, rights are active, validation passes and freshness is within the configured threshold.
- **Delayed:** The feed is intentionally delayed or the provider labels it delayed; disclose delay when required.
- **Scheduled / Final:** Only when supported by the source and validated.
- **Stale:** Last update exceeds the approved threshold; do not present it as live.
- **Unavailable:** Provider is down, rate-limited, rights expired, data invalid or trustworthy current data is unavailable.
- **Demo:** Synthetic/test data, visibly labelled and never mixed with production live claims.

Show “Last updated” from real timestamps. If the provider supplies no source update time, show ingestion/fetch time and do not imply it is the event timestamp. Never manufacture timestamps or silently fall back to unrelated sample data.

## 7. Supabase and API access

1. Review the existing schema first and reuse suitable tables.
2. Enable Row Level Security on tables in exposed schemas and test all roles. Public read access is limited to fields explicitly approved for display.
3. Keep contracts, credentials, restricted raw payloads, personal data, admin notes and audit logs inaccessible to public roles.
4. Never expose Supabase service-role/secret keys in frontend code. Store them server-side and rotate immediately if exposed.
5. Review RLS policies, grants, views, functions, triggers and Storage policies together. Frontend hiding is not security.
6. Expose normalized, allowlisted fields through a controlled API/view. Validate parameters and apply server-side rate limits.
7. Configure retention/deletion only after checking provider obligations and the chosen plan's actual capabilities. Do not assume a scheduler or backup feature exists without verifying it.
8. Version-control migrations and test RLS as anonymous, authenticated, owner and admin roles.

## 8. Frontend publication checklist

Before displaying a feed, verify:
- Source is approved and not expired/restricted for this use.
- Response is validated and includes status/provenance needed by the UI.
- Required attribution is visible.
- Status and timestamps are accurate and accessible.
- Stale/unavailable states are clear; no silent fallback to sample data.
- Demo fixtures are labelled and excluded from production live widgets.
- Errors do not leak tokens, internal URLs, restricted payloads or personal data.
- Mobile layout, keyboard use, screen-reader labels and contrast are tested.
- Ads are separate from sports data/navigation and do not impersonate an official source.

## 9. Advertising and analytics

For every ad/analytics vendor and target market:
1. Review current vendor terms and policies and record reviewer/date.
2. Confirm content and traffic acquisition comply with the vendor's rules.
3. Verify privacy notice, consent-management signals, disclosures and opt-out behavior.
4. Do not send personal/sensitive data to vendors unless lawful, necessary, disclosed and approved.
5. Never incentivize clicks, use click exchanges, fabricate traffic, auto-refresh ads to inflate impressions, disguise ads as controls or use prohibited redirects/popups.
6. Verify ads.txt/app-ads.txt against actual account values and check the deployed public response.
7. Re-review whenever a sport, source, market, ad format or network changes. Ad-network approval is separate from data licensing.

## 10. Monitoring and incidents

Monitor provider errors/latency, rate limits, time since last successful update, validation failures, duplicates, license expiry, suspicious score transitions, public API errors, access denials, consent failures and ad-policy notices.

When an issue occurs:
1. Disable the affected source/field or monetized placement; avoid disabling unrelated sports unless necessary.
2. Mark affected data stale/unavailable and stop calling it live.
3. Open an incident record with time, source, affected competitions, impact, actions and owner. Do not store unnecessary personal data or prohibited payloads.
4. Notify the provider and internal reviewers; make legal, regulatory or user notifications where required.
5. Correct/remove affected data, invalidate caches and honour valid deletion/takedown requests within applicable deadlines.
6. Verify recovery with provider evidence, API/database checks and a frontend check.
7. Record root cause and preventive actions before re-enabling.

## 11. Tests and release

Test in a non-production environment using mocks, provider sandboxes or approved test data.

- **Unit:** parsing, normalization, timestamps, attribution, freshness, invalid/missing fields and deduplication.
- **Integration:** timeouts, rate limits, retries, malformed payloads, license expiry, duplicate updates and outage handling.
- **Security:** no secrets in built assets/logs; API authorization; RLS for anonymous/authenticated/admin roles; input/output validation.
- **Frontend:** correct sports navigation, status labels, stale/offline states, attribution, demo labels, accessibility and no false live claims.
- **Data quality:** compare a controlled sample against the licensed provider and record discrepancies.
- **Release:** lint, tests and production build pass; review diff/migrations; verify staging; approve release; deploy through protected workflow; check production endpoint and UI; keep rollback available.

Do not bypass failing policy, lint, security or rights checks simply to make CI green. Investigate and document justified exceptions.

## 12. Rollback

Before release, document how to disable a provider/feature flag, revoke a credential, stop ingestion, clear affected caches, suppress the UI, roll back the deployment and restore a compatible schema. Test the disable path in staging. Rollback must not reintroduce unlicensed or mislabelled data.

## 13. Records to retain

Maintain access-controlled records of source approvals and evidence, license version/expiry, change reviews, test results, release commit/deployment, thresholds, incidents, takedown/deletion requests, and privacy/ad-network reviews. Restrict contract and personal-data access; apply retention and deletion rules.

## 14. Launch sign-off template

- Source/provider and sports covered:
- License/contract reference and expiry:
- Permitted fields, territories, display and commercial/ad use confirmed by:
- Attribution and freshness threshold:
- Backend validation, rate limiting and outage handling tested by:
- Database/RLS/grants/retention reviewed by:
- Frontend status, attribution, accessibility and demo separation tested by:
- Privacy/consent/children's-data review, if applicable:
- Ad-network policy review, if monetized:
- Automated tests/build and staging verification:
- Rollback/disable switch tested:
- Approver, date and decision: **Approved / Restricted / Rejected**

**Do not mark a source or feature approved while a required item is unknown.**
