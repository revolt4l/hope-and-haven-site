import { useState, useEffect, useCallback } from "react";
import { Quote, Cake, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const staticTestimonies = [
  {
    name: "All March Celebrants",
    text: "Happy Birthday to all our March celebrants! May the Lord bless you with good health, long life, and abundant grace. Your new age is blessed in Jesus' name!",
    isBirthday: true,
  },
  {
    name: "Brother James Okonkwo",
    text: "After years of struggling, God opened a door of employment that I never expected. He is truly a way maker!",
  },
  {
    name: "Sister Grace Akinola",
    text: "My family was on the verge of breaking apart, but through prayers in this church, God restored peace and unity in my home.",
  },
  {
    name: "Brother David Oluwaseun",
    text: "I was involved in a terrible accident but walked away without a scratch. God's protection over my life is undeniable!",
  },
  {
    name: "Sister Mary Adekunle",
    text: "God blessed me with the fruit of the womb after 7 years of waiting. Nothing is impossible with God!",
  },
];

interface Testimony {
  name: string;
  text: string;
  isBirthday?: boolean;
}

const TestimonySection = () => {
  const [current, setCurrent] = useState(0);
  const [allTestimonies, setAllTestimonies] = useState<Testimony[]>(staticTestimonies);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formTestimony, setFormTestimony] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Fetch approved testimonies from DB
  useEffect(() => {
    const fetchTestimonies = async () => {
      const { data, error } = await supabase
        .from("testimonies")
        .select("name, testimony")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const dbTestimonies: Testimony[] = data.map((t) => ({
          name: t.name,
          text: t.testimony,
        }));
        setAllTestimonies([...staticTestimonies, ...dbTestimonies]);
      }
    };
    fetchTestimonies();
  }, []);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % allTestimonies.length),
    [allTestimonies.length]
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTestimony.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("testimonies").insert({
      name: formName.trim(),
      testimony: formTestimony.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit testimony. Please try again.",
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
      setFormName("");
      setFormTestimony("");
      toast({
        title: "Testimony Submitted!",
        description: "Your testimony has been submitted and will appear after approval.",
      });
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    }
  };

  return (
    <section className="py-16 lg:py-20" style={{ background: "var(--section-gradient)" }}>
      <div className="container max-w-3xl mx-auto text-center">
        <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-2">
          Praise Reports
        </p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-10">
          Testimonies
        </h2>

        {/* Carousel */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          {allTestimonies.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out px-4"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            >
              {t.isBirthday ? (
                <Cake className="w-8 h-8 text-secondary mb-4" />
              ) : (
                <Quote className="w-8 h-8 text-secondary mb-4" />
              )}
              <p className="text-lg md:text-xl font-body text-muted-foreground italic leading-relaxed mb-6">
                "{t.text}"
              </p>
              <span className="font-display font-semibold text-foreground">
                — {t.name}
              </span>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {allTestimonies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-secondary w-6" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to testimony ${i + 1}`}
            />
          ))}
        </div>

        {/* Share Testimony Button */}
        <div className="mt-10">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-display font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Share Your Testimony
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-4 bg-card border border-border rounded-xl p-6 text-left max-w-md mx-auto shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                  <p className="font-display font-semibold text-foreground text-lg">Thank you!</p>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    Your testimony will appear after approval.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-4">
                    Share Your Testimony
                  </h3>
                  <div className="mb-4">
                    <label htmlFor="testimony-name" className="block text-sm font-body text-muted-foreground mb-1">
                      Your Name
                    </label>
                    <input
                      id="testimony-name"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Brother John"
                      maxLength={100}
                      required
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="testimony-text" className="block text-sm font-body text-muted-foreground mb-1">
                      Your Testimony
                    </label>
                    <textarea
                      id="testimony-text"
                      value={formTestimony}
                      onChange={(e) => setFormTestimony(e.target.value)}
                      placeholder="Share what God has done for you..."
                      maxLength={1000}
                      required
                      rows={4}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground font-display font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-border text-muted-foreground font-body rounded-md hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonySection;
