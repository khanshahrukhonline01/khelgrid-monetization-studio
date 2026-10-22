import React, { useState, useMemo, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfToday,
  parseISO,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  MapPin,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  Search,
  RotateCcw,
  Users,
  Flame,
  AlertCircle,
  Share2,
} from "lucide-react";
import { TRIALS, SPORTS, CITIES, type Trial } from "@/data/trials";
import { getTrialEndDate } from "@/lib/opportunity-badge";
import { fetchAvailableTrialsFromSupabase } from "@/lib/trials-service";
import {
  aggregateTrialsToCalendarEvents,
  groupEventsByDateString,
  generateIcsCalendar,
  type CalendarEvent,
} from "@/lib/sports-calendar-utils";
import { TrialDetailsModal } from "@/components/TrialDetailsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export interface SportsCalendarProps {
  initialTrials?: Trial[];
  className?: string;
  onSelectTrial?: (trial: Trial) => void;
  showExportButton?: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isCurrentOrUpcomingTrial(trial: Pick<Trial, "date">): boolean {
  const endDate = getTrialEndDate(trial.date);
  return Boolean(endDate && endDate.getTime() >= Date.now());
}

export function SportsCalendar({
  initialTrials,
  className = "",
  onSelectTrial,
  showExportButton = true,
}: SportsCalendarProps) {
  const [trialsList, setTrialsList] = useState<Trial[]>(() =>
    (initialTrials || TRIALS).filter(isCurrentOrUpcomingTrial),
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Modals state
  const [activeModalTrial, setActiveModalTrial] = useState<Trial | null>(null);

  // Filters
  const [selectedSport, setSelectedSport] = useState<string>("All Sports");
  const [selectedCity, setSelectedCity] = useState<string>("All Locations");
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "trials" | "deadlines" | "free">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load latest live trials from Supabase if not provided
  useEffect(() => {
    if (initialTrials && initialTrials.length > 0) return;
    let isMounted = true;
    fetchAvailableTrialsFromSupabase().then((res) => {
      if (isMounted && res.isSupabaseLive && res.trials.length > 0) {
        const map = new Map<string, Trial>();
        TRIALS.filter(isCurrentOrUpcomingTrial).forEach((t) => map.set(t.id, t));
        res.trials.forEach((t) => map.set(t.id, t as unknown as Trial));
        setTrialsList(Array.from(map.values()).filter(isCurrentOrUpcomingTrial));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialTrials]);

  // Filter trials according to user selections
  const filteredTrials = useMemo(() => {
    return trialsList.filter((trial) => {
      // 1. Sport
      if (
        selectedSport !== "All Sports" &&
        trial.sport.toLowerCase() !== selectedSport.toLowerCase()
      ) {
        return false;
      }

      // 2. City
      if (
        selectedCity !== "All Locations" &&
        trial.city.toLowerCase() !== selectedCity.toLowerCase()
      ) {
        return false;
      }

      // 3. Free Entry filter
      if (eventTypeFilter === "free" && trial.fee > 0) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text =
          `${trial.title} ${trial.academy} ${trial.sport} ${trial.city} ${trial.venue || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [trialsList, selectedSport, selectedCity, eventTypeFilter, searchQuery]);

  // Aggregate all events
  const allEvents = useMemo(() => {
    const rawEvents = aggregateTrialsToCalendarEvents(filteredTrials);
    if (eventTypeFilter === "deadlines") {
      return rawEvents.filter((e) => e.type === "deadline");
    }
    if (eventTypeFilter === "trials") {
      return rawEvents.filter((e) => e.type === "trial_day");
    }
    return rawEvents;
  }, [filteredTrials, eventTypeFilter]);

  // Group events by date string "YYYY-MM-DD"
  const eventsByDate = useMemo(() => {
    return groupEventsByDateString(allEvents);
  }, [allEvents]);

  // Calendar days grid calculation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return eventsByDate.get(key) || [];
  }, [eventsByDate, selectedDate]);

  // Month summary statistics
  const monthStats = useMemo(() => {
    const mEvents = allEvents.filter((e) => isSameMonth(e.date, currentMonth));
    const uniqueTrialIds = new Set(mEvents.map((e) => e.trialId));
    const uniqueSports = new Set(mEvents.map((e) => e.sport));
    const deadlineCount = mEvents.filter((e) => e.type === "deadline").length;
    const freeCount = mEvents.filter((e) => e.fee === 0 && e.type === "trial_day").length;

    return {
      totalTrials: uniqueTrialIds.size,
      sportsCount: uniqueSports.size,
      deadlineCount,
      freeCount,
    };
  }, [allEvents, currentMonth]);

  // Navigation handlers
  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const handleTodayClick = () => {
    const now = new Date();
    // If today has trials, go to today, otherwise Oct 2026 anchor
    setCurrentMonth(now);
    setSelectedDate(now);
  };

  const handleQuickMonthJump = (monthOffsetFromOct2026: number) => {
    const target = new Date(2026, 9 + monthOffsetFromOct2026, 1);
    setCurrentMonth(target);
    setSelectedDate(target);
  };

  const handleDownloadIcs = () => {
    try {
      const monthTitle = format(currentMonth, "MMMM yyyy");
      const icsData = generateIcsCalendar(allEvents, `KhelGrid Sports Trials - ${monthTitle}`);
      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `khelgrid-sports-trials-${format(currentMonth, "yyyy-MM")}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${monthTitle} trials to iCalendar (.ics)!`);
    } catch {
      toast.error("Failed to export calendar. Please try again.");
    }
  };

  const handleResetFilters = () => {
    setSelectedSport("All Sports");
    setSelectedCity("All Locations");
    setEventTypeFilter("all");
    setSearchQuery("");
    toast.info("Calendar filters reset");
  };

  const handleOpenTrialDetails = (trial: Trial) => {
    if (onSelectTrial) {
      onSelectTrial(trial);
    } else {
      setActiveModalTrial(trial);
    }
  };

  return (
    <div
      id="centralized-sports-calendar"
      className={`w-full rounded-2xl border border-border/80 bg-card p-4 sm:p-6 md:p-8 space-y-6 shadow-sm ${className}`}
    >
      {/* 1. CALENDAR HEADER & METADATA BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Sports Selection Calendar
            </h2>
            <Badge
              variant="outline"
              className="text-xs font-semibold text-primary border-primary/30"
            >
              Monthly View
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Centralized agenda of verified selection trials, combine dates, and registration
            deadlines across India
          </p>
        </div>

        {/* Action Controls: Month Nav & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Stepper */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/40 p-1 shadow-xs">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="h-8 w-8 p-0 hover:bg-secondary text-foreground cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs sm:text-sm font-bold text-foreground min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="h-8 w-8 p-0 hover:bg-secondary text-foreground cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Jump Buttons */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-secondary/30 p-1 text-xs">
            <button
              type="button"
              onClick={() => handleQuickMonthJump(0)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                currentMonth.getMonth() === 9 && currentMonth.getFullYear() === 2026
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Oct 2026
            </button>
            <button
              type="button"
              onClick={() => handleQuickMonthJump(1)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                currentMonth.getMonth() === 10 && currentMonth.getFullYear() === 2026
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nov 2026
            </button>
            <button
              type="button"
              onClick={() => handleQuickMonthJump(2)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                currentMonth.getMonth() === 11 && currentMonth.getFullYear() === 2026
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dec 2026
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
            className="h-8 text-xs font-semibold cursor-pointer border-border"
          >
            Today
          </Button>

          {showExportButton && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownloadIcs}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export .ICS</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. FILTERS & SEARCH ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search academy or tournament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs rounded-xl border-border bg-secondary/30"
          />
        </div>

        {/* Sport Select */}
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-secondary/30">
            <Trophy className="h-3.5 w-3.5 text-primary mr-1 shrink-0" />
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="All Sports">All Sports</SelectItem>
            {SPORTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Select */}
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-secondary/30">
            <MapPin className="h-3.5 w-3.5 text-primary mr-1 shrink-0" />
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="All Locations">All Locations</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type / Free Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/20 p-1 text-xs">
          <button
            type="button"
            onClick={() => setEventTypeFilter("all")}
            className={`flex-1 py-1 rounded-lg font-medium text-center transition cursor-pointer ${
              eventTypeFilter === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setEventTypeFilter("trials")}
            className={`flex-1 py-1 rounded-lg font-medium text-center transition cursor-pointer ${
              eventTypeFilter === "trials"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Trials
          </button>
          <button
            type="button"
            onClick={() => setEventTypeFilter("deadlines")}
            className={`flex-1 py-1 rounded-lg font-medium text-center transition cursor-pointer ${
              eventTypeFilter === "deadlines"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Deadlines
          </button>
          <button
            type="button"
            onClick={() => setEventTypeFilter("free")}
            className={`flex-1 py-1 rounded-lg font-medium text-center transition cursor-pointer ${
              eventTypeFilter === "free"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ₹0 Free
          </button>
        </div>
      </div>

      {/* Active filter pills & reset button */}
      {(selectedSport !== "All Sports" ||
        selectedCity !== "All Locations" ||
        eventTypeFilter !== "all" ||
        searchQuery.trim()) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground">Active Filters:</span>
          {selectedSport !== "All Sports" && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              {selectedSport}
              <button
                type="button"
                onClick={() => setSelectedSport("All Sports")}
                className="hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCity !== "All Locations" && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              {selectedCity}
              <button
                type="button"
                onClick={() => setSelectedCity("All Locations")}
                className="hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {eventTypeFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              {eventTypeFilter === "free" ? "Free Entry" : eventTypeFilter}
              <button
                type="button"
                onClick={() => setEventTypeFilter("all")}
                className="hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-6 text-[11px] text-muted-foreground hover:text-foreground px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Clear all
          </Button>
        </div>
      )}

      {/* 3. MONTHLY METRIC HIGHLIGHTS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border/70 bg-secondary/15 p-3.5 text-xs">
        <div>
          <span className="text-muted-foreground text-[11px] block">
            Trials Active in {format(currentMonth, "MMM")}
          </span>
          <span className="text-base sm:text-lg font-bold text-foreground tabular-nums">
            {monthStats.totalTrials} Events
          </span>
        </div>
        <div>
          <span className="text-muted-foreground text-[11px] block">Sports Disciplines</span>
          <span className="text-base sm:text-lg font-bold text-primary tabular-nums">
            {monthStats.sportsCount} Sports
          </span>
        </div>
        <div>
          <span className="text-muted-foreground text-[11px] block">Free Entry (₹0)</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {monthStats.freeCount} Opportunities
          </span>
        </div>
        <div>
          <span className="text-muted-foreground text-[11px] block">Closing Deadlines</span>
          <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {monthStats.deadlineCount} Deadlines
          </span>
        </div>
      </div>

      {/* 4. MAIN MONTHLY CALENDAR GRID */}
      <div className="rounded-xl border border-border/80 overflow-hidden bg-background shadow-xs">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-border bg-secondary/40 text-center text-xs font-bold text-muted-foreground py-2.5">
          {WEEKDAYS.map((day) => (
            <div key={day} className="tracking-wider uppercase text-[11px]">
              {day}
            </div>
          ))}
        </div>

        {/* 7-column calendar cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dateKey) || [];
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            const hasDeadlines = dayEvents.some((e) => e.type === "deadline");
            const hasTrials = dayEvents.some((e) => e.type === "trial_day");

            return (
              <div
                key={dateKey}
                onClick={() => setSelectedDate(day)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedDate(day);
                  }
                }}
                className={`min-h-[72px] sm:min-h-[96px] md:min-h-[110px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  !isCurrentMonth
                    ? "bg-muted/30 text-muted-foreground/60"
                    : "bg-card hover:bg-secondary/30"
                } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
              >
                {/* Cell Header: Day Number and Badges */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold rounded-full h-6 w-6 tabular-nums ${
                      isTodayDate
                        ? "bg-primary text-primary-foreground"
                        : isSelected
                          ? "bg-foreground text-background"
                          : "text-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold">
                      {hasDeadlines && (
                        <span
                          className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"
                          title="Registration Deadline"
                        />
                      )}
                      {hasTrials && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" title="Trial Day" />
                      )}
                      <span className="hidden sm:inline font-mono text-muted-foreground">
                        {dayEvents.length}
                      </span>
                    </span>
                  )}
                </div>

                {/* Event previews inside cell (Desktop/Tablet) */}
                <div className="space-y-1 mt-1 overflow-hidden w-full">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className={`hidden sm:block truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight ${
                        ev.type === "deadline"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                      title={`${ev.title} (${ev.sport} in ${ev.city})`}
                    >
                      {ev.type === "deadline" ? "⚠️ Last Day" : `${ev.sport}: ${ev.title}`}
                    </div>
                  ))}

                  {dayEvents.length > 2 && (
                    <div className="hidden sm:block text-[9px] font-bold text-muted-foreground text-right pr-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}

                  {/* Compact mobile dot row */}
                  <div className="sm:hidden flex flex-wrap gap-0.5 pt-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          ev.type === "deadline" ? "bg-amber-500" : "bg-primary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DAY SCHEDULE & TRIAL AGENDA INSPECTOR */}
      <div
        id="calendar-day-agenda-inspector"
        className="rounded-xl border border-border/80 bg-secondary/20 p-4 sm:p-6 space-y-4 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>Agenda for {format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDateEvents.length} event
              {selectedDateEvents.length === 1 ? "" : "s"} scheduled on this date
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Trial Day
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground ml-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Deadline Closing
            </span>
          </div>
        </div>

        {/* Selected date events list */}
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 transition hover:border-primary/50 shadow-xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs font-bold text-primary border-primary/30"
                    >
                      {ev.sport}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {ev.city}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        ev.fee === 0
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {ev.fee === 0 ? "Free Entry (₹0)" : `₹${ev.fee}`}
                    </span>
                    {ev.type === "deadline" && (
                      <Badge className="bg-amber-500 text-white text-[10px] font-bold">
                        Registration Deadline
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                    {ev.title}
                  </h4>

                  <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                    <span>
                      Organized by <strong>{ev.trial.academy}</strong>
                    </span>
                    {ev.venue && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Venue: {ev.venue}</span>
                      </>
                    )}
                  </p>

                  {ev.trial.urgencyText && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 pt-0.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{ev.trial.urgencyText}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenTrialDetails(ev.trial)}
                    className="h-8 text-xs font-semibold cursor-pointer border-border"
                  >
                    View Details
                  </Button>
                  {ev.trial.sourceUrl && (
                    <a
                      href={ev.trial.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition shadow-xs"
                    >
                      <span>Official Notice</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl border border-dashed border-border/70 p-6 space-y-3">
            <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground">
              No trials or deadlines scheduled for {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Try selecting a highlighted date with green or amber dots above, or switch to October
              23, 2026 to view upcoming state selections.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(2026, 9, 23))}
                className="text-xs font-semibold cursor-pointer"
              >
                Jump to Oct 23 (SAI NCOE Trials)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(2026, 10, 5))}
                className="text-xs font-semibold cursor-pointer"
              >
                Jump to Nov 5 (DDCA Trials)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(2026, 10, 7))}
                className="text-xs font-semibold cursor-pointer"
              >
                Jump to Nov 7 (Khel Maharan 3.0)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details modal fallback when clicked */}
      {activeModalTrial && (
        <TrialDetailsModal
          trial={activeModalTrial}
          isOpen={!!activeModalTrial}
          onClose={() => setActiveModalTrial(null)}
          onRegister={() => {
            if (activeModalTrial.sourceUrl) {
              window.open(activeModalTrial.sourceUrl, "_blank", "noopener,noreferrer");
            }
            toast.success(`Opening registration for ${activeModalTrial.title}`);
          }}
        />
      )}
    </div>
  );
}

export default SportsCalendar;
