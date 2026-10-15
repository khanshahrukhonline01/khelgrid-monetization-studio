import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import { SEO } from "@/components/seo/SEO";

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildSeoHead({
      title: "Membership Plans & Pricing for Athletes & Academies · KhelGrid",
      description:
        "Transparent pricing for aspiring athletes, verified coaches, and sports academies. Explore Free, Pro Athlete, and Academy Listing Boost tiers.",
      canonicalPath: "/pricing",
      keywords: "KhelGrid pricing, sports academy subscription, athlete pro plan, trial boost",
      type: "website",
    }),
  component: Pricing,
});

const TIERS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    icon: Zap,
    desc: "Get started with 2 applications and a basic profile.",
    features: ["2 trial applications", "Browse all trials", "Basic profile", "Community access"],
    cta: "Current plan",
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/ month",
    icon: Crown,
    highlight: true,
    desc: "Unlimited applications, Verified CV, AI Guide.",
    features: [
      "Unlimited applications",
      "Verified Sports CV included",
      "AI Guide unlimited",
      "Priority scout placement",
      "Talent Scanner pro tests",
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Academy",
    price: "₹1,500",
    period: "/ 7-day boost",
    icon: Flame,
    desc: "For organizers — boost trials and reach scouts.",
    features: [
      "Featured listing for 7 days",
      "Organizer analytics dashboard",
      "Applicant management tools",
      "Bulk applicant export",
    ],
    cta: "Boost a trial",
  },
];

function Pricing() {
  const { plan, upgradeToPro } = useAuth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <SEO
        title="Membership Plans & Pricing for Athletes & Academies · KhelGrid"
        description="Transparent pricing for aspiring athletes, verified coaches, and sports academies. Explore Free, Pro Athlete, and Academy Listing Boost tiers."
        canonicalUrl="/pricing"
        keywords="KhelGrid pricing, sports academy subscription, athlete pro plan, trial boost"
      />
      <div className="text-center">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
          Pricing
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, athlete-friendly pricing
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          No hidden fees. Cancel anytime. UPI, wallet and cards accepted.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border bg-gradient-card p-6 ${
              t.highlight ? "border-primary/50 animate-pulse-glow" : "border-border"
            }`}
          >
            {t.highlight && (
              <Badge className="absolute -top-2 right-4 bg-gradient-gold text-primary-foreground border-0">
                Most popular
              </Badge>
            )}
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${t.highlight ? "bg-gradient-hero" : "bg-secondary"}`}
            >
              <t.icon
                className={`h-5 w-5 ${t.highlight ? "text-primary-foreground" : "text-primary"}`}
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{t.name}</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {t.name === "Pro" ? (
                plan === "pro" ? (
                  <Button disabled className="w-full">
                    You're on Pro 🎉
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      upgradeToPro();
                      toast.success("Welcome to Pro!");
                    }}
                    className="w-full bg-gradient-hero text-primary-foreground hover:opacity-95"
                  >
                    {t.cta}
                  </Button>
                )
              ) : t.name === "Academy" ? (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/trials">{t.cta}</Link>
                </Button>
              ) : (
                <Button disabled variant="secondary" className="w-full">
                  {t.cta}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
