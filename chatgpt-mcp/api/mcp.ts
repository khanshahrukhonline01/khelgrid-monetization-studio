import { createClient } from "@supabase/supabase-js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type VercelResponse = {
  status(code: number): VercelResponse;
  setHeader(name: string, value: string): void;
  json(value: unknown): void;
  send(value: string): void;
  end(): void;
};

// The live opportunities_select RLS policy exposes only status = published to anon users.
const allowedStatuses = ["published"] as const;
const maxResults = 10;

type SportRelation = { name: string } | Array<{ name: string }> | null;
type PublicOpportunityRecord = {
  id: string;
  title: string;
  opportunity_type: string;
  sport?: SportRelation;
  description: string | null;
  eligibility: string | null;
  location_name: string | null;
  city: string | null;
  state: string | null;
  start_at: string | null;
  end_at: string | null;
  registration_deadline: string | null;
  fee: number | string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  requirements?: unknown;
};

function getSportName(sport: SportRelation | undefined): string | null {
  if (Array.isArray(sport)) return sport[0]?.name ?? null;
  return sport?.name ?? null;
}

function makeServer() {
  const server = new McpServer({
    name: "khelgrid-sports-opportunities",
    version: "0.1.0",
  });

  server.registerTool(
    "search_opportunities",
    {
      title: "Search Khelgrid sports opportunities",
      description:
        "Search publicly accessible Khelgrid sports trials, scholarships, camps, tournaments and other opportunities in India. Results are limited to records allowed by Supabase Row Level Security. Do not describe a record as verified unless the returned data explicitly establishes that.",
      inputSchema: {
        query: z.string().trim().max(120).optional().describe("Words to search in the title or description"),
        sport: z.string().trim().max(80).optional().describe("Sport name"),
        state: z.string().trim().max(80).optional().describe("Indian state or union territory"),
        city: z.string().trim().max(80).optional().describe("City"),
        type: z.enum(["trial", "tournament", "scholarship", "coaching", "job", "camp", "event", "other"]).optional(),
        limit: z.number().int().min(1).max(maxResults).optional().describe("Maximum results, 10 or fewer"),
      },
    },
    async ({ query, sport, state, city, type, limit }) => {
      const supabaseUrl = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        return { isError: true, content: [{ type: "text", text: "Khelgrid opportunity search is not configured yet." }] };
      }

      // Intentionally use the public anon key, never a service-role key.
      // Supabase RLS remains the authorization boundary for every request.
      const supabase = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      let request = supabase
        .from("opportunities")
        .select(`id,title,slug,opportunity_type,description,eligibility,location_name,city,state,start_at,end_at,registration_deadline,fee,status,metadata,sport:sports${sport ? "!inner" : ""}(name)`)
        .in("status", [...allowedStatuses])
        .order("start_at", { ascending: true, nullsFirst: false })
        .limit(Math.min(limit ?? 5, maxResults));

      if (query) {
        const safeQuery = query.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().slice(0, 120);
        if (safeQuery) request = request.or("title.ilike.%"+safeQuery+"%,description.ilike.%"+safeQuery+"%");
      }
      if (state) request = request.ilike("state", "%"+state+"%");
      if (city) request = request.ilike("city", "%"+city+"%");
      if (type) request = request.eq("opportunity_type", type);
      // Filter sport at the database level before applying the result limit.
      // The inner join ensures opportunities without a matching sport are excluded.
      if (sport) request = request.ilike("sport.name", "%" + sport.replace(/[%_]/g, " ").trim() + "%");

      const { data, error } = await request;
      if (error) {
        console.error("Khelgrid opportunity search failed:", error.code);
        return { isError: true, content: [{ type: "text", text: "Unable to search Khelgrid opportunities right now. Please try again later." }] };
      }

      const results = ((data ?? []) as PublicOpportunityRecord[]).map((item) => ({
        id: item.id,
        title: item.title,
        type: item.opportunity_type,
        sport: getSportName(item.sport),
        description: item.description,
        eligibility: item.eligibility,
        location: [item.location_name, item.city, item.state].filter(Boolean).join(", ") || null,
        starts_at: item.start_at,
        ends_at: item.end_at,
        registration_deadline: item.registration_deadline,
        fee: item.fee,
        status: item.status,
        details_url: "https://khelgrid.com/search",
        source_url: typeof item.metadata?.source_url === "string" && item.metadata.source_url.startsWith("https://")
          ? item.metadata.source_url
          : null,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify({ count: results.length, results }, null, 2) }],
        structuredContent: { count: results.length, results },
      };
    },
  );

  server.registerTool(
    "get_opportunity_details",
    {
      title: "Get Khelgrid opportunity details",
      description: "Retrieve one publicly accessible Khelgrid opportunity by its UUID. Only fields returned by the public RLS-protected query are exposed.",
      inputSchema: {
        id: z.string().uuid().describe("UUID of the opportunity"),
      },
    },
    async ({ id }) => {
      const supabaseUrl = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        return { isError: true, content: [{ type: "text", text: "Khelgrid opportunity details are not configured yet." }] };
      }
      const supabase = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase
        .from("opportunities")
        .select("id,title,slug,opportunity_type,description,eligibility,location_name,city,state,start_at,end_at,registration_deadline,fee,status,requirements,metadata,sport:sports(name)")
        .eq("id", id)
        .in("status", [...allowedStatuses])
        .maybeSingle();

      if (error) {
        console.error("Khelgrid opportunity detail lookup failed:", error.code);
        return { isError: true, content: [{ type: "text", text: "Unable to retrieve this opportunity right now." }] };
      }
      if (!data) {
        return { content: [{ type: "text", text: "No publicly accessible opportunity was found for that ID." }] };
      }

      const item = data as PublicOpportunityRecord;
      const result = {
        id: item.id,
        title: item.title,
        type: item.opportunity_type,
        sport: Array.isArray(item.sport) ? item.sport[0]?.name ?? null : item.sport?.name ?? null,
        description: item.description,
        eligibility: item.eligibility,
        requirements: item.requirements,
        location: [item.location_name, item.city, item.state].filter(Boolean).join(", ") || null,
        starts_at: item.start_at,
        ends_at: item.end_at,
        registration_deadline: item.registration_deadline,
        fee: item.fee,
        status: item.status,
        details_url: "https://khelgrid.com/search",
        source_url: typeof item.metadata?.source_url === "string" && item.metadata.source_url.startsWith("https://")
          ? item.metadata.source_url
          : null,
      };
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
    },
  );

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID");
  res.setHeader("Access-Control-Expose-Headers", "MCP-Session-Id, MCP-Protocol-Version");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const server = makeServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(
      req as unknown as Parameters<StreamableHTTPServerTransport["handleRequest"]>[0],
      res as unknown as Parameters<StreamableHTTPServerTransport["handleRequest"]>[1],
      req.body,
    );
  } catch (error) {
    console.error("Khelgrid MCP request failed:", error instanceof Error ? error.message : "unknown error");
    if (!res) return;
    res.status(500).json({ error: "Khelgrid MCP request failed" });
  } finally {
    await transport.close().catch(() => undefined);
    await server.close().catch(() => undefined);
  }
}
