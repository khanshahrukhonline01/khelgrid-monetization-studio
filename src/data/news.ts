export interface SportsNewsArticle {
  id: string;
  slug: string;
  blogSlug?: string;
  title: string;
  headline: string;
  excerpt: string;
  content: string;
  sport:
    | "Cricket"
    | "Football"
    | "Tennis"
    | "Badminton"
    | "Basketball"
    | "Athletics"
    | "Wrestling"
    | "Kabaddi"
    | "Grassroots"
    | "Multi-Sport";
  category: "National" | "Trials & Selection" | "Grassroots" | "Championships" | "Scholarship";
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  trending?: boolean;
  featured?: boolean;
  onlyChronicle?: boolean;
  officialSourceUrl?: string;
  pibPrid?: string;
  venueId?: string;
  venueName?: string;
}

export const SPORTS_NEWS_CATALOG: SportsNewsArticle[] = [
  {
    id: "news-pib-2321660-brics-sports-ahmedabad-veer-savarkar-2026",
    slug: "india-hosts-brics-indigenous-sports-demonstration-games-2026-ahmedabad-veer-savarkar",
    title:
      "India to Host BRICS Traditional and Indigenous Sports Demonstration Games 2026 in Ahmedabad",
    headline:
      "Ministry of Youth Affairs & Sports collaborates with Gujarat Government to showcase Mallakhamb, Yogasana, Wushu, and BRICS heritage disciplines at Veer Savarkar Sports Complex.",
    excerpt:
      "Official PIB Press Release (PRID: 2321660): Under India's BRICS Chairship, the Ministry of Youth Affairs and Sports and Government of Gujarat host the BRICS Traditional and Indigenous Sports Demonstration Games on October 12, 2026 at the Veer Savarkar Sports Complex in Naranpura, Ahmedabad.",
    content:
      "Under India's BRICS Chairship, the Ministry of Youth Affairs and Sports (MYAS), Government of India, in active collaboration with the Government of Gujarat, will host the BRICS Traditional and Indigenous Sports Demonstration Games 2026 on October 12, 2026. The prestigious non-competitive showcase takes place at the newly inaugurated Veer Savarkar Sports Complex located in Naranpura, Ahmedabad.\n\nThe games provide a dynamic platform to celebrate indigenous sporting heritage, promote intercultural dialogue, and strengthen sports diplomacy and youth cooperation across BRICS member and partner nations. Demonstrations will showcase India's traditional disciplines including Mallakhamb, Yogasana, and Kalaripayattu, alongside China's Wushu and diverse cultural sporting practices presented by visiting international delegations from Brazil, Russia, South Africa, the UAE, Iran, Ethiopia, Belarus, Bolivia, and Kazakhstan.\n\nThe world-class Veer Savarkar Sports Complex—developed across 1.19 lakh square meters (21 acres) at a cost of approximately ₹825 crore—features an Olympic-standard aquatic stadium, indoor multi-sport arena, Centre for Sports Excellence, 275 kW solar power installation, and comprehensive athlete support facilities.",
    sport: "Multi-Sport",
    category: "National",
    publishedAt: "2026-10-10T11:00:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Press Information Bureau (PIB)",
      role: "Official Government Release (PRID: 2321660)",
    },
    tags: [
      "BRICS 2026",
      "Veer Savarkar Sports Complex",
      "Ahmedabad",
      "PIB 2321660",
      "MYAS",
      "Mallakhamb",
      "Yogasana",
      "Wushu",
      "Indigenous Sports",
      "KhelChronicle",
    ],
    trending: true,
    featured: true,
    onlyChronicle: true,
    officialSourceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2321660&reg=48&lang=2",
    pibPrid: "2321660",
    venueId: "v-veer-savarkar-sports-complex-ahmedabad",
    venueName: "Veer Savarkar Sports Complex, Ahmedabad",
  },
  {
    id: "news-kca-kanpur-u14-cricket-trials-2026",
    slug: "kca-conducts-u-14-trials-for-165-aspirants-kanpur",
    blogSlug: "kca-conducts-u-14-trials-for-165-aspirants-kanpur",
    title: "KCA Conducts U-14 Selection Trials for 165 Aspirants at Kanpur South Ground",
    headline:
      "Kanpur Cricket Association selectors Rakesh Tiwari and Vikas Yadav assess junior cricketers across two days for UPCA state selection pathway.",
    excerpt:
      "Official TOI coverage: Over 165 aspiring cricketers attended two-day Under-14 trials conducted by KCA at Kanpur South ground in Kidwai Nagar to earn berths in the upcoming UPCA state trials.",
    content:
      "The Kanpur Cricket Association (KCA) successfully conducted comprehensive selection trials for the Under-14 age group, drawing 165 aspiring young cricketers from across the district. The two-day trials were hosted at the Kanpur South ground in Kidwai Nagar. Senior KCA selectors Rakesh Tiwari and Vikas Yadav closely assessed the skills, technique, and match temperament of the aspirants across bowling, batting, and fielding drills. The standout performers identified during this trial process will advance to represent Kanpur district in the upcoming Uttar Pradesh Cricket Association (UPCA) state selection trials, forming the pathway to the Vijay Merchant Trophy junior domestic setup.",
    sport: "Cricket",
    category: "Trials & Selection",
    publishedAt: "2026-10-09T14:30:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "The Times of India / KCA Desk",
      role: "Official TOI Sports Report",
    },
    tags: [
      "Cricket",
      "Kanpur",
      "KCA",
      "UPCA",
      "U-14",
      "Kidwai Nagar",
      "Selection Trials",
      "Grassroots",
    ],
    trending: true,
    featured: true,
  },
  {
    id: "news-green-park-kanpur-junior-basketball-trials-2026",
    slug: "green-park-stadium-kanpur-junior-basketball-selection-trials-oct-12-13-2026",
    blogSlug: "green-park-stadium-kanpur-junior-basketball-selection-trials",
    title:
      "District & Divisional Junior Basketball Selection Trials at Green Park Stadium on Oct 12 & 13",
    headline:
      "Regional Sports Officer, Sports Directorate confirms trials for junior boys at Green Park Stadium for UP State Tournament in Aligarh.",
    excerpt:
      "Official UP Sports Directorate announcement: District-level and divisional-level selection trials of junior basketball teams will take place at Green Park Stadium on Oct 12 and Oct 13 at 3:00 PM for the upcoming state championship in Aligarh.",
    content:
      "District-level and divisional-level selection trials of junior basketball teams will be held at Green Park Stadium on October 12 and October 13 at 3:00 PM. The selected team will participate in the Uttar Pradesh State Junior Boys Basketball Tournament to be held in Aligarh from October 29 to October 31, 2026. According to the Regional Sports Officer, Sports Directorate, interested players should bring their birth certificate issued by the municipal corporation (Nagar Nigam) and Aadhaar card at the time of the trials. For more details, players can contact his office at Green Park Stadium, Civil Lines, Kanpur. The initiative is supervised by the Sports Directorate, Department of Sports, Government of Uttar Pradesh (upsports.gov.in / khelsathi.in).",
    sport: "Basketball",
    category: "Trials & Selection",
    publishedAt: "2026-10-10T09:00:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "The Times of India / UP Sports Directorate",
      role: "Official Sports Directorate Correspondent",
    },
    tags: [
      "Basketball",
      "Kanpur",
      "Green Park Stadium",
      "Sports Directorate",
      "RSO Kanpur",
      "Aligarh Tournament",
      "Junior Basketball",
      "Trials",
    ],
    trending: true,
    featured: true,
  },
  {
    id: "news-fit-india-school-games-namchi-2026",
    slug: "fit-india-school-games-district-level-selection-trials-namchi-sikkim-2026",
    title:
      "District-Level Competition cum Selection Trials for Fit India School Games 2026 Held in Namchi",
    headline:
      "Sports & Youth Affairs Department, Government of Sikkim organizes U-17 selection trials across 8 disciplines at Bhaichung Stadium and Namchi sports complexes.",
    excerpt:
      "Official government announcement: Over 890 student-athletes from 8 Block Administrative Centers compete in track & field, archery, boxing, kabaddi, and martial arts for qualification to the State-Level School Games in Gangtok.",
    content:
      "The Sports & Youth Affairs Department, Government of Sikkim, successfully conducted the District-Level Competition cum Selection Trials for Fit India School Games 2026 in Namchi. The comprehensive event brought together Under-17 boys and girls from eight Block Administrative Centers (BACs) across Namchi district. Venues included the renowned Bhaichung Stadium, Namchi Indoor Stadium, Namchi Public School, and Boxing Hall Car Plaza. Student-athletes competed across eight premier disciplines including Archery, Boxing, Kabaddi, Karate, Kho-Kho, Table Tennis, Taekwondo, and Track & Field (100m, 400m, 800m, 1500m, Relay, Shot Put, and Long Jump). Winners were awarded official state medals, merit certificates, and earned direct berths to represent Namchi in the upcoming State-Level School Games in Gangtok under the Fit India Mission.",
    sport: "Athletics",
    category: "Trials & Selection",
    publishedAt: "2026-09-24T12:00:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Government of Sikkim / Sports & Youth Affairs Dept",
      role: "Official Government Release",
    },
    tags: [
      "Fit India",
      "Sikkim",
      "Namchi",
      "School Games",
      "Bhaichung Stadium",
      "Selection Trials",
      "Athletics",
      "Boxing",
      "Archery",
      "U-17",
      "Grassroots",
    ],
    featured: true,
    trending: true,
  },
  {
    id: "news-sai-mumbai-wrestling-trials-2026",
    slug: "sai-ncoe-mumbai-wrestling-selection-trials-september-30-2026",
    title:
      "SAI to Conduct Selection Trials for Men's and Women's Wrestling in Mumbai on September 30",
    headline:
      "Sports Authority of India (SAI) NCOE Kandivali invites U-17, U-20 and U-23 wrestlers across Freestyle, Greco-Roman, and Women's divisions.",
    excerpt:
      "Official notification from the Ministry of Youth Affairs and Sports: SAI Shri Atal Bihari Vajpayee NCOE Mumbai will host open selection trials on September 30, 2026 at 8:00 AM for residential athlete induction.",
    content:
      "The Sports Authority of India (SAI), National Centre of Excellence (NCOE), Mumbai, under the Ministry of Youth Affairs & Sports, Government of India, will conduct selection trials for Men's and Women's Wrestling on September 30, 2026. The trials will take place at the SAI Shri Atal Bihari Vajpayee National Centre of Excellence, Akurli Road, Kandivali (East), Mumbai. The selection trials are open to eligible boys and girls in the Under-17, Under-20, and Under-23 age brackets across Women's Wrestling (50 kg & above), Freestyle (57 kg & above), and Greco-Roman (55 kg to 130 kg). Reporting time is 8:00 AM with valid age verification, Aadhaar, and sports achievement documentation.",
    sport: "Wrestling",
    category: "Trials & Selection",
    publishedAt: "2026-09-24T15:30:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "PIB Mumbai / Sports Authority of India",
      role: "Official Government Release (PRID: 2314372)",
    },
    tags: [
      "Wrestling",
      "SAI NCOE",
      "Selection Trials",
      "Mumbai",
      "Kandivali",
      "Ministry of Youth Affairs and Sports",
      "U-17",
      "U-20",
      "U-23",
    ],
    featured: true,
    trending: true,
  },
  {
    id: "news-asian-games-2026-sept-23-live",
    slug: "asian-games-2026-live-updates-september-23-india-medal-tally-analysis",
    blogSlug: "asian-games-2026-live-updates-september-23-india-medal-tally-analysis",
    title:
      "Asian Games 2026 Live Updates (Sept 23): India Medal Tally Hits 12 as Mirabai Clinches Silver & Skeet Teams Bag Bronze",
    headline:
      "Aichi-Nagoya 2026 Day 5: Mirabai Chanu ends 28-year wait with 49kg silver; double bronze in shotgun skeet; India reaches 13th in medal table.",
    excerpt:
      "Tactical analysis of Asian Games 2026 Day 5: Mirabai Chanu's 194kg total, men's and women's skeet shooting team podiums, Suchika Tariyal's pioneering MMA bronze, and complete continental medal standings.",
    content:
      "India's campaign at the XX Asian Games Aichi-Nagoya 2026 gathered powerful momentum on September 23, adding four medals to take the nation's tally to 12 (1 Gold, 5 Silver, 6 Bronze). Saikhom Mirabai Chanu secured a momentous silver in women's 49kg weightlifting (194kg total), marking India's first Asiad weightlifting medal since 1998. India also claimed two bronze medals in skeet team competitions at Aichi Range, while Suchika Tariyal captured India's first-ever Asian Games medal in Mixed Martial Arts.",
    sport: "Multi-Sport",
    category: "National",
    publishedAt: "2026-09-23T10:30:00.000Z",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "KhelGrid Olympic Desk",
      role: "High-Performance Olympic & Tactical Analyst",
    },
    tags: [
      "Asian Games 2026",
      "Mirabai Chanu",
      "Medal Tally",
      "Shooting",
      "Aichi-Nagoya",
      "Live Updates",
    ],
    featured: true,
    trending: true,
  },
  {
    id: "news-india-vs-japan-cricket-tactical",
    slug: "india-vs-japan-cricket-match-tactical-analysis",
    blogSlug: "india-vs-japan-cricket-match-tactical-analysis",
    title: "India vs Japan Cricket: Tactical Analysis, Match Statistics & Grassroots Lessons",
    headline:
      "India U19 seals 10-wicket victory after dismissing Japan for 41; comprehensive bowling economy and run rate data revealed.",
    excerpt:
      "In-depth tactical review of the India vs Japan cricket clash: Ravi Bishnoi's 4/5 masterclass, Kartik Tyagi's seam bounce, phase-wise run rates, Recharts data analytics, and bilateral grassroots training takeaways.",
    content:
      "The ICC U19 World Cup encounter between India and Japan provided critical tactical benchmarks for developmental international cricket. India's bowling unit produced an extraordinary 79% dot-ball ratio at Mangaung Oval, with leg-spinner Ravi Bishnoi capturing 4 wickets for just 5 runs in 8 overs. In reply, openers Yashasvi Jaiswal and Kumar Kushagra knocked off the 42-run target in just 4.5 overs at 8.69 runs per over.",
    sport: "Cricket",
    category: "National",
    publishedAt: "2026-09-22T06:00:00.000Z",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Arunav Sen",
      role: "High-Performance Cricket & Analytics Editor",
    },
    tags: ["Cricket", "India vs Japan", "U19 World Cup", "Bowling Economy", "Match Analysis"],
    featured: true,
    trending: true,
  },
  {
    id: "news-khelo-india-2026",
    slug: "khelo-india-youth-games-2026-dates-state-selection-trials-announced",
    title:
      "Khelo India Youth Games 2026: State Selection Trials Dates & Eligibility Framework Released",
    headline:
      "Sports Authority of India (SAI) confirms nationwide trials schedule for U-18 athletes across 27 disciplines.",
    excerpt:
      "The Ministry of Youth Affairs and Sports and SAI have published the official roadmap for the upcoming Khelo India Youth Games. Over 8,500 athletes will compete following open district and state screening trials.",
    content:
      "District sports officers across all 28 states and union territories will commence open trials starting next month. Athletes registered on the National Sports Repository System (NSRS) with verified Aadhaar credentials and birth verification are eligible to compete in athletics, badminton, wrestling, boxing, and archery selection rounds.",
    sport: "Grassroots",
    category: "Trials & Selection",
    publishedAt: "2026-09-21T05:30:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "KhelGrid Editorial Desk",
      role: "Grassroots Sports Correspondent",
    },
    tags: ["Khelo India", "SAI", "Open Trials", "U-18", "National Sports"],
    featured: true,
    trending: true,
  },
  {
    id: "news-bcci-junior-zonal",
    slug: "bcci-junior-cricket-academy-zonal-registrations-open",
    title: "BCCI Opens Junior Zonal Trials for U-16 & U-19 National Cricket Academy Programs",
    headline:
      "Affiliated state cricket associations invite registered district performers for centralized NCA scouting camps.",
    excerpt:
      "State cricket bodies have published notification forms for the 2026-27 domestic junior pipeline. Scouts from the National Cricket Academy will monitor multi-day games and high-performance metrics.",
    content:
      "The talent development committee has integrated digital performance tracking including ball-tracking radar and biomechanics screening into zonal trials. District tournament top-scorers and leading wicket-takers will receive direct invitations.",
    sport: "Cricket",
    category: "Trials & Selection",
    publishedAt: "2026-09-20T18:00:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1531415074868-036b1c57e359?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Rohan Varma",
      role: "Cricket Talent Analyst",
    },
    tags: ["BCCI", "NCA", "Cricket Trials", "U-19", "Junior Cricket"],
    trending: true,
  },
  {
    id: "news-aiff-youth-league",
    slug: "aiff-grassroots-youth-league-club-accreditations",
    title: "AIFF Launches Decentralized Grassroots League to Screen 15,000 U-15 Talents",
    headline:
      "Indian football governing body introduces club-licensing criteria tied directly to youth development minutes.",
    excerpt:
      "Under the Vision 2047 roadmap, every Tier-1 and Tier-2 club must field an academy side in the regional Youth League, giving emerging talents competitive game time with accredited coaches.",
    content:
      "The initiative ensures that youth footballers receive a minimum of 30 competitive matches each calendar year. International scouts and Indian national team talent spotters will attend regional play-offs.",
    sport: "Football",
    category: "Grassroots",
    publishedAt: "2026-09-20T11:45:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Tenzing Namgyal",
      role: "Youth Football Lead",
    },
    tags: ["AIFF", "Youth League", "Football Academies", "Grassroots", "Scouting"],
    trending: true,
  },
  {
    id: "news-athletics-federation-grand-prix",
    slug: "afi-national-open-athletics-championships-qualifying-marks",
    title:
      "Athletics Federation of India Updates National Qualifying Standards for Sprints & Field Events",
    headline:
      "Stricter electronic timing standards introduced for 100m, 400m, and Javelin ahead of Asian Athletics Circuit.",
    excerpt:
      "Junior and senior athletes aiming for national camps must record their marks at AFI-sanctioned state meets with approved FAT (Fully Automatic Timing) and certified wind gauges.",
    content:
      "Athletes achieving the benchmark times will qualify for high-performance training centers in Patiala and Bengaluru, including nutritional stipends and international coach supervision.",
    sport: "Athletics",
    category: "National",
    publishedAt: "2026-09-19T14:15:00.000Z",
    readTime: "2 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Pooja Deshmukh",
      role: "Track & Field Correspondent",
    },
    tags: ["AFI", "Athletics", "Track and Field", "National Camp", "Sprints"],
    trending: false,
  },
  {
    id: "news-badminton-bai-ranking-circuit",
    slug: "bai-all-india-senior-junior-ranking-tournaments-schedule",
    title: "Badminton Association of India Announces 12-City National Ranking Tournament Circuit",
    headline:
      "Rankings points from these tournaments will directly determine entries for international BWF Challenge events.",
    excerpt:
      "With prize purses exceeding ₹2.4 Crores across both junior and senior legs, the tour provides emerging shuttlers a transparent route to the Indian National Squad.",
    content:
      "Top players from state ranking events will participate in qualifying draws. Matches will be live-streamed with automated rally metrics provided through national academy partnerships.",
    sport: "Badminton",
    category: "Championships",
    publishedAt: "2026-09-19T09:00:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Aditi Iyer",
      role: "Racquet Sports Editor",
    },
    tags: ["BAI", "Badminton", "BWF", "Ranking Tournaments", "National Squad"],
    trending: false,
  },
  {
    id: "news-reliance-foundation-scholarship",
    slug: "sports-scholarships-2026-applications-open-for-promising-indian-athletes",
    title:
      "National Sports Scholarships 2026: Financial Grants & Equipment Support for Junior Medalists",
    headline:
      "Private & public trust foundations disburse over ₹15 Crores in training stipends for student-athletes.",
    excerpt:
      "Eligible school and collegiate athletes who won medals at district, state or national championships can now submit their verified performance certificates to secure full educational and coaching funding.",
    content:
      "Grants cover specialized coaching fees, strength & conditioning coaches, tournament travel allowances, and injury rehabilitation insurance. Deadlines for the winter cohort end on October 15th.",
    sport: "Multi-Sport",
    category: "Scholarship",
    publishedAt: "2026-09-18T16:20:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "KhelGrid Career Desk",
      role: "Athlete Pathway Advisory",
    },
    tags: ["Scholarship", "Athlete Funding", "Sports Grants", "Education", "Grassroots"],
    trending: true,
  },
  {
    id: "news-aita-national-tennis-series",
    slug: "aita-national-championship-series-junior-tennis-trials-rankings",
    title: "AITA National Championship Series: Junior Circuit Trials & National Selection Rankings",
    headline:
      "All India Tennis Association confirms entry dates and direct selection cut-offs for U-14 & U-16 national grade tournaments.",
    excerpt:
      "AITA releases nationwide trial schedules for upcoming clay and hard court championships. Top 16 ranked players secure direct wildcards into Asian Tennis Federation (ATF) junior fixtures.",
    content:
      "State tennis associations across New Delhi, Bengaluru, Mumbai, and Kolkata will conduct national series screening. The high-performance committee will track first-serve percentages, return depth metrics, and fitness benchmarks to draft developmental squads.",
    sport: "Tennis",
    category: "Championships",
    publishedAt: "2026-09-17T11:00:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Siddharth Nair",
      role: "Tennis & Racquet Sports Editor",
    },
    tags: ["AITA", "Tennis", "National Ranking", "Junior Circuit", "Grand Slam Pathway"],
    trending: true,
  },
];
