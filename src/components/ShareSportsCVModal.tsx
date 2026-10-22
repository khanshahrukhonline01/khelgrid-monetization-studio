import React, { useState, useEffect, useId } from "react";
import QRCode from "qrcode";
import type { SportsCVData } from "@/types/sports-cv";
import { generateShareableCVUrl, buildSocialShareLinks } from "@/lib/sports-cv-sharing";
import { downloadSportsCardAsPNG } from "@/lib/sports-cv-storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  ExternalLink,
  QrCode as QrCodeIcon,
  Download,
  Share2,
  Send,
  Mail,
  ShieldCheck,
  Sparkles,
  FileText,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { getSportsCVLanguage } from "@/lib/sports-cv-i18n";

export interface ShareSportsCVModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SportsCVData;
  inline?: boolean;
}

export function ShareSportsCVModal({
  open,
  onOpenChange,
  data,
  inline = false,
}: ShareSportsCVModalProps) {
  const language = getSportsCVLanguage();
  const tr = (en: string, hi: string) => language === "hi" ? hi : en;
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [usePortableUrl, setUsePortableUrl] = useState(false);
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr" | "pitch">("link");

  const titleId = useId();
  const descId = useId();

  const { url, shortUrl, slug } = generateShareableCVUrl(data);
  const activeShareUrl = usePortableUrl ? url : shortUrl;
  const socialLinks = buildSocialShareLinks(data, activeShareUrl);

  // Generate QR Code image when modal opens or url changes
  useEffect(() => {
    if (!open) return;
    let isMounted = true;

    QRCode.toDataURL(activeShareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0a0a0a",
        light: "#ffffff",
      },
    })
      .then((dataUri) => {
        if (isMounted) setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [open, activeShareUrl]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeShareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = activeShareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      toast.success(tr("Public Sports CV link copied!", "सार्वजनिक Sports CV लिंक कॉपी हो गया!"), {
        description: tr("Anyone can now view your verified athletic achievements.", "अब कोई भी आपकी खिलाड़ी प्रोफ़ाइल और उपलब्धियाँ देख सकता है।"),
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error(tr("Failed to copy link. Please manually copy the URL.", "लिंक कॉपी नहीं हुआ। कृपया URL को मैन्युअल रूप से कॉपी करें।"));
    }
  };

  const handleCopyPitch = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(socialLinks.scoutPitchSnippet);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = socialLinks.scoutPitchSnippet;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedPitch(true);
      toast.success(tr("Scout Pitch snippet copied!", "स्काउट परिचय कॉपी हो गया!"), {
        description: tr("Ready to paste into WhatsApp groups or coach emails.", "इसे WhatsApp समूह या कोच के ईमेल में पेस्ट कर सकते हैं।"),
      });
      setTimeout(() => setCopiedPitch(false), 2500);
    } catch {
      toast.error(tr("Failed to copy pitch text.", "परिचय टेक्स्ट कॉपी नहीं हुआ।"));
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${slug}-khelgrid-scout-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(tr("Downloaded Scout QR Code!", "स्काउट QR कोड डाउनलोड हो गया!"));
  };

  const handleDownloadCard = async () => {
    try {
      setIsExportingCard(true);
      await downloadSportsCardAsPNG(data);
      toast.success(tr("Downloaded High-Res Scout Card (PNG)!", "हाई-रेज़ोल्यूशन खिलाड़ी कार्ड (PNG) डाउनलोड हो गया!"));
    } catch (err) {
      console.error(err);
      toast.error(tr("Failed to export scout card image.", "खिलाड़ी कार्ड इमेज एक्सपोर्ट नहीं हो सकी।"));
    } finally {
      setIsExportingCard(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: socialLinks.shareTitle,
          text: socialLinks.shareText,
          url: activeShareUrl,
        });
        toast.success(tr("Shared successfully!", "सफलतापूर्वक साझा किया गया!"));
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const modalBody = (
    <div className="flex flex-col">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-5 sm:p-6 text-white border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Share2 className="h-4 w-4" />
            </span>
            <div>
              {inline ? (
                <h2
                  id={titleId}
                  className="text-base sm:text-lg font-bold text-white flex items-center gap-2"
                >
                  Share Public Sports CV
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Scout Verified
                  </Badge>
                </h2>
              ) : (
                <DialogTitle
                  id={titleId}
                  className="text-base sm:text-lg font-bold text-white flex items-center gap-2"
                >
                  Share Public Sports CV
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Scout Verified
                  </Badge>
                </DialogTitle>
              )}
              {inline ? (
                <p id={descId} className="text-xs text-neutral-400 mt-0.5">
                  Share your public portfolio, match records & achievements with coaches, academies
                  and scouts.
                </p>
              ) : (
                <DialogDescription id={descId} className="text-xs text-neutral-400 mt-0.5">
                  Share your public portfolio, match records & achievements with coaches, academies
                  and scouts.
                </DialogDescription>
              )}
            </div>
          </div>
        </div>

        {/* Athlete Snapshot Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.04] p-3 text-xs border border-white/10">
          <div className="font-bold text-white">{data.athleteName}</div>
          <span className="text-neutral-500">·</span>
          <span className="text-amber-300 font-medium">{data.sport}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-300">{data.position}</span>
          <span className="text-neutral-500">·</span>
          <span className="font-mono text-neutral-400">{data.ageCategory}</span>
        </div>
      </div>

      {/* Tab selection */}
      <div className="flex border-b border-border bg-muted/40 px-5 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("link")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "link"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          Public Link & Socials
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("qr")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "qr"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <QrCodeIcon className="h-3.5 w-3.5" />
          Scout QR Code
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pitch")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "pitch"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Scout Pitch Text
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
        {/* TAB 1: PUBLIC LINK & SOCIAL NETWORKS */}
        {activeTab === "link" && (
          <div className="space-y-4">
            {/* Unique Public URL Box */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1.5">
                <span>{tr("Your Unique Public Sports CV URL", "आपका सार्वजनिक Sports CV लिंक")}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] cursor-pointer text-neutral-400 hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={usePortableUrl}
                      onChange={(e) => setUsePortableUrl(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-3 w-3"
                    />
                    <span>{tr("Embed full dataset in link", "लिंक में पूरा CV डेटा शामिल करें")}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={activeShareUrl}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none select-all truncate"
                />
                <Button
                  size="sm"
                  variant={copiedLink ? "default" : "secondary"}
                  className="h-8 gap-1.5 text-xs font-semibold shrink-0"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{tr("Copied!", "कॉपी हो गया!")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{tr("Copy Link", "लिंक कॉपी करें")}</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs shrink-0"
                  asChild
                  title="Open public page"
                >
                  <a href={activeShareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Scouts, coaches and clubs can view your live card without needing an account.
              </p>
            </div>

            {/* Social Channels Share Grid */}
            <div>
              <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>{tr("Share Directly to Socials & Coaches", "सोशल मीडिया और कोच के साथ साझा करें")}</span>
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-1 lowercase"
                  >
                    <Smartphone className="h-3 w-3" />
                    open system share
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {/* WhatsApp */}
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center transition hover:bg-emerald-500/20 hover:scale-[1.02]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    WhatsApp
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tr("Scout Formatted", "स्काउट के लिए तैयार")}</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-center transition hover:bg-sky-500/20 hover:scale-[1.02]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white">
                    <span className="text-sm font-black">𝕏</span>
                  </div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    Twitter / X
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tr("Post Highlights", "मुख्य उपलब्धियाँ पोस्ट करें")}</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center transition hover:bg-blue-500/20 hover:scale-[1.02]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="text-xs font-black">in</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    LinkedIn
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tr("Athletic Portfolio", "खेल पोर्टफोलियो")}</span>
                </a>

                {/* Email Scout */}
                <a
                  href={socialLinks.email}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-center transition hover:bg-purple-500/20 hover:scale-[1.02]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Email Scout
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tr("Formal Pitch", "औपचारिक परिचय")}</span>
                </a>
              </div>
            </div>

            {/* Instant PNG Card Export Action */}
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    High-Resolution Scout Card (1200x2100 PNG)
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Perfect for Instagram Stories, WhatsApp status & printed trial kits.
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadCard}
                disabled={isExportingCard}
                className="gap-1.5 text-xs shrink-0 font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isExportingCard ? "Generating..." : "Download PNG"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: QR CODE */}
        {activeTab === "qr" && (
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            <div className="relative rounded-2xl border-2 border-border bg-white p-4 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`${data.athleteName} Scout QR Code`}
                  className="h-48 w-48 sm:h-56 sm:w-56 object-contain"
                />
              ) : (
                <div className="h-48 w-48 flex items-center justify-center text-xs text-neutral-400">
                  Generating QR code...
                </div>
              )}
              <div className="mt-2 text-center">
                <div className="text-xs font-bold text-neutral-900 tracking-tight">
                  {data.athleteName}
                </div>
                <div className="text-[10px] text-neutral-600">
                  {data.sport} · {data.athleteId}
                </div>
              </div>
            </div>

            <div className="max-w-xs space-y-1">
              <h4 className="text-xs font-bold text-foreground">
                Instant On-Field Trial Inspection
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Coaches and scouts can scan this with any phone camera to instantly view your
                verified records, videos, and stats without typing.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleDownloadQr}
                className="gap-1.5 text-xs font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                Download QR Code (PNG)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="gap-1.5 text-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy URL
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: SCOUT PITCH TEXT */}
        {activeTab === "pitch" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">
                Pre-formatted text snippet for WhatsApp groups / DMs
              </span>
              <Button
                size="sm"
                variant={copiedPitch ? "default" : "secondary"}
                onClick={handleCopyPitch}
                className="h-7 text-xs gap-1 font-semibold"
              >
                {copiedPitch ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{tr("Copied!", "कॉपी हो गया!")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>{tr("Copy Snippet", "टेक्स्ट कॉपी करें")}</span>
                  </>
                )}
              </Button>
            </div>

            <pre className="rounded-xl border border-border bg-muted/50 p-3.5 text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed select-all">
              {socialLinks.scoutPitchSnippet}
            </pre>

            <div className="text-[11px] text-muted-foreground">
              Tip: Paste this directly into trial organizers’ WhatsApp numbers, state association
              forms, or coaches’ DMs to stand out with verified credentials.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>KhelGrid Public Athlete Registry · Free &amp; Unrestricted Scout Access</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="h-7 text-xs"
        >
          Close
        </Button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div
        className="max-w-xl border border-border bg-card/95 p-0 overflow-hidden backdrop-blur-xl shadow-2xl rounded-2xl"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        {modalBody}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl border-border bg-card/95 p-0 overflow-hidden backdrop-blur-xl shadow-2xl sm:rounded-2xl"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        {modalBody}
      </DialogContent>
    </Dialog>
  );
}
