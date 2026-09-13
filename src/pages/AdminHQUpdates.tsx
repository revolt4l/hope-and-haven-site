import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, Inbox, RefreshCw } from "lucide-react";

type HQUpdate = {
  id: string;
  title: string;
  summary: string | null;
  source: string;
  source_url: string | null;
  image_url: string | null;
  content_type: string;
  publication_date: string | null;
  event_date: string | null;
  event_location: string | null;
  status: "pending_review" | "approved" | "published" | "rejected";
  imported_at: string;
};

const STATUSES = ["all", "pending_review", "approved", "published", "rejected"] as const;

const statusLabel: Record<string, string> = {
  all: "All",
  pending_review: "Pending review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
};

const statusClass: Record<string, string> = {
  pending_review: "bg-secondary/15 text-secondary border-secondary/30",
  approved: "bg-primary/15 text-primary border-primary/30",
  published: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

type SyncRun = {
  finished_at: string | null;
  status: string;
  items_found: number;
  items_created: number;
  items_updated: number;
  error: string | null;
};

const AdminHQUpdates = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<HQUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastRun, setLastRun] = useState<SyncRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");

  const load = useCallback(async () => {
    const [{ data, error }, { data: runs }] = await Promise.all([
      supabase
        .from("hq_updates")
        .select(
          "id,title,summary,source,source_url,image_url,content_type,publication_date,event_date,event_location,status,imported_at",
        )
        .order("imported_at", { ascending: false }),
      supabase
        .from("hq_sync_runs")
        .select("finished_at,status,items_found,items_created,items_updated,error")
        .order("started_at", { ascending: false })
        .limit(1),
    ]);
    if (error) setError(error.message);
    else setRows((data as HQUpdate[]) ?? []);
    setLastRun(((runs as SyncRun[]) ?? [])[0] ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runSync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("sync-trem-hq", { body: {} });
    setSyncing(false);
    if (error || data?.status !== "success") {
      toast({
        title: "Sync failed",
        description: data?.error ?? error?.message ?? "Please try again shortly.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sync complete",
        description: `${data.items_found} items checked · ${data.items_created} new · ${data.items_updated} updated.`,
      });
    }
    await load();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container">
          <header className="mb-10">
            <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Admin</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              TREM HQ Updates
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mb-6">
              Content pulled automatically from trem.org. New items are published to the website straight
              away, and an item that changes at HQ is updated here instead of duplicated.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={runSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 font-body text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing…" : "Sync TREM HQ Now"}
              </button>
              {lastRun && (
                <span className="font-body text-xs text-muted-foreground">
                  Last sync: {lastRun.finished_at ? new Date(lastRun.finished_at).toLocaleString() : "running"} ·{" "}
                  {lastRun.status === "success"
                    ? `${lastRun.items_created} new, ${lastRun.items_updated} updated`
                    : lastRun.error ?? lastRun.status}
                </span>
              )}
            </div>
          </header>


          <div className="flex flex-wrap gap-2 mb-8">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`font-body text-sm px-4 py-2 rounded-lg border transition-colors ${
                  filter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-secondary/40"
                }`}
              >
                {statusLabel[s]} ({counts[s] ?? 0})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-muted-foreground font-body py-16">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading updates…
            </div>
          ) : error ? (
            <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-xl p-6 font-body">
              Could not load updates: {error}
            </div>
          ) : visible.length === 0 ? (
            <div className="border border-border bg-card rounded-2xl p-12 text-center">
              <Inbox className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h2 className="font-display font-bold text-foreground text-lg mb-2">Nothing here yet</h2>
              <p className="font-body text-muted-foreground text-sm">
                No imported items with this status.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {visible.map((r) => (
                <article
                  key={r.id}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-5"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt={r.title}
                      loading="lazy"
                      className="w-full sm:w-40 h-32 object-cover rounded-xl border border-border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`font-body text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                          statusClass[r.status]
                        }`}
                      >
                        {statusLabel[r.status]}
                      </span>
                      <span className="font-body text-[11px] uppercase tracking-wide text-muted-foreground/70">
                        {r.content_type} · {r.source}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-foreground text-lg mb-1 break-words">
                      {r.title}
                    </h2>
                    {r.summary && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                        {r.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-xs text-muted-foreground/80">
                      <span>Published: {fmt(r.publication_date)}</span>
                      <span>Event: {fmt(r.event_date)}</span>
                      {r.event_location && <span>Location: {r.event_location}</span>}
                      <span>Imported: {fmt(r.imported_at)}</span>
                    </div>
                    {r.source_url && (
                      <a
                        href={r.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 font-body text-sm text-secondary hover:underline"
                      >
                        View original <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHQUpdates;
