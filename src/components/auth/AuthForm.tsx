import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Trophy,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  UserCheck,
  CheckCircle2,
  Smartphone,
  AlertCircle,
  Building2,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS } from "@/types/auth";
import { SPORTS, CITIES } from "@/data/trials";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { GoogleSignInButton } from "./GoogleSignInButton";

export interface AuthFormProps {
  /**
   * The tab displayed by default ('signin' or 'signup').
   */
  defaultTab?: "signin" | "signup";
  /**
   * Default role to preselect ('user', 'coach', or 'academy').
   */
  defaultRole?: "user" | "coach" | "academy";
  /**
   * Destination path after successful authentication.
   */
  redirectTo?: string;
  /**
   * Callback fired on successful sign in or sign up.
   */
  onSuccess?: (user: unknown) => void;
  /**
   * Additional CSS classes for the root container.
   */
  className?: string;
  /**
   * Whether to display 1-click demo test account cards.
   */
  showDemoAccounts?: boolean;
  /**
   * Optional custom title for the card header.
   */
  title?: string;
  /**
   * Optional custom subtitle/description.
   */
  description?: string;
}

export function AuthForm({
  defaultTab = "signin",
  defaultRole = "user",
  redirectTo,
  onSuccess,
  className = "",
  showDemoAccounts = true,
  title,
  description,
}: AuthFormProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    isAuthenticated,
    user,
    role: currentRole,
    signInWithEmail,
    signUpWithEmail,
    login,
    logout,
    signOut,
  } = auth;

  const [view, setView] = useState<"auth" | "forgot">("auth");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab);
  const [role, setRole] = useState<"user" | "coach" | "academy">(defaultRole);
  const [signInMode, setSignInMode] = useState<"password" | "otp">("password");

  // Sign In Form States
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInOtp, setSignInOtp] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form States
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpSport, setSignUpSport] = useState("Cricket");
  const [signUpCity, setSignUpCity] = useState("Bengaluru");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const resolveTargetRoute = (targetRole: string) => {
    if (redirectTo) return redirectTo;
    if (targetRole === "coach") return "/scout-portal";
    if (targetRole === "academy") return "/academy";
    return "/dashboard";
  };

  const targetRoute = resolveTargetRoute(role);

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = signInIdentifier.trim();
    if (!identifier) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }

    setLoading(true);

    try {
      if (signInMode === "password") {
        if (!signInPassword) {
          setErrorMessage("Please enter your password.");
          setLoading(false);
          return;
        }

        // Try direct Supabase sign in if identifier contains an email address
        if (identifier.includes("@") && signInWithEmail) {
          const res = await signInWithEmail(identifier, signInPassword);
          if (res.success && res.data) {
            toast.success("Welcome back!", {
              description: `Signed in successfully as ${identifier}`,
            });
            const target = resolveTargetRoute(role);
            if (onSuccess) onSuccess(res.data);
            navigate({ to: target });
            return;
          } else if (res.error && !res.error.toLowerCase().includes("not configured")) {
            setErrorMessage(res.error);
            setLoading(false);
            return;
          }
        }

        // Fallback or demo login via existing AuthContext
        const result = await login({
          identifier,
          password: signInPassword,
          role,
        });

        if (result.success) {
          toast.success("Welcome back!", {
            description: result.message || `Signed in as ${result.user.name}`,
          });
          const target = resolveTargetRoute(role);
          if (onSuccess) onSuccess(result.user);
          navigate({ to: target });
        } else {
          setErrorMessage(result.message || "Failed to sign in. Please verify credentials.");
        }
      } else {
        // OTP Mode
        if (!otpSent) {
          // Simulate OTP trigger
          setOtpSent(true);
          toast.success("Verification Code Sent", {
            description: `We've sent a 6-digit OTP code to ${identifier}. (Use '123456' for demo)`,
          });
          setLoading(false);
          return;
        }

        if (!signInOtp.trim()) {
          setErrorMessage("Please enter the 6-digit OTP code sent to your phone.");
          setLoading(false);
          return;
        }

        const result = await login({
          identifier,
          otp: signInOtp.trim(),
          role,
        });

        if (result.success) {
          toast.success("Verified successfully!", {
            description: `Signed in as ${result.user.name}`,
          });
          const target = resolveTargetRoute(role);
          if (onSuccess) onSuccess(result.user);
          navigate({ to: target });
        } else {
          setErrorMessage(result.message || "Invalid OTP code.");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected authentication error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = signUpEmail.trim();
    const fullName = signUpFullName.trim();
    const password = signUpPassword;

    if (!fullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        fullName,
        role: role === "coach" ? "coach" : role === "academy" ? "academy_owner" : "athlete",
        phone: signUpPhone.trim() || undefined,
        primarySport: signUpSport,
        city: signUpCity,
      };

      const res = await signUpWithEmail(email, password, metadata);

      if (res.success) {
        if (res.requiresEmailConfirmation) {
          toast.success("Registration Successful!", {
            description: "Please check your inbox to confirm your email address.",
          });
        } else {
          toast.success("Account Created!", {
            description: `Welcome to KhelGrid, ${fullName}! Your athletic profile is ready.`,
          });
          const target = resolveTargetRoute(role);
          if (onSuccess) onSuccess(res.data);
          navigate({ to: target });
        }
      } else {
        // If Supabase returns error or not configured, fall back to login creation
        if (res.error && !res.error.toLowerCase().includes("not configured")) {
          setErrorMessage(res.error);
        } else {
          const fallbackRes = await login({
            identifier: email,
            role,
            name: fullName,
            password,
          });
          toast.success("Account Created!", {
            description: `Welcome to KhelGrid, ${fullName}!`,
          });
          const target = resolveTargetRoute(role);
          if (onSuccess) onSuccess(fallbackRes.user);
          navigate({ to: target });
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Login
  const handleQuickDemo = async (demoRole: "user" | "coach" | "academy") => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const demoAccount = DEMO_ACCOUNTS[demoRole];
      const result = await login({
        identifier: demoAccount.phone,
        role: demoRole,
        name: demoAccount.name,
      });

      toast.success(`Signed in as ${demoAccount.name}`, {
        description: `Active role: ${ROLE_DEFINITIONS[demoRole].label}`,
      });

      const target = resolveTargetRoute(demoRole);
      if (onSuccess) onSuccess(result.user);
      navigate({ to: target });
    } catch {
      toast.error("Failed to sign in to demo account");
    } finally {
      setLoading(false);
    }
  };

  // If user requested forgot password view
  if (view === "forgot") {
    return (
      <ForgotPasswordForm
        className={className}
        defaultEmail={signInIdentifier.includes("@") ? signInIdentifier : ""}
        onBackToSignIn={() => setView("auth")}
      />
    );
  }

  // If already authenticated, show convenient session status card
  if (isAuthenticated && user) {
    const targetRoute = resolveTargetRoute(currentRole);

    return (
      <Card className={`border-primary/20 bg-card shadow-sm ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-2">
            <UserCheck className="h-6 w-6" />
          </div>
          <Badge
            variant="outline"
            className="mx-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-0.5"
          >
            Currently signed in
          </Badge>
          <CardTitle className="text-xl font-bold mt-2">{user.name}</CardTitle>
          <CardDescription className="text-xs">
            {user.email || user.phone} · Role:{" "}
            <span className="font-semibold text-foreground capitalize">{currentRole}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <Button asChild className="w-full bg-primary font-semibold text-primary-foreground gap-2">
            <Link to={targetRoute}>
              Go to Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              if (signOut) await signOut();
              else if (logout) await logout();
              toast.info("Signed out successfully");
            }}
            className="w-full text-xs text-muted-foreground hover:text-foreground gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out / Switch Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-border/80 bg-card/95 backdrop-blur-sm shadow-md ${className}`}>
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5"
          >
            <ShieldCheck className="h-3 w-3 mr-1 inline" />
            KhelGrid Sports ID
          </Badge>
          <span className="text-[11px] text-muted-foreground">Secure Access</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {title || "Welcome to KhelGrid"}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {description ||
            "Join India's verified sports network for athletes, certified coaches, and sports academies."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Selector Tabs */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            Select Your Account Type
          </Label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                role === "user"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              Athlete / Player
            </button>
            <button
              type="button"
              onClick={() => setRole("coach")}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                role === "coach"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Coach / Trainer
            </button>
            <button
              type="button"
              onClick={() => setRole("academy")}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                role === "academy"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Academy / Club
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="py-2.5 px-3 text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-1 text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* 1-Click Fast Google Sign-In */}
        <div className="space-y-3">
          <GoogleSignInButton
            mode={activeTab}
            redirectTo={targetRoute}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              navigate({ to: targetRoute });
            }}
          />

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/70" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2.5 text-[10px] font-semibold text-muted-foreground tracking-wider">
                Or continue with credentials
              </span>
            </div>
          </div>
        </div>

        {/* Tabs: Sign In / Sign Up */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as "signin" | "signup");
            setErrorMessage(null);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/70 p-1">
            <TabsTrigger
              value="signin"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* ===================== SIGN IN TAB ===================== */}
          <TabsContent value="signin" className="mt-4 space-y-4">
            {/* Sign in mode selector: Password vs OTP */}
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-medium text-muted-foreground">Sign-in method:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSignInMode("password");
                    setErrorMessage(null);
                  }}
                  className={`text-xs font-medium px-2 py-0.5 rounded-md transition ${
                    signInMode === "password"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Password
                </button>
                <span className="text-muted-foreground/40">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setSignInMode("otp");
                    setErrorMessage(null);
                  }}
                  className={`text-xs font-medium px-2 py-0.5 rounded-md transition ${
                    signInMode === "otp"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="signin-identifier" className="text-xs font-medium">
                  {signInMode === "otp" ? "Mobile Phone Number" : "Email or Mobile"}
                </Label>
                <div className="relative">
                  {signInMode === "otp" ? (
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                  <Input
                    id="signin-identifier"
                    type={signInMode === "otp" ? "tel" : "text"}
                    required
                    placeholder={
                      signInMode === "otp" ? "+91 98765 43210" : "athlete@example.com or phone"
                    }
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>

              {signInMode === "password" ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-xs font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setView("forgot");
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-9 pr-9 text-xs h-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSignInPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                otpSent && (
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-otp" className="text-xs font-medium">
                      Enter 6-Digit OTP
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-otp"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={signInOtp}
                        onChange={(e) => setSignInOtp(e.target.value)}
                        className="pl-9 text-xs h-9 font-mono tracking-widest"
                      />
                    </div>
                  </div>
                )
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground gap-2 mt-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Authenticating...
                  </>
                ) : signInMode === "otp" && !otpSent ? (
                  <>
                    <Smartphone className="h-3.5 w-3.5" />
                    Send Verification Code
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Log in to KhelGrid
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* ===================== SIGN UP TAB ===================== */}
          <TabsContent value="signup" className="mt-4 space-y-3.5">
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="signup-name" className="text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-xs font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="athlete@khelgrid.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-9 text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-phone" className="text-xs font-medium">
                    Phone (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="pl-9 text-xs h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="signup-password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="pl-9 pr-9 text-xs h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Primary Sport</Label>
                  <Select value={signUpSport} onValueChange={setSignUpSport}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">City</Label>
                  <Select value={signUpCity} onValueChange={setSignUpCity}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground gap-2 mt-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Complete Registration
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* 1-Click Demo Quick Switch Cards */}
        {showDemoAccounts && (
          <div className="pt-2">
            <div className="relative my-3">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Or Instant Demo Test Drive
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("user")}
                className="rounded-xl border border-border/70 bg-card p-2 text-left hover:border-primary/50 transition hover:bg-muted/40"
              >
                <div className="text-[11px] font-bold text-foreground truncate">Arjun Mehta</div>
                <div className="text-[10px] text-muted-foreground">Athlete Pass</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("coach")}
                className="rounded-xl border border-border/70 bg-card p-2 text-left hover:border-primary/50 transition hover:bg-muted/40"
              >
                <div className="text-[11px] font-bold text-foreground truncate">Coach Rajesh</div>
                <div className="text-[10px] text-muted-foreground">Scout Portal</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("academy")}
                className="rounded-xl border border-border/70 bg-card p-2 text-left hover:border-primary/50 transition hover:bg-muted/40"
              >
                <div className="text-[11px] font-bold text-foreground truncate">Apex Sports</div>
                <div className="text-[10px] text-muted-foreground">Academy Hub</div>
              </button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/60 py-3 text-[11px] text-muted-foreground">
        <span>Protected with SSL encryption</span>
        <Link to="/trust-center" className="text-primary hover:underline">
          Trust Center & Privacy
        </Link>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
