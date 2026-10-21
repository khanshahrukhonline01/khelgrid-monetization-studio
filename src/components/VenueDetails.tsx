import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Car,
  Zap,
  Coffee,
  Wifi,
  Copy,
  Check,
  Navigation,
  DollarSign,
  AlertCircle,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { VenueDatePicker } from "@/components/VenueDatePicker";
import {
  VenueImageCarousel,
  resolveFacilityPhotos,
  type FacilityPhoto,
} from "@/components/VenueImageCarousel";
import { VenueReviews, type VenueReview } from "@/components/VenueReviews";
import { VenueFAQ, type FAQItem } from "@/components/VenueFAQ";
import {
  VenuePoliciesAccordion,
  type VenueOperatingHoursData,
  type VenueBookingPoliciesData,
  type VenueRulesRestrictionsData,
} from "@/components/VenuePoliciesAccordion";
import { VenueAmenitiesList, type AmenityConfig } from "@/components/VenueAmenitiesList";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { createVenueBooking } from "@/lib/booking-service";
import {
  BookingConfirmationModal,
  type BookingConfirmationModalProps,
} from "@/components/BookingConfirmationModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VenueBookingForm } from "@/components/venue-booking";
import type { Database } from "@/types/database";
import type { Venue as KhelGridVenue, PibPressReleaseNotice } from "@/data/khelgrid";

export type VenueRow = Database["public"]["Tables"]["venues"]["Row"];

export interface VenueDetailData {
  id: string;
  name: string;
  slug?: string | null;
  area: string;
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sports: string[];
  amenities?: string[];
  price_per_hour: number;
  rating?: number;
  reviews_count?: number;
  featured?: boolean;
  bookable?: boolean;
  image_url?: string | null;
  images?: (string | FacilityPhoto)[];
  contact_phone?: string | null;
  contact_email?: string | null;
  operating_hours?: VenueOperatingHoursData | null;
  booking_policies?: VenueBookingPoliciesData | null;
  rules_restrictions?: VenueRulesRestrictionsData | null;
  pib_press_release?: PibPressReleaseNotice | null;
}

/**
 * Normalizes either a Supabase VenueRow or a KhelGrid Venue object
 * into the standard VenueDetailData interface.
 */
export function normalizeVenueData(v: VenueRow | KhelGridVenue | VenueDetailData): VenueDetailData {
  // Normalize either a Supabase VenueRow or a KhelGrid Venue object
  const rawImages =
    (v as { images?: (string | FacilityPhoto)[]; photos?: (string | FacilityPhoto)[] }).images ||
    (v as { photos?: (string | FacilityPhoto)[] }).photos;

  const rawAny = v as unknown as Record<string, unknown>;
  const operatingHours = (rawAny.operating_hours as VenueOperatingHoursData) || null;
  const bookingPolicies = (rawAny.booking_policies as VenueBookingPoliciesData) || null;
  const rulesRestrictions = (rawAny.rules_restrictions as VenueRulesRestrictionsData) || null;
  const pibPressRelease: PibPressReleaseNotice | null =
    ("pibPressRelease" in v && v.pibPressRelease
      ? (v.pibPressRelease as PibPressReleaseNotice)
      : null) ||
    ("pib_press_release" in v && (v as VenueDetailData).pib_press_release
      ? (v as VenueDetailData).pib_press_release!
      : null) ||
    null;

  if ("price_per_hour" in v) {
    return {
      id: v.id,
      name: v.name,
      slug: v.slug ?? null,
      area: v.area,
      city: v.city,
      address: v.address || `${v.area}, ${v.city}`,
      latitude: v.latitude ?? null,
      longitude: v.longitude ?? null,
      sports: v.sports || [],
      amenities: v.amenities || [],
      price_per_hour: Number(v.price_per_hour || 0),
      rating: Number(v.rating || 0),
      reviews_count: Number(v.reviews_count || 0),
      featured: v.featured ?? false,
      bookable: v.bookable ?? true,
      image_url: v.image_url ?? null,
      images: rawImages,
      contact_phone: v.contact_phone || null,
      contact_email: v.contact_email || null,
      operating_hours: operatingHours,
      booking_policies: bookingPolicies,
      rules_restrictions: rulesRestrictions,
      pib_press_release: pibPressRelease,
    };
  }

  // KhelGrid Venue format
  return {
    id: v.id,
    name: v.name,
    slug: v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    area: v.area,
    city: v.city,
    address: v.address || `${v.area}, ${v.city}`,
    sports: v.sports || [],
    amenities: v.amenities || [],
    price_per_hour: v.pricePerHour,
    rating: v.rating,
    reviews_count: v.reviews,
    featured: v.featured ?? false,
    bookable: v.bookable ?? true,
    image_url: v.image,
    images: rawImages,
    contact_phone: v.contactPhone || null,
    contact_email: v.contactEmail || null,
    operating_hours: operatingHours,
    booking_policies: bookingPolicies,
    rules_restrictions: rulesRestrictions,
    pib_press_release: pibPressRelease,
  };
}

