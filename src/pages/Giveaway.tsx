import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Loader2, MessageCircle, Timer } from "lucide-react";

type Question = { q: string; options: string[]; answer: string };

const QUESTIONS: Question[] = [
  { q: "How many years did the Israelites wander in the wilderness?", options: ["40", "30", "20", "50"], answer: "40" },
  { q: "Who was the mother of John the Baptist?", options: ["Mary", "Elizabeth", "Anna", "Priscilla"], answer: "Elizabeth" },
  { q: "How many pieces of silver was Joseph sold for?", options: ["30", "50", "20", "10"], answer: "20" },
  { q: "Which apostle walked on water with Jesus?", options: ["John", "James", "Peter", "Andrew"], answer: "Peter" },
  { q: "Where was Jesus arrested?", options: ["Eden", "Gethsemane", "Nazareth", "Bethlehem"], answer: "Gethsemane" },
];

const QUIZ_SECONDS = 45;

const entrySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp number")
    .max(20)
    .regex(/^[0-9+\s-]+$/, "Only digits, +, spaces and dashes"),
  email: z.string().trim().email("Enter a valid email").max(255),
});

type Entry = { name: string; phone: string; email: string };

type Result =
  | { kind: "winner"; name: string }
  | { kind: "late" }
  | { kind: "wrong" }
  | { kind: "timeout" }
  | { kind: "closed"; winnerName?: string }
  | null;

type Stage = "form" | "quiz" | "result";

const WA_CLAIM = "https://wa.me/2348059712276";

