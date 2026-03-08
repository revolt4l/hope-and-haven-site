import { motion } from "framer-motion";
import { Facebook, MessageCircle, MapPin, Phone, Navigation } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Find Us</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            We'd Love to Meet You
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Whether you're visiting for the first time or looking for a church family — you belong here. Reach out anytime!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Cards */}
          <div className="space-y-4">
            <motion.a
              href="https://wa.me/2348037382276"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">WhatsApp</p>
                <p className="font-body text-sm text-muted-foreground">+234 803 738 2276</p>
              </div>
            </motion.a>

            <motion.a
              href="https://www.facebook.com/share/1JPmfu6Z6K/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Facebook className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Facebook</p>
                <p className="font-body text-sm text-muted-foreground">Follow us for updates & live services</p>
              </div>
            </motion.a>

            <motion.a
              href="tel:+2348037382276"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Call Us</p>
                <p className="font-body text-sm text-muted-foreground">+234 803 738 2276</p>
              </div>
            </motion.a>
          </div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {/* Map embed */}
            <div className="w-full h-48 bg-muted">
              <iframe
                title="TREM Oke Aro Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.5!2d5.195!3d7.255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTUnMTguMCJOIDXCsDExJzQyLjAiRQ!5e0!3m2!1sen!2sng!4v1"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-display font-semibold text-foreground">TREM Oke Aro, Akure</p>
                  <p className="font-body text-sm text-muted-foreground mt-1">Behind Idanre Garage, Akure, Ondo State, Nigeria</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/TREM+Oke+Aro+Akure+Behind+Idanre+Garage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity w-full justify-center"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
