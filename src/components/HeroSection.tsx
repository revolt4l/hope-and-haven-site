import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import pastor2 from "@/assets/pastor2.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={pastor2} alt="Pastor preaching" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--overlay-dark)" }} />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-4">
            The Redeemed Evangelical Mission · Oke Aro, Akure
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
            A Place of{" "}
            <span className="text-gold-gradient">Faith, Hope</span>{" "}
            & Love
          </h1>
          <p className="text-primary-foreground/80 font-body text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            Join us as we grow together in God's word, experience His power, and walk in purpose. Everyone is welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.facebook.com/share/1JPmfu6Z6K/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-body font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Visit Us This Sunday
            </a>
            <a
              href="https://wa.me/2348037382276"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-8 py-4 font-body font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
