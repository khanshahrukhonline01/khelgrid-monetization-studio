import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import type { Database } from "@/types/database";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  Search,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  Database as DatabaseIcon,
  Sparkles,
  Phone,
  CheckCircle2,
  Trophy,
  X,
  Filter,
} from "lucide-react";
import { VENUES } from "@/data/khelgrid";

import { VenueSearchBar } from "@/components/VenueSearchBar";
import {
  VenueDetails,
  VenueDatePicker,
  VenueImageCarousel,
  VenueReviews,
  VenuePoliciesAccordion,
  VenueFAQ,
  VenueAmenitiesList,
  BookingConfirmationModal,
} from "@/components/VenueDetails";
import { toast } from "sonner";

export type VenueRow = Database["public"]["Tables"]["venues"]["Row"];

export {
  VenueSearchBar,
  VenueDetails,
  VenueDatePicker,
  VenueImageCarousel,
  VenueReviews,
  VenuePoliciesAccordion,
  VenueFAQ,
  VenueAmenitiesList,
  BookingConfirmationModal,
};

export interface SportCategory {
  id: string;
  name: string;
  emoji: string;
}

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: "all", name: "All Sports", emoji: "🏆" },
  { id: "football", name: "Football", emoji: "⚽" },
  { id: "cricket", name: "Cricket", emoji: "🏏" },
  { id: "badminton", name: "Badminton", emoji: "🏸" },
  { id: "tennis", name: "Tennis", emoji: "🎾" },
  { id: "pickleball", name: "Pickleball", emoji: "🏓" },
  { id: "basketball", name: "Basketball", emoji: "🏀" },
  { id: "box-cricket", name: "Box Cricket", emoji: "🏟️" },
  { id: "swimming", name: "Swimming", emoji: "🏊" },
  { id: "table-tennis", name: "Table Tennis", emoji: "🏓" },
  { id: "volleyball", name: "Volleyball", emoji: "🏐" },
];

interface VenueListProps {
  onSelectVenue?: (venue: VenueRow) => void;
  className?: string;
  limit?: number;
  initialSport?: string;
  initialCategory?: string;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  initialCity?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearchBar?: boolean;
}

const COMMON_CITIES = [
  "All Cities",
  "Bengaluru",
  "Delhi",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Chandigarh",
];

