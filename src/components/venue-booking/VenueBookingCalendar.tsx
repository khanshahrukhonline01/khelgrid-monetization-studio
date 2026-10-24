import { useState, useMemo } from "react";
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
  isBefore,
  startOfToday,
  addDays,
  parseISO,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface VenueBookingCalendarProps {
  selectedDate: string; // ISO format "YYYY-MM-DD"
  onSelectDate: (dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  venueName?: string;
}

export function VenueBookingCalendar({
  selectedDate,
  onSelectDate,
  minDate = startOfToday(),
  className = "",
  venueName,
}: VenueBookingCalendarProps) {
  const selectedDateObj = useMemo(() => {
    try {
      return parseISO(selectedDate);
    } catch {
      return new Date();
    }
  }, [selectedDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDateObj);

  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  // Quick shortcuts
  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
  const saturday = addDays(today, daysUntilSaturday);
  const sunday = addDays(saturday, 1);

  const shortcuts = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: tomorrow },
    { label: "Sat", date: saturday },
    { label: "Sun", date: sunday },
  ];

  // Calendar matrix days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const weekHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      id="venue-booking-calendar-root"
      className={`rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs ${className}`}
    >
      {/* Header with Title & Month Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              Select Booking Date
            </h3>
          </div>
          {venueName && (
            <p className="text-xs text-muted-foreground mt-0.5 ml-9">
              Checking slot availability for {venueName}
            </p>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={prevMonth}
            disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), minDate)}
            className="h-8 w-8 rounded-lg border-border hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 rounded-lg border-border hover:bg-muted"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Date Shortcuts */}
      <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Quick:
        </span>
        {shortcuts.map((sc) => {
          const scIso = format(sc.date, "yyyy-MM-dd");
          const isActive = selectedDate === scIso;
          return (
            <button
              key={sc.label}
              type="button"
              onClick={() => {
                onSelectDate(scIso);
                setCurrentMonth(sc.date);
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all shrink-0 font-medium ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                  : "bg-muted/40 hover:bg-muted text-foreground border-border/70"
              }`}
            >
              {sc.label} ({format(sc.date, "d MMM")})
            </button>
          );
        })}
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {weekHeaders.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((day) => {
          const dayIso = format(day, "yyyy-MM-dd");
          const isSelected = isSameDay(day, selectedDateObj);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(day, minDate);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => {
                onSelectDate(dayIso);
                if (!isCurrentMonth) {
                  setCurrentMonth(day);
                }
              }}
              className={`relative h-11 sm:h-12 w-full rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold shadow-xs scale-102 ring-2 ring-primary/40 ring-offset-2 ring-offset-background z-10"
                  : isPast
                    ? "text-muted-foreground/35 cursor-not-allowed bg-muted/15"
                    : !isCurrentMonth
                      ? "text-muted-foreground/50 hover:bg-muted/30"
                      : "text-foreground hover:bg-muted/70 hover:scale-101"
              } ${isCurrentDay && !isSelected ? "border border-primary font-semibold text-primary" : ""}`}
            >
              <span className="text-xs sm:text-sm">{format(day, "d")}</span>

              {!isPast && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-primary-foreground" : "bg-muted-foreground/50"
                    }`}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Selected Day Status Footer */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <span>Select a date to check live court availability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span>Past / Closed</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-foreground font-medium bg-muted/40 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Selected: {format(selectedDateObj, "EEEE, MMMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}
