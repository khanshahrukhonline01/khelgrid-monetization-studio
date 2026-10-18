import { useState, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import type {
  SportsCVData,
  SportType,
  AchievementLevel,
  AwardType,
  MetricCategory,
  CardTheme,
  AthleticAchievement,
  PerformanceMetric,
  SocialProfiles,
} from "@/types/sports-cv";
import { SPORT_POSITION_PRESETS, COMMON_METRIC_PRESETS } from "@/types/sports-cv";
import {
  loadSportsCVData,
  saveSportsCVData,
  getDefaultSportsCV,
  downloadSportsCardAsPNG,
} from "@/lib/sports-cv-storage";
import { updateUserProfile } from "@/lib/user-profile-service";
import { SportsCVCard } from "@/components/SportsCVCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Award,
  Zap,
  ShieldCheck,
  User,
  Video,
  Play,
  ExternalLink,
  Instagram,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
  Flame,
  Plus,
  Trash2,
  Eye,
  Globe,
  Activity,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const ONBOARDING_COMPLETED_KEY = "khelgrid_onboarding_completed_v1";

const SPORTS_LIST: { name: SportType; icon: string }[] = [
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Basketball", icon: "🏀" },
  { name: "Badminton", icon: "🏸" },
  { name: "Athletics", icon: "🏃" },
  { name: "Tennis", icon: "🎾" },
  { name: "Kabaddi", icon: "🤼" },
  { name: "Swimming", icon: "🏊" },
  { name: "Hockey", icon: "🏑" },
  { name: "Other", icon: "🎯" },
];

const AGE_CATEGORIES = [
  "U-14 (Sub-Junior)",
  "U-16 (Junior)",
  "U-19 (Youth)",
  "U-23 (Collegiate / Emerging)",
  "Senior Open (19-35)",
  "Masters (35+)",
];

const POPULAR_CITIES = [
  "New Delhi, Delhi NCR",
  "Bengaluru, Karnataka",
  "Mumbai, Maharashtra",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Chandigarh, Punjab/Haryana",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Bhubaneswar, Odisha",
  "Kochi, Kerala",
];

const ACHIEVEMENT_LEVELS: AchievementLevel[] = [
  "School",
  "Club",
  "District",
  "State",
  "National",
  "International",
];

const AWARD_TYPES: AwardType[] = [
  "Gold / 1st Place",
  "Silver / 2nd Place",
  "Bronze / 3rd Place",
  "MVP / Best Player",
  "Best Bowler",
  "Best Batsman",
  "Top Scorer",
  "State Selection",
  "Finalist",
  "Certificate of Merit",
];

const METRIC_CATEGORIES: MetricCategory[] = [
  "Speed",
  "Endurance",
  "Power",
  "Athleticism",
  "Sport-Specific",
];

const CARD_THEMES: {
  id: CardTheme;
  name: string;
  desc: string;
  colorClass: string;
  borderClass: string;
}[] = [
  {
    id: "gold",
    name: "Championship Gold",
    desc: "Prestige luxury with radiant gold metallic trim",
    colorClass: "bg-amber-500",
    borderClass: "border-amber-500",
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    desc: "High-voltage electric cyan & violet telemetry",
    colorClass: "bg-cyan-500",
    borderClass: "border-cyan-500",
  },
  {
    id: "emerald",
    name: "Pitch Emerald",
    desc: "Vibrant grass pitch green & athletic teal",
    colorClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
  },
  {
    id: "crimson",
    name: "Power Crimson",
    desc: "Aggressive speed & high-intensity red",
    colorClass: "bg-rose-500",
    borderClass: "border-rose-500",
  },
  {
    id: "classic",
    name: "Classic Slate",
    desc: "Minimalist executive monochrome theme",
    colorClass: "bg-neutral-600",
    borderClass: "border-neutral-500",
  },
];

const STEPS = [
  { id: 1, title: "Identity", label: "Athlete Basics" },
  { id: 2, title: "Position", label: "Role & Academy" },
  { id: 3, title: "Benchmarks", label: "Tested Metrics" },
  { id: 4, title: "Honours", label: "Medals & Records" },
  { id: 5, title: "Socials", label: "Socials & Reels" },
  { id: 6, title: "Finalize", label: "Theme & Launch" },
];

/**
 * Extracts a YouTube embed URL if valid
 */
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } catch {
    return null;
  }
  return null;
}

