# Khelgrid ChatGPT MCP server

An isolated, read-only MCP endpoint for ChatGPT to search public Khelgrid sports opportunities. This directory is intended to be deployed as a **separate Vercel project** from the main Khelgrid website.

## Tools

- `search_opportunities`: searches public opportunities by keyword, sport, state, city and type.
- `get_opportunity_details`: retrieves one opportunity by UUID.

## Required Vercel environment variables

- `SUPABASE_URL`: the Khelgrid Supabase project URL.
- `SUPABASE_ANON_KEY`: the project's public anon/publishable key.

Do not set a service-role key. The endpoint uses the anon key so Supabase Row Level Security remains in force. Before enabling the app publicly, verify that the opportunities table has a SELECT policy exposing only intended public records. If no public policy exists, the endpoint should return no rows until that policy is designed and reviewed; do not bypass RLS.

## Local setup

From this directory:

```bash
npm install
npm run typecheck
vercel dev
```

Set the two environment variables locally using Vercel's environment workflow or a local ignored `.env` file. Never commit secrets.

## Separate Vercel deployment

1. Import the same GitHub repository into a **new** Vercel project.
2. Set Root Directory to `chatgpt-mcp`.
3. Configure the two environment variables above.
4. Deploy a preview from `feature/chatgpt-app-mcp`.
5. Test the MCP endpoint using the MCP Inspector before production use.
6. Connect the HTTPS endpoint to ChatGPT only where custom MCP connections are supported.

## Important limitations before public launch

- The opportunity table and public SELECT policy must be verified against the live Supabase project.
- The first version deliberately exposes no profiles, applications, payments, wallet, bookings, or write operations.
- The initial tool uses the public opportunity statuses `published`, `active` and `upcoming`. Confirm these match the actual database constraints before launch.
- Search results currently link to the general Khelgrid search page because a canonical public detail URL has not yet been confirmed.
- Public app submission and listing are subject to OpenAI's current eligibility and review requirements.
