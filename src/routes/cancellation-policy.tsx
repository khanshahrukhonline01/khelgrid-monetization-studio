import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RotateCcw,
  Clock,
  ShieldCheck,
  Calendar,
  CloudRain,
  CreditCard,
  AlertCircle,
  Mail,
  CheckCircle2,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/cancellation-policy")({
  head: () =>
    buildSeoHead({
      title: "Cancellation & Refund Policy · Turf Bookings, Trials & Subscriptions | KhelGrid",
      description:
        "Official cancellation, refund, rescheduling, and weather policies for turf & court bookings, academy trials, coaching sessions, and Pro memberships on KhelGrid.",
      canonicalPath: "/cancellation-policy",
      keywords:
        "KhelGrid cancellation policy, sports refund policy, turf booking cancellation, trial refund India, rainout weather guarantee, sports subscription refund",
      type: "website",
      customSchema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Cancellation & Refund Policy · KhelGrid",
        url: "https://www.khelgrid.com/cancellation-policy",
        description:
          "Official cancellation, refund, rescheduling, and weather policies for turf & court bookings, academy trials, coaching sessions, and Pro memberships on KhelGrid.",
        publisher: {
          "@type": "Organization",
          name: "KhelGrid",
          url: "https://www.khelgrid.com",
        },
        mainEntity: {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the cancellation and refund policy for turf and court bookings?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Bookings cancelled more than 24 hours prior receive a 100% refund or wallet credit. Cancellations between 4 and 24 hours prior receive a 50% refund. Cancellations within 4 hours or no-shows are non-refundable.",
              },
            },
            {
              "@type": "Question",
              name: "What happens if it rains or weather disrupts my turf slot?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under KhelGrid's Weather & Rainout Guarantee, if a ground manager certifies that the pitch is unplayable due to heavy rains or lighting failure, you receive a 100% automatic wallet credit or free rescheduling.",
              },
            },
            {
              "@type": "Question",
              name: "How long do refunds take to process?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "KhelGrid Wallet refunds are instant (0 seconds). Card, NetBanking, and UPI refunds are processed via official payment gateways within 5 to 7 business days.",
              },
            },
          ],
        },
      },
    }),
  component: CancellationPolicyPage,
});

const BOOKING_TIERS = [
  {
    window: "More than 24 Hours Prior",
    refund: "100% Full Refund",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    details:
      "Cancel at least 24 hours before your reserved slot for a 100% full refund back to your original payment method or instant 100% credit to your KhelGrid Wallet.",
  },
  {
    window: "4 to 24 Hours Prior",
    refund: "50% Partial Refund",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    details:
      "Cancellations between 4 and 24 hours prior receive a 50% refund. The remaining 50% covers facility reservation lockouts and compensation for the venue operator.",
  },
  {
    window: "Under 4 Hours / No Show",
    refund: "Non-Refundable",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    details:
      "Cancellations within 4 hours of start time or no-shows are strictly non-refundable as the pitch/court slot was blocked and unavailable to other athletes.",
  },
];

