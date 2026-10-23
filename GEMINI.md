# KhelGrid coding-agent instructions

Before any change involving trials, selection trials, combines, sports opportunities, their database, imports, scraping, or related UI/API workflows, read `AGENTS.md` and follow `docs/TRIALS_AND_OPPORTUNITIES_DATA_SOP.md`. These requirements apply to Gemini/Antigravity and all other coding agents.

Do not add permanent records as frontend-only hardcoded data, invent missing facts, mark AI-collected records approved/verified, or bypass source checks and deduplication. New records default to `review_status='needs_review'`. Preserve IDs and existing data, back up before bulk changes, validate/reconcile imports, use repository adapters for provider portability, test the relevant paths, and report what was and was not verified.

The SOP is mandatory. If it cannot be read or the requested change would violate it, stop and ask for clarification rather than improvising.
