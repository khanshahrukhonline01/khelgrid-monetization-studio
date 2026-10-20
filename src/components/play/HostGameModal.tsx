import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { KHELGRID_CITIES, KHELGRID_SPORTS, VENUES } from "@/data/khelgrid";
import type { EnrichedGame } from "./types";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface HostGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameCreated: (game: EnrichedGame) => void;
}

export function HostGameModal({ open, onOpenChange, onGameCreated }: HostGameModalProps) {
  const [sport, setSport] = useState<string>("Football");
  const [city, setCity] = useState<string>("Bengaluru");
  const [venue, setVenue] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState<string>("7:00 PM");
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [capacity, setCapacity] = useState<number>(10);
  const [costPerPlayer, setCostPerPlayer] = useState<number>(200);
  const [hostName, setHostName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [equipmentProvided, setEquipmentProvided] = useState<string>("Match ball, training bibs");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Filter venues matching selected city for quick suggestion
  const matchedVenues = VENUES.filter((v) => v.city === city && v.sports.includes(sport));

  const handleVenueSelect = (vName: string) => {
    setVenue(vName);
    const found = VENUES.find((v) => v.name === vName);
    if (found) {
      setArea(found.area);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!venue.trim()) {
      toast.error("Please provide a venue name for your game.");
      return;
    }
    if (!hostName.trim()) {
      toast.error("Please provide your host name.");
      return;
    }
    if (capacity < 2) {
      toast.error("Game capacity must be at least 2 players.");
      return;
    }

    setSubmitting(true);

    try {
      // Format readable date string
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const newGame: EnrichedGame = {
        id: `hosted-${Date.now()}`,
        sport,
        city,
        venue: venue.trim(),
        area: area.trim() || undefined,
        date: formattedDate,
        time,
        durationMinutes,
        skillLevel,
        host: hostName.trim(),
        joined: 1, // Host is the first joined player
        capacity: Number(capacity),
        costPerPlayer: Number(costPerPlayer) || 0,
        description:
          description.trim() ||
          `Casual ${skillLevel.toLowerCase()} ${sport} pickup match at ${venue}. All players are requested to arrive 15 minutes before kick-off.`,
        equipmentProvided: equipmentProvided
          ? equipmentProvided
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : ["Match ball"],
        equipmentNeeded: ["Personal sports attire", "Hydration bottle", "Appropriate footwear"],
        rules: [
          "Respect opponents, teammates, and facility staff.",
          "Arrive 10-15 minutes before the start time.",
          "Notify host in advance if you need to cancel.",
        ],
        contactNumber: contactNumber.trim() || undefined,
        players: [
          {
            id: `player-host-${Date.now()}`,
            name: hostName.trim(),
            role: "Host & Organizer",
            skillLevel,
            joinedAt: "Just now",
            isHost: true,
          },
        ],
        isUserHosted: true,
        isUserJoined: true,
      };

      // Save to localStorage for persistence
      try {
        const stored = localStorage.getItem("khelgrid_hosted_games_v1");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newGame);
        localStorage.setItem("khelgrid_hosted_games_v1", JSON.stringify(list));
      } catch (err) {
        console.warn("Could not persist hosted game to localStorage:", err);
      }

      onGameCreated(newGame);
      toast.success(`Game hosted successfully for ${sport} at ${venue}!`);
      onOpenChange(false);

      // Reset optional fields
      setVenue("");
      setArea("");
      setDescription("");
    } catch (err) {
      toast.error("Failed to create game. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="host-game-dialog-content"
        className="max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader id="host-game-dialog-header">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                Host a Pickup Game
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Publish an open slot to invite nearby players, coordinate match rosters, and split
                court costs.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Sport & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host-sport-select" className="text-xs font-semibold">
                Sport
              </Label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger id="host-sport-select" className="h-9">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {KHELGRID_SPORTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-city-select" className="text-xs font-semibold">
                City
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="host-city-select" className="h-9">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {KHELGRID_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Venue & Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="host-venue-input" className="text-xs font-semibold">
                Venue or Facility Name *
              </Label>
              {matchedVenues.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  Quick pick from {matchedVenues.length} registered venues
                </span>
              )}
            </div>
            <Input
              id="host-venue-input"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Depot18 Sports Arena or Turf Town"
              required
              className="h-9"
            />
            {matchedVenues.length > 0 && !venue && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchedVenues.slice(0, 3).map((v) => (
                  <Badge
                    key={v.id}
                    variant="outline"
                    className="cursor-pointer text-[10px] hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => handleVenueSelect(v.name)}
                  >
                    + {v.name} ({v.area})
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host-area-input" className="text-xs font-semibold">
                Area / Neighborhood
              </Label>
              <Input
                id="host-area-input"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Indiranagar, Andheri West"
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-level-select" className="text-xs font-semibold">
                Target Skill Level
              </Label>
              <Select
                value={skillLevel}
                onValueChange={(val) =>
                  setSkillLevel(val as "Beginner" | "Intermediate" | "Advanced")
                }
              >
                <SelectTrigger id="host-level-select" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (Fun & Casual)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (Regular Players)</SelectItem>
                  <SelectItem value="Advanced">Advanced (Competitive Pace)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host-date-input" className="text-xs font-semibold">
                Match Date
              </Label>
              <Input
                id="host-date-input"
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-time-select" className="text-xs font-semibold">
                Start Time
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="host-time-select" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                  <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                  <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                  <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                  <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                  <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                  <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-duration-select" className="text-xs font-semibold">
                Duration
              </Label>
              <Select
                value={String(durationMinutes)}
                onValueChange={(v) => setDurationMinutes(Number(v))}
              >
                <SelectTrigger id="host-duration-select" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 mins (1 hr)</SelectItem>
                  <SelectItem value="90">90 mins (1.5 hrs)</SelectItem>
                  <SelectItem value="120">120 mins (2 hrs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Capacity and Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host-capacity-input" className="text-xs font-semibold">
                Total Players Needed (Capacity)
              </Label>
              <Input
                id="host-capacity-input"
                type="number"
                min={2}
                max={30}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
                className="h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Includes yourself.{" "}
                {capacity > 1 ? `${capacity - 1} open spots for other players.` : ""}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-cost-input" className="text-xs font-semibold">
                Cost Per Player (₹)
              </Label>
              <Input
                id="host-cost-input"
                type="number"
                min={0}
                step={25}
                value={costPerPlayer}
                onChange={(e) => setCostPerPlayer(Number(e.target.value))}
                required
                className="h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Set to 0 if court is free or already fully covered.
              </p>
            </div>
          </div>

          {/* Host Identity & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host-name-input" className="text-xs font-semibold">
                Your Name / Host Title *
              </Label>
              <Input
                id="host-name-input"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="host-contact-input" className="text-xs font-semibold">
                WhatsApp / Phone (Optional)
              </Label>
              <Input
                id="host-contact-input"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-9"
              />
            </div>
          </div>

          {/* Additional Guidelines / Equipment Provided */}
          <div className="space-y-1.5">
            <Label htmlFor="host-equipment-input" className="text-xs font-semibold">
              Equipment Provided by Host
            </Label>
            <Input
              id="host-equipment-input"
              value={equipmentProvided}
              onChange={(e) => setEquipmentProvided(e.target.value)}
              placeholder="e.g. 2 match balls, bibs, whistle"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="host-notes-input" className="text-xs font-semibold">
              Game Description & Ground Rules (Optional)
            </Label>
            <Textarea
              id="host-notes-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 5v5 friendly game on synthetic turf. Please wear flat turf shoes or sneakers (no metal studs). Free parking available at the venue."
              rows={2}
              className="text-xs"
            />
          </div>

          {/* AdSense Fair Play Advisory */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <p>
              By hosting, you agree to the <strong>KhelGrid Fair Play Code</strong>. All costs must
              be split fairly with no commercial markups on community slots.
            </p>
          </div>

          <DialogFooter id="host-game-dialog-footer" className="gap-2 sm:gap-0 pt-2">
            <Button
              id="host-game-cancel-btn"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              id="host-game-submit-btn"
              type="submit"
              disabled={submitting}
              className="gap-1.5 font-medium"
            >
              <Sparkles className="h-4 w-4" />
              {submitting ? "Publishing Game..." : "Publish Game Slot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
