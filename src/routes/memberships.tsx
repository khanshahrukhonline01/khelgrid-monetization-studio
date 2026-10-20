import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MEMBERSHIPS, KHELGRID_CITIES } from "@/data/khelgrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/memberships")({
  head: () =>
    buildSeoHead({
      title: "Sports Memberships, Turf Passes & Academy Subscriptions · KhelGrid",
      description:
        "Exclusive monthly and annual sports memberships for turfs, swimming pools, fitness centers, and cricket academies with unlimited access and priority booking perks.",
      canonicalPath: "/memberships",
      keywords:
        "sports memberships India, monthly turf pass, gym and badminton membership, cricket academy pass",
      type: "website",
    }),
  component: MembershipsPage,
});

function MembershipsPage() {
  const [city, setCity] = useState("All");
  const list = useMemo(() => MEMBERSHIPS.filter((m) => city === "All" || m.city === city), [city]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Venue memberships</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lock in hours, perks and priority access at your favourite venues.
        </p>
      </div>

      <div className="mt-4">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-10 w-[180px] bg-secondary/40 border-border">
            <MapPin className="mr-1 h-4 w-4 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            {KHELGRID_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <div
            key={m.id}
            className={`relative rounded-2xl border bg-gradient-card p-5 transition-all hover:-translate-y-0.5 ${
              m.popular ? "border-primary/50 animate-pulse-glow" : "border-border"
            }`}
          >
            {m.popular && (
              <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-gradient-hero px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                <Crown className="h-3 w-3" /> Popular
              </span>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="border-border text-[10px]">
                {m.sport}
              </Badge>
              <span>·</span>
              <span>{m.durationMonths === 12 ? "Annual" : `${m.durationMonths} months`}</span>
            </div>
            <h3 className="mt-2 text-lg font-bold">{m.name}</h3>
            <p className="text-sm text-muted-foreground">
              {m.venue} · {m.city}
            </p>

            <div className="mt-4 flex items-end gap-1">
              <span className="text-3xl font-bold">₹{m.price.toLocaleString("en-IN")}</span>
              <span className="mb-1 text-xs text-muted-foreground">/ {m.durationMonths}mo</span>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm">
              {m.perks.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-5 w-full rounded-full"
              onClick={() => toast.success(`${m.name} added to wallet`)}
            >
              Get membership
            </Button>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No memberships available in this city yet.
          </div>
        )}
      </div>
    </main>
  );
}
