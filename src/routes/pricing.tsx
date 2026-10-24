import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  Zap,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  IndianRupee,
  Users,
  Award,
  HelpCircle,
  Briefcase,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export type MonetizationSectionKey = "all" | "pro" | "academy" | "micropayments" | "scouts";

const monetizationSearchSchema = z.object({
  section: fallback(z.enum(["all", "pro", "academy", "micropayments", "scouts"]), "all").default(
    "all",
  ),
});

export const MONETIZATION_SECTIONS_META: Record<
  MonetizationSectionKey,
  {
    title: string;
    description: string;
    canonical: string;
    keywords: string;
    headline: string;
    subheadline: string;
    badge: string;
  }
> = {
  all: {
    title: "Monetization Studio & Membership Pricing · KhelGrid",
    description:
      "Explore KhelGrid's Monetization Studio: Pro Athlete memberships (₹499/mo), Academy trial boosts (₹1,500/week), and single-trial micropayments (₹49). Transparent sports monetization across India.",
    canonical: "https://www.khelgrid.com/pricing",
    keywords:
      "khelgrid monetization studio, sports monetization india, athlete pro membership, academy boost, sports cv verification, trial micropayments",
    headline: "Monetization Studio & Pricing",
    subheadline:
      "Built for athletes, powered by academies, and trusted by scouts. Transparent sports monetization across India.",
    badge: "Monetization Studio",
  },
  pro: {
    title: "KhelGrid Pro Athlete Membership (₹499/mo) · Verified Sports CV & Priority Scouting",
    description:
      "Upgrade to KhelGrid Pro for ₹499/mo. Unlock unlimited trial applications, verified digital sports CV, priority placement in scout talent pools, and AI training playbook.",
    canonical: "https://www.khelgrid.com/pricing?section=pro",
    keywords:
      "khelgrid pro, athlete pro membership, verified sports cv, priority scouting, unlimited trial applications, sports passport india",
    headline: "KhelGrid Pro Athlete Membership",
    subheadline:
      "Unlimited selection trial applications, verified digital sports credentials, and direct scout discovery across 28 states.",
    badge: "Athlete Monetization",
  },
  academy: {
    title: "Academy Trial Boost & Listing Sponsorship (₹1,500) · Reach 50,000+ Athletes",
    description:
      "Boost your sports trials and academy admissions with KhelGrid Academy Boost for ₹1,500/week. Highlight listings with glowing badges, applicant CRM, and priority push notifications.",
    canonical: "https://www.khelgrid.com/pricing?section=academy",
    keywords:
      "academy trial boost, sports academy sponsorship, promote sports trial, reach athletes india, academy admissions boost",
    headline: "Academy Trial Boost & Listing Sponsorship",
    subheadline:
      "Feature your upcoming selection trials at the top of national search and category pages. Reach 50,000+ verified khiladis.",
    badge: "Academy Growth Studio",
  },
  micropayments: {
    title: "Pay-Per-Trial Micropayments (₹49) · Flexible Application Passes",
    description:
      "Access flexible single-trial micropayments starting at ₹49 per application with zero recurring commitments. UPI, wallet, and NetBanking supported.",
    canonical: "https://www.khelgrid.com/pricing?section=micropayments",
    keywords:
      "pay per trial, trial micropayments, single trial pass, sports application fee, upi sports booking",
    headline: "Pay-Per-Trial Flexible Micropayments",
    subheadline:
      "No recurring subscriptions required. Enjoy 2 free trial applications, then unlock individual trials for just ₹49 via UPI.",
    badge: "Micropayment Passes",
  },
  scouts: {
    title: "Scout & Partner Monetization Network · Grassroots Talent Intelligence",
    description:
      "Partner with KhelGrid's talent monetization network. Access filtered athlete dossiers, verified tournament statistics, and grassroots recruitment pipelines across 28 states.",
    canonical: "https://www.khelgrid.com/pricing?section=scouts",
    keywords:
      "sports scout network, talent monetization, athlete dossiers, grassroots sports intelligence, partner sports academy",
    headline: "Scout & Talent Partner Monetization Network",
    subheadline:
      "Empowering verified scouts, sports clubs, and collegiate recruiters with tamper-evident athletic dossiers and recruitment channels.",
    badge: "Scout Intelligence",
  },
};

export const Route = createFileRoute("/pricing")({
  validateSearch: zodValidator(monetizationSearchSchema),
  head: () =>
    buildSeoHead({
      title: "Monetization Studio & Membership Pricing · KhelGrid",
      description:
        "Transparent pricing for aspiring athletes, verified coaches, and sports academies. Explore Free, Pro Athlete, and Academy Listing Boost tiers.",
      canonicalPath: "/pricing",
      keywords:
        "KhelGrid pricing, sports academy subscription, athlete pro plan, trial boost, monetization studio",
      type: "website",
    }),
  component: Pricing,
});

