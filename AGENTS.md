# Mandatory Repository Instructions — KhelGrid

## Trial and opportunity data: read before acting

Before adding, importing, editing, deleting, reviewing, migrating, or building an agent/automation that touches trial or opportunity data, read and follow:

- `docs/TRIALS_AND_OPPORTUNITIES_DATA_SOP.md`
- `supabase/migrations/20261024010000_standardize_trial_opportunity_review.sql` (schema context; do not blindly rerun on a different environment)

These rules apply to every AI agent, coding assistant, scheduled job, scraper, importer, admin tool, API, and human contributor. They are mandatory, not optional suggestions.

## Non-negotiable rules

1. The database is the source of truth. Do not add permanent trial/opportunity records only to frontend arrays, mock data, or hardcoded components.
2. Use the existing `trials` table for selection trials/combines and `opportunities` for broader sports opportunities. Keep applications in their separate application tables.
3. Preserve existing IDs. Deduplicate by `external_id` when available; otherwise reconcile against existing records before inserting. Never create duplicates merely because a title is worded differently.
4. Do not invent dates, deadlines, fees, capacity/spots, eligibility, organizer contacts, application URLs, verification claims, or source citations. Missing or conflicting information must be left unknown/null where allowed and explained in `review_notes`.
5. Capture a credible `source_url` and `source_label`. Prioritize official organizer/government/federation/university/academy notices. Secondary reporting is a lead and should be cross-checked.
6. New or changed records default to `review_status='needs_review'`. An AI agent or import script must never set `approved` or claim “verified” solely because it found a page. Approval requires the defined human review and an actual `last_verified` timestamp.
7. Never confuse editorial `review_status` with operational `status`. Do not change public visibility rules without reviewing existing data, testing the user-facing pages, and documenting the decision.
8. Before bulk import/update: export a backup, validate and normalize data, deduplicate, stage/preview changes, apply in small batches, and reconcile counts and samples. Report rejected rows and reasons.
9. Do not delete/overwrite records or clear source/review fields as a shortcut. Use a non-destructive update and preserve audit context. Ask for confirmation before destructive or irreversible actions.
10. Keep provider-specific SQL and SDK calls behind repository/service adapters where feasible. Update the canonical data contract, migration, tests, and SOP together when the schema changes. Do not leak database secrets or service-role keys.
11. For a provider migration, follow the SOP's export, staging restore, row/field reconciliation, access-control recreation, smoke-test, cutover, and rollback steps. Never assume Supabase RLS automatically transfers.
12. Run the relevant tests/build and verify a representative trial and opportunity read/write path before claiming completion. Clearly state what was changed, what was tested, what remains unverified, and any data-quality warnings.

## Required completion report

For every trial/opportunity data task, report:
- source(s) used and fields left unknown;
- number of records created, updated, skipped, and rejected;
- duplicate check and review status;
- backup/rollback approach for bulk or schema changes;
- tests and runtime checks actually performed;
- whether production deployment and live page behavior were verified.

If a request conflicts with this protocol, pause the conflicting step and explain the issue; do not silently bypass the SOP.