const SERVICE_POLICIES = [
  {
    icon: Calendar,
    title: "1. Turf, Court & Sports Facility Bookings",
    summary:
      "Applies to all hourly pitch, indoor badminton court, turf football, box cricket, and swimming pool bookings reserved through the KhelGrid booking engine.",
    rules: [
      "Free Rescheduling: 1 complimentary reschedule is permitted per booking if requested at least 6 hours before slot commencement, subject to venue availability.",
      "Weather & Rainout Guarantee: If unplayable weather (waterlogging, severe rainstorm) or venue lighting failure occurs, the ground manager will certify the status, and you receive an automatic 100% wallet credit or rescheduled slot.",
      "Maintenance Lockouts: If a venue cancels due to emergency turf maintenance, you are entitled to an immediate 100% refund plus ₹50 KhelGrid booking credit.",
    ],
  },
  {
    icon: BadgeCheck,
    title: "2. Academy Trials & Scouting Assessments",
    summary:
      "Applies to paid registrations for sanctioned trials, state selection camps, and scout assessments hosted on KhelGrid.",
    rules: [
      "Cancellation Before Cut-Off: If you withdraw before the official registration deadline stated on the trial page, you will receive a full refund minus nominal payment gateway processing charges (typically 2-3%).",
      "Cancellation After Cut-Off: Once registration closes and player bibs/schedules are generated, trial fees become non-refundable.",
      "Postponed or Cancelled Trials: If an academy or organizer cancels or postpones a trial date, all registered athletes receive an automatic 100% full refund without deduction.",
    ],
  },
  {
    icon: CreditCard,
    title: "3. Pro Subscriptions & Digital Passes",
    summary:
      "Applies to KhelGrid Pro athlete memberships, Academy Partner passes, and Scout portal access.",
    rules: [
      "7-Day Satisfaction Guarantee: First-time purchasers of an annual Pro membership may request a 100% refund within 7 days of initial purchase if unsatisfied.",
      "Monthly Subscriptions: You can cancel your subscription renewal anytime from Settings. Your Pro benefits remain active until the end of the current billing cycle.",
      "Trial Passes & Digital Unlocks: One-time trial unlock fees and scout profile contact passes are non-refundable once contact credentials have been revealed.",
    ],
  },
  {
    icon: Clock,
    title: "4. Coaching Clinics & Personal Training Sessions",
    summary:
      "Applies to sessions booked directly with verified NIS, BCCI, or AIFF accredited coaches.",
    rules: [
      "Session Cancellation: Trainees may cancel or reschedule a coaching session up to 24 hours in advance with zero penalty.",
      "Coach No-Show: If a coach fails to attend without 12-hour prior notice, the athlete receives an immediate 100% refund and a ₹100 session compensation voucher.",
    ],
  },
];

function CancellationPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Platform Legal Terms
        </Badge>
        <span className="text-xs text-muted-foreground">Effective Date: January 1, 2026</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Cancellation & Refund Policy
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        At KhelGrid, we are committed to transparent, athlete-friendly booking practices. This
        policy outlines cancellation rules, refund windows, rescheduling terms, and rainout
        guarantees across all sports facilities, academy trials, and digital subscriptions.
      </p>

      {/* Quick Summary Strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {BOOKING_TIERS.map((tier) => (
          <div
            key={tier.window}
            className="flex flex-col justify-between rounded-2xl border border-border bg-gradient-card p-5 shadow-sm"
          >
            <div>
              <span className="text-xs font-semibold text-muted-foreground">{tier.window}</span>
              <div className="mt-2">
                <Badge variant="outline" className={`text-xs font-bold ${tier.badgeColor}`}>
                  {tier.refund}
                </Badge>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{tier.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Service Policies */}
      <div className="mt-12 space-y-8">
        {SERVICE_POLICIES.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.title}
              className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <p className="mt-3 text-xs text-muted-foreground sm:text-sm leading-relaxed">
                {section.summary}
              </p>
              <ul className="mt-4 space-y-2.5">
                {section.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-foreground sm:text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Refund Processing Timelines */}
      <section className="mt-12 rounded-3xl border border-border bg-gradient-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            5. Refund Processing Timelines & Modes
          </h2>
        </div>
        <p className="mt-3 text-xs text-muted-foreground sm:text-sm leading-relaxed">
          Refunds are routed through the original payment channel or credited directly to your
          KhelGrid digital wallet:
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              KhelGrid Wallet Balance
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">Instantaneous (Within Seconds)</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Immediately spendable for any future turf booking, coaching clinic, or trial
              registration without processing fees.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              UPI, Credit / Debit Card & NetBanking
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">5 to 7 Banking Days</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Processed through RBI-compliant payment gateways (Razorpay, Cashfree). Subject to your
              bank&apos;s settlement schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Grievance Redressal */}
      <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            6. Dispute Resolution & Grievance Desk
          </h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm leading-relaxed">
          If you experienced an unfulfilled booking, facility dispute, or refund delay, contact our
          dedicated payments desk. All disputes are reviewed within 24 business hours.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
          <a
            href="mailto:refunds@khelgrid.com"
            className="flex items-center gap-1.5 text-primary hover:underline font-semibold"
          >
            <Mail className="h-3.5 w-3.5" /> refunds@khelgrid.com
          </a>
          <span className="text-muted-foreground">|</span>
          <Link to="/contact" className="text-primary hover:underline">
            Help Center & Contact Us →
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service →
          </Link>
        </div>
      </section>
    </main>
  );
}