const DEFAULT_VENUE_ROWS: VenueRow[] = VENUES.map((v) => ({
  id: v.id,
  name: v.name,
  slug: v.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  area: v.area,
  city: v.city,
  address: `${v.area}, ${v.city}`,
  sports: v.sports,
  amenities: ["Parking", "Changing Room", "Drinking Water", "Lighting"],
  price_per_hour: v.pricePerHour,
  rating: v.rating,
  reviews_count: v.reviews,
  featured: v.featured ?? false,
  bookable: v.bookable ?? true,
  image_url: v.image,
  images: [v.image],
  contact_phone: "+91 98765 43210",
  contact_email: "desk@khelgrid.com",
  operating_hours: null,
  booking_policies: null,
  rules_restrictions: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export function VenueList({
  onSelectVenue,
  className = "",
  limit,
  initialSport,
  initialCategory,
  selectedCategory,
  onCategoryChange,
  initialCity = "All Cities",
  searchQuery: externalSearchQuery,
  onSearchChange,
  showSearchBar = true,
}: VenueListProps) {
  const { supabase, isConfigured } = useSupabase();

  const [venues, setVenues] = useState<VenueRow[]>(() =>
    DEFAULT_VENUE_ROWS.slice(0, limit || undefined),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters (supports controlled or internal search state)
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  const activeSearchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleSearchChange = useCallback(
    (newVal: string) => {
      setInternalSearchQuery(newVal);
      if (onSearchChange) {
        onSearchChange(newVal);
      }
    },
    [onSearchChange],
  );

  // Category state (supports controlled or internal category state)
  const [internalCategory, setInternalCategory] = useState<string>(
    initialCategory || initialSport || "All Sports",
  );
  const activeCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const handleCategoryChange = useCallback(
    (category: string) => {
      setInternalCategory(category);
      if (onCategoryChange) {
        onCategoryChange(category);
      }
      if (category === "All Sports" || category === "All") {
        toast.info("Showing all sports categories", { duration: 1800 });
      } else {
        toast.info(`Filtered by category: ${category}`, { duration: 1800 });
      }
    },
    [onCategoryChange],
  );

  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "price_asc" | "price_desc">(
    "featured",
  );

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    toast.info(
      city === "All Cities" ? "Showing venues in all cities" : `Showing venues in ${city}`,
      {
        duration: 1800,
      },
    );
  }, []);

  const handleSortChange = useCallback(
    (newSort: "featured" | "rating" | "price_asc" | "price_desc") => {
      setSortBy(newSort);
      const sortLabels: Record<string, string> = {
        featured: "Featured First",
        rating: "Top Rated",
        price_asc: "Price: Low to High",
        price_desc: "Price: High to Low",
      };
      toast.info(`Sorted by ${sortLabels[newSort] || newSort}`, { duration: 1800 });
    },
    [],
  );

  const fetchVenues = useCallback(async () => {
    if (!isConfigured) {
      setVenues(DEFAULT_VENUE_ROWS.slice(0, limit || undefined));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("venues").select("*");

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: queryError } = await query;

      if (queryError || !data || data.length === 0) {
        setVenues(DEFAULT_VENUE_ROWS.slice(0, limit || undefined));
      } else {
        setVenues(data);
      }
    } catch {
      setVenues(DEFAULT_VENUE_ROWS.slice(0, limit || undefined));
    } finally {
      setLoading(false);
    }
  }, [supabase, limit, isConfigured]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // Dynamic category counts computed from fetched venues
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Sports": venues.length,
      All: venues.length,
    };
    venues.forEach((v) => {
      v.sports?.forEach((sport) => {
        const norm = sport.trim();
        counts[norm] = (counts[norm] || 0) + 1;
        counts[norm.toLowerCase()] = (counts[norm.toLowerCase()] || 0) + 1;
      });
    });
    return counts;
  }, [venues]);

  // Filter and sort client-side in real-time across name, location, and category
  const filteredVenues = useMemo(() => {
    return venues
      .filter((venue) => {
        // Real-time search filter: matches venue name or location (area, city, address) or sport
        if (activeSearchQuery.trim()) {
          const q = activeSearchQuery.toLowerCase().trim();
          const matchesName = venue.name?.toLowerCase().includes(q) ?? false;
          const matchesArea = venue.area?.toLowerCase().includes(q) ?? false;
          const matchesCity = venue.city?.toLowerCase().includes(q) ?? false;
          const matchesAddress = venue.address?.toLowerCase().includes(q) ?? false;
          const matchesSport = venue.sports?.some((s) => s.toLowerCase().includes(q)) ?? false;

          if (!matchesName && !matchesArea && !matchesCity && !matchesAddress && !matchesSport) {
            return false;
          }
        }

        // Category filter (e.g., Football, Cricket, Badminton)
        if (activeCategory !== "All" && activeCategory !== "All Sports") {
          const target = activeCategory.toLowerCase().trim();
          const hasCategory = venue.sports?.some((s) => {
            const lower = s.toLowerCase().trim();
            return lower === target || lower.includes(target) || target.includes(lower);
          });
          if (!hasCategory) return false;
        }

        // City filter
        if (selectedCity !== "All Cities") {
          if (venue.city?.toLowerCase() !== selectedCity.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "price_asc") {
          return a.price_per_hour - b.price_per_hour;
        }
        if (sortBy === "price_desc") {
          return b.price_per_hour - a.price_per_hour;
        }
        return 0;
      });
  }, [venues, activeSearchQuery, activeCategory, selectedCity, sortBy]);

  return (
    <div id="venues-list-container" className={`w-full space-y-4 ${className}`}>
      {/* Search Input Bar above VenueList for real-time name & location search */}
      {showSearchBar && (
        <VenueSearchBar
          value={activeSearchQuery}
          onChange={handleSearchChange}
          totalResults={filteredVenues.length}
          isLoading={loading}
          placeholder="Filter venues by name or location (e.g. Indiranagar, Bengaluru, Turf)..."
        />
      )}

      {/* Filter and Controls Toolbar */}
      <div
        id="venues-filter-panel"
        className="rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-xs shadow-xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick category, city, and sort controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              id="venues-category-dropdown"
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
            >
              {SPORT_CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? venues.length
                    : categoryCounts[cat.name] || categoryCounts[cat.name.toLowerCase()] || 0;
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji} {cat.name} ({count})
                  </option>
                );
              })}
            </select>

            {/* City Dropdown */}
            <select
              id="venues-city-select"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
            >
              {COMMON_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              id="venues-sort-select"
              value={sortBy}
              onChange={(e) =>
                handleSortChange(
                  e.target.value as "featured" | "rating" | "price_asc" | "price_desc",
                )
              }
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"} available
            </span>

            <Button
              id="venues-refresh-button"
              variant="outline"
              size="icon"
              onClick={fetchVenues}
              disabled={loading}
              title="Refresh Venues"
              className="h-9 w-9 shrink-0 rounded-md"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Category Filter Chips Bar (e.g. Football, Cricket, Badminton) */}
        <div
          id="venues-category-filter-section"
          className="space-y-1.5 pt-1 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span>Category Filter</span>
            </div>
            {activeCategory !== "All" && activeCategory !== "All Sports" && (
              <button
                id="venues-clear-category-btn"
                type="button"
                onClick={() => handleCategoryChange("All Sports")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
              >
                <span>{`Reset Category (${activeCategory})`}</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div
            id="venues-category-chips"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar"
            role="tablist"
            aria-label="Filter venues by sports category"
          >
            {SPORT_CATEGORIES.map((cat) => {
              const isSelected =
                activeCategory === cat.name ||
                (cat.id === "all" && (activeCategory === "All" || activeCategory === "All Sports"));
              const count =
                cat.id === "all"
                  ? venues.length
                  : categoryCounts[cat.name] || categoryCounts[cat.name.toLowerCase()] || 0;

              return (
                <button
                  key={cat.id}
                  id={`venue-category-btn-${cat.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer text-xs ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div
          id="venues-loading-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={`skeleton-${idx}`} className="overflow-hidden border-border/70">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center pt-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State: Search/Filter returned 0 results */}
      {!loading && filteredVenues.length === 0 && (
        <div
          id="venues-no-matches"
          className="text-center py-14 px-4 rounded-xl border border-border/60 bg-muted/20 space-y-3"
        >
          <p className="text-base font-medium">No venues found matching your search</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your sport, city filter, or search keywords.
          </p>
          <Button
            id="venues-reset-filters-button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleSearchChange("");
              handleCategoryChange("All Sports");
              setSelectedCity("All Cities");
              toast.success("Search filters reset to default", { duration: 2000 });
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Venues Card Grid */}
      {!loading && filteredVenues.length > 0 && (
        <div
          id="venues-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVenues.map((venue) => {
            const hasImage = Boolean(venue.image_url);
            const displayRating = Number(venue.rating || 0).toFixed(1);

            return (
              <Card
                key={venue.id}
                id={`venue-card-${venue.id}`}
                className="group flex flex-col overflow-hidden border-border/80 hover:border-primary/50 transition-all duration-200 hover:shadow-md bg-card"
              >
                {/* Card Media Header */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                  {hasImage ? (
                    <img
                      src={venue.image_url!}
                      alt={venue.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback on broken image link
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 text-primary/40 font-semibold">
                      KhelGrid Sports
                    </div>
                  )}

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {venue.featured && (
                      <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none font-medium text-xs shadow-xs">
                        Featured
                      </Badge>
                    )}
                    {venue.bookable ? (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/90 text-white border-none text-xs backdrop-blur-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Bookable
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-black/60 text-white border-none text-xs backdrop-blur-xs"
                      >
                        Enquire Only
                      </Badge>
                    )}
                  </div>

                  {/* Rating Tag */}
                  {venue.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white rounded-md px-2 py-1 text-xs font-semibold flex items-center gap-1 shadow-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{displayRating}</span>
                      {venue.reviews_count > 0 && (
                        <span className="text-white/70 font-normal">({venue.reviews_count})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-lg leading-snug tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate">
                        {venue.area}, {venue.city}
                      </span>
                    </div>
                  </div>

                  {/* Sports Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {venue.sports?.slice(0, 3).map((sport) => (
                      <span
                        key={sport}
                        className="inline-flex items-center px-2 py-0.5 rounded-sm bg-muted text-muted-foreground text-[11px] font-medium"
                      >
                        {sport}
                      </span>
                    ))}
                    {(venue.sports?.length || 0) > 3 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground text-[11px]">
                        +{(venue.sports?.length || 0) - 3}
                      </span>
                    )}
                  </div>

                  {venue.contact_phone && (
                    <div className="flex items-center text-xs text-muted-foreground gap-1 pt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{venue.contact_phone}</span>
                    </div>
                  )}
                </CardContent>

                {/* Card Footer: Price & Booking Action */}
                <CardFooter className="p-4 pt-0 border-t border-border/40 flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <div className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
                      Starts from
                    </div>
                    <div className="text-base font-bold text-foreground">
                      ₹{Number(venue.price_per_hour).toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-muted-foreground">/hr</span>
                    </div>
                  </div>

                  <Button
                    id={`venue-book-btn-${venue.id}`}
                    size="sm"
                    className="font-medium px-4"
                    disabled={!venue.bookable}
                    onClick={() => {
                      if (onSelectVenue) {
                        onSelectVenue(venue);
                      }
                    }}
                  >
                    {venue.bookable ? "Book Turf" : "View Venue"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VenueList;
