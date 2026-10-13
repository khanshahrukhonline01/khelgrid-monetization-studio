import type { ComponentType } from "react";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  ScanLine,
  Users,
  BookOpen,
  Crown,
  GraduationCap,
  Smartphone,
  Info,
  CalendarCheck,
  CalendarDays,
  Star,
  Search,
  Trophy,
  MapPin,
  Wrench,
  Swords,
  Home,
  Compass,
  User,
  Zap,
  LogIn,
  Radio,
  Briefcase,
  Handshake,
  Library,
  Heart,
  Shield,
  TrendingUp,
  Newspaper,
  FileText,
  Mail,
  ScrollText,
  RotateCcw,
  ShieldAlert,
  Wand2,
  Copyright,
  Activity,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Which nav surfaces should render this item. */
  surfaces: Array<"primary" | "features">;
};

/**
 * Single source of truth for in-app navigation. Both the desktop
 * FeaturesSidebar and mobile NavDrawer render from this list, and the
 * Breadcrumbs component derives its route→label map from it so labels
 * can never drift between surfaces.
 *
 * Add a route here and it automatically appears wherever it's needed
 * (per its `surfaces`) with a matching breadcrumb label.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home, surfaces: ["primary"] },
  {
    to: "/search",
    label: "Search Trials and Opportunities",
    icon: Search,
    surfaces: ["primary", "features"],
  },
  { to: "/live-scores", label: "Live Scores", icon: Activity, surfaces: ["primary", "features"] },
  { to: "/trials", label: "Live Trials", icon: Radio, surfaces: [] },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase, surfaces: [] },
  { to: "/resources", label: "Resources", icon: Library, surfaces: [] },
  { to: "/sports", label: "Sports", icon: Trophy, surfaces: [] },
  { to: "/cities", label: "Cities", icon: Compass, surfaces: ["primary"] },
  { to: "/guides", label: "Guides", icon: BookOpen, surfaces: ["primary", "features"] },
  { to: "/chronicle", label: "KhelChronicle", icon: Newspaper, surfaces: ["primary", "features"] },
  { to: "/blog", label: "Blog", icon: Newspaper, surfaces: ["primary", "features"] },
  { to: "/tools", label: "Tools & calculators", icon: Wrench, surfaces: ["primary", "features"] },
  { to: "/play", label: "Play · Find games", icon: Swords, surfaces: ["primary", "features"] },
  { to: "/book", label: "Book venues", icon: CalendarCheck, surfaces: ["primary", "features"] },
  {
    to: "/train",
    label: "Train · Coaching",
    icon: GraduationCap,
    surfaces: ["primary", "features"],
  },
  {
    to: "/events",
    label: "Events & tournaments",
    icon: CalendarDays,
    surfaces: ["primary", "features"],
  },
  { to: "/memberships", label: "Memberships", icon: Star, surfaces: ["primary", "features"] },
  { to: "/recommendations", label: "For You", icon: Heart, surfaces: ["primary", "features"] },
  { to: "/trust-center", label: "Trust Center", icon: Shield, surfaces: ["primary", "features"] },
  { to: "/my-stats", label: "My Stats", icon: TrendingUp, surfaces: ["primary", "features"] },
  { to: "/dashboard", label: "My Dashboard", icon: User, surfaces: ["primary"] },
  { to: "/onboarding", label: "Sports CV Wizard", icon: Wand2, surfaces: ["primary", "features"] },
  { to: "/start-from-zero", label: "Start From Zero", icon: Sparkles, surfaces: ["features"] },
  { to: "/ai-guide", label: "AI Guide", icon: Bot, surfaces: ["features"] },
  { to: "/verify", label: "Verify", icon: ShieldCheck, surfaces: ["features"] },
  { to: "/talent-scanner", label: "Talent Scanner", icon: ScanLine, surfaces: ["features"] },
  { to: "/scout-portal", label: "Scout Portal", icon: ScanLine, surfaces: ["features"] },
  { to: "/community", label: "Community", icon: Users, surfaces: ["features"] },
  {
    to: "/learning-hub",
    label: "Sports & Learning Hub",
    icon: BookOpen,
    surfaces: ["primary", "features"],
  },
  { to: "/pricing", label: "Pricing", icon: Crown, surfaces: ["features"] },
  { to: "/coaches", label: "Coaches", icon: GraduationCap, surfaces: ["features"] },
  { to: "/academy", label: "For Academies", icon: Trophy, surfaces: ["features"] },
  { to: "/mobile-app", label: "Mobile App", icon: Smartphone, surfaces: ["features"] },
  { to: "/careers", label: "Careers", icon: Briefcase, surfaces: ["features"] },
  { to: "/partner", label: "Partner with Us", icon: Handshake, surfaces: ["features"] },
  { to: "/about", label: "About", icon: Info, surfaces: ["primary", "features"] },
  { to: "/login", label: "Log in", icon: LogIn, surfaces: [] },
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck, surfaces: [] },
  { to: "/terms", label: "Terms of Service", icon: FileText, surfaces: [] },
  { to: "/contact", label: "Contact", icon: Mail, surfaces: [] },
  { to: "/editorial-policy", label: "Editorial Policy", icon: ScrollText, surfaces: [] },
  { to: "/cancellation-policy", label: "Cancellation Policy", icon: RotateCcw, surfaces: [] },
  { to: "/posh-policy", label: "POSH Policy", icon: ShieldAlert, surfaces: [] },
  { to: "/ipr-policy", label: "IPR & Copyright Policy", icon: Copyright, surfaces: [] },
];

/**
 * Labels for dynamic route IDs (contain `$param`) — these never appear in
 * NAV_ITEMS because they aren't linkable without params.
 */
export const DYNAMIC_ROUTE_LABELS: Record<string, string> = {
  "/sports/$slug": "Sport",
  "/sport/$slug": "Sport",
  "/city/$slug": "City",
  "/guide/$slug": "Guide",
  "/tool/$slug": "Tool",
  "/tools/$slug": "Tool",
  "/sport-in-city/$slug": "Sport in city",
  "/top-guides/$category": "Top guides",
  "/best-tools/$category": "Best tools",
  "/blog/$slug": "Article",
  "/blog/write": "Write article",
  "/recommendations": "For You",
  "/trust-center": "Trust Center",
  "/my-stats": "My Stats",
  "/scout-portal": "Scout Portal",
};

/**
 * Route path → label map derived from NAV_ITEMS + dynamic overrides.
 * Consumers (Breadcrumbs) read from this so labels can't drift from nav.
 */
export const ROUTE_LABELS: Record<string, string> = {
  ...Object.fromEntries(NAV_ITEMS.map((i) => [i.to, i.label])),
  ...DYNAMIC_ROUTE_LABELS,
};

// Convenience filtered lists for existing consumers.
export const PRIMARY_ITEMS = NAV_ITEMS.filter((i) => i.surfaces.includes("primary"));
export const FEATURE_ITEMS = NAV_ITEMS.filter((i) => i.surfaces.includes("features"));

/** Shared active-route matcher for nav surfaces (desktop + mobile). */
export function isActivePath(path: string, to: string): boolean {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(to + "/");
}

// Zap is re-exported so NavDrawer's "Go Pro" CTA can keep using it without
// importing lucide directly if it prefers a single import site.
export { Zap };
