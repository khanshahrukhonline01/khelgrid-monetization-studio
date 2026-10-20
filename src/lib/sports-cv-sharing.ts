import type { SportsCVData } from "@/types/sports-cv";
import { getDefaultSportsCV, loadSportsCVData, SPORTS_CV_STORAGE_KEY } from "./sports-cv-storage";

export const PUBLIC_CVS_STORAGE_KEY = "khelgrid_public_cvs_v1";

const memoryRegistry: Record<string, SportsCVData> = {};

/**
 * Creates a clean URL-friendly slug from the athlete's name and sport/id.
 * Example: "Aarav Sharma", "Cricket" -> "aarav-sharma-cricket"
 */
export function slugifyAthleteName(name: string, sport?: string): string {
  const cleanName = (name || "athlete")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const cleanSport = sport
    ? sport
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  if (cleanSport && !cleanName.includes(cleanSport)) {
    return `${cleanName}-${cleanSport}`;
  }
  return cleanName || "athlete-cv";
}

/**
 * Encodes SportsCVData into a compact URL-safe base64 string.
 * Supports Unicode strings safely.
 */
export function compressCVPayload(data: SportsCVData): string {
  try {
    const json = JSON.stringify(data);
    // Browser UTF-8 safe base64 encoding
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      const utf8Bytes = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16)),
      );
      return btoa(utf8Bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    // Node.js / SSR buffer fallback
    if (typeof Buffer !== "undefined") {
      return Buffer.from(json, "utf-8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    return "";
  } catch (err) {
    console.error("Failed to compress CV payload:", err);
    return "";
  }
}

/**
 * Decodes a compact URL-safe base64 string back into SportsCVData.
 */
export function decompressCVPayload(token: string): SportsCVData | null {
  if (!token) return null;
  try {
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    let json = "";
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const decodedStr = atob(base64);
      json = decodeURIComponent(
        Array.prototype.map
          .call(decodedStr, (c: string) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(""),
      );
    } else if (typeof Buffer !== "undefined") {
      json = Buffer.from(base64, "base64").toString("utf-8");
    }

    if (!json) return null;
    const parsed = JSON.parse(json);
    if (parsed && parsed.athleteName && parsed.sport) {
      return parsed as SportsCVData;
    }
    return null;
  } catch (err) {
    console.warn("Failed to decompress CV payload:", err);
    return null;
  }
}

/**
 * Saves a public CV record to local registry.
 */
export function savePublicCVToRegistry(data: SportsCVData, slug: string): void {
  try {
    memoryRegistry[slug] = data;
    if (data.athleteId) {
      memoryRegistry[data.athleteId.toLowerCase()] = data;
    }
    if (typeof window === "undefined" || !window.localStorage) return;
    const raw = window.localStorage.getItem(PUBLIC_CVS_STORAGE_KEY);
    const registry: Record<string, SportsCVData> = raw ? JSON.parse(raw) : {};
    registry[slug] = data;
    if (data.athleteId) {
      registry[data.athleteId.toLowerCase()] = data;
    }
    window.localStorage.setItem(PUBLIC_CVS_STORAGE_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error("Failed to save public CV to registry:", err);
  }
}

/**
 * Generates the full public shareable URL for an athlete's Sports CV.
 * Includes both clean slug and a self-contained fallback payload param
 * so the link works seamlessly anywhere, even on devices without local storage.
 */
export function generateShareableCVUrl(
  data: SportsCVData,
  explicitBaseUrl?: string,
): {
  url: string;
  slug: string;
  shortUrl: string;
  payloadParam: string;
} {
  const baseUrl =
    explicitBaseUrl ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://www.khelgrid.com");

  const slug = slugifyAthleteName(data.athleteName, data.sport);
  const payloadParam = compressCVPayload(data);

  // Also register locally for fast slug lookup
  savePublicCVToRegistry(data, slug);

  const shortUrl = `${baseUrl}/cv/${slug}`;
  const url = payloadParam ? `${baseUrl}/cv/${slug}?data=${payloadParam}` : shortUrl;

  return {
    url,
    slug,
    shortUrl,
    payloadParam,
  };
}

/**
 * Resolves SportsCVData from a slug or token parameter.
 */
export function resolvePublicSportsCV(slug?: string, payloadParam?: string): SportsCVData {
  // 1. Try decoding the payload parameter first (100% portable)
  if (payloadParam) {
    const fromPayload = decompressCVPayload(payloadParam);
    if (fromPayload) return fromPayload;
  }

  const normalizedSlug = (slug || "").toLowerCase().trim();

  // 2. Try looking up in the public CVs in-memory or localStorage registry
  if (normalizedSlug && memoryRegistry[normalizedSlug]) {
    return memoryRegistry[normalizedSlug];
  }

  if (typeof window !== "undefined" && window.localStorage && normalizedSlug) {
    try {
      const raw = window.localStorage.getItem(PUBLIC_CVS_STORAGE_KEY);
      if (raw) {
        const registry: Record<string, SportsCVData> = JSON.parse(raw);
        if (registry[normalizedSlug]) {
          return registry[normalizedSlug];
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Try checking current logged-in / active user CV if matching
  try {
    const current = loadSportsCVData();
    if (current) {
      const currentSlug = slugifyAthleteName(current.athleteName, current.sport);
      if (
        normalizedSlug === currentSlug ||
        normalizedSlug === (current.athleteId || "").toLowerCase() ||
        normalizedSlug === "me" ||
        normalizedSlug === "current"
      ) {
        return current;
      }
    }
  } catch {
    // ignore
  }

  // 4. Sample profiles for common demo slugs
  if (
    normalizedSlug === "aarav-sharma" ||
    normalizedSlug === "aarav-sharma-cricket" ||
    normalizedSlug === "kg-ind-2026-9042" ||
    normalizedSlug === "sample" ||
    normalizedSlug === "default" ||
    !normalizedSlug
  ) {
    return getDefaultSportsCV("Aarav Sharma");
  }

  if (normalizedSlug.includes("rohan") || normalizedSlug.includes("football")) {
    const rohan = getDefaultSportsCV("Rohan Verma");
    rohan.sport = "Football";
    rohan.position = "Central Attacking Midfielder";
    rohan.currentAcademy = "Bengaluru FC Residential Academy";
    return rohan;
  }

  if (normalizedSlug.includes("priya") || normalizedSlug.includes("badminton")) {
    const priya = getDefaultSportsCV("Priya Nair");
    priya.sport = "Badminton";
    priya.position = "Women's Singles Specialist";
    priya.currentAcademy = "Gopichand Badminton Academy";
    return priya;
  }

  // 5. Fallback formatting a name from the slug
  const cleanName = normalizedSlug
    .replace(/-cricket|-football|-badminton|-athletics|-basketball/g, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return getDefaultSportsCV(cleanName || "Aarav Sharma");
}

/**
 * Builds ready-to-share social links and copy text for WhatsApp, X (Twitter), LinkedIn, etc.
 */
export function buildSocialShareLinks(
  data: SportsCVData,
  shareUrl: string,
): {
  whatsapp: string;
  twitter: string;
  linkedin: string;
  telegram: string;
  email: string;
  shareTitle: string;
  shareText: string;
  scoutPitchSnippet: string;
} {
  const name = data.athleteName || "Athlete";
  const sport = data.sport || "Sports";
  const position = data.position || "Player";
  const level = data.ageCategory || "Open";
  const achievementsCount = data.achievements?.length || 0;
  const topAchievement = data.achievements?.[0]?.title || "State Champion";

  const shareTitle = `${name} · Verified ${sport} Sports CV (${level})`;
  const shareText = `Check out ${name}'s official scout CV on KhelGrid! ${sport} ${position} | ${topAchievement} | ${achievementsCount}+ honours logged.`;

  // WhatsApp text with rich formatting (bold, emojis, line breaks)
  const whatsappMsg = [
    `🏅 *${name} — Official Sports CV (${sport})*`,
    `📌 *Position:* ${position}`,
    `⚡ *Age Group:* ${level} | *Status:* ${data.availability || "Open for Trials"}`,
    `🏆 *Key Honour:* ${topAchievement}`,
    ...(data.careerSummary
      ? [
          `📊 *Stats:* ${data.careerSummary.totalMatches} matches · ${data.careerSummary.primaryMetric.label}: ${data.careerSummary.primaryMetric.value}`,
        ]
      : []),
    ``,
    `🔗 *View Full Verified Sports CV on KhelGrid:*`,
    shareUrl,
    ``,
    `_Verified through KhelGrid Grassroots Sports Registry_`,
  ].join("\n");

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;

  // Twitter / X tweet
  const tweetText = `Honoured to share my verified ${sport} Sports CV & career stats on @KhelGrid! ${topAchievement} · ${position}\n\nInspect full scout profile & match records:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=KhelGrid,GrassrootsSports,${sport.replace(/\s+/g, "")}`;

  // LinkedIn share
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // Telegram
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;

  // Email to scout or coach
  const emailSubject = `Scout Dossier: ${name} · ${sport} (${position})`;
  const emailBody = [
    `Dear Coach / Scout,`,
    ``,
    `Please find the verified athletic profile and competitive performance records for ${name} (${sport} - ${position}):`,
    ``,
    `Athletic Highlights:`,
    `- Primary Sport: ${sport}`,
    `- Tactical Role: ${position}`,
    `- Current Academy / Squad: ${data.currentAcademy || "Independent"}`,
    `- Top Achievement: ${topAchievement}`,
    `- Height / Weight: ${data.height || "—"} / ${data.weight || "—"}`,
    ``,
    `Full verified dossier, match records, and digital scout telemetry are available at:`,
    shareUrl,
    ``,
    `Sincerely,`,
    `${name}`,
    `KhelGrid Athlete ID: ${data.athleteId}`,
  ].join("\n");

  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Scout pitch snippet for pasting into WhatsApp groups or trial applications
  const scoutPitchSnippet = [
    `*ATHLETE SCOUT PROFILE*`,
    `Name: ${name}`,
    `Sport: ${sport} | Role: ${position}`,
    `Age Group: ${level} | City: ${data.city}, ${data.state}`,
    `Academy: ${data.currentAcademy || "Independent"}`,
    `Key Achievement: ${topAchievement}`,
    `Official KhelGrid CV: ${shareUrl}`,
  ].join("\n");

  return {
    whatsapp: whatsappUrl,
    twitter: twitterUrl,
    linkedin: linkedinUrl,
    telegram: telegramUrl,
    email: emailUrl,
    shareTitle,
    shareText,
    scoutPitchSnippet,
  };
}