const Giveaway = () => {
  const [stage, setStage] = useState<Stage>("form");
  const [entry, setEntry] = useState<Entry>({ name: "", phone: "", email: "" });
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUIZ_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [closed, setClosed] = useState<{ name?: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Check for existing winner on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("giveaway_winner").select("name").limit(1).maybeSingle();
      if (data) setClosed({ name: data.name });
      setChecking(false);
    })();
  }, []);

  // Countdown
  useEffect(() => {
    if (stage !== "quiz") return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          finalize(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const selectAnswer = (qi: number, opt: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = opt;
      return next;
    });
  };

  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = entrySchema.safeParse(entry);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setStage("quiz");
    setTimeLeft(QUIZ_SECONDS);
  };

  const submitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === null)) {
      setError("Please answer all 5 questions");
      return;
    }
    finalize(false);
  };

  const finalize = async (timedOut: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    if (timerRef.current) window.clearInterval(timerRef.current);

    try {
      // Re-check winner
      const { data: winnerRow } = await supabase
        .from("giveaway_winner")
        .select("name")
        .limit(1)
        .maybeSingle();
      if (winnerRow) {
        setClosed({ name: winnerRow.name });
        setResult({ kind: "closed", winnerName: winnerRow.name });
        setStage("result");
        return;
      }

      // Duplicate phone
      const { data: existing } = await supabase
        .from("giveaway_attempts")
        .select("id")
        .eq("phone", entry.phone)
        .limit(1);
      if (existing && existing.length > 0) {
        setError("This WhatsApp number has already entered.");
        setStage("form");
        return;
      }

      const score = answers.reduce(
        (acc, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0),
        0
      );
      const allCorrect = !timedOut && score === QUESTIONS.length;

      if (timedOut) {
        await supabase.from("giveaway_attempts").insert({
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          score,
          is_winner: false,
        });
        setResult({ kind: "timeout" });
        setStage("result");
        return;
      }

      if (allCorrect) {
        const { error: winErr } = await supabase
          .from("giveaway_winner")
          .insert({ name: entry.name, phone: entry.phone, email: entry.email });

        if (winErr) {
          await supabase.from("giveaway_attempts").insert({
            name: entry.name,
            phone: entry.phone,
            email: entry.email,
            score,
            is_winner: false,
          });
          setResult({ kind: "late" });
        } else {
          await supabase.from("giveaway_attempts").insert({
            name: entry.name,
            phone: entry.phone,
            email: entry.email,
            score,
            is_winner: true,
          });
          setClosed({ name: entry.name });
          setResult({ kind: "winner", name: entry.name });
          fireConfetti();
        }
      } else {
        await supabase.from("giveaway_attempts").insert({
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          score,
          is_winner: false,
        });
        setResult({ kind: "wrong" });
      }
      setStage("result");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#D4AF37", "#8B1A1A", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timerDanger = timeLeft <= 10;

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
              Win <span className="text-secondary">₦2,000 MTN Airtime</span>
            </h1>
            <p className="font-body text-primary-foreground/70 max-w-xl mx-auto">
              First person to answer all 5 questions correctly within 45 seconds wins. One entry per WhatsApp number.
            </p>
          </header>

          {checking ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : closed && stage !== "result" ? (
            <ClosedCard winnerName={closed.name} />
          ) : stage === "form" ? (
            <form
              onSubmit={startQuiz}
              className="bg-foreground/40 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 md:p-10 shadow-2xl animate-fade-in"
            >
              <div className="grid gap-4 mb-6">
                <Field label="Full Name">
                  <input
                    value={entry.name}
                    onChange={(e) => setEntry({ ...entry, name: e.target.value })}
                    maxLength={100}
                    className="input-styled"
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="WhatsApp Number">
                  <input
                    value={entry.phone}
                    onChange={(e) => setEntry({ ...entry, phone: e.target.value })}
                    maxLength={20}
                    inputMode="tel"
                    className="input-styled"
                    placeholder="08012345678"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={entry.email}
                    onChange={(e) => setEntry({ ...entry, email: e.target.value })}
                    maxLength={255}
                    type="email"
                    className="input-styled"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              {error && <ErrorBox message={error} />}
              <button
                type="submit"
                className="mt-6 w-full font-body font-semibold bg-primary text-primary-foreground px-6 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Timer className="w-4 h-4" /> Start Quiz
              </button>
              <style>{`
                .input-styled {
                  width: 100%;
                  background: hsl(var(--background) / 0.6);
                  border: 1px solid hsl(var(--secondary) / 0.2);
                  border-radius: 0.5rem;
                  padding: 0.75rem 1rem;
                  color: hsl(var(--primary-foreground));
                  outline: none;
                }
                .input-styled:focus { border-color: hsl(var(--secondary)); }
                .input-styled::placeholder { color: hsl(var(--primary-foreground) / 0.4); }
              `}</style>
            </form>
          ) : stage === "quiz" ? (
            <form
              onSubmit={submitQuiz}
              className="bg-foreground/40 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 md:p-10 shadow-2xl animate-fade-in"
            >
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center gap-2 font-display text-5xl md:text-6xl font-bold tabular-nums transition-colors ${
                    timerDanger ? "text-destructive animate-pulse" : "text-secondary"
                  }`}
                >
                  ⏱ {mm}:{ss}
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

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full font-body font-semibold bg-primary text-primary-foreground px-6 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Answers
              </button>
            </form>
          ) : (
            result && <ResultCard result={result} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block font-body text-sm text-primary-foreground/80 mb-2">{label}</label>
    {children}
  </div>
);

const ErrorBox = ({ message }: { message: string }) => (
  <p className="mt-6 text-sm text-destructive font-body bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
    {message}
  </p>
);

const Card = ({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "win" | "default" | "bad";
}) => (
  <div
    className={`text-center bg-foreground/40 backdrop-blur-sm border rounded-2xl p-8 md:p-12 shadow-2xl animate-fade-in ${
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
        <h2 className="font-display text-3xl text-secondary mb-3">
          Congratulations {result.name}!
        </h2>
        <p className="font-body text-primary-foreground/80 mb-6">
          You just won <span className="text-secondary font-semibold">₦2,000 MTN Airtime</span>!
          Screenshot this page and send to WhatsApp to claim your prize.
        </p>
        <a
          href={WA_CLAIM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body font-semibold bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" /> Claim on WhatsApp
        </a>
      </Card>
    );
  }
  if (result.kind === "late") {
    return (
      <Card>
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display text-3xl text-primary-foreground mb-3">
          Right answers — but someone got there first!
        </h2>
        <p className="font-body text-primary-foreground/70">
          Watch for our next giveaway!
        </p>
      </Card>
    );
  }
  if (result.kind === "wrong") {
    return (
      <Card tone="bad">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="font-display text-3xl text-primary-foreground mb-3">Incorrect answers.</h2>
        <p className="font-body text-primary-foreground/70">
          Study the Word and try our next giveaway! 🙏
        </p>
      </Card>
    );
  }
  if (result.kind === "timeout") {
    return (
      <Card tone="bad">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="font-display text-3xl text-primary-foreground mb-3">Time's up!</h2>
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
