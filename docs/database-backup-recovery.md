# KhelGrid database backup and recovery

## Important repository privacy note

The application repository is public. Never commit raw database dumps, .env files, database URLs, service-role keys, or backup passphrases to this repository. The scheduled workflow encrypts the database dump before uploading it as a GitHub Actions artifact. The artifact contains ciphertext and a SHA-256 checksum, not the plaintext dump.

GitHub Actions artifacts expire after 90 days in this workflow. This is a recovery aid, not an indefinite archive. Download and retain important backup artifacts in a private, independently controlled location before expiration. Do not rely on this workflow alone as the only copy of production data.

## One-time setup

In GitHub, open Settings → Secrets and variables → Actions → New repository secret and add:

- `SUPABASE_DB_URL`: PostgreSQL connection URI for the KhelGrid Supabase database. Get connection details from Supabase's Connect panel. Use a connection option supported by GitHub-hosted runners. Do not place the URL in source code or workflow YAML.
- `BACKUP_PASSPHRASE`: a long, unique, randomly generated secret (at least 32 random bytes). Save it in a secure password manager. If it is lost, encrypted backups cannot be recovered. Never store it in this repository.

Use the database password only in the GitHub secret. Do not use a Supabase service-role key as a database password. Keep repository settings access limited to trusted administrators.

## Run and verify

1. Open Actions → Weekly encrypted Supabase backup.
2. Select Run workflow for the first run.
3. Confirm every step succeeds.
4. Open the completed run and download its `khelgrid-supabase-backup-<run-id>` artifact.
5. Verify the encrypted file checksum with `sha256sum -c <encrypted-file>.sha256`.
6. Keep the backup passphrase separately and privately.

The workflow is scheduled for Sundays at 03:00 UTC (08:30 India Standard Time). GitHub may delay scheduled workflows, so monitor Actions; a schedule is not proof that a backup succeeded.

## Restore procedure

Perform restoration into a separate/test PostgreSQL database first. Never test by overwriting production.

1. Download the encrypted dump and checksum file from the GitHub Actions artifact.
2. Verify the checksum: `sha256sum -c <encrypted-file>.sha256`.
3. Decrypt with the saved passphrase: `openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in <encrypted-file> -out khelgrid-db.dump -pass env:BACKUP_PASSPHRASE`. Set `BACKUP_PASSPHRASE` securely in your local shell; never paste it into a command that is saved in shell history.
4. Restore into a test destination with PostgreSQL tools, for example: `pg_restore --no-owner --no-acl --dbname="$RESTORE_DATABASE_URL" khelgrid-db.dump`. Restore into a disposable test database, not production.
5. Validate table counts, relationships, RLS policies, extensions, functions, triggers, storage objects, and authentication separately. A database dump alone does not back up Supabase Auth users, Storage files, project settings, secrets, or every provider-specific feature.
6. Document the successful test and only then consider the backup recoverable.

## Scope and migration discipline

The PostgreSQL dump covers database objects and data accessible to the database role used for the dump. Owner and ACL restoration are excluded for portability. Supabase-managed authentication data, Storage object bytes, Edge Functions, secrets, project settings, and external integrations need separate recovery plans.

Keep schema changes in version-controlled SQL migration files under `supabase/migrations/`. Test migrations before production changes. Never put production records or credentials into migration files.