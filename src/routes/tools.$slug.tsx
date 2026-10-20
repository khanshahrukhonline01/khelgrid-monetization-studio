import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TOOLS_CATALOG } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Wrench, Sparkles } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = TOOLS_CATALOG.find((t) => t.slug === params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData, params }) => {
    const tool = loaderData?.tool;
    if (!tool) {
      return buildSeoHead({
        title: "Athlete Tool · KhelGrid",
        description:
          "Free interactive athletic calculators, tournament planners, and trial readiness tools to optimize training routines and scouting preparation.",
        canonicalPath: `/tools/${params.slug}`,
      });
    }

    return buildSeoHead({
      title: `${tool.name} · KhelGrid Athlete Tools`,
      description: tool.blurb,
      canonicalPath: `/tools/${tool.slug}`,
      keywords: `${tool.name}, athlete calculator, sports tool, trial preparation`,
      noindex: true,
      type: "website",
    });
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Tool not found</h1>
      <Button asChild className="mt-6">
        <Link to="/tools">All tools</Link>
      </Button>
    </div>
  ),
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const run = () => {
    const filled = tool.inputs.filter((i: { label: string }) => values[i.label]?.trim()).length;
    const score = Math.min(100, 40 + filled * 20 + Math.floor(Math.random() * 15));
    setResult(
      `Estimate: ${score}/100 · Based on ${filled}/${tool.inputs.length} inputs. Tap "Browse trials" to act on it.`,
    );
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground">
        ← All tools
      </Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">
        <Wrench className="mr-1 h-3 w-3" />
        {tool.category}
      </Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
      <p className="mt-2 text-muted-foreground">{tool.blurb}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-gradient-card p-5">
        {tool.inputs.map((i: { label: string; placeholder: string }) => (
          <label key={i.label} className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {i.label}
            </span>
            <input
              placeholder={i.placeholder}
              value={values[i.label] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [i.label]: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
            />
          </label>
        ))}
        <Button
          onClick={run}
          className="w-full bg-gradient-hero text-primary-foreground hover:opacity-95"
        >
          <Sparkles className="mr-1 h-4 w-4" /> Calculate
        </Button>
        {result && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
            {result}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/tools">More tools</Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="bg-gradient-hero text-primary-foreground hover:opacity-95"
        >
          <Link
            to="/search"
            search={{
              q: "",
              sport: "All Sports",
              city: "All Locations",
              sort: "Soonest",
              free: false,
            }}
          >
            Browse trials
          </Link>
        </Button>
      </div>
    </main>
  );
}
