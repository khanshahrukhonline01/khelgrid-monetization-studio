import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileText,
  Mail,
  Scale,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Lock,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/posh-policy")({
  head: () =>
    buildSeoHead({
      title: "POSH Policy · Prevention of Sexual Harassment & Safe Sports | KhelGrid",
      description:
        "KhelGrid's zero-tolerance POSH Policy under the Sexual Harassment of Women at Workplace Act 2013 and National Safe Sports guidelines. Protecting athletes, coaches, and staff.",
      canonicalPath: "/posh-policy",
      keywords:
        "POSH policy sports India, prevention of sexual harassment sports, safe sports athlete protection, KhelGrid POSH committee, ICC complaint procedure, athlete safeguarding",
      type: "website",
      customSchema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Prevention of Sexual Harassment (POSH) & Athlete Safeguarding Policy · KhelGrid",
        url: "https://www.khelgrid.com/posh-policy",
        description:
          "KhelGrid's zero-tolerance POSH Policy under the Sexual Harassment of Women at Workplace Act 2013 and National Safe Sports guidelines. Protecting athletes, coaches, and staff.",
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
              name: "What is KhelGrid's POSH and Safe Sports policy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "KhelGrid enforces a strict zero-tolerance policy against sexual harassment across all athletic facilities, academies, trials, and operations under the POSH Act 2013 and Safe Sports guidelines.",
              },
            },
            {
              "@type": "Question",
              name: "How do I report a confidential grievance to the ICC?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Aggrieved individuals can submit a confidential written complaint directly to the Internal Complaints Committee at posh@khelgrid.com. All inquiries are conducted under strict statutory confidentiality within 90 days.",
              },
            },
            {
              "@type": "Question",
              name: "How are minor athletes protected under the policy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Any allegations involving athletes under 18 years of age are governed under the Protection of Children from Sexual Offences (POCSO) Act, requiring immediate reporting to law enforcement and immediate suspension of the accused.",
              },
            },
          ],
        },
      },
    }),
  component: PoshPolicyPage,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Zero Tolerance Across Sports & Operations",
    body: "Strict prohibition of any unwelcome physical, verbal, or non-verbal conduct of a sexual nature across all workplaces, training camps, affiliated academies, partnered turfs, and trial venues.",
  },
  {
    icon: Scale,
    title: "Independent Complaints Committee (ICC)",
    body: "An autonomous Internal Complaints Committee chaired by a senior woman leader, featuring external NGO representatives specializing in women's rights and child protection.",
  },
  {
    icon: Lock,
    title: "Absolute Confidentiality",
    body: "Mandatory statutory protection of the identity of the aggrieved individual, respondents, witnesses, and inquiry records as prescribed under Section 16 of the POSH Act.",
  },
  {
    icon: HeartHandshake,
    title: "Anti-Retaliation Protection",
    body: "Guaranteed protection against any form of adverse career action, trial disqualification, academy expulsion, or reprisal for reporting a grievance or participating as a witness.",
  },
];

const PROHIBITED_CONDUCT = [
  "Unwelcome physical contact, advances, or inappropriate physical touching during coaching, fitness drills, or travel.",
  "Demanding, suggesting, or implying sexual favors in exchange for trial selection, playing time, scouting recommendations, or sponsorship ('quid pro quo').",
  "Sexually colored or derogatory remarks regarding an athlete's body, physical attire, private life, or gender identity.",
  "Showing pornography, sexually explicit videos, memes, or unsolicited messages across digital communication channels.",
  "Creating an intimidating, hostile, humiliating, or offensive training or workplace environment.",
];

