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
  posterUrl?: string;
  imageUrl?: string;
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
    id: "t-sai-ncoe-aurangabad-women-boxing-trials-2026",
    title: "SAI NCOE Women Boxing Open Selection Trials (Only 5 Vacancies)",
    academy: "Sports Authority of India (SAI) & Khelo India",
    sport: "Boxing",
    city: "Chhatrapati Sambhajinagar",
    date: "Oct 23, 24 & 25, 2026",
    registrationDeadline: "Oct 23, 2026",
    fee: 0,
    spots: 5,
    tag: "SAI NCOE Elite Quota",
    ageCategory: "U-14, U-17, U-19 (With Age Verification Test AVT for Girls U-15)",
    gender: "Girls / Women",
    verifiedLabel: "Official SAI & Ministry of Youth Affairs and Sports Circular",
    urgencyText: "Only 5 Vacancies · Oct 23-25 at SAI NCOE Aurangabad · Report 7:00 AM",
    badge: "Hot",
    venue:
      "SAI NCOE Chhatrapati Sambhajinagar (Aurangabad), Dr. Babasaheb Ambedkar Marathwada University Campus",
    posterUrl:
      "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg",
    imageUrl:
      "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg",
    sourceUrl:
      "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg",
    sourceLabel: "Sports Authority of India Official Notice (sportsauthorityofindia.nic.in)",
    sources: [
      {
        label: "SAI Official Notice Poster",
        url: "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg",
      },
      {
        label: "Sports Authority of India Official Portal",
        url: "https://sportsauthorityofindia.nic.in",
      },
      {
        label: "Khelo India Scheme",
        url: "https://kheloindia.gov.in",
      },
    ],
    timelines: [
      {
        label: "Reporting & Document Verification",
        date: "Oct 23, 2026 (7:00 AM)",
        description:
          "Reporting at SAI NCOE Chhatrapati Sambhajinagar with original documents, 1 set of photocopies, and sport kit",
      },
      {
        label: "Day 1: Physical Fitness & Medical Screening",
        date: "Oct 23, 2026",
        description:
          "Weight measurement, general physical fitness tests, and Age Verification Test (AVT) for U-15 girls",
      },
      {
        label: "Day 2: Technical Boxing Skill & Sparring Bouts",
        date: "Oct 24, 2026",
        description:
          "Punching technique, footwork agility, defensive reflexes, and controlled sparring under Senior Coaches",
      },
      {
        label: "Day 3: Final Selection Bouts & Induction",
        date: "Oct 25, 2026",
        description:
          "Final performance evaluation to fill the 5 exclusive residential scholar vacancies at NCOE Aurangabad",
      },
    ],
    organizerContacts: [
      {
        title: "Senior Boxing Coach",
        name: "Varsha Tripathi",
        phone: "+91 9131531244",
        email: "ncoe.aurangabad@gov.in",
      },
      {
        title: "Senior Boxing Coach",
        name: "Sonu Tak",
        phone: "+91 8446271067",
        email: "ncoe.aurangabad@gov.in",
      },
      {
        title: "NCOE Campus Office",
        name: "Sports Authority of India, Dr. BAMU Campus, Chhatrapati Sambhajinagar 431005",
        phone: "+91 240 240 0431",
        email: "sai.ncoeabad@nic.in",
      },
    ],
    eligibility:
      "Eligible female boxers in age groups U-14, U-17, and U-19. Candidates must meet at least one achievement standard: 1) National or International Medalist; 2) State Gold Medalist; 3) National Rankers up to Rank 8. Age Verification Test (AVT) is compulsory for U-15 girls. All athletes must bring their own equipment (boxing gloves, wraps, headgear, mouthguard) and sport kit. No accommodation or food provided by SAI during trials.",
    requiredDocuments: [
      "Date of Birth (DOB) Certificate",
      "Educational Certificate / School Marksheet",
      "Aadhaar Card",
      "Passport Size Photograph – 2 Nos",
      "Sports Achievement Certificate (National/International Medal / State Gold / National Top 8)",
      "One complete set of photocopies along with original documents",
      "Medical Fitness Certificate from registered MBBS medical practitioner",
    ],
    selectionProcess:
      "Comprehensive 3-day expert evaluation at SAI NCOE Aurangabad: 1) Initial weight check and document authentication; 2) Standard physical fitness battery; 3) Boxing skill, stance, and combination assessment; 4) Ring sparring rounds supervised by Senior Coaches Varsha Tripathi and Sonu Tak to select 5 athletes for full residential sports scholarship.",
  },
  {
    id: "t-jk-kho-kho-junior-national-trials-2026",
    title: "Kho-Kho Selection Trials on Oct 19 & 20 for 45th Junior National Championship",
    academy: "Jammu and Kashmir Kho-Kho Association (JKKKA) & J&K Sports Council",
    sport: "Kho-Kho",
    city: "Jammu",
    date: "Oct 19 - Oct 20, 2026",
    registrationDeadline: "Oct 19, 2026",
    fee: 0,
    spots: 40,
    tag: "State Junior National Selection",
    ageCategory: "Junior Boys & Girls (Born after Nov 25, 2008 / Under-18 as on 25-11-2026)",
    gender: "Boys & Girls",
    verifiedLabel: "Official J&K Kho-Kho Association Circular",
    urgencyText: "Trials on Oct 19 & 20 at Green Play Field, Gandhi Nagar, Jammu · Report 2:30 PM",
    badge: "New",
    venue: "Green Play Field, Gandhi Nagar, Jammu, Jammu & Kashmir",
    sourceUrl: "https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/",
    sourceLabel: "Daily Excelsior Sports / J&K Kho-Kho Association",
    sources: [
      {
        label: "Daily Excelsior Official News Report",
        url: "https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/",
      },
      {
        label: "Kho Kho Federation of India (KKFI)",
        url: "https://khokho.org",
      },
      {
        label: "J&K Sports Council",
        url: "https://jksportscouncil.in",
      },
    ],
    timelines: [
      {
        label: "Trial Reporting & District Verification",
        date: "Oct 19, 2026 (2:30 PM)",
        description:
          "Reporting of junior boys and girls with consent letters from affiliated district units at Green Play Field, Gandhi Nagar",
      },
      {
        label: "Day 1: Speed, Agility & Running Screening",
        date: "Oct 19, 2026",
        description:
          "Dodging, chain formation, and sprint assessment under JKKKA selection committee",
      },
      {
        label: "Day 2: Chasing Drills & Match Trials",
        date: "Oct 20, 2026",
        description: "Pole dives, sudden turns, tap drills, and match simulations",
      },
      {
        label: "Coaching Camp & J&K Squad Departure",
        date: "Nov 01 - Nov 18, 2026",
        description:
          "Intensive coaching camp before participating in the 45th Junior National Kho-Kho Championship in Gujarat (Nov 21-25, 2026)",
      },
    ],
    organizerContacts: [
      {
        title: "General Secretary",
        name: "Jammu and Kashmir Kho-Kho Association",
        email: "jkkka.sports@gmail.com",
        phone: "+91 191 243 0088",
      },
      {
        title: "Venue Coordinator",
        name: "Green Play Field Sports Office, Gandhi Nagar, Jammu",
        email: "support@jksportscouncil.in",
        phone: "+91 191 254 3945",
      },
    ],
    eligibility:
      "Open to junior boys and girls residing in Jammu and Kashmir. Participants must be below 18 years of age as of November 25, 2026 (born after 25-11-2008). Players must report with an official consent letter / nomination from their respective affiliated district Kho-Kho units. Selected players will represent Jammu & Kashmir UT in the 45th Junior National Kho-Kho Championship scheduled to be held in Gujarat from November 21 to 25, 2026.",
    requiredDocuments: [
      "Consent letter from the affiliated district Kho-Kho unit of Jammu & Kashmir",
      "Digitized Birth Certificate / 10th Board Certificate proving age under 18 as on 25-11-2026",
      "Domicile Certificate / PRC of Jammu & Kashmir",
      "Aadhaar Card / Government Photo ID Card",
      "School / College Bonafide Certificate",
      "Four recent passport-size color photographs in sports kit",
      "Parent / Guardian consent declaration",
    ],
    selectionProcess:
      "Two-day state open selection trial evaluated by the JKKKA Technical Committee: Day 1 focuses on physical endurance, dodging agility, footwork speed, and running endurance. Day 2 features chasing techniques (pole dives, sky dives, sudden direction shifts) and full-length match trials at Green Play Field, Gandhi Nagar, Jammu. Top players advance to the official state coaching camp for the 45th Junior National Kho-Kho Championship in Gujarat.",
  },
  {
    id: "t-bcci-arunachal-pradesh-ranji-trials-2026",
    title: "BCCI to Conduct Trials to Ensure Arunachal Pradesh's Ranji Participation",
    academy: "Board of Control for Cricket in India (BCCI)",
    sport: "Cricket",
    city: "Itanagar",
    date: "Nov 01 - Nov 18, 2026",
    registrationDeadline: "Oct 31, 2026",
    fee: 0,
    spots: 80,
    tag: "BCCI National State Combine",
    ageCategory: "Senior Men (Ranji Trophy), U-23 (C.K. Nayudu), Senior Women & Age Groups",
    gender: "Men & Women",
    verifiedLabel: "Direct BCCI Apex Council & Independent Selection Committee",
    urgencyText: "BCCI Appointed Committee · Direct Open Trials to Field State Teams",
    badge: "New",
    venue: "Yupia Cricket Ground & Rajiv Gandhi Stadium, Itanagar, Arunachal Pradesh",
    sourceUrl:
      "https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html",
    sourceLabel: "Hindustan Times Sports / Official BCCI Domestic Notification",
    sources: [
      {
        label: "Hindustan Times Special Report",
        url: "https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html",
      },
      {
        label: "BCCI Official Website (bcci.tv)",
        url: "https://www.bcci.tv",
      },
      {
        label: "BCCI Domestic Cricket Circulars",
        url: "https://www.bcci.tv/domestic",
      },
    ],
    timelines: [
      {
        label: "BCCI Open Call & Registration Window",
        date: "Oct 15 - Oct 31, 2026",
        description:
          "Open call advertised across public media by BCCI for cricketers with Arunachal Pradesh domicile / registration",
      },
      {
        label: "Phase 1: Open Net Trials & Skill Assessment",
        date: "Nov 01 - Nov 05, 2026",
        description:
          "Independent Selection Committee (Satya Gopal Chakraborty, Jayanta Chowdhury, Deep Bora) evaluates players at Yupia Cricket Ground",
      },
      {
        label: "Phase 2: Match Simulations & Fitness Screenings",
        date: "Nov 07 - Nov 12, 2026",
        description:
          "Intra-squad practice matches monitored by BCCI Apex Council Convener M. Khairul Jamal Majumdar",
      },
      {
        label: "Final Ranji & State Squad Announcement",
        date: "Nov 18, 2026",
        description:
          "Official announcement of Arunachal Pradesh Senior Men Ranji Trophy and age-group squads to prevent tournament forfeit",
      },
    ],
    organizerContacts: [
      {
        title: "BCCI Independent Selection Committee Convener",
        name: "M. Khairul Jamal Majumdar (BCCI Apex Council Member)",
        email: "domesticcricket@bcci.tv",
        phone: "+91 22 2289 8800",
      },
      {
        title: "Selection Committee Chairman",
        name: "Satya Gopal Chakraborty (Former Assam First-Class Cricketer)",
        email: "operations@bcci.tv",
        phone: "+91 360 221 2100",
      },
      {
        title: "BCCI Headquarters",
        name: "Cricket Centre, Wankhede Stadium, D-Road, Churchgate, Mumbai",
        email: "contact@bcci.tv",
        phone: "+91 22 6759 8800",
      },
    ],
    eligibility:
      "Open to all bona fide cricketers residing or studying in Arunachal Pradesh with valid Domicile / Permanent Resident Certificate (PRC) or prior state BCCI player registration. Trials cover multiple categories: Senior Men (Ranji Trophy), Men's U-23 (Col. C.K. Nayudu Trophy), Senior Women's T20, and Under-16/Under-19 junior tournaments. Selections are strictly merit-based, conducted directly by the BCCI-appointed independent 3-member panel to insulate players from local association administrative deadlocks.",
    requiredDocuments: [
      "Permanent Resident Certificate (PRC) of Arunachal Pradesh / Domicile Certificate issued by District Commissioner",
      "Digitized Birth Certificate registered with statutory municipal/panchayat authority",
      "BCCI Player Registration Card / Prior State Representation Certificates (if applicable)",
      "Aadhaar Card / Government Photo ID Card (showing Arunachal Pradesh address)",
      "School / College Bonafide Certificate for age-group participants",
      "Medical Fitness Certificate from a certified physician",
      "Four passport-size color photographs in official cricket whites",
    ],
    selectionProcess:
      "Direct, neutral, transparent assessment by BCCI-appointed independent panel: 1) Open skill assessment nets for batting, pace bowling, spin bowling, and wicket-keeping; 2) Physical fitness and agility testing; 3) Multi-day practice match simulations at Yupia Cricket Stadium under BCCI Apex Council observers to select the official squads for the 2026–27 domestic season.",
  },
  {
    id: "t-khel-maharan-3-assam-2026",
    title: "Khel Maharan 3.0 to Begin on November 7, Registration Opens Across Assam",
    academy: "Department of Sports & Youth Welfare, Government of Assam",
    sport: "Athletics",
    city: "Guwahati",
    date: "Nov 07 - Dec 28, 2026",
    registrationDeadline: "Nov 06, 2026",
    fee: 0,
    spots: 15000,
    tag: "Assam Govt Grassroots Combine",
    ageCategory: "Under-12 (Shoushab Krida Samaroh with Scholarship) & 12+ Open Categories",
    gender: "Boys & Girls / Men & Women",
    verifiedLabel: "Official Assam State Government Sports Initiative",
    urgencyText: "Competitions Begin Nov 7 · Free Registration Open Across All 35 Districts",
    badge: "New",
    venue:
      "Gram Panchayat & Ward Grounds to Sarusajai Sports Complex & Indira Gandhi Athletic Stadium, Guwahati",
    sourceUrl:
      "https://www.nktv.in/khel-maharan-3-0-to-begin-on-november-7-registration-opens-across-assam/",
    sourceLabel: "NKTV National News / Sports & Youth Welfare Govt of Assam",
    sources: [
      {
        label: "NKTV News Report (Khel Maharan 3.0)",
        url: "https://www.nktv.in/khel-maharan-3-0-to-begin-on-november-7-registration-opens-across-assam/",
      },
      {
        label: "Khel Maharan Official Portal",
        url: "https://khelmaharan.com/khel",
      },
      {
        label: "Directorate of Sports & Youth Welfare Assam",
        url: "https://dsya.assam.gov.in",
      },
    ],
    timelines: [
      {
        label: "Statewide Online & Offline Registration",
        date: "Oct 15 - Nov 06, 2026",
        description:
          "Free registration on khelmaharan.com/khel and designated Gaon Panchayat / Ward offices across 35 districts",
      },
      {
        label: "Gram Panchayat & Urban Ward Competitions (Level 1)",
        date: "Nov 07 - Nov 18, 2026",
        description:
          "Grassroots heats across all village panchayats and municipal wards in 10 sports disciplines",
      },
      {
        label: "Assembly Constituency (LAC) Competitions (Level 2)",
        date: "Nov 22 - Nov 30, 2026",
        description: "Inter-panchayat winners battle for legislative constituency titles",
      },
      {
        label: "District Championships (Level 3)",
        date: "Dec 05 - Dec 15, 2026",
        description:
          "Top athletes compete for district representation across all 35 districts of Assam",
      },
      {
        label: "State Mega Finals & SAI Talent Scouting",
        date: "Dec 20 - Dec 28, 2026",
        description:
          "State Grand Finale at Sarusajai Sports Complex Guwahati, with SAI scouts & state scholarship distribution",
      },
    ],
    organizerContacts: [
      {
        title: "Directorate of Sports & Youth Welfare",
        name: "Government of Assam, Dispur",
        email: "dsyawassam@gmail.com",
        phone: "+91 361 223 7277",
      },
      {
        title: "Khel Maharan Central Helpdesk",
        name: "Sarusajai Sports Complex, Guwahati, Assam",
        email: "support@khelmaharan.com",
        phone: "+91 361 213 0088",
      },
    ],
    eligibility:
      "Open to all permanent residents of Assam and students studying in recognized schools, colleges, and sports institutions across all 35 districts of Assam. Two primary streams: Khel Maharan for participants aged 12 and above, and Shoushab Krida Samaroh for children under 12 years (with special sports scholarships for grassroots talents). Participants can register in Athletics, Football, Volleyball, Kabaddi, Swimming, Chess, Cycling, Yogasana, Aquathlon, and Boxing.",
    requiredDocuments: [
      "Aadhaar Card / Voter ID of Parent / Permanent Resident Certificate (PRC) of Assam",
      "Birth Certificate issued by Municipal / Village Registrar (compulsory for Under-12 Shoushab Krida Samaroh category)",
      "Student Bonafide Certificate / School Photo ID Card from an institution in Assam",
      "Medical Fitness Certificate from registered doctor (for contact sports: Boxing, Kabaddi, Aquathlon)",
      "Two recent passport-size color photographs",
      "Parent / Guardian consent declaration for participants under 18 years of age",
    ],
    selectionProcess:
      "Progressive multi-tier grassroots pyramid across Assam: 1) Gram Panchayat / Ward tournament heats -> 2) Legislative Assembly Constituency (LAC) championships -> 3) District championships across 35 districts -> 4) State Grand Finale at Sarusajai Sports Complex, Guwahati. State medalists and outstanding Under-12 athletes receive Assam Sports Scholarships, state academy berths, and direct scouting into Sports Authority of India (SAI) training centers.",
  },
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
  "Kho-Kho",
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
  "Guwahati",
  "Itanagar",
  "Jammu",
  "Chhatrapati Sambhajinagar",
] as const;
