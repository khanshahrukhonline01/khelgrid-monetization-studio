import { useState, useId } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trophy,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VenueBookingCalendar } from "./VenueBookingCalendar";
import { VenueSlotSelector } from "./VenueSlotSelector";
import { useVenueBooking, type UseVenueBookingOptions } from "@/hooks/useVenueBooking";
import { toast } from "sonner";
import { type BookingRecord } from "@/lib/booking-service";

export interface VenueBookingFormProps extends UseVenueBookingOptions {
  showVenueSelector?: boolean;
  onBookingComplete?: (booking: BookingRecord) => void;
  className?: string;
}

export function VenueBookingForm({
  showVenueSelector = true,
  onBookingComplete,
  className = "",
  ...bookingOptions
}: VenueBookingFormProps) {
  const {
    // Venue
    selectedVenueId,
    setSelectedVenueId,
    venue,
    allVenues,
    selectedSport,
    setSelectedSport,
    availableSports,

    // Date
    selectedDate,
    setSelectedDate,

    // Courts & Slots
    courts,
    selectedCourtId,
    setSelectedCourtId,
    slots,
    selectedSlotTime,
    setSelectedSlotTime,
    durationHours,
    setDurationHours,
    periodFilter,
    setPeriodFilter,
    courtsLoading,
    availabilityLoading,
    availabilityError,

    // Addons
    addons,
    selectedAddonIds,
    toggleAddon,

    // Customer
    customer,
    updateCustomer,

    // Pricing
    priceBreakdown,

    // Actions
    isSubmitting,
    bookingSuccess,
    error,
    confirmBooking,
    resetForm,
  } = useVenueBooking(bookingOptions);

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const formId = useId();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedSlotTime) errs.slot = "Please select a time slot.";
    if (!customer.fullName.trim()) errs.name = "Full name is required.";
    if (!customer.phone.trim() || customer.phone.trim().length < 10)
      errs.phone = "Valid 10-digit mobile number is required.";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in required booking details.");
      return;
    }

    const res = await confirmBooking();
    if (res.success && res.booking) {
      toast.success(`Booking Confirmed! Reference: ${res.booking.id}`, {
        description: `${venue.name} · ${selectedDate} at ${selectedSlotTime}`,
      });
      if (onBookingComplete) {
        onBookingComplete(res.booking);
      }
    } else if (res.error) {
      toast.error(res.error);
    }
  };

  // Google Calendar URL generator for successful booking
  const getGoogleCalendarUrl = (booking: BookingRecord) => {
    const title = encodeURIComponent(`Sports Booking: ${booking.venue_name} (${booking.sport})`);
    const details = encodeURIComponent(
      `Court booking for ${booking.sport} at ${booking.venue_name}.\nBooking ID: ${booking.id}\nDuration: ${booking.duration_hours} hour(s)\nSlot: ${booking.start_time}`,
    );
    const location = encodeURIComponent(
      `${booking.venue_name}, ${booking.venue_area}, ${booking.venue_city}`,
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // If successfully booked, render the interactive success receipt
  if (bookingSuccess) {
    return (
      <div
        id="venue-booking-success-card"
        className={`rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-background to-card p-6 sm:p-8 shadow-md text-foreground space-y-6 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Booking Request Submitted
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Request for {bookingSuccess.venue_name}
              </h2>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 font-mono">
            ID: {bookingSuccess.id.slice(-10)}
          </Badge>
        </div>

        {/* Matchday Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" /> Date
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">{bookingSuccess.booking_date}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" /> Slot Time
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">
              {bookingSuccess.start_time} ({bookingSuccess.duration_hours} hr)
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <Trophy className="h-3 w-3 text-primary" /> Sport
            </span>
            <p className="mt-1 text-sm font-bold text-foreground">{bookingSuccess.sport}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">
              Estimated Total
            </span>
            <p className="mt-1 text-sm font-bold text-primary">₹{bookingSuccess.total_price}</p>
          </div>
        </div>

        {/* Location & Instructions */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 text-xs space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Venue Location:</span>
              <p className="text-muted-foreground">
                {bookingSuccess.venue_name}, {bookingSuccess.venue_area},{" "}
                {bookingSuccess.venue_city}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-2 border-t border-border/40">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              This is a booking request, not a confirmed reservation or payment receipt. Contact the
              venue to confirm acceptance. Reference code / mobile (
              {customer.phone || bookingSuccess.user_phone}) at the venue front desk 10 minutes
              prior to game time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="default" className="gap-2 h-10 font-semibold rounded-xl">
            <a
              href={getGoogleCalendarUrl(bookingSuccess)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="h-4 w-4" /> Add to Google Calendar
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="gap-2 h-10 rounded-xl"
          >
            <RotateCcw className="h-4 w-4" /> Book Another Slot
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      id={`venue-booking-form-${formId}`}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {/* 1. Venue & Sport Header */}
      <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Interactive Slot Booking
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {venue.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              {venue.area}, {venue.city}
              <span className="text-muted-foreground/60">•</span>
              <span className="font-semibold text-foreground">
                {venue.pricePerHour > 0
                  ? `Starting at ₹${venue.pricePerHour.toLocaleString("en-IN")}/hr`
                  : "Contact venue for price"}
              </span>
            </p>
          </div>

          {showVenueSelector && (
            <div className="min-w-[220px]">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                Change Venue
              </label>
              <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {allVenues.map((v) => (
                    <SelectItem key={v.id} value={v.id} className="text-xs">
                      {v.name} ({v.city} · ₹{v.pricePerHour}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Calendar Component */}
      <VenueBookingCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        venueName={venue.name}
      />

      {/* Availability is fail-closed: never invent courts or claim a slot is available when the live check fails. */}
      {(courtsLoading || availabilityLoading) && (
        <div
          role="status"
          className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        >
          Checking this venue’s published courts and recorded booking conflicts…
        </div>
      )}
      {availabilityError && !courtsLoading && !availabilityLoading && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>{availabilityError}</span>
        </div>
      )}

      <p className="px-1 text-xs text-muted-foreground">
        “Available” means no overlapping booking record was found for this slot. Venue opening hours
        and final acceptance still need to be confirmed with the venue.
      </p>

      {/* 3. Interactive Slot & Court Selector */}
      <VenueSlotSelector
        sports={availableSports}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        courts={courts}
        selectedCourtId={selectedCourtId}
        onSelectCourt={setSelectedCourtId}
        slots={slots}
        selectedSlotTime={selectedSlotTime}
        onSelectSlot={(time) => {
          setSelectedSlotTime(time);
          if (validationErrors.slot) {
            setValidationErrors((prev) => {
              const copy = { ...prev };
              delete copy.slot;
              return copy;
            });
          }
        }}
        durationHours={durationHours}
        onDurationChange={setDurationHours}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
      />
      {validationErrors.slot && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium px-2">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{validationErrors.slot}</span>
        </div>
      )}

      {/* 4. Equipment & Matchday Add-ons */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" /> Optional Add-ons & Equipment
            </h3>
            <p className="text-xs text-muted-foreground">
              Add gear rentals, team bibs, or hydration ready on court arrival
            </p>
          </div>
          {selectedAddonIds.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedAddonIds.length} added (+₹{priceBreakdown.addonsTotal})
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {addons.map((addon) => {
            const isChecked = selectedAddonIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isChecked
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-2xs"
                    : "border-border/70 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-background"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-foreground">{addon.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-6 line-clamp-1">
                    {addon.description}
                  </p>
                </div>
                <span className="text-xs font-bold text-foreground shrink-0">+₹{addon.price}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Player Information & Contact Details */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Player & Contact Information
          </h3>
          <p className="text-xs text-muted-foreground">
            No account is required. This submits a request only; contact the venue to confirm
            acceptance. KhelGrid does not collect payment in this phase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Rahul Sharma"
                value={customer.fullName}
                onChange={(e) => updateCustomer({ fullName: e.target.value })}
                className="pl-9 h-10 text-xs"
              />
            </div>
            {validationErrors.name && (
              <span className="text-[11px] text-destructive mt-1 block">
                {validationErrors.name}
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Mobile Phone <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="10-digit phone number"
                type="tel"
                value={customer.phone}
                onChange={(e) => updateCustomer({ phone: e.target.value })}
                className="pl-9 h-10 text-xs"
              />
            </div>
            {validationErrors.phone && (
              <span className="text-[11px] text-destructive mt-1 block">
                {validationErrors.phone}
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="For booking confirmation"
                type="email"
                value={customer.email}
                onChange={(e) => updateCustomer({ email: e.target.value })}
                className="pl-9 h-10 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Number of Players
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  updateCustomer({ playerCount: Math.max(1, customer.playerCount - 1) })
                }
                className="h-10 w-10 shrink-0"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="flex-1 h-10 rounded-md border border-input bg-muted/30 flex items-center justify-center text-xs font-bold text-foreground">
                <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                {customer.playerCount} Players
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  updateCustomer({ playerCount: Math.min(22, customer.playerCount + 1) })
                }
                className="h-10 w-10 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Team Name or Match Notes (Optional)
          </label>
          <Input
            placeholder="e.g. Bangalore Strikers FC · Need ball pump on arrival"
            value={customer.specialRequests}
            onChange={(e) => updateCustomer({ specialRequests: e.target.value })}
            className="h-10 text-xs"
          />
        </div>
      </div>

      {/* 6. Pricing Summary & Final Action Bar */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-secondary/20 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h4 className="text-sm font-bold text-foreground">Price Calculation Breakdown</h4>
            <p className="text-xs text-muted-foreground">
              {venue.name} · {selectedSport} ({durationHours} hr)
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {selectedDate}
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>
              Court Fee ({durationHours} hr × ₹{priceBreakdown.baseRatePerHour})
            </span>
            <span className="font-semibold text-foreground">
              ₹{priceBreakdown.baseRatePerHour * durationHours}
            </span>
          </div>

          {priceBreakdown.peakSurcharge > 0 && (
            <div className="flex justify-between text-amber-600 dark:text-amber-400">
              <span>Peak Hours Adjustment (+15%)</span>
              <span className="font-semibold">+₹{priceBreakdown.peakSurcharge}</span>
            </div>
          )}

          {priceBreakdown.offPeakDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Off-Peak Early Morning Discount</span>
              <span className="font-semibold">-₹{priceBreakdown.offPeakDiscount}</span>
            </div>
          )}

          {priceBreakdown.addonsTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Add-ons Subtotal</span>
              <span className="font-semibold text-foreground">+₹{priceBreakdown.addonsTotal}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Convenience & Platform Fee (5%)</span>
            <span className="font-semibold text-foreground">+₹{priceBreakdown.taxesAndFees}</span>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between text-base font-extrabold text-foreground">
            <span>Total Payable Amount</span>
            <span className="text-2xl font-black text-primary">₹{priceBreakdown.grandTotal}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          id="venue-booking-submit-btn"
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full h-12 text-sm sm:text-base font-bold gap-2 rounded-2xl shadow-sm"
        >
          {isSubmitting ? (
            "Securing Slot Reservation..."
          ) : selectedSlotTime ? (
            <>
              <ShieldCheck className="h-5 w-5" /> Reserve Slot Now · ₹{priceBreakdown.grandTotal} (
              {selectedSlotTime})
            </>
          ) : (
            "Please Select a Time Slot Above"
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground">
          Free cancellation available up to 4 hours before the match slot. Instant booking
          confirmation stored locally.
        </p>
      </div>
    </form>
  );
}
