import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { SportsCVData, CardTheme } from "@/types/sports-cv";
import {
  loadSportsCVData,
  saveSportsCVData,
  downloadSportsCardAsPNG,
  buildScoutTextSummary,
} from "@/lib/sports-cv-storage";
import { SportsCVCard } from "@/components/SportsCVCard";
import { SportsCVEditor } from "@/components/SportsCVEditor";
import { ShareSportsCVModal } from "@/components/ShareSportsCVModal";
import { slugifyAthleteName } from "@/lib/sports-cv-sharing";
import { AthleteProfileAgent } from "@/components/AthleteProfileAgent";
import { AthleteOnboardingWizard } from "@/components/AthleteOnboardingWizard";
import type { AthleteProfile } from "@/lib/athlete-profile-agent";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  Copy,
  Edit3,
  Eye,
  Columns,
  RotateCcw,
  Palette,
  ExternalLink,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { getSportsCVLanguage, tSportsCV } from "@/lib/sports-cv-i18n";

export interface SportsCVProps {
  initialViewMode?: "card" | "edit" | "split" | "wizard";
  className?: string;
}

export function SportsCV({ initialViewMode = "card", className = "" }: SportsCVProps) {
  const name = "";

  // Active CV state
  const [data, setData] = useState<SportsCVData>(() => loadSportsCVData(name));
  const [viewMode, setViewMode] = useState<"card" | "edit" | "split" | "wizard">(initialViewMode);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Listen for custom event whenever wizard or another editor updates CV
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SportsCVData>;
      if (customEvent?.detail) {
        setData(customEvent.detail);
      } else {
        setData(loadSportsCVData(name));
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("khelgrid_sportscv_updated", handleUpdate);
      return () => window.removeEventListener("khelgrid_sportscv_updated", handleUpdate);
    }
  }, [name]);

  // Handle updates from editor
  const handleDataChange = (updated: SportsCVData) => {
    setData(updated);
    saveSportsCVData(updated);
  };

  // Switch Theme
  const handleThemeChange = (theme: CardTheme) => {
    const updated = { ...data, theme };
    setData(updated);
    saveSportsCVData(updated);
    toast.success(`Theme set to ${theme.toUpperCase()}`);
  };

  // Download high-res PNG image
  const handleDownloadCard = async () => {
    try {
      setIsExporting(true);
      await downloadSportsCardAsPNG(data);
      toast.success("Downloaded high-resolution Scout Card (PNG)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image download.");
    } finally {
      setIsExporting(false);
    }
  };

  // Share profile
  const handleShare = () => {
    setShareModalOpen(true);
  };

  // Copy Scout summary text
  const handleCopySummary = async () => {
    const summary = buildScoutTextSummary(data);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      toast.success("Scout CV summary copied to clipboard! Ready to paste into WhatsApp or Email.");
    }
  };

  // Start a fresh, empty CV without injecting sample achievements or verification claims.
  const handleResetSample = () => {
    const fresh: SportsCVData = {
      ...data,
      athleteName: name || "",
      position: "",
      secondaryPosition: "",
      jerseyNumber: "",
      ageCategory: "",
      age: 0,
      city: "",
      state: "",
      currentAcademy: "",
      dominantSide: "",
      height: "",
      weight: "",
      bio: "",
      verified: false,
      athleteId: "",
      theme: "classic",
      achievements: [],
      positionHistory: [],
      careerSummary: undefined,
      careerSeasonStats: [],
      performanceMetrics: [],
      highlightVideoUrl: "",
      socialProfiles: {},
      coachReference: undefined,
      availability: "",
    };
    setData(fresh);
    saveSportsCVData(fresh);
    toast.success("Started a fresh Sports CV.");
  };

  // Map to AthleteProfile for completeness agent
  const athleteProfileForAgent: AthleteProfile = {
    name: data.athleteName,
    sport: data.sport,
    ageBand: data.ageCategory,
    city: data.city,
    fitnessSummary:
      data.performanceMetrics.length > 0
        ? `${data.performanceMetrics.length} metrics recorded`
        : null,
    results: data.achievements.map((a) => `${a.year} - ${a.title}`),
    trials: [],
    videoUrl: data.highlightVideoUrl || null,
    coachReference: data.coachReference?.name || null,
    availability: data.availability,
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Onboarding Wizard Invitation Banner */}
      {viewMode !== "wizard" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-foreground text-xs sm:text-sm">
                Interactive Sports CV & Social Profiles Setup Wizard
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Guided 6-step flow to calibrate performance metrics, honours, and connect your
                Instagram & YouTube highlight reels.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setViewMode("wizard")}
              className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-sm"
            >
              <Wand2 className="h-3.5 w-3.5" /> Start Wizard
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/onboarding">Full Screen →</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode buttons */}
          <div className="flex items-center rounded-xl border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "card"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Profile Card
            </button>

            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "edit"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Stats
            </button>

            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "split"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              Split View
            </button>

            <button
              type="button"
              onClick={() => setViewMode("wizard")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "wizard"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Setup Wizard
            </button>
          </div>

          {/* Theme chips */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
            <span className="hidden sm:inline-flex items-center text-xs text-muted-foreground">
              <Palette className="mr-1 h-3.5 w-3.5" /> Theme:
            </span>
            {(["gold", "cyber", "emerald", "crimson", "classic"] as CardTheme[]).map((thm) => (
              <button
                key={thm}
                type="button"
                onClick={() => handleThemeChange(thm)}
                title={`Select ${thm} theme`}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                  data.theme === thm
                    ? "scale-110 border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                } ${
                  thm === "gold"
                    ? "bg-amber-400"
                    : thm === "cyber"
                      ? "bg-cyan-400"
                      : thm === "emerald"
                        ? "bg-emerald-500"
                        : thm === "crimson"
                          ? "bg-rose-500"
                          : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
                "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
              })[ch] || ch);
              const popup = window.open("", "_blank");
              if (!popup) {
                toast.error("Allow pop-ups to create your printable PDF.");
                return;
              }
              const achievements = (data.achievements || []).map((item) => `<li><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.competition)} · ${escapeHtml(item.level)} · ${escapeHtml(item.year)}</li>`).join("");
              const language = getSportsCVLanguage();
              const tr = (key: Parameters<typeof tSportsCV>[0]) => tSportsCV(key, language);
              const metrics = (data.performanceMetrics || []).map((item) => `<li><strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.value)} ${escapeHtml(item.unit)}</li>`).join("");
              popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(data.athleteName || tr("athleteName"))} — ${escapeHtml(tr("title"))}</title><style>body{font:14px/1.5 Arial,sans-serif;color:#172033;margin:32px}header{border-bottom:3px solid #16845b;padding-bottom:16px;margin-bottom:20px}h1{font-size:28px;margin:0}h2{font-size:16px;color:#08764f;margin:22px 0 8px}p{margin:4px 0}.muted{color:#526174}ul{padding-left:20px}li{margin:8px 0}.tag{display:inline-block;border:1px solid #d1d9e0;border-radius:20px;padding:3px 8px;margin:4px 4px 0 0}@media print{body{margin:15mm}button{display:none}}</style></head><body><header><h1>${escapeHtml(data.athleteName || tr("athleteName"))}</h1><p>${escapeHtml(data.sport)} · ${escapeHtml(data.position || "Position/event not added")}</p><p class="muted">${escapeHtml([data.ageCategory, data.city, data.state].filter(Boolean).join(" · "))}</p></header>${data.bio ? `<h2>${escapeHtml(tr("bio"))}</h2><p>${escapeHtml(data.bio)}</p>` : ""}${metrics ? `<h2>${escapeHtml(tr("performanceHeading"))}</h2><ul>${metrics}</ul>` : ""}${achievements ? `<h2>${escapeHtml(tr("achievementsHeading"))}</h2><ul>${achievements}</ul>` : ""}${data.currentAcademy ? `<h2>${escapeHtml(tr("academyHeading"))}</h2><p>${escapeHtml(data.currentAcademy)}</p>` : ""}${data.highlightVideoUrl ? `<h2>${escapeHtml(tr("highlightsHeading"))}</h2><p>${escapeHtml(data.highlightVideoUrl)}</p>` : ""}<p class="muted" style="margin-top:28px">${escapeHtml(tr("pdfDisclaimer"))}</p><button onclick="window.print()">${escapeHtml(tr("downloadPdf"))}</button><script>window.onload=()=>window.print()</script></body></html>`);
              popup.document.close();
            }}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Generating..." : "Download Card (PNG)"}
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleShare}
            className="text-xs h-8 gap-1.5 font-semibold shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share CV
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-8 gap-1.5"
            title="Open your public scout portfolio page"
          >
            <Link to="/cv/$id" params={{ id: slugifyAthleteName(data.athleteName, data.sport) }}>
              <ExternalLink className="h-3.5 w-3.5" />
              Public Link
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopySummary}
            className="text-xs h-8 gap-1.5"
            title="Copy scout-ready text summary"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Text
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleResetSample}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Reset to sample data"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area based on viewMode */}
      {viewMode === "card" && (
        <div className="space-y-4">
          <SportsCVCard data={data} onShare={handleShare} />
          <AthleteProfileAgent profile={athleteProfileForAgent} />
        </div>
      )}

      {viewMode === "edit" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <h4 className="font-semibold text-sm">Real-Time Athletic CV Editor</h4>
              <p className="text-xs text-muted-foreground">
                All changes save automatically and reflect live on your shareable visual profile
                card.
              </p>
            </div>
            <Button size="sm" onClick={() => setViewMode("card")} className="gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" /> View Card
            </Button>
          </div>

          <SportsCVEditor data={data} onChange={handleDataChange} />
        </div>
      )}

      {viewMode === "split" && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <SportsCVEditor data={data} onChange={handleDataChange} />
          </div>
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              <span>Live Visual Card Preview</span>
              <span className="text-primary font-mono">{data.theme.toUpperCase()} THEME</span>
            </div>
            <SportsCVCard data={data} onShare={handleShare} />
            <AthleteProfileAgent profile={athleteProfileForAgent} />
          </div>
        </div>
      )}

      {viewMode === "wizard" && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          <AthleteOnboardingWizard
            onComplete={(updated) => {
              setData(updated);
              setViewMode("card");
            }}
            onCancel={() => setViewMode("card")}
          />
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        Sports CV creation, editing, PNG card export and profile sharing are free. Only display achievements and verification claims that you can support.
      </div>

      {/* Shareable Link & Social Media Modal */}
      <ShareSportsCVModal open={shareModalOpen} onOpenChange={setShareModalOpen} data={data} />
    </div>
  );
}

export default SportsCV;
