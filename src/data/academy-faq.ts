export interface AcademyFaqItem {
  id: string;
  question: string;
  answer: string;
  category:
    "Accreditation" | "Scholarships & Fees" | "Eligibility" | "Facilities & Safety" | "Selection";
}

export const ACADEMY_FAQS: AcademyFaqItem[] = [
  {
    id: "faq-kiaa-difference",
    question:
      "What is a Khelo India Accredited Academy (KIAA) and how is it different from private sports academies?",
    answer:
      "A Khelo India Accredited Academy (KIAA) is an institution formally audited, recognized, and supported by the Sports Authority of India (SAI) and the Ministry of Youth Affairs and Sports. KIAAs must meet stringent benchmarks in world-class equipment, certified coaches (NIS/international diplomas), sports science support, and athlete safety. Unlike purely private academies, KIAAs can nominate athletes directly for national talent scholarship schemes and often host regional training centers with subsidized government funding.",
    category: "Accreditation",
  },
  {
    id: "faq-scholarships-fees",
    question:
      "How can athletes get free admission or scholarships in sports academies across India?",
    answer:
      "Athletes can secure 100% scholarships, free boarding, and equipment support through open selection trials conducted by SAI NCOE (National Centres of Excellence), Army Sports Institute, Tata Steel Academies, Inspire Institute of Sport (IIS), and Khelo India state centres. Under the Khelo India Talent Development Scheme, selected athletes receive up to ₹6,20,000 per year (including a ₹1,20,000 out-of-pocket allowance). State medal winners, national school games participants, and Khelo India Youth Games medalists receive direct trial priority.",
    category: "Scholarships & Fees",
  },
  {
    id: "faq-age-criteria",
    question:
      "What are the typical age criteria and admission requirements for residential sports hostels and academies?",
    answer:
      "Most residential sports academies in India admit athletes across three primary age brackets: Sub-Junior (ages 10–14), Junior (ages 14–18), and Senior/Elite (ages 18–25). Admission requires verification through digital birth certificates, school bonafide certificates, Aadhaar cards, and in official SAI/BCCI/Federation setups, Tanner-Whitehouse 3 (TW3) bone maturity age verification to prevent age fraud.",
    category: "Eligibility",
  },
  {
    id: "faq-facilities-checklist",
    question:
      "What facilities and coaching standards should athletes check before joining a sports academy?",
    answer:
      "Before paying academy admission or training fees, athletes and parents should verify: 1) Coach certifications (SAI NIS Patiala diplomas, AFC/UEFA for football, BCCI Level 1-3 for cricket, BWF for badminton); 2) Facility quality (floodlights, synthetic turf, wooden sprung courts, Olympic-size pools, gym equipment); 3) Dedicated medical and sports science staff (physiotherapist, sports nutritionist, strength and conditioning coaches); 4) Safe boarding facilities with 24/7 warden supervision and CCTV; and 5) Integrated schooling or flexible open schooling tie-ups (NIOS/CBSE).",
    category: "Facilities & Safety",
  },
  {
    id: "faq-selection-pathway",
    question:
      "Can an athlete get selected for Indian national teams or state squads directly through private academies?",
    answer:
      "Yes. While national team selection is formally administered by National Sports Federations (NSFs) and state associations, scouts and selectors regularly attend state championships, Khelo India Youth Games, and open federation trials where private academy players compete. Top academies also maintain direct tie-ups with district associations, allowing their registered athletes to participate in official state selection trials and national ranking events.",
    category: "Selection",
  },
  {
    id: "faq-khelgrid-verification",
    question: "How does KhelGrid verify and list sports academies in its directory?",
    answer:
      "KhelGrid maintains an independent sports intelligence directory. Every academy listing is cross-checked against official Khelo India accreditation lists, SAI state training centre notices, and state sports directorate registries. We display verified facilities, coach profiles, estimated monthly or annual fee ranges, hostel availability, and direct official contact details to help athletes and parents make transparent, informed decisions.",
    category: "Accreditation",
  },
  {
    id: "faq-day-boarding-vs-residential",
    question:
      "What is the difference between day-boarding and full residential sports academy programs?",
    answer:
      "Day-boarding academies provide 2 to 4 hours of daily skill and fitness training while athletes live at home and attend their regular day school. Full residential academies (sports hostels) provide complete accommodation, sports-specific nutrition, strength training, academic tutoring, medical care, and round-the-clock coaching on campus. Residential programs are recommended for athletes competing at state or national championship levels.",
    category: "Eligibility",
  },
  {
    id: "faq-cricket-academy-selection",
    question: "How do I choose the best cricket academy for BCCI state trials preparation?",
    answer:
      "Choose a cricket academy affiliated with the state cricket association (e.g., DDCA, MCA, KSCA, CAB, UPCA) featuring turf wickets, bowling machines, video analysis equipment, and BCCI-certified Level 1/2/3 head coaches. Participating in state-recognized club leagues through the academy gives players the official match records required for U-14, U-16, and U-19 district and state selection trials.",
    category: "Selection",
  },
];

export function generateAcademyFaqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: ACADEMY_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
