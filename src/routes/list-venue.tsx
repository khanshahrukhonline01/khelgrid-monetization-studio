import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ArrowRight, Building2, CheckCircle2, MapPin, Mail, Trophy } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { SEO } from "@/components/seo/SEO";

export const Route = createFileRoute("/list-venue")({
  head: () =>
    buildSeoHead({
      title: "List Your Sports Venue on KhelGrid",
      description:
        "Help athletes, teams and coaches discover your turf, court, ground, sports complex or training facility. Send KhelGrid your venue details for review.",
      canonicalPath: "/list-venue",
      keywords:
        "list sports venue India, list turf, sports ground directory, badminton court, football turf, KhelGrid venue listing",
      type: "website",
    }),
  component: ListVenuePage,
});

const EMAIL = "support@khelgrid.com";
const SUBJECT = encodeURIComponent("Request to list a sports venue on KhelGrid");
const BODY = encodeURIComponent(
  "Hello KhelGrid team,\n\nI would like to submit my sports venue for listing.\n\nVenue name:\nCity and area:\nSports/facilities available:\nContact person and phone:\nVenue address or Google Maps link:\nWebsite or social page (optional):\n\nI understand the details may be reviewed before publication.\n",
);
const SUBMISSION_LINK = `mailto:${EMAIL}?subject=${SUBJECT}&body=${BODY}`;

function ListVenuePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [form, setForm] = useState({
    venueName: "",
    city: "",
    area: "",
    sports: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    openingHours: "",
    bookingMethod: "WhatsApp or phone",
    notes: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionMessage("");
    if (!isSupabaseConfigured) {
      setSubmissionMessage("Online submission is temporarily unavailable. Please use the email option below.");
      return;
    }

    setSubmitting(true);
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          insert: (values: Record<string, unknown>) => PromiseLike<{ error: { message: string } | null }>;
        };
      };
      const { error } = await client.from("venue_submissions").insert({
        venue_name: form.venueName.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        sports: form.sports.split(",").map((sport) => sport.trim()).filter(Boolean),
        contact_name: form.contactName.trim(),
        contact_phone: form.phone.trim(),
        contact_email: form.email.trim(),
        address: form.address.trim() || null,
        website_url: form.website.trim() || null,
        opening_hours: form.openingHours.trim() || null,
        booking_method: form.bookingMethod,
        notes: form.notes.trim() || null,
        status: "pending",
      });
      if (error) throw new Error(error.message);
      setSubmissionMessage("Thank you! Your venue details have been submitted for KhelGrid review.");
      setForm({
        venueName: "", city: "", area: "", sports: "", contactName: "", phone: "",
        email: "", address: "", website: "", openingHours: "",
        bookingMethod: "WhatsApp or phone", notes: "",
      });
    } catch (error) {
      console.error("Venue submission failed", error);
      setSubmissionMessage("We couldn't submit your venue right now. Please try again or use the email option below.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-7 sm:py-10 md:px-6">
      <SEO
        title="List Your Sports Venue on KhelGrid"
        description="Help athletes, teams and coaches discover your turf, court, ground, sports complex or training facility."
        canonicalUrl="/list-venue"
        keywords="list sports venue India, list turf, sports ground directory, KhelGrid venue listing"
      />
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-xs font-semibold text-primary">
              <Building2 className="h-3.5 w-3.5" /> For venue owners
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Your venue. More visibility. More players.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Put your turf, court, ground or sports facility on the map. Help local athletes,
              teams and coaches discover where they can play and train.
            </p>
            <a
              href={SUBMISSION_LINK}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Submit venue details <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Free to submit · Details reviewed before publication
            </p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-56">
            {[
              { icon: MapPin, label: "Local discovery" },
              { icon: Trophy, label: "Sports-specific" },
              { icon: CheckCircle2, label: "Reviewed details" },
              { icon: Mail, label: "Direct enquiry" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-h-20 flex-col justify-between rounded-2xl border border-border/70 bg-background/80 p-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Turfs & grounds",
            detail: "Football, cricket, futsal, hockey and multi-sport grounds.",
          },
          {
            title: "Courts & indoor spaces",
            detail: "Badminton, tennis, basketball, table tennis and indoor facilities.",
          },
          {
            title: "Training facilities",
            detail: "Swimming pools, gyms, academies, studios and specialist centres.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-bold">Submit your venue online</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your submission stays unpublished until KhelGrid reviews it. Please provide accurate venue and contact details.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Venue name *
            <input required maxLength={160} value={form.venueName} onChange={(e) => updateField("venueName", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            City *
            <input required maxLength={100} value={form.city} onChange={(e) => updateField("city", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Locality / area *
            <input required maxLength={160} value={form.area} onChange={(e) => updateField("area", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Sports offered *
            <input required placeholder="Football, cricket, badminton" value={form.sports} onChange={(e) => updateField("sports", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Owner / manager name *
            <input required maxLength={120} value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Contact phone / WhatsApp *
            <input required type="tel" maxLength={30} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Contact email *
            <input required type="email" maxLength={254} value={form.email} onChange={(e) => updateField("email", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Website or social link
            <input type="url" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
            Full address or Google Maps link
            <input value={form.address} onChange={(e) => updateField("address", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Opening hours
            <input value={form.openingHours} onChange={(e) => updateField("openingHours", e.target.value)} placeholder="e.g. 6 AM–11 PM daily" className="h-11 rounded-lg border border-input bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Booking method
            <select value={form.bookingMethod} onChange={(e) => updateField("bookingMethod", e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-normal">
              <option>WhatsApp or phone</option>
              <option>Online booking</option>
              <option>Walk-in only</option>
              <option>Other</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
            Additional details
            <textarea rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Hourly price, facilities, photo links, rules or other details" className="rounded-lg border border-input bg-background px-3 py-2 font-normal" />
          </label>
          <div className="sm:col-span-2 flex flex-col items-start gap-3">
            <button type="submit" disabled={submitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Submitting…" : "Submit venue for review"} <ArrowRight className="h-4 w-4" />
            </button>
            {submissionMessage && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{submissionMessage}</p>}
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-bold">What to send</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The email opens with a short checklist so we can review your venue accurately.
        </p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {[
            "Venue name and city/area",
            "Sports and facilities available",
            "Address or Google Maps link",
            "Owner/manager contact details",
            "Photos, website or social link (optional)",
            "Opening hours and booking method (optional)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            KhelGrid will review submissions before publishing. A listing does not guarantee bookings or venue verification.
          </p>
          <a href={SUBMISSION_LINK} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <Mail className="h-4 w-4" /> Email venue details
          </a>
        </div>
      </section>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Looking for a place to play instead?{" "}
        <Link to="/book" className="font-semibold text-primary hover:underline">Explore venues on KhelGrid</Link>
      </p>
    </main>
  );
}
