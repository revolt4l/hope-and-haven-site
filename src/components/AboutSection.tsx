import { motion } from "framer-motion";
import { Target, Eye, BookOpen } from "lucide-react";
import pastor1 from "@/assets/pastor1.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Who We Are</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            About TREM Oke Aro
          </h2>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card border border-border"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Mission</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To raise a people for God — empowering every believer to live the Kingdom life on earth through worship, the Word, and fellowship. We are committed to evangelism, discipleship, and transforming our community through the love of Christ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card border border-border"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Vision</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To be a beacon of hope — a thriving, Spirit-filled church that transforms lives, raises leaders, and extends God's kingdom across Akure, Nigeria, and beyond. We envision families healed, communities restored, and destinies fulfilled.
            </p>
          </motion.div>
        </div>

        {/* Pastor Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-5 gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="md:col-span-2">
              <img
                src={pastor1}
                alt="Reverend Marcus Akinduko - Pastor of TREM Oke Aro"
                className="w-full h-80 md:h-full object-contain object-center"
              />
            </div>
            <div className="md:col-span-3 p-6 md:p-8">
              <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-2">Meet Our Pastor</p>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Reverend Marcus Akinduko
              </h3>
              <div className="space-y-3 text-muted-foreground font-body leading-relaxed">
                <p>
                  With a heart burning for souls and a passion for the Word of God, Reverend Marcus Akinduko leads TREM Oke Aro with wisdom, love, and an unwavering commitment to God's purpose.
                </p>
                <p>
                  Under his leadership, the church has grown into a vibrant family — transforming lives, raising leaders, and making an impact that stretches far beyond our walls.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TREM Origin + Motto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12 space-y-6"
        >
          <div className="p-6 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">TREM International</span> — The Redeemed Evangelical Mission was founded on January 4, 1981 by Bishop Mike Okonkwo, with headquarters in Lagos, Nigeria. TREM's mission is to raise a people for God, empowering them to live the Kingdom life through worship, word, and fellowship. The ministry operates worldwide with numerous branches and a strong commitment to evangelism and community outreach.
              </p>
            </div>
          </div>
          <div className="text-center p-6 rounded-xl bg-foreground">
            <p className="font-display text-xl italic text-primary-foreground">
              "Power in the Word"
            </p>
            <p className="text-primary-foreground/50 font-body text-sm mt-1">— TREM Motto</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center" style={{ boxShadow: "var(--shadow-soft)" }}>
            <p className="font-body text-xs text-muted-foreground">
              This website was professionally designed & developed by{" "}
              <a
                href="https://goratechpowerhub.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-secondary hover:underline"
              >
                Goratech Power Hub
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