const TIERS = [
  {
    id: "micropayments",
    name: "Free & Micropayments",
    price: "₹0 / ₹49",
    period: "pay-as-you-go",
    icon: Zap,
    desc: "Get started with 2 free trial applications, then unlock individual passes at ₹49.",
    features: [
      "2 free trial applications included",
      "Pay ₹49 per extra application via UPI",
      "Public athlete profile & score records",
      "Access to grassroots pickup games lobby",
      "Instant notification on new trials",
    ],
    cta: "Current plan",
    sectionTarget: "micropayments" as MonetizationSectionKey,
    highlight: false,
  },
  {
    id: "pro",
    name: "KhelGrid Pro Athlete",
    price: "₹499",
    period: "/ month",
    icon: Crown,
    highlight: true,
    desc: "Unlimited trial applications, verified digital Sports CV, and priority scout visibility.",
    features: [
      "Unlimited selection trial applications",
      "Tamper-proof Verified Sports CV (QR-enabled)",
      "Priority placement in national scout directories",
      "Unlimited AI Guide & training drill roadmaps",
      "Talent Scanner pro combine fitness benchmarks",
      "Zero per-application platform convenience fees",
    ],
    cta: "Upgrade to Pro",
    sectionTarget: "pro" as MonetizationSectionKey,
  },
  {
    id: "academy",
    name: "Academy Trial Boost",
    price: "₹1,500",
    period: "/ 7-day boost",
    icon: Flame,
    desc: "For academy directors and organizers — pin trials to the top and reach 50,000+ athletes.",
    features: [
      "Pinned 'Featured' top placement for 7 days",
      "Glowing golden radar border & high-visibility banner",
      "Direct push & email broadcast to regional athletes",
      "Organizer dashboard with applicant CRM & CSV export",
      "Direct phone & WhatsApp leads routing",
    ],
    cta: "Boost a trial",
    sectionTarget: "academy" as MonetizationSectionKey,
    highlight: false,
  },
];

const MONETIZATION_SECTIONS: Array<{
  key: MonetizationSectionKey;
  label: string;
  icon: typeof Zap;
}> = [
  { key: "all", label: "Studio Overview", icon: Sparkles },
  { key: "pro", label: "Athlete Pro (₹499)", icon: Crown },
  { key: "academy", label: "Academy Boost (₹1,500)", icon: Flame },
  { key: "micropayments", label: "Micropayments (₹49)", icon: Zap },
  { key: "scouts", label: "Scout Network", icon: Briefcase },
];

function Pricing() {
  const search = Route.useSearch();
  const activeSection: MonetizationSectionKey = search.section || "all";
  const navigate = useNavigate({ from: "/pricing" });
  const { plan, upgradeToPro } = useAuth();

  const currentMeta = MONETIZATION_SECTIONS_META[activeSection] || MONETIZATION_SECTIONS_META.all;

  const handleSelectSection = (key: MonetizationSectionKey) => {
    navigate({
      search: (prev) => ({
        ...prev,
        section: key,
      }),
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      {/* Dynamic React Helmet Async Management for Key Monetization Studio Sections */}
      <Helmet>
        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.description} />
        <meta name="keywords" content={currentMeta.keywords} />
        <link rel="canonical" href={currentMeta.canonical} />
        <meta property="og:title" content={currentMeta.title} />
        <meta property="og:description" content={currentMeta.description} />
        <meta property="og:url" content={currentMeta.canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={currentMeta.title} />
        <meta name="twitter:description" content={currentMeta.description} />
      </Helmet>

      {/* Header & Section Title */}
      <div className="text-center">
        <Badge
          variant="outline"
          className="border-primary/40 bg-primary/10 text-primary font-semibold px-3 py-1"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5 inline text-primary" /> {currentMeta.badge}
        </Badge>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          {currentMeta.headline}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          {currentMeta.subheadline}
        </p>
      </div>

      {/* Interactive Monetization Studio Section Switcher (Dynamic Helmet triggers) */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-border bg-card/80 p-1 shadow-xs no-scrollbar">
          {MONETIZATION_SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectSection(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Monetization Plans Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => {
          const isSelected = activeSection === t.sectionTarget;
          return (
            <div
              key={t.name}
              className={`relative rounded-3xl border bg-gradient-card p-6 sm:p-7 transition-all ${
                isSelected
                  ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                  : t.highlight
                    ? "border-primary/50 shadow-md"
                    : "border-border hover:border-primary/30"
              }`}
            >
              {t.highlight && (
                <Badge className="absolute -top-3 right-6 bg-gradient-hero text-primary-foreground border-0 font-bold px-3 py-0.5 shadow-sm">
                  Most Popular
                </Badge>
              )}
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  t.highlight ? "bg-gradient-hero shadow-xs" : "bg-secondary"
                }`}
              >
                <t.icon
                  className={`h-6 w-6 ${t.highlight ? "text-primary-foreground" : "text-primary"}`}
                />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{t.name}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {t.price}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>

              <div className="my-6 border-t border-border/60" />

              <ul className="space-y-2.5 text-xs text-muted-foreground">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 leading-relaxed">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary font-bold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {t.id === "pro" ? (
                  plan === "pro" ? (
                    <Button disabled className="w-full rounded-xl">
                      You&apos;re on Pro 🎉
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        upgradeToPro();
                        toast.success("Welcome to KhelGrid Pro!");
                      }}
                      className="w-full rounded-xl bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-md cursor-pointer font-bold"
                    >
                      {t.cta}
                    </Button>
                  )
                ) : t.id === "academy" ? (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl font-semibold cursor-pointer"
                  >
                    <Link to="/search">{t.cta}</Link>
                  </Button>
                ) : (
                  <Button disabled variant="secondary" className="w-full rounded-xl">
                    {t.cta}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Value Proposition Highlights for Scouts & Monetization */}
      <div className="mt-14 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 backdrop-blur-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Zero Fake Trials Guarantee</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Every opportunity and academy listed on KhelGrid is cross-audited against official
                state federations and SAI rosters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Instant UPI & Wallet Payouts</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Affordable micropayments at ₹49 per application with zero hidden subscriptions and
                safe 256-bit encryption.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Verified Scouts & Selectors</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Connect directly with national federation selectors and NIS-accredited academy
                scouts across 28 states.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Pricing;
