import { motion } from "framer-motion";
import pastor1 from "@/assets/pastor1.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <img
                src={pastor1}
                alt="Reverend Marcus Akinduko preaching"
                className="rounded-2xl w-full object-cover aspect-[4/5]"
                style={{ boxShadow: "var(--shadow-elevated)" }}
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-secondary/20 -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Meet Our Pastor</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Reverend Marcus Akinduko
            </h2>
            <div className="space-y-4 text-muted-foreground font-body text-lg leading-relaxed">
              <p>
                With a heart burning for souls and a passion for the Word of God, Reverend Marcus Akinduko leads TREM Oke Aro with wisdom, love, and an unwavering commitment to God's purpose.
              </p>
              <p>
                Under his leadership, the church continues to be a beacon of hope — transforming lives, raising leaders, and extending God's kingdom in Akure and beyond.
              </p>
            </div>
            <div className="mt-8 p-6 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
              <p className="font-display text-lg italic text-foreground">
                "Power in the Word"
              </p>
              <p className="text-muted-foreground font-body text-sm mt-1">— TREM Motto</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
