import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { GAMES, type Game } from "@/data/khelgrid";
import { Swords, Users, Clock, MapPin, ChevronRight, ChevronLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HostGameModal } from "@/components/play/HostGameModal";
import { GameDetailsModal } from "@/components/play/GameDetailsModal";
import { useTouchScroll } from "@/hooks/use-touch-scroll";
import { getPickupGameCardImage } from "@/data/card-images";

interface PickupGameLobbyProps {
  selectedCity?: string;
  selectedSport?: string;
}

export function PickupGameLobby({
  selectedCity = "All Cities",
  selectedSport = "All",
}: PickupGameLobbyProps) {
  const navigate = useNavigate();
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { scrollRef, scroll } = useTouchScroll(320);

  const games = GAMES.filter((g) => {
    const matchCity =
      selectedCity === "All Cities" ||
      selectedCity === "All Locations" ||
      g.city.toLowerCase() === selectedCity.toLowerCase();

    const matchSport =
      selectedSport === "All" ||
      selectedSport === "All Sports" ||
      g.sport.toLowerCase() === selectedSport.toLowerCase();

    return matchCity && matchSport;
  }).slice(0, 8);

  const displayGames = games.length > 0 ? games : GAMES.slice(0, 8);

  return (
    <section
      aria-label="Join or host pickup sports games"
      className="w-full min-w-0 max-w-full py-2"
    >
      <div className="flex items-center justify-between pb-2.5 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
            <Swords className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="truncate">Join Pickup Games</span>
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            Connect with local players and fill missing court spots · Swipe to explore
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Scroll navigation arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll games left"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll games right"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setHostModalOpen(true)}
            className="h-8 gap-1 rounded-xl border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Host Game</span>
          </Button>

          <Link
            to="/play"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>All ({GAMES.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontally Scrollable Pickup Games Rail across all screen devices */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar touch-scroll-rail pb-2.5 pt-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {displayGames.map((game) => {
          const spotsLeft = game.capacity - game.joined;
          const percentage = Math.round((game.joined / game.capacity) * 100);

          return (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="snap-start shrink-0 w-[80vw] max-w-[300px] sm:w-[300px] lg:w-[320px] group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-xs transition-all hover:border-blue-500/50 hover:shadow-md cursor-pointer"
            >
              <div>
                {/* Pickup Game Visual Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted mb-2.5 shrink-0">
                  <img
                    src={getPickupGameCardImage(game.sport)}
                    alt={`${game.title} - ${game.sport} Pickup Match`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span className="rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {game.sport}
                    </span>
                    <span className="rounded-md bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                      {game.skillLevel}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white/95 z-10 pointer-events-none">
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {spotsLeft > 0 ? `${spotsLeft} spots open` : "Match Full"}
                    </span>
                    <span className="rounded-md bg-blue-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {game.costPerPlayer === 0 ? "Free" : `₹${game.costPerPlayer}/player`}
                    </span>
                  </div>
                </div>

                {/* Title & Venue */}
                <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors min-h-[1.25rem]">
                  {game.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {game.venue}, {game.city}
                  </span>
                </div>

                {/* Time & Host */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span>
                      {game.date} · {game.time}
                    </span>
                  </div>
                  <span>Host: {game.host}</span>
                </div>

                {/* Player Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-medium text-muted-foreground mb-1">
                    <span>
                      {game.joined}/{game.capacity} Players
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Entry</span>
                  <span className="text-xs font-bold text-foreground">
                    {game.costPerPlayer === 0 ? "Free" : `₹${game.costPerPlayer}`}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGame(game);
                  }}
                >
                  Join Match
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Host Game Modal */}
      {hostModalOpen && (
        <HostGameModal
          open={hostModalOpen}
          onOpenChange={setHostModalOpen}
          onGameCreated={() => {
            setHostModalOpen(false);
          }}
        />
      )}

      {/* Game Details Modal */}
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          open={!!selectedGame}
          onOpenChange={(open) => {
            if (!open) setSelectedGame(null);
          }}
          onJoin={() => {
            setSelectedGame(null);
          }}
        />
      )}
    </section>
  );
}
