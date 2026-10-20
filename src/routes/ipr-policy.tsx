import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Mail,
  Scale,
  Copyright,
  ExternalLink,
  AlertCircle,
  Clock,
  Sparkles,
  Building,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ipr-policy")({
  head: () =>
    buildSeoHead({
      title: "Intellectual Property Rights (IPR) & Copyright Policy · KhelGrid",
      description:
        "Comprehensive Intellectual Property Rights and Copyright Notice for KhelGrid. Governed by the Indian Copyright Act 1957, Trade Marks Act 1999, IT Act 2000, and DMCA notice-and-takedown procedures.",
      canonicalPath: "/ipr-policy",
      keywords:
        "IPR policy, copyright policy India, sports trials copyright, KhelGrid trademark, DMCA takedown, Indian Copyright Act 1957, fair dealing sports, nodal IPR officer",
      type: "website",
      customSchema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Intellectual Property Rights & Copyright Policy · KhelGrid",
        url: "https://www.khelgrid.com/ipr-policy",
        description:
          "Official IPR and Copyright terms governing KhelGrid platform assets, user-submitted media, third-party trademarks, and statutory notice-and-takedown procedures.",
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
              name: "Who owns the intellectual property on KhelGrid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "All original platform software, design architecture, database compilations, and the Verified Sports CV format are the exclusive intellectual property of KhelGrid protected under the Indian Copyright Act, 1957 and Trade Marks Act, 1999.",
              },
            },
            {
              "@type": "Question",
              name: "How does KhelGrid handle third-party federation and academy trademarks?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Federation and academy names (such as AIFF, BCCI, SAI, BWF) are referenced strictly for nominative identification, reporting, and news indexing under Section 52 (Fair Dealing) of the Indian Copyright Act. All rights remain with their respective statutory bodies.",
              },
            },
            {
              "@type": "Question",
              name: "How do I report a copyright or trademark infringement?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Authorized rights holders can submit a statutory takedown notice to our designated Nodal IPR Grievance Officer at ipr@khelgrid.com. Verified notices are processed within 36 hours pursuant to IT Rules 2021.",
              },
            },
          ],
        },
      },
    }),
  component: IPRPolicyPage,
});

