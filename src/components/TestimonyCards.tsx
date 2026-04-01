import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimony {
  id: string;
  name: string;
  testimony: string;
  created_at: string;
}

const TestimonyCard = ({ testimony, index }: { testimony: Testimony; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimony.testimony.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-border bg-card p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <Quote className="w-6 h-6 text-secondary mb-3 opacity-60" />
      <p
        className={`font-body text-muted-foreground leading-relaxed text-sm ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        "{testimony.testimony}"
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 inline-flex items-center gap-1 text-secondary font-body text-xs font-semibold hover:opacity-80 transition-opacity"
        >
          {expanded ? (
            <>
              Read Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="font-display font-semibold text-foreground text-sm">— {testimony.name}</p>
      </div>
    </motion.div>
  );
};

const TestimonyCards = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);

  const fetchTestimonies = useCallback(async () => {
    const { data, error } = await supabase
      .from("testimonies")
      .select("id, name, testimony, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setTestimonies(data);
    }
  }, []);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  if (testimonies.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 animated-bg-light" style={{ background: "var(--section-gradient)" }}>
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-2">
            What Members Say
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Testimony Cards
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonies.map((t, i) => (
            <TestimonyCard key={t.id} testimony={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonyCards;
