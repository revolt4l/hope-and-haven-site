import { useState, useEffect, useCallback } from "react";
import { Quote, Cake } from "lucide-react";

const testimonies = [
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

const TestimonySection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % testimonies.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-16 lg:py-20" style={{ background: "var(--section-gradient)" }}>
      <div className="container max-w-3xl mx-auto text-center">
        <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-2">
          Praise Reports
        </p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-10">
          Testimonies
        </h2>

        <div className="relative min-h-[200px] flex items-center justify-center">
          {testimonies.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out px-4"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            >
              <Quote className="w-8 h-8 text-secondary mb-4" />
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
          {testimonies.map((_, i) => (
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
      </div>
    </section>
  );
};

export default TestimonySection;
