import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ThemeSwitcherProps {
  variant?: "icon" | "segmented" | "pill";
  className?: string;
  id?: string;
}

export function ThemeSwitcher({
  variant = "icon",
  className,
  id = "theme-switcher-btn",
}: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();

  // Prior to client mount, rely on consistent initial "light" theme to guarantee
  // that server-rendered HTML and client hydration DOM match bit-for-bit.
  const activeResolvedTheme = mounted ? resolvedTheme : "light";
  const activeTheme = mounted ? theme : "light";

  if (variant === "segmented") {
    const options: { value: Theme; label: string; icon: React.ElementType }[] = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "Auto", icon: Monitor },
    ];

    return (
      <div
        id={id}
        suppressHydrationWarning
        className={cn(
          "inline-flex items-center rounded-xl p-1 bg-muted/60 border border-border/60",
          className,
        )}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = activeTheme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              suppressHydrationWarning
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSelected
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  opt.value === "light" && isSelected && "text-amber-500",
                  opt.value === "dark" && isSelected && "text-sky-400",
                )}
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        suppressHydrationWarning
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/80 transition-all cursor-pointer shadow-2xs",
          className,
        )}
        title={activeResolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        aria-label={
          activeResolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"
        }
      >
        {activeResolvedTheme === "dark" ? (
          <>
            <Sun className="h-3.5 w-3.5 text-amber-400 animate-in fade-in zoom-in" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-slate-700 animate-in fade-in zoom-in" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default: icon button
  const isDark = activeResolvedTheme === "dark";

  return (
    <Button
      id={id}
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      suppressHydrationWarning
      className={cn(
        "rounded-full h-8 w-8 sm:h-9 sm:w-9 border-border bg-card hover:bg-muted text-foreground transition-transform active:scale-95 shadow-2xs",
        className,
      )}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
export default ThemeSwitcher;
