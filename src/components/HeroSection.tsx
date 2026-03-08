import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="TREM Oke Aro Congregation worshipping together" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--overlay-dark)" }} />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-secondary font-body text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Welcome to TREM · Oke Aro, Akure
          </motion.p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
            You Are{" "}
            <span className="text-gold-gradient">Welcome Home</span>
          </h1>
          <p className="text-primary-foreground/80 font-body text-lg md:text-xl max-w-xl mb-4 leading-relaxed">
            At The Redeemed Evangelical Mission, Oke Aro, we believe every life is precious and every soul matters. Come experience God's love in a warm, Spirit-filled community.
          </p>
          <p className="text-primary-foreground/60 font-body text-base max-w-lg mb-8 leading-relaxed italic">
            "Come as you are — leave transformed."
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#schedule"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-body font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Join Us This Sunday
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/2348037382276"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-8 py-4 font-body font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              <MessageCircle className="w-5 h-5" />
              Chat With Us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
