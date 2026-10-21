import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Users,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  Zap,
  Wallet,
  Bell,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Newspaper,
  MoreHorizontal,
  Settings,
  LifeBuoy,
  Briefcase,
  Handshake,
  Wand2,
  Languages,
  Check,
  Trophy,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { NavDrawer } from "@/components/NavDrawer";
import { SportsLauncher } from "@/components/SportsLauncher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FeedbackSupportDialog } from "@/components/FeedbackSupportDialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isActivePath } from "@/config/nav";

// Most important core navigation features
const PRIMARY_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/play", label: "Play", icon: Users },
  { to: "/book", label: "Book", icon: CalendarCheck },
  { to: "/train", label: "Train", icon: GraduationCap },
  { to: "/events", label: "Events", icon: CalendarDays },
] as const;

// Secondary items accessible via clean dropdown to prevent top bar overflow
const SECONDARY_NAV = [
  { to: "/community", label: "Community", icon: Users },
  { to: "/chronicle", label: "KhelChronicle", icon: Newspaper },
  { to: "/blog", label: "Blog", icon: Newspaper },
] as const;

export function Navbar() {
  const auth = useAuth();
  const { plan = "free", wallet = 0, isAuthenticated, role = "user", name, email, logout } = auth;
  const isAuth = Boolean(isAuthenticated);
  const userName = name || auth.user?.name || "Athlete";
  const userEmail = email || auth.user?.email || "";
  const navigate = useNavigate();

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

  const { unreadCount } = useNotifications();
  const { language, setLanguage, currentLanguage, supportedLanguages, t } = useLanguage();
  const [sportsLauncherOpen, setSportsLauncherOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Mobile: drawer */}
        <div className="lg:hidden">
          <NavDrawer />
        </div>

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 transition hover:opacity-80"
          title="KhelGrid Home"
        >
          <img
            src="/favicon-96x96.png"
            alt="KhelGrid"
            width={32}
            height={32}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-8 w-8 cursor-pointer"
          />
          <span className="text-base font-bold tracking-tight sm:text-xl">
            Khel<span className="text-primary">Grid</span>
          </span>
        </Link>

        {/* Desktop primary nav - Essential core features only */}
        <nav className="ml-2 hidden shrink-0 items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 lg:flex">
          {PRIMARY_NAV.map((n) => {
            const isTrainActive =
              path === "/train" ||
              path.startsWith("/train/") ||
              path === "/coaches" ||
              path.startsWith("/coaches/") ||
              path === "/academy" ||
              path.startsWith("/academy/");
            const active = n.to === "/train" ? isTrainActive : isActivePath(path, n.to);

            if (n.to === "/train") {
              return (
                <div key={n.to} className="relative flex items-center">
                  <DropdownMenu>
                    <div
                      className={`flex items-center rounded-full transition-colors ${
                        active
                          ? "bg-secondary font-semibold text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link
                        to="/train"
                        className="flex items-center gap-1.5 whitespace-nowrap rounded-l-full pl-3.5 pr-1 py-1.5 text-sm"
                      >
                        <n.icon className="h-4 w-4 shrink-0" />
                        <span>{n.label}</span>
                      </Link>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center rounded-r-full pr-2.5 pl-0.5 py-1.5 text-xs opacity-75 hover:opacity-100 cursor-pointer"
                          aria-label="Train options and directory"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="start" className="w-56 rounded-xl p-1.5">
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link
                          to="/train"
                          className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium"
                        >
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span>All Training Programs</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link
                          to="/coaches"
                          className="flex items-center gap-2.5 px-2.5 py-2 text-sm"
                        >
                          <User className="h-4 w-4 text-primary/80" />
                          <span>Certified Coaches</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link
                          to="/academy"
                          className="flex items-center gap-2.5 px-2.5 py-2 text-sm"
                        >
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span>Sports Academies</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link
                          to="/train"
                          search={{ register: "coach" }}
                          className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-primary"
                        >
                          <span>+ Register as Coach</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link
                          to="/train"
                          search={{ register: "academy" }}
                          className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          <span>+ Register Academy</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}

          {/* More menu for secondary links so they never overflow */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors ${
                  SECONDARY_NAV.some((s) => isActivePath(path, s.to))
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="More options"
                aria-label="More navigation items"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
              {SECONDARY_NAV.map((item) => (
                <DropdownMenuItem key={item.to} asChild className="cursor-pointer rounded-lg">
                  <Link to={item.to} className="flex items-center gap-2.5 px-2.5 py-2 text-sm">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Compact venue-owner acquisition CTA */}
        <Link
          to="/list-venue"
          className="hidden xl:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Building2 className="h-4 w-4" />
          List Your Venue
        </Link>

        {/* Right cluster - Most important actions only */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
          >
            <Link to="/recommendations" title="Notifications" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          </Button>

          {/* Settings Menu with Theme Switcher inside */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="navbar-settings-btn"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground sm:h-9 sm:w-9"
                title="Settings & Appearance"
                aria-label="Settings and Appearance"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-lg">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Appearance
              </div>
              <div className="px-1 pb-1" onClick={(e) => e.stopPropagation()}>
                <ThemeSwitcher
                  id="navbar-settings-theme-switcher"
                  variant="segmented"
                  className="flex w-full"
                />
              </div>
              <DropdownMenuSeparator className="my-1.5" />

              {/* Language Setting inside Setting button */}
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary" />
                  <span>Language / भाषा</span>
                </span>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary font-sans">
                  {currentLanguage.flag} {currentLanguage.nativeName}
                </span>
              </div>
              <div
                className="grid grid-cols-2 gap-1 p-1"
                onClick={(e) => e.stopPropagation()}
                role="group"
                aria-label="Language selection"
              >
                {supportedLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        toast.success(`Language set to ${lang.name} (${lang.nativeName})`);
                      }}
                      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "hover:bg-muted text-foreground"
                      }`}
                      title={`${lang.name} - ${lang.region}`}
                    >
                      <span className="truncate">
                        <span className="mr-1.5">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
              <DropdownMenuSeparator className="my-1.5" />

              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Company & Network
              </div>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link
                  id="navbar-careers-btn"
                  to="/careers"
                  className="flex items-center justify-between px-2.5 py-2 text-sm font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>Careers</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Hiring
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link
                  id="navbar-partner-btn"
                  to="/partner"
                  className="flex items-center justify-between px-2.5 py-2 text-sm font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Handshake className="h-4 w-4 text-primary" />
                    <span>Partner with Us</span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    Academies
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                id="navbar-feedback-btn"
                onSelect={() => setFeedbackOpen(true)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium"
              >
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                <span>Feedback & Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>All Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile/Tablet: compact wallet pill */}
          <Link
            to="/dashboard"
            className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground sm:flex xl:hidden"
            title="Wallet balance"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />₹{wallet}
          </Link>

          {/* Single Unified Auth/Account Control */}
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="navbar-user-menu-btn"
                  type="button"
                  title={`Signed in as ${userName} (${role})`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-muted/60 transition-colors sm:gap-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      role === "coach"
                        ? "bg-blue-500"
                        : role === "academy"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
                    {role === "coach" ? "Coach" : role === "academy" ? "Academy" : "Athlete"}
                  </span>
                  <span className="max-w-[70px] truncate font-bold text-foreground sm:max-w-[85px]">
                    {userName.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border/80">
                <div className="px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-bold text-foreground">{userName}</p>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {role}
                    </span>
                  </div>
                  {userEmail && (
                    <p className="truncate text-[11px] text-muted-foreground mt-0.5">{userEmail}</p>
                  )}
                </div>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link
                    to={
                      role === "coach"
                        ? "/scout-portal"
                        : role === "academy"
                          ? "/academy"
                          : "/profile"
                    }
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>My Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link
                    to="/onboarding"
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-primary"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-primary" />
                    <span>Sports CV Wizard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  id="navbar-logout-btn"
                  onSelect={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5 text-destructive" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="default"
              size="sm"
              id="navbar-login-btn"
              className="h-8 shrink-0 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:h-9 sm:px-3.5"
            >
              <Link
                to="/login"
                title="Login coming soon"
                aria-label="Login coming soon"
                className="flex items-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Coming Soon</span>
              </Link>
            </Button>
          )}

          {/* Go Pro CTA */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary sm:inline-flex"
          >
            <Link to="/pricing">
              <Zap className="mr-1 h-3.5 w-3.5" /> {plan === "pro" ? "Pro" : "Go Pro"}
            </Link>
          </Button>
        </div>
      </div>

      <SportsLauncher open={sportsLauncherOpen} onOpenChange={setSportsLauncherOpen} />
      <FeedbackSupportDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </header>
  );
}
