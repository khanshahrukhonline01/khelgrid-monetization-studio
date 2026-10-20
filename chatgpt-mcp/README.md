# Khelgrid ChatGPT MCP server

An isolated, read-only MCP endpoint for ChatGPT to search public Khelgrid sports opportunities. This directory is intended to be deployed as a **separate Vercel project** from the main Khelgrid website.

## Tools

- `search_opportunities`: searches public opportunities by keyword, sport, state, city and type.
- `get_opportunity_details`: retrieves one opportunity by UUID.

## Required Vercel environment variables

- `SUPABASE_URL`: the Khelgrid Supabase project URL.
- `SUPABASE_ANON_KEY`: the project's public anon/publishable key.

Do not set a service-role key. The endpoint uses the anon key so Supabase Row Level Security remains in force. The current live RLS policy allows anonymous reads only where `opportunities.status = 'published'`; the server explicitly limits results to that status. If the policy changes, review the security impact before changing this filter.

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

- This is a development scaffold and must pass the pull-request typecheck plus a real MCP Inspector test before deployment.
- The first version deliberately exposes no profiles, applications, payments, wallet, bookings, or write operations.
- Search results currently link to the general Khelgrid search page because a canonical public detail URL has not yet been confirmed.
- Add appropriate rate limiting and abuse monitoring before public release.
- Public app submission and listing are subject to OpenAI's current eligibility and review requirements.
