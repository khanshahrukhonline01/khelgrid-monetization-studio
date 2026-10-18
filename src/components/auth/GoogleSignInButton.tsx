import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { RefreshCw, ShieldCheck } from "lucide-react";

export interface GoogleSignInButtonProps {
  /**
   * Optional custom button label (defaults to "Continue with Google").
   */
  text?: string;
  /**
   * Target internal route to redirect to after successful authentication.
   */
  redirectTo?: string;
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
 * Standard Google 'G' Logo SVG according to Google Branding Guidelines:
 * Red: #EA4335, Yellow: #FBBC05, Green: #34A853, Blue: #4285F4.
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
 * High-performance, production-grade Google Login Button for KhelGrid.
 * Connects directly to Supabase Google OAuth provider, handling redirect URLs,
 * real-time session updates, and state persistence.
 */
export function GoogleSignInButton({
  text,
  redirectTo,
  mode = "signin",
  onSuccess,
  className = "",
  showSecurityBadge = true,
}: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const defaultLabel =
    mode === "signup"
      ? "Sign up with Google"
      : mode === "signin"
        ? "Sign in with Google"
        : "Continue with Google";

  const buttonText = text || defaultLabel;

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const targetUrl =
        redirectTo ||
        (typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}${window.location.search}`
          : undefined);

      const result = await signInWithGoogle(targetUrl);

      if (!result.success) {
        toast.error(result.error || "Google sign-in could not be completed.");
        setIsLoading(false);
        return;
      }

      // If Supabase returned an OAuth redirect URL, browser will redirect
      if (result.data?.url) {
        window.location.href = result.data.url;
        return;
      }

      // If authenticated immediately in local session
      toast.success("Signed in with Google successfully!", {
        description: "Welcome to KhelGrid sports network.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Google sign-in exception:", err);
      const msg = err instanceof Error ? err.message : "Failed to connect with Google.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={`group relative flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-150 hover:bg-muted/70 hover:border-primary/40 hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
        )}
        <span>{isLoading ? "Connecting to Google…" : buttonText}</span>
      </button>

      {showSecurityBadge && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>Encrypted 256-bit OAuth 2.0 verification</span>
        </div>
      )}
    </div>
  );
}

export default GoogleSignInButton;
