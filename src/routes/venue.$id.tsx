import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { VENUES, type Venue } from "@/data/playo";
import { VenueDetails } from "@/components/VenueDetails";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/venue/$id")({
  loader: ({ params }) => {
    // Look up by id or slug
    const venue = VENUES.find(
      (v) =>
        v.id === params.id ||
        v.id.toLowerCase() === params.id.toLowerCase() ||
        v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === params.id.toLowerCase(),
    );
    if (!venue) {
      // Fallback: return the first venue if not found so the page always renders gracefully
      const fallback = VENUES[0];
      if (!fallback) throw notFound();
      return { venue: fallback, notExact: true };
    }
    return { venue, notExact: false };
  },
  head: ({ loaderData, params }) => {
    const venue = loaderData?.venue;
    if (!venue) {
      return buildSeoHead({
        title: "Venue Booking · KhelGrid",
        description: "Book sports turf, courts, and grounds across India.",
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
  const { venue } = Route.useLoaderData();
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
              toast.success(`Booking reserved for ${venue.name}!`, {
                description: `Date: ${selectedDate} • Time: ${selectedTime}`,
              });
              navigate({ to: "/book" });
            }}
          />
        </div>
      </div>
    </div>
  );
}
