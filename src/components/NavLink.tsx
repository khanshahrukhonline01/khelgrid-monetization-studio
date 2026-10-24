import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { trackEvent, PLAY_NAV_LABEL, PLAY_NAV_DESTINATION } from "@/lib/analytics";
import type { NavItem } from "@/config/nav";

export type NavLinkProps = {
  item: NavItem;
  active: boolean;
  source?: "sidebar_desktop" | "sidebar_mobile";
  showLabel?: boolean;
  className?: string;
};

export function NavLink({ item, active, source, showLabel = true, className }: NavLinkProps) {
  const onClick =
    item.to === PLAY_NAV_DESTINATION && source
      ? () =>
          trackEvent({
            event: "nav_click",
            label: PLAY_NAV_LABEL,
            destination: PLAY_NAV_DESTINATION,
            source,
          })
      : undefined;

  return (
    <Link
      to={item.to as string}
      title={item.label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group flex min-h-12 items-center gap-3 rounded-xl px-3 py-3.5 text-[13px] font-medium leading-5 transition-colors duration-150 sm:min-h-10 sm:py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !showLabel && "justify-center px-0",
        active
          ? "bg-emerald-100 text-slate-900 shadow-sm hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-50 dark:hover:bg-emerald-950/60"
          : "text-slate-600 hover:bg-emerald-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-emerald-950/35 dark:hover:text-white",
        className,
      )}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            active
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-slate-500 group-hover:text-emerald-700 dark:text-slate-400 dark:group-hover:text-emerald-300",
          )}
        />
        {item.label === "Live Scores" && !showLabel && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        )}
      </span>
      {showLabel && (
        <span className="flex flex-1 items-center justify-between min-w-0">
          <span className="truncate">{item.label}</span>
          {item.label === "Live Scores" && (
            <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-500 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
