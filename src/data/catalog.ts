// Master catalog powering 100+ dynamically-generated pages across
// /sport/$slug, /city/$slug, /guide/$slug and /tools/$slug.

export interface Sport {
  slug: string;
  name: string;
  tagline: string;
  level: "Entry" | "Intermediate" | "Elite";
  ageBand: string;
  emoji: string;
  highlights: string[];
}

export interface City {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  venueNote: string;
  hubs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  category:
    | "Trial prep"
    | "Sports CV"
    | "Scholarships"
    | "Nutrition"
    | "Mindset"
    | "Parents"
    | "Recovery"
    | "Tech";
  readMins: number;
  excerpt: string;
  steps: string[];
  author?: string;
  sourceNote?: string;
}

export interface Tool {
  slug: string;
  name: string;
  category: "Calculator" | "Checklist" | "Planner" | "Estimator";
  blurb: string;
  inputs: { label: string; placeholder: string }[];
}

export const SPORTS_CATALOG: Sport[] = [
  {
    slug: "cricket",
    name: "Cricket",
    tagline: "Age-group, academy and competition pathways",
    level: "Elite",
    ageBand: "U-12 to Pro",
    emoji: "🏏",
    highlights: [
      "Age-group competition routes",
      "Academy and association trials",
      "Match-record preparation",
    ],
  },
  {
    slug: "football",
    name: "Football",
    tagline: "Club, academy and league trial pathways",
    level: "Elite",
    ageBand: "U-13 to U-23",
    emoji: "⚽",
    highlights: [
      "Club and academy open trials",
      "State and league competition routes",
      "Combine and assessment preparation",
    ],
  },
  {
    slug: "badminton",
    name: "Badminton",
    tagline: "Club, academy and ranking-event pathways",
    level: "Elite",
    ageBand: "U-11 to Senior",
    emoji: "🏸",
    highlights: [
      "State association entry routes",
      "Academy assessment camps",
      "Singles and doubles preparation",
    ],
  },
  {
    slug: "athletics",
    name: "Athletics",
    tagline: "Sprint, throws and distance-event pathways",
    level: "Elite",
    ageBand: "U-14 to Senior",
    emoji: "🏃",
    highlights: [
      "Track and field event groups",
      "State and national meet routes",
      "Para-athletics information",
    ],
  },
  {
    slug: "hockey",
    name: "Hockey",
    tagline: "Club, academy and age-group hockey pathways",
    level: "Elite",
    ageBand: "U-14 to Senior",
    emoji: "🏑",
    highlights: [
      "Age-group camp research",
      "State and academy opportunities",
      "Outfield and goalkeeper preparation",
    ],
  },
  {
    slug: "tennis",
    name: "Tennis",
    tagline: "Club, academy and ranking-event pathways",
    level: "Elite",
    ageBand: "U-10 to Pro",
    emoji: "🎾",
    highlights: [
      "Ranking-event research",
      "Academy assessment days",
      "Tournament planning and preparation",
    ],
  },
  {
    slug: "kabaddi",
    name: "Kabaddi",
    tagline: "Club, state and league competition pathways",
    level: "Intermediate",
    ageBand: "U-17 to Pro",
    emoji: "🤼",
    highlights: ["Raid and defence roles", "State competition research", "Mat-trial preparation"],
  },
  {
    slug: "basketball",
    name: "Basketball",
    tagline: "Club, school and league competition pathways",
    level: "Intermediate",
    ageBand: "U-14 to Senior",
    emoji: "🏀",
    highlights: [
      "5v5 and 3x3 formats",
      "School and academy opportunities",
      "Skills and assessment preparation",
    ],
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    tagline: "Club, school and state competition pathways",
    level: "Intermediate",
    ageBand: "U-16 to Senior",
    emoji: "🏐",
    highlights: [
      "School and club opportunities",
      "Age-group competition research",
      "Block and spike preparation",
    ],
  },
  {
    slug: "table-tennis",
    name: "Table Tennis",
    tagline: "Club, school and ranking-event pathways",
    level: "Intermediate",
    ageBand: "U-11 to Senior",
    emoji: "🏓",
    highlights: [
      "Cadet and junior competition",
      "Club and academy opportunities",
      "Match and ranking preparation",
    ],
  },
  {
    slug: "boxing",
    name: "Boxing",
    tagline: "Club, state and age-group boxing pathways",
    level: "Elite",
    ageBand: "U-15 to Senior",
    emoji: "🥊",
    highlights: [
      "Weight-class preparation",
      "Club and state opportunities",
      "Safe sparring and assessment guidance",
    ],
  },
  {
    slug: "wrestling",
    name: "Wrestling",
    tagline: "Club, akhada and competition pathways",
    level: "Elite",
    ageBand: "U-15 to Senior",
    emoji: "🤼",
    highlights: [
      "Freestyle and Greco-Roman formats",
      "State competition research",
      "Safe weigh-in and preparation guidance",
    ],
  },
  {
    slug: "swimming",
    name: "Swimming",
    tagline: "Club, school and age-group swimming pathways",
    level: "Intermediate",
    ageBand: "U-10 to Senior",
    emoji: "🏊",
    highlights: ["Pool-event preparation", "Age-group meet research", "Pool and open-water safety"],
  },
  {
    slug: "shooting",
    name: "Shooting",
    tagline: "Club, range and competition pathways",
    level: "Elite",
    ageBand: "U-14 to Senior",
    emoji: "🎯",
    highlights: [
      "Air rifle and pistol formats",
      "Trap and skeet research",
      "Range safety and competition prep",
    ],
  },
  {
    slug: "archery",
    name: "Archery",
    tagline: "Club, school and ranking-event pathways",
    level: "Intermediate",
    ageBand: "U-12 to Senior",
    emoji: "🏹",
    highlights: [
      "Recurve and compound divisions",
      "Ranking-event research",
      "Equipment and range preparation",
    ],
  },
  {
    slug: "esports",
    name: "Esports",
    tagline: "Online competition and team-building pathways",
    level: "Entry",
    ageBand: "16+",
    emoji: "🎮",
    highlights: [
      "Online qualifier formats",
      "Team and tournament preparation",
      "Player safety and fair-play guidance",
    ],
  },
  {
    slug: "pickleball",
    name: "Pickleball",
    tagline: "PWR state selection, ranking tournaments & national squad pathways",
    level: "Elite",
    ageBand: "Open & Age-Group",
    emoji: "🏓",
    highlights: [
      "Indian Pickleball Association (IPA) sanctioned events",
      "PWR 400 state selection trials and ranking points",
      "Singles, doubles, and mixed doubles competitive brackets",
    ],
  },
  {
    slug: "kho-kho",
    name: "Kho-Kho",
    tagline:
      "Junior & Senior National championships, KKFI state trials & Ultimate Kho Kho combine pathways",
    level: "National",
    ageBand: "Junior (U-18) & Senior",
    emoji: "🏃‍♂️",
    highlights: [
      "Kho Kho Federation of India (KKFI) affiliated state selection trials",
      "Junior National & Senior National Championship state squad selections",
      "Ultimate Kho Kho franchise league draft, agility testing & combine pathways",
    ],
  },
  {
    slug: "wushu",
    name: "Wushu",
    tagline: "All India Inter-University championships, Sanda combat & Taolu routines",
    level: "National",
    ageBand: "Collegiate / University",
    emoji: "🥋",
    highlights: [
      "Association of Indian Universities (AIU) National Championship",
      "Sanda (combat/sanshou) and Taolu (routines/forms) disciplines",
      "Institutional university team selections and AIU sports portal entry",
    ],
  },
  {
    slug: "gymnastics",
    name: "Gymnastics",
    tagline: "Artistic, rhythmic & trampoline national championships & SAI academy combines",
    level: "National",
    ageBand: "Sub-Junior to Senior",
    emoji: "🤸",
    highlights: [
      "Gymnastics Federation of India (GFI) recognized selection trials",
      "Floor exercise, vault, pommel horse, parallel bars & balance beam",
      "SAI National Centres of Excellence (NCOE) developmental squads",
    ],
  },
  {
    slug: "handball",
    name: "Handball",
    tagline: "High-speed team handball state leagues, national games & inter-university trials",
    level: "Intermediate",
    ageBand: "U-15 to Senior",
    emoji: "🤾",
    highlights: [
      "Handball Federation of India (HFI) sanctioned combines",
      "Fast break transitions, jump-shot techniques & 6-0 defensive formations",
      "Armed forces and central police sports quota trials",
    ],
  },
  {
    slug: "judo",
    name: "Judo",
    tagline: "Olympic martial art, ippon throws, ne-waza grappling & national ranking trials",
    level: "Elite",
    ageBand: "Cadet, Junior & Senior",
    emoji: "🥋",
    highlights: [
      "Judo Federation of India (JFI) national championships",
      "Weight-category trials: Osoto Gari, Seoi Nage & ground submission work",
      "Services, CAPF and SAI talent pipeline selections",
    ],
  },
  {
    slug: "karate",
    name: "Karate",
    tagline: "Kata forms, Kumite sparring & WKF world championship qualifying trials",
    level: "National",
    ageBand: "Cadet to Senior",
    emoji: "🥋",
    highlights: [
      "Karate India Organisation (KIO) state and national trials",
      "WKF point scoring (Ippon, Waza-ari, Yuko) and strict timing discipline",
      "Khelo India University Games & national ranking tournaments",
    ],
  },
  {
    slug: "taekwondo",
    name: "Taekwondo",
    tagline: "Olympic sparring (Kyorugi), electronic PSS body protectors & Poomsae forms",
    level: "Elite",
    ageBand: "Cadet, Junior & Senior",
    emoji: "🥋",
    highlights: [
      "India Taekwondo & World Taekwondo recognized ranking trials",
      "Electronic chest protector scoring, head kicks & spin techniques",
      "National games and sports quota recruitment trials",
    ],
  },
  {
    slug: "water-sports",
    name: "Water Sports",
    tagline: "Kayaking, canoeing, rowing regattas & national aquatic combines",
    level: "National",
    ageBand: "Junior to Senior",
    emoji: "🛶",
    highlights: [
      "Indian Kayaking and Canoeing Association (IKCA) regattas",
      "Rowing Federation of India (RFI) 2000m sprint trials",
      "SAI water sports training centres at Alleppey, Bhopal & Chandigarh",
    ],
  },
  {
    slug: "weightlifting",
    name: "Weightlifting",
    tagline: "Snatch, Clean & Jerk Olympic lifting combines, barbell biomechanics & state trials",
    level: "Elite",
    ageBand: "Youth, Junior & Senior",
    emoji: "🏋️",
    highlights: [
      "Indian Weightlifting Federation (IWLF) national selection meets",
      "Bodyweight categories, 3-attempt competition formats & strict judging",
      "Armed forces, Railways & paramilitary sports quota pipelines",
    ],
  },
  {
    slug: "yoga",
    name: "Yoga",
    tagline: "Yogasana Bharat national championships, traditional asanas & artistic posture trials",
    level: "National",
    ageBand: "Sub-Junior to Senior",
    emoji: "🧘",
    highlights: [
      "National Yogasana Sports Federation (NYSF) & Yogasana Bharat",
      "Traditional, artistic, rhythmic & free-flow yogasana competitions",
      "National school games, university sports & government quota trials",
    ],
  },
  {
    slug: "fencing",
    name: "Fencing",
    tagline: "Foil, Épée & Sabre dueling, piste footwork & electronic tip-scoring trials",
    level: "National",
    ageBand: "Cadet, Junior & Senior",
    emoji: "🤺",
    highlights: [
      "Fencing Association of India (FAI) national rankings",
      "Right-of-way rules for Foil and Sabre; full-body target for Épée",
      "SAI NCOE elite fencing training centres across India",
    ],
  },
  {
    slug: "equestrian",
    name: "Equestrian",
    tagline: "Show jumping, dressage, eventing & tent pegging national championships",
    level: "Elite",
    ageBand: "Junior & Open",
    emoji: "🏇",
    highlights: [
      "Equestrian Federation of India (EFI) national events",
      "Show jumping course faults, dressage test scoring & cross-country",
      "Remount Veterinary Corps, Army & Central Police Equestrian teams",
    ],
  },
];

