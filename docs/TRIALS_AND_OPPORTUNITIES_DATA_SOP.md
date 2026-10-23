# KhelGrid Trials & Opportunities — Data Standard, Protocol and SOP

**Scope:** all selection trials, combines, camps, scholarships, coaching/academy openings, venue-linked sports opportunities, competitions and related listings.  
**Owner:** KhelGrid content/data administrator. **Default review state:** `needs_review`.  
**Core rule:** the database is the source of truth. Frontend arrays are not a permanent publishing system. Never label a listing “verified” unless a human checked a credible source and recorded when.

## 1. Canonical data model

Keep the existing domain tables separate:
- `trials`: selection trials and combines, with trial date, venue, fee, age/gender eligibility, capacity, documents, application link and source metadata.
- `opportunities`: broader opportunities, with `opportunity_type`, title/description, eligibility, location, start/end, registration deadline, fee, requirements and metadata.
- `trial_applications` / `applications`: user submissions; do not mix applications into public listing records.

Shared editorial/provenance fields:
- `external_id`: stable source/provider ID when one exists; unique when supplied. Do not use title/date as a permanent identity.
- `source_url`, `source_label`: primary announcement or organizer page and readable source name.
- `last_verified`: timestamp when a reviewer last checked the source (store timezone-aware timestamps).
- `review_status`: `needs_review`, `approved`, `rejected`, `expired`.
- `review_notes`: short internal reason/action; never put private athlete data here.
- Existing `status` controls operational lifecycle/visibility; do not overload it with editorial approval. Preserve existing statuses until application code has a documented mapping.

Use UUID primary keys internally. Store dates as ISO dates (`YYYY-MM-DD`) when it is a date-only event, and timezone-aware timestamps for deadlines and event times. Money uses numeric/decimal, never floating-point; record currency in the documented field/metadata if multi-currency is ever added. Do not use invented dates (including a default date) to satisfy a required field.

## 2. Required content before publishing

For a trial, capture at minimum:
1. Official title and organizer/academy name.
2. Sport, city and state; venue/address if known.
3. Actual trial date and reporting time, or explicitly mark date as unknown in the intake queue rather than inventing one.
4. Registration deadline if stated; fee (zero only if source confirms free), eligibility/age category and gender if specified.
5. Required documents and selection process when published by organizer.
6. Primary source URL and source label.
7. Reviewer, review timestamp, review outcome, and notes for any unresolved ambiguity.

For a broader opportunity, additionally capture `opportunity_type`, concise description, start/end dates, deadline, eligibility, location, fee, requirements and official application URL where applicable. Only populate what the source supports; unknown values remain null/explicitly unknown.

## 3. Source hierarchy and evidence

1. Official organizer, government/SAI/AIU/federation/university/academy website or official notice/PDF.
2. Organizer’s verified official social account or official registration portal.
3. Reputable reporting, used as a lead and cross-checked against the organizer when possible.
4. Community submissions are leads only until checked.

Save the exact source URL and source label. Record the checked date in `last_verified`. For PDFs, keep the PDF link and note page/notice date in `review_notes` or structured metadata. Never copy a third-party claim into a “verified” badge without checking. Do not scrape or republish copyrighted poster artwork without permission; link to source where appropriate.

## 4. Intake and entry SOP

1. **Collect:** add a candidate record to the correct table with a stable UUID and source details. If an external source ID exists, store it in `external_id`.
2. **Normalize:** trim whitespace; use consistent sport names, Indian state names, city spelling, date/time formats, fee representation, and opportunity type vocabulary. Preserve source wording in notes if normalization could change meaning.
3. **Deduplicate:** check `external_id` first; otherwise compare normalized title + organizer + sport + date/location. Never silently overwrite a different event. Update an existing record when it is the same event and preserve its ID.
4. **Evidence-check:** open the source, confirm dates/deadlines, eligibility, fee, location, organizer and apply link. A missing source or contradictory dates means `needs_review`.
5. **Review:** leave `review_status='needs_review'` until a human has checked all critical fields. Set `approved` only after source validation; document the check with `last_verified` and reviewer notes.
6. **Publish:** the application’s public query must explicitly define which review states can be shown. Recommended rule is to show only approved, not-expired listings; however, roll this rule out only after current records have been reviewed so the homepage is not accidentally emptied. Do not treat existing `status='active'` as proof of editorial approval.
7. **Monitor:** revisit open listings regularly and immediately after deadline/event date. Mark genuinely closed/past listings `expired` in review workflow and update the existing operational `status` according to its documented lifecycle.
8. **Audit:** record what changed, who changed it, when, and why. Do not delete old listings simply because they expired; preserve them for audit/history unless a privacy/legal request requires deletion.

