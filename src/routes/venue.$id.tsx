import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, MapPin, ArrowRight, Trophy } from "lucide-react";
import { VENUES, type Venue } from "@/data/khelgrid";
import { VenueDetails } from "@/components/VenueDetails";
import { VenueAvailabilityPreview } from "@/components/VenueAvailabilityPreview";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/venue/$id")({
  loader: async ({ params }) => {
    const key = params.id.toLowerCase();
    const seededVenue = VENUES.find(
      (v) =>
        v.id.toLowerCase() === key ||
        v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === key,
    );
    if (seededVenue) {
      const relatedVenues = VENUES
        .filter((candidate) =>
          candidate.id !== seededVenue.id &&
          candidate.city.toLowerCase() === seededVenue.city.toLowerCase() &&
          candidate.sports.some((sport) => seededVenue.sports.some((current) => current.toLowerCase() === sport.toLowerCase())),
        )
        .slice(0, 3);
      return { venue: seededVenue, relatedVenues, liveAvailability: false, notExact: false };
    }

    if (isSupabaseConfigured) {
      try {
        let { data, error } = await supabase
          .from("venues")
          .select("*")
          .is("deleted_at", null)
          .eq("bookable", true)
          .eq("id", params.id)
          .maybeSingle();

        if (!data && !error) {
          const slugResult = await supabase
            .from("venues")
            .select("*")
            .is("deleted_at", null)
            .eq("bookable", true)
            .eq("slug", params.id)
            .maybeSingle();
          data = slugResult.data;
          error = slugResult.error;
        }

        if (!error && data) {
          const relatedResult = await supabase
            .from("venues")
            .select("id, name, area, city, sports, price_per_hour, image_url, bookable")
            .is("deleted_at", null)
            .eq("bookable", true)
            .eq("city", data.city)
            .neq("id", data.id)
            .limit(12);
          const relatedVenues = (relatedResult.data ?? [])
            .filter((candidate) =>
              (candidate.sports ?? []).some((sport: string) =>
                (data.sports ?? []).some((current: string) => current.toLowerCase() === sport.toLowerCase()),
              ),
            )
            .slice(0, 3)
            .map((candidate) => ({
              id: candidate.id,
              name: candidate.name,
              area: candidate.area ?? "",
              city: candidate.city ?? "",
              distanceKm: 0,
              rating: 0,
              reviews: 0,
              sports: candidate.sports ?? [],
              pricePerHour: Number(candidate.price_per_hour ?? 0),
              featured: false,
              bookable: Boolean(candidate.bookable),
              image: candidate.image_url ?? "",
            } satisfies Venue));
          return {
            venue: {
              id: data.id,
              name: data.name,
              area: data.area,
              city: data.city,
              distanceKm: 0,
              rating: data.reviews_count > 0 ? Number(data.rating ?? 0) : 0,
              reviews: Number(data.reviews_count ?? 0),
              sports: data.sports ?? [],
              pricePerHour: Number(data.price_per_hour ?? 0),
              featured: Boolean(data.featured),
              bookable: Boolean(data.bookable),
              image: data.image_url ?? "",
              address: data.address ?? undefined,
              amenities: data.amenities ?? [],
              contactPhone: data.contact_phone ?? undefined,
              contactEmail: data.contact_email ?? undefined,
            } satisfies Venue,
            relatedVenues,
            liveAvailability: true,
            notExact: false,
          };
        }
      } catch (error) {
        console.error("Could not load venue detail", error);
      }
    }

    throw notFound();
  },
  head: ({ loaderData, params }) => {
    const venue = loaderData?.venue;
    if (!venue) {
      return buildSeoHead({
        title: "Venue Booking · KhelGrid",
        description:
          "Reserve verified sports turfs, badminton courts, football pitches, and cricket nets with instant slot confirmation across Indian metropolitan hubs.",
        canonicalPath: `/venue/${params.id}`,
      });
    }

    const primarySport = venue.sports?.[0] || "Sports";
    const description = venue.pibPressRelease
      ? `${venue.name} (${venue.area}, ${venue.city}) - Official host venue for the ${venue.pibPressRelease.title} (PIB PRID: ${venue.pibPressRelease.prid}). World-class facilities for ${venue.sports.join(", ")}.`
      : `Book sports turf & courts at ${venue.name} in ${venue.area}, ${venue.city}. View available slots, pricing starting at ₹${venue.pricePerHour}/hr, amenities, cancellation policies, and player rules.`;

    return buildSeoHead({
      title: `${venue.name} · ${primarySport} Turf Booking in ${venue.city}`,
      description,
      canonicalPath: `/venue/${venue.id}`,
      keywords: `${venue.name}, ${primarySport} in ${venue.city}, turf booking ${venue.area}, book sports ground ${venue.city}${venue.pibPressRelease ? `, PIB ${venue.pibPressRelease.prid}, BRICS 2026` : ""}`,
      image: venue.image,
      type: "website",
    });
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-3xl font-bold">Venue Not Found</h1>
      <p className="mt-3 text-muted-foreground">
        The sports venue you are looking for may have been updated or moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/book">Browse All Venues & Turfs</Link>
      </Button>
    </main>
  ),
  component: VenueDetailPage,
});

function VenueDetailPage() {
  const { venue, relatedVenues = [], liveAvailability = false } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Breadcrumb / Return Navigation */}
      <div className="border-b border-border bg-card/60 backdrop-blur-xs sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Venues</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs h-8 rounded-full">
              <Link to="/book">View My Bookings</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main VenueDetails Component Container */}
      <div className="container mx-auto px-4 pt-6 max-w-5xl">
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <VenueDetails
            venue={venue}
            onBook={(_venueData, selectedDate, selectedTime) => {
              toast.info(`Continue booking at ${venue.name}`, {
                description: `Selected date: ${selectedDate} • Time: ${selectedTime}. Confirm your slot on the booking page.`,
              });
              navigate({ to: "/book" });
            }}
          />
        </div>

        {liveAvailability && <VenueAvailabilityPreview venueId={venue.id} pricePerHour={venue.pricePerHour} contactPhone={venue.contactPhone} contactEmail={venue.contactEmail} />}

        {relatedVenues.length > 0 && (
          <section aria-labelledby="related-venues-heading" className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Keep playing</p>
                <h2 id="related-venues-heading" className="mt-1 text-xl font-bold sm:text-2xl">Similar venues nearby</h2>
                <p className="mt-1 text-sm text-muted-foreground">More places in {venue.city} offering one or more of the same sports.</p>
              </div>
              <Link to="/book" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Browse all venues <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVenues.map((related) => (
                <a
                  key={related.id}
                  href={`/venue/${related.id}`}
                  className="group flex min-w-0 overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 hover:bg-muted/30"
                >
                  {related.image ? (
                    <img src={related.image} alt="" loading="lazy" className="h-28 w-24 shrink-0 object-cover sm:h-32 sm:w-28" />
                  ) : (
                    <div className="flex h-28 w-24 shrink-0 items-center justify-center bg-primary/10 text-primary sm:h-32 sm:w-28">
                      <Building2 className="h-7 w-7" />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-3">
                    <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">{related.name}</h3>
                    <p className="flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{related.area ? `${related.area}, ${related.city}` : related.city}</span>
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{related.sports.slice(0, 2).join(" · ") || "Sports facility"}</span>
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {related.pricePerHour > 0 ? `₹${related.pricePerHour.toLocaleString("en-IN")}/hr` : "Contact for price"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
