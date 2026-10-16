import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTouchScroll } from "@/hooks/use-touch-scroll";

export const SPORTS_LIST = [
  { id: "All", name: "All Sports", emoji: "🏅" },
  { id: "Cricket", name: "Cricket", emoji: "🏏" },
  { id: "Football", name: "Football", emoji: "⚽" },
  { id: "Badminton", name: "Badminton", emoji: "🏸" },
  { id: "Kho-Kho", name: "Kho-Kho", emoji: "🏃‍♂️" },
  { id: "Boxing", name: "Boxing", emoji: "🥊" },
  { id: "Wrestling", name: "Wrestling", emoji: "🤼" },
  { id: "Athletics", name: "Athletics", emoji: "🏃" },
  { id: "Kabaddi", name: "Kabaddi", emoji: "⚡" },
  { id: "Tennis", name: "Tennis", emoji: "🎾" },
  { id: "Hockey", name: "Hockey", emoji: "🏑" },
  { id: "Basketball", name: "Basketball", emoji: "🏀" },
  { id: "Pickleball", name: "Pickleball", emoji: "🏓" },
] as const;

interface SportCategoryPillsProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

export function SportCategoryPills({ selectedSport, onSelectSport }: SportCategoryPillsProps) {
  const { scrollRef: scrollContainerRef, scroll } = useTouchScroll(200);

  return (
    <div className="relative flex w-full min-w-0 max-w-full items-center gap-1.5 py-1 min-h-[46px]">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll sports left"
        className="hidden sm:grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-border/80 bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar touch-scroll-rail py-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {SPORTS_LIST.map((sport) => {
          const isSelected =
            selectedSport === sport.id || (selectedSport === "All Sports" && sport.id === "All");

          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className={`snap-start flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[40px] select-none ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-sm leading-none">{sport.emoji}</span>
              <span>{sport.name}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll sports right"
        className="hidden sm:grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-border/80 bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
