import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, FileText, MapPin, ShieldCheck, Users } from "lucide-react";
import { TRIALS } from "@/data/trials";
import { getRealtimeOpportunityBadge, getTrialEndDate, getTrialStartDate } from "@/lib/opportunity-badge";
import { buildSeoHead, SITE_URL, DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { FitIndiaFAQ, FIT_INDIA_FAQS } from "@/components/FitIndiaFAQ";
import { WushuInterUniversityDetails } from "@/components/WushuInterUniversityDetails";
import { KcaKanpurCricketDetails } from "@/components/KcaKanpurCricketDetails";
import { GreenParkBasketballDetails } from "@/components/GreenParkBasketballDetails";
import { TrialSocialShare } from "@/components/TrialSocialShare";
import { TrialNewsletterSignup } from "@/components/TrialNewsletterSignup";
import { trialsDatabaseService } from "@/services/trials-database-service";

export const Route = createFileRoute("/trial/$id")({
  loader: async ({ params }) => {
    const trial = await trialsDatabaseService.getTrialById(params.id);
    if (!trial) throw notFound();
    return { trial };
  },
  head: ({ loaderData, params }) => {
    const trial = loaderData?.trial;
    if (!trial) {
      return buildSeoHead({
        title: "Sports Opportunity · KhelGrid",
        description:
          "Discover verified sports selection trials, SAI talent scouting combines, coaching scholarships, and government sports quota recruitment drives across India.",
        canonicalPath: `/trial/${params.id}`,
      });
    }

    const isCompetition = trial.listingType === "competition";
    const feeDescription = trial.feeLabel || (trial.fee === 0 ? "Free" : `₹${trial.fee}`);
    return buildSeoHead({
      title: `${trial.title} · ${trial.sport} ${isCompetition ? "School Games Fixture" : "Selection Trial"} in ${trial.city} | ${DEFAULT_SITE_NAME}`,
      description: isCompetition
        ? `${trial.title} is scheduled for ${trial.date} at ${trial.venue || trial.city} in the 70th National School Games calendar. This is a competition fixture, not an open public trial. Confirm entry and eligibility with your school/state unit. Source: School Games Federation of India.`
        : `${trial.title} hosted by ${trial.academy} in ${trial.city}. Eligibility: ${trial.ageCategory || "all eligible age groups"}, entry fee: ${feeDescription}, dates: ${trial.date} at ${trial.venue || trial.city}. Check official selection requirements and registration details on KhelGrid.`,
      canonicalPath: `/trial/${trial.id}`,
      keywords: `${trial.title}, ${trial.sport} ${isCompetition ? "school games fixture" : "selection trial"} ${trial.city}, ${trial.academy}, youth sports selection, ${trial.sport} opportunities India 2026`,
      type: "website",
      image: "https://www.khelgrid.com/og-image.png",
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
  const isCompetition = trial.listingType === "competition";
  const related = TRIALS.filter((item) => {
    if (item.id === trial.id || item.sport !== trial.sport) return false;
    const endDate = getTrialEndDate(item.date);
    return Boolean(endDate && endDate.getTime() >= Date.now());
  }).slice(0, 3);
  const documents = trial.requiredDocuments ?? [
    "Government-issued identity or age proof",
    "Recent sports record, if the organizer requests one",
    "Personal sports equipment and water",
    "Registration confirmation and payment receipt, if applicable",
  ];
  const applicationSteps = isCompetition
    ? [
        "Open the official SGFI calendar and recheck the fixture and entry status.",
        "Confirm eligibility and nomination with your school, state, or recognized unit.",
        "Ask the relevant authority for required documents, reporting instructions, and any fees.",
        "Recheck official notices before travelling; this listing does not confirm public registration.",
      ]
    : [
        "Read the eligibility and selection requirements published by the organizer.",
        "Confirm the date, venue, fee, and registration deadline through an official channel.",
        "Prepare the requested documents and submit the application using the organizer's process.",
        "Save your confirmation and check for schedule or venue updates before travelling.",
      ];
  const feeDescription = trial.feeLabel || (trial.fee === 0 ? "Free" : `₹${trial.fee}`);
  const feeIsUnspecified = Boolean(trial.feeLabel && /not stated|not listed|confirm/i.test(trial.feeLabel));
  const pageTitle = `${trial.title} · ${trial.sport} ${isCompetition ? "School Games Fixture" : "Selection Trials"} in ${trial.city} | ${DEFAULT_SITE_NAME}`;
  const pageDescription = isCompetition
    ? `${trial.title} is scheduled for ${trial.date} at ${trial.venue || trial.city}. This is a School Games competition fixture, not an open public trial. Confirm entry with your school/state unit. Official source: School Games Federation of India.`
    : `${trial.title} by ${trial.academy} in ${trial.city}. Eligibility: ${trial.ageCategory || "All categories"}. Date: ${trial.date} at ${trial.venue || trial.city}. Entry fee: ${feeDescription}. Check official selection details on KhelGrid.`;
  const canonicalUrl = `${SITE_URL}/trial/${trial.id}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  // Use the published event dates; never invent fallback dates for structured data.
  const startDate = getTrialStartDate(trial.date);
  const endDate = getTrialEndDate(trial.date);
  const formatSchemaDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const sportsEventSchema = startDate ? {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: trial.title,
    description: pageDescription,
    url: canonicalUrl,
    startDate: formatSchemaDate(startDate),
    ...(endDate ? { endDate: formatSchemaDate(endDate) } : {}),
    eventStatus:
      endDate && endDate.getTime() < Date.now()
        ? "https://schema.org/EventCompleted"
        : "https://schema.org/EventScheduled",
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
    ...(!trial.feeLabel && trial.listingType !== "competition"
      ? {
          offers: {
            "@type": "Offer",
            price: trial.fee.toString(),
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          },
          isAccessibleForFree: trial.fee === 0,
        }
      : {}),
    image: [ogImageUrl],
  } : null;

  // Assemble Schema.org JSON-LD structured data objects only when a reliable date exists.
  const trialSchemas: Array<Record<string, unknown>> = sportsEventSchema ? [sportsEventSchema] : [];

  if (
    trial.id === "t-fit-india-namchi-sikkim-2026" ||
    trial.title.toLowerCase().includes("fit india") ||
    trial.city.toLowerCase() === "namchi"
  ) {
    trialSchemas.push({
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
    });
  }

  if (trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: "CRPF Meritorious Sportspersons Recruitment 2026 (Head Constable & Constable GD)",
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
        logo: "https://www.khelgrid.com/og-image.svg",
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
    });
  }

  if (
    trial.id === "t-khel-maharan-3-assam-2026" ||
    trial.title.toLowerCase().includes("khel maharan")
  ) {
    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "When does Khel Maharan 3.0 begin in Assam?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Khel Maharan 3.0 officially begins on November 7, 2026, commencing with village and urban ward heats across all 35 districts of Assam.",
          },
        },
        {
          "@type": "Question",
          name: "How can athletes register for Khel Maharan 3.0?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Athletes can register free of charge online at khelmaharan.com/khel or visit their local Gaon Panchayat / Municipal Ward offices across Assam.",
          },
        },
        {
          "@type": "Question",
          name: "What sports disciplines are included in Khel Maharan 3.0?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The initiative features Athletics, Football, Volleyball, Kabaddi, Swimming, Chess, Cycling, Yogasana, Aquathlon, and Boxing.",
          },
        },
        {
          "@type": "Question",
          name: "What is Shoushab Krida Samaroh in Khel Maharan 3.0?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Shoushab Krida Samaroh is the specialized Under-12 category introduced by the Government of Assam featuring state cash scholarships for young sporting talents.",
          },
        },
      ],
    });
  }

  if (
    trial.id === "t-bcci-arunachal-pradesh-ranji-trials-2026" ||
    trial.title.toLowerCase().includes("arunachal pradesh's ranji")
  ) {
    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: "BCCI Selection Trials for Arunachal Pradesh Ranji Trophy & Domestic Season 2026–27",
      description:
        "Official open selection trials conducted by the Board of Control for Cricket in India (BCCI) to select Arunachal Pradesh teams for Ranji Trophy, Col. C.K. Nayudu Trophy, and Senior Women's T20 Trophy.",
      startDate: "2026-11-01",
      endDate: "2026-11-18",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Yupia Cricket Stadium & Rajiv Gandhi Stadium",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Itanagar",
          addressRegion: "Arunachal Pradesh",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "SportsOrganization",
        name: "Board of Control for Cricket in India (BCCI)",
        url: "https://www.bcci.tv",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
      isAccessibleForFree: true,
    });

    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why is the BCCI conducting open trials directly in Arunachal Pradesh?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The BCCI intervened directly following an internal dispute and legal deadlock in the Arunachal Cricket Association to safeguard player futures and ensure Arunachal Pradesh participates in the Ranji Trophy and other domestic tournaments.",
          },
        },
        {
          "@type": "Question",
          name: "Who comprises the BCCI Independent Selection Committee for Arunachal Pradesh?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The committee is led by former Assam first-class cricketer Satya Gopal Chakraborty (Chairman), with Jayanta Chowdhury and Deep Bora as members, convened by BCCI Apex Council member M. Khairul Jamal Majumdar.",
          },
        },
        {
          "@type": "Question",
          name: "Where are the BCCI Arunachal Pradesh cricket trials held?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The selection trials are being held at the Yupia Cricket Stadium and Rajiv Gandhi Stadium in Itanagar, Arunachal Pradesh.",
          },
        },
        {
          "@type": "Question",
          name: "What tournaments are selected through these BCCI trials?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The independent committee is selecting teams for the Ranji Trophy (Senior Men), Col. C.K. Nayudu Trophy (Men's U-23), Senior Women's T20 Trophy, and junior domestic tournaments.",
          },
        },
      ],
    });
  }

  if (
    trial.id === "t-jk-kho-kho-junior-national-trials-2026" ||
    trial.title.toLowerCase().includes("kho-kho selection trials")
  ) {
    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: "Jammu and Kashmir Kho-Kho Selection Trials for 45th Junior National Championship",
      description:
        "Official selection trials organized by Jammu and Kashmir Kho-Kho Association for junior boys and girls teams to represent J&K in the 45th Junior National Kho-Kho Championship in Gujarat.",
      startDate: "2026-10-19T14:30:00+05:30",
      endDate: "2026-10-20T18:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Green Play Field",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gandhi Nagar",
          addressLocality: "Jammu",
          addressRegion: "Jammu & Kashmir",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "SportsOrganization",
        name: "Jammu and Kashmir Kho-Kho Association",
        url: "https://jksportscouncil.in",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
      isAccessibleForFree: true,
    });

    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "When and where are the J&K Kho-Kho selection trials being held?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The selection trials are scheduled for October 19 and 20, 2026, at Green Play Field, Gandhi Nagar, Jammu, starting at 2:30 PM.",
          },
        },
        {
          "@type": "Question",
          name: "Who is eligible to participate in the Kho-Kho selection trials?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Junior boys and girls under 18 years of age as of November 25, 2026 (born after 25-11-2008) residing in Jammu & Kashmir with consent letters from affiliated district units.",
          },
        },
        {
          "@type": "Question",
          name: "Which tournament are these trials selecting for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "These trials are selecting the Jammu and Kashmir UT boys and girls squads for the 45th Junior National Kho-Kho Championship scheduled in Gujarat from November 21 to 25, 2026.",
          },
        },
      ],
    });
  }

  if (
    trial.id === "t-sai-ncoe-aurangabad-women-boxing-trials-2026" ||
    trial.title.toLowerCase().includes("sai ncoe women boxing")
  ) {
    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: "SAI NCOE Women Boxing Open Selection Trials (5 Vacancies)",
      description:
        "Official open selection trials conducted by Sports Authority of India (SAI) at NCOE Chhatrapati Sambhajinagar (Aurangabad) for U-14, U-17, U-19 female boxers to fill 5 residential scholarship vacancies.",
      startDate: "2026-10-23T07:00:00+05:30",
      endDate: "2026-10-25T18:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Sports Authority of India NCOE",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Dr. Babasaheb Ambedkar Marathwada University Campus",
          addressLocality: "Chhatrapati Sambhajinagar",
          addressRegion: "Maharashtra",
          postalCode: "431005",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "GovernmentOrganization",
        name: "Sports Authority of India (SAI)",
        url: "https://sportsauthorityofindia.nic.in",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
      image: [trial.posterUrl || ogImageUrl],
      isAccessibleForFree: true,
    });

    trialSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "When are the SAI NCOE Aurangabad Women Boxing trials held?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The selection trials are conducted on October 23, 24, and 25, 2026, starting at 7:00 AM at SAI NCOE Chhatrapati Sambhajinagar (Aurangabad).",
          },
        },
        {
          "@type": "Question",
          name: "How many vacancies are available in this SAI Boxing trial?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There are only 5 residential scholarship vacancies available for elite female boxers across U-14, U-17, and U-19 age categories.",
          },
        },
        {
          "@type": "Question",
          name: "Who is eligible to participate in the SAI Women Boxing trials?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Female boxers in U-14, U-17, and U-19 age categories who are National/International Medalists, State Gold Medalists, or National Rankers up to rank 8. Age Verification Test (AVT) is compulsory for U-15 girls.",
          },
        },
        {
          "@type": "Question",
          name: "Who are the contact persons for the SAI Aurangabad trials?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Candidates can contact Senior Boxing Coaches Varsha Tripathi (9131531244) and Sonu Tak (8446271067).",
          },
        },
      ],
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      {/* Reusable SEO Component using react-helmet-async */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        keywords={`${trial.title}, ${trial.sport} trials ${trial.city}, ${trial.academy}, Fit India school games, selection trials ${trial.city}, youth sports competition India, government trials 2026`}
        ogImage={ogImageUrl}
        imageAlt={`${trial.title} - Official Selection Trials`}
        schema={trialSchemas.filter((schema) => schema["@type"] !== "SportsEvent")}
      />

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
          value={trial.feeLabel || (trial.fee === 0 ? "Free entry" : `₹${trial.fee}`)}
        />
      </section>

      {/* Official Circular / Notice Poster Banner */}
      {(trial.posterUrl || trial.imageUrl) && (
        <section className="mt-8 overflow-hidden rounded-2xl border border-primary/30 bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                📄 Source document / image
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Source material attached to this listing
              </span>
            </div>
            <a
              href={trial.posterUrl || trial.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Open Original Poster <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border/80 bg-black/5 max-h-[550px] flex justify-center items-center">
            <img
              src={trial.posterUrl || trial.imageUrl}
              alt={`${trial.title} official notice`}
              width={600}
              height={450}
              loading="lazy"
              decoding="async"
              className="max-h-[550px] w-auto object-contain rounded-lg"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("sai_trial_poster.jpeg")) {
                  target.src = "/sai_trial_poster.jpeg";
                }
              }}
            />
          </div>
        </section>
      )}

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
