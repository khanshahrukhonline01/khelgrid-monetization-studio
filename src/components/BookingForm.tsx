import React, { useState, useMemo, useEffect, useId } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trophy,
  Loader2,
  RotateCcw,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useBookings, type CreateBookingParams } from "@/hooks/useBookings";
import { useToast } from "@/hooks/useToast";
import { VENUES, type Venue } from "@/data/khelgrid";
import { type BookingRecord } from "@/lib/booking-service";

export interface BookingFormProps {
  /**
   * Optional pre-selected venue ID. If omitted, user can choose from all venues.
   */
  venueId?: string;
  /**
   * Pre-selected sport.
   */
  defaultSport?: string;
  /**
   * Pre-selected booking date in YYYY-MM-DD format.
   */
  defaultDate?: string;
  /**
   * Pre-selected start time, e.g. "06:00 PM".
   */
  defaultTime?: string;
  /**
   * Callback fired upon successful booking reservation.
   */
  onSuccess?: (booking: BookingRecord) => void;
  /**
   * Callback fired when cancel button is clicked.
   */
  onCancel?: () => void;
  /**
   * Optional CSS classes for the container card.
   */
  className?: string;
}

const DEFAULT_SLOTS = [
  { time: "06:00 AM", period: "Morning", isPeak: false },
  { time: "07:00 AM", period: "Morning", isPeak: false },
  { time: "08:00 AM", period: "Morning", isPeak: false },
  { time: "09:00 AM", period: "Morning", isPeak: false },
  { time: "10:00 AM", period: "Morning", isPeak: false },
  { time: "04:00 PM", period: "Evening", isPeak: false },
  { time: "05:00 PM", period: "Evening", isPeak: true },
  { time: "06:00 PM", period: "Evening", isPeak: true },
  { time: "07:00 PM", period: "Evening", isPeak: true },
  { time: "08:00 PM", period: "Evening", isPeak: true },
  { time: "09:00 PM", period: "Night", isPeak: true },
  { time: "10:00 PM", period: "Night", isPeak: false },
];

