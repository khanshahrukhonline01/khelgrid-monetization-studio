/**
 * Comprehensive visual card image catalog for KhelGrid.
 * Provides high-fidelity, fail-proof visual artwork for:
 * 1. Selection Trials
 * 2. Book Turfs & Courts
 * 3. Join Pickup Games
 * 4. KhelChronicle Cards
 * 5. Featured Training Institutions
 *
 * Utilizes high-resolution styled SVG vector art and curated sports artwork
 * ensuring 100% visibility across all devices with zero network failure risk.
 */

// Local generated showcase image assets
export const LOCAL_HERO_IMAGE = "/src/assets/images/khelgrid_hero_athletes_1790836288244.jpg";
export const LOCAL_ACADEMY_IMAGE = "/src/assets/images/khelgrid_academy_showcase_1790836301666.jpg";

/**
 * Creates an ultra-clean, high-resolution SVG data-URI for sports cards.
 */
function createSportSvg({
  themeColor1,
  themeColor2,
  sportIcon,
  fieldPattern,
  sportLabel,
  subLabel,
}: {
  themeColor1: string;
  themeColor2: string;
  sportIcon: string;
  fieldPattern: "track" | "turf" | "court" | "ring" | "nets";
  sportLabel: string;
  subLabel: string;
}): string {
  let patternElements = "";

  if (fieldPattern === "turf") {
    // Football / Cricket artificial turf field markings and floodlights
    patternElements = `
      <defs>
        <pattern id="turf-stripes" width="30" height="200" patternUnits="userSpaceOnUse">
          <rect width="15" height="200" fill="rgba(255,255,255,0.04)"/>
        </pattern>
      </defs>
      <rect width="400" height="240" fill="url(#turf-stripes)"/>
      <circle cx="200" cy="120" r="45" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="200" y1="0" x2="200" y2="240" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <rect x="0" y="60" width="60" height="120" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
      <rect x="340" y="60" width="60" height="120" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
      <circle cx="80" cy="30" r="40" fill="url(#floodlight)"/>
      <circle cx="320" cy="30" r="40" fill="url(#floodlight)"/>
    `;
  } else if (fieldPattern === "track") {
    // Running track lanes and stadium curve
    patternElements = `
      <path d="M-20,180 Q200,60 420,180" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <path d="M-20,195 Q200,80 420,195" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <path d="M-20,210 Q200,100 420,210" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <path d="M-20,225 Q200,120 420,225" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <line x1="160" y1="90" x2="160" y2="170" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-dasharray="4,4"/>
      <circle cx="200" cy="50" r="70" fill="url(#floodlight)"/>
    `;
  } else if (fieldPattern === "court") {
    // Badminton / Basketball indoor court lines
    patternElements = `
      <rect x="50" y="30" width="300" height="180" rx="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="200" y1="30" x2="200" y2="210" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
      <circle cx="200" cy="120" r="35" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <line x1="100" y1="30" x2="100" y2="210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <line x1="300" y1="30" x2="300" y2="210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    `;
  } else if (fieldPattern === "ring") {
    // Boxing / Wrestling ring & combat arena
    patternElements = `
      <rect x="70" y="40" width="260" height="160" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <line x1="70" y1="70" x2="330" y2="70" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      <line x1="70" y1="120" x2="330" y2="120" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      <line x1="70" y1="170" x2="330" y2="170" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      <circle cx="70" cy="40" r="6" fill="#ef4444"/>
      <circle cx="330" cy="40" r="6" fill="#3b82f6"/>
    `;
  } else {
    // Cricket nets / combined arena
    patternElements = `
      <rect x="120" y="20" width="160" height="200" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="6,4"/>
      <line x1="150" y1="20" x2="150" y2="220" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
      <line x1="250" y1="20" x2="250" y2="220" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
      <rect x="180" y="60" width="40" height="120" fill="rgba(255,255,255,0.06)" rx="4"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${themeColor1}"/>
        <stop offset="100%" stop-color="${themeColor2}"/>
      </linearGradient>
      <radialGradient id="floodlight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="overlay-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#0a0d14" stop-opacity="0.85"/>
        <stop offset="60%" stop-color="#0a0d14" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#0a0d14" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#bg-grad)"/>
    ${patternElements}
    <rect width="400" height="240" fill="url(#overlay-grad)"/>
    
    <!-- Sport Emblem Backdrop Glow -->
    <circle cx="200" cy="100" r="42" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <text x="200" y="112" font-size="34" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${sportIcon}</text>
    
    <!-- Bottom Badge Labels -->
    <rect x="20" y="194" width="360" height="32" rx="8" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="32" y="215" fill="#ffffff" font-size="12" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="0.5">${sportLabel.toUpperCase()}</text>
    <text x="368" y="215" fill="#94a3b8" font-size="11" font-weight="500" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${subLabel}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// -------------------------------------------------------------
// 1. SELECTION TRIAL CARD IMAGES
// -------------------------------------------------------------
export const TRIAL_IMAGES: Record<string, string> = {
  Athletics: createSportSvg({
    themeColor1: "#991b1b", // Red/Crimson track
    themeColor2: "#1e1b4b", // Deep stadium navy
    sportIcon: "🏃",
    fieldPattern: "track",
    sportLabel: "Athletics Scouting Combine",
    subLabel: "National Trials",
  }),
  Football: createSportSvg({
    themeColor1: "#065f46", // Turf emerald
    themeColor2: "#0f172a", // Slate navy
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "Football Youth Trial",
    subLabel: "AIFF Certified",
  }),
  Cricket: createSportSvg({
    themeColor1: "#1e3a8a", // Classic cricket navy
    themeColor2: "#14532d", // Turf green
    sportIcon: "🏏",
    fieldPattern: "nets",
    sportLabel: "Cricket Combine",
    subLabel: "BCCI Talent Radar",
  }),
  Badminton: createSportSvg({
    themeColor1: "#581c87", // Indigo / purple court
    themeColor2: "#1e1b4b", // Deep navy
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "Badminton Combine",
    subLabel: "SAI NCOE Partner",
  }),
  Wrestling: createSportSvg({
    themeColor1: "#7f1d1d", // Mat red
    themeColor2: "#312e81", // Indigo
    sportIcon: "🤼",
    fieldPattern: "ring",
    sportLabel: "Wrestling Combine",
    subLabel: "SAI Center",
  }),
  Boxing: createSportSvg({
    themeColor1: "#831843", // Boxing crimson
    themeColor2: "#0f172a", // Dark charcoal
    sportIcon: "🥊",
    fieldPattern: "ring",
    sportLabel: "Boxing Ring Combine",
    subLabel: "Olympic Pathway",
  }),
  Basketball: createSportSvg({
    themeColor1: "#9a3412", // Hardwood orange
    themeColor2: "#1e1b4b", // Midnight blue
    sportIcon: "🏀",
    fieldPattern: "court",
    sportLabel: "Basketball Combine",
    subLabel: "Youth League",
  }),
  Kabaddi: createSportSvg({
    themeColor1: "#854d0e", // Clay / mat gold
    themeColor2: "#1c1917", // Dark earth
    sportIcon: "⚡",
    fieldPattern: "ring",
    sportLabel: "Kabaddi NYP Combine",
    subLabel: "Pro Combine",
  }),
  Pickleball: createSportSvg({
    themeColor1: "#0284c7", // Sky blue / The Blue Court
    themeColor2: "#0f172a", // Deep slate
    sportIcon: "🏓",
    fieldPattern: "court",
    sportLabel: "Pickleball State Selection",
    subLabel: "PWR 400 Delhi",
  }),
  Wushu: createSportSvg({
    themeColor1: "#b91c1c", // Martial crimson / combat red
    themeColor2: "#450a0a", // Deep arena dark
    sportIcon: "🥋",
    fieldPattern: "ring",
    sportLabel: "All India Inter-University Wushu",
    subLabel: "Sanda & Taolu RRU",
  }),
  Archery: createSportSvg({
    themeColor1: "#0284c7",
    themeColor2: "#082f49",
    sportIcon: "🏹",
    fieldPattern: "track",
    sportLabel: "Archery Ranking Trials",
    subLabel: "Recurve & Compound",
  }),
  Shooting: createSportSvg({
    themeColor1: "#0f766e",
    themeColor2: "#134e4a",
    sportIcon: "🎯",
    fieldPattern: "court",
    sportLabel: "Precision Shooting Trials",
    subLabel: "10m Air Rifle & Pistol",
  }),
  Volleyball: createSportSvg({
    themeColor1: "#ea580c",
    themeColor2: "#431407",
    sportIcon: "🏐",
    fieldPattern: "court",
    sportLabel: "State Volleyball Combine",
    subLabel: "FIVB Court System",
  }),
  Gymnastics: createSportSvg({
    themeColor1: "#7c3aed",
    themeColor2: "#2e1065",
    sportIcon: "🤸",
    fieldPattern: "court",
    sportLabel: "Gymnastics Selection Trials",
    subLabel: "FIG Artistic & Vault",
  }),
  Handball: createSportSvg({
    themeColor1: "#c2410c",
    themeColor2: "#451a03",
    sportIcon: "🤾",
    fieldPattern: "court",
    sportLabel: "Handball Combine",
    subLabel: "IHF Team Trials",
  }),
  Judo: createSportSvg({
    themeColor1: "#1d4ed8",
    themeColor2: "#0f172a",
    sportIcon: "🥋",
    fieldPattern: "ring",
    sportLabel: "Judo National Trials",
    subLabel: "IJF Weight Classes",
  }),
  Karate: createSportSvg({
    themeColor1: "#dc2626",
    themeColor2: "#450a0a",
    sportIcon: "🥋",
    fieldPattern: "ring",
    sportLabel: "Karate Ranking Trials",
    subLabel: "Kumite & Kata",
  }),
  Taekwondo: createSportSvg({
    themeColor1: "#2563eb",
    themeColor2: "#1e1b4b",
    sportIcon: "🥋",
    fieldPattern: "ring",
    sportLabel: "Taekwondo Kyorugi Trials",
    subLabel: "World Taekwondo PSS",
  }),
  "Water Sports": createSportSvg({
    themeColor1: "#0284c7",
    themeColor2: "#0c4a6e",
    sportIcon: "🛶",
    fieldPattern: "track",
    sportLabel: "Water Sports Regatta Trials",
    subLabel: "Kayak, Canoe & Rowing",
  }),
  Weightlifting: createSportSvg({
    themeColor1: "#b45309",
    themeColor2: "#451a03",
    sportIcon: "🏋️",
    fieldPattern: "ring",
    sportLabel: "Olympic Weightlifting Trials",
    subLabel: "Snatch & Clean & Jerk",
  }),
  Yoga: createSportSvg({
    themeColor1: "#059669",
    themeColor2: "#064e3b",
    sportIcon: "🧘",
    fieldPattern: "court",
    sportLabel: "Yogasana Sports Trials",
    subLabel: "Traditional & Artistic",
  }),
  "Table Tennis": createSportSvg({
    themeColor1: "#0284c7",
    themeColor2: "#0f172a",
    sportIcon: "🏓",
    fieldPattern: "court",
    sportLabel: "Table Tennis Ranking Trials",
    subLabel: "ITTF Singles & Doubles",
  }),
  "Multi-Discipline Sports Quota": createSportSvg({
    themeColor1: "#15803d",
    themeColor2: "#14532d",
    sportIcon: "🎖️",
    fieldPattern: "track",
    sportLabel: "CRPF Meritorious Sportspersons",
    subLabel: "521 Sports Quota Vacancies",
  }),
};

export function getTrialCardImage(sport: string): string {
  return TRIAL_IMAGES[sport] || TRIAL_IMAGES["Athletics"];
}

// -------------------------------------------------------------
// 2. BOOK TURFS & COURTS VENUE CARD IMAGES
// -------------------------------------------------------------
export const VENUE_IMAGES: Record<string, string> = {
  v1: createSportSvg({
    themeColor1: "#065f46",
    themeColor2: "#022c22",
    sportIcon: "🏓",
    fieldPattern: "court",
    sportLabel: "FerroHub Sports | Millers",
    subLabel: "Pickleball & Box Cricket",
  }),
  v2: createSportSvg({
    themeColor1: "#047857",
    themeColor2: "#0f172a",
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "Depot18 Sports Arena",
    subLabel: "FIFA Grade Turf",
  }),
  v3: createSportSvg({
    themeColor1: "#1d4ed8",
    themeColor2: "#1e1b4b",
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "SmashZone Badminton Arena",
    subLabel: "BWF Wooden Flooring",
  }),
  v4: createSportSvg({
    themeColor1: "#0f766e",
    themeColor2: "#134e4a",
    sportIcon: "🏏",
    fieldPattern: "turf",
    sportLabel: "GreenPitch Cricket & Turf",
    subLabel: "Floodlit Box Pitch",
  }),
  default: createSportSvg({
    themeColor1: "#047857",
    themeColor2: "#0f172a",
    sportIcon: "🏟️",
    fieldPattern: "turf",
    sportLabel: "Premium Sports Turf",
    subLabel: "Instant Court Booking",
  }),
};

export function getVenueCardImage(venueId: string, sport?: string): string {
  if (VENUE_IMAGES[venueId]) return VENUE_IMAGES[venueId];
  if (sport && TRIAL_IMAGES[sport]) return TRIAL_IMAGES[sport];
  return VENUE_IMAGES.default;
}

// -------------------------------------------------------------
// 3. JOIN PICKUP GAMES CARD IMAGES
// -------------------------------------------------------------
export const PICKUP_GAME_IMAGES: Record<string, string> = {
  Football: createSportSvg({
    themeColor1: "#065f46",
    themeColor2: "#111827",
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "Community Football 7v7",
    subLabel: "Lobby Open · Tap to Join",
  }),
  Badminton: createSportSvg({
    themeColor1: "#4338ca",
    themeColor2: "#1e1b4b",
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "Badminton Doubles Pickup",
    subLabel: "Indoor Court Match",
  }),
  Cricket: createSportSvg({
    themeColor1: "#1e40af",
    themeColor2: "#064e3b",
    sportIcon: "🏏",
    fieldPattern: "nets",
    sportLabel: "Box Cricket Match",
    subLabel: "Evening Floodlit Turf",
  }),
  Basketball: createSportSvg({
    themeColor1: "#c2410c",
    themeColor2: "#18181b",
    sportIcon: "🏀",
    fieldPattern: "court",
    sportLabel: "Basketball Halfcourt 3v3",
    subLabel: "Urban Pickups",
  }),
  Pickleball: createSportSvg({
    themeColor1: "#0891b2",
    themeColor2: "#0e7490",
    sportIcon: "🏓",
    fieldPattern: "court",
    sportLabel: "Pickleball Social Match",
    subLabel: "All Skill Levels",
  }),
};

export function getPickupGameCardImage(sport: string): string {
  return PICKUP_GAME_IMAGES[sport] || PICKUP_GAME_IMAGES["Football"];
}

// -------------------------------------------------------------
// 4. KHELCHRONICLE NEWS WIRE CARD IMAGES
// -------------------------------------------------------------
export const CHRONICLE_IMAGES: Record<string, string> = {
  Athletics: createSportSvg({
    themeColor1: "#b91c1c",
    themeColor2: "#18181b",
    sportIcon: "🏆",
    fieldPattern: "track",
    sportLabel: "Fit India School Games",
    subLabel: "State Selection Report",
  }),
  Football: createSportSvg({
    themeColor1: "#047857",
    themeColor2: "#0f172a",
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "AIFF Youth League",
    subLabel: "Scout Dispatch",
  }),
  Badminton: createSportSvg({
    themeColor1: "#6d28d9",
    themeColor2: "#1e1b4b",
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "National Junior Badminton",
    subLabel: "Podium Track Update",
  }),
  General: createSportSvg({
    themeColor1: "#1d4ed8",
    themeColor2: "#0f172a",
    sportIcon: "📰",
    fieldPattern: "track",
    sportLabel: "KhelChronicle National Wire",
    subLabel: "Verified Sports News",
  }),
};

export function getChronicleCardImage(sport: string): string {
  return CHRONICLE_IMAGES[sport] || CHRONICLE_IMAGES.General;
}

// -------------------------------------------------------------
// 5. FEATURED TRAINING INSTITUTIONS & ACADEMIES CARD IMAGES
// -------------------------------------------------------------
export const ACADEMY_IMAGES: Record<string, string> = {
  "iis-vijayanagar": createSportSvg({
    themeColor1: "#1e3a8a", // Navy
    themeColor2: "#047857", // Emerald
    sportIcon: "🏛️",
    fieldPattern: "track",
    sportLabel: "Inspire Institute of Sport (IIS)",
    subLabel: "Olympic Training Campus · Vijayanagar",
  }),
  "tata-football-academy": createSportSvg({
    themeColor1: "#065f46", // AIFF Green
    themeColor2: "#1e293b", // Slate
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "Tata Football Academy (TFA)",
    subLabel: "Elite Youth Academy · Jamshedpur",
  }),
  "gopichand-badminton": createSportSvg({
    themeColor1: "#581c87", // Indigo
    themeColor2: "#1e1b4b", // Deep Purple
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "Pullela Gopichand Academy",
    subLabel: "SAI NCOE Center · Hyderabad",
  }),
  "bhaichung-bhutia-schools": createSportSvg({
    themeColor1: "#047857", // Turf green
    themeColor2: "#0f172a", // Dark charcoal
    sportIcon: "⚽",
    fieldPattern: "turf",
    sportLabel: "Bhaichung Bhutia Football Schools",
    subLabel: "20+ Centers Nationwide",
  }),
  "ppba-bengaluru": createSportSvg({
    themeColor1: "#3b0764", // Padukone royal purple
    themeColor2: "#1e3a8a", // Royal Blue
    sportIcon: "🏸",
    fieldPattern: "court",
    sportLabel: "Prakash Padukone Academy (PPBA)",
    subLabel: "Olympic Podium Track · Bengaluru",
  }),
  "asi-pune": createSportSvg({
    themeColor1: "#7f1d1d", // Army Maroon
    themeColor2: "#14532d", // Olive Green
    sportIcon: "🎖️",
    fieldPattern: "track",
    sportLabel: "Army Sports Institute (ASI)",
    subLabel: "Mission Olympics Wing · Pune",
  }),
  "mary-kom-foundation": createSportSvg({
    themeColor1: "#831843", // Boxing Crimson
    themeColor2: "#18181b", // Carbon
    sportIcon: "🥊",
    fieldPattern: "ring",
    sportLabel: "Mary Kom Regional Foundation",
    subLabel: "SAI Center of Excellence · Imphal",
  }),
  "mrf-pace-foundation": createSportSvg({
    themeColor1: "#991b1b", // MRF Pace Red
    themeColor2: "#1e3a8a", // Cricket Navy
    sportIcon: "🏏",
    fieldPattern: "nets",
    sportLabel: "MRF Pace Foundation",
    subLabel: "Premier Fast Bowling combine · Chennai",
  }),
};

export function getAcademyCardImage(academyId: string): string {
  return ACADEMY_IMAGES[academyId] || LOCAL_ACADEMY_IMAGE;
}
