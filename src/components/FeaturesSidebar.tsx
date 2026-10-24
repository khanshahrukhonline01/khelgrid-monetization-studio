import { useRouterState, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Sparkles,
  Swords,
  GraduationCap,
  Trophy,
  BookOpen,
  Globe,
  SlidersHorizontal,
  Crown,
  Keyboard,
} from "lucide-react";
import { PRIMARY_ITEMS, FEATURE_ITEMS, isActivePath, type NavItem } from "@/config/nav";
import { NavLink } from "@/components/NavLink";
import { PlayNavLink } from "@/components/PlayNavLink";
import { SidebarAd } from "@/components/ads";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

// All features and core navigation items for desktop sidebar, strictly deduplicated
export const FEATURES: readonly NavItem[] = (() => {
  const seen = new Set<string>();
  const items: NavItem[] = [];
  // Quick overview navigation routes
  for (const item of PRIMARY_ITEMS.filter((i) => i.to === "/" || i.to === "/dashboard")) {
    if (!seen.has(item.to)) {
      seen.add(item.to);
      items.push(item);
    }
  }
  for (const item of FEATURE_ITEMS) {
    // Coaches and Academies are grouped under the Train feature
    if (item.to === "/coaches" || item.to === "/academy") continue;
    if (!seen.has(item.to)) {
      seen.add(item.to);
      items.push(item);
    }
  }
  return items;
})();

export type NavCategory = "all" | "core" | "action" | "scouting" | "community" | "platform";

