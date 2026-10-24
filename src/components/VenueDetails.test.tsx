import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueDetails, normalizeVenueData } from "./VenueDetails";

describe("VenueDetails", () => {
  const mockVenue = {
    id: "ven-12345",
    name: "KhelGrid Olympic Sports Arena",
    slug: "khelgrid-olympic-arena",
    area: "Indiranagar",
    city: "Bengaluru",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    sports: ["Badminton", "Pickleball", "Tennis"],
    amenities: ["Parking", "Floodlights", "Changing Rooms", "Drinking Water"],
    price_per_hour: 1200,
    rating: 4.8,
    reviews_count: 56,
    featured: true,
    bookable: true,
    contact_phone: "+91 98765 12345",
    contact_email: "arena@khelgrid.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://example.com/venue.jpg",
    latitude: 12.9716,
    longitude: 77.5946,
  };

  it("renders venue name and full address correctly", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("KhelGrid Olympic Sports Arena");
    expect(html).toContain("100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru");
  });

  it("renders contact details with clickable links and copy buttons", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("tel:+91 98765 12345");
    expect(html).toContain("mailto:arena@khelgrid.com");
    expect(html).toContain('id="venue-copy-phone-btn"');
    expect(html).toContain('id="venue-copy-email-btn"');
  });

  it("renders supported sports and amenities", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("Badminton");
    expect(html).toContain("Pickleball");
    expect(html).toContain("Tennis");
    expect(html).toContain("Parking");
    expect(html).toContain("Floodlights");
  });

  it("renders the primary booking button and price", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-primary-book-btn"');
    expect(html).toContain("Book Court / Turf Now");
    expect(html).toContain("1,200");
  });

  it("normalizes KhelGrid venue formats cleanly", () => {
    const khelgridFormat = {
      id: "v-khelgrid-9",
      name: "KhelGrid Central Turf",
      area: "Koramangala",
      city: "Bengaluru",
      distanceKm: 3.2,
      rating: 4.5,
      reviews: 20,
      sports: ["Football", "Box Cricket"],
      pricePerHour: 1500,
      featured: false,
      bookable: true,
      image: "https://example.com/khelgrid.jpg",
    };

    const normalized = normalizeVenueData(khelgridFormat);
    expect(normalized.name).toBe("KhelGrid Central Turf");
    expect(normalized.price_per_hour).toBe(1500);
    expect(normalized.sports).toContain("Football");
  });

  it("renders the interactive calendar date-picker component in booking card", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-date-picker-trigger"');
    expect(html).toContain('id="venue-date-picker-wrapper"');
    expect(html).toContain("Select Booking Date");
    expect(html).toContain("Click to change booking date");
  });

  it("renders the horizontally scrollable sports facility image carousel", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-facility-carousel-container"');
    expect(html).toContain('id="venue-photos-horizontal-track"');
    expect(html).toContain('id="venue-carousel-prev-btn"');
    expect(html).toContain('id="venue-carousel-next-btn"');
    expect(html).toContain('id="venue-carousel-counter"');
    expect(html).toContain('id="venue-carousel-thumbnails-strip"');
    expect(html).toContain("Sports Facilities &amp; Amenities");
  });

  it("renders user reviews spotlight bar and full user reviews section under the image carousel", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-carousel-reviews-spotlight-bar"');
    expect(html).toContain('id="venue-jump-to-reviews-link"');
    expect(html).toContain("User Reviews &amp; Testimonials");
    expect(html).toContain('id="venue-user-reviews-section"');
    expect(html).toContain('id="venue-star-rating-summary-card"');
    expect(html).toContain('id="venue-customer-testimonials-container"');
    expect(html).toContain("Write a Review");
  });

  it("renders share buttons and messaging app links for friends coordination", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-details-share-btn"');
    expect(html).toContain('id="venue-booking-share-btn"');
    expect(html).toContain("Share Venue with Friends");
    expect(html).toContain('id="venue-share-whatsapp-link"');
    expect(html).toContain('id="venue-share-telegram-link"');
    expect(html).toContain('id="venue-share-copy-link-btn"');
  });

  it("renders Frequently Asked Questions accordion section at the bottom of the venue details view", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-faq-section"');
    expect(html).toContain('id="venue-faq-heading"');
    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain('id="venue-faq-accordion"');
    expect(html).toContain('id="venue-faq-item-faq-cancellation"');
    expect(html).toContain("Cancellation Policy");
    expect(html).toContain("Booking Hours");
    expect(html).toContain("Age Restrictions");
  });

  it("renders available amenities list under the image carousel with visual icons", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-carousel-amenities-bar"');
    expect(html).toContain('id="venue-carousel-amenities-label"');
    expect(html).toContain("Available Amenities &amp; Facilities");
    expect(html).toContain('id="venue-amenities-pills-list"');
    expect(html).toContain("Parking");
    expect(html).toContain("Floodlights");
  });

  it("renders confirmation modal summarizing venue name, selected date, and total price before finalizing", () => {
    const html = renderToString(
      <VenueDetails venue={mockVenue} defaultConfirmModalOpen={true} confirmModalInline={true} />,
    );
    expect(html).toContain('id="venue-primary-book-btn"');
    expect(html).toContain('id="booking-confirmation-title"');
    expect(html).toContain("Confirm Your Booking");
    expect(html).toContain('id="booking-confirmation-venue-name"');
    expect(html).toContain(mockVenue.name);
    expect(html).toContain('id="booking-confirmation-selected-date"');
    expect(html).toContain('id="booking-confirmation-total-price-box"');
    expect(html).toContain('id="booking-confirmation-total-amount"');
    expect(html).toContain("1,200");
    expect(html).toContain('id="booking-confirmation-cancel-btn"');
    expect(html).toContain('id="booking-confirmation-finalize-btn"');
    expect(html).toContain("Confirm &amp; Finalize Booking");
  });

  it("renders structured venue policies, operating hours and restrictions accordion component at the bottom", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-policies-section"');
    expect(html).toContain('id="venue-policies-heading"');
    expect(html).toContain("Venue Policies, Hours &amp; Rules");
    expect(html).toContain('id="venue-policies-accordion"');
    expect(html).toContain('id="venue-policy-item-booking"');
    expect(html).toContain('id="venue-policy-item-hours"');
    expect(html).toContain('id="venue-policy-item-restrictions"');
    expect(html).toContain('id="venue-policy-item-safety"');
    expect(html).toContain("Booking &amp; Cancellation Policies");
    expect(html).toContain("Operating Hours &amp; Lighting Schedule");
    expect(html).toContain("Footwear, Attire &amp; Equipment Rules");
    expect(html).toContain("Safety, Age Guidelines &amp; Prohibited Items");
    expect(html).toContain("100% Refund");
    expect(html).toContain("Advance Booking Window");
    expect(html).toContain("Inclement Weather Policy");
  });

  it("renders official PIB Press Release card when venue has pibPressRelease data", () => {
    const venueWithPib = {
      ...mockVenue,
      id: "v-veer-savarkar-sports-complex-ahmedabad",
      name: "Veer Savarkar Sports Complex",
      city: "Ahmedabad",
      pibPressRelease: {
        prid: "2321660",
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2321660&reg=48&lang=2",
        title:
          "India to Host BRICS Traditional and Indigenous Sports Demonstration Games 2026 in Ahmedabad",
        authority: "Ministry of Youth Affairs and Sports (MYAS), Government of India",
        collaborator: "Government of Gujarat",
        eventDate: "October 12, 2026",
        description:
          "Official Host Venue: Selected by MYAS to host the BRICS Traditional and Indigenous Sports Demonstration Games 2026.",
        sports: ["Mallakhamb", "Yogasana", "Kalaripayattu", "Wushu"],
        infrastructure: "Constructed at ₹825 crore across 21 acres.",
      },
    };

    const html = renderToString(<VenueDetails venue={venueWithPib} />);
    expect(html).toContain('id="venue-pib-press-release-card"');
    expect(html).toContain("Official Government Release");
    expect(html).toContain("PIB PRID: 2321660");
    expect(html).toContain(
      "India to Host BRICS Traditional and Indigenous Sports Demonstration Games 2026",
    );
    expect(html).toContain("Ministry of Youth Affairs and Sports (MYAS)");
    expect(html).toContain("Government of Gujarat");
    expect(html).toContain("October 12, 2026");
    expect(html).toContain("Mallakhamb");
    expect(html).toContain("Yogasana");
    expect(html).toContain('id="venue-pib-external-link"');
    expect(html).toContain(
      "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2321660&amp;reg=48&amp;lang=2",
    );
    expect(html).toContain('id="venue-pib-copy-btn"');
    expect(html).toContain("Copy PIB URL");
    expect(html).toContain('id="venue-pib-chronicle-link"');
    expect(html).toContain("View in KhelChronicle");
  });
});
