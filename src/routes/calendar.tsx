import { createFileRoute, Link } from "@tanstack/react-router";
import { SportsCalendar } from "@/components/calendar/SportsCalendar";
import { buildSeoHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  CalendarDays,
  Trophy,
  Filter,
  Download,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  head: () => {
    const calendarSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://khelgrid.com/calendar#webpage",
      name: "Sports Selection Trials Calendar 2026 · Monthly Schedule · KhelGrid",
      description:
        "Centralized monthly sports calendar aggregating upcoming selection trials, SAI NCOE dates, BCCI cricket combines, government sports quotas, and registration deadlines across India.",
      url: "https://khelgrid.com/calendar",
      isPartOf: { "@id": "https://khelgrid.com/#website" },
      about: {
        "@type": "SportsOrganization",
        name: "KhelGrid",
        url: "https://khelgrid.com",
      },
    };

    return buildSeoHead({
      title: "Sports Selection Trials Calendar 2026 · Monthly Schedule · KhelGrid",
      description:
        "Centralized monthly sports calendar aggregating upcoming selection trials, SAI NCOE dates, BCCI cricket combines, government sports quotas, and registration deadlines across India.",
      canonicalPath: "/calendar",
      keywords:
        "sports calendar 2026, sports trials calendar, upcoming selection trials India, SAI NCOE trial dates, BCCI selection trials calendar, registration deadlines sports 2026, sports quota schedule, athlete monthly planner",
      type: "website",
      customSchema: [calendarSchema],
    });
  },
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-primary/10 via-background to-background py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-4">
          <Breadcrumbs
            customCrumbs={[
              { name: "Home", path: "/" },
              { name: "Sports Calendar", path: "/calendar" },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Centralized Sports Planner</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                All-India Sports Selection Trials Calendar
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Plan your competitive season. Track confirmed open trials, reporting schedules,
                registration deadlines, and academy combine dates in one synchronized monthly view.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition shadow-xs"
              >
                <Search className="h-4 w-4 text-primary" />
                <span>Browse All Trials</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calendar Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-6">
        <SportsCalendar />
      </section>
    </main>
  );
}

export default CalendarPage;
