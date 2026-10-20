-- Remove unnecessary and dangerous table-level privileges from API roles.
-- RLS does not govern TRUNCATE, and these privileges should not be granted to
-- browser-facing anon/authenticated roles. Keep normal SELECT/INSERT/UPDATE
-- grants governed by the existing RLS and column-level policy model.

REVOKE TRUNCATE, TRIGGER, REFERENCES
ON ALL TABLES IN SCHEMA public
FROM anon, authenticated;

-- Prevent the same unnecessary privileges being inherited by future public
-- tables created by the current migration owner.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE TRUNCATE, TRIGGER, REFERENCES
ON TABLES FROM anon, authenticated;
