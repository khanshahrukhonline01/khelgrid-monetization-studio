import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin-venue-submissions")({
  component: AdminVenueSubmissionsPage,
});

type Submission = {
  id: string;
  venue_name: string;
  city: string;
  area: string;
  sports: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  address: string | null;
  website_url: string | null;
  opening_hours: string | null;
  booking_method: string;
  notes: string | null;
  status: string;
  review_notes: string | null;
  created_at: string;
};

function AdminVenueSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured in this environment.");
      setLoading(false);
      return;
    }
    const client = supabase as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          in: (
            column: string,
            values: string[],
          ) => {
            order: (
              column: string,
              options: { ascending: boolean },
            ) => PromiseLike<{ data: Submission[] | null; error: { message: string } | null }>;
          };
        };
      };
    };
    const { data, error: queryError } = await client
      .from("venue_submissions")
      .select(
        "id,venue_name,city,area,sports,contact_name,contact_phone,contact_email,address,website_url,opening_hours,booking_method,notes,status,review_notes,created_at",
      )
      .in("status", ["pending", "in_review", "needs_changes"])
      .order("created_at", { ascending: true });
    if (queryError) {
      setError(
        queryError.message.includes("permission") ||
          queryError.message.includes("row-level security")
          ? "Access denied. Sign in with a KhelGrid administrator account to review venue submissions."
          : "Venue submissions could not be loaded. Please retry.",
      );
      setItems([]);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (
    item: Submission,
    status: "in_review" | "approved" | "rejected" | "needs_changes",
    publish: boolean,
  ) => {
    setBusyId(item.id);
    setError("");
    setNotice("");
    const { error: rpcError } = await supabase.rpc(
      "review_venue_submission" as never,
      {
        p_submission_id: item.id,
        p_status: status,
        p_review_notes: notes[item.id]?.trim() || null,
        p_publish: publish,
      } as never,
    );
    if (rpcError) {
      setError(
        rpcError.message.includes("permission") || rpcError.message.includes("administrator")
          ? "This action requires an authenticated KhelGrid administrator. No review changes were made."
          : rpcError.message,
      );
    } else {
      setNotice(
        publish
          ? "Venue approved and published to the directory."
          : `Submission marked ${status.replace("_", " ")}.`,
      );
      await load();
    }
    setBusyId("");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold">KhelGrid administration</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Venue submission review</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Submissions stay private until reviewed. Confirm the venue details and address before
            publishing. Publishing does not confirm live slot availability.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-5 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="mt-5 flex gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          {notice}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading submissions…</p>
      ) : items.length === 0 && !error ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <h2 className="font-semibold">No submissions awaiting review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New venue submissions will appear here after they are saved in Supabase.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">{item.venue_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.area}, {item.city} · {item.sports.join(", ")}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                  {item.status.replace("_", " ")}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd>
                    {item.contact_name} · {item.contact_phone}
                  </dd>
                  <dd>{item.contact_email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Address</dt>
                  <dd>{item.address || "Not supplied — required for publication"}</dd>
                  <dd>
                    {item.website_url ? (
                      <a
                        className="text-primary underline"
                        href={item.website_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Website / social link
                      </a>
                    ) : (
                      "No website supplied"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Hours / booking method</dt>
                  <dd>
                    {item.opening_hours || "Hours not supplied"} · {item.booking_method}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Owner notes</dt>
                  <dd className="whitespace-pre-wrap">{item.notes || "No additional notes"}</dd>
                </div>
              </dl>
              <label className="mt-4 block text-sm font-medium">
                Review notes (optional)
                <textarea
                  value={notes[item.id] ?? item.review_notes ?? ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  rows={2}
                  maxLength={2000}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 font-normal"
                  placeholder="Source checked, corrections needed, or reason for rejection"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void review(item, "in_review", false)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Mark in review
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void review(item, "needs_changes", false)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Request changes
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void review(item, "rejected", false)}
                  className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Publish this venue to the public directory? Confirm that the venue and address have been verified. Price and rating will remain unset.",
                      )
                    )
                      void review(item, "approved", true);
                  }}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busyId === item.id ? "Saving…" : "Approve & publish"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
