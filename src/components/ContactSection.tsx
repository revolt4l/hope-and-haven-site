import { motion } from "framer-motion";
import { Facebook, MessageCircle, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            We'd Love to Hear From You
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-10">
            Whether you're visiting for the first time or looking for a church family, reach out — we're here for you.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <a
              href="https://www.facebook.com/share/1JPmfu6Z6K/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Facebook className="w-6 h-6 text-primary" />
              </div>
              <p className="font-body font-semibold text-foreground">Facebook</p>
              <p className="font-body text-sm text-muted-foreground">Follow us</p>
            </a>

            <a
              href="https://wa.me/2348037382276"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="font-body font-semibold text-foreground">WhatsApp</p>
              <p className="font-body text-sm text-muted-foreground">+234 803 738 2276</p>
            </a>

            <div
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <p className="font-body font-semibold text-foreground">Location</p>
              <p className="font-body text-sm text-muted-foreground text-center">Behind Idanre Garage, Akure, Nigeria</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
