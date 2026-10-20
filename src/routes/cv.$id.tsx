import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { resolvePublicSportsCV } from "@/lib/sports-cv-sharing";
import { buildSeoHead } from "@/lib/seo";
import { SportsCVCard } from "@/components/SportsCVCard";
import { ShareSportsCVModal } from "@/components/ShareSportsCVModal";
import { downloadSportsCardAsPNG } from "@/lib/sports-cv-storage";
import type { CardTheme, SportsCVData } from "@/types/sports-cv";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  QrCode,
  Award,
  Calendar,
  MapPin,
  Trophy,
  Mail,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cv/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    data: typeof search.data === "string" ? search.data : undefined,
  }),
  loader: ({ params, search }) => {
    const cvData = resolvePublicSportsCV(params.id, search?.data);
    return { cvData, slug: params.id };
  },
  head: ({ loaderData, params }) => {
    const cv = loaderData?.cvData || resolvePublicSportsCV(params.id);
    const topAchievement = cv.achievements?.[0]?.title || "State Athlete";
    return buildSeoHead({
      title: `${cv.athleteName} · Verified ${cv.sport} Sports CV & Stats | KhelGrid`,
      description: `Explore ${cv.athleteName}'s official verified ${cv.sport} Sports CV on KhelGrid. Role: ${cv.position}, Age Group: ${cv.ageCategory}, Key Award: ${topAchievement}. Verified scout telemetry and match records.`,
      canonicalPath: `/cv/${params.id}`,
      type: "profile",
      keywords: `${cv.athleteName}, ${cv.sport} CV, ${cv.athleteName} stats, sports resume India, ${cv.city} athlete, youth sports trials, ${cv.position}`,
      image: "https://www.khelgrid.com/og-image.png",
    });
  },
  component: PublicSportsCVPage,
});

function PublicSportsCVPage() {
  const { cvData: initialCvData } = Route.useLoaderData();
  const [data, setData] = useState<SportsCVData>(initialCvData);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Switch display theme on public card view
  const handleThemeChange = (theme: CardTheme) => {
    setData((prev) => ({ ...prev, theme }));
    toast.success(`Scout Card view theme: ${theme.toUpperCase()}`);
  };

  const handleCopyPublicLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      toast.success("Public Sports CV link copied!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownloadPng = async () => {
    try {
      setIsExporting(true);
      await downloadSportsCardAsPNG(data);
      toast.success("Downloaded high-resolution Scout Card (PNG)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download image.");
    } finally {
      setIsExporting(false);
    }
  };

  const themes: Array<{ id: CardTheme; label: string; color: string }> = [
    { id: "gold", label: "Gold", color: "bg-amber-500" },
    { id: "cyber", label: "Cyber", color: "bg-cyan-500" },
    { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
    { id: "crimson", label: "Crimson", color: "bg-rose-500" },
    { id: "classic", label: "Classic", color: "bg-slate-400" },
  ];

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link
              to="/"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link to="/search" className="hover:text-foreground transition-colors">
              Talent Directory
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{data.athleteName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-0.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              KhelGrid Verified Dossier
            </Badge>
          </div>
        </div>

        {/* Public Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-card/80 p-4 sm:p-6 backdrop-blur-md shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {data.athleteName}
              </h1>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {data.sport}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {data.position} · {data.currentAcademy || "Independent"} · {data.city}, {data.state}
            </p>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="gap-1.5 font-semibold text-xs shadow-sm"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share CV</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyPublicLink}
              className="gap-1.5 text-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Rendering..." : "Card PNG"}</span>
            </Button>
          </div>
        </div>

        {/* Theme Preview Switcher */}
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Presentation Theme:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  data.theme === t.id
                    ? "bg-background text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${t.color}`} />
                <span className="capitalize">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Sports CV Card Presentation */}
        <div className="shadow-xl rounded-2xl overflow-hidden">
          <SportsCVCard data={data} />
        </div>

        {/* Scout & Academy Reference Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Coach Reference */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <UserCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Verified Coach Reference</h3>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="font-semibold text-foreground">
                {data.coachReference?.name || "Official Academy High-Performance Desk"}
              </div>
              <div className="text-muted-foreground">
                {data.coachReference?.designation || "Head Coach & Technical Director"}
              </div>
              {data.coachReference?.phoneOrEmail && (
                <div className="flex items-center gap-1.5 font-mono text-primary pt-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{data.coachReference.phoneOrEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trial & Scouting Inquiries */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Award className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">Scouting Availability</h3>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Trial Status:</span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                  {data.availability || "Open for Selections & Trials"}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                This athlete is listed in the KhelGrid verified talent pool. Organizers of state,
                national, and club selections can verify achievements through registered federation
                matches.
              </p>
            </div>
          </div>
        </div>

        {/* Athlete CTA Banner */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-foreground">
              Are you an athlete or sports academy?
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your own verified Sports CV, track your competitive match stats, and unlock
              scout visibility on KhelGrid.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 shrink-0 flex items-center justify-center gap-2">
            <Button asChild size="sm" className="font-semibold text-xs">
              <Link to="/profile">Create Your Sports CV</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link to="/trials">Browse Active Trials</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Share Modal Instance */}
      <ShareSportsCVModal open={shareModalOpen} onOpenChange={setShareModalOpen} data={data} />
    </main>
  );
}

export default PublicSportsCVPage;