export const CITIES_CATALOG: City[] = [
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "SAI hub with year-round national camps",
    venueNote: "Major sports hubs and venue research starting points",
    hubs: ["JLN Stadium", "SAI Karni Singh", "Thyagaraj Stadium"],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Cricket, football and combined-sport combines",
    venueNote: "Cricket, football and multi-sport venue research",
    hubs: ["Wankhede", "MCA-BKC", "Cooperage"],
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    tagline: "Padukone-Dravid centre and ISL academies",
    venueNote: "Academy, stadium and aquatic venue research",
    hubs: ["Chinnaswamy", "Kanteerava", "Sree Kanteerava Aquatic"],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "Gopichand badminton + Sania Mirza tennis",
    venueNote: "Badminton, tennis and multi-sport venue research",
    hubs: ["Gachibowli Stadium", "Uppal Cricket", "GMC Balayogi"],
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    state: "Chandigarh",
    tagline: "Punjab hockey + athletics pipeline",
    venueNote: "Hockey, athletics and community sports hubs",
    hubs: ["Sector-7 Stadium", "PCA Mohali", "Sukhna Lake"],
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    tagline: "Tennis, football and tier-1 academy belt",
    venueNote: "Tennis, football and academy venue research",
    hubs: ["Balewadi Stadium", "MCA-Gahunje", "DECCAN Gymkhana"],
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    tagline: "Football mecca with derby-level trials",
    venueNote: "Football, cricket and community sports hubs",
    hubs: ["Salt Lake Stadium", "Eden Gardens", "Mohun Bagan ground"],
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    tagline: "Chess, athletics and TNCA cricket trials",
    venueNote: "Cricket, chess and athletics venue research",
    hubs: ["MA Chidambaram", "Nehru Stadium", "SDAT Tennis Stadium"],
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    tagline: "Narendra Modi Stadium and IPL feeder camps",
    venueNote: "Stadium, academy and multi-sport venue research",
    hubs: ["Narendra Modi Stadium", "Sardar Patel Stadium", "TransStadia"],
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Sawai Mansingh trials & athletics meets",
    venueNote: "Athletics, hockey and community sports hubs",
    hubs: ["Sawai Mansingh Stadium", "SMS Indoor", "JKP Hockey"],
  },
  {
    slug: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    tagline: "Ekana cricket + Sports College pathway",
    venueNote: "Cricket, athletics and school-sports hubs",
    hubs: ["Ekana Stadium", "KD Singh Babu", "Guru Govind Singh Sports College"],
  },
  {
    slug: "bhubaneswar",
    name: "Bhubaneswar",
    state: "Odisha",
    tagline: "Hockey capital with Kalinga showcase weeks",
    venueNote: "Hockey, athletics and aquatic venue research",
    hubs: ["Kalinga Stadium", "Kalinga Hockey", "BSE Aquatic"],
  },
  {
    slug: "guwahati",
    name: "Guwahati",
    state: "Assam",
    tagline: "Northeast pathway for football and athletics",
    venueNote: "Football, athletics and community sports hubs",
    hubs: ["Sarusajai Stadium", "Nehru Stadium", "Indira Gandhi Athletics"],
  },
  {
    slug: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    tagline: "Holkar trials + central-zone combines",
    venueNote: "Cricket, athletics and indoor-sports hubs",
    hubs: ["Holkar Stadium", "Nehru Stadium", "Abhay Prashal"],
  },
  {
    slug: "kochi",
    name: "Kochi",
    state: "Kerala",
    tagline: "Kerala Blasters academy + ISL hunts",
    venueNote: "Football, athletics and indoor-sports hubs",
    hubs: ["Jawaharlal Nehru Stadium", "Maharaja's", "Rajiv Gandhi Indoor"],
  },
  {
    slug: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "FC Goa pipeline and beach-sport selections",
    venueNote: "Football, beach-sport and community hubs",
    hubs: ["GMC Stadium Bambolim", "Tilak Maidan", "Nehru Stadium Fatorda"],
  },
  {
    slug: "namchi",
    name: "Namchi",
    state: "Sikkim",
    tagline: "Fit India School Games district trials & grassroots sports hub",
    venueNote: "Bhaichung Stadium, Indoor Stadium, Boxing Hall Car Plaza and Namchi Public School",
    hubs: [
      "Bhaichung Stadium",
      "Indoor Stadium Namchi",
      "Boxing Hall Car Plaza",
      "Namchi Public School Ground",
    ],
  },
  {
    slug: "gangtok",
    name: "Gangtok",
    state: "Sikkim",
    tagline: "State-level championships and Himalayan high-altitude training",
    venueNote: "Paljor Stadium, Mining Ground and Sikkim State Sports Complex",
    hubs: ["Paljor Stadium", "TNA Ground", "Sikkim Sports Complex"],
  },
  {
    slug: "kanpur",
    name: "Kanpur",
    state: "Uttar Pradesh",
    tagline: "Historic Green Park, KCA district trials & UPCA cricket pipeline",
    venueNote: "Kanpur South Ground (Kidwai Nagar), Green Park Stadium and Kamla Club Ground",
    hubs: ["Kanpur South Ground", "Green Park Stadium", "Kamla Club Ground"],
  },
];

