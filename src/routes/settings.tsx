import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Palette,
  Sun,
  Moon,
  Monitor,
  Save,
  RotateCcw,
  ChevronRight,
  Mail,
  MessageSquare,
  Smartphone,
  LifeBuoy,
  Bug,
  Lightbulb,
  LogOut,
  LogIn,
  User,
  Briefcase,
  Handshake,
  ShieldAlert,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { useAuth, withProtectedRoute } from "@/hooks/use-auth";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import { FeedbackSupportDialog, FeedbackType } from "@/components/FeedbackSupportDialog";

export const Route = createFileRoute("/settings")({
  head: () =>
    buildSeoHead({
      title: "Account & Application Settings · KhelGrid",
      description:
        "Manage your KhelGrid user account, alert notifications, privacy settings, athlete profile visibility, and theme preferences.",
      canonicalPath: "/settings",
      noindex: true,
      type: "website",
    }),
  component: withProtectedRoute(SettingsPage, {
    message: "Sign in to manage your account settings, privacy, and preferences.",
  }),
});

interface SettingsState {
  notifications: Record<string, boolean>;
  privacy: Record<string, boolean>;
  advertising: Record<string, boolean>;
  preferences: Record<string, string>;
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const auth = useAuth();
  const navigate = useNavigate();
  const { isAuthenticated, name, email, role = "user", logout } = auth;
  const isAuth = Boolean(isAuthenticated);
  const userName = name || auth.user?.name || "Athlete";
  const userEmail = email || auth.user?.email || "";

  const handleLogout = () => {
    try {
      if (typeof logout === "function") {
        logout();
      }
      toast.success("Logged out successfully");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Sign out error", err);
      toast.error("Failed to log out");
    }
  };

