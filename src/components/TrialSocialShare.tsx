import React, { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface TrialShareData {
  id: string;
  title: string;
  sport: string;
  city: string;
  date: string;
  fee?: number;
  academy?: string;
  url?: string;
}

export interface TrialSocialShareProps {
  trial: TrialShareData;
  variant?: "banner" | "buttons" | "compact";
  className?: string;
}

export function TrialSocialShare({
  trial,
  variant = "buttons",
  className = "",
}: TrialSocialShareProps) {
  const [copied, setCopied] = useState(false);

  // Construct absolute canonical share URL
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://www.khelgrid.com";
  const shareUrl = trial.url || `${baseUrl}/trial/${trial.id}`;

  const feeText = trial.fee === 0 ? "Free Entry" : trial.fee ? `₹${trial.fee}` : "";
  const shareTitle = `${trial.title} (${trial.sport} in ${trial.city})`;
  const shareDescription = `Check out this official sports selection trial: ${trial.title} organized by ${trial.academy || "Organizer"} in ${trial.city} on ${trial.date}. ${feeText ? `(${feeText})` : ""}`;

  // WhatsApp share url
  const whatsappText = encodeURIComponent(
    `🏆 *${shareTitle}*\n📍 *Location:* ${trial.city}\n📅 *Date:* ${trial.date}\n${feeText ? `💰 *Fee:* ${feeText}\n` : ""}🔗 *Apply / View Details:* ${shareUrl}\n\n_Found on KhelGrid - India's Grassroots Sports Network_`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  // X (Twitter) share url
  const tweetText = encodeURIComponent(
    `Official ${trial.sport} selection trial: ${trial.title} in ${trial.city} on ${trial.date}. Verified on @KhelGrid\n\nApply here:`,
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;

  // LinkedIn share url
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // Telegram share url
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-secure or restricted contexts
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        description: "You can now paste and share this trial opportunity.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link. Please manually copy the URL.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err: unknown) {
        // User cancelled or unsupported
        if ((err as Error)?.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
          className="h-8 px-2.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-3.5 w-3.5 mr-1 fill-emerald-600/20" />
          WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.open(twitterUrl, "_blank", "noopener,noreferrer")}
          className="h-8 px-2.5 text-xs text-foreground hover:text-foreground hover:bg-muted"
          title="Share on X"
        >
          <span className="font-bold text-xs mr-1">𝕏</span>
          Post
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="h-8 w-8 text-xs"
          title="Copy link"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-border bg-gradient-to-r from-card via-card/70 to-card p-4 sm:p-5 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Share this trial announcement</h4>
            <p className="text-xs text-muted-foreground">
              Help aspiring athletes, parents, and coaches discover this verified trial
            </p>
          </div>
        </div>

        {/* Action Sharing Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
            className="flex items-center gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-xs h-8 px-3"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-emerald-500/20" />
            <span>WhatsApp</span>
          </Button>

          {/* X (formerly Twitter) Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(twitterUrl, "_blank", "noopener,noreferrer")}
            className="flex items-center gap-1.5 border-neutral-400/40 bg-neutral-500/10 text-neutral-800 hover:bg-neutral-500/20 dark:text-neutral-200 dark:hover:text-white font-medium text-xs h-8 px-3"
          >
            <span className="font-extrabold text-[13px] leading-none">𝕏</span>
            <span>Share</span>
          </Button>

          {/* Telegram Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(telegramUrl, "_blank", "noopener,noreferrer")}
            className="hidden md:flex items-center gap-1.5 border-sky-400/40 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 hover:text-sky-700 dark:text-sky-400 font-medium text-xs h-8 px-3"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Telegram</span>
          </Button>

          {/* Native Web Share API if supported */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 text-xs h-8 px-3"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>More</span>
            </Button>
          )}

          {/* Copy Link Button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs h-8 px-3"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrialSocialShare;
