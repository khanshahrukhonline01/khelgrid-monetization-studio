import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  Users2,
  FileCheck,
  Ban,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTouchScroll } from "@/hooks/use-touch-scroll";

export const VERIFICATION_PILLARS = [
  {
    title: "Direct Source Audit",
    icon: FileCheck,
    tag: "Source links where available",
    desc: "Listings include a source link where available. Check the original notice for current dates, eligibility, and application instructions."
  },
  {
    title: "Zero Exploitation Policy",
    icon: Ban,
    tag: "No Broker Scams",
    desc: "We encourage athletes and families to be cautious with unofficial agents, guaranteed-selection promises, and payment requests that are not in the published notice."
  },
  {
    title: "Direct Organizer Connect",
    icon: Users2,
    tag: "Confirm with organizer",
    desc: "Contact details and reporting instructions may not be available in every source. Confirm them through the organizer’s official channel before travelling."
  },
  {
    title: "National SAI Alignment",
    icon: ShieldCheck,
    tag: "Sports Authority of India",
    desc: "For relevant listings, compare the linked report with SAI, federation, or state sports department announcements. A source link does not imply endorsement."
  },
] as const;

export function HomeCommunityImpactSection() {
  const { scrollRef, scroll } = useTouchScroll(280);

  return (
    <section
      id="community-impact"
      aria-label="Sports opportunity source information and safety guidance"
      className="w-full min-w-0 max-w-full py-2"
    >
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-card shadow-sm">
        <div className="grid lg:grid-cols-12 gap-0 items-stretch w-full min-w-0 max-w-full">
          {/* Left Column: Visual Showcase & Verification Statement */}
          <div className="relative lg:col-span-5 min-w-0 max-w-full flex flex-col justify-between overflow-hidden bg-muted p-5 sm:p-7 lg:p-8 min-h-[260px] sm:min-h-[300px]">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/khelgrid_academy_showcase_1790836301666.jpg"
                alt="Modern Indian sports training and athlete trial center"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35"
              />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Source-aware listings</span>
              </div>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl leading-snug">
                Check the source before you apply
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/80">
                Trial notices can change or omit important details. KhelGrid
                links to published sources where available and encourages athletes and families to
                confirm requirements before travelling or paying.
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-2 text-white text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[11px] sm:text-xs truncate">
                    Source links where available
                  </span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Users2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-[11px] sm:text-xs truncate">
                    Athletes and families welcome
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The KhelGrid Promise Audit Pillars */}
          <div className="lg:col-span-7 min-w-0 max-w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-hidden">
            <div className="w-full min-w-0 max-w-full">
              {/* Pillar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-border/60 w-full min-w-0">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="truncate">The KhelGrid Promise</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    Source details and practical checks · Swipe to
                    view
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scroll("left")}
                      aria-label="Scroll pillars left"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scroll("right")}
                      aria-label="Scroll pillars right"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    to="/partner"
                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <span>Partner Trust</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Horizontally Scrollable Pillar Cards across all screen devices */}
              <div
                ref={scrollRef}
                className="mt-3.5 flex w-full min-w-0 max-w-full items-stretch gap-3 overflow-x-auto no-scrollbar touch-scroll-rail pb-2 pt-1 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
              >
                {VERIFICATION_PILLARS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="snap-start shrink-0 w-[78vw] max-w-[260px] sm:w-[250px] flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-emerald-500/40 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border/50">
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {p.tag}
                          </span>
                          <Icon className="h-4 w-4 text-emerald-500 shrink-0" />
                        </div>
                        <h4 className="mt-2.5 text-xs sm:text-sm font-bold text-foreground">
                          {p.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                          {p.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/50 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>Review source and status</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Partner Callout */}
            <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3.5 border-t border-border/60 text-xs w-full min-w-0">
              <span className="text-muted-foreground text-[11px] sm:text-xs">
                Are you an official sports federation, state association, or trial organizer?
              </span>
              <Link
                to="/partner"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline shrink-0"
              >
                <span>Verify Selection Trials with KhelGrid</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