const GUIDE_ENTRIES: Guide[] = [
  {
    slug: "cricket-trial-prep-checklist",
    title: "Cricket trial-prep checklist (T-7 days)",
    category: "Trial prep",
    readMins: 6,
    excerpt:
      "Kit, fitness, food and mental drills for the seven days before a state cricket trial.",
    steps: ["Pack kit a day in advance", "Hydrate from T-3", "Visualise dismissals & shots"],
  },
  {
    slug: "football-combine-fitness-test",
    title: "How to prepare for football combine fitness tests",
    category: "Trial prep",
    readMins: 7,
    excerpt:
      "A practical way to train for endurance, sprint, agility, and jump assessments without guessing the organizer's standards.",
    steps: [
      "Ask the organizer for the test format",
      "Train endurance and acceleration separately",
      "Record practice results under consistent conditions",
    ],
  },
  {
    slug: "badminton-rankings-explained",
    title: "Badminton rankings, ladders and event entry",
    category: "Trial prep",
    readMins: 8,
    excerpt:
      "How to understand age-group rankings and check current event-entry rules before planning a competition pathway.",
    steps: [
      "Find the current association calendar",
      "Check your age group and entry requirements",
      "Keep match records and confirm ranking rules",
    ],
  },
  {
    slug: "athletics-personal-best-tracker",
    title: "Tracking PBs the right way for athletics",
    category: "Trial prep",
    readMins: 5,
    excerpt: "A simple framework to log timed events, throws and jumps for selection.",
    steps: ["Wind-legal vs wind-aided", "Implement weight check", "Video every PB attempt"],
  },
  {
    slug: "hockey-trial-positions-guide",
    title: "Picking your hockey position for trials",
    category: "Trial prep",
    readMins: 6,
    excerpt: "Where selectors look first — and how to pick a position you can dominate.",
    steps: ["Audit your turning radius", "Time your push & flick", "Try goalkeeper drills"],
  },
  {
    slug: "tennis-aita-points-roadmap",
    title: "AITA points roadmap for U-14 to U-18",
    category: "Trial prep",
    readMins: 7,
    excerpt: "Tournament sequencing to climb the AITA ladder fast.",
    steps: ["Pick 6 super-series events", "Track ranking weekly", "Travel in clusters"],
  },
  {
    slug: "sports-cv-template-india",
    title: "The India-ready Sports CV template",
    category: "Sports CV",
    readMins: 5,
    excerpt: "What Indian selectors actually look for in a one-page Sports CV.",
    steps: ["Headline + sport + level", "Top 3 results", "Coach reference"],
  },
  {
    slug: "verified-sports-cv-benefits",
    title: "How a Verified Sports CV helps scouts review your profile",
    category: "Sports CV",
    readMins: 4,
    excerpt:
      "A clear profile can help a coach review your identity, results, footage, and references in one place.",
    steps: [
      "Upload identity and result proofs",
      "Add a coach or academy reference",
      "Keep the profile link and dates current",
    ],
  },
  {
    slug: "uploading-match-footage-tips",
    title: "Uploading match footage that actually gets watched",
    category: "Sports CV",
    readMins: 6,
    excerpt: "Camera angles, length and editing rules for highlight reels.",
    steps: ["90-second cap", "Wide angle, not zoom", "Add timestamps"],
  },
  {
    slug: "khelo-india-scholarships",
    title: "How to research Khelo India scholarships",
    category: "Scholarships",
    readMins: 8,
    excerpt:
      "A practical checklist for checking current scheme notices, eligibility, documents and application timelines.",
    steps: [
      "Read the current official scheme notice",
      "Check eligibility and document requirements",
      "Confirm the deadline with the responsible office",
    ],
  },
  {
    slug: "sai-stipend-process",
    title: "How to research SAI support and training schemes",
    category: "Scholarships",
    readMins: 7,
    excerpt:
      "How to compare current SAI notices, documents, deadlines and application channels without relying on an old circular.",
    steps: [
      "Find the current SAI or centre notice",
      "List the requested identity and performance documents",
      "Confirm the submission channel and deadline",
    ],
  },
  {
    slug: "private-academy-scholarship-research",
    title: "How to research private academy scholarships",
    category: "Scholarships",
    readMins: 9,
    excerpt:
      "Questions to ask about tuition, boarding, kit, travel, selection and written scholarship terms.",
    steps: [
      "Shortlist programs by sport and location",
      "Ask for written fee and scholarship terms",
      "Confirm the trial, renewal and exit conditions",
    ],
  },
  {
    slug: "pre-trial-meal-plan",
    title: "How to plan food and hydration before a trial",
    category: "Nutrition",
    readMins: 5,
    excerpt:
      "A conservative checklist for familiar food, hydration, timing and questions to discuss with a qualified professional.",
    steps: [
      "Use familiar meals",
      "Drink regularly rather than experimenting",
      "Ask a qualified professional about individual needs",
    ],
  },
  {
    slug: "indian-veg-athlete-protein",
    title: "Protein hits for vegetarian Indian athletes",
    category: "Nutrition",
    readMins: 6,
    excerpt: "Dal-paneer-egg combinations that hit 1.6g/kg body weight.",
    steps: ["Soya + curd combo", "Sprouts at breakfast", "Paneer post-training"],
  },
  {
    slug: "hydration-summer-trials",
    title: "Hydration plan for summer trials in India",
    category: "Nutrition",
    readMins: 4,
    excerpt: "Electrolyte ratios for 35°C+ outdoor sessions.",
    steps: ["500ml at -90 min", "Salt + lemon mid-session", "Coconut water post"],
  },
  {
    slug: "performance-anxiety-fix",
    title: "5-minute fixes for performance anxiety",
    category: "Mindset",
    readMins: 4,
    excerpt: "Box breathing, anchoring and trigger phrases used by Indian pros.",
    steps: ["Box breathing 4-4-4-4", "Anchor a trigger word", "Visualise success rep"],
  },
  {
    slug: "post-trial-recovery",
    title: "Post-trial recovery — 48 hours that matter",
    category: "Recovery",
    readMins: 5,
    excerpt: "Sleep, ice and mobility windows after high-intensity trial days.",
    steps: ["8h sleep minimum", "Contrast bath night 1", "Light mobility day 2"],
  },
  {
    slug: "managing-rejection",
    title: "Coping with rejection from a major trial",
    category: "Mindset",
    readMins: 5,
    excerpt: "A 7-day reset cycle to get back on the pitch stronger.",
    steps: ["Day 1: rest", "Day 3: review tape", "Day 7: new goal"],
  },
  {
    slug: "parent-guide-trial-day",
    title: "Parent's guide to trial day",
    category: "Parents",
    readMins: 6,
    excerpt: "What to say, what to pack and how to back your kid without pressure.",
    steps: ["Arrive 60 min early", "Stay invisible during play", "One question at exit"],
  },
  {
    slug: "supporting-young-athletes",
    title: "Supporting a 12-15 year old athlete",
    category: "Parents",
    readMins: 7,
    excerpt: "Balancing academics, screen time and training load for teens.",
    steps: ["Cap training to 14h/week", "Protect 9h sleep", "Weekly check-in chat"],
  },
  {
    slug: "academy-fee-negotiation",
    title: "Negotiating academy fees & boarding costs",
    category: "Parents",
    readMins: 5,
    excerpt: "Scripts, leverage and the right questions to ask academy directors.",
    steps: ["Get 3 written quotes", "Ask for performance discount", "Bundle siblings"],
  },
  {
    slug: "injury-prevention-15-min-warmup",
    title: "A 15-minute football-inspired warm-up",
    category: "Recovery",
    readMins: 6,
    excerpt:
      "A structured warm-up sequence to discuss with a qualified coach before training or competition.",
    steps: [
      "Start with a light jog and dynamic movement",
      "Add controlled strength and balance drills",
      "Finish with sport-specific movement",
    ],
  },
  {
    slug: "sleep-and-performance",
    title: "Sleep × performance for Indian athletes",
    category: "Recovery",
    readMins: 5,
    excerpt: "Why 9 hours beats 7 for U-21 athletes — and how to get them.",
    steps: ["Hard cutoff for screens", "Cool room <22°C", "No caffeine after 2pm"],
  },
  {
    slug: "ai-talent-scanner-explainer",
    title: "What the AI Talent Scanner actually measures",
    category: "Tech",
    readMins: 6,
    excerpt: "Under the hood: pose estimation, repeatability and how it ranks.",
    steps: ["Upload 3 clips", "Get repeatability score", "Compare vs cohort"],
  },
  {
    slug: "wearables-for-young-athletes",
    title: "Which wearable should a young athlete pick?",
    category: "Tech",
    readMins: 7,
    excerpt: "Heart-rate, GPS and load metrics that matter at U-18.",
    steps: ["Stick to HR + GPS", "Cap notifications", "Weekly load review"],
  },
  {
    slug: "video-analysis-tools",
    title: "Free video-analysis tools for clip breakdown",
    category: "Tech",
    readMins: 5,
    excerpt: "Slow-mo, angle overlays and tagging tools that don't cost a rupee.",
    steps: ["Pick a tagging app", "Slow to 0.25x", "Share via timestamped link"],
  },
  {
    slug: "selectors-checklist",
    title: "What to ask about a selection assessment",
    category: "Trial prep",
    readMins: 6,
    excerpt:
      "A practical checklist for understanding technical, tactical, physical and behavioural assessment criteria without assuming a universal scoring formula.",
    steps: [
      "Ask which skills are assessed",
      "Record the test format and conditions",
      "Request feedback when the organizer offers it",
    ],
  },
  {
    slug: "online-competitions-india",
    title: "Best online competitions for Indian athletes",
    category: "Trial prep",
    readMins: 5,
    excerpt: "From e-cricket to chess.com Titled Tuesdays — a list that opens doors.",
    steps: ["Pick rated platforms", "Streamed = sponsor visible", "Archive your runs"],
  },
  {
    slug: "transfer-rules-academy",
    title: "Transferring between academies — the rules",
    category: "Trial prep",
    readMins: 6,
    excerpt: "NOC, cooling-off periods and how transfers actually work in India.",
    steps: ["Request written NOC", "Honour 30-day cool-off", "Re-register with state body"],
  },
  {
    slug: "scholarship-essay-templates",
    title: "Scholarship essay templates that win",
    category: "Scholarships",
    readMins: 6,
    excerpt: "Three opening paragraphs that selection committees actually read.",
    steps: ["Lead with one moment", "Quantify a result", "End with the ask"],
  },
];

