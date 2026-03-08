import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
            <div className="mt-6 p-5 rounded-xl bg-muted/50 border border-border">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">TREM International</span> — The Redeemed Evangelical Mission was founded on January 4, 1981 by Bishop Mike Okonkwo, with headquarters in Lagos, Nigeria. TREM's mission is to raise a people for God, empowering them to live the Kingdom life on earth through worship, word, and fellowship. The ministry operates worldwide with numerous branches and a strong commitment to evangelism and community outreach.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
