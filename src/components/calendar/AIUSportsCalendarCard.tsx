import { ExternalLink, GraduationCap, CalendarDays, FileText } from "lucide-react";

const AIU_CALENDAR_PDF =
  "https://aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf";
const AIU_HOME = "https://aiu.ac.in/";

export function AIUSportsCalendarCard() {
  return (
    <section
      aria-labelledby="aiu-calendar-heading"
      className="mb-6 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-sm"
    >
      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Official university sports calendar
            </span>
            <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              2026–27 season
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 id="aiu-calendar-heading" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              AIU Inter-University Sports Calendar 2026–27
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              The Association of Indian Universities (AIU) annual calendar lists
              inter-university championships across India, including all-India,
              four-zone and multi-zone competitions. Use the official PDF to check
              the sport-wise schedule and confirm event details with your university.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/70 px-2.5 py-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              All-India & zonal championships
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/70 px-2.5 py-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Official AIU PDF
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Calendar reference: AIU publication. Dates, eligibility and entry deadlines
            should be verified in the PDF and with the participating university.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:min-w-48 md:flex-col">
          <a
            href={AIU_CALENDAR_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FileText className="h-4 w-4" />
            Open official calendar
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={AIU_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Visit AIU website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