const SECTIONS = [
  {
    id: "platform-ip",
    heading: "1. Ownership of KhelGrid Intellectual Property",
    icon: ShieldCheck,
    body: [
      "All proprietary software code, algorithms, user interface designs, database compilations, the Verified Sports CV layout and digital credential formats, logos, icons, visual identities, editorial content, and domain names (including khelgrid.com) are the exclusive intellectual property of KhelGrid and its licensors.",
      "These materials are protected under the Indian Copyright Act, 1957 (as amended), the Trade Marks Act, 1999, the Patents Act, 1970, the Information Technology Act, 2000, and applicable international treaties including the Berne Convention and WIPO Copyright Treaty.",
      "Except as explicitly authorized in writing by KhelGrid, no portion of the platform may be copied, reproduced, reverse-engineered, decompiled, distributed, published, scraped, or framed without prior written consent.",
    ],
  },
  {
    id: "user-content",
    heading: "2. User-Generated Content & Academy Submissions",
    icon: FileText,
    body: [
      "Athletes, coaches, academies, and tournament organizers retain ownership of the original text, player photographs, performance certificates, and highlight reels they submit to KhelGrid.",
      "By uploading content to KhelGrid, you grant KhelGrid a worldwide, royalty-free, non-exclusive, transferable sub-licensable license to host, display, index, store, format, cache, and transmit such content solely for the purpose of operating, improving, marketing, and delivering the platform's scout discovery and verification services.",
      "You represent and warrant that you own or possess all requisite licenses, rights, consents, and permissions to submit your content, and that your submission does not infringe any copyright, trademark, privacy right, or other proprietary right of any third party.",
    ],
  },
  {
    id: "nominative-fair-use",
    heading: "3. Third-Party Trademarks & Fair Dealing Disclaimers",
    icon: Scale,
    body: [
      "KhelGrid aggregates and indexes sporting opportunities, trials, state leagues, tournaments, and federation-sanctioned events across India.",
      "Any references to third-party sports governing bodies, federations, leagues, or clubs (including but not limited to BCCI, AIFF, Hockey India, BAI, AITA, SAI, FIFA, IOC, or franchise logos) are used strictly under the doctrine of 'Fair Dealing' for news reporting, criticism, review, and nominative identification pursuant to Section 52(1)(a) and Section 52(1)(b) of the Indian Copyright Act, 1957.",
      "Such nominative reference does not imply any sponsorship, endorsement, commercial affiliation, or partnership unless expressly stated by an official badge or written partnership memorandum.",
    ],
  },
  {
    id: "anti-scraping",
    heading: "4. Anti-Scraping & Database Rights Protection",
    icon: ShieldAlert,
    body: [
      "The comprehensive compilation of trial listings, venue schedules, academy ratings, coach directories, and athlete performance metrics constitutes an original database compilation protected under Indian copyright jurisprudence and the Information Technology Act, 2000.",
      "The use of automated spiders, scrapers, data-mining scripts, AI models for unauthorized derivative extraction, or bulk extraction tools to harvest listings, scout contacts, or user phone numbers is strictly prohibited.",
      "Violations are subject to civil remedies (injunctions and damages) and criminal prosecution under Sections 43 and 66 of the Information Technology Act, 2000.",
    ],
  },
  {
    id: "ai-content-imagery",
    heading: "5. AI-Generated Content, Visual Media & Authorship",
    icon: Sparkles,
    body: [
      "Under Section 2(d) of the Indian Copyright Act, 1957 and prevailing global jurisprudence (including US Copyright Office guidelines), purely autonomous, machine-generated outputs produced by artificial intelligence algorithms without human creative intervention do not qualify for independent copyright authorship.",
      "Human Creative Arrangements: Original arrangements, selection, creative prompting frameworks, human-curated composites, UI graphic compositions, and editorial analyses published on KhelGrid reflect human creative expression and are protected under Indian copyright law.",
      "Platform AI Assistive Features: AI-assisted tools on KhelGrid (such as Sports CV phrasing enhancers or tactical guide outlines) are assistive utilities. Athletes retain all personal and commercial rights in the factual data, achievements, and customized biographical text they formulate and finalize using these tools.",
      "Third-Party AI Model Acknowledgement: Any generative models utilized for platform enhancement or asset generation comply with the commercial terms, safety guidelines, and licenses of the underlying model providers.",
    ],
  },
  {
    id: "synthetic-media-likeness",
    heading: "6. Synthetic Media, Deepfakes & Athlete Likeness Protection",
    icon: ShieldAlert,
    body: [
      "Right to Publicity & Personality Rights: Athletes, coaches, and sports personalities possess inherent personality and publicity rights recognized under Article 21 of the Constitution of India and Indian common law. Generating, uploading, or distributing unauthorized AI deepfakes, voice clones, face-swaps, or synthetic likenesses of any person without their explicit written consent is strictly prohibited on KhelGrid.",
      "Ban on Forged Sports Credentials: Any use of generative AI to fabricate, modify, or forge trial certificates, federation affiliation letters, age proofs, or scout endorsements constitutes fraud and will result in immediate permanent account termination and referral to law enforcement agencies under Section 66D of the IT Act.",
      "Expedited 24-36 Hour Takedown for Synthetic Violations: Any notice concerning non-consensual synthetic media, deepfakes, or impersonation receives top-priority statutory processing under Rule 3(2)(b) of the IT Rules, 2021, with takedown enforced within 24 to 36 hours of receipt.",
    ],
  },
  {
    id: "ai-training-optout",
    heading: "7. Express Reservation Against AI Model Training (TDM Opt-Out)",
    icon: Scale,
    body: [
      "KhelGrid expressly reserves all rights in relation to Text and Data Mining (TDM), automated harvesting, and machine learning training under applicable domestic and international intellectual property laws, including Article 4(3) of the European Union Digital Single Market Directive 2019/790 and Section 43 of the Indian Information Technology Act, 2000.",
      "No entity or automated system may ingest, crawl, scrape, or extract athlete biographies, trial schedules, biometric performance scores, scout contact numbers, or editorial guides for the purpose of training commercial Large Language Models (LLMs), visual generative models, or artificial intelligence algorithms without an explicit, negotiated commercial license agreement executed in writing by KhelGrid.",
    ],
  },
  {
    id: "dmca-takedown",
    heading: "8. Statutory Notice & Takedown Procedure (DMCA & IT Rules 2021)",
    icon: AlertCircle,
    body: [
      "KhelGrid operates as an intermediary under Section 79 of the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and honors the principles of the US Digital Millennium Copyright Act (17 U.S.C. § 512).",
      "If you are a copyright owner or an authorized agent thereof and believe that any content hosted on KhelGrid infringes your copyright or trademark, please furnish a formal written notice containing the statutory elements outlined below.",
      "Upon receipt of a valid and complete infringement notice, KhelGrid will take expedited action to disable access to or remove the allegedly infringing material within 36 hours, and notify the user who posted the material.",
    ],
  },
  {
    id: "notice-elements",
    heading: "9. Required Elements for a Valid Infringement Notice",
    icon: Clock,
    body: [
      "To be effective, your written infringement notice must be dispatched to our designated Nodal IPR Officer and include:",
      "1. A physical or verifiable electronic signature of the person authorized to act on behalf of the owner of the intellectual property.",
      "2. Specific identification of the copyrighted work or trademark claimed to have been infringed, including registration number (if registered).",
      "3. The exact URL(s) or digital location on KhelGrid where the allegedly infringing material appears, enabling us to locate and review it.",
      "4. Your full legal name, organization, physical mailing address, telephone number, and valid email address.",
      "5. A statement affirming that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.",
      "6. A statement made under penalty of perjury that the information in the notification is accurate and that you are authorized to enforce the rights claimed.",
    ],
  },
  {
    id: "counter-notice",
    heading: "10. Counter-Notification & Repeat Infringer Policy",
    icon: Building,
    body: [
      "If content you uploaded was removed following an infringement notice and you believe this was due to mistaken identity, misidentification, or authorization, you may submit a formal counter-notification to ipr@khelgrid.com.",
      "The counter-notice must state your name, contact details, the specific URL removed, a statement consenting to the jurisdiction of the courts of India, and an affirmation under penalty of perjury that the material was removed as a result of mistake or misidentification.",
      "In accordance with our safety policy, KhelGrid maintains a strict repeat infringer policy: users or academy accounts who repeatedly violate the intellectual property rights of others will have their accounts permanently terminated and will be disqualified from future listing on the platform.",
    ],
  },
];

function IPRPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
          <Copyright className="mr-1.5 h-3.5 w-3.5" /> Statutory IPR Notice
        </Badge>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Indian Copyright Act, 1957 · Trade Marks Act, 1999
        </span>
      </div>

      <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        Intellectual Property Rights & Copyright Policy
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Legal terms governing KhelGrid&apos;s proprietary assets, user-submitted media, third-party
        trademark fair dealing, and expedited statutory notice-and-takedown procedures.
      </p>

      {/* Summary Highlight Box */}
      <div className="mt-8 rounded-2xl border border-border bg-gradient-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Commitment to Intellectual Property Integrity
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              KhelGrid respects the intellectual property rights of athletes, sports academies,
              federations, photographers, and content creators. We provide clear attribution, comply
              with statutory Indian and international copyright frameworks, and enforce an expedited
              36-hour takedown turnaround for verified notices.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Fair Dealing Compliance</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <span>36h Takedown SLA</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4 text-primary shrink-0" />
            <span>IT Rules 2021 Adherence</span>
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-border/80 bg-card/60 p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                  {section.heading}
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {section.body.map((paragraph, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Nodal IPR Officer Contact Box */}
      <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Designated Nodal IPR Grievance Officer
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              For expedited copyright infringement notices, DMCA notices, trademark claims, or
              database queries under Rule 3(2) of the Information Technology (Intermediary
              Guidelines) Rules, 2021:
            </p>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Designation:</strong> Nodal Officer for
                Intellectual Property & Legal Compliance
              </p>
              <p>
                <strong className="text-foreground">Official Email:</strong>{" "}
                <a
                  href="mailto:ipr@khelgrid.com"
                  className="font-medium text-primary hover:underline"
                >
                  ipr@khelgrid.com
                </a>{" "}
                (Secondary:{" "}
                <a
                  href="mailto:khelgrid@gmail.com"
                  className="font-medium text-primary hover:underline"
                >
                  khelgrid@gmail.com
                </a>
                )
              </p>
              <p>
                <strong className="text-foreground">Jurisdiction:</strong> Courts of New Delhi /
                National Capital Territory of Delhi, India
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="mailto:ipr@khelgrid.com?subject=Statutory%20IPR%20Infringement%20Notice&body=Dear%20Nodal%20IPR%20Officer%2C%0A%0AI%20am%20writing%20to%20notify%20KhelGrid%20of%20an%20alleged%20intellectual%20property%20infringement%20under%20the%20Indian%20Copyright%20Act%201957%20and%20IT%20Rules%202021.%0A%0A1.%20Title%20of%20Work%3A%0A2.%20Registration%20%2F%20Ownership%20Proof%3A%0A3.%20Exact%20URL(s)%20on%20KhelGrid%3A%0A4.%20Rights%20Holder%20Name%20%26%20Contact%3A%0A%0AThank%20you."
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" /> Submit Takedown Notice
            </a>
            <Link
              to="/terms"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Cross-linking to related legal policies */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
        <span>Related Policies:</span>
        <Link to="/terms" className="hover:text-primary hover:underline">
          Terms of Service
        </Link>
        <Link to="/privacy" className="hover:text-primary hover:underline">
          Privacy Policy
        </Link>
        <Link to="/editorial-policy" className="hover:text-primary hover:underline">
          Editorial Standards
        </Link>
        <Link to="/verification-policy" className="hover:text-primary hover:underline">
          Verification Guidelines
        </Link>
        <Link to="/cancellation-policy" className="hover:text-primary hover:underline">
          Cancellation Policy
        </Link>
      </div>
    </main>
  );
}
