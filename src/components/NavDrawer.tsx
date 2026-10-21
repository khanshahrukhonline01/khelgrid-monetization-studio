import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Trophy,
  GraduationCap,
  Search,
  User,
  Wallet,
  LogIn,
  LogOut,
  Zap,
  Settings,
  Languages,
  X,
  Swords,
  Sparkles,
  BookOpen,
  Globe,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { NavLink } from "@/components/NavLink";
import { PlayNavLink } from "@/components/PlayNavLink";
import { PRIMARY_ITEMS, FEATURE_ITEMS, isActivePath, type NavItem } from "@/config/nav";
import {
  getItemCategory,
  type NavCategory,
  NAV_CATEGORIES,
  SECTION_HEADERS,
} from "@/components/FeaturesSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

// Re-exported for tests and any callers that imported the array directly.
export const PRIMARY: readonly NavItem[] = PRIMARY_ITEMS;

// Strictly deduplicated list of all unique navigation items across primary and features
export const DRAWER_ITEMS: readonly NavItem[] = (() => {
  const seen = new Set<string>();
  const items: NavItem[] = [];
  // Overview routes first
  for (const item of PRIMARY_ITEMS) {
    if (!seen.has(item.to)) {
      seen.add(item.to);
      items.push(item);
    }
  }
  for (const item of FEATURE_ITEMS) {
    // Coaches and Academies are grouped under Train
    if (item.to === "/coaches" || item.to === "/academy") continue;
    if (!seen.has(item.to)) {
      seen.add(item.to);
      items.push(item);
    }
  }
  return items;
})();

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<NavCategory>("all");
  const { currentLanguage } = useLanguage();
  const auth = useAuth();
  const { plan = "free", wallet = 0, isAuthenticated, role = "user", name, logout } = auth;
  const isAuth = Boolean(isAuthenticated);
  const userName = name || auth.user?.name || "Athlete";
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    try {
      if (typeof logout === "function") {
        logout();
      }
      setOpen(false);
      toast.success("Logged out successfully");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Sign out error", err);
      toast.error("Failed to log out");
    }
  };

  // Close drawer on route change & reset filters
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setActiveCategory("all");
  }, [path]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DRAWER_ITEMS.filter((i) => {
      const matchesQ =
        !q ||
        i.label.toLowerCase().includes(q) ||
        (i.to === "/train" && (q.includes("coach") || q.includes("acad"))) ||
        (i.to === "/learning-hub" &&
          (q.includes("sport") ||
            q.includes("book") ||
            q.includes("video") ||
            q.includes("rule") ||
            q.includes("learn")));
      const matchesCat = activeCategory === "all" || getItemCategory(i.to) === activeCategory;
      return matchesQ && matchesCat;
    });
  }, [query, activeCategory]);

  const groupedDrawerSections = useMemo(() => {
    if (query.trim() || activeCategory !== "all") {
      return null;
    }
    const categories: NavCategory[] = ["core", "action", "scouting", "community", "platform"];
    return categories
      .map((cat) => ({
        category: cat,
        meta: SECTION_HEADERS[cat],
        items: DRAWER_ITEMS.filter((i) => getItemCategory(i.to) === cat),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [query, activeCategory]);

  const totalResults = filteredItems.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card/60 text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-[100dvh] max-h-[100dvh] w-[86vw] max-w-[19rem] flex-col gap-0 overflow-hidden border-r border-slate-200 bg-white p-0 pb-[env(safe-area-inset-bottom,16px)] dark:border-slate-800 dark:bg-slate-950 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-slate-100 px-5 pr-14 py-4 text-left dark:border-slate-800">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/favicon-96x96.png"
                alt="KhelGrid logo"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-xl object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                Khel<span className="text-primary">Grid</span>
              </span>
            </div>
            {plan === "pro" && (
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                PRO
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Athlete Account Strip */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={
                isAuth
                  ? role === "coach"
                    ? "/scout-portal"
                    : role === "academy"
                      ? "/academy"
                      : "/profile"
                  : "/login"
              }
              onClick={() => setOpen(false)}
              className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground font-semibold border border-border/60">
                {isAuth && userName ? (
                  <span>{userName[0]?.toUpperCase()}</span>
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">
                  {isAuth ? userName : "Guest Athlete"}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isAuth ? (
                    <>
                      <span
                        className={cn(
                          "inline-block h-1.5 w-1.5 rounded-full",
                          role === "coach"
                            ? "bg-blue-500"
                            : role === "academy"
                              ? "bg-amber-500"
                              : "bg-emerald-500",
                        )}
                      />
                      <span>
                        {role === "coach"
                          ? "Coach"
                          : role === "academy"
                            ? "Academy"
                            : plan === "pro"
                              ? "Pro Athlete"
                              : "Athlete"}
                      </span>
                      <span>·</span>
                      <Wallet className="h-3 w-3" /> ₹{wallet}
                    </>
                  ) : (
                    <span>Sign in to save progress</span>
                  )}
                </div>
              </div>
            </Link>
            {isAuth ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full border-primary/50 text-xs text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link
                  to={
                    role === "coach"
                      ? "/scout-portal"
                      : role === "academy"
                        ? "/academy"
                        : "/profile"
                  }
                  onClick={() => setOpen(false)}
                >
                  <User className="mr-1 h-3.5 w-3.5" /> Profile
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-full bg-primary text-xs text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <Link to="/login" onClick={() => setOpen(false)}>
                  <LogIn className="mr-1 h-3.5 w-3.5" /> Log in
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sticky Search & Category Quick Filter */}
        <div className="sticky top-0 z-10 space-y-2 border-b border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search features & sports…"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips for Mobile Ergonomics */}
          {!query && (
            <div
              role="tablist"
              aria-label="Navigation category filter"
              className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5"
            >
              {NAV_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-emerald-700 text-white font-semibold shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-emerald-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-950/40",
                    )}
                  >
                    {cat.shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          {query && (
            <div className="px-3 pb-2 text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Results for &ldquo;{query}&rdquo;</span>
              <span className="font-mono text-[11px]">{totalResults} found</span>
            </div>
          )}

          {/* Unified Grouped Sections (When All is selected & not searching) */}
          {groupedDrawerSections ? (
            groupedDrawerSections.map((sec) => (
              <Section key={sec.category} title={sec.meta.title}>
                {sec.items.map((i) => (
                  <div key={i.to} className="flex flex-col">
                    {i.to === "/play" ? (
                      <PlayNavLink active={isActivePath(path, i.to)} source="sidebar_mobile" />
                    ) : (
                      <NavLink item={i} active={isActivePath(path, i.to)} source="sidebar_mobile" />
                    )}
                    {/* Train grouped sub-links */}
                    {i.to === "/train" && (
                      <div className="ml-5 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-primary/25 pl-2.5">
                        <Link
                          to="/coaches"
                          className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                            isActivePath(path, "/coaches")
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <GraduationCap className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                            <span>Coaches</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Certified
                          </span>
                        </Link>
                        <Link
                          to="/academy"
                          className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                            isActivePath(path, "/academy")
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>Academies</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Centers
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </Section>
            ))
          ) : (
            /* Flat Filtered List (when searching or category chip selected) with Zero Duplication */
            <div className="flex flex-col gap-0.5">
              {filteredItems.map((i) => (
                <div key={i.to} className="flex flex-col">
                  {i.to === "/play" ? (
                    <PlayNavLink active={isActivePath(path, i.to)} source="sidebar_mobile" />
                  ) : (
                    <NavLink item={i} active={isActivePath(path, i.to)} source="sidebar_mobile" />
                  )}
                  {i.to === "/train" && (
                    <div className="ml-5 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-primary/25 pl-2.5">
                      <Link
                        to="/coaches"
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                          isActivePath(path, "/coaches")
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <GraduationCap className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                          <span>Coaches</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Certified
                        </span>
                      </Link>
                      <Link
                        to="/academy"
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                          isActivePath(path, "/academy")
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>Academies</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">Centers</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalResults === 0 && (
            <div className="px-4 py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground">
                No items found matching &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
                className="inline-flex items-center justify-center rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Sticky Drawer Footer */}
        <div className="sticky bottom-0 space-y-2.5 border-t border-slate-100 bg-white/95 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
          {/* Theme & Language Bar */}
          <div className="flex items-center justify-between px-1 pb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <ThemeSwitcher variant="icon" />
              <span>Theme</span>
            </div>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Languages className="h-3.5 w-3.5 text-primary" />
              <span>
                {currentLanguage.flag} {currentLanguage.nativeName}
              </span>
              <Settings className="h-3 w-3 text-muted-foreground" />
            </Link>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-10 w-full rounded-xl border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Link to="/list-venue" onClick={() => setOpen(false)}>
              <Building2 className="mr-2 h-4 w-4" />
              List Your Sports Venue
            </Link>
          </Button>

          <Button
            asChild
            className="w-full rounded-xl bg-gradient-hero text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Link to="/pricing" onClick={() => setOpen(false)}>
              <Zap className="mr-1.5 h-4 w-4" />
              {plan === "pro" ? "Manage Pro Athlete" : "Go Pro · ₹499/mo"}
            </Link>
          </Button>

          {isAuth ? (
            <Button
              type="button"
              variant="outline"
              id="drawer-logout-btn"
              onClick={handleLogout}
              className="h-9 w-full rounded-xl border-destructive/30 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Log Out
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              id="drawer-login-btn"
              className="h-9 w-full rounded-xl border-border text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Link to="/login" onClick={() => setOpen(false)}>
                <LogIn className="mr-2 h-3.5 w-3.5 text-primary" /> Log In / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