## 5. Verification and quality gates

Before approval:
- Source URL opens and identifies the same event.
- No placeholder/fallback date; dates and deadline are consistent.
- Date has not passed, unless listing is explicitly historical.
- Fee and capacity are supported by evidence; no invented spots or urgency claims.
- Age/gender/eligibility wording matches the source.
- Apply URL points to the official destination and is not broken.
- Duplicate check passes.
- `last_verified` is set to the actual review timestamp.
- “Verified” visual labels are derived from approved review state, not a hardcoded string.

Run a daily/weekly queue for: missing source, missing verification timestamp, old verification, date/deadline passed, missing application link, duplicate candidate, and date placeholders. Review before changing visibility.

## 6. Import/update SOP

1. Export a dated backup of the relevant tables and record row counts.
2. Validate input columns and types before import; reject malformed dates instead of substituting a default.
3. Normalize and deduplicate in a staging file/table first.
4. Upsert by stable `external_id` when present; otherwise use the previously reconciled internal UUID. Never regenerate IDs for existing records.
5. Do not overwrite a human-approved field with a blank or lower-confidence source value.
6. Import in small batches; capture rejected rows and reasons.
7. Compare pre/post counts, duplicates, nulls, review-state totals and sample records.
8. Test public list/detail pages and application links before release. Keep rollback export until the release passes.

## 7. Database-provider portability protocol

The product must depend on a repository-owned data contract, not on provider-specific SQL sprinkled through UI components.

1. **Contract:** maintain canonical TypeScript types and validation schemas for Trial and Opportunity, including nullability, enum values, date/time semantics, and source/review fields.
2. **Repository layer:** keep reads/writes behind interfaces such as `TrialRepository` and `OpportunityRepository`; UI components should not issue provider-specific queries directly.
3. **Adapters:** implement one adapter per provider (current Supabase/Postgres adapter plus a future adapter). Map provider rows to the canonical domain types in one place.
4. **Migrations:** keep versioned, ordered SQL migrations in source control. Additive changes first; avoid destructive renames/drops in the same release. Document provider-specific equivalents.
5. **Export:** regularly export CSV/JSON plus schema/data dictionary. Preserve UUIDs, external IDs, timestamps with timezone, arrays/JSON, nulls and UTF-8. Store source documents externally by URL, not as provider-specific blobs unless an explicit storage abstraction exists.
6. **Migration rehearsal:** restore a recent export into a staging database, run row-count and checksum/field-level comparisons, validate foreign keys, unique IDs, null rates, RLS-equivalent access controls and application behavior.
7. **Cutover:** freeze writes briefly or use dual-write/change-log strategy; copy data; reconcile counts; run smoke tests; switch adapter/environment config; monitor errors; keep old provider read-only for a rollback window.
8. **Rollback:** switch back using documented environment configuration if checks fail. Do not delete old data until the rollback window closes and backup restoration is tested.
9. **Security:** never export service-role keys or secrets. Rebuild access controls and least-privilege permissions in the new provider; RLS policies do not automatically transfer to another provider.
10. **Sign-off:** record migration date, source/destination versions, row counts, reconciliation results, test results, owner and rollback decision.

## 8. Routine operations

- **Every new entry:** source, normalize, deduplicate, review, then publish.
- **Weekly:** review unverified and upcoming records; recheck source/deadline changes.
- **Monthly:** export backup; audit duplicates, stale records, missing source URLs, missing verification dates and public query behavior.
- **Before every schema release/provider change:** backup, migration rehearsal, automated tests, access-control review, row reconciliation, rollback plan.

## 9. Initial backlog generated from current import

The current trial import contains 88 records. A database check found 85 records lacking `last_verified` and/or source URL or using the fallback date 2026-12-31; all 88 have been assigned `needs_review`. These are **not** considered verified or ready for approval. Review the 85 flagged records first and confirm the three fallback-date records directly from source. No records were deleted.

## 10. Release checklist

- [ ] Schema migration committed and applied in each environment.
- [ ] Data types and enum mappings match canonical contract.
- [ ] Backups and restore rehearsal passed.
- [ ] No accidental duplicate external IDs.
- [ ] Review queue and provenance fields visible to authorized maintainers.
- [ ] Public page only displays records allowed by documented publishing rule.
- [ ] Source URLs, dates, deadlines, and application links sampled.
- [ ] Tests/build pass; desktop and mobile smoke test pass.
- [ ] Rollback procedure and owner documented.
