import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import pastor1 from "@/assets/pastor1.jpg";
import pastor2 from "@/assets/pastor2.jpg";
import congregation from "@/assets/congregation.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import monthlyTheme from "@/assets/monthly-theme.jpg";

// Add new images here — no other code changes needed
const slides = [
  { src: heroBg, alt: "TREM Oke Aro Akure" },
  { src: pastor1, alt: "Pastor preaching" },
  { src: congregation, alt: "Church members in service" },
  { src: pastor2, alt: "Pastor at the pulpit" },
  { src: monthlyTheme, alt: "Monthly theme - Moving Forward" },
];

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-12 lg:py-16 bg-foreground">
      <div className="container">
        <div className="text-center mb-8">
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-2">Moments</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">Church Highlights</h2>
        </div>

        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
          {/* Aspect ratio container */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {slides.map((slide, i) => (
              <img
                key={i}
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: i === current ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-foreground/80 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-foreground/80 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-secondary w-6" : "bg-primary-foreground/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
