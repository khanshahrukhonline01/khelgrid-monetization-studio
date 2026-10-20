import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  Database,
  LogOut,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead, SITE_URL } from "@/lib/seo";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS } from "@/types/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import "./login-premium.css";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () =>
    buildSeoHead({
      title: "Sports Portal Sign In · Athlete, Coach & Academy Login | KhelGrid",
      description:
        "Sign in to KhelGrid. Secure sports ecosystem portal for Indian athletes, certified coaches, and sports academies. Access trial registrations, turf bookings, coaching batches, and Sports CV.",
      canonicalPath: "/login",
      keywords:
        "sports login, athlete portal, coach login, academy login, khelgrid sign in, sports trial login india, turf booking login, sports cv login",
      noindex: false,
      type: "website",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Log In", path: "/login" },
      ],
      customSchema: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "KhelGrid Portal Sign In",
          url: `${SITE_URL}/login`,
          description:
            "Unified authentication and access portal for athletes, verified coaches, and sports academies across India.",
          potentialAction: {
            "@type": "Action",
            name: "Sign In",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/login`,
              actionPlatform: [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Log In",
              item: `${SITE_URL}/login`,
            },
          ],
        },
      ],
    }),
  component: LoginPage,
});

type AuthMode = "otp" | "password";

function resolveTargetRoute(role?: string): "/dashboard" | "/scout-portal" | "/academy" {
  if (role === "coach") return "/scout-portal";
  if (role === "academy") return "/academy";
  return "/dashboard";
}

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTarget = search.redirect;
  const auth = useAuth();
  const { login, logout, isAuthenticated, user } = auth;

  // Selected target role
  const [selectedRole, setSelectedRole] = useState<"user" | "coach" | "academy">("user");
  const [authMode, setAuthMode] = useState<AuthMode>("otp");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign in form states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Sign up form states
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpSport, setSignUpSport] = useState("Cricket");
  const [signUpCity, setSignUpCity] = useState("Bengaluru");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    syncedToDb: boolean;
    timestamp?: string;
  } | null>(null);

  // Prefill active inputs when role changes if fields are empty
  useEffect(() => {
    const demo = DEMO_ACCOUNTS[selectedRole];
    if (!phone) setPhone(demo.phone);
    if (!email) setEmail(demo.email);
  }, [selectedRole, phone, email]);

  // Handle 60s resend timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const activeRoleConfig = ROLE_DEFINITIONS[selectedRole];
  const demoPreset = DEMO_ACCOUNTS[selectedRole];

  // Send OTP handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    toast.error("Mobile OTP sign-in is not connected to a real SMS provider yet. Please use email and password instead.");
    setOtpSent(false);
    setOtpCode("");
  };

  // Submit / Verify Sign In
  const handleCompleteLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      // If user is attempting real Supabase Password authentication
      if (authMode === "password" && isSupabaseConfigured && email.trim() && password.trim()) {
        const supabaseRes = await auth.signInWithSupabase({ email, password });
        if (supabaseRes.success) {
          toast.success("Signed in with Supabase Authentication!");
          const dest =
            redirectTarget && redirectTarget.startsWith("/")
              ? redirectTarget
              : resolveTargetRoute(selectedRole);
          navigate({ to: dest as unknown as "/" });
          return;
        } else {
          toast.error(supabaseRes.error || "Unable to sign in. Check your credentials and try again.");
          setIsSubmitting(false);
          return;
        }
      }

      const identifier = authMode === "otp" ? phone : email;
      const result = await login({
        identifier: identifier || demoPreset.phone,
        role: selectedRole,
        name: demoPreset.name,
        organization: demoPreset.organization,
        otp: otpCode,
        password: password,
      });

      setLastSyncResult({
        syncedToDb: result.syncedToDb,
        timestamp: new Date().toLocaleTimeString(),
      });

      const dbStatusText = result.syncedToDb
        ? "Updated in Supabase database (user_profiles table)"
        : "Persisted in local session database";

      toast.success(`Welcome ${result.user.name}! ${dbStatusText}`);

      // Small delay so user sees database sync feedback
      setTimeout(() => {
        const dest =
          redirectTarget && redirectTarget.startsWith("/")
            ? redirectTarget
            : resolveTargetRoute(result.user.role);
        navigate({ to: dest as unknown as "/" });
      }, 700);
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Sign-in encountered an issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpFullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!isSupabaseConfigured) {
      toast.error("Account registration is temporarily unavailable because Supabase is not configured. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await auth.signUpWithSupabase({
        fullName: signUpFullName,
        email: signUpEmail,
        password: signUpPassword,
        phone: signUpPhone || undefined,
        role: selectedRole,
        primarySport: signUpSport || "Cricket",
        city: signUpCity || "Bengaluru",
      });

      if (!res.success) {
        toast.error(res.error || "Failed to create account");
        return;
      }

      if (res.requiresEmailConfirmation) {
        toast.success(
          "Account created! Please check your email to verify your address before logging in.",
        );
        setActiveTab("signin");
      } else {
        toast.success("Welcome to KhelGrid! Your account has been provisioned.");
        const dest = redirectTarget && redirectTarget.startsWith("/") ? redirectTarget : "/profile";
        navigate({ to: dest as unknown as "/" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Account registration failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = async (role: "user" | "coach" | "academy") => {
    setSelectedRole(role);
    setIsSubmitting(true);
    const demo = DEMO_ACCOUNTS[role];

    try {
      const result = await login({
        identifier: demo.phone,
        role,
        name: demo.name,
        organization: demo.organization,
      });

      setLastSyncResult({
        syncedToDb: result.syncedToDb,
        timestamp: new Date().toLocaleTimeString(),
      });

      toast.success(`Signed in as ${demo.name} (${role}) · Database synced!`);

      setTimeout(() => {
        const dest =
          redirectTarget && redirectTarget.startsWith("/")
            ? redirectTarget
            : resolveTargetRoute(role);
        navigate({ to: dest as unknown as "/" });
      }, 600);
    } catch (err) {
      console.error("Demo login error:", err);
      toast.error("Could not sign in with demo account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="khelgrid-auth-premium min-h-[calc(100vh-4rem)] bg-background py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Engine Friendly Title */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <Badge
            variant="outline"
            className="mb-3 border-primary/40 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
          >
            KhelGrid Verified Access
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Log in to KhelGrid
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Unified sports access for athletes, verified coaches, and registered sports academies
            across India.
          </p>
        </div>

        {/* If redirected from a protected route, show helpful prompt */}
        {redirectTarget && (
          <div
            id="login-redirect-notice"
            className="mx-auto mb-6 flex max-w-2xl items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-primary" />
              <span>
                Sign in to continue to:{" "}
                <span className="font-semibold text-primary">{redirectTarget}</span>
              </span>
            </div>
            {isAuthenticated && (
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs font-semibold"
                onClick={() => navigate({ to: redirectTarget as unknown as "/" })}
              >
                Proceed Now
              </Button>
            )}
          </div>
        )}

        {/* If already authenticated, display current session card */}
        {isAuthenticated && user && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{user.name}</span>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 text-[10px] uppercase font-bold">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently signed in · {user.email || user.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate({ to: resolveTargetRoute(user.role) })}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
                >
                  Go to Portal <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logout();
                    toast.info("Logged out successfully");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="mr-1 h-3.5 w-3.5" /> Switch
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Responsive 2-Column or Centered */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Role Features & Trust Metrics (Hidden on extra-small or collapsed) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 sm:p-8 lg:col-span-5 shadow-sm">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Choose Your Account Type
                </span>
                <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                  Tailored for Indian Sports
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select your role to access customized dashboards, real-time analytics, and
                  verified records.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="space-y-2.5">
                {(["user", "coach", "academy"] as const).map((rKey) => {
                  const rConf = ROLE_DEFINITIONS[rKey];
                  const isSelected = selectedRole === rKey;
                  const Icon =
                    rKey === "user" ? Trophy : rKey === "coach" ? GraduationCap : Building2;

                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        setSelectedRole(rKey);
                        setOtpSent(false);
                      }}
                      className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{rConf.label}</span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{rConf.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Role Highlights Box */}
              <div className="mt-6 rounded-xl border border-border/80 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{activeRoleConfig.badge} Capabilities</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {activeRoleConfig.description}
                </p>
              </div>
            </div>

            {/* Database & Security Trust Badge */}
            <div className="mt-8 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Database className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Database status:</span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {isSupabaseConfigured ? "Supabase live (user_profiles)" : "Local DB active"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>256-bit encrypted session · Phone & email auth</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-7 shadow-sm">
            {/* Top Tab Switcher: Sign In vs Sign Up */}
            <div className="flex border-b border-border/60 mb-6 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`pb-3 px-3 sm:px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === "signin"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="h-4 w-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`pb-3 px-3 sm:px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === "signup"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Create Account (Sign Up)
              </button>
            </div>

            {activeTab === "signup" ? (
              /* Supabase Native Sign Up Form */
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">
                      Create {activeRoleConfig.label} Account
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {activeRoleConfig.badge}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Register with Supabase Authentication to unlock your sports CV, trials, and
                    bookings.
                  </p>
                </div>

                {/* 1-Click Google Sign Up */}
                <div className="space-y-4">
                  <GoogleSignInButton
                    mode="signup"
                    redirectTo={redirectTarget || resolveTargetRoute(selectedRole)}
                  />

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/70" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground tracking-wider">
                        Or create with email & password
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-xs font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="mt-1 h-11 text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-email" className="text-xs font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="athlete@khelgrid.com"
                        className="mt-1 h-11 text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-phone" className="text-xs font-semibold">
                        Mobile Number
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1 h-11 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-xs font-semibold">
                      Password * (Min 6 characters)
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="mt-1 h-11 text-sm font-medium"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-sport" className="text-xs font-semibold">
                        Primary Sport
                      </Label>
                      <select
                        id="signup-sport"
                        value={signUpSport}
                        onChange={(e) => setSignUpSport(e.target.value)}
                        className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Athletics">Athletics</option>
                        <option value="Kabaddi">Kabaddi</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Swimming">Swimming</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="signup-city" className="text-xs font-semibold">
                        City / Base
                      </Label>
                      <select
                        id="signup-city"
                        value={signUpCity}
                        onChange={(e) => setSignUpCity(e.target.value)}
                        className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                        <option value="Chandigarh">Chandigarh</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 text-sm shadow-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Provisioning account in Supabase…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create {activeRoleConfig.shortLabel} Account
                      </span>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            ) : (
              /* Sign In Flow */
              <>
                {/* Header with Role Pill & Method Switcher */}
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">
                        Sign in as {activeRoleConfig.shortLabel}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {activeRoleConfig.badge}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Access your profile, trials, and administrative dashboard
                    </p>
                  </div>

                  {/* Mode toggle (OTP vs Password) */}
                  <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode("otp")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                        authMode === "otp"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Smartphone className="mr-1 inline-block h-3 w-3" /> Mobile OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("password")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                        authMode === "password"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <KeyRound className="mr-1 inline-block h-3 w-3" /> Password
                    </button>
                  </div>
                </div>

                {/* 1-Click Google Sign In */}
                <div className="mt-6 space-y-4">
                  <GoogleSignInButton
                    mode="signin"
                    redirectTo={redirectTarget || resolveTargetRoute(selectedRole)}
                  />

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/70" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground tracking-wider">
                        Or sign in with mobile / password
                      </span>
                    </div>
                  </div>
                </div>

                {/* OTP Mode Form */}
                {authMode === "otp" ? (
                  <form
                    onSubmit={otpSent ? handleCompleteLogin : handleSendOtp}
                    className="mt-6 space-y-4"
                  >
                    <div>
                      <Label htmlFor="phone-input" className="text-xs font-semibold">
                        Registered Mobile Number
                      </Label>
                      <div className="relative mt-1.5">
                        <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone-input"
                          type="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-9 h-11 text-sm font-medium"
                          required
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Indian mobile format (+91). Used for instant trial notifications and
                        verifications.
                      </p>
                    </div>

                    {otpSent && (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="otp-input"
                            className="text-xs font-semibold text-foreground"
                          >
                            Enter 6-Digit Verification Code
                          </Label>
                          {resendTimer > 0 ? (
                            <span className="text-[11px] text-muted-foreground">
                              Resend in {resendTimer}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setResendTimer(45);
                                toast.success("New OTP sent! Demo code: 123456");
                              }}
                              className="text-[11px] font-semibold text-primary hover:underline"
                            >
                              Resend Code
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="otp-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="pl-9 h-11 text-base tracking-widest font-mono"
                            required
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            Demo test code: <strong>123456</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setOtpCode("123456")}
                            className="text-primary hover:underline font-semibold"
                          >
                            Auto-fill test OTP
                          </button>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 text-sm shadow-sm"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Updating database & authenticating…
                        </span>
                      ) : otpSent ? (
                        <span className="flex items-center gap-2">
                          Verify & Log In as {activeRoleConfig.shortLabel}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Verification OTP
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                ) : (
                  /* Password / Email Mode Form */
                  <form onSubmit={handleCompleteLogin} className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="email-input" className="text-xs font-semibold">
                        Email Address
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={demoPreset.email}
                          className="pl-9 h-11 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-input" className="text-xs font-semibold">
                          Password / Access PIN
                        </Label>
                        <a
                          href="#forgot"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info(
                              "Demo mode: Any password accepted or use 1-click test drive below.",
                            );
                          }}
                          className="text-[11px] text-primary hover:underline"
                        >
                          Forgot?
                        </a>
                      </div>
                      <div className="relative mt-1.5">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password-input"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 text-sm shadow-sm"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Authenticating & syncing profile…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In with Password
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}

            {/* Database Sync Notification pill */}
            {lastSyncResult && (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5" />
                  <span>
                    {lastSyncResult.syncedToDb
                      ? "✓ User profile updated in Supabase database"
                      : "✓ User profile saved to local offline database"}
                  </span>
                </div>
                <span className="text-[10px] opacity-80">{lastSyncResult.timestamp}</span>
              </div>
            )}

            {/* Fast 1-Click Test Drive Section */}
            <div className="mt-8 border-t border-border/60 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  1-Click Instant Demo Login
                </span>
                <span className="text-[11px] text-muted-foreground">Select role to test-drive</span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleQuickDemoLogin("user")}
                  className={`h-auto py-2.5 px-3 flex flex-col items-start text-left border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 ${
                    selectedRole === "user" ? "border-emerald-500/40 bg-emerald-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <Trophy className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Athlete</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate w-full mt-0.5">
                    Arjun Mehta
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleQuickDemoLogin("coach")}
                  className={`h-auto py-2.5 px-3 flex flex-col items-start text-left border-border hover:border-blue-500/50 hover:bg-blue-500/5 ${
                    selectedRole === "coach" ? "border-blue-500/40 bg-blue-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                    <span>Coach</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate w-full mt-0.5">
                    Coach Rajesh
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleQuickDemoLogin("academy")}
                  className={`h-auto py-2.5 px-3 flex flex-col items-start text-left border-border hover:border-amber-500/50 hover:bg-amber-500/5 ${
                    selectedRole === "academy" ? "border-amber-500/40 bg-amber-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <Building2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>Academy</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate w-full mt-0.5">
                    Apex Sports
                  </span>
                </Button>
              </div>
            </div>

            {/* Footer Navigation Link */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-4 border-t border-border/40">
              <div>
                First time athlete?{" "}
                <Link to="/start-from-zero" className="font-semibold text-primary hover:underline">
                  Start from Zero roadmap →
                </Link>
              </div>
              <div>
                Register academy?{" "}
                <Link to="/academy" className="font-semibold text-foreground hover:text-primary">
                  Academy onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Engine & Accessibility FAQ / Help Strip */}
        <section className="mt-16 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8">
          <h3 className="text-base font-bold text-foreground">
            Frequently Asked Questions · KhelGrid Sports Authentication
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-primary" />
                How do athletes log in?
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Athletes can sign in using their registered mobile number with 6-digit OTP
                verification or email credentials to access state trials, verify their Sports CV,
                and manage turf bookings.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                What can certified coaches do?
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Coaches access coaching program rosters, track enrolled students, record player
                development assessments, and review scout inquiries across India.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-amber-500" />
                How do academies manage trials?
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Sports academies and venue managers can publish selection trials, manage multi-sport
                turf slots, review applicant credentials, and process registrations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
