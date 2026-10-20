import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import type { EnrichedGame, PlayerRosterItem } from "./types";
import { toast } from "sonner";

interface GameDetailsModalProps {
  game: EnrichedGame | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGame: (gameId: string, player: PlayerRosterItem) => void;
  onLeaveGame: (gameId: string, playerId: string) => void;
  isJoined?: boolean;
}

export function GameDetailsModal({
  game,
  open,
  onOpenChange,
  onJoinGame,
  onLeaveGame,
  isJoined = false,
}: GameDetailsModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [playerPosition, setPlayerPosition] = useState("");
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(false);

  if (!game) return null;

  const full = game.joined >= game.capacity;
  const spotsLeft = Math.max(0, game.capacity - game.joined);
  const pct = Math.min(100, Math.round((game.joined / game.capacity) * 100));

  // Default roster if not populated
  const roster: PlayerRosterItem[] =
    game.players && game.players.length > 0
      ? game.players
      : [
          {
            id: `host-${game.id}`,
            name: game.host,
            role: "Host & Organizer",
            skillLevel: game.skillLevel,
            joinedAt: "Initial slot",
            isHost: true,
          },
          ...Array.from({ length: Math.max(0, game.joined - 1) }).map((_, i) => ({
            id: `mock-player-${game.id}-${i}`,
            name:
              [
                "Rohan M.",
                "Pooja V.",
                "Tanmay S.",
                "Aditi K.",
                "Deepak N.",
                "Sahil P.",
                "Naveen G.",
              ][i % 7] || `Player ${i + 2}`,
            role: "Athlete",
            skillLevel: game.skillLevel,
            joinedAt: `${i + 1} hr ago`,
            isHost: false,
          })),
        ];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast.error("Please enter your name to confirm your spot.");
      return;
    }

    setJoining(true);
    const newPlayer: PlayerRosterItem = {
      id: `player-${Date.now()}`,
      name: playerName.trim(),
      role: playerPosition.trim() || "Player",
      skillLevel: game.skillLevel,
      joinedAt: "Just now",
      isHost: false,
    };

    onJoinGame(game.id, newPlayer);
    setJoining(false);
    toast.success(`You have successfully joined the ${game.sport} game at ${game.venue}!`);
    setPlayerName("");
    setPlayerPosition("");
  };

  const handleLeave = () => {
    const userPlayer = roster.find((p) => !p.isHost) || roster[roster.length - 1];
    if (userPlayer) {
      onLeaveGame(game.id, userPlayer.id);
      toast.info("You have left this game. Your spot is open for other players.");
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/play?game=${game.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Game link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Hey, join my ${game.sport} game on KhelGrid! 📍 Venue: ${game.venue}, ${game.city} 📅 Date: ${game.date} at ${game.time} (₹${game.costPerPlayer}/player). Reserve your spot: ${typeof window !== "undefined" ? window.location.href : "https://www.khelgrid.com/play"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${game.venue} ${game.city} sports`,
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="game-details-dialog-content"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader id="game-details-dialog-header">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold">
                {game.sport}
              </Badge>
              <Badge variant="outline" className="border-border">
                {game.skillLevel}
              </Badge>
              {isJoined && (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Confirmed Player
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                id="game-share-whatsapp-btn"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={handleWhatsAppShare}
                title="Share match details on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                WhatsApp
              </Button>
              <Button
                id="game-copy-link-btn"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopyLink}
                title="Copy game link"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {game.venue}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                {game.area ? `${game.area}, ` : ""}
                {game.city}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-primary hover:underline ml-1 font-medium"
              >
                Maps <ExternalLink className="h-3 w-3" />
              </a>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-border/70 bg-card/60">
            <div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" /> Date
              </div>
              <div className="text-sm font-semibold mt-0.5">{game.date}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" /> Time
              </div>
              <div className="text-sm font-semibold mt-0.5">
                {game.time} {game.durationMinutes ? `(${game.durationMinutes}m)` : ""}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3 text-primary" /> Spots
              </div>
              <div className="text-sm font-semibold mt-0.5">
                {game.joined}/{game.capacity} ({spotsLeft} left)
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">Cost / Player</div>
              <div className="text-sm font-bold text-primary mt-0.5">₹{game.costPerPlayer}</div>
            </div>
          </div>

          {/* Spots Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Roster Capacity</span>
              <span>{pct}% filled</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  full ? "bg-amber-500" : "bg-primary"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Description / Host Notes */}
          {game.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Match Overview & Host Notes
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/50">
                {game.description}
              </p>
            </div>
          )}

          {/* Gear & Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border/60 bg-background space-y-1.5">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Equipment Provided
              </div>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                {(game.equipmentProvided || ["Match ball / Shuttlecocks", "Training bibs"]).map(
                  (item, idx) => (
                    <li key={idx}>{item}</li>
                  ),
                )}
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-border/60 bg-background space-y-1.5">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> What to Bring
              </div>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                {(
                  game.equipmentNeeded || [
                    "Appropriate court/turf shoes",
                    "Hydration bottle & towel",
                    "Personal racket or paddle",
                  ]
                ).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Player Roster Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Player Roster ({game.joined} Confirmed)
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Hosted by <strong>{game.host}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {roster.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-secondary/30 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {player.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-foreground truncate flex items-center gap-1.5">
                        {player.name}
                        {player.isHost && (
                          <Badge
                            variant="outline"
                            className="text-[9px] py-0 px-1 border-primary/40 text-primary"
                          >
                            Host
                          </Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {player.role || "Athlete"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {player.joinedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Join Form / Already Joined Status */}
          <div className="pt-2 border-t border-border/70">
            {isJoined ? (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <UserCheck className="h-5 w-5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold">Your spot is confirmed!</p>
                    <p className="text-muted-foreground mt-0.5">
                      Please reach the venue 15 minutes before {game.time}.
                    </p>
                  </div>
                </div>
                <Button
                  id="game-leave-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleLeave}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0 text-xs"
                >
                  Cancel My RSVP
                </Button>
              </div>
            ) : full ? (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center text-xs space-y-1">
                <div className="font-semibold text-amber-800 dark:text-amber-300">
                  Game is at Full Capacity
                </div>
                <p className="text-muted-foreground">
                  All {game.capacity} slots are taken. Check back later or host your own game at{" "}
                  {game.venue}.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleJoin}
                className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/60"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground">
                    Join this Game ({spotsLeft} spots left)
                  </h4>
                  <span className="text-xs font-bold text-primary">
                    ₹{game.costPerPlayer} / player
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="join-player-name" className="text-xs">
                      Your Name *
                    </Label>
                    <Input
                      id="join-player-name"
                      placeholder="e.g. Sameer Verma"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="join-player-position" className="text-xs">
                      Playing Position / Preference (Optional)
                    </Label>
                    <Input
                      id="join-player-position"
                      placeholder="e.g. Midfielder, Singles/Doubles"
                      value={playerPosition}
                      onChange={(e) => setPlayerPosition(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <Button
                  id="game-confirm-join-btn"
                  type="submit"
                  disabled={joining}
                  className="w-full font-medium gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {joining ? "Reserving Spot..." : `Confirm Spot & RSVP (₹${game.costPerPlayer})`}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