interface AthleteOnboardingWizardProps {
  onComplete?: (data: SportsCVData) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function AthleteOnboardingWizard({
  onComplete,
  onCancel,
  isModal = false,
}: AthleteOnboardingWizardProps) {
  const navigate = useNavigate();

  // Load existing CV data or initialize clean
  const [data, setData] = useState<SportsCVData>(() => {
    const existing = loadSportsCVData();
    return {
      ...existing,
      socialProfiles: existing.socialProfiles || {
        instagram: "@" + existing.athleteName.toLowerCase().replace(/\s+/g, "."),
        youtube: existing.highlightVideoUrl || "https://youtu.be/sample-reel",
        twitter: "@" + existing.athleteName.toLowerCase().replace(/\s+/g, "_"),
        cricheroes: "",
        strava: "",
        playo: "",
      },
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // New Achievement draft state
  const [achDraft, setAchDraft] = useState({
    title: "",
    competition: "",
    year: new Date().getFullYear(),
    level: "State" as AchievementLevel,
    award: "Gold / 1st Place" as AwardType,
    description: "",
  });

  // New Metric draft state
  const [metricDraft, setMetricDraft] = useState({
    name: "",
    value: "",
    unit: "",
    category: "Speed" as MetricCategory,
    score: 85,
    benchmark: "",
  });

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (data.athleteName.trim().length > 1) score += 20;
    if (data.position.trim().length > 1) score += 20;
    if (data.performanceMetrics.length > 0) score += 20;
    if (data.achievements.length > 0) score += 20;
    if (data.socialProfiles?.instagram || data.socialProfiles?.youtube || data.highlightVideoUrl) {
      score += 20;
    }
    return score;
  }, [data]);

  // Update root fields
  const updateField = <K extends keyof SportsCVData>(field: K, value: SportsCVData[K]) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      saveSportsCVData(next);
      return next;
    });
  };

  // Update social profile nested fields
  const updateSocialField = <K extends keyof SocialProfiles>(
    field: K,
    value: SocialProfiles[K],
  ) => {
    setData((prev) => {
      const nextSocials = {
        ...(prev.socialProfiles || {}),
        [field]: value,
      };
      const next = {
        ...prev,
        socialProfiles: nextSocials,
        // Sync highlight video URL if youtube changes
        highlightVideoUrl: field === "youtube" && value ? value : prev.highlightVideoUrl,
      };
      saveSportsCVData(next);
      return next;
    });
  };

  // Handle Sport Change: automatically update suggested position and metrics presets
  const handleSportChange = (newSport: SportType) => {
    const presets = SPORT_POSITION_PRESETS[newSport] || [];
    const defaultPosition = presets[0] || "Competitor";
    const metricPresets = COMMON_METRIC_PRESETS[newSport] || COMMON_METRIC_PRESETS.Other;

    const formattedMetrics: PerformanceMetric[] = metricPresets.slice(0, 4).map((p, idx) => ({
      id: `met-preset-${newSport.toLowerCase()}-${idx + 1}-${Date.now()}`,
      name: p.name,
      value: p.value,
      unit: p.unit,
      category: p.category,
      score: p.score ?? 85,
      benchmark: p.benchmark,
    }));

    setData((prev) => {
      const next = {
        ...prev,
        sport: newSport,
        position: defaultPosition,
        performanceMetrics: formattedMetrics,
      };
      saveSportsCVData(next);
      return next;
    });

    toast.info(`Updated position & benchmark presets for ${newSport}`);
  };

  // Load sample metrics for current sport
  const handleReloadSportMetrics = () => {
    const metricPresets = COMMON_METRIC_PRESETS[data.sport] || COMMON_METRIC_PRESETS.Other;
    const formatted: PerformanceMetric[] = metricPresets.map((p, idx) => ({
      id: `met-preset-${data.sport.toLowerCase()}-${idx + 1}-${Date.now()}`,
      name: p.name,
      value: p.value,
      unit: p.unit,
      category: p.category,
      score: p.score ?? 85,
      benchmark: p.benchmark,
    }));
    updateField("performanceMetrics", formatted);
    toast.success(`Loaded verified benchmark metrics for ${data.sport}`);
  };

  // Add Achievement
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achDraft.title.trim() || !achDraft.competition.trim()) {
      toast.error("Please enter both the achievement title and competition name.");
      return;
    }

    const newAch: AthleticAchievement = {
      id: `ach-${Date.now()}`,
      title: achDraft.title.trim(),
      competition: achDraft.competition.trim(),
      year: achDraft.year,
      level: achDraft.level,
      award: achDraft.award,
      description: achDraft.description.trim(),
      verified: true,
    };

    const updated = [newAch, ...data.achievements];
    updateField("achievements", updated);
    setAchDraft({
      title: "",
      competition: "",
      year: new Date().getFullYear(),
      level: "State",
      award: "Gold / 1st Place",
      description: "",
    });
    toast.success("Added achievement honours!");
  };

  // Remove Achievement
  const handleRemoveAchievement = (id: string) => {
    const updated = data.achievements.filter((a) => a.id !== id);
    updateField("achievements", updated);
    toast.info("Removed achievement.");
  };

  // Add Metric
  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricDraft.name.trim() || !metricDraft.value.trim()) {
      toast.error("Please specify a metric name and score value.");
      return;
    }

    const newMet: PerformanceMetric = {
      id: `met-${Date.now()}`,
      name: metricDraft.name.trim(),
      value: metricDraft.value.trim(),
      unit: metricDraft.unit.trim() || "pts",
      category: metricDraft.category,
      score: Math.min(100, Math.max(1, Number(metricDraft.score) || 80)),
      benchmark: metricDraft.benchmark.trim() || undefined,
    };

    const updated = [...data.performanceMetrics, newMet];
    updateField("performanceMetrics", updated);
    setMetricDraft({
      name: "",
      value: "",
      unit: "",
      category: "Speed",
      score: 85,
      benchmark: "",
    });
    toast.success("Added performance benchmark!");
  };

  // Remove Metric
  const handleRemoveMetric = (id: string) => {
    const updated = data.performanceMetrics.filter((m) => m.id !== id);
    updateField("performanceMetrics", updated);
    toast.info("Removed metric.");
  };

  // Metric value changer
  const handleMetricValueChange = (id: string, value: string, score: number) => {
    const updated = data.performanceMetrics.map((m) => (m.id === id ? { ...m, value, score } : m));
    updateField("performanceMetrics", updated);
  };

  // Download Card
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadSportsCardAsPNG(data);
      toast.success("Downloaded your official Scout Card (PNG)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image.");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Profile Link
  const handleCopyLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/profile?id=${data.athleteId}`
        : `https://khelgrid.com/profile/${data.athleteId}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Shareable Sports CV link copied!");
    }
  };

  // Final Complete Handler
  const handleFinish = () => {
    saveSportsCVData(data);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    }

    // Sync to user profile service as well
    try {
      updateUserProfile({
        fullName: data.athleteName,
        primarySport: data.sport,
        city: data.city,
        playingPosition: data.position,
        bio: data.bio,
      });
    } catch {
      // ignore
    }

    // Dispatch event so other components immediately react
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("khelgrid_sportscv_updated", { detail: data }));
    }

    toast.success("🎉 Sports CV and Social Profiles successfully configured!");

    if (onComplete) {
      onComplete(data);
    } else {
      navigate({ to: "/profile" });
    }
  };

  // Next / Prev step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      if (!data.athleteName.trim()) {
        toast.error("Please enter your athlete name.");
        return;
      }
    }
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Helper to format handle
  const cleanInstagramInput = (val: string) => {
    let clean = val.trim();
    if (clean.includes("instagram.com/")) {
      const parts = clean.split("instagram.com/")[1].split("/")[0].split("?")[0];
      clean = "@" + parts;
    } else if (clean && !clean.startsWith("@") && !clean.startsWith("http")) {
      clean = "@" + clean;
    }
    updateSocialField("instagram", clean);
  };

  const cleanTwitterInput = (val: string) => {
    let clean = val.trim();
    if (clean.includes("x.com/") || clean.includes("twitter.com/")) {
      const parts = clean
        .split(/(?:x|twitter)\.com\//)[1]
        .split("/")[0]
        .split("?")[0];
      clean = "@" + parts;
    } else if (clean && !clean.startsWith("@") && !clean.startsWith("http")) {
      clean = "@" + clean;
    }
    updateSocialField("twitter", clean);
  };

  const youtubeEmbedUrl = useMemo(() => {
    return getYouTubeEmbedUrl(data.socialProfiles?.youtube || data.highlightVideoUrl);
  }, [data.socialProfiles?.youtube, data.highlightVideoUrl]);

  return (
    <div
      id="athlete-onboarding-wizard"
      className="mx-auto max-w-7xl px-4 py-6 sm:py-10 text-foreground"
    >
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Athlete Onboarding Wizard · KhelGrid Scout Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Build Your Scout-Ready Sports CV & Connect Socials
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Showcase verified performance benchmarks, tournament honours, and direct social match
              footage to talent scouts, club directors, and trial academies across India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const sample = getDefaultSportsCV("Aarav Sharma");
                setData(sample);
                saveSportsCVData(sample);
                toast.success("Loaded verified athlete sample data.");
              }}
              className="text-xs"
            >
              Load Sample Data
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar & Stepper Tabs */}
        <div className="mt-6 border-t border-border/60 pt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
            <span className="font-semibold text-foreground">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
            </span>
            <span className="font-mono font-medium text-primary">
              {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}% Completed
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-300 ease-out"
              style={{
                width: `${Math.max(10, Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100))}%`,
              }}
            />
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {STEPS.map((s) => {
              const isActive = s.id === currentStep;
              const isPast = s.id < currentStep;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isPast
                        ? "bg-secondary text-foreground hover:bg-secondary/80"
                        : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-primary-foreground text-primary"
                        : isPast
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {isPast ? <Check className="h-2.5 w-2.5" /> : s.id}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Area: 2-Column Split on Desktop */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form Step Wizard (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* STEP 1: ATHLETE IDENTITY */}
          {currentStep === 1 && (
            <div
              id="wizard-step-1"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Step 1: Athlete Identity & Sport
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter your core athlete details as you want them recognized by clubs and scouting
                  scouts.
                </p>
              </div>

              {/* Sport Selector Carousel / Grid */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Primary Sport *
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SPORTS_LIST.map((sp) => {
                    const isSelected = data.sport === sp.name;
                    return (
                      <button
                        key={sp.name}
                        type="button"
                        onClick={() => handleSportChange(sp.name)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-sm"
                            : "border-border/70 bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-2xl">{sp.icon}</span>
                        <span className="text-xs font-bold">{sp.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Athlete Full Name & Jersey Number */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="wiz-name" className="text-xs font-semibold">
                    Athlete Full Name *
                  </Label>
                  <Input
                    id="wiz-name"
                    value={data.athleteName}
                    onChange={(e) => updateField("athleteName", e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="h-10 text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wiz-jersey" className="text-xs font-semibold">
                    Jersey Number
                  </Label>
                  <Input
                    id="wiz-jersey"
                    value={data.jerseyNumber || ""}
                    onChange={(e) => updateField("jerseyNumber", e.target.value)}
                    placeholder="e.g. #18 or #10"
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Age Category & Gender */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="wiz-age-category" className="text-xs font-semibold">
                    Competition Age Category *
                  </Label>
                  <Select
                    value={data.ageCategory}
                    onValueChange={(val) => updateField("ageCategory", val)}
                  >
                    <SelectTrigger id="wiz-age-category" className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select Age Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wiz-age-val" className="text-xs font-semibold">
                    Current Age (Years)
                  </Label>
                  <Input
                    id="wiz-age-val"
                    type="number"
                    min={10}
                    max={60}
                    value={data.age || 18}
                    onChange={(e) => updateField("age", Number(e.target.value))}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Dominant Side & Physical Attributes */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wiz-dominant" className="text-xs font-semibold">
                    Dominant Hand / Foot
                  </Label>
                  <Select
                    value={data.dominantSide}
                    onValueChange={(val: "Right" | "Left" | "Ambidextrous") =>
                      updateField("dominantSide", val)
                    }
                  >
                    <SelectTrigger id="wiz-dominant" className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select Dominant Side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Right">Right-Hand / Foot</SelectItem>
                      <SelectItem value="Left">Left-Hand / Foot</SelectItem>
                      <SelectItem value="Ambidextrous">Ambidextrous / Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wiz-height" className="text-xs font-semibold">
                    Height (cm or ft)
                  </Label>
                  <Input
                    id="wiz-height"
                    value={data.height || ""}
                    onChange={(e) => updateField("height", e.target.value)}
                    placeholder="e.g. 182 cm (6ft 0in)"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wiz-weight" className="text-xs font-semibold">
                    Weight (kg)
                  </Label>
                  <Input
                    id="wiz-weight"
                    value={data.weight || ""}
                    onChange={(e) => updateField("weight", e.target.value)}
                    placeholder="e.g. 74 kg"
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* City & State with Quick Selection */}
              <div className="space-y-2">
                <Label htmlFor="wiz-city" className="text-xs font-semibold">
                  Location (City & State) *
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    id="wiz-city"
                    value={data.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="h-10 text-sm"
                  />
                  <Input
                    id="wiz-state"
                    value={data.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="e.g. Delhi NCR"
                    className="h-10 text-sm"
                  />
                </div>

                {/* Popular athletic city quick chips */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="text-[11px] font-medium">Quick Select:</span>
                  {POPULAR_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        const [c, s] = city.split(", ");
                        updateField("city", c);
                        updateField("state", s);
                      }}
                      className="rounded-md border border-border/70 px-2 py-0.5 text-[11px] hover:bg-secondary transition-colors"
                    >
                      {city.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ATHLETIC ROLE & SPECIALIZATION */}
          {currentStep === 2 && (
            <div
              id="wizard-step-2"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Step 2: Athletic Role & Affiliation
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specify your exact on-field position, playing style, and academy training
                  background.
                </p>
              </div>

              {/* Position selector with sport-specific recommendations */}
              <div className="space-y-2">
                <Label htmlFor="wiz-pos" className="text-xs font-semibold">
                  Primary Playing Position *
                </Label>
                <Input
                  id="wiz-pos"
                  value={data.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  placeholder="e.g. Right-Arm Fast Bowler"
                  className="h-10 text-sm font-medium"
                />

                {/* Suggested position chips */}
                {SPORT_POSITION_PRESETS[data.sport] && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Common {data.sport} Positions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SPORT_POSITION_PRESETS[data.sport].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateField("position", pos)}
                          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                            data.position === pos
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Position */}
              <div className="space-y-1.5">
                <Label htmlFor="wiz-sec-pos" className="text-xs font-semibold">
                  Secondary Role / Versatility (Optional)
                </Label>
                <Input
                  id="wiz-sec-pos"
                  value={data.secondaryPosition || ""}
                  onChange={(e) => updateField("secondaryPosition", e.target.value)}
                  placeholder="e.g. Middle-Order Finisher or Wing-Back"
                  className="h-10 text-sm"
                />
              </div>

              {/* Current Academy & Availability */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="wiz-academy" className="text-xs font-semibold">
                    Current Training Academy / Club
                  </Label>
                  <Input
                    id="wiz-academy"
                    value={data.currentAcademy || ""}
                    onChange={(e) => updateField("currentAcademy", e.target.value)}
                    placeholder="e.g. National Sports Excellence Academy"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wiz-avail" className="text-xs font-semibold">
                    Current Availability Status
                  </Label>
                  <Select
                    value={data.availability}
                    onValueChange={(val: SportsCVData["availability"]) =>
                      updateField("availability", val)
                    }
                  >
                    <SelectTrigger id="wiz-avail" className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open for Trials">🟢 Open for Trials</SelectItem>
                      <SelectItem value="Free Agent">🔵 Free Agent (Unattached)</SelectItem>
                      <SelectItem value="Academy Trainee">🟡 Academy Trainee</SelectItem>
                      <SelectItem value="Club Contracted">🔴 Club Contracted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Athlete Bio / Elevator Pitch */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wiz-bio" className="text-xs font-semibold">
                    Scout Elevator Pitch / Athlete Bio
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleBio = `Dedicated ${data.sport.toLowerCase()} athlete specializing in ${data.position.toLowerCase()}. Known for explosive match temperament, consistent tactical discipline, and relentless physical conditioning. Actively seeking state and academy competitive trial slots.`;
                      updateField("bio", sampleBio);
                      toast.info("Generated athletic pitch statement.");
                    }}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Generate Athletic Bio
                  </button>
                </div>
                <Textarea
                  id="wiz-bio"
                  rows={3}
                  value={data.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Summarize your strengths, playing style, key attributes, and goals..."
                  className="text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Coach Reference */}
              <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Verified Coach or Academy Reference (Optional)
                  </span>
                  <span className="text-[11px] text-muted-foreground">Scout Verification</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={data.coachReference?.name || ""}
                    onChange={(e) =>
                      updateField("coachReference", {
                        name: e.target.value,
                        designation: data.coachReference?.designation || "Head Coach",
                        phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                      })
                    }
                    placeholder="Coach Name (e.g. Coach Negi)"
                    className="h-9 text-xs"
                  />
                  <Input
                    value={data.coachReference?.designation || ""}
                    onChange={(e) =>
                      updateField("coachReference", {
                        name: data.coachReference?.name || "Head Coach",
                        designation: e.target.value,
                        phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                      })
                    }
                    placeholder="Designation / Club (e.g. NSEA Coach)"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BENCHMARKS & TESTED STATS */}
          {currentStep === 3 && (
            <div
              id="wizard-step-3"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-foreground">
                      Step 3: Performance Benchmarks & Tested Metrics
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Speed, endurance, and sport-specific physical telemetry reviewed by scouts.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReloadSportMetrics}
                  className="text-xs gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Load {data.sport} Presets
                </Button>
              </div>

              {/* Metric List */}
              <div className="space-y-3">
                {data.performanceMetrics.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                    No performance metrics recorded yet. Click "Load {data.sport} Presets" or add
                    custom metrics below.
                  </div>
                ) : (
                  data.performanceMetrics.map((met) => (
                    <div
                      key={met.id}
                      className="rounded-xl border border-border/80 bg-secondary/20 p-3.5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-foreground">
                              {met.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ({met.category})
                            </span>
                          </div>
                          {met.benchmark && (
                            <div className="text-[11px] text-muted-foreground">{met.benchmark}</div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Input
                              value={met.value}
                              onChange={(e) =>
                                handleMetricValueChange(met.id, e.target.value, met.score ?? 85)
                              }
                              className="h-8 w-20 text-xs font-mono font-bold text-right"
                            />
                            <span className="text-xs font-medium text-muted-foreground w-10">
                              {met.unit}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMetric(met.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Score Rating Bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground w-14 shrink-0">
                          Percentile:
                        </span>
                        <input
                          type="range"
                          min={20}
                          max={99}
                          value={met.score ?? 85}
                          onChange={(e) =>
                            handleMetricValueChange(
                              met.id,
                              String(met.value),
                              Number(e.target.value),
                            )
                          }
                          className="h-1.5 flex-1 cursor-pointer accent-primary"
                        />
                        <span className="font-mono text-xs font-bold text-primary w-8 text-right">
                          {met.score ?? 85}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Custom Metric Form */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-primary" /> Add Custom Metric
                </span>
                <div className="grid gap-2 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <Input
                      value={metricDraft.name}
                      onChange={(e) => setMetricDraft({ ...metricDraft, name: e.target.value })}
                      placeholder="Metric Name (e.g. Shuttle Run)"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      value={metricDraft.value}
                      onChange={(e) => setMetricDraft({ ...metricDraft, value: e.target.value })}
                      placeholder="Value (e.g. 9.4)"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Input
                      value={metricDraft.unit}
                      onChange={(e) => setMetricDraft({ ...metricDraft, unit: e.target.value })}
                      placeholder="Unit (e.g. s, km/h)"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddMetric}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Append Metric
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HONOURS & TOURNAMENT ACHIEVEMENTS */}
          {currentStep === 4 && (
            <div
              id="wizard-step-4"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-foreground">
                    Step 4: Honours, Medals & Tournament Record
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Document your competitive track record, state trials, and tournament awards.
                </p>
              </div>

              {/* Achievement List */}
              <div className="space-y-3">
                {data.achievements.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                    No achievements registered yet. Add your tournament honours below.
                  </div>
                ) : (
                  data.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/80 bg-secondary/20 p-3.5"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-foreground">
                            {ach.title}
                          </span>
                          <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold">
                            {ach.level}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground font-semibold">
                            {ach.year}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {ach.award} · {ach.competition}
                        </div>
                        {ach.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {ach.description}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAchievement(ach.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add Achievement Form */}
              <form
                onSubmit={handleAddAchievement}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-3"
              >
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-primary" /> Add New Honour / Medal
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Title / Accomplishment *</Label>
                    <Input
                      value={achDraft.title}
                      onChange={(e) => setAchDraft({ ...achDraft, title: e.target.value })}
                      placeholder="e.g. State Championship Gold Medalist"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Tournament / Competition *</Label>
                    <Input
                      value={achDraft.competition}
                      onChange={(e) => setAchDraft({ ...achDraft, competition: e.target.value })}
                      placeholder="e.g. Delhi State Youth Athletics Meet 2025"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Competition Level</Label>
                    <Select
                      value={achDraft.level}
                      onValueChange={(val: AchievementLevel) =>
                        setAchDraft({ ...achDraft, level: val })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACHIEVEMENT_LEVELS.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Award / Standing</Label>
                    <Select
                      value={achDraft.award}
                      onValueChange={(val: AwardType) => setAchDraft({ ...achDraft, award: val })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Award" />
                      </SelectTrigger>
                      <SelectContent>
                        {AWARD_TYPES.map((aw) => (
                          <SelectItem key={aw} value={aw}>
                            {aw}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-xs">Description / Key Match Highlights (Optional)</Label>
                    <Input
                      value={achDraft.description}
                      onChange={(e) => setAchDraft({ ...achDraft, description: e.target.value })}
                      placeholder="e.g. Scored 348 runs and 11 wickets; awarded Player of Tournament..."
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button type="submit" size="sm" className="h-8 gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Achievement
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: SOCIAL MEDIA PROFILES & HIGHLIGHT REELS */}
          {currentStep === 5 && (
            <div
              id="wizard-step-5"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Step 5: Connect Social Profiles & Match Footage
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Scouts and recruitment agents require video proof and active social handles to
                  evaluate form.
                </p>
              </div>

              {/* Instagram Connection */}
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        Instagram Athlete Handle
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Training drills, fitness stories & match photos
                      </div>
                    </div>
                  </div>
                  {data.socialProfiles?.instagram && (
                    <span className="rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 px-2 py-0.5 text-[10px] font-bold">
                      Connected
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={data.socialProfiles?.instagram || ""}
                    onChange={(e) => cleanInstagramInput(e.target.value)}
                    placeholder="e.g. @aarav.cricket or https://instagram.com/..."
                    className="h-10 text-xs sm:text-sm font-medium"
                  />
                  {data.socialProfiles?.instagram && (
                    <a
                      href={
                        data.socialProfiles.instagram.startsWith("http")
                          ? data.socialProfiles.instagram
                          : `https://instagram.com/${data.socialProfiles.instagram.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold hover:bg-secondary shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Test Link</span>
                    </a>
                  )}
                </div>
              </div>

              {/* YouTube / Highlight Reel Video Embed */}
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        Skills Highlight Reel / Match Footage *
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        YouTube video, shorts, or recruitment reel
                      </div>
                    </div>
                  </div>
                  {data.highlightVideoUrl && (
                    <span className="rounded bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 text-[10px] font-bold">
                      Reel Linked
                    </span>
                  )}
                </div>

                <Input
                  value={data.socialProfiles?.youtube || data.highlightVideoUrl || ""}
                  onChange={(e) => updateSocialField("youtube", e.target.value)}
                  placeholder="e.g. https://youtu.be/sample-reel or https://www.youtube.com/watch?v=..."
                  className="h-10 text-xs sm:text-sm font-medium"
                />

                {/* Instant Video Player Embed Preview */}
                {youtubeEmbedUrl ? (
                  <div className="overflow-hidden rounded-xl border border-border/80 bg-black aspect-video mt-2">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Skills Highlight Reel Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/80 p-3 text-center text-[11px] text-muted-foreground">
                    Paste a YouTube match clip or training reel URL above for instant video preview.
                  </div>
                )}
              </div>

              {/* Twitter / 𝕏 Connection */}
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 font-bold text-xs">
                      𝕏
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Twitter / 𝕏 Handle</div>
                      <div className="text-[11px] text-muted-foreground">
                        Official announcements & athlete updates
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  value={data.socialProfiles?.twitter || ""}
                  onChange={(e) => cleanTwitterInput(e.target.value)}
                  placeholder="e.g. @aarav_pace"
                  className="h-10 text-xs sm:text-sm font-medium"
                />
              </div>

              {/* Sports Specific Profiles (CricHeroes / Strava / Playo) */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  India Sports Ecosystem Profiles
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-amber-500" /> CricHeroes Profile Link
                    </Label>
                    <Input
                      value={data.socialProfiles?.cricheroes || ""}
                      onChange={(e) => updateSocialField("cricheroes", e.target.value)}
                      placeholder="https://cricheroes.com/player-profile/..."
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-orange-500" /> Strava Athlete URL
                    </Label>
                    <Input
                      value={data.socialProfiles?.strava || ""}
                      onChange={(e) => updateSocialField("strava", e.target.value)}
                      placeholder="https://www.strava.com/athletes/..."
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-emerald-500" /> Playo Community / Turf
                      Profile
                    </Label>
                    <Input
                      value={data.socialProfiles?.playo || ""}
                      onChange={(e) => updateSocialField("playo", e.target.value)}
                      placeholder="e.g. https://playo.co/profile/..."
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: THEME SELECTION & FINAL SCOUT CARD */}
          {currentStep === 6 && (
            <div
              id="wizard-step-6"
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-foreground">
                    Step 6: Choose Theme & Finalize Scout Card
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a digital badge theme and verify your complete athlete profile.
                </p>
              </div>

              {/* Theme Picker Swatches */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Card Theme
                </Label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {CARD_THEMES.map((thm) => {
                    const isSelected = data.theme === thm.id;
                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => updateField("theme", thm.id)}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? `border-primary bg-primary/10 shadow-sm ring-1 ring-primary`
                            : "border-border/70 bg-card hover:bg-secondary/40"
                        }`}
                      >
                        <span
                          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${thm.borderClass} ${thm.colorClass}`}
                        />
                        <div>
                          <div className="text-xs font-bold text-foreground">{thm.name}</div>
                          <div className="text-[11px] text-muted-foreground">{thm.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Completion Checklist Summary */}
              <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2.5 text-xs">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Profile Readiness Summary:</span>
                  <span className="font-mono text-primary font-bold">
                    {completionPercentage}% Ready
                  </span>
                </div>
                <div className="grid gap-1.5 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${data.athleteName ? "text-emerald-500" : "text-muted"}`}
                    />
                    <span>
                      Athlete: <strong>{data.athleteName}</strong> ({data.sport} · {data.position})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${data.performanceMetrics.length > 0 ? "text-emerald-500" : "text-muted"}`}
                    />
                    <span>
                      Performance Metrics: <strong>{data.performanceMetrics.length} tested</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${data.achievements.length > 0 ? "text-emerald-500" : "text-muted"}`}
                    />
                    <span>
                      Tournament Honours: <strong>{data.achievements.length} recorded</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${data.socialProfiles?.instagram || data.highlightVideoUrl ? "text-emerald-500" : "text-muted"}`}
                    />
                    <span>
                      Connected Socials:{" "}
                      <strong>
                        {data.socialProfiles?.instagram || "No Instagram"} ·{" "}
                        {data.highlightVideoUrl ? "Highlight Reel Active" : "No Reel"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Download & Copy */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="gap-1.5 text-xs h-9"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>Download Card PNG</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="gap-1.5 text-xs h-9"
                >
                  <Copy className="h-3.5 w-3.5 text-primary" />
                  <span>Copy Profile Link</span>
                </Button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            {/* Mobile preview toggle */}
            <div className="lg:hidden">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="text-xs gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                {showMobilePreview ? "Hide Preview" : "View Card"}
              </Button>
            </div>

            {currentStep < 6 ? (
              <Button type="button" onClick={nextStep} className="gap-1 text-xs font-semibold">
                Save & Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow hover:opacity-90"
              >
                <Check className="h-4 w-4" /> Save & Launch Sports CV
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Scout Card Preview (5 cols) */}
        <div
          className={`space-y-4 lg:col-span-5 ${showMobilePreview ? "block" : "hidden lg:block"}`}
        >
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Scout Card Preview
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Theme: {data.theme.toUpperCase()}
              </span>
            </div>

            {/* Live SportsCVCard Instance */}
            <div className="transform transition-all">
              <SportsCVCard data={data} />
            </div>

            {/* Card quick helper tips */}
            <div className="rounded-xl border border-border/60 bg-card p-3 text-[11px] text-muted-foreground leading-relaxed">
              💡 <strong>Scout Insight:</strong> Indian sports scouts prioritize verified 40m sprint
              / Yo-Yo benchmarks and high-definition video reels. Connect your Instagram training
              handles so directors can review your recent match form.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
