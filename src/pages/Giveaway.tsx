import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Loader2 } from "lucide-react";

type Question = { q: string; options: string[]; answer: string };

const QUESTIONS: Question[] = [
  { q: "Who built the ark?", options: ["Noah", "Moses", "David", "Abraham"], answer: "Noah" },
  { q: "How many books are in the Bible?", options: ["66", "72", "60", "80"], answer: "66" },
  { q: "Who was swallowed by a big fish?", options: ["Elijah", "Jonah", "Paul", "Peter"], answer: "Jonah" },
  { q: "What is the shortest verse in the Bible?", options: ["Jesus wept", "God is love", "Pray always", "Fear not"], answer: "Jesus wept" },
  { q: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul" },
];

const entrySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid WhatsApp number").max(20).regex(/^[0-9+\s-]+$/, "Only digits, +, spaces and dashes"),
});

type Result =
  | { kind: "winner"; name: string; phone: string }
  | { kind: "late" }
  | { kind: "wrong"; score: number }
  | { kind: "closed"; winnerName?: string }
  | null;

const Giveaway = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [closed, setClosed] = useState<{ name?: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("giveaway_winner").select("name").limit(1).maybeSingle();
      if (data) setClosed({ name: data.name });
      setChecking(false);
    })();
  }, []);

  const selectAnswer = (qi: number, opt: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = opt;
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = entrySchema.safeParse({ name, phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    if (answers.some((a) => a === null)) {
      setError("Please answer all 5 questions");
      return;
    }

    setSubmitting(true);
    try {
      // Re-check giveaway status
      const { data: winnerRow } = await supabase.from("giveaway_winner").select("name").limit(1).maybeSingle();
      if (winnerRow) {
        setClosed({ name: winnerRow.name });
        setResult({ kind: "closed", winnerName: winnerRow.name });
        setSubmitting(false);
        return;
      }

      // Block duplicate phone
      const { data: existing } = await supabase
        .from("giveaway_attempts")
        .select("id")
        .eq("phone", parsed.data.phone)
        .limit(1);
      if (existing && existing.length > 0) {
        setError("This WhatsApp number has already entered.");
        setSubmitting(false);
        return;
      }

      const score = answers.reduce((acc, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0), 0);
      const allCorrect = score === QUESTIONS.length;

      if (allCorrect) {
        // Try to claim winner (RLS only allows insert when no winner exists)
        const { error: winErr } = await supabase
          .from("giveaway_winner")
          .insert({ name: parsed.data.name, phone: parsed.data.phone });

        if (winErr) {
          // Someone beat them to it
          await supabase.from("giveaway_attempts").insert({
            name: parsed.data.name,
            phone: parsed.data.phone,
            score,
            is_winner: false,
          });
          setResult({ kind: "late" });
        } else {
          await supabase.from("giveaway_attempts").insert({
            name: parsed.data.name,
            phone: parsed.data.phone,
            score,
            is_winner: true,
          });
          setClosed({ name: parsed.data.name });
          setResult({ kind: "winner", name: parsed.data.name, phone: parsed.data.phone });
        }
      } else {
        await supabase.from("giveaway_attempts").insert({
          name: parsed.data.name,
          phone: parsed.data.phone,
          score,
          is_winner: false,
        });
        setResult({ kind: "wrong", score });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container max-w-3xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 mb-4">
              <Trophy className="w-4 h-4" />
              <span className="font-body text-xs uppercase tracking-widest">Bible Knowledge Giveaway</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-primary-foreground mb-3">
              Test Your <span className="text-secondary">Bible Knowledge</span>
            </h1>
            <p className="font-body text-primary-foreground/70 max-w-xl mx-auto">
              First person to get all 5 questions correct wins. One entry per WhatsApp number.
            </p>
          </header>

          {checking ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : result ? (
            <ResultCard result={result} />
          ) : closed ? (
            <ClosedCard winnerName={closed.name} />
          ) : (
            <form
              onSubmit={onSubmit}
              className="bg-foreground/40 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 md:p-10 shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block font-body text-sm text-primary-foreground/80 mb-2">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="w-full bg-background/60 border border-secondary/20 rounded-lg px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-secondary"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-primary-foreground/80 mb-2">WhatsApp Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    inputMode="tel"
                    className="w-full bg-background/60 border border-secondary/20 rounded-lg px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-secondary"
                    placeholder="08012345678"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {QUESTIONS.map((q, qi) => (
                  <div key={qi} className="border-t border-secondary/10 pt-6">
                    <p className="font-display text-lg text-primary-foreground mb-4">
                      <span className="text-secondary mr-2">{qi + 1}.</span>
                      {q.q}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const selected = answers[qi] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => selectAnswer(qi, opt)}
                            className={`text-left px-4 py-3 rounded-lg border font-body text-sm transition-all ${
                              selected
                                ? "bg-secondary/20 border-secondary text-primary-foreground"
                                : "bg-background/40 border-secondary/15 text-primary-foreground/80 hover:border-secondary/50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-6 text-sm text-destructive font-body bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full font-body font-semibold bg-primary text-primary-foreground px-6 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Entry
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Card = ({ children, tone = "default" }: { children: React.ReactNode; tone?: "win" | "default" | "bad" }) => (
  <div
    className={`text-center bg-foreground/40 backdrop-blur-sm border rounded-2xl p-8 md:p-12 shadow-2xl ${
      tone === "win"
        ? "border-secondary/60"
        : tone === "bad"
        ? "border-destructive/40"
        : "border-secondary/20"
    }`}
  >
    {children}
  </div>
);

const ResultCard = ({ result }: { result: NonNullable<Result> }) => {
  if (result.kind === "winner") {
    return (
      <Card tone="win">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="font-display text-3xl text-secondary mb-3">Congratulations {result.name}!</h2>
        <p className="font-body text-primary-foreground/80">
          You won! We'll contact you on <span className="text-secondary font-semibold">{result.phone}</span>.
        </p>
      </Card>
    );
  }
  if (result.kind === "late") {
    return (
      <Card>
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display text-3xl text-primary-foreground mb-3">Right answers — but someone got there first!</h2>
        <p className="font-body text-primary-foreground/70">Stay tuned for our next giveaway.</p>
      </Card>
    );
  }
  if (result.kind === "wrong") {
    return (
      <Card tone="bad">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="font-display text-3xl text-primary-foreground mb-3">Incorrect.</h2>
        <p className="font-body text-primary-foreground/70">Try our next giveaway!</p>
      </Card>
    );
  }
  return <ClosedCard winnerName={result.winnerName} />;
};

const ClosedCard = ({ winnerName }: { winnerName?: string }) => (
  <Card>
    <div className="text-5xl mb-4">🎉</div>
    <h2 className="font-display text-3xl text-primary-foreground mb-3">We have a winner!</h2>
    <p className="font-body text-primary-foreground/70">
      {winnerName ? `${winnerName} won this round. ` : ""}This giveaway has ended.
    </p>
  </Card>
);

export default Giveaway;
