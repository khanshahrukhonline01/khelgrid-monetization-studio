import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BellRing, CalendarDays, ShieldCheck, Trophy } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () =>
    buildSeoHead({
      title: "Login Coming Soon | KhelGrid",
      description:
        "KhelGrid account login and registration are coming soon. Explore public sports opportunities while we prepare secure account access.",
      canonicalPath: "/login",
      noindex: true,
      type: "website",
    }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-2xl rounded-3xl border border-border/70 bg-card p-7 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Trophy className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
          ACCOUNT ACCESS COMING SOON
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Your KhelGrid account is on the way
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          We’re preparing a reliable, secure sign-in experience for athletes, coaches, and sports
          academies. Login and registration are temporarily unavailable while we finish testing.
        </p>
        {search.redirect && (
          <p className="mx-auto mt-4 max-w-xl rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            The feature you selected will require an account. Please check back soon.
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Explore KhelGrid
          </Link>
          <Link
            to="/events"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Explore sports opportunities
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          We’ll reopen account access after end-to-end testing is complete.
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