export function BookingForm({
  venueId,
  defaultSport,
  defaultDate,
  defaultTime,
  onSuccess,
  onCancel,
  className = "",
}: BookingFormProps) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const teamId = useId();
  const notesId = useId();

  // Initialize selected venue
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venueId || VENUES[0]?.id || "v-1");

  const venue: Venue = useMemo(() => {
    return VENUES.find((v) => v.id === selectedVenueId) || VENUES[0];
  }, [selectedVenueId]);

  // Sport selection
  const [selectedSport, setSelectedSport] = useState<string>(
    defaultSport || venue.sports[0] || "Football",
  );

  useEffect(() => {
    if (!venue.sports.includes(selectedSport)) {
      setSelectedSport(venue.sports[0] || "Football");
    }
  }, [venue, selectedSport]);

  // Date selection
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }, []);

  const maxDateStr = useMemo(() => {
    const future = new Date();
    future.setDate(future.getDate() + 14);
    return future.toISOString().split("T")[0];
  }, []);

  const [bookingDate, setBookingDate] = useState<string>(defaultDate || todayStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTime || "06:00 PM");
  const [durationHours, setDurationHours] = useState<number>(1);

  // Customer contact info
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Hook interaction
  const { createBooking, isCreating, error, clearError } = useBookings({
    autoFetch: false,
  });
  const { toast } = useToast();

  // Calculate pricing
  const hourlyRate = venue.pricePerHour || 600;
  const totalPrice = hourlyRate * durationHours;

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!selectedTime) {
      errors.time = "Please select a booking time slot.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      toast({
        title: "Incomplete Booking Details",
        description:
          "Please fill in all mandatory fields (Name, Email, 10-digit Phone, Slot) to proceed.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateBookingParams = {
      venue: {
        id: venue.id,
        name: venue.name,
        area: venue.area,
        city: venue.city,
        price_per_hour: venue.pricePerHour,
        sports: venue.sports,
        image_url: venue.image,
      },
      court_name: `${selectedSport} Court 1 (Main Pitch)`,
      sport: selectedSport,
      booking_date: bookingDate,
      start_time: selectedTime,
      duration_hours: durationHours,
      user_email: email.trim(),
      user_phone: phone.trim(),
    };

    const res = await createBooking(payload);

    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
      toast({
        title: "Slot Reserved Successfully!",
        description: `Confirmed for ${payload.booking_date} at ${payload.start_time} (${venue.name}).`,
        variant: "success",
      });
      if (onSuccess) {
        onSuccess(res.booking);
      }
    } else {
      toast({
        title: "Booking Failed",
        description:
          res.message || "Failed to confirm court reservation. Please try another time slot.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    clearError();
    setFieldErrors({});
    toast({
      title: "Form Cleared",
      description: "Ready to schedule a new court booking.",
      variant: "default",
    });
  };

  // Success view
  if (confirmedBooking) {
    return (
      <Card className={`border-emerald-500/30 bg-emerald-950/10 shadow-lg ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            Booking Confirmed!
          </CardTitle>
          <CardDescription className="text-sm">
            Your court has been atomically locked and reserved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Booking ID</span>
              <span className="text-xs font-mono font-bold text-foreground">
                {confirmedBooking.id}
              </span>
            </div>
            <Separator />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {confirmedBooking.venue_name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {confirmedBooking.venue_area}, {confirmedBooking.venue_city}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {confirmedBooking.sport}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium text-foreground">{confirmedBooking.booking_date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <p className="font-medium text-foreground">
                  {confirmedBooking.start_time} - {confirmedBooking.end_time}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Total Paid:</span>
              <span className="font-bold text-primary text-base">
                ₹{confirmedBooking.total_price}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Digital pass sent to {confirmedBooking.user_email}. Present on arrival.</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Book Another Slot
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`shadow-md border-border/70 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Schedule Court Booking
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Real-time slot locking with atomic conflict prevention.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5">
            ₹{hourlyRate}/hr
          </Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {/* Global Hook Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Booking Conflict Detected</AlertTitle>
              <AlertDescription className="text-xs mt-1 flex flex-col gap-2">
                <span>{error}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit text-xs h-7 px-2"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* 1. Venue & Sport Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Select Sports Venue</Label>
              <Select
                value={selectedVenueId}
                onValueChange={(val) => {
                  setSelectedVenueId(val);
                  clearError();
                }}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Choose a venue" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {VENUES.map((v) => (
                    <SelectItem key={v.id} value={v.id} className="text-xs">
                      {v.name} ({v.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sport / Court Type</Label>
              <Select
                value={selectedSport}
                onValueChange={(val) => {
                  setSelectedSport(val);
                  clearError();
                }}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {venue.sports.map((sp) => (
                    <SelectItem key={sp} value={sp} className="text-xs">
                      {sp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 2. Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Booking Date
              </Label>
              <Input
                type="date"
                min={todayStr}
                max={maxDateStr}
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  clearError();
                }}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Duration
              </Label>
              <Select
                value={String(durationHours)}
                onValueChange={(val) => setDurationHours(Number(val))}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-xs">
                    1 Hour (Standard)
                  </SelectItem>
                  <SelectItem value="2" className="text-xs">
                    2 Hours (Match Play)
                  </SelectItem>
                  <SelectItem value="3" className="text-xs">
                    3 Hours (Tournament)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Slot Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium flex items-center gap-1">
                <span>Select Time Slot</span>
                <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Current: <span className="font-semibold text-foreground">{selectedTime}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DEFAULT_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(slot.time);
                      clearError();
                      if (fieldErrors.time) {
                        setFieldErrors((prev) => ({ ...prev, time: "" }));
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                        : "border-border/60 hover:border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span>{slot.time}</span>
                    {slot.isPeak && (
                      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">
                        Peak
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {fieldErrors.time && <p className="text-[11px] text-destructive">{fieldErrors.time}</p>}
          </div>

          <Separator />

          {/* 4. Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Player & Contact Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={nameId} className="text-xs">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id={nameId}
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) {
                        setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                      }
                    }}
                    className="pl-8 text-xs"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-destructive">{fieldErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor={phoneId} className="text-xs">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id={phoneId}
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                    className="pl-8 text-xs"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-destructive">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor={emailId} className="text-xs">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id={emailId}
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  className="pl-8 text-xs"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={teamId} className="text-xs">
                  Team Name <span className="text-[10px] text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id={teamId}
                  placeholder="e.g. Bangalore Strikers"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={notesId} className="text-xs">
                  Special Requests{" "}
                  <span className="text-[10px] text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id={notesId}
                  placeholder="Need racquets / extra bibs"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* 5. Pricing Summary Box */}
          <div className="rounded-lg bg-muted/40 border border-border/60 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {durationHours} {durationHours === 1 ? "Hour" : "Hours"} @ ₹{hourlyRate}/hr
              </span>
              <span>₹{totalPrice}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>Grand Total</span>
              <span className="text-primary text-base font-bold">₹{totalPrice}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={isCreating}
            className="w-full flex-1 font-semibold flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Locking & Confirming Slot...</span>
              </>
            ) : (
              <>
                <span>Confirm & Book (₹{totalPrice})</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