export interface VenueDetailsProps {
  venue: VenueRow | KhelGridVenue | VenueDetailData;
  onBook?: (venue: VenueDetailData, selectedDate?: string, selectedTime?: string) => void;
  onClose?: () => void;
  className?: string;
  defaultConfirmModalOpen?: boolean;
  confirmModalInline?: boolean;
}

const AVAILABLE_TIMES = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export function VenueDetails({
  venue: rawVenue,
  onBook,
  onClose,
  className = "",
  defaultConfirmModalOpen = false,
  confirmModalInline = false,
}: VenueDetailsProps) {
  const venue = normalizeVenueData(rawVenue);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [selectedTime, setSelectedTime] = useState<string>("6:00 PM");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(defaultConfirmModalOpen);
  const [isInteractiveBookingOpen, setIsInteractiveBookingOpen] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const fullAddress = venue.address || `${venue.area}, ${venue.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.name}, ${fullAddress}`,
  )}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("venueId", venue.id);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  const sportsSummary = venue.sports?.slice(0, 2).join(" & ") || "Sports";
  const shareText = `Check out ${venue.name} in ${venue.city}! Sports: ${sportsSummary}. ${venue.price_per_hour > 0 ? `Listed from ₹${venue.price_per_hour.toLocaleString("en-IN")}/hr` : "Contact the venue to confirm pricing"}. View details on KhelGrid.`;

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: `${venue.name} · Sports Venue on KhelGrid`,
      text: shareText,
      url: shareUrl,
    };

    // Use Web Share API if supported
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        toast.success("Venue shared successfully!", {
          description: "Sent to your friends via messaging app.",
        });
        return;
      } catch (err: unknown) {
        // Silently ignore if user dismissed/cancelled the native share sheet
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Fallback to clipboard if share threw an unexpected error
      }
    }

    // Fallback: Copy direct venue link to clipboard
    copyToClipboard(shareUrl, "venue link");
    toast.info("Link copied! Paste into WhatsApp, Telegram, or SMS to invite friends.", {
      duration: 3500,
    });
  };

  const handleBookClick = () => {
    // Open confirmation modal summarizing venue, selected date, and total price to prevent accidental bookings
    setIsConfirmModalOpen(true);
  };

  const handleFinalizeBooking = async () => {
    setIsConfirming(true);
    try {
      const result = await createVenueBooking({
        venue: {
          id: venue.id,
          name: venue.name,
          area: venue.area,
          city: venue.city,
          price_per_hour: venue.price_per_hour,
          sports: venue.sports || [],
          image_url: venue.image_url,
        },
        booking_date: selectedDate,
        start_time: selectedTime,
        duration_hours: 1,
      });

      setIsConfirmModalOpen(false);
      toast.success(`Booking confirmed at ${venue.name}!`, {
        description: `Date: ${selectedDate} | Time: ${selectedTime} | Total: ₹${venue.price_per_hour.toLocaleString("en-IN")}`,
      });
      if (onBook) {
        onBook(venue, selectedDate, selectedTime);
      }
    } catch (err) {
      toast.error("Failed to save booking. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    toast.info(`Booking date set to ${newDate}`, { duration: 2500 });
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    toast.info(`Booking time slot set to ${newTime}`, { duration: 2000 });
  };

  // Amenities icon helper
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("park")) return <Car className="h-4 w-4 text-primary" />;
    if (lower.includes("light") || lower.includes("flood"))
      return <Zap className="h-4 w-4 text-amber-500" />;
    if (lower.includes("cafe") || lower.includes("snack"))
      return <Coffee className="h-4 w-4 text-orange-500" />;
    if (lower.includes("wifi")) return <Wifi className="h-4 w-4 text-blue-500" />;
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <div
      id={`venue-details-${venue.id}`}
      className={`relative w-full max-w-5xl mx-auto bg-card rounded-2xl border border-border/80 shadow-lg overflow-hidden transition-all ${className}`}
    >
      {/* Top Action Header */}
      <div className="flex flex-col gap-3 p-3 border-b border-border/60 bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {onClose && (
            <Button
              id="venue-details-back-btn"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to list</span>
            </Button>
          )}
          <Badge variant="outline" className="text-xs font-mono">
            ID: {venue.id.slice(0, 8)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme switcher toggle button */}
          <ThemeSwitcher id="venue-details-theme-switcher" variant="icon" className="h-8 w-8" />
          <Button
            id="venue-details-share-btn"
            variant="outline"
            size="sm"
            onClick={handleShare}
            title="Share venue with friends via messaging apps"
            aria-label="Share venue with friends via messaging apps"
            className="gap-1.5 h-8 text-xs font-medium hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            <span>Share</span>
          </Button>
          <a
            id="venue-details-page-link"
            href={`/venue/${venue.id}`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors"
            title="Open dedicated venue page"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span>Full Page</span>
          </a>
          <a
            id="venue-details-maps-external-link"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 text-primary" />
            <span>Get Directions</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Horizontally Scrollable Facilities Image Carousel */}
      <VenueImageCarousel
        images={venue.images || (venue.image_url ? [venue.image_url] : undefined)}
        venueName={venue.name}
        sports={venue.sports}
        featured={venue.featured}
        bookable={venue.bookable}
        rating={venue.rating}
        reviewsCount={venue.reviews_count}
      />

      {/* Available Amenities List under image carousel with icons */}
      <VenueAmenitiesList
        amenities={venue.amenities}
        venueName={venue.name}
        variant="carousel-bar"
      />

      {/* Only show rating summaries when real review counts are present. */}
      <div
        id="venue-carousel-reviews-spotlight-bar"
        className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 bg-muted/30 border-b border-border/60 text-xs sm:px-6"
      >
        {venue.reviews_count && venue.reviews_count > 0 ? (
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{Number(venue.rating || 0).toFixed(1)} / 5.0</span>
            <span className="text-muted-foreground">({venue.reviews_count} reviews)</span>
          </div>
        ) : (
          <span className="text-muted-foreground">No verified reviews yet</span>
        )}
      </div>

      {/* Main Grid: Content Details & Booking Panel */}
      <div className="grid min-w-0 grid-cols-1 gap-4 p-3 sm:gap-6 sm:p-6 lg:grid-cols-3">
        {/* Left Column: Comprehensive Venue Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Title & Location */}
          <div className="space-y-2">
            <h1
              id="venue-details-name"
              className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {venue.name}
            </h1>
            <div className="flex items-start gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{fullAddress}</span>
            </div>
          </div>

          {/* BCCI Arunachal Pradesh Ranji Selection Ground & Domestic Card */}
          {(venue.id.includes("bcci") || venue.city === "Itanagar") && (
            <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-500/10 via-background to-secondary/30 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className="bg-sky-500 text-white font-semibold text-xs">
                  🏏 Official BCCI Recognized Domestic Cricket Facility
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Direct BCCI Domestic Directive
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                BCCI to Conduct Trials to Ensure Arunachal Pradesh's Ranji Participation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Official BCCI selection venue in Arunachal Pradesh. The BCCI-appointed 3-member
                independent selection committee (Satya Gopal Chakraborty, Jayanta Chowdhury, Deep
                Bora, convened by Apex Council member M. Khairul Jamal Majumdar) conducts
                transparent open trials for Ranji Trophy, C.K. Nayudu Trophy, and Women's state
                squads.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground font-semibold text-xs"
                >
                  <Link to="/trial/t-bcci-arunachal-pradesh-ranji-trials-2026">
                    View BCCI Trial Card →
                  </Link>
                </Button>
                <a
                  href="https://www.bcci.tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1"
                >
                  BCCI Official Portal <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Hindustan Times Report <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* J&K Kho-Kho Selection Trials Card */}
          {(venue.id.includes("green-play-field") || venue.city === "Jammu") && (
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-background to-secondary/30 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                  🏃 Official J&K State Selection Ground
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  J&K Kho-Kho Association & Sports Council
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Kho-Kho Selection Trials on Oct 19 & 20 for 45th Junior National Championship
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Designated selection venue for Jammu and Kashmir UT junior boys and girls teams.
                Open selection trials for the 45th Junior National Kho-Kho Championship in Gujarat.
                Eligible players under 18 years report at 2:30 PM with district consent letters.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground font-semibold text-xs"
                >
                  <Link to="/trial/t-jk-kho-kho-junior-national-trials-2026">
                    View Kho-Kho Trial Card →
                  </Link>
                </Button>
                <a
                  href="https://jksportscouncil.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1"
                >
                  J&K Sports Council <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Daily Excelsior Notice <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* DDCA Selection Trials & Association Card */}
          {venue.id.includes("ddca") && (
            <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                  🏏 Official DDCA State Selection Ground
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  BCCI Affiliated Association
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials (2026–27)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Arun Jaitley Stadium & DDCA Practice Complex is the official venue for the Delhi
                Women's U-15 state selection trials. Open trials for all eligible players born
                between September 1, 2011 and August 31, 2013. Last date to register is November 2,
                2026.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground font-semibold text-xs"
                >
                  <Link to="/trial/t-ddca-delhi-womens-u15-cricket-2026">
                    View Trial & Opportunity Card →
                  </Link>
                </Button>
                <a
                  href="https://ddca.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1"
                >
                  Official DDCA Portal <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Deccan Chronicle Circular <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Sports Supported */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Sports & Activities Available
            </h3>
            <div id="venue-details-sports-list" className="flex flex-wrap gap-2">
              {venue.sports.map((sport) => (
                <span
                  key={sport}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Official PIB Press Release & National Games Designation */}
          {venue.pib_press_release && (
            <div
              id="venue-pib-press-release-card"
              className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Official Government Release
                  </span>
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-[11px]"
                  >
                    {`PIB PRID: ${venue.pib_press_release.prid}`}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <span>{venue.pib_press_release.eventDate}</span>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <h4
                    id="venue-pib-title"
                    className="text-base sm:text-lg font-bold text-foreground"
                  >
                    {venue.pib_press_release.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-foreground/80">Authority:</span>
                    <span>{venue.pib_press_release.authority}</span>
                    {venue.pib_press_release.collaborator && (
                      <>
                        <span>•</span>
                        <span>{venue.pib_press_release.collaborator}</span>
                      </>
                    )}
                  </p>
                </div>

                <p
                  id="venue-pib-description"
                  className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-background/60 p-3 rounded-lg border border-border/40"
                >
                  {venue.pib_press_release.description}
                </p>

                {venue.pib_press_release.infrastructure && (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/30">
                    <span className="font-semibold text-foreground">Infrastructure: </span>
                    {venue.pib_press_release.infrastructure}
                  </div>
                )}

                {venue.pib_press_release.sports && venue.pib_press_release.sports.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Featured Disciplines:
                    </span>
                    <div id="venue-pib-sports-list" className="flex flex-wrap gap-1.5">
                      {venue.pib_press_release.sports.map((sp) => (
                        <span
                          key={sp}
                          className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-200 text-[11px] font-medium border border-amber-500/20"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {venue.pib_press_release.delegations &&
                  venue.pib_press_release.delegations.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Participating Delegations:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {venue.pib_press_release.delegations.map((del) => (
                          <span
                            key={del}
                            className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Direct PIB URL & KhelChronicle Link Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-500/20">
                  <a
                    id="venue-pib-external-link"
                    href={venue.pib_press_release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View Official PIB Release (PRID: {venue.pib_press_release.prid})</span>
                  </a>
                  <Button
                    id="venue-pib-copy-btn"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(venue.pib_press_release!.url, "PIB press release link")
                    }
                    className="h-8 text-xs font-medium gap-1.5 border-amber-500/30 hover:bg-amber-500/10 text-foreground"
                  >
                    {copiedField === "PIB press release link" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>Copy PIB URL</span>
                  </Button>
                  <a
                    id="venue-pib-chronicle-link"
                    href="/chronicle"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
                  >
                    <Newspaper className="h-3.5 w-3.5 text-primary" />
                    <span>View in KhelChronicle</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Contact Details Card */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" /> Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {venue.contact_phone && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a id="venue-contact-phone-link" href={`tel:${venue.contact_phone}`} className="truncate hover:text-primary font-medium hover:underline">
                      {venue.contact_phone}
                    </a>
                  </div>
                  <Button id="venue-copy-phone-btn" variant="ghost" size="icon" onClick={() => copyToClipboard(venue.contact_phone!, "phone number")} className="h-7 w-7 text-muted-foreground shrink-0" title="Copy phone">
                    {copiedField === "phone number" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              )}
              {venue.contact_email && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a id="venue-contact-email-link" href={`mailto:${venue.contact_email}`} className="truncate hover:text-primary font-medium hover:underline">
                      {venue.contact_email}
                    </a>
                  </div>
                  <Button id="venue-copy-email-btn" variant="ghost" size="icon" onClick={() => copyToClipboard(venue.contact_email!, "email address")} className="h-7 w-7 text-muted-foreground shrink-0" title="Copy email">
                    {copiedField === "email address" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              )}
              {!venue.contact_phone && !venue.contact_email && (
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  This venue has not provided public contact details yet. Please check the venue website or map listing before visiting.
                </p>
              )}
            </div>
          </div>

          {/* Amenities & Facilities */}
          <VenueAmenitiesList amenities={venue.amenities} venueName={venue.name} variant="grid" />

          {/* Operating Hours Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Confirm the venue’s current operating hours and any evening or weekend surcharges directly before booking.
            </span>
          </div>

          {/* Review widgets are hidden until real review data is available. */}
          {venue.reviews_count && venue.reviews_count > 0 ? (
            <VenueReviews
              venueId={venue.id}
              venueName={venue.name}
              sports={venue.sports}
              initialRating={venue.rating || 0}
              initialReviewsCount={venue.reviews_count}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Reviews will appear here when verified player feedback is available.
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <Card
            id="venue-booking-action-card"
            className="static overflow-hidden border-border/80 bg-card/90 shadow-md backdrop-blur-xs lg:sticky lg:top-6"
          >
            <CardContent className="p-5 space-y-4">
              {/* Pricing Header */}
              <div className="pb-3 border-b border-border/60">
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Hourly Booking Rate
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-extrabold text-foreground">
                    ₹{venue.price_per_hour.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">/ hour / court</span>
                </div>
              </div>

              {/* Calendar Date Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="venue-date-picker-trigger"
                  className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Select Booking Date
                </label>
                <VenueDatePicker date={selectedDate} onDateChange={handleDateChange} />
              </div>

              {/* Slot Time Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="venue-booking-time-select"
                  className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5 text-primary" /> Preferred Slot
                </label>
                <select
                  id="venue-booking-time-select"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  {AVAILABLE_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time} (60 mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary calculation */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Slot duration</span>
                  <span>1 hour</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Slot price</span>
                  <span>{venue.price_per_hour > 0 ? `₹${venue.price_per_hour.toLocaleString("en-IN")}` : "Not provided"}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/40">
                  <span>Estimated Total</span>
                  <span className="text-primary font-bold">
                    {venue.price_per_hour > 0 ? `₹${venue.price_per_hour.toLocaleString("en-IN")}` : "Contact venue"}
                  </span>
                </div>
              </div>

              {/* Primary Booking Button */}
              <Button
                id="venue-primary-book-btn"
                onClick={handleBookClick}
                disabled={!venue.bookable || venue.price_per_hour <= 0}
                className="w-full h-11 text-sm font-semibold gap-2 shadow-xs transition-transform active:scale-[0.99]"
              >
                <ShieldCheck className="h-4 w-4" />
                {!venue.bookable
                  ? "Venue Not Bookable"
                  : venue.price_per_hour > 0
                    ? "Book Court / Turf Now"
                    : "Contact for Pricing First"}
              </Button>

              {/* Interactive Calendar & Slot Selector Trigger */}
              <Button
                id="venue-open-interactive-booking-btn"
                variant="outline"
                type="button"
                onClick={() => setIsInteractiveBookingOpen(true)}
                disabled={!venue.bookable || venue.price_per_hour <= 0}
                className="w-full h-10 text-xs font-semibold gap-2 border-primary/40 text-primary hover:bg-primary/10 transition-colors shadow-2xs"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Interactive Slot & Calendar Booking
              </Button>

              <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                {venue.price_per_hour > 0 && venue.bookable
                  ? "Confirm slot availability and booking terms before payment."
                  : "Booking is disabled until pricing and availability are confirmed."}
              </p>

              {/* Share Venue with Friends for Match Coordination */}
              <div
                id="venue-booking-share-section"
                className="pt-3 border-t border-border/60 space-y-2"
              >
                <Button
                  id="venue-booking-share-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="w-full h-9 text-xs font-semibold gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all text-foreground"
                  title="Send venue link to friends via messaging apps using Web Share API"
                >
                  <Share2 className="h-3.5 w-3.5 text-primary" />
                  <span>Share Venue with Friends</span>
                </Button>

                {/* Direct Messaging Apps Quick Actions */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span className="font-medium">Send link:</span>
                  <div className="flex items-center gap-2">
                    <a
                      id="venue-share-whatsapp-link"
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${shareText} ${getShareUrl()}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      title="Share directly via WhatsApp"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                    <span>•</span>
                    <a
                      id="venue-share-telegram-link"
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        getShareUrl(),
                      )}&text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-medium"
                      title="Share directly via Telegram"
                    >
                      <Send className="h-3 w-3" /> Telegram
                    </a>
                    <span>•</span>
                    <button
                      id="venue-share-copy-link-btn"
                      type="button"
                      onClick={() => copyToClipboard(getShareUrl(), "venue link")}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium hover:underline cursor-pointer"
                      title="Copy link to clipboard"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Venue Policies, Operating Hours & Restrictions Accordion at the bottom of VenueDetails */}
      <div className="px-6 pb-6 pt-2 border-t border-border/60">
        <VenuePoliciesAccordion
          venueName={venue.name}
          sports={venue.sports}
          pricePerHour={venue.price_per_hour}
          operatingHours={venue.operating_hours}
          bookingPolicies={venue.booking_policies}
          rulesRestrictions={venue.rules_restrictions}
        />
      </div>

      {/* Frequently Asked Questions (FAQ) Section at the bottom of VenueDetails */}
      <div className="px-6 pb-6 pt-2 border-t border-border/60">
        <VenueFAQ
          venueName={venue.name}
          sports={venue.sports}
          pricePerHour={venue.price_per_hour}
        />
      </div>

      {/* Confirmation Modal to prevent accidental bookings */}
      <BookingConfirmationModal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        venueName={venue.name}
        venueArea={venue.area}
        venueCity={venue.city}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        durationHours={1}
        pricePerHour={venue.price_per_hour}
        totalPrice={venue.price_per_hour}
        sports={venue.sports}
        onConfirm={handleFinalizeBooking}
        isConfirming={isConfirming}
        inline={confirmModalInline}
      />

      {/* Interactive Slot & Calendar Booking Dialog */}
      <Dialog open={isInteractiveBookingOpen} onOpenChange={setIsInteractiveBookingOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-border bg-card p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold">{venue.name}</DialogTitle>
            <DialogDescription>
              {venue.area} · {venue.city} · Interactive Slot & Calendar Reservation
            </DialogDescription>
          </DialogHeader>

          <VenueBookingForm
            showVenueSelector={false}
            initialVenueId={venue.id}
            initialSport={venue.sports[0]}
            initialDate={selectedDate}
            initialTime={selectedTime}
            onBookingComplete={() => {
              setIsInteractiveBookingOpen(false);
              toast.success(`Booking successfully reserved for ${venue.name}!`);
              if (onBook) {
                onBook(venue, selectedDate, selectedTime);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export {
  VenueDatePicker,
  VenueImageCarousel,
  resolveFacilityPhotos,
  VenueReviews,
  VenuePoliciesAccordion,
  VenueFAQ,
  VenueAmenitiesList,
  BookingConfirmationModal,
};
export type {
  FacilityPhoto,
  VenueReview,
  FAQItem,
  AmenityConfig,
  BookingConfirmationModalProps,
  VenueOperatingHoursData,
  VenueBookingPoliciesData,
  VenueRulesRestrictionsData,
};
export default VenueDetails;