  const [activeTab, setActiveTab] = useState<
    "account" | "notifications" | "privacy" | "appearance" | "support"
  >("account");
  const [saved, setSaved] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [submittedHistory, setSubmittedHistory] = useState<
    Array<{ id: string; type: string; title: string; date: string; category?: string }>
  >([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("khelgrid_user_feedback") || "[]");
      setSubmittedHistory(stored);
    } catch {
      // safe fallback
    }
  }, [feedbackOpen]);

  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profilePublic: true,
      showActivity: false,
      allowMessages: true,
    },
    advertising: {
      personalized: true,
      trackingAllowed: true,
      targetedAds: true,
    },
    preferences: {
      theme: "system",
      language: "en",
      emailFrequency: "weekly",
    },
  });

  const toggleSetting = (category: keyof SettingsState, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as Record<string, boolean>)[key],
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    setTheme("auto");
    setLanguage("en");
    setSettings({
      notifications: { email: true, sms: false, push: true },
      privacy: { profilePublic: true, showActivity: false, allowMessages: true },
      advertising: { personalized: true, trackingAllowed: true, targetedAds: true },
      preferences: { theme: "auto", language: "en", emailFrequency: "weekly" },
    });
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account, notifications & preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-2">
              {[
                { id: "account", label: "Account", icon: "👤" },
                { id: "notifications", label: "Notifications", icon: "🔔" },
                { id: "privacy", label: "Privacy", icon: "🔒" },
                { id: "appearance", label: "Appearance", icon: "🎨" },
                { id: "support", label: "Support & Feedback", icon: "🛟" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block font-semibold text-slate-900 dark:text-white">
                          Language / भाषा
                        </label>
                        <span className="text-xs text-muted-foreground">
                          Changes apply across the entire application
                        </span>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => {
                          const newLang = e.target.value as LanguageCode;
                          setLanguage(newLang);
                          setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, language: newLang },
                          });
                          toast.success("Application language updated");
                        }}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-background dark:bg-slate-700 text-foreground text-sm font-medium"
                      >
                        {supportedLanguages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name} ({lang.nativeName}) — {lang.region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t pt-6" />
                    <div>
                      <label className="block font-semibold text-slate-900 dark:text-white mb-3">
                        Email Frequency
                      </label>
                      <select
                        value={settings.preferences.emailFrequency}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              emailFrequency: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-slate-700"
                      >
                        <option value="daily">📅 Daily</option>
                        <option value="weekly">📆 Weekly</option>
                        <option value="monthly">📊 Monthly</option>
                        <option value="never">🚫 Never</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account & Authentication</CardTitle>
                    <CardDescription>
                      Manage your current session and login credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isAuth ? (
                      <>
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-green-900 dark:text-green-100">
                              Signed in as {userName}
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              {userEmail ? `${userEmail} · ` : ""}Role:{" "}
                              <span className="capitalize font-medium">{role}</span>
                            </p>
                          </div>
                          <Badge className="bg-green-600">Active</Badge>
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button
                            id="settings-logout-btn"
                            variant="destructive"
                            onClick={handleLogout}
                            className="gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Log Out of Account
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:flex-row sm:items-center">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">Guest Athlete Mode</p>
                          <p className="text-sm text-muted-foreground">
                            You are not signed in. Log in or create an account to save your CV,
                            stats, and trial registrations.
                          </p>
                        </div>
                        <Button
                          id="settings-login-btn"
                          onClick={() => navigate({ to: "/login" })}
                          className="shrink-0 gap-2"
                        >
                          <LogIn className="h-4 w-4" />
                          Log In / Sign Up
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          Email Notifications
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Receive trial updates and recommendations
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={() => toggleSetting("notifications", "email")}
                    />
                  </div>

                  <div className="flex items-start justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex gap-3">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">
                          Push Notifications
                        </p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Get real-time alerts on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={() => toggleSetting("notifications", "push")}
                    />
                  </div>

                  <div className="flex items-start justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex gap-3">
                      <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Get important updates via text message
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={() => toggleSetting("notifications", "sms")}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile & Activity</CardTitle>
                    <CardDescription>Control your visibility and data sharing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Public Profile
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Allow others to view your profile and achievements
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.profilePublic}
                        onCheckedChange={() => toggleSetting("privacy", "profilePublic")}
                      />
                    </div>

                    <div className="border-t pt-6" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Show Activity
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Let others see your recent trial applications
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.showActivity}
                        onCheckedChange={() => toggleSetting("privacy", "showActivity")}
                      />
                    </div>

                    <div className="border-t pt-6" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Allow Direct Messages
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive messages from coaches and organizers
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowMessages}
                        onCheckedChange={() => toggleSetting("privacy", "allowMessages")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <CardTitle>Advertising Preferences</CardTitle>
                        <CardDescription>GDPR & Google Policy Compliant</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Personalized Ads</p>
                      <Switch
                        checked={settings.advertising.personalized}
                        onCheckedChange={() => toggleSetting("advertising", "personalized")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Allow Tracking</p>
                      <Switch
                        checked={settings.advertising.trackingAllowed}
                        onCheckedChange={() => toggleSetting("advertising", "trackingAllowed")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">Targeted Ads</p>
                      <Switch
                        checked={settings.advertising.targetedAds}
                        onCheckedChange={() => toggleSetting("advertising", "targetedAds")}
                      />
                    </div>

                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      → Manage Google Ad Settings
                    </a>
                  </CardContent>
                </Card>

                {/* Platform Legal & Safeguarding Policies */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">
                          Platform Policies & Athlete Safeguarding
                        </CardTitle>
                        <CardDescription>
                          Review your rights, refund timelines, and anti-harassment standards
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Link
                        to="/cancellation-policy"
                        className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5 transition hover:border-primary/50 hover:bg-muted/30"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <RotateCcw className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Cancellation & Refund Policy
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Turf bookings, trials, rainout guarantees & SLA
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/posh-policy"
                        className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5 transition hover:border-primary/50 hover:bg-muted/30"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 mt-0.5">
                          <ShieldAlert className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            POSH & Safe Sports Policy
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Zero tolerance, ICC committee & POCSO protection
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/privacy"
                        className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5 transition hover:border-primary/50 hover:bg-muted/30"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Privacy Policy</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Data collection, cookie usage & athlete security
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/terms"
                        className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5 transition hover:border-primary/50 hover:bg-muted/30"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Terms of Service</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Platform terms, fair play & organizer rules
                          </p>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Theme Selection</CardTitle>
                  <CardDescription>Choose your preferred appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Light Theme */}
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition cursor-pointer ${
                        theme === "light"
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 bg-card hover:border-border"
                      }`}
                    >
                      <Sun className="h-8 w-8 text-amber-500 mb-3" />
                      <span className="font-semibold text-foreground">Light</span>
                      <span className="text-xs text-muted-foreground mt-1">Bright and clear</span>
                    </button>

                    {/* Dark Theme */}
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition cursor-pointer ${
                        theme === "dark"
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 bg-card hover:border-border"
                      }`}
                    >
                      <Moon className="h-8 w-8 text-sky-400 mb-3" />
                      <span className="font-semibold text-foreground">Dark</span>
                      <span className="text-xs text-muted-foreground mt-1">Midnight Indigo</span>
                    </button>

                    {/* Auto / System Theme */}
                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition cursor-pointer ${
                        theme === "system"
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 bg-card hover:border-border"
                      }`}
                    >
                      <Monitor className="h-8 w-8 text-muted-foreground mb-3" />
                      <span className="font-semibold text-foreground">Auto</span>
                      <span className="text-xs text-muted-foreground mt-1">System preference</span>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground p-4 bg-muted/40 border border-border/60 rounded-xl">
                    💡 <strong>Tip:</strong> Auto mode will match your device's theme setting,
                    automatically switching between light and dark based on your system preferences.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Support & Feedback Settings */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <LifeBuoy className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Feedback & Support Desk</CardTitle>
                        <CardDescription>
                          Report bugs, suggest new capabilities, or get in touch with our team
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Report a Bug */}
                      <div className="flex flex-col justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                        <div>
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
                            <Bug className="h-4 w-4" />
                            <span>Report an Issue</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            Encountered a bug, broken layout, or payment error? Let our engineering
                            team know so we can resolve it promptly.
                          </p>
                        </div>
                        <Button
                          id="settings-report-bug-btn"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFeedbackType("bug");
                            setFeedbackOpen(true);
                          }}
                          className="mt-4 border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                        >
                          Report a Bug
                        </Button>
                      </div>

                      {/* Suggest a Feature */}
                      <div className="flex flex-col justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <div>
                          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                            <Lightbulb className="h-4 w-4" />
                            <span>Suggest a Feature</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            Have ideas for a sport format, team management feature, or booking tool?
                            We prioritize user-requested features.
                          </p>
                        </div>
                        <Button
                          id="settings-suggest-feature-btn"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFeedbackType("feature");
                            setFeedbackOpen(true);
                          }}
                          className="mt-4 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                        >
                          Suggest Feature
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-border/70 bg-card p-4 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          General Question or Direct Support?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reach our sports support desk at support@khelgrid.com
                        </p>
                      </div>
                      <Button
                        id="settings-general-inquiry-btn"
                        size="sm"
                        onClick={() => {
                          setFeedbackType("general");
                          setFeedbackOpen(true);
                        }}
                        className="w-full sm:w-auto"
                      >
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Careers & Partnerships Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Careers & Institutional Partnerships
                    </CardTitle>
                    <CardDescription>
                      Join our team or register your academy, venue, or sports tournament on
                      KhelGrid
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4">
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span>Work with KhelGrid</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] text-emerald-600 border-emerald-500/30"
                            >
                              Hiring
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            Join our engineering, high-performance data science, scouting, and
                            sports journalism teams.
                          </p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="mt-4 rounded-xl text-xs font-semibold"
                        >
                          <Link to="/careers">Explore Open Roles</Link>
                        </Button>
                      </div>

                      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4">
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                            <Handshake className="h-4 w-4 text-primary" />
                            <span>Partner with Us</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            Onboard your sports academy, list court/turf bookings, or run sanctioned
                            tournaments with KhelGrid.
                          </p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="mt-4 rounded-xl text-xs font-semibold"
                        >
                          <Link to="/partner">Academy & Venue Onboarding</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Submissions</CardTitle>
                    <CardDescription>
                      Feedback and issues submitted from this browser session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submittedHistory.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No previous feedback submitted yet. Your submitted tickets will show up
                        here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {submittedHistory.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-[10px]">
                                  {item.id}
                                </Badge>
                                <span className="font-semibold text-foreground">{item.title}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                Submitted on {item.date} {item.category ? `• ${item.category}` : ""}
                              </p>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              Received
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 sticky bottom-4">
              <Button onClick={handleSave} className="flex-1 gap-2" size="lg">
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FeedbackSupportDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        defaultType={feedbackType}
      />
    </div>
  );
}