export const GUIDES_CATALOG: Guide[] = GUIDE_ENTRIES.map((guide) => ({
  ...guide,
  author: "KhelGrid Sports Editorial Team",
  sourceNote:
    "General educational guidance; confirm current rules, deadlines and eligibility with the relevant organizer or official body.",
}));

export const TOOLS_CATALOG: Tool[] = [
  {
    slug: "trial-readiness-score",
    name: "Trial readiness score",
    category: "Calculator",
    blurb: "Get a 0-100 readiness rating before your next trial.",
    inputs: [
      { label: "Sessions/week", placeholder: "6" },
      { label: "Sleep avg (h)", placeholder: "8" },
      { label: "Recent PR delta %", placeholder: "+3" },
    ],
  },
  {
    slug: "sports-cv-builder-checklist",
    name: "Sports CV builder checklist",
    category: "Checklist",
    blurb: "Tick off the 12 sections every selector expects.",
    inputs: [
      { label: "Sport", placeholder: "Cricket" },
      { label: "Level", placeholder: "U-19 state" },
    ],
  },
  {
    slug: "scholarship-eligibility-checker",
    name: "Scholarship eligibility checker",
    category: "Estimator",
    blurb: "See which schemes you qualify for in under a minute.",
    inputs: [
      { label: "Age", placeholder: "16" },
      { label: "Best rank", placeholder: "State silver" },
    ],
  },
  {
    slug: "calorie-needs-athlete",
    name: "Athlete calorie needs",
    category: "Calculator",
    blurb: "Get a daily calorie target tuned for your sport & weight.",
    inputs: [
      { label: "Weight (kg)", placeholder: "62" },
      { label: "Training hrs/day", placeholder: "3" },
    ],
  },
  {
    slug: "weekly-load-planner",
    name: "Weekly training-load planner",
    category: "Planner",
    blurb: "Distribute volume so you peak on trial day.",
    inputs: [
      { label: "Trial date", placeholder: "Apr 12" },
      { label: "Current weekly load", placeholder: "12h" },
    ],
  },
  {
    slug: "travel-budget-estimator",
    name: "Travel-budget estimator",
    category: "Estimator",
    blurb: "Ballpark cost of attending an out-of-state trial.",
    inputs: [
      { label: "From city", placeholder: "Patna" },
      { label: "To city", placeholder: "Bengaluru" },
    ],
  },
  {
    slug: "vo2-max-estimator",
    name: "VO2 max estimator",
    category: "Estimator",
    blurb: "Quick estimate from a 12-min Cooper run.",
    inputs: [{ label: "Distance (m)", placeholder: "2800" }],
  },
  {
    slug: "sprint-split-calculator",
    name: "Sprint-split calculator",
    category: "Calculator",
    blurb: "Break a 100m PB into 10m splits.",
    inputs: [{ label: "100m time (s)", placeholder: "11.4" }],
  },
  {
    slug: "match-fee-roi",
    name: "Match-fee ROI calculator",
    category: "Calculator",
    blurb: "Compare entry fee × shot at scouts × callback rate.",
    inputs: [
      { label: "Fee", placeholder: "1500" },
      { label: "Scouts present", placeholder: "8" },
    ],
  },
  {
    slug: "academy-shortlist-builder",
    name: "Academy shortlist builder",
    category: "Planner",
    blurb: "Score 5 academies on fit, fees and pathway.",
    inputs: [
      { label: "Sport", placeholder: "Football" },
      { label: "Max fee/yr", placeholder: "1.5L" },
    ],
  },
  {
    slug: "boost-vs-organic-estimator",
    name: "Boost vs organic-reach estimator",
    category: "Estimator",
    blurb: "Organizers: estimate applies for boosted vs free listings.",
    inputs: [
      { label: "Listing budget", placeholder: "1500" },
      { label: "City reach", placeholder: "Mumbai" },
    ],
  },
  {
    slug: "trial-day-packing-list",
    name: "Trial-day packing list",
    category: "Checklist",
    blurb: "Don't forget the one thing that disqualifies most athletes.",
    inputs: [
      { label: "Sport", placeholder: "Hockey" },
      { label: "Outdoor?", placeholder: "Yes" },
    ],
  },
];

export const ALL_CATALOG_PATHS: string[] = [
  ...SPORTS_CATALOG.map((s) => `/sport/${s.slug}`),
  ...CITIES_CATALOG.map((c) => `/city/${c.slug}`),
  ...GUIDES_CATALOG.map((g) => `/guide/${g.slug}`),
  ...TOOLS_CATALOG.map((t) => `/tools/${t.slug}`),
];
