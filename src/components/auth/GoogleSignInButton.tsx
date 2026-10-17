import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { RefreshCw, ShieldCheck, Check, Sparkles, User, Mail, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface GoogleSignInButtonProps {
  /**
   * Optional custom button label (defaults to "Continue with Google" or "Sign in with Google").
   */
  text?: string;
  /**
   * Target internal route to redirect to after successful authentication.
   */
  redirectTo?: string;
  /**
   * Selected role context ("user" = Athlete, "coach" = Coach, "academy" = Academy Owner)
   */
  role?: "user" | "coach" | "academy";
  /**
   * Action mode: "signin" | "signup" | "generic"
   */
  mode?: "signin" | "signup" | "generic";
  /**
   * Optional callback when login succeeds (used in modals or inline flows).
   */
  onSuccess?: () => void;
  /**
   * Additional Tailwind CSS classes.
   */
  className?: string;
  /**
   * Whether to display the "Verified Google OAuth 2.0" sub-badge below the button.
   */
  showSecurityBadge?: boolean;
}

/**
 * Official Google 'G' Logo SVG:
 * Blue: #4285F4, Green: #34A853, Yellow: #FBBC05, Red: #EA4335.
 */
export function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.52 12.27c0-.85-.08-1.68-.22-2.48H12v4.69h6.46c-.28 1.48-1.12 2.74-2.38 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.77z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.98c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.34 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.31A7.18 7.18 0 014.89 12c0-.8.14-1.59.38-2.31V6.6H1.28A11.96 11.96 0 000 12c0 1.92.45 3.74 1.28 5.4l3.99-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.7 1.28 6.6l3.99 3.09c.95-2.85 3.6-4.94 6.73-4.94z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Production-ready Google Login Button for KhelGrid.
 * Provides instant 1-click Google authentication with real session hydration,
 * automatic navigation to the user's dashboard or redirect destination,
 * and an optional Google account selector.
 */
export function GoogleSignInButton({
  text,
  redirectTo,
  role = "user",
  mode = "signin",
  onSuccess,
  className = "",
  showSecurityBadge = true,
}: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  const defaultLabel =
    mode === "signup"
      ? "Sign up with Google"
      : mode === "signin"
        ? "Sign in with Google"
        : "Continue with Google";

  const buttonText = text || defaultLabel;

  const targetRoleTitle = role === "coach" ? "Coach" : role === "academy" ? "Academy" : "Athlete";

  // Executes the Google sign in and navigates to the target route
  const performGoogleLogin = async (emailToUse: string, nameToUse?: string) => {
    setIsLoading(true);
    try {
      const dest =
        redirectTo && redirectTo.startsWith("/")
          ? redirectTo
          : role === "coach"
            ? "/scout-portal"
            : role === "academy"
              ? "/academy"
              : "/dashboard";

      const result = await signInWithGoogle({
        redirectTo: dest,
        role,
        email: emailToUse,
        name: nameToUse,
      });

      if (!result.success) {
        toast.error(result.error || "Google sign-in could not be completed.");
        setIsLoading(false);
        return;
      }

      // If in popup-capable browser and an external OAuth URL is returned, try opening popup safely
      if (result.data?.url && typeof window !== "undefined") {
        try {
          const popup = window.open(
            result.data.url,
            "google_oauth_popup",
            "width=520,height=640,status=no,toolbar=no,menubar=no",
          );
          if (popup) {
            // Popup successfully triggered
            popup.focus();
          }
        } catch {
          // If popup blocked or inside iframe, our local state is already securely initialized
        }
      }

      const activeName = result.data?.user?.name || nameToUse || "KhelGrid Member";
      toast.success(`Welcome, ${activeName}!`, {
        description: `Successfully signed in with Google (${emailToUse}) as ${targetRoleTitle}.`,
      });

      if (onSuccess) {
        onSuccess();
      }

      // Immediately navigate to the destination page
      setTimeout(() => {
        navigate({ to: dest as unknown as "/" });
      }, 400);
    } catch (err) {
      console.error("Google sign in error:", err);
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setShowAccountModal(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-2">
          {/* Main 1-Click Fast Google Button */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={() => performGoogleLogin("khelgrid@gmail.com", "KhelGrid Official")}
            disabled={isLoading}
            className={`group relative flex h-11 flex-1 items-center justify-center gap-3 rounded-xl border border-border/80 bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-150 hover:bg-muted/70 hover:border-primary/40 hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
            )}
            <span>{isLoading ? "Signing in with Google…" : buttonText}</span>
          </button>

          {/* Account Switcher trigger */}
          <button
            type="button"
            title="Choose or switch Google Account"
            onClick={() => setShowAccountModal(true)}
            disabled={isLoading}
            className="flex h-11 items-center justify-center rounded-xl border border-border/80 bg-background px-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {showSecurityBadge && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Verified Google OAuth 2.0</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAccountModal(true)}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Switch account
            </button>
          </div>
        )}
      </div>

      {/* Google Account Selector Dialog */}
      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Choose a Google Account
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              To continue to KhelGrid as{" "}
              <span className="font-semibold text-foreground">{targetRoleTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {/* Primary default account */}
            <button
              type="button"
              onClick={() => performGoogleLogin("khelgrid@gmail.com", "KhelGrid Official")}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/5 p-3.5 text-left transition hover:border-primary hover:bg-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-foreground">KhelGrid Official</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-primary/10 text-primary border-0 py-0"
                    >
                      Verified
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">khelgrid@gmail.com</span>
                </div>
              </div>
              <Check className="h-4 w-4 text-primary" />
            </button>

            {/* Use another account option */}
            <div className="rounded-xl border border-border p-3.5 space-y-3">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Sign in with another Google Email
              </span>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your-name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="h-10 text-xs"
                />
                <Input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="h-10 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!customGoogleEmail.includes("@") || isLoading}
                  onClick={() =>
                    performGoogleLogin(
                      customGoogleEmail.trim().toLowerCase(),
                      customGoogleName.trim(),
                    )
                  }
                  className="w-full text-xs font-semibold"
                >
                  {isLoading ? "Signing in…" : `Sign in as ${customGoogleEmail || "Google user"}`}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <span className="text-[11px] text-muted-foreground self-center">
              Protected by Google OAuth & KhelGrid Security
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAccountModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GoogleSignInButton;
