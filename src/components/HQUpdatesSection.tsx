import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";

type HQUpdate = {
  id: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  content_type: string;
  event_date: string | null;
  event_location: string | null;
  month_key: string | null;
};

const typeLabel: Record<string, string> = {
  monthly_declaration: "Monthly Declaration",
  monthly_theme: "Monthly Theme",
  monthly_program: "Monthly Programme",
  church_program: "Church Programme",
  event: "Event",
  conference: "Conference",
  special_service: "Special Service",
  announcement: "Announcement",
  sermon: "Sermon",
  devotional: "Devotional",
  important_date: "Important Date",
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const currentMonthKey = () => new Date().toISOString().slice(0, 7);

const HQUpdatesSection = () => {
  const [items, setItems] = useState<HQUpdate[]>([]);
  const [declaration, setDeclaration] = useState<HQUpdate | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("hq_updates")
        .select("id,title,summary,source_url,content_type,event_date,event_location,month_key")
        .eq("status", "published")
        .order("event_date", { ascending: true, nullsFirst: false })
        .limit(60);

      const rows = (data as HQUpdate[]) ?? [];
      const month = currentMonthKey();
      const active =
        rows.find((r) => r.content_type === "monthly_declaration" && r.month_key === month) ??
        rows.find((r) => r.content_type === "monthly_theme" && r.month_key === month) ??
        null;
      setDeclaration(active);
      setItems(rows.filter((r) => r.id !== active?.id).slice(0, 9));
    })();
  }, []);

  if (!declaration && items.length === 0) return null;

  return (
    <section id="hq-updates" className="py-20 lg:py-28 animated-bg-light" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Straight from Headquarters</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            TREM International HQ Updates
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Programmes, events and announcements published by TREM International Headquarters.
          </p>
        </motion.div>

        {declaration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-10 rounded-2xl border border-secondary/30 bg-card p-8 text-center"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary mb-3">
              {typeLabel[declaration.content_type]} — This Month
            </p>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">{declaration.title}</h3>
            {declaration.summary && (
              <p className="font-body text-muted-foreground leading-relaxed">{declaration.summary}</p>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/40 transition-all flex flex-col"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-secondary mb-2">
                {typeLabel[item.content_type] ?? item.content_type}
              </span>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
              {item.summary && (
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                  {item.summary}
                </p>
              )}
              <div className="mt-auto space-y-1.5">
                {item.event_date && (
                  <p className="flex items-center gap-2 font-body text-xs text-muted-foreground/80">
                    <CalendarDays className="w-3.5 h-3.5 text-secondary" /> {fmtDate(item.event_date)}
                  </p>
                )}
                {item.event_location && (
                  <p className="flex items-center gap-2 font-body text-xs text-muted-foreground/80">
                    <MapPin className="w-3.5 h-3.5 text-secondary" /> {item.event_location}
                  </p>
                )}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-xs text-secondary hover:underline pt-1"
                  >
                    Read on trem.org <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HQUpdatesSection;
