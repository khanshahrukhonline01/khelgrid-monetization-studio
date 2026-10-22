import { createFileRoute, Link } from "@tanstack/react-router";
import { SportsCalendar } from "@/components/calendar/SportsCalendar";
import { AIUSportsCalendarCard } from "@/components/calendar/AIUSportsCalendarCard";
import { buildSeoHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CalendarDays, Search } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => {
    const calendarSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://www.khelgrid.com/calendar#webpage",
      name: "Sports Selection Trials Calendar 2026–27 · KhelGrid",
      description:
        "Centralized sports calendar for selection trials, registration deadlines, and the official Association of Indian Universities (AIU) Inter-University Sports Calendar 2026–27.",
      url: "https://www.khelgrid.com/calendar",
      isPartOf: { "@id": "https://www.khelgrid.com/#website" },
      about: {
        "@type": "SportsOrganization",
        name: "KhelGrid",
        url: "https://www.khelgrid.com",
      },
    };

    return buildSeoHead({
      title: "Sports Selection Trials Calendar 2026–27 · KhelGrid",
      description:
        "Track sports selection trials and deadlines across India, and open the official AIU Inter-University Sports Calendar 2026–27.",
      canonicalPath: "/calendar",
      keywords:
        "sports calendar 2026-27, AIU sports calendar, inter-university championships India, sports trials calendar, selection trials India, registration deadlines, athlete planner",
      type: "website",
      customSchema: [calendarSchema],
    });
  },
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <main className="min-h-screen bg-background pb-16">
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-primary/10 via-background to-background py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-4 px-4 md:px-6">
          <Breadcrumbs
            customCrumbs={[
              { name: "Home", path: "/" },
              { name: "Sports Calendar", path: "/calendar" },
            ]}
          />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Centralized Sports Planner</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                All-India Sports Calendar
              </h1>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Track selection trials, reporting schedules and registration deadlines,
                alongside the official inter-university championship calendar for 2026–27.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-secondary"
              >
                <Search className="h-4 w-4 text-primary" />
                <span>Browse All Trials</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <AIUSportsCalendarCard />
        <SportsCalendar />
      </section>
    </main>
  );
}

export default CalendarPage;
