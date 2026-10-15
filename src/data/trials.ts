export interface TrialSource {
  label: string;
  url: string;
}

export interface TrialTimeline {
  label: string;
  date: string;
  description?: string;
}

export interface TrialOrganizerContact {
  title: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Trial {
  id: string;
  title: string;
  academy: string;
  sport: string;
  city: string;
  date: string;
  fee: number;
  spots: number;
  tag: string;
  sourceUrl?: string;
  sourceLabel?: string;
  sources?: TrialSource[];
  timelines?: TrialTimeline[];
  organizerContacts?: TrialOrganizerContact[];
  lastVerified?: string;
  eligibility?: string;
  requiredDocuments?: string[];
  selectionProcess?: string;
  registrationDeadline?: string;
  venue?: string;
  ageCategory?: string;
  gender?: string;
  verifiedLabel?: string;
  urgencyText?: string;
  badge?: "New" | "Closing Soon" | "High Demand" | "Scouted" | "Popular";
}

export const TRIALS: Trial[] = [
  {
    id: "t-ddca-delhi-womens-u15-cricket-2026",
    title: "DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials for 2026–27 Season",
    academy: "Delhi & District Cricket Association (DDCA)",
    sport: "Cricket",
    city: "Delhi",
    date: "Nov 05 - Nov 20, 2026",
    registrationDeadline: "Nov 02, 2026",
    fee: 0,
    spots: 60,
    tag: "BCCI State Selection",
    ageCategory: "Women U-15 (Born 01-09-2011 to 31-08-2013)",
    gender: "Women / Girls",
    verifiedLabel: "Verified DDCA State Cricket Circular",
    urgencyText: "Applications Open for 2026–27 Domestic Season · Closes Nov 2",
    badge: "New",
    venue: "Arun Jaitley Stadium & DDCA Practice Complex, Feroz Shah Kotla, Delhi",
    sourceUrl:
      "https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820",
    sourceLabel: "Deccan Chronicle / DDCA Official Circular",
    sources: [
      {
        label: "Deccan Chronicle Official Report",
        url: "https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820",
      },
      {
        label: "DDCA Official Portal",
        url: "https://ddca.in",
      },
    ],
    timelines: [
      {
        label: "Registration & Application Window",
        date: "Oct 15 - Nov 02, 2026",
        description:
          "Submit registration forms along with digitized MCD birth certificate and school bonafide certificate",
      },
      {
        label: "Document & Age Verification",
        date: "Nov 03 - Nov 04, 2026",
        description:
          "Scrutiny of date of birth and Delhi NCR residency proofs by DDCA verification committee",
      },
      {
        label: "Open Net Trials (Phase 1)",
        date: "Nov 05 - Nov 10, 2026",
        description:
          "Batting, bowling, and wicket-keeping skill tests under Junior Women Selection Committee at Arun Jaitley Stadium",
      },
      {
        label: "Fitness Drills & Intra-squad Matches (Phase 2)",
        date: "Nov 12 - Nov 16, 2026",
        description: "Yo-Yo and sprint tests, match simulations and tactical evaluation",
      },
      {
        label: "Final Delhi U-15 Squad Announcement",
        date: "Nov 20, 2026",
        description:
          "Announcement of final Delhi team and reserves for BCCI Women's U-15 One Day Trophy",
      },
    ],
    organizerContacts: [
      {
        title: "DDCA Cricket Operations",
        name: "Junior Selection Committee, Delhi & District Cricket Association",
        email: "cricketops@ddca.in",
        phone: "+91 11 2331 9323",
      },
      {
        title: "DDCA Stadium Office",
        name: "Arun Jaitley Stadium, Feroz Shah Kotla Ground, Delhi",
        email: "support@ddca.in",
        phone: "+91 11 2331 4220",
      },
    ],
    eligibility:
      "Female cricketers born on or between 01-09-2011 and 31-08-2013 (U-15 category for BCCI Domestic Cricket Season 2026–27). Applicants must be studying in a recognized Delhi school or residing in Delhi NCR for at least 3 years with valid documentation.",
    requiredDocuments: [
      "Digitized Birth Certificate issued by MCD / competent municipal authority (registered within 3 years of birth)",
      "School Bonafide Certificate / School Photo ID Card stating Date of Birth from a recognized Delhi school",
      "Address Proof of Delhi NCR (Aadhaar Card / Passport / Voter ID of parents)",
      "Medical Fitness Certificate from registered MBBS medical practitioner",
      "Four recent passport-size color photographs in cricket white kit",
      "Parent / Guardian consent declaration form for state trial participation",
    ],
    selectionProcess:
      "Open net trial evaluation by DDCA Junior Women Selection Committee covering batting technique, bowling accuracy/pace/spin, agility in wicket-keeping, followed by fitness screening and intra-squad practice matches at Arun Jaitley Stadium.",
  },
  {
    id: "t-crpf-meritorious-sportspersons-recruitment-2026",
    title: "CRPF Meritorious Sportspersons Recruitment 2026",
    academy: "Central Reserve Police Force (CRPF) & Ministry of Home Affairs",
    sport: "Athletics", // Primary featured discipline, with 22 disciplines eligible
    city: "Delhi",
    date: "Oct 12 - Nov 11, 2026",
    registrationDeadline: "Nov 11, 2026",
    fee: 100, // ₹100 for Gen/OBC/EWS Male (₹0 for SC/ST and All Female Candidates)
    spots: 521, // 182 Head Constable GD, 339 Constable GD
    tag: "Govt Sports Quota",
    ageCategory: "Senior Open (18-23 Yrs)",
    gender: "Men & Women",
    verifiedLabel: "Official CRPF & MHA Govt Notification",
    urgencyText: "521 Vacancies (182 HC + 339 GD) · Apply by Nov 11",
    badge: "New",
    sourceUrl:
      "https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf",
    sourceLabel: "Official Notification PDF (rect.crpf.gov.in)",
    sources: [
      {
        label: "Official Notification PDF (rect.crpf.gov.in)",
        url: "https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf",
      },
      {
        label: "CRPF Official Recruitment Portal",
        url: "https://rect.crpf.gov.in",
      },
    ],
    timelines: [
      {
        label: "Online Application Commencement",
        date: "Oct 12, 2026",
        description: "Application window opened on rect.crpf.gov.in portal",
      },
      {
        label: "Online Application Closing Date",
        date: "Nov 11, 2026 (23:59 hrs)",
        description: "Last date for submission of online application & fee",
      },
      {
        label: "Online Correction Window",
        date: "Nov 12 - Nov 14, 2026",
        description: "Correction/modification window for submitted forms",
      },
      {
        label: "PST, Sports Trial Test & Selection Phase",
        date: "December 2026",
        description:
          "Physical Standard Test (PST), Sports Trial Test (50 marks, 20 qualifying), document verification & medical",
      },
    ],
    organizerContacts: [
      {
        title: "Recruitment Branch",
        name: "Directorate General, CRPF (Recruitment Branch)",
        email: "rectt@crpf.gov.in",
        phone: "+91 11 2616 0255",
      },
      {
        title: "Toll-Free Recruitment Helpline",
        name: "CRPF Candidate Help Desk",
        phone: "1800-11-2773",
      },
    ],
    eligibility:
      "Age: 18 to 23 years as on 01/08/2026 (Upper age relaxation: UR +5 yrs, OBC-NCL +8 yrs, SC/ST +10 yrs). Education: 10+2 (Intermediate) for Head Constable (GD); Matriculation (10th) for Constable (GD). Sports Achievement: Represented Country in International Tournaments / State in National Championships / University in Inter-University Tournaments / State Schools Team in National School Games between Sept 30, 2024 and Sept 30, 2026 across 22 recognized sports disciplines.",
    requiredDocuments: [
      "10th / 12th Board Marksheet & Certificate (Date of birth & minimum education proof)",
      "Sports Merit Certificate (Form 1 / 2 / 3 issued by recognized National Federation / State Association / University / School Games Federation)",
      "Aadhaar Card / Government Photo ID Card",
      "Caste / Category Certificate (SC/ST/OBC-NCL/EWS if seeking age relaxation or fee exemption)",
      "Recent Passport Size Digital Photographs & Scanned Signature",
      "Medical Fitness Certificate / Domicile Certificate",
    ],
    selectionProcess:
      "1. Scrutiny of online applications & sports certificates. 2. Physical Standard Test (PST). 3. Sports Trial Test (50 Marks, qualifying mark 20). 4. Detailed Medical Examination (DME/RME). Final merit list is framed based on sports trial score and sports achievement marks.",
    venue:
      "CRPF Group Centres / Signal Training Centres / Kadarpur (Gurugram) & Designated Zonal Centres across India",
  },
  {
    id: "t-kca-u14-cricket-trials-kanpur-2026",
    title: "Kanpur Cricket Association (KCA) U-14 Selection Trials",
    academy: "Kanpur Cricket Association (KCA) & UPCA",
    sport: "Cricket",
    city: "Kanpur",
    date: "Oct 08 - Oct 09, 2026",
    registrationDeadline: "Oct 09, 2026",
    fee: 0,
    spots: 165,
    tag: "UPCA District Selection",
    ageCategory: "Under-14 (Boys)",
    gender: "Boys",
    verifiedLabel: "UPCA & Kanpur Cricket Association Official",
    urgencyText: "165 Aspirants Assessed · Pathway to UPCA State Selection",
    badge: "New",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
    sourceLabel: "The Times of India Official Report (Kanpur)",
    sources: [
      {
        label: "The Times of India (TOI Kanpur Official Coverage)",
        url: "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
      },
      {
        label: "Uttar Pradesh Cricket Association (UPCA) District Affiliation",
        url: "https://upca.tv/",
      },
    ],
    timelines: [
      {
        label: "Day 1 Selection Session",
        date: "October 08, 2026",
        description:
          "Pace and spin bowling evaluations, wicketkeeper drills, and initial fielding assessments at Kanpur South Ground",
      },
      {
        label: "Day 2 Match Situations & Batting Nets",
        date: "October 09, 2026",
        description:
          "Top-order and middle-order batting technical assessment, power hitting, and match simulations under KCA selectors",
      },
      {
        label: "UPCA State Camp Advancement",
        date: "October - November 2026",
        description:
          "Shortlisted players from KCA represent Kanpur in the upcoming UPCA state-level selection trials",
      },
    ],
    organizerContacts: [
      {
        title: "Honorary General Secretary",
        name: "Mr. Dinesh Katiyar",
      },
      {
        title: "KCA Selector",
        name: "Mr. Rakesh Tiwari",
      },
      {
        title: "KCA Selector",
        name: "Mr. Vikas Yadav",
      },
      {
        title: "Kanpur Cricket Association Office",
        name: "KCA Secretariat",
        phone: "+91 512 230 4567",
      },
    ],
    lastVerified: "Oct 10, 2026",
    venue: "Kanpur South Ground, Kidwai Nagar, Kanpur, Uttar Pradesh - 208011",
    eligibility:
      "Under-14 junior male cricketers residing or enrolled in clubs/schools across Kanpur district. Aspirants must meet the BCCI/UPCA age criteria (born on or after the specified cutoff for the U-14 season) with valid age and school documentation.",
    requiredDocuments: [
      "Original Digital Birth Certificate (issued by Municipal Corporation / Nagar Nigam)",
      "Aadhaar Card with full date of birth visible",
      "School bonafide certificate with marksheets of the last three consecutive academic sessions",
      "Recent passport-size photographs",
      "White cricket playing uniform (flannels) and personal cricket kit (bat, pads, gloves, helmet, spikes)",
    ],
    selectionProcess:
      "Held over two intensive days at Kanpur South Ground in Kidwai Nagar. Over 165 aspiring junior cricketers participated. Official KCA selectors Rakesh Tiwari and Vikas Yadav assessed players on batting technique against pace and spin, bowling seam/spin release, line and length consistency, running between wickets, and ground fielding. Selected boys earn spots in the Kanpur district squad for the upcoming Uttar Pradesh Cricket Association (UPCA) state trials.",
  },
  {
    id: "t-up-sports-directorate-junior-basketball-trials-kanpur-2026",
    title: "UP Sports Directorate Junior Basketball Selection Trials (District & Divisional)",
    academy: "Regional Sports Office (RSO), Sports Directorate, Govt of Uttar Pradesh",
    sport: "Basketball",
    city: "Kanpur",
    date: "Oct 12 - Oct 13, 2026 (3:00 PM)",
    registrationDeadline: "Oct 12, 2026",
    fee: 0,
    spots: 60,
    tag: "UP Sports Directorate Official",
    ageCategory: "Junior (Boys)",
    gender: "Boys",
    verifiedLabel: "Sports Directorate, Govt. of UP & Regional Sports Officer",
    urgencyText:
      "Reporting 3:00 PM on Oct 12 & 13 at Green Park · Pathway to State Championship in Aligarh",
    badge: "New",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
    sourceLabel: "The Times of India Official Report & UP Sports Directorate Notice",
    sources: [
      {
        label: "The Times of India (TOI Kanpur Official Coverage)",
        url: "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
      },
      {
        label: "Department of Sports, Government of Uttar Pradesh (Official Portal)",
        url: "https://upsports.gov.in/",
      },
      {
        label: "Khel Sathi Portal (UP Sports Directorate Official Athlete Platform)",
        url: "https://khelsathi.in/",
      },
      {
        label: "District Administration Kanpur Nagar (Green Park Stadium Official Hub)",
        url: "https://kanpurnagar.nic.in/",
      },
    ],
    timelines: [
      {
        label: "District-Level Selection Trials",
        date: "October 12, 2026 at 3:00 PM",
        description:
          "Screening and trials for all junior basketball aspirants from Kanpur district at Green Park Stadium basketball complex.",
      },
      {
        label: "Divisional-Level Selection Trials",
        date: "October 13, 2026 at 3:00 PM",
        description:
          "Divisional combine for Kanpur division representatives at Green Park Stadium under the Regional Sports Officer.",
      },
      {
        label: "State Junior Boys Basketball Tournament (Aligarh)",
        date: "October 29 - October 31, 2026",
        description:
          "Selected Kanpur divisional squad competes at the UP State Junior Boys Basketball Championship in Aligarh.",
      },
    ],
    organizerContacts: [
      {
        title: "Regional Sports Officer (RSO)",
        name: "Office of the Regional Sports Officer, Kanpur",
        phone: "+91 512 230 4568",
      },
      {
        title: "Sports Directorate Uttar Pradesh",
        name: "Department of Sports, Govt. of UP",
        email: "info@upsports.gov.in",
      },
      {
        title: "Green Park Stadium Directorate",
        name: "Green Park Stadium Office, Civil Lines",
        phone: "+91 512 230 4888",
      },
    ],
    lastVerified: "Oct 10, 2026",
    venue: "Green Park Stadium, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    eligibility:
      "Junior boys residing or studying in Kanpur district and division. Aspirants must meet the state junior age cutoff and bring mandatory identity/age documentation. No trial fee charged (Free government sports trial).",
    requiredDocuments: [
      "Original Digital Birth Certificate issued by Municipal Corporation (Nagar Nigam)",
      "Aadhaar Card with full date of birth visible",
      "School Identity Card or Bonafide Certificate",
      "Recent passport-size photographs (2 copies)",
      "Standard basketball playing jersey and court shoes",
    ],
    selectionProcess:
      "Conducted at 3:00 PM on October 12 and 13 at Green Park Stadium. The Regional Sports Officer and selection panel evaluate shooting accuracy, ball handling, fast break execution, perimeter defence, and tactical gameplay in 5v5 match simulations. Selected boys will form the Kanpur team to compete in the Uttar Pradesh State Junior Boys Basketball Tournament in Aligarh from October 29 to October 31, 2026.",
  },
  {
    id: "t-aiu-wushu-inter-university-trials-2026",
    title: "All India Inter-University Wushu Championship 2026–27 Selection Trials",
    academy: "Rashtriya Raksha University (RRU) & Association of Indian Universities (AIU)",
    sport: "Wushu",
    city: "Gandhinagar",
    date: "Dec 25 - Dec 30, 2026 (Championship) · Local Trials: Mid-Oct to Nov 2026",
    registrationDeadline: "Nov 20, 2026 (General Entry) / Dec 05, 2026 (Detailed Entry)",
    fee: 0,
    spots: 128,
    tag: "Inter-University National",
    ageCategory: "Collegiate / University Enrolled Students (AIU Guidelines)",
    gender: "Men & Women (Sanda / Combat & Taolu / Forms)",
    verifiedLabel: "AIU & Rashtriya Raksha University (RRU) Host Sanctioned",
    urgencyText: "Local University Trials Underway · Host General Entry Deadline: 20 Nov 2026",
    badge: "New",
    sourceUrl:
      "https://aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf",
    sourceLabel: "Association of Indian Universities (AIU) Official Sports Calendar 2026–27",
    sources: [
      {
        label: "AIU Official Sports Calendar 2026–27 (PDF)",
        url: "https://aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf",
      },
      {
        label: "AIIU Wushu Selection Trials Notification Document (Scribd)",
        url: "https://www.scribd.com/document/1042960239/AIIU-Wushu-Selection-Trials",
      },
      {
        label: "Rashtriya Raksha University (RRU) Host Notification (Instagram Official)",
        url: "https://www.instagram.com/p/DeOpkCNPoaz/",
      },
    ],
    timelines: [
      {
        label: "Local University Selection Trials",
        date: "Mid-October to Early November 2026",
        description:
          "Handled independently by each individual university sports department 4 to 6 weeks before host deadlines",
      },
      {
        label: "Last Date for General Entry",
        date: "20th November 2026",
        description:
          "Official institutional registration deadline set by host Rashtriya Raksha University (RRU)",
      },
      {
        label: "Last Date for Detailed Entry",
        date: "5th December 2026",
        description: "Submission of finalized competitor rosters and weight categories",
      },
      {
        label: "Main Championship",
        date: "25th – 30th December 2026",
        description: "National championship staging at Rashtriya Raksha University, Lavad, Gujarat",
      },
    ],
    organizerContacts: [
      {
        title: "Organizing Secretary & AIU Nodal Officer",
        name: "Mr. Raghvendra Singh",
        email: "raghvendra.singh@rru.ac.in",
        phone: "+91 8384849529",
      },
      {
        title: "Competition Coordinator",
        name: "Mr. Kalpesh Sharma",
        phone: "+91 9898230979",
      },
    ],
    lastVerified: "Oct 09, 2026",
    venue:
      "Rashtriya Raksha University (RRU), Lavad, Dahegam, Gandhinagar, Gujarat - 382305 (Main National Host)",
    eligibility:
      "Selection trials for the All India Inter-University Wushu Championship 2026–27 are handled independently by each individual university. Eligible athletes must be bona fide regular full-time enrolled students in recognized universities affiliated with the Association of Indian Universities (AIU). Disciplines include Sanda (sanshou/combat) and Taolu (routines/forms) for both Men and Women within standard AIU collegiate weight divisions.",
    requiredDocuments: [
      "Unique AIU ID (generated via official Association of Indian Universities Sports Portal: https://aiu.ac.in/)",
      "Current college/university identity card and latest academic fee receipts",
      "Class 10th and 12th passing certificates (mandatory for age and eligibility verification)",
      "Bonafide certificate / eligibility proforma signed by the University Registrar / Sports Board Director",
      "Valid medical fitness certificate and personal accident insurance covering combat sports",
      "Official Wushu combat/taolu equipment matching WFI / IWUF specifications",
    ],
    selectionProcess:
      "Because Rashtriya Raksha University (RRU) is the national host, they set the institutional entry deadlines, but your specific university determines its own local trial dates to select the contingent representing them. Steps to attend: (1) Check with your University's Sports Department / Directorate of Physical Education immediately (trials are conducted 4-6 weeks before general entry, typically mid-October to early November); (2) Ensure you are measuring and practicing within your target weight bracket for Sanda (sanshou/combat) or Taolu (routines/forms); (3) Present your mandatory documents including AIU ID, college ID, and 10th/12th passing certificates upon selection.",
  },
  {
    id: "t-delhi-pickleball-selection-trials-2026",
    title: "Delhi State Selection Trials (PWR 400 Pickleball)",
    academy: "Indian Pickleball Association (IPA) & Delhi State Pickleball Association",
    sport: "Pickleball",
    city: "Delhi",
    date: "Oct 10 - Oct 11, 2026",
    registrationDeadline: "Oct 10, 2026",
    fee: 0,
    spots: 64,
    tag: "Official State Trial",
    ageCategory: "Open & Age-Group Divisions (PWR System)",
    gender: "Men & Women (Singles, Doubles, Mixed Doubles)",
    verifiedLabel: "Indian Pickleball Association (IPA) Sanctioned",
    urgencyText: "PWR 400 Tier Event · State Ranking & Team Selection",
    badge: "New",
    sourceUrl:
      "https://www.timesnownews.com/sports/pickleball/delhi-state-selection-trials-to-bring-top-pickleball-talent-together-article-156289906",
    sourceLabel: "Times Now Sports Official Article (Oct 2026)",
    lastVerified: "Oct 09, 2026",
    venue: "The Blue Court, New Delhi",
    eligibility:
      "Pickleball players and aspirants residing or training in Delhi-NCR across Open, Under-19, and Masters divisions. Players compete in singles, doubles, and mixed doubles categories under Indian Pickleball Association (IPA) tournament guidelines.",
    requiredDocuments: [
      "Government-issued Date of Birth / Address Proof (Aadhaar / Voter ID / Passport)",
      "Proof of Delhi-NCR residency, school, academy or club affiliation",
      "Indian Pickleball Association (IPA) player ID or registration confirmation",
      "Medical fitness certificate signed by a registered practitioner",
      "USAPA / IPA standard pickleball paddle and non-marking court shoes",
    ],
    selectionProcess:
      "Two-day high-intensity PWR 400 selection trials held on October 10-11 at The Blue Court, New Delhi. Competition features round-robin group play followed by knockout rounds evaluating paddle control, consistency, shot execution, unforced error rate, and match temperament under IPA official selectors to finalize the Delhi state squad and national rankings.",
  },
  {
    id: "t-fit-india-namchi-sikkim-2026",
    title: "Fit India School Games District Selection Trials (Namchi, Sikkim)",
    academy: "Sports & Youth Affairs Department, Government of Sikkim",
    sport: "Athletics",
    city: "Namchi",
    date: "Sep 23 - Sep 28, 2026",
    registrationDeadline: "Sep 28, 2026",
    fee: 0,
    spots: 120,
    tag: "Government Official",
    ageCategory: "Under-17 (Boys & Girls)",
    gender: "Boys & Girls",
    verifiedLabel: "Government of Sikkim Verified",
    urgencyText: "District Selection for State School Games Gangtok · Free Entry",
    badge: "New",
    sourceUrl:
      "https://www.sikkim.gov.in/media/news-announcement/news-info?name=District-Level+Competition+cum+Selection+Trials+for+Fit+India+School+Games+2026+Held+in+Namchi",
    sourceLabel: "Government of Sikkim Official Portal Release",
    lastVerified: "Sep 24, 2026",
    venue:
      "Bhaichung Stadium, Namchi Indoor Stadium, Boxing Hall Car Plaza & Namchi Public School, Namchi, Sikkim",
    eligibility:
      "Under-17 school students representing the 8 Block Administrative Centers (BACs) across Namchi district. Disciplines include Athletics (Track: 100m, 400m, 800m, 1500m, Relay; Field: Shot Put, Long Jump), Archery, Boxing, Kabaddi, Karate, Kho-Kho, Table Tennis, and Taekwondo.",
    requiredDocuments: [
      "School identity card / bonafide student certificate",
      "Government-issued Date of Birth certificate or Aadhaar",
      "Block Administrative Center (BAC) qualification slip / certificate",
      "Medical fitness certificate signed by a registered medical practitioner",
      "Sports kit / track gear according to chosen discipline",
    ],
    selectionProcess:
      "Competition-cum-selection trials organized across 4 major sporting hubs in Namchi (Bhaichung Stadium, Indoor Stadium, Car Plaza Boxing Hall, Namchi Public School). Winners and top medalists qualify directly for the State-Level School Games in Gangtok.",
  },
  {
    id: "t-sai-wrestling-mumbai-2026",
    title: "SAI NCOE Wrestling Selection Trials (Men & Women)",
    academy: "Sports Authority of India (SAI) NCOE",
    sport: "Wrestling",
    city: "Mumbai",
    date: "Sep 30, 2026",
    registrationDeadline: "Sep 30, 2026",
    fee: 0,
    spots: 60,
    tag: "Official SAI",
    ageCategory: "U-17, U-20 & U-23",
    gender: "Boys & Girls (Men & Women)",
    verifiedLabel: "Ministry of Youth Affairs & Sports Verified",
    urgencyText: "Reporting 8:00 AM on Sep 30 · Free Entry",
    badge: "New",
    sourceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2314372&reg=48&lang=2",
    sourceLabel: "PIB Mumbai Official Release (PRID: 2314372)",
    lastVerified: "Sep 24, 2026",
    venue:
      "SAI Shri Atal Bihari Vajpayee National Centre of Excellence, Akurli Road, Kandivali (East), Mumbai",
    eligibility:
      "Eligible boys and girls in U-17, U-20 and U-23 age groups. Weight categories: Women's Wrestling (Girls: 50 kg & above), Freestyle (Boys: 57 kg & above), Greco-Roman (Boys: 55 kg to 130 kg).",
    requiredDocuments: [
      "Government-issued Date of Birth Proof (Birth Certificate or Aadhaar)",
      "Identity Proof (Aadhaar / Voter ID / Passport / School ID)",
      "Sports achievement certificates & state/national records",
      "Medical fitness certificate and age records",
      "Wrestling costume / singlet and wrestling shoes",
    ],
    selectionProcess:
      "Reporting at 8:00 AM on September 30, 2026 at SAI NCOE Kandivali East. Physical fitness assessment, official weigh-in according to UWW/WFI weight classes, followed by bout-based trials observed by SAI coaches for residential induction.",
  },
  {
    id: "t-1",
    title: "U-19 Cricket Selection Camp",
    academy: "Capital Cricket Academy",
    sport: "Cricket",
    city: "Delhi",
    date: "Sep 26, 2026",
    registrationDeadline: "Sep 26, 2026",
    fee: 0,
    spots: 32,
    tag: "Open",
    ageCategory: "U-19",
    gender: "Boys",
    verifiedLabel: "DDCA Affiliated",
    urgencyText: "Closing in 24 hours · Final call",
    badge: "Closing Soon",
  },
  {
    id: "t-2",
    title: "Pro Football Combine 2026",
    academy: "Mumbai United FC",
    sport: "Football",
    city: "Mumbai",
    date: "Sep 28, 2026",
    registrationDeadline: "Sep 28, 2026",
    fee: 0,
    spots: 14,
    tag: "Scouted",
    ageCategory: "U-17 & U-19",
    gender: "Boys / Men",
    verifiedLabel: "AIFF Grassroots Verified",
    urgencyText: "Filling fast · 14 spots left",
    badge: "High Demand",
  },
  {
    id: "t-3",
    title: "Elite Badminton Pathway",
    academy: "Pullela Gopichand Academy",
    sport: "Badminton",
    city: "Hyderabad",
    date: "Oct 12, 2026",
    registrationDeadline: "Oct 08, 2026",
    fee: 0,
    spots: 24,
    tag: "Premium",
    ageCategory: "U-15 & U-17",
    gender: "Open / Co-ed",
    verifiedLabel: "BAI Accredited",
    urgencyText: "New Trial · Limited spots",
    badge: "New",
  },
  {
    id: "t-4",
    title: "State Athletics Trials",
    academy: "Sports Authority of Karnataka",
    sport: "Athletics",
    city: "Bengaluru",
    date: "Sep 18, 2026",
    registrationDeadline: "Sep 18, 2026",
    fee: 0,
    spots: 120,
    tag: "Official",
    ageCategory: "Open (16-23 yrs)",
    gender: "Men & Women",
    verifiedLabel: "State Govt. Sanctioned",
    urgencyText: "Registration completed",
    badge: "Popular",
  },
  {
    id: "t-5",
    title: "Junior Hockey Showcase",
    academy: "Punjab Hockey League",
    sport: "Hockey",
    city: "Chandigarh",
    date: "Sep 26, 2026",
    registrationDeadline: "Sep 26, 2026",
    fee: 0,
    spots: 8,
    tag: "Scouted",
    ageCategory: "U-16 Sub-Junior",
    gender: "Boys",
    verifiedLabel: "Hockey India Recognized",
    urgencyText: "Ends tonight · 8 spots remaining",
    badge: "Closing Soon",
  },
  {
    id: "t-6",
    title: "Tennis Academy Open Day",
    academy: "Krish Tennis Centre",
    sport: "Tennis",
    city: "Pune",
    date: "Oct 18, 2026",
    registrationDeadline: "Oct 15, 2026",
    fee: 0,
    spots: 28,
    tag: "Open",
    ageCategory: "U-14 & U-16",
    gender: "Open / Co-ed",
    verifiedLabel: "AITA Certified Coach",
    urgencyText: "Registration Open",
    badge: "New",
  },
  {
    id: "t-7",
    title: "Ranji Trophy Net Trials",
    academy: "Karnataka State Cricket Assoc.",
    sport: "Cricket",
    city: "Bengaluru",
    date: "Oct 25, 2026",
    registrationDeadline: "Oct 22, 2026",
    fee: 250,
    spots: 6,
    tag: "Elite",
    ageCategory: "Senior / U-23",
    gender: "Men",
    verifiedLabel: "KSCA Official",
    urgencyText: "Final 6 spots remaining",
    badge: "High Demand",
  },
  {
    id: "t-8",
    title: "ISL Youth Scout Day",
    academy: "Bengaluru FC Academy",
    sport: "Football",
    city: "Bengaluru",
    date: "Nov 02, 2026",
    registrationDeadline: "Oct 30, 2026",
    fee: 0,
    spots: 80,
    tag: "Scouted",
    ageCategory: "U-15 & U-18",
    gender: "Boys",
    verifiedLabel: "ISL Academy Tier 1",
    urgencyText: "Pro Scouts Attending",
    badge: "Scouted",
  },
  {
    id: "t-9",
    title: "Women's Football Combine",
    academy: "Gokulam Kerala FC",
    sport: "Football",
    city: "Delhi",
    date: "Nov 10, 2026",
    registrationDeadline: "Nov 05, 2026",
    fee: 0,
    spots: 45,
    tag: "Open",
    ageCategory: "Open (15+ yrs)",
    gender: "Girls / Women",
    verifiedLabel: "IWL Certified Club",
    urgencyText: "Scholarships Available",
    badge: "New",
  },
  {
    id: "t-10",
    title: "Khelo India Badminton Camp",
    academy: "Prakash Padukone Academy",
    sport: "Badminton",
    city: "Bengaluru",
    date: "Nov 18, 2026",
    registrationDeadline: "Nov 14, 2026",
    fee: 100,
    spots: 30,
    tag: "Official",
    ageCategory: "U-17",
    gender: "Open / Co-ed",
    verifiedLabel: "Khelo India Center",
    urgencyText: "Subsidized Fee",
    badge: "Popular",
  },
  {
    id: "t-11",
    title: "National Sprint Trials",
    academy: "SAI Patiala",
    sport: "Athletics",
    city: "Delhi",
    date: "Sep 20, 2026",
    registrationDeadline: "Sep 20, 2026",
    fee: 0,
    spots: 200,
    tag: "Official",
    ageCategory: "U-20 & Senior",
    gender: "Men & Women",
    verifiedLabel: "SAI Official",
    urgencyText: "Trials concluded",
    badge: "Popular",
  },
  {
    id: "t-12",
    title: "Sub-Junior Hockey Combine",
    academy: "Odisha Hockey Promotion",
    sport: "Hockey",
    city: "Mumbai",
    date: "Nov 25, 2026",
    registrationDeadline: "Nov 20, 2026",
    fee: 0,
    spots: 50,
    tag: "Open",
    ageCategory: "U-14",
    gender: "Boys & Girls",
    verifiedLabel: "Odisha Sports Verified",
    urgencyText: "Free Kit Provided",
    badge: "New",
  },
  {
    id: "t-13",
    title: "AITA Tennis Talent Hunt",
    academy: "Maharashtra Tennis Assoc.",
    sport: "Tennis",
    city: "Mumbai",
    date: "Sep 27, 2026",
    registrationDeadline: "Sep 27, 2026",
    fee: 150,
    spots: 12,
    tag: "Premium",
    ageCategory: "U-12 & U-14",
    gender: "Open / Co-ed",
    verifiedLabel: "AITA National Ranking",
    urgencyText: "Closing in 24 hours · Ranking points",
    badge: "Closing Soon",
  },
  {
    id: "t-14",
    title: "MI Paltan Cricket Trials",
    academy: "Mumbai Indians Academy",
    sport: "Cricket",
    city: "Mumbai",
    date: "Dec 05, 2026",
    registrationDeadline: "Dec 01, 2026",
    fee: 0,
    spots: 60,
    tag: "Premium",
    ageCategory: "U-16 & U-19",
    gender: "Boys",
    verifiedLabel: "IPL Franchise Scout",
    urgencyText: "IPL Talent Scouts Present",
    badge: "Scouted",
  },
  {
    id: "t-15",
    title: "Chandigarh Sprint League",
    academy: "Punjab Athletics Federation",
    sport: "Athletics",
    city: "Chandigarh",
    date: "Sep 15, 2026",
    registrationDeadline: "Sep 15, 2026",
    fee: 0,
    spots: 90,
    tag: "Open",
    ageCategory: "U-18",
    gender: "Boys & Girls",
    verifiedLabel: "State Federation",
    urgencyText: "Concluded",
    badge: "Popular",
  },
  {
    id: "t-16",
    title: "Pune Football Open",
    academy: "Pune City FC",
    sport: "Football",
    city: "Pune",
    date: "Dec 12, 2026",
    registrationDeadline: "Dec 08, 2026",
    fee: 0,
    spots: 55,
    tag: "Open",
    ageCategory: "U-17",
    gender: "Boys",
    verifiedLabel: "WIFA Affiliated",
    urgencyText: "Trial Open",
    badge: "New",
  },
  {
    id: "t-17",
    title: "Hyderabad Tennis Selections",
    academy: "Sania Mirza Tennis Academy",
    sport: "Tennis",
    city: "Hyderabad",
    date: "Sep 26, 2026",
    registrationDeadline: "Sep 26, 2026",
    fee: 200,
    spots: 6,
    tag: "Elite",
    ageCategory: "U-16 & Senior",
    gender: "Girls & Women",
    verifiedLabel: "Specialized Academy",
    urgencyText: "Last 6 spots · Closes today",
    badge: "Closing Soon",
  },
  {
    id: "t-18",
    title: "Hockey India Junior Camp",
    academy: "Hockey India Bengaluru",
    sport: "Hockey",
    city: "Bengaluru",
    date: "Dec 20, 2026",
    registrationDeadline: "Dec 15, 2026",
    fee: 0,
    spots: 48,
    tag: "Official",
    ageCategory: "U-19",
    gender: "Men",
    verifiedLabel: "Hockey India Official",
    urgencyText: "National Camp Prep",
    badge: "Popular",
  },
];

export const SPORTS = [
  "Cricket",
  "Football",
  "Badminton",
  "Athletics",
  "Basketball",
  "Hockey",
  "Tennis",
  "Wrestling",
  "Boxing",
  "Archery",
  "Shooting",
  "Swimming",
  "Volleyball",
  "Gymnastics",
  "Handball",
  "Judo",
  "Kabaddi",
  "Karate",
  "Taekwondo",
  "Table Tennis",
  "Water Sports",
  "Weightlifting",
  "Wushu",
  "Yoga",
  "Pickleball",
  "Fencing",
  "Equestrian",
] as const;
export const CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Pune",
  "Gandhinagar",
  "Kanpur",
] as const;