const REDRESSAL_STEPS = [
  {
    step: "1",
    title: "Filing a Complaint",
    desc: "An aggrieved woman or authorized representative may submit a written complaint to the Internal Complaints Committee within 3 months of the date of the incident (extendable by the ICC with recorded reasons). Complaints can be lodged directly via posh@khelgrid.com.",
  },
  {
    step: "2",
    title: "Conciliation (Optional)",
    desc: "Prior to initiating a formal inquiry, at the request of the complainant, the ICC may take steps to settle the matter through conciliation. No monetary settlement is permitted as the basis of conciliation.",
  },
  {
    step: "3",
    title: "Formal Inquiry Procedure",
    desc: "The ICC conducts an impartial inquiry in compliance with the principles of natural justice. Both parties are given full opportunity to be heard. The inquiry must be completed within a statutory period of 90 days.",
  },
  {
    step: "4",
    title: "Interim Safeguards",
    desc: "During the pendency of the inquiry, the ICC may recommend interim relief including immediate suspension of the respondent coach/trainer, reassignment of training sessions, or restraining orders.",
  },
  {
    step: "5",
    title: "Inquiry Report & Strict Penalties",
    desc: "Upon completion, the ICC issues findings and recommended actions within 10 days. Penalties include formal censure, immediate termination of employment, permanent blacklisting of the academy/coach from KhelGrid, and referral to law enforcement authorities.",
  },
];

function PoshPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> Statutory Safeguarding Policy
        </Badge>
        <span className="text-xs text-muted-foreground">
          Updated under POSH Act 2013 & Safe Sport
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Prevention of Sexual Harassment (POSH) & Athlete Safeguarding Policy
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        KhelGrid maintains an uncompromising zero-tolerance policy towards sexual harassment,
        exploitation, and misconduct. We are committed to fostering a safe, respectful, and
        dignified environment for all women athletes, coaches, employees, and sports personnel.
      </p>

      {/* Core Principles */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-gradient-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-foreground">{p.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {p.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scope and Prohibited Conduct */}
      <section className="mt-12 rounded-3xl border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-bold text-foreground">What Constitutes Sexual Harassment</h2>
        </div>
        <p className="mt-3 text-xs text-muted-foreground sm:text-sm leading-relaxed">
          In alignment with the POSH Act 2013 and national athletic federation safeguarding
          guidelines, the following behaviors (whether explicit or implied) are strictly prohibited:
        </p>

        <ul className="mt-5 space-y-3">
          {PROHIBITED_CONDUCT.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5 text-xs text-foreground sm:text-sm"
            >
              <span className="font-bold text-primary mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Minor Athletes & POCSO Alignment */}
      <section className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-rose-500" />
          <h2 className="text-xl font-bold text-foreground">
            Special Protection for Minor Athletes (POCSO Act)
          </h2>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Where an athlete or individual is below 18 years of age, allegations of sexual abuse or
          harassment are governed under the{" "}
          <strong>Protection of Children from Sexual Offences (POCSO) Act, 2012</strong>. Any report
          involving a minor triggers immediate mandatory escalation to the Child Welfare Committee
          (CWC) and local law enforcement authorities, alongside immediate suspension of the accused
          individual from all KhelGrid platforms.
        </p>
      </section>

      {/* Step-by-Step Inquiry Procedure */}
      <section className="mt-12 rounded-3xl border border-border bg-gradient-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Complaint Redressal Mechanism & Timelines
          </h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
          Every grievance is processed strictly within statutory timelines established under the
          POSH Act:
        </p>

        <div className="mt-6 space-y-4">
          {REDRESSAL_STEPS.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/80 p-4"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                {step.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Complaints Committee Contact */}
      <section className="mt-8 rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Contact the Internal Complaints Committee (ICC)
          </h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm leading-relaxed">
          To file a confidential grievance, seek guidance, or report a violation at an affiliated
          facility or digital portal, reach out to the presiding officer of the KhelGrid ICC:
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-background/90 p-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Confidential Email
            </span>
            <a
              href="mailto:posh@khelgrid.com"
              className="mt-1 block text-sm font-bold text-primary hover:underline"
            >
              posh@khelgrid.com
            </a>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Direct inbox accessed exclusively by the ICC Presiding Officer and external member.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/90 p-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Emergency Child & Women Helpline
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">
              1091 (Women Helpline) / 1098 (Childline)
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              24/7 National emergency government toll-free distress numbers.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium pt-2 border-t border-border/60">
          <Link to="/trust-center" className="text-primary hover:underline font-semibold">
            Trust Center & Athlete Safety →
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/terms" className="text-primary hover:underline">
            Platform Terms of Service →
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/cancellation-policy" className="text-primary hover:underline">
            Cancellation & Refund Policy →
          </Link>
        </div>
      </section>
    </main>
  );
}
