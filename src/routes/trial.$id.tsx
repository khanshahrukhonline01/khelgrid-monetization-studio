import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, FileText, MapPin, ShieldCheck, Users } from "lucide-react";
import { TRIALS } from "@/data/trials";
import { getRealtimeOpportunityBadge } from "@/lib/opportunity-badge";
import { buildSeoHead, SITE_URL, DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { FitIndiaFAQ, FIT_INDIA_FAQS } from "@/components/FitIndiaFAQ";
import { WushuInterUniversityDetails } from "@/components/WushuInterUniversityDetails";
import { KcaKanpurCricketDetails } from "@/components/KcaKanpurCricketDetails";
import { GreenParkBasketballDetails } from "@/components/GreenParkBasketballDetails";
import { TrialSocialShare } from "@/components/TrialSocialShare";
import { TrialNewsletterSignup } from "@/components/TrialNewsletterSignup";

export const Route = createFileRoute("/trial/$id")({
  loader: ({ params }) => {
    const trial = TRIALS.find((item) => item.id === params.id);
    if (!trial) throw notFound();
    return { trial };
  },
  head: ({ loaderData, params }) => {
    const trial = loaderData?.trial;
    if (!trial) {
      return buildSeoHead({
        title: "Sports Opportunity · KhelGrid",
        description:
          "Explore sports trials, scouting camps, and scholarship opportunities in India.",
        canonicalPath: `/trial/${params.id}`,
      });
    }

    return buildSeoHead({
      title: `${trial.title} · ${trial.sport} Trial in ${trial.city}`,
      description: `${trial.title} hosted by ${trial.academy} in ${trial.city}. Eligibility: ${trial.ageCategory || "all eligible age groups"}, entry fee: ${trial.fee === 0 ? "Free" : `₹${trial.fee}`}, reporting date: ${trial.date} at ${trial.venue || trial.city}. Official selection trials verified on KhelGrid.`,
      canonicalPath: `/trial/${trial.id}`,
      keywords: `${trial.title}, ${trial.sport} trial ${trial.city}, ${trial.academy}, youth sports selection, ${trial.sport} scholarship, SAI NCOE wrestling, sports trials Mumbai 2026`,
      type: "website",
      image: "https://khelgrid.com/og-image.png",
      author: trial.academy,
    });
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Opportunity not found</h1>
      <p className="mt-3 text-muted-foreground">This listing may have expired or been removed.</p>
      <Button asChild className="mt-6">
        <Link to="/search">Browse opportunities</Link>
      </Button>
    </main>
  ),
  component: TrialDetailPage,
});

function TrialDetailPage() {
  const { trial } = Route.useLoaderData();
  const statusBadge = getRealtimeOpportunityBadge(trial);
  const sourceLabel = trial.sourceLabel ?? "Organizer source not recorded";
  const verificationLabel = trial.lastVerified
    ? `Last verified ${trial.lastVerified}`
    : "Verification date not recorded";
  const related = TRIALS.filter((item) => item.id !== trial.id && item.sport === trial.sport).slice(
    0,
    3,
  );
  const documents = trial.requiredDocuments ?? [
    "Government-issued identity or age proof",
    "Recent sports record, if the organizer requests one",
    "Personal sports equipment and water",
    "Registration confirmation and payment receipt, if applicable",
  ];
  const applicationSteps = [
    "Read the eligibility and selection requirements published by the organizer.",
    "Confirm the date, venue, fee, and registration deadline through an official channel.",
    "Prepare the requested documents and submit the application using the organizer's process.",
    "Save your confirmation and check for schedule or venue updates before travelling.",
  ];

  const pageTitle = `${trial.title} · ${trial.sport} Selection Trials in ${trial.city} | ${DEFAULT_SITE_NAME}`;
  const pageDescription = `${trial.title} by ${trial.academy} in ${trial.city}. Eligibility: ${trial.ageCategory || "All categories"}. Date: ${trial.date} at ${trial.venue || trial.city}. Entry fee: ${trial.fee === 0 ? "Free" : `₹${trial.fee}`}. Verified official trial on KhelGrid.`;
  const canonicalUrl = `${SITE_URL}/trial/${trial.id}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  // Specific Open Graph & Schema.org event structured data for rich previews
  const startDateIso = trial.date.includes("Dec 25")
    ? "2026-12-25T08:00:00+05:30"
    : trial.date.includes("Oct 10")
      ? "2026-10-10T08:00:00+05:30"
      : trial.date.includes("Sep 30")
        ? "2026-09-30T08:00:00+05:30"
        : "2026-09-23T09:00:00+05:30";

  const sportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: trial.title,
    description: pageDescription,
    url: canonicalUrl,
    startDate: startDateIso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: trial.venue || `${trial.academy}, ${trial.city}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: trial.city,
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "SportsOrganization",
      name: trial.academy,
      url: trial.sourceUrl || canonicalUrl,
    },
    offers: {
      "@type": "Offer",
      price: trial.fee.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      validFrom: "2026-09-24",
    },
    image: [ogImageUrl],
    isAccessibleForFree: trial.fee === 0,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      {/* React Helmet for Dynamic SEO and Social Sharing (Open Graph & Twitter Cards) */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="keywords"
          content={`${trial.title}, ${trial.sport} trials ${trial.city}, ${trial.academy}, Fit India school games, selection trials ${trial.city}, youth sports competition India, government trials 2026`}
        />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

        {/* Open Graph Meta Tags for Facebook, WhatsApp, LinkedIn, Discord */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
        <meta property="og:title" content={`${trial.title} · ${trial.city}`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${trial.title} - Official Selection Trials`} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={`${trial.title} · ${trial.city}`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={`${trial.title} - ${trial.sport}`} />

        {/* Specific SportsEvent JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(sportsEventSchema)}</script>

        {/* Specific FAQPage JSON-LD Structured Data for Fit India Trials */}
        {(trial.id === "t-fit-india-namchi-sikkim-2026" ||
          trial.title.toLowerCase().includes("fit india") ||
          trial.city.toLowerCase() === "namchi") && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FIT_INDIA_FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            })}
          </script>
        )}

        {/* Official JobPosting JSON-LD Structured Data for CRPF Recruitment */}
        {trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026" && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title:
                "CRPF Meritorious Sportspersons Recruitment 2026 (Head Constable & Constable GD)",
              description:
                "Central Reserve Police Force invites online applications from eligible meritorious Indian sportspersons for 182 Head Constable (GD) and 339 Constable (GD) posts across 22 sports disciplines under Sports Quota 2026. Apply online at rect.crpf.gov.in.",
              identifier: {
                "@type": "PropertyValue",
                name: "Central Reserve Police Force",
                value: "CRPF-SPORTS-QUOTA-2026-521",
              },
              datePosted: "2026-10-12",
              validThrough: "2026-11-11T23:59:59+05:30",
              employmentType: "FULL_TIME",
              hiringOrganization: {
                "@type": "GovernmentOrganization",
                name: "Central Reserve Police Force (CRPF) & Ministry of Home Affairs",
                sameAs: "https://rect.crpf.gov.in",
                url: "https://rect.crpf.gov.in",
                logo: "https://khelgrid.com/og-image.svg",
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IN",
                  addressRegion: "Pan-India",
                },
              },
              baseSalary: {
                "@type": "MonetaryAmount",
                currency: "INR",
                value: {
                  "@type": "QuantitativeValue",
                  minValue: 21700,
                  maxValue: 81100,
                  unitText: "MONTH",
                },
              },
              qualifications:
                "10+2 for Head Constable (GD); 10th for Constable (GD). Must have represented Country/State/University/National School Games in recognized tournaments between 30/09/2024 and 30/09/2026 across 22 disciplines.",
              totalJobOpenings: 521,
              directApply: true,
              applicationContact: {
                "@type": "ContactPoint",
                name: "CRPF Recruitment Branch",
                telephone: "+91-11-26160255",
                email: "rectt@crpf.gov.in",
                url: "https://rect.crpf.gov.in",
              },
            })}
          </script>
        )}
      </Helmet>

      <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to search
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
          {trial.sport}
        </Badge>
        <Badge variant="secondary">{trial.tag}</Badge>
        {statusBadge && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusBadge.style}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusBadge.dotStyle}`}
              aria-hidden="true"
            />
            <statusBadge.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{statusBadge.label}</span>
            {statusBadge.sublabel && (
              <span className="font-normal opacity-80">· {statusBadge.sublabel}</span>
            )}
          </span>
        )}
      </div>
      <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">
        {trial.title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">Organized by {trial.academy}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Detail icon={MapPin} label="City" value={trial.city} />
        <Detail icon={Calendar} label="Date" value={trial.date} />
        <Detail icon={Users} label="Places" value={`${trial.spots} listed spots`} />
        <Detail
          icon={FileText}
          label="Entry fee"
          value={trial.fee === 0 ? "Free entry" : `₹${trial.fee}`}
        />
      </section>

      {/* Social Media Sharing Section */}
      <section className="mt-6" aria-label="Share trial announcement">
        <TrialSocialShare trial={trial} variant="banner" />
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="text-xl font-semibold">What this opportunity is</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This listing describes a {trial.sport.toLowerCase()} opportunity from {trial.academy} in{" "}
          {trial.city}. It is a starting point for your research, not a promise of selection,
          attendance, or a particular outcome. Use the details below to decide what to confirm and
          how to prepare.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">KhelGrid verification context</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Source status: {sourceLabel}. {verificationLabel}. Confirm the latest date, venue,
          eligibility, fee, and registration instructions with the organizer before travelling or
          paying. A KhelGrid listing does not mean that KhelGrid is the organizer or that a place is
          reserved for you.
        </p>
        {trial.sources && trial.sources.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {trial.sources.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md"
              >
                <span>{src.label}</span>
                <span>→</span>
              </a>
            ))}
          </div>
        ) : trial.sourceUrl ? (
          <a
            href={trial.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Open official source →
          </a>
        ) : null}
        <Link
          to="/trust-center"
          className="mt-3 block text-sm font-semibold text-primary hover:underline"
        >
          How our verification process works →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Opportunity details</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <InfoSection
            title="Eligibility"
            value={
              trial.eligibility ??
              "Ask the organizer for age, gender, skill-level, and category requirements."
            }
          />
          <InfoSection title="What to bring" value={documents.join(", ")} />
          <InfoSection
            title="Selection process"
            value={
              trial.selectionProcess ??
              "The organizer has not published a selection process in this listing. Confirm the assessment stages before applying."
            }
          />
          <InfoSection
            title="Registration deadline"
            value={
              trial.registrationDeadline ??
              "Not listed. Confirm the deadline directly with the organizer."
            }
          />
          <InfoSection
            title="Venue"
            value={
              trial.venue ??
              "Not listed. Confirm the exact ground, court, gate, and reporting point with the organizer."
            }
          />
          <InfoSection
            title="Travel planning"
            value={`Plan for arrival in ${trial.city} only after the organizer confirms the venue and reporting time.`}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-semibold">Application checklist</h2>
          <ol className="mt-4 space-y-4">
            {applicationSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-semibold">Prepare safely</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Keep copies of forms, receipts, and messages.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Do not pay anyone who guarantees selection or asks for an unofficial fee.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              For minors, involve a parent or guardian in travel, payment, and organizer
              communication.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-semibold">Questions to confirm before travelling</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoSection
            title="Is registration still open?"
            value="Ask for the current deadline and whether places remain."
          />
          <InfoSection
            title="Where should I report?"
            value="Confirm the exact venue address, reporting time, and contact person."
          />
          <InfoSection
            title="What happens after applying?"
            value="Ask when shortlists, assessments, and next-step messages will be shared."
          />
          <InfoSection
            title="What does the fee cover?"
            value={
              trial.fee === 0
                ? "This listing shows no entry fee; confirm that no separate charge applies."
                : `This listing shows an entry fee of ₹${trial.fee}; ask what it covers and request a receipt.`
            }
          />
        </div>
      </section>

      {/* Fit India School Games Dedicated FAQ Section */}
      {(trial.id === "t-fit-india-namchi-sikkim-2026" ||
        trial.title.toLowerCase().includes("fit india") ||
        trial.city.toLowerCase() === "namchi") && (
        <div className="mt-10">
          <FitIndiaFAQ sourceUrl={trial.sourceUrl} />
        </div>
      )}

      {/* All India Inter-University Wushu Championship Dedicated Details & Timelines Section */}
      {(trial.id === "t-aiu-wushu-inter-university-trials-2026" ||
        trial.sport.toLowerCase() === "wushu" ||
        trial.title.toLowerCase().includes("wushu")) && (
        <div className="mt-10">
          <WushuInterUniversityDetails />
        </div>
      )}

      {/* Kanpur Cricket Association (KCA) U-14 Dedicated Details & UPCA Pathway Section */}
      {(trial.id === "t-kca-u14-cricket-trials-kanpur-2026" ||
        (trial.city.toLowerCase() === "kanpur" && trial.sport.toLowerCase() === "cricket") ||
        trial.academy.toLowerCase().includes("kanpur cricket association")) && (
        <div className="mt-10">
          <KcaKanpurCricketDetails sourceUrl={trial.sourceUrl} />
        </div>
      )}

      {/* UP Sports Directorate Green Park Basketball Selection Trials Section */}
      {(trial.id === "t-up-sports-directorate-junior-basketball-trials-kanpur-2026" ||
        (trial.city.toLowerCase() === "kanpur" && trial.sport.toLowerCase() === "basketball") ||
        (trial.title.toLowerCase().includes("basketball") &&
          trial.city.toLowerCase() === "kanpur")) && (
        <div className="mt-10">
          <GreenParkBasketballDetails sourceUrl={trial.sourceUrl} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">More {trial.sport} opportunities</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:hidden">
              Swipe ↔
            </span>
          </div>
          <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible sm:p-0">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/trial/$id"
                params={{ id: item.id }}
                className="w-[260px] shrink-0 snap-start rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40 sm:w-auto sm:shrink"
              >
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {item.city} · {item.date} · {item.fee === 0 ? "Free" : `₹${item.fee}`}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Social Share callout */}
      <section className="mt-10" aria-label="Share this opportunity">
        <TrialSocialShare trial={trial} variant="banner" />
      </section>

      {/* Trial Alert Newsletter Signup */}
      <section className="mt-10" aria-label="Trial Alerts Newsletter">
        <TrialNewsletterSignup
          defaultSport={trial.sport}
          defaultCity={trial.city}
          title={`Get Automatic Alerts for ${trial.sport} Trials in ${trial.city}`}
          subtitle={`Never miss new selection dates or announcements from ${trial.academy} and other verified sports organizations.`}
        />
      </section>

      <div className="mt-10 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-semibold">Ready to compare?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Review other listings by sport and city, then save the opportunities you want to follow up
          on.
        </p>
        <Button asChild className="mt-5">
          <Link to="/search">Compare more opportunities</Link>
        </Button>
      </div>
    </main>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function InfoSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card/50 p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
    </section>
  );
}
