import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  LifeBuoy,
  CheckCircle2,
  AlertCircle,
  Laptop,
  ArrowRight,
  Send,
} from "lucide-react";

export type FeedbackType = "bug" | "feature" | "general";

export interface FeedbackSupportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  defaultType?: FeedbackType;
  inline?: boolean;
}

interface SubmittedTicket {
  id: string;
  type: FeedbackType;
  title: string;
  category: string;
  date: string;
}

export function FeedbackSupportDialog({
  open,
  onOpenChange,
  trigger,
  defaultType = "bug",
  inline = false,
}: FeedbackSupportDialogProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (newVal: boolean) => {
    if (!newVal) {
      // Reset form state slightly after close
      setTimeout(() => {
        setIsSubmitted(false);
        setError("");
      }, 300);
    }
    if (isControlled) {
      onOpenChange?.(newVal);
    } else {
      setInternalOpen(newVal);
    }
  };

  const [type, setType] = useState<FeedbackType>(defaultType);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SubmittedTicket | null>(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setError("");
    setIsSubmitted(false);
    setSubmittedTicket(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a short summary or title.");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError("Please provide more details (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);

    // Persist to Supabase if configured & local fallback
    setTimeout(async () => {
      const ticketId = `KG-${type.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: SubmittedTicket = {
        id: ticketId,
        type,
        title: title.trim(),
        category,
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from("feedback_tickets").insert({
            type,
            category,
            title: title.trim(),
            description: description.trim(),
            user_email: email.trim() || user?.email || null,
            severity:
              type === "bug" ? (severity as "low" | "normal" | "high" | "urgent") : "normal",
            device_info: includeDiagnostics
              ? {
                  url: typeof window !== "undefined" ? window.location.href : "",
                  userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
                  screen:
                    typeof window !== "undefined"
                      ? `${window.innerWidth}x${window.innerHeight}`
                      : "",
                }
              : {},
            status: "open",
          });
        } catch (dbErr) {
          console.warn("Supabase feedback insert error:", dbErr);
        }
      }

      try {
        const existing = JSON.parse(localStorage.getItem("khelgrid_user_feedback") || "[]");
        existing.unshift({
          ...newTicket,
          description: description.trim(),
          email: email.trim(),
          severity: type === "bug" ? severity : undefined,
          diagnostics: includeDiagnostics
            ? {
                url: typeof window !== "undefined" ? window.location.href : "",
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
                screen:
                  typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
              }
            : null,
          status: "received",
        });
        localStorage.setItem("khelgrid_user_feedback", JSON.stringify(existing.slice(0, 20)));
      } catch {
        // Safe fallback if local storage is restricted
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedTicket(newTicket);
      toast.success(
        type === "bug"
          ? "Bug report submitted successfully! Thank you."
          : type === "feature"
            ? "Feature suggestion received! Thanks for shaping KhelGrid."
            : "Feedback sent! We'll review it shortly.",
      );
    }, 600);
  };

  const dialogContent = !isSubmitted ? (
    <>
      <DialogHeader className="space-y-1 text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Support & Feedback
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Help us improve KhelGrid. Report issues or pitch feature ideas directly to our team.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="mt-2 space-y-4">
        {/* Type Switcher */}
        <div>
          <Label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            What would you like to share?
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setType("bug");
                setError("");
              }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition cursor-pointer ${
                type === "bug"
                  ? "border-red-500/80 bg-red-500/10 text-red-600 dark:text-red-400 shadow-xs"
                  : "border-border/70 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bug className="h-4 w-4" />
              <span>Report Bug</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType("feature");
                setError("");
              }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition cursor-pointer ${
                type === "feature"
                  ? "border-amber-500/80 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "border-border/70 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Feature Idea</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType("general");
                setError("");
              }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition cursor-pointer ${
                type === "general"
                  ? "border-primary/80 bg-primary/10 text-primary shadow-xs"
                  : "border-border/70 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Inquiry</span>
            </button>
          </div>
        </div>

        {/* Category selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="feedback-category" className="text-xs font-medium">
              Topic / Area
            </Label>
            <select
              id="feedback-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="general">General Application</option>
              <option value="booking">Turf & Court Booking</option>
              <option value="academies">Academies & Trials</option>
              <option value="auth">Account & Login</option>
              <option value="payment">Wallet & Payments</option>
              <option value="performance">UI & Performance</option>
            </select>
          </div>

          {type === "bug" && (
            <div className="space-y-1.5">
              <Label htmlFor="feedback-severity" className="text-xs font-medium">
                Severity Level
              </Label>
              <select
                id="feedback-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "low" | "medium" | "high")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">Minor Glitch / Cosmetic</option>
                <option value="medium">Standard (Functional issue)</option>
                <option value="high">Critical (Prevents action)</option>
              </select>
            </div>
          )}
        </div>

        {/* Title / Summary */}
        <div className="space-y-1.5">
          <Label htmlFor="feedback-title" className="text-xs font-medium">
            {type === "bug"
              ? "Issue Summary *"
              : type === "feature"
                ? "Feature Title *"
                : "Subject *"}
          </Label>
          <Input
            id="feedback-title"
            placeholder={
              type === "bug"
                ? "e.g., Booking confirmation modal did not load time slots"
                : type === "feature"
                  ? "e.g., Add split payment with team members"
                  : "e.g., Question about academy listing verification"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg text-xs sm:text-sm"
            maxLength={120}
          />
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="feedback-description" className="text-xs font-medium">
              Detailed Description *
            </Label>
            <span className="text-[10px] text-muted-foreground">{description.length}/800</span>
          </div>
          <Textarea
            id="feedback-description"
            placeholder={
              type === "bug"
                ? "Steps to reproduce:\n1. Go to...\n2. Clicked on...\n3. Observed that..."
                : "Describe your idea, what problem it solves, and how it should work..."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none rounded-lg text-xs sm:text-sm"
            maxLength={800}
          />
        </div>

        {/* Email Follow-up */}
        <div className="space-y-1.5">
          <Label htmlFor="feedback-email" className="text-xs font-medium">
            Contact Email (for resolution updates)
          </Label>
          <Input
            id="feedback-email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg text-xs sm:text-sm"
          />
        </div>

        {/* Diagnostics Checkbox */}
        <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/30 p-2.5">
          <input
            type="checkbox"
            id="include-diagnostics"
            checked={includeDiagnostics}
            onChange={(e) => setIncludeDiagnostics(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="include-diagnostics"
            className="text-xs text-muted-foreground cursor-pointer select-none"
          >
            <span className="font-medium text-foreground flex items-center gap-1">
              <Laptop className="h-3.5 w-3.5 text-primary" /> Attach basic diagnostic info
            </span>
            Includes current page route & browser version to help debug faster. No sensitive data is
            shared.
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 rounded-lg font-semibold"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  ) : (
    /* Submission Confirmation View */
    <div className="py-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h3 className="mt-4 text-xl font-bold text-foreground">Feedback Received!</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Thank you for contributing to KhelGrid's sports community.
      </p>

      {submittedTicket && (
        <div className="mx-auto my-5 max-w-sm rounded-xl border border-border/70 bg-card p-3.5 text-left text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Reference Ticket:</span>
            <Badge variant="outline" className="font-mono font-bold text-primary">
              {submittedTicket.id}
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            <p className="font-semibold text-foreground truncate">{submittedTicket.title}</p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="capitalize">{submittedTicket.type}</span>
              <span>•</span>
              <span>{submittedTicket.date}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={resetForm}
          className="gap-1.5 rounded-lg text-xs"
        >
          Submit another report
        </Button>
        <Button
          size="sm"
          onClick={() => handleOpenChange(false)}
          className="gap-1.5 rounded-lg text-xs"
        >
          Done
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  if (inline) {
    if (!isOpen) return null;
    return (
      <Dialog open={true}>
        <div
          role="dialog"
          aria-modal="true"
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl"
        >
          {dialogContent}
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto sm:rounded-2xl">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}

export default FeedbackSupportDialog;
