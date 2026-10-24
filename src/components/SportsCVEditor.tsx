import { useState, useEffect } from "react";
import type {
  SportsCVData,
  AthleticAchievement,
  PerformanceMetric,
  PositionHistoryEntry,
  CareerStatSeason,
  CareerSummaryStats,
  SportType,
  AchievementLevel,
  AwardType,
  MetricCategory,
} from "@/types/sports-cv";
import {
  SPORT_POSITION_PRESETS,
  COMMON_METRIC_PRESETS,
  SPORT_STAT_TEMPLATES,
} from "@/types/sports-cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Zap,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  User,
  Medal,
  RefreshCw,
  BarChart3,
  Layers,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { getSportsCVLanguage } from "@/lib/sports-cv-i18n";

interface SportsCVEditorProps {
  data: SportsCVData;
  onChange: (updated: SportsCVData) => void;
}

const SPORTS_LIST: SportType[] = [
  "Cricket",
  "Football",
  "Basketball",
  "Badminton",
  "Athletics",
  "Tennis",
  "Kabaddi",
  "Swimming",
  "Hockey",
  "Other",
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

const EDITOR_HINDI: Record<string, string> = {
  City: "शहर",
  Height: "लंबाई",
  Weight: "वज़न",
  "Right-Handed / Right-Footed": "दाएँ हाथ / पैर से खेलने वाला",
  "Left-Handed / Left-Footed": "बाएँ हाथ / पैर से खेलने वाला",
  Ambidextrous: "दोनों हाथों से खेलने वाला",
  "Dominant Side": "प्रमुख हाथ / पैर",
  Availability: "उपलब्धता",
  Level: "स्तर",
  Category: "श्रेणी",
  "Select level": "स्तर चुनें",
  "Select award": "पुरस्कार चुनें",
  "Gold / 1st Place": "स्वर्ण / प्रथम स्थान",
  "Silver / 2nd Place": "रजत / द्वितीय स्थान",
  "Bronze / 3rd Place": "कांस्य / तृतीय स्थान",
  "MVP / Best Player": "सर्वश्रेष्ठ खिलाड़ी",
  "Best Bowler": "सर्वश्रेष्ठ गेंदबाज़",
  "Best Batsman": "सर्वश्रेष्ठ बल्लेबाज़",
  "Top Scorer": "सर्वाधिक स्कोर",
  "State Selection": "राज्य टीम में चयन",
  Finalist: "फाइनलिस्ट",
  "Certificate of Merit": "योग्यता प्रमाणपत्र",
  School: "स्कूल",
  Club: "क्लब",
  District: "ज़िला",
  State: "राज्य",
  National: "राष्ट्रीय",
  International: "अंतरराष्ट्रीय",
  Speed: "गति",
  Endurance: "सहनशक्ति",
  Power: "शक्ति",
  Athleticism: "शारीरिक क्षमता",
  "Sport-Specific": "खेल-विशिष्ट",
  "Twitter / 𝕏 Handle or Link": "Twitter / 𝕏 नाम या लिंक",
  "CricHeroes Profile (for Cricket)": "CricHeroes प्रोफ़ाइल (क्रिकेट के लिए)",
  "Strava Profile (for Athletics/Running)": "Strava प्रोफ़ाइल (एथलेटिक्स / दौड़ के लिए)",
  "Please enter the team/squad name and position.": "कृपया टीम का नाम और पोज़िशन दर्ज करें।",
  "Position and squad history logged!": "पोज़िशन और टीम का इतिहास जोड़ दिया गया।",
  "Position history entry removed.": "पोज़िशन इतिहास हटाया गया।",
  "Please enter the tournament or competition name.":
    "कृपया टूर्नामेंट या प्रतियोगिता का नाम दर्ज करें।",
  "Season stats recorded!": "सीज़न के आँकड़े दर्ज किए गए।",
  "Season stat entry removed.": "सीज़न के आँकड़े हटाए गए।",
  "Please enter achievement title and competition name.":
    "कृपया उपलब्धि और प्रतियोगिता का नाम दर्ज करें।",
  "Athletic achievement added to your profile card!": "खेल उपलब्धि प्रोफ़ाइल कार्ड में जोड़ दी गई।",
  "Achievement removed.": "उपलब्धि हटाई गई।",
  "Please enter metric test name and score value.": "कृपया प्रदर्शन परीक्षण और परिणाम दर्ज करें।",
  "Performance metric added to your profile card!":
    "प्रदर्शन माप प्रोफ़ाइल कार्ड में जोड़ दिया गया।",
  "Metric removed.": "प्रदर्शन माप हटाया गया।",
  "Configured career stat benchmarks for": "खेल के करियर आँकड़ों के मानक सेट किए गए।",
  "Applied recommended": "अनुशंसित प्रदर्शन मानक लागू किए गए।",
  "Position & Athlete Credentials": "खिलाड़ी की जानकारी और प्रमाण-पत्र",
  "Full Athlete Name": "खिलाड़ी का पूरा नाम",
  "Primary Sport": "मुख्य खेल",
  "Select sport": "खेल चुनें",
  "Primary Playing Position / Role": "मुख्य पोज़िशन / भूमिका",
  "Secondary Role / Speciality (Optional)": "दूसरी भूमिका / विशेषता (वैकल्पिक)",
  "Jersey / Squad Number": "जर्सी / टीम नंबर",
  "Age Band / Category": "आयु वर्ग",
  "Select age band": "आयु वर्ग चुनें",
  "Current Academy, Club or School": "वर्तमान अकादमी, क्लब या स्कूल",
  "State / Region": "राज्य / क्षेत्र",
  "Dominant Side": "प्रमुख हाथ / पैर",
  "Scout Availability": "ट्रायल के लिए उपलब्धता",
  "Open for Trials": "ट्रायल के लिए उपलब्ध",
  "Free Agent": "किसी क्लब से अनुबंधित नहीं",
  "Club Contracted": "क्लब से अनुबंधित",
  "Academy Trainee": "अकादमी प्रशिक्षु",
  "Scout Bio & Playing Style Summary": "खिलाड़ी का परिचय और खेलने की शैली",
  "Career Stats & Match Records": "करियर आँकड़े और मैच रिकॉर्ड",
  "Position & Squad History": "पोज़िशन और टीम का इतिहास",
  "Athletic Performance Metrics": "खेल प्रदर्शन के माप",
  "Athletic Achievements & Honours": "खेल उपलब्धियाँ और सम्मान",
  "Coach Reference & Media": "कोच का संदर्भ और मीडिया",
  "Coach Reference Name": "कोच का नाम",
  "Coach Title / Academy": "कोच का पद / अकादमी",
  "Skills Highlight Reel Link": "खेल कौशल वीडियो का लिंक",
  "Connected Socials & Athletic Profiles": "सोशल मीडिया और खेल प्रोफ़ाइल",
  "Instagram Handle or Link": "Instagram नाम या लिंक",
  "KhelGrid Profile / Community ID": "KhelGrid प्रोफ़ाइल / कम्युनिटी ID",
  "Please enter the team/squad name and position.": "कृपया टीम का नाम और पोज़िशन दर्ज करें।",
  "Position and squad history logged!": "पोज़िशन और टीम का इतिहास जोड़ दिया गया।",
  "Position history entry removed.": "पोज़िशन इतिहास हटाया गया।",
  "Please enter the tournament or competition name.":
    "कृपया टूर्नामेंट या प्रतियोगिता का नाम दर्ज करें।",
  "Season stats recorded!": "सीज़न के आँकड़े दर्ज किए गए।",
  "Season stat entry removed.": "सीज़न के आँकड़े हटाए गए।",
  "Please enter achievement title and competition name.":
    "कृपया उपलब्धि और प्रतियोगिता का नाम दर्ज करें।",
  "Athletic achievement added to your profile card!": "खेल उपलब्धि प्रोफ़ाइल कार्ड में जोड़ दी गई।",
  "Achievement removed.": "उपलब्धि हटाई गई।",
  "Please enter metric test name and score value.": "कृपया प्रदर्शन परीक्षण और परिणाम दर्ज करें।",
  "Performance metric added to your profile card!":
    "प्रदर्शन माप प्रोफ़ाइल कार्ड में जोड़ दिया गया।",
  "Metric removed.": "प्रदर्शन माप हटाया गया।",
};

export function SportsCVEditor({ data, onChange }: SportsCVEditorProps) {
  const language = getSportsCVLanguage();
  const localize = (value: string) => (language === "hi" ? (EDITOR_HINDI[value] ?? value) : value);
  // New Achievement form state
  const [newAchTitle, setNewAchTitle] = useState("");
  const [newAchCompetition, setNewAchCompetition] = useState("");
  const [newAchYear, setNewAchYear] = useState<number>(new Date().getFullYear());
  const [newAchLevel, setNewAchLevel] = useState<AchievementLevel>("State");
  const [newAchAward, setNewAchAward] = useState<AwardType>("Gold / 1st Place");
  const [newAchDesc, setNewAchDesc] = useState("");

  // Position History form state
  const [newPosPeriod, setNewPosPeriod] = useState("2024 - Present");
  const [newPosTeam, setNewPosTeam] = useState("");
  const [newPosPosition, setNewPosPosition] = useState(data.position || "");
  const [newPosSecondary, setNewPosSecondary] = useState(data.secondaryPosition || "");
  const [newPosLevel, setNewPosLevel] = useState<AchievementLevel>("State");
  const [newPosIsCurrent, setNewPosIsCurrent] = useState(true);
  const [newPosAppearances, setNewPosAppearances] = useState<number | "">(18);
  const [newPosNotes, setNewPosNotes] = useState("");

  // Career Stats form state
  const statTemplate = SPORT_STAT_TEMPLATES[data.sport] || SPORT_STAT_TEMPLATES.Cricket;
  const [newSeasonName, setNewSeasonName] = useState("2024-25");
  const [newSeasonTournament, setNewSeasonTournament] = useState("");
  const [newSeasonMatches, setNewSeasonMatches] = useState<number | "">(12);
  const [newSeasonStat1Label, setNewSeasonStat1Label] = useState(statTemplate.stat1Label);
  const [newSeasonStat1Val, setNewSeasonStat1Val] = useState("");
  const [newSeasonStat2Label, setNewSeasonStat2Label] = useState(statTemplate.stat2Label);
  const [newSeasonStat2Val, setNewSeasonStat2Val] = useState("");
  const [newSeasonStat3Label, setNewSeasonStat3Label] = useState(statTemplate.stat3Label);
  const [newSeasonStat3Val, setNewSeasonStat3Val] = useState("");
  const [newSeasonHighlight, setNewSeasonHighlight] = useState("");

  // Keep stat labels in sync when sport changes
  useEffect(() => {
    const tmpl = SPORT_STAT_TEMPLATES[data.sport] || SPORT_STAT_TEMPLATES.Cricket;
    setNewSeasonStat1Label(tmpl.stat1Label);
    setNewSeasonStat2Label(tmpl.stat2Label);
    setNewSeasonStat3Label(tmpl.stat3Label);
  }, [data.sport]);

  // New Metric form state
  const [newMetName, setNewMetName] = useState("");
  const [newMetValue, setNewMetValue] = useState("");
  const [newMetUnit, setNewMetUnit] = useState("");
  const [newMetCategory, setNewMetCategory] = useState<MetricCategory>("Speed");
  const [newMetScore, setNewMetScore] = useState<number>(85);
  const [newMetBenchmark, setNewMetBenchmark] = useState("");

  // Helper updater
  const updateField = <K extends keyof SportsCVData>(field: K, value: SportsCVData[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Add Position History Entry
  const handleAddPositionHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosTeam.trim() || !newPosPosition.trim()) {
      toast.error(localize("Please enter the team/squad name and position."));
      return;
    }

    const newPos: PositionHistoryEntry = {
      id: `pos-${Date.now()}`,
      period: newPosPeriod.trim() || `${new Date().getFullYear()} - Present`,
      team: newPosTeam.trim(),
      position: newPosPosition.trim(),
      secondaryPosition: newPosSecondary.trim() || undefined,
      level: newPosLevel,
      isCurrent: Boolean(newPosIsCurrent),
      appearances: typeof newPosAppearances === "number" ? newPosAppearances : undefined,
      notes: newPosNotes.trim() || undefined,
    };

    const currentHistory = data.positionHistory || [];
    onChange({
      ...data,
      positionHistory: [newPos, ...currentHistory],
    });

    setNewPosTeam("");
    setNewPosNotes("");
    toast.success(localize("Position and squad history logged!"));
  };

  const handleRemovePositionHistory = (id: string) => {
    const updated = (data.positionHistory || []).filter((p) => p.id !== id);
    onChange({
      ...data,
      positionHistory: updated,
    });
    toast.info(localize("Position history entry removed."));
  };

  // Career Summary Updater
  const updateCareerSummary = (
    field: keyof CareerSummaryStats | "primary" | "secondary" | "tertiary" | "quaternary",
    value:
      | number
      | string
      | Partial<{ label: string; value: string | number }>
      | Record<string, unknown>,
  ) => {
    const current = data.careerSummary || {
      totalMatches: 0,
      winRate: "0%",
      primaryMetric: { label: statTemplate.primaryLabel, value: 0 },
      secondaryMetric: { label: statTemplate.secondaryLabel, value: 0 },
    };

    let next: CareerSummaryStats;
    if (field === "primary" && typeof value === "object" && value !== null) {
      next = { ...current, primaryMetric: { ...current.primaryMetric, ...value } };
    } else if (field === "secondary" && typeof value === "object" && value !== null) {
      next = { ...current, secondaryMetric: { ...current.secondaryMetric, ...value } };
    } else if (field === "tertiary" && typeof value === "object" && value !== null) {
      next = {
        ...current,
        tertiaryMetric: {
          label: current.tertiaryMetric?.label || statTemplate.tertiaryLabel,
          value: "",
          ...value,
        },
      };
    } else {
      next = { ...current, [field]: value };
    }

    onChange({
      ...data,
      careerSummary: next,
    });
  };

  // Add Season Stat Record
  const handleAddSeasonStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeasonTournament.trim()) {
      toast.error(localize("Please enter the tournament or competition name."));
      return;
    }

    const newSeason: CareerStatSeason = {
      id: `season-${Date.now()}`,
      season: newSeasonName.trim() || "2024-25",
      teamOrTournament: newSeasonTournament.trim(),
      matches: Number(newSeasonMatches) || 0,
      stat1Label: newSeasonStat1Label.trim() || statTemplate.stat1Label,
      stat1Value: newSeasonStat1Val.trim() || "0",
      stat2Label: newSeasonStat2Label.trim() || statTemplate.stat2Label,
      stat2Value: newSeasonStat2Val.trim() || "0",
      stat3Label: newSeasonStat3Label.trim() || statTemplate.stat3Label,
      stat3Value: newSeasonStat3Val.trim() || undefined,
      ratingOrHighlight: newSeasonHighlight.trim() || undefined,
    };

    const currentSeasons = data.careerSeasonStats || [];
    onChange({
      ...data,
      careerSeasonStats: [newSeason, ...currentSeasons],
    });

    setNewSeasonTournament("");
    setNewSeasonStat1Val("");
    setNewSeasonStat2Val("");
    setNewSeasonStat3Val("");
    setNewSeasonHighlight("");
    toast.success(localize("Season stats recorded!"));
  };

  const handleRemoveSeasonStat = (id: string) => {
    const updated = (data.careerSeasonStats || []).filter((s) => s.id !== id);
    onChange({
      ...data,
      careerSeasonStats: updated,
    });
    toast.info(localize("Season stat entry removed."));
  };

  // Apply Sport Career Stat Template
  const handleApplySportStatTemplate = () => {
    const tmpl = SPORT_STAT_TEMPLATES[data.sport] || SPORT_STAT_TEMPLATES.Cricket;
    const currentSummary = data.careerSummary || {
      totalMatches: 30,
      winRate: "65%",
      primaryMetric: { label: tmpl.primaryLabel, value: 45 },
      secondaryMetric: { label: tmpl.secondaryLabel, value: 20 },
    };

    onChange({
      ...data,
      careerSummary: {
        ...currentSummary,
        primaryMetric: { label: tmpl.primaryLabel, value: currentSummary.primaryMetric.value },
        secondaryMetric: {
          label: tmpl.secondaryLabel,
          value: currentSummary.secondaryMetric.value,
        },
        tertiaryMetric: {
          label: tmpl.tertiaryLabel,
          value: currentSummary.tertiaryMetric?.value || "85%",
        },
      },
    });
    toast.success(
      language === "hi"
        ? `${data.sport} के करियर आँकड़ों के मानक सेट किए गए।`
        : `Configured career stat benchmarks for ${data.sport}!`,
    );
  };

  // Add Achievement
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim() || !newAchCompetition.trim()) {
      toast.error(localize("Please enter achievement title and competition name."));
      return;
    }

    const newAch: AthleticAchievement = {
      id: `ach-${Date.now()}`,
      title: newAchTitle.trim(),
      competition: newAchCompetition.trim(),
      year: Number(newAchYear) || new Date().getFullYear(),
      level: newAchLevel,
      award: newAchAward,
      description: newAchDesc.trim() || undefined,
      verified: true,
    };

    onChange({
      ...data,
      achievements: [newAch, ...data.achievements],
    });

    setNewAchTitle("");
    setNewAchCompetition("");
    setNewAchDesc("");
    toast.success(localize("Athletic achievement added to your profile card!"));
  };

  const handleRemoveAchievement = (id: string) => {
    onChange({
      ...data,
      achievements: data.achievements.filter((a) => a.id !== id),
    });
    toast.info(localize("Achievement removed."));
  };

  // Add Metric
  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetName.trim() || !newMetValue.trim()) {
      toast.error(localize("Please enter metric test name and score value."));
      return;
    }

    const newMet: PerformanceMetric = {
      id: `met-${Date.now()}`,
      name: newMetName.trim(),
      value: newMetValue.trim(),
      unit: newMetUnit.trim(),
      category: newMetCategory,
      score: Math.max(1, Math.min(100, Number(newMetScore) || 85)),
      benchmark: newMetBenchmark.trim() || undefined,
    };

    onChange({
      ...data,
      performanceMetrics: [...data.performanceMetrics, newMet],
    });

    setNewMetName("");
    setNewMetValue("");
    setNewMetUnit("");
    setNewMetBenchmark("");
    toast.success(localize("Performance metric added to your profile card!"));
  };

  const handleRemoveMetric = (id: string) => {
    onChange({
      ...data,
      performanceMetrics: data.performanceMetrics.filter((m) => m.id !== id),
    });
    toast.info(localize("Metric removed."));
  };

  // Apply Sport Preset Metrics
  const handleApplySportMetrics = () => {
    const presets = COMMON_METRIC_PRESETS[data.sport] || COMMON_METRIC_PRESETS.Cricket;
    const generated: PerformanceMetric[] = presets.map((p, idx) => ({
      ...p,
      id: `met-preset-${Date.now()}-${idx}`,
    }));

    onChange({
      ...data,
      performanceMetrics: generated,
    });
    toast.success(
      language === "hi"
        ? `${data.sport} के अनुशंसित प्रदर्शन मानक लागू किए गए।`
        : `Applied recommended ${data.sport} performance benchmarks!`,
    );
  };

  const currentSportPositions = SPORT_POSITION_PRESETS[data.sport] || [];
  const currentSportMetricSuggestions = COMMON_METRIC_PRESETS[data.sport] || [];

  return (
    <div className="space-y-8 text-foreground">
      {/* 1. Athlete Bio & Position Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">{localize("Position & Athlete Credentials")}</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Core Identity
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Athlete Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-athlete-name">{localize("Full Athlete Name")}</Label>
            <Input
              id="cv-athlete-name"
              value={data.athleteName}
              onChange={(e) => updateField("athleteName", e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          {/* Sport */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-sport-select">{localize("Primary Sport")}</Label>
            <Select
              value={data.sport}
              onValueChange={(val: SportType) => updateField("sport", val)}
            >
              <SelectTrigger id="cv-sport-select">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS_LIST.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Playing Position */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cv-position">{localize("Primary Playing Position / Role")}</Label>
              <span className="text-[11px] text-muted-foreground">
                Click a role suggestion below
              </span>
            </div>
            <Input
              id="cv-position"
              value={data.position}
              onChange={(e) => updateField("position", e.target.value)}
              placeholder="e.g. Opening Batsman & Wicketkeeper"
            />

            {/* Position Suggestions */}
            {currentSportPositions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentSportPositions.slice(0, 7).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateField("position", pos)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                      data.position === pos
                        ? "border-primary bg-primary/15 text-primary font-semibold"
                        : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Position */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-secondary-pos">
              {localize("Secondary Role / Speciality (Optional)")}
            </Label>
            <Input
              id="cv-secondary-pos"
              value={data.secondaryPosition || ""}
              onChange={(e) => updateField("secondaryPosition", e.target.value)}
              placeholder="e.g. Middle-Order Finisher / Slip Catcher"
            />
          </div>

          {/* Jersey Number */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-jersey">{localize("Jersey / Squad Number")}</Label>
            <Input
              id="cv-jersey"
              value={data.jerseyNumber || ""}
              onChange={(e) => updateField("jerseyNumber", e.target.value)}
              placeholder="e.g. #7 or #18"
            />
          </div>

          {/* Age Category */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-age-category">{localize("Age Band / Category")}</Label>
            <Select
              value={data.ageCategory}
              onValueChange={(val) => updateField("ageCategory", val)}
            >
              <SelectTrigger id="cv-age-category">
                <SelectValue placeholder="Select age band" />
              </SelectTrigger>
              <SelectContent>
                {["U-14", "U-16", "U-19", "U-23", "Senior Open", "Veterans (35+)"].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Academy / Club */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-academy">{localize("Current Academy, Club or School")}</Label>
            <Input
              id="cv-academy"
              value={data.currentAcademy}
              onChange={(e) => updateField("currentAcademy", e.target.value)}
              placeholder="e.g. Delhi Sports Club Academy"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-city">{localize("City")}</Label>
            <Input
              id="cv-city"
              value={data.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="e.g. New Delhi"
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-state">{localize("State / Region")}</Label>
            <Input
              id="cv-state"
              value={data.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="e.g. Delhi NCR"
            />
          </div>

          {/* Physical Attributes: Height, Weight, Dominant Side */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-height">{localize("Height")}</Label>
            <Input
              id="cv-height"
              value={data.height}
              onChange={(e) => updateField("height", e.target.value)}
              placeholder="e.g. 182 cm (6'0'')"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-weight">{localize("Weight")}</Label>
            <Input
              id="cv-weight"
              value={data.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="e.g. 74 kg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-dominant">{localize("Dominant Side")}</Label>
            <Select
              value={data.dominantSide}
              onValueChange={(val: "Right" | "Left" | "Ambidextrous") =>
                updateField("dominantSide", val)
              }
            >
              <SelectTrigger id="cv-dominant">
                <SelectValue placeholder={localize("Dominant Side")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Right">{localize("Right-Handed / Right-Footed")}</SelectItem>
                <SelectItem value="Left">{localize("Left-Handed / Left-Footed")}</SelectItem>
                <SelectItem value="Ambidextrous">{localize("Ambidextrous")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-availability">{localize("Scout Availability")}</Label>
            <Select
              value={data.availability}
              onValueChange={(
                val: "Open for Trials" | "Club Contracted" | "Free Agent" | "Academy Trainee",
              ) => updateField("availability", val)}
            >
              <SelectTrigger id="cv-availability">
                <SelectValue placeholder={localize("Availability")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open for Trials">{localize("Open for Trials")}</SelectItem>
                <SelectItem value="Free Agent">{localize("Free Agent")}</SelectItem>
                <SelectItem value="Club Contracted">{localize("Club Contracted")}</SelectItem>
                <SelectItem value="Academy Trainee">{localize("Academy Trainee")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-bio">{localize("Scout Bio & Playing Style Summary")}</Label>
            <Textarea
              id="cv-bio"
              rows={2}
              value={data.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Describe your athletic strengths, match temperament, and key playing style..."
            />
          </div>
        </div>
      </section>

      {/* 2. Career Stats & Match Records Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">{localize("Career Stats & Match Records")}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showcase high-impact career totals, win rates, and tournament-by-tournament season
              stats.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplySportStatTemplate}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Apply {data.sport} Stat Template
          </Button>
        </div>

        {/* Overall Career Summary Fields */}
        <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Overall Career Totals & Key Benchmarks
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="stat-total-matches" className="text-xs">
                Total Matches Played
              </Label>
              <Input
                id="stat-total-matches"
                type="number"
                min={0}
                value={data.careerSummary?.totalMatches ?? 0}
                onChange={(e) => updateCareerSummary("totalMatches", Number(e.target.value) || 0)}
                placeholder="e.g. 74"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="stat-win-rate" className="text-xs">
                Win / Selection Rate
              </Label>
              <Input
                id="stat-win-rate"
                value={data.careerSummary?.winRate ?? "65%"}
                onChange={(e) => updateCareerSummary("winRate", e.target.value)}
                placeholder="e.g. 68% or 14/18 Trials"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="stat-prim-val" className="text-xs">
                {data.careerSummary?.primaryMetric.label || statTemplate.primaryLabel}
              </Label>
              <Input
                id="stat-prim-val"
                value={data.careerSummary?.primaryMetric.value ?? ""}
                onChange={(e) => updateCareerSummary("primary", { value: e.target.value })}
                placeholder="e.g. 104"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="stat-sec-val" className="text-xs">
                {data.careerSummary?.secondaryMetric.label || statTemplate.secondaryLabel}
              </Label>
              <Input
                id="stat-sec-val"
                value={data.careerSummary?.secondaryMetric.value ?? ""}
                onChange={(e) => updateCareerSummary("secondary", { value: e.target.value })}
                placeholder="e.g. 928"
              />
            </div>
          </div>
        </div>

        {/* Existing Season Stats List */}
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Recorded Seasons & Tournaments ({data.careerSeasonStats?.length ?? 0})
          </div>

          {!data.careerSeasonStats || data.careerSeasonStats.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No tournament or season records added yet. Add a season below to showcase your
              competitive match records.
            </div>
          ) : (
            <div className="space-y-2">
              {data.careerSeasonStats.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-primary tabular-nums">
                        {season.season}
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-foreground">
                        {season.teamOrTournament}
                      </span>
                      {season.ratingOrHighlight && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {season.ratingOrHighlight}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Matches:{" "}
                        <strong className="text-foreground font-mono tabular-nums">
                          {season.matches}
                        </strong>
                      </span>
                      <span>
                        {season.stat1Label}:{" "}
                        <strong className="text-foreground font-mono tabular-nums">
                          {season.stat1Value}
                        </strong>
                      </span>
                      <span>
                        {season.stat2Label}:{" "}
                        <strong className="text-foreground font-mono tabular-nums">
                          {season.stat2Value}
                        </strong>
                      </span>
                      {season.stat3Label && (
                        <span>
                          {season.stat3Label}:{" "}
                          <strong className="text-foreground font-mono tabular-nums">
                            {season.stat3Value}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSeasonStat(season.id)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0"
                    title="Delete season"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Season Form */}
        <form
          onSubmit={handleAddSeasonStat}
          className="mt-5 rounded-xl border border-dashed border-border bg-muted/10 p-4"
        >
          <div className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" />
            Add Season or Tournament Record
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="season-year" className="text-xs">
                Season / Year *
              </Label>
              <Input
                id="season-year"
                value={newSeasonName}
                onChange={(e) => setNewSeasonName(e.target.value)}
                placeholder="e.g. 2024-25 or 2024"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="season-tourney" className="text-xs">
                Tournament / Team / League *
              </Label>
              <Input
                id="season-tourney"
                value={newSeasonTournament}
                onChange={(e) => setNewSeasonTournament(e.target.value)}
                placeholder="e.g. Delhi State Youth Cup or National Inter-Academy"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="season-matches" className="text-xs">
                Matches Played
              </Label>
              <Input
                id="season-matches"
                type="number"
                min={0}
                value={newSeasonMatches}
                onChange={(e) =>
                  setNewSeasonMatches(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 12"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="season-stat1-val" className="text-xs">
                {newSeasonStat1Label} Value
              </Label>
              <Input
                id="season-stat1-val"
                value={newSeasonStat1Val}
                onChange={(e) => setNewSeasonStat1Val(e.target.value)}
                placeholder="e.g. 340"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="season-stat2-val" className="text-xs">
                {newSeasonStat2Label} Value
              </Label>
              <Input
                id="season-stat2-val"
                value={newSeasonStat2Val}
                onChange={(e) => setNewSeasonStat2Val(e.target.value)}
                placeholder="e.g. 24"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="season-stat3-val" className="text-xs">
                {newSeasonStat3Label} Value (Optional)
              </Label>
              <Input
                id="season-stat3-val"
                value={newSeasonStat3Val}
                onChange={(e) => setNewSeasonStat3Val(e.target.value)}
                placeholder="e.g. 14.8"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="season-highlight" className="text-xs">
                Key Honour / Match Highlight (Optional)
              </Label>
              <Input
                id="season-highlight"
                value={newSeasonHighlight}
                onChange={(e) => setNewSeasonHighlight(e.target.value)}
                placeholder="e.g. Player of the Final, Best Bowler, 5-wicket haul"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Season Stats
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Position & Squad History Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">{localize("Position & Squad History")}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Document your positions played across academies, state squads, clubs, and school
              teams.
            </p>
          </div>
        </div>

        {/* Existing Position History List */}
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Logged Squads &amp; Positions ({data.positionHistory?.length ?? 0})
          </div>

          {!data.positionHistory || data.positionHistory.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No squad or position history logged yet. Add your current and previous teams below.
            </div>
          ) : (
            <div className="space-y-2">
              {data.positionHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-foreground">
                        {item.position}
                      </span>
                      {item.isCurrent && (
                        <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                          Current Squad
                        </span>
                      )}
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                        {item.level}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {item.period}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      <strong className="text-foreground">{item.team}</strong>
                      {item.secondaryPosition && <span> · Tactical: {item.secondaryPosition}</span>}
                      {typeof item.appearances === "number" && (
                        <span> · {item.appearances} Caps / Matches</span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePositionHistory(item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0"
                    title="Delete position entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Position History Form */}
        <form
          onSubmit={handleAddPositionHistory}
          className="mt-5 rounded-xl border border-dashed border-border bg-muted/10 p-4"
        >
          <div className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" />
            Add Position or Squad Entry
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="pos-period" className="text-xs">
                Period / Years *
              </Label>
              <Input
                id="pos-period"
                value={newPosPeriod}
                onChange={(e) => setNewPosPeriod(e.target.value)}
                placeholder="e.g. 2024 - Present or 2022 - 2024"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="pos-team" className="text-xs">
                Team / Academy / Club / School *
              </Label>
              <Input
                id="pos-team"
                value={newPosTeam}
                onChange={(e) => setNewPosTeam(e.target.value)}
                placeholder="e.g. Delhi State Youth Squad or Modern School Cricket XI"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pos-primary" className="text-xs">
                Primary Position *
              </Label>
              <Input
                id="pos-primary"
                value={newPosPosition}
                onChange={(e) => setNewPosPosition(e.target.value)}
                placeholder="e.g. Opening Fast Bowler"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pos-secondary" className="text-xs">
                Secondary Tactical Role
              </Label>
              <Input
                id="pos-secondary"
                value={newPosSecondary}
                onChange={(e) => setNewPosSecondary(e.target.value)}
                placeholder="e.g. Death Overs Specialist, Slip Catcher"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pos-level" className="text-xs">
                Competition Level
              </Label>
              <Select
                value={newPosLevel}
                onValueChange={(val: AchievementLevel) => setNewPosLevel(val)}
              >
                <SelectTrigger id="pos-level">
                  <SelectValue placeholder={localize("Level")} />
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
              <Label htmlFor="pos-caps" className="text-xs">
                Appearances / Matches
              </Label>
              <Input
                id="pos-caps"
                type="number"
                min={0}
                value={newPosAppearances}
                onChange={(e) =>
                  setNewPosAppearances(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 24"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="pos-notes" className="text-xs">
                Role Highlights &amp; Leadership (Optional)
              </Label>
              <Input
                id="pos-notes"
                value={newPosNotes}
                onChange={(e) => setNewPosNotes(e.target.value)}
                placeholder="e.g. Vice-Captain, opening bowler taking 24 wickets in season"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 sm:col-span-3">
              <input
                id="pos-is-current"
                type="checkbox"
                checked={newPosIsCurrent}
                onChange={(e) => setNewPosIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="pos-is-current" className="text-xs cursor-pointer font-medium">
                This is my current active team / squad
              </Label>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Position History
            </Button>
          </div>
        </form>
      </section>

      {/* 2. Performance Metrics Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">{localize("Athletic Performance Metrics")}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Input physical test benchmarks, sprints, stamina scores, or sport-specific stats.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplySportMetrics}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Apply {data.sport} Presets
          </Button>
        </div>

        {/* Existing Metrics list */}
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Active Metrics ({data.performanceMetrics.length})
          </div>

          {data.performanceMetrics.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No performance metrics added yet. Use the form below or click "Apply {data.sport}{" "}
              Presets".
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {data.performanceMetrics.map((met) => (
                <div
                  key={met.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {met.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {met.benchmark || met.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-primary">{met.value}</span>
                      <span className="text-[11px] text-muted-foreground ml-1">{met.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(met.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      title="Delete metric"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to add a new Metric */}
        <form
          onSubmit={handleAddMetric}
          className="mt-6 rounded-xl border border-border/80 bg-muted/10 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-primary" /> Add New Performance Metric
            </h4>

            {currentSportMetricSuggestions.length > 0 && (
              <span className="text-[11px] text-muted-foreground">Suggested for {data.sport}:</span>
            )}
          </div>

          {/* Quick suggestions */}
          {currentSportMetricSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {currentSportMetricSuggestions.map((sug) => (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() => {
                    setNewMetName(sug.name);
                    setNewMetValue(String(sug.value));
                    setNewMetUnit(sug.unit);
                    setNewMetCategory(sug.category);
                    setNewMetScore(sug.score || 85);
                    setNewMetBenchmark(sug.benchmark || "");
                  }}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  + {sug.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="met-name" className="text-xs">
                Metric Name *
              </Label>
              <Input
                id="met-name"
                value={newMetName}
                onChange={(e) => setNewMetName(e.target.value)}
                placeholder="e.g. 40m Sprint or Yo-Yo Test"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-value" className="text-xs">
                Value *
              </Label>
              <Input
                id="met-value"
                value={newMetValue}
                onChange={(e) => setNewMetValue(e.target.value)}
                placeholder="e.g. 4.92"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-unit" className="text-xs">
                Unit
              </Label>
              <Input
                id="met-unit"
                value={newMetUnit}
                onChange={(e) => setNewMetUnit(e.target.value)}
                placeholder="e.g. s, km/h, cm, %"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-category" className="text-xs">
                Category
              </Label>
              <Select
                value={newMetCategory}
                onValueChange={(val: MetricCategory) => setNewMetCategory(val)}
              >
                <SelectTrigger id="met-category">
                  <SelectValue placeholder={localize("Category")} />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-score" className="text-xs">
                Percentile / Rating (1-100)
              </Label>
              <Input
                id="met-score"
                type="number"
                min={1}
                max={100}
                value={newMetScore}
                onChange={(e) => setNewMetScore(Number(e.target.value))}
                placeholder="e.g. 90"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-benchmark" className="text-xs">
                Benchmark Note (Optional)
              </Label>
              <Input
                id="met-benchmark"
                value={newMetBenchmark}
                onChange={(e) => setNewMetBenchmark(e.target.value)}
                placeholder="e.g. State Standard: <5.10s"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Metric
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Athletic Achievements Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">{localize("Athletic Achievements & Honours")}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              List tournament medals, state selections, trophies, and trial achievements.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.achievements.length} Recorded
          </Badge>
        </div>

        {/* Existing Achievements list */}
        <div className="mt-4 space-y-2.5">
          {data.achievements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No athletic achievements recorded yet. Add your first tournament medal below!
            </div>
          ) : (
            data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="font-bold text-xs sm:text-sm text-foreground">{ach.title}</h5>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {ach.level}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">{ach.year}</span>
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">{ach.award}</span> ·{" "}
                    {ach.competition}
                  </div>

                  {ach.description && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{ach.description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(ach.id)}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded transition-colors shrink-0"
                  title="Remove achievement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Form to add an Achievement */}
        <form
          onSubmit={handleAddAchievement}
          className="mt-6 rounded-xl border border-border/80 bg-muted/10 p-4"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-3">
            <Plus className="h-3.5 w-3.5 text-primary" /> Add New Athletic Achievement
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="ach-title" className="text-xs">
                Achievement Title *
              </Label>
              <Input
                id="ach-title"
                value={newAchTitle}
                onChange={(e) => setNewAchTitle(e.target.value)}
                placeholder="e.g. State Youth Tournament Gold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-comp" className="text-xs">
                Tournament / Competition Name *
              </Label>
              <Input
                id="ach-comp"
                value={newAchCompetition}
                onChange={(e) => setNewAchCompetition(e.target.value)}
                placeholder="e.g. Delhi State Championship 2025"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-year" className="text-xs">
                Year *
              </Label>
              <Input
                id="ach-year"
                type="number"
                min={2000}
                max={2030}
                value={newAchYear}
                onChange={(e) => setNewAchYear(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-level" className="text-xs">
                Competition Level
              </Label>
              <Select
                value={newAchLevel}
                onValueChange={(val: AchievementLevel) => setNewAchLevel(val)}
              >
                <SelectTrigger id="ach-level">
                  <SelectValue placeholder={localize("Select level")} />
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

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="ach-award" className="text-xs">
                Award / Standing
              </Label>
              <Select value={newAchAward} onValueChange={(val: AwardType) => setNewAchAward(val)}>
                <SelectTrigger id="ach-award">
                  <SelectValue placeholder={localize("Select award")} />
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
              <Label htmlFor="ach-desc" className="text-xs">
                Description / Notable Stats (Optional)
              </Label>
              <Textarea
                id="ach-desc"
                rows={2}
                value={newAchDesc}
                onChange={(e) => setNewAchDesc(e.target.value)}
                placeholder="e.g. Scored 320 runs in 4 games; awarded Best Batsman of the Tournament..."
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Achievement
            </Button>
          </div>
        </form>
      </section>

      {/* 4. Coach Reference & Verification */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="text-base font-bold">{localize("Coach Reference & Media")}</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Scout Verification
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cv-coach-name">{localize("Coach Reference Name")}</Label>
            <Input
              id="cv-coach-name"
              value={data.coachReference?.name || ""}
              onChange={(e) =>
                updateField("coachReference", {
                  name: e.target.value,
                  designation: data.coachReference?.designation || "Head Coach",
                  phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                })
              }
              placeholder="e.g. Coach R. S. Negi"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-coach-desig">{localize("Coach Title / Academy")}</Label>
            <Input
              id="cv-coach-desig"
              value={data.coachReference?.designation || ""}
              onChange={(e) =>
                updateField("coachReference", {
                  name: data.coachReference?.name || "Head Coach",
                  designation: e.target.value,
                  phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                })
              }
              placeholder="e.g. Head Coach, National Sports Academy"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-video">{localize("Skills Highlight Reel Link")}</Label>
            <Input
              id="cv-video"
              value={data.highlightVideoUrl || ""}
              onChange={(e) => updateField("highlightVideoUrl", e.target.value)}
              placeholder="e.g. https://youtu.be/your-athletic-reel or Google Drive link"
            />
          </div>
        </div>
      </section>

      {/* 5. Connected Athletic Socials & Profiles */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">
              {localize("Connected Socials & Athletic Profiles")}
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Scout Recruitment
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Connect your sports handles so scouts and trial coaches can verify training clips and
          match stats.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cv-instagram">{localize("Instagram Handle or Link")}</Label>
            <Input
              id="cv-instagram"
              value={data.socialProfiles?.instagram || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  instagram: e.target.value,
                })
              }
              placeholder="e.g. @aarav.cricket or full URL"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-twitter">{localize("Twitter / 𝕏 Handle or Link")}</Label>
            <Input
              id="cv-twitter"
              value={data.socialProfiles?.twitter || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  twitter: e.target.value,
                })
              }
              placeholder="e.g. @aarav_pace"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-cricheroes">{localize("CricHeroes Profile (for Cricket)")}</Label>
            <Input
              id="cv-cricheroes"
              value={data.socialProfiles?.cricheroes || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  cricheroes: e.target.value,
                })
              }
              placeholder="e.g. https://cricheroes.com/player-profile/..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-strava">{localize("Strava Profile (for Athletics/Running)")}</Label>
            <Input
              id="cv-strava"
              value={data.socialProfiles?.strava || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  strava: e.target.value,
                })
              }
              placeholder="e.g. https://www.strava.com/athletes/..."
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-khelgrid">KhelGrid Profile / Community ID</Label>
            <Input
              id="cv-khelgrid"
              value={data.socialProfiles?.khelgrid || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  khelgrid: e.target.value,
                })
              }
              placeholder="e.g. www.khelgrid.com/profile/username or karma profile link"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
