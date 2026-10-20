export interface TrialFaqItem {
  id: string;
  question: string;
  answer: string;
  category:
    "General" | "Eligibility & Documents" | "Government & Quotas" | "Elite Academies & BCCI";
}

export const TRIALS_AND_OPPORTUNITIES_FAQS: TrialFaqItem[] = [
  {
    id: "faq-how-to-find-apply",
    category: "General",
    question: "How do I find and apply for sports selection trials and opportunities on KhelGrid?",
    answer:
      "Athletes, parents, and coaches can use KhelGrid's search and filter grid to discover verified open selection trials, tournament combines, and academy recruitment drives across India. You can filter by sport (such as Cricket, Football, Boxing, Kho-Kho, Athletics, Badminton), city, age band (U-14, U-17, U-19, Senior), and fee structure. Click on any trial opportunity to view confirmed reporting dates, venue locations, eligibility cutoffs, official circulars, and direct registration links.",
  },
  {
    id: "faq-are-trials-free",
    category: "General",
    question: "Are sports selection trials and opportunities on KhelGrid free to attend?",
    answer:
      "Yes, many government sports quota recruitments, state association combines, and national federation selections (including SAI NCOE residential trials, CRPF Meritorious Sportspersons recruitment, J&K Kho-Kho trials, and Khel Maharan 3.0) have zero entry fee (₹0 / Free Entry). KhelGrid allows you to toggle the 'Free Entry Only' filter to immediately surface no-cost athletic opportunities.",
  },
  {
    id: "faq-documents-required",
    category: "Eligibility & Documents",
    question:
      "What documents and eligibility proofs are required at sports selection trials in India?",
    answer:
      "While specific criteria vary by federation, candidates typically must bring: 1. Original Age Proof: Aadhaar Card, Government Birth Certificate (issued by Municipal Corporation), or 10th Board Certificate; 2. Sports Merit Certificates: Original achievement certificates from School Games Federation of India (SGFI), Association of Indian Universities (AIU), state associations, or national federation meets; 3. Medical Fitness Certificate: A certified fitness clearance from a registered medical practitioner; 4. Recent Passport Photographs in sports kit; and 5. A verified KhelGrid Sports CV displaying verified telemetry and match records.",
  },
  {
    id: "faq-government-quota",
    category: "Government & Quotas",
    question:
      "How do government sports quota recruitments (such as CRPF, Railways, and Police) work?",
    answer:
      "Central and State Government bodies periodically advertise sports quota vacancies under Meritorious Sportspersons Schemes (such as the 521 Head Constable and Constable GD posts in the CRPF). Candidates who have represented India internationally, represented their state in Senior/Junior Nationals, or represented their university in All India Inter-University championships within the last 2 to 3 years are eligible. Selection involves physical efficiency screening, sports trial bouts/matches, followed by document verification and medical examination.",
  },
  {
    id: "faq-sai-ncoe-trials",
    category: "Elite Academies & BCCI",
    question: "How does the Sports Authority of India (SAI) NCOE selection trial process work?",
    answer:
      "Sports Authority of India (SAI) National Centres of Excellence (NCOEs) conduct open selection trials to admit high-potential athletes into residential scholarship academies. The combine typically spans 3 days: Day 1 covers physical fitness testing, weight verification, and mandatory Age Verification Tests (AVT); Day 2 involves sport-specific skills and sparring/match play; and Day 3 concludes with final selection bouts. Inducted athletes receive world-class coaching, scientific nutrition, sports science support, lodging, medical cover, and competition exposure fully funded by the Ministry of Youth Affairs and Sports.",
  },
  {
    id: "faq-bcci-ranji-trials",
    category: "Elite Academies & BCCI",
    question:
      "How can cricketers get selected for BCCI domestic tournaments like the Ranji Trophy?",
    answer:
      "Cricket aspirants participate in open selection trials organized by BCCI-affiliated state associations (e.g. DDCA, MCA, KSCA) or official BCCI-appointed independent selection panels. For instance, BCCI conducts open trials for Arunachal Pradesh teams across Ranji Trophy, Col. C.K. Nayudu Trophy (U-23), and Senior Women's T20. Selectors evaluate candidates through net batting and bowling assessments, match scenario simulations, and fitness benchmarks including Yo-Yo tests and sprint drills.",
  },
  {
    id: "faq-traditional-sports-national",
    category: "General",
    question:
      "How do athletes get selected for National Championships in sports like Kho-Kho and Kabaddi?",
    answer:
      "State associations affiliated with the Kho Kho Federation of India (KKFI) and Amateur Kabaddi Federation of India (AKFI) organize district and state-level selection trials to assemble squads for Junior and Senior National Championships. Athletes undergo agility, endurance, raiding, and defensive tagging combines under NIS-certified selectors, offering pathways to state representation and professional franchise scouting in leagues like Ultimate Kho Kho and Pro Kabaddi.",
  },
  {
    id: "faq-sports-cv-benefit",
    category: "Eligibility & Documents",
    question:
      "How does creating a KhelGrid Verified Sports CV help during selection trials and scouting?",
    answer:
      "A KhelGrid Sports CV functions as a standardized, verified athletic resume. Instead of unverified paper folders, athletes showcase their verified tournament certificates, physical combine benchmarks (sprint times, vertical jump, endurance scores), match footage, and coach endorsements in one shareable link or scannable QR code that coaches and talent scouts can instantly verify.",
  },
];

/**
 * Generates Schema.org FAQPage structured data for Trials and Opportunities
 */
export function generateTrialsFaqSchema(
  customFaqs: TrialFaqItem[] = TRIALS_AND_OPPORTUNITIES_FAQS,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.khelgrid.com/search#faq",
    name: "Frequently Asked Questions About Sports Selection Trials and Opportunities in India",
    description:
      "Authoritative answers to common questions about finding, applying, and preparing for verified sports selection trials, SAI NCOE schemes, BCCI state combines, and government sports quota jobs across India.",
    mainEntity: customFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