export interface CategoryMeta {
  id: NavCategory;
  label: string;
  shortLabel: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const NAV_CATEGORIES: CategoryMeta[] = [
  { id: "all", label: "All Features", shortLabel: "All" },
  { id: "action", label: "Play & Action", shortLabel: "Action", icon: Swords },
  { id: "scouting", label: "Scout & CV", shortLabel: "Scout", icon: Sparkles },
  { id: "community", label: "Hub & Learn", shortLabel: "Hub", icon: BookOpen },
  { id: "platform", label: "Network & Pro", shortLabel: "Network", icon: Globe },
];

export function getItemCategory(to: string): NavCategory {
  if (to === "/" || to === "/dashboard" || to === "/cities") {
    return "core";
  }
  if (
    to === "/search" ||
    to === "/live-scores" ||
    to === "/#live-scores" ||
    to === "/play" ||
    to === "/book" ||
    to === "/train" ||
    to === "/events"
  ) {
    return "action";
  }
  if (
    to === "/onboarding" ||
    to === "/talent-scanner" ||
    to === "/scout-portal" ||
    to === "/my-stats" ||
    to === "/start-from-zero" ||
    to === "/verify"
  ) {
    return "scouting";
  }
  if (
    to === "/community" ||
    to === "/learning-hub" ||
    to === "/guides" ||
    to === "/sports" ||
    to === "/blog" ||
    to === "/tools" ||
    to === "/ai-guide"
  ) {
    return "community";
  }
  return "platform";
}

export const SECTION_HEADERS: Record<NavCategory, { title: string; subtitle: string }> = {
  all: { title: "Features", subtitle: "Full directory" },
  core: { title: "Overview", subtitle: "Quick navigation" },
  action: { title: "Play & Match Center", subtitle: "Live action & bookings" },
  scouting: { title: "Scouting & Athlete Pipeline", subtitle: "CV, scans & talent" },
  community: { title: "Knowledge & Community", subtitle: "Hub, guides & discussions" },
  platform: { title: "Network & Ecosystem", subtitle: "Academies, pro & partners" },
};

export function FeaturesSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<NavCategory>("all");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("khelgrid_sidebar_collapsed_sections");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });
  const path = useRouterState({ select: (s) => s.location.pathname });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (category: string) => {
    setCollapsedSections((prev) => {
      const next = { ...prev, [category]: !prev[category] };
      try {
        localStorage.setItem("khelgrid_sidebar_collapsed_sections", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keep the sidebar state consistent across routes and devices.
  // Respect an explicit user preference; otherwise start expanded.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("khelgrid_sidebar_collapsed");
      if (saved !== null) setCollapsed(saved === "true");
    } catch {
      // Storage may be unavailable in private browsing; the default remains expanded.
    }
  }, []);

  // Save collapse state change
  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("khelgrid_sidebar_collapsed", String(next));
      } catch (e) {
        void e;
      }
      return next;
    });
  };

  // Keyboard shortcut listener: '[' or Cmd/Ctrl+B to toggle, '/' to search, Esc to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (isInput) {
        if (e.key === "Escape" && target === searchInputRef.current) {
          setQuery("");
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === "[" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b")) {
        e.preventDefault();
        toggleCollapse();
      } else if (e.key === "/" && !collapsed) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collapsed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEATURES.filter((f) => {
      const matchesQuery =
        !q ||
        f.label.toLowerCase().includes(q) ||
        (f.to === "/train" && (q.includes("coach") || q.includes("acad"))) ||
        (f.to === "/learning-hub" &&
          (q.includes("sport") ||
            q.includes("book") ||
            q.includes("video") ||
            q.includes("rule") ||
            q.includes("learn")));
      const matchesCat = activeCategory === "all" || getItemCategory(f.to) === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCategory]);

  // Grouped items when showing All and no search query active
  const groupedSections = useMemo(() => {
    if (query.trim() || activeCategory !== "all") {
      return null;
    }
    const categories: NavCategory[] = ["core", "action", "scouting", "community", "platform"];
    return categories
      .map((cat) => ({
        category: cat,
        meta: SECTION_HEADERS[cat],
        items: FEATURES.filter((f) => getItemCategory(f.to) === cat),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [query, activeCategory]);

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        id="khelgrid-features-sidebar"
        aria-label="Features and Services Sidebar"
        className={cn(
          "sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-200 ease-in-out motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-950 lg:flex",
          collapsed ? "w-[4.5rem]" : "w-[15rem]",
        )}
      >
        {/* Top Header — one clear, keyboard-accessible collapse control */}
        <div
          className={cn(
            "flex min-h-12 items-center border-b border-slate-100 px-2.5 py-2 dark:border-slate-800",
            collapsed ? "justify-center" : "justify-between gap-2 px-3",
          )}
        >
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                Features
              </span>
              <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                {FEATURES.length}
              </span>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapse}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!collapsed}
                aria-controls="khelgrid-sidebar-navigation"
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition-all duration-150 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-200",
                  !collapsed && "ml-auto",
                )}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <div className="flex items-center gap-1.5">
                <span>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                  [
                </kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Search Bar & Category Tabs (Expanded Only) */}
        {!collapsed && (
          <div className="space-y-2 border-b border-border/50 px-3 py-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search features…"
                className="w-full rounded-lg border border-border/70 bg-secondary/50 py-1.5 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 transition-all focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-muted/70 px-1 py-0.2 text-[9px] font-mono text-muted-foreground">
                  /
                </kbd>
              )}
            </div>

            {/* Category Segmented Filter Tabs */}
            {!query && (
              <div
                role="tablist"
                aria-label="Feature categories"
                className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full bg-secondary/50 p-0.5"
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
                        "shrink-0 rounded-full px-2 py-1 text-[10px] font-medium transition-all cursor-pointer",
                        isSelected
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                      )}
                    >
                      {cat.shortLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Navigation Item Scrollable Area */}
        <nav
          id="khelgrid-sidebar-navigation"
          aria-label="Sidebar navigation links"
          className={cn(
            "flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain pb-3",
            collapsed ? "gap-1 px-1.5 pt-2" : "gap-1 px-2 pt-2",
          )}
        >
          {/* A. Collapsed View: Compact Icon Rail with Tooltips */}
          {collapsed && (
            <div className="flex flex-col gap-1">
              {FEATURES.map((f, idx) => {
                const active = isActivePath(path, f.to);
                const prevCat = idx > 0 ? getItemCategory(FEATURES[idx - 1].to) : null;
                const currCat = getItemCategory(f.to);
                const isNewGroup = prevCat && prevCat !== currCat;

                return (
                  <div key={f.to} className="flex flex-col">
                    {isNewGroup && (
                      <div className="my-1 border-t border-border/50 mx-2" aria-hidden="true" />
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          {f.to === "/play" ? (
                            <PlayNavLink
                              active={active}
                              source="sidebar_desktop"
                              showLabel={false}
                            />
                          ) : (
                            <NavLink
                              item={f}
                              active={active}
                              source="sidebar_desktop"
                              showLabel={false}
                            />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={12}
                        className="flex flex-col gap-0.5"
                      >
                        <span className="font-semibold text-xs text-primary-foreground">
                          {f.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-primary-foreground/70">
                          <span>{SECTION_HEADERS[currCat]?.title}</span>
                          {active && (
                            <>
                              <span>·</span>
                              <span className="font-semibold text-emerald-300">Active</span>
                            </>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          )}

          {/* B. Expanded View: Grouped Sections or Filtered Results */}
          {!collapsed && !query && activeCategory === "all" && <div className="mb-2"></div>}

          {!collapsed && groupedSections && (
            <div className="space-y-2">
              {groupedSections.map((sec) => {
                const isSectionCollapsed = Boolean(collapsedSections[sec.category]);
                return (
                  <div key={sec.category} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.category)}
                      aria-expanded={!isSectionCollapsed}
                      className="flex w-full items-center justify-between px-2.5 py-2 text-left rounded-lg hover:bg-secondary/60 transition-colors group cursor-pointer"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground transition-colors">
                        {sec.meta.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 font-mono">
                        <span className="rounded bg-secondary/80 px-1 py-0.2 text-[9px]">
                          {sec.items.length}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 text-muted-foreground/60 transition-transform duration-200",
                            isSectionCollapsed && "-rotate-90",
                          )}
                        />
                      </div>
                    </button>

                    {!isSectionCollapsed && (
                      <div className="flex flex-col gap-0.5">
                        {sec.items.map((f) => (
                          <div key={f.to} className="flex flex-col">
                            {f.to === "/play" ? (
                              <PlayNavLink
                                active={isActivePath(path, f.to)}
                                source="sidebar_desktop"
                                showLabel={true}
                              />
                            ) : (
                              <NavLink
                                item={f}
                                active={isActivePath(path, f.to)}
                                source="sidebar_desktop"
                                showLabel={true}
                              />
                            )}

                            {/* Train grouped sub-links (Coaches & Academies) */}
                            {f.to === "/train" && (
                              <div className="ml-5 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-primary/25 pl-2.5">
                                <Link
                                  to="/coaches"
                                  className={cn(
                                    "flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors",
                                    isActivePath(path, "/coaches")
                                      ? "bg-primary/15 text-primary font-bold"
                                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                                  )}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
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
                                    "flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors",
                                    isActivePath(path, "/academy")
                                      ? "bg-primary/15 text-primary font-bold"
                                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                                  )}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* C. Expanded View: Filtered / Searched Flat List */}
          {!collapsed && !groupedSections && (
            <div className="flex flex-col gap-0.5">
              {query && (
                <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span>Results for &ldquo;{query}&rdquo;</span>
                  <span className="font-mono text-[10px]">{filtered.length} found</span>
                </div>
              )}

              {filtered.map((f) => (
                <div key={f.to} className="flex flex-col">
                  {f.to === "/play" ? (
                    <PlayNavLink
                      active={isActivePath(path, f.to)}
                      source="sidebar_desktop"
                      showLabel={true}
                    />
                  ) : (
                    <NavLink
                      item={f}
                      active={isActivePath(path, f.to)}
                      source="sidebar_desktop"
                      showLabel={true}
                    />
                  )}
                  {f.to === "/train" && (
                    <div className="ml-5 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-primary/25 pl-2.5">
                      <Link
                        to="/coaches"
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors",
                          isActivePath(path, "/coaches")
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-1.5 truncate">
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
                          "flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors",
                          isActivePath(path, "/academy")
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>Academies</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">Centers</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center space-y-2">
                  <p className="text-xs font-medium text-foreground">No features found</p>
                  <p className="text-[11px] text-muted-foreground">
                    Try searching for &quot;play&quot;, &quot;venues&quot;, or &quot;coaching&quot;
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("all");
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ad slot in expanded state */}
          {!collapsed && (
            <div className="mt-auto pt-2 px-1">
              <SidebarAd adSlot="sidebarBottom" minHeight={250} />
            </div>
          )}
        </nav>

        {/* Footer Quick Controls */}
        <div
          className={cn(
            "border-t border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-950",
            collapsed ? "flex flex-col items-center gap-2" : "space-y-2",
          )}
        >
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <ThemeSwitcher variant="icon" />
                <span className="text-[11px]">Theme</span>
              </div>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 hover:bg-amber-500/20 transition-colors"
              >
                <Crown className="h-3 w-3" />
                <span>Go Pro</span>
              </Link>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeSwitcher variant="icon" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                <span>Toggle theme</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
