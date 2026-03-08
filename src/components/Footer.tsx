import { Code, Clock, MapPin, Facebook, Phone } from "lucide-react";
import bishopImg from "@/assets/bishop.jpg";

const Footer = () => {
  return (
    <footer className="bg-foreground pt-16 pb-8 border-t border-primary-foreground/10">
      <div className="container">
        {/* Bishop */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={bishopImg}
            alt="Bishop Mike Okonkwo and his wife, Peace Okonkwo"
            className="w-24 h-24 rounded-full object-cover object-top border-2 border-secondary/40 mb-3"
          />
          <p className="font-display font-bold text-primary-foreground text-sm">
            Bishop Mike & Peace Okonkwo
          </p>
          <p className="font-body text-primary-foreground/40 text-xs">
            Founder, TREM International
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Church Info */}
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-xl text-primary-foreground mb-2">
              TREM <span className="text-secondary">Oke Aro</span>
            </p>
            <p className="font-body text-primary-foreground/50 text-sm mb-3">
              The Redeemed Evangelical Mission
            </p>
            <div className="flex items-start gap-2 justify-center md:justify-start">
              <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <p className="font-body text-primary-foreground/40 text-xs">
                Behind Idanre Garage, Akure, Ondo State, Nigeria
              </p>
            </div>
          </div>

          {/* Service Times */}
          <div className="text-center md:text-left">
            <p className="font-display font-semibold text-primary-foreground text-sm mb-3 flex items-center gap-2 justify-center md:justify-start">
              <Clock className="w-4 h-4 text-secondary" />
              Service Times
            </p>
            <div className="space-y-2 font-body text-xs text-primary-foreground/50">
              <p>Sunday Celebration — <span className="text-primary-foreground/70">8:30 AM – 10:30 AM</span></p>
              <p>Power for Living — <span className="text-primary-foreground/70">5:00 PM – 6:00 PM</span></p>
              <p>Miracle Rally (3rd Friday) — <span className="text-primary-foreground/70">5:00 PM – 6:00 PM</span></p>
            </div>
          </div>

          {/* Connect */}
          <div className="text-center md:text-left">
            <p className="font-display font-semibold text-primary-foreground text-sm mb-3">Connect With Us</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <a
                href="https://wa.me/2348037382276"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-foreground/60" />
              </a>
              <a
                href="https://www.facebook.com/share/1JPmfu6Z6K/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
              >
                <Facebook className="w-4 h-4 text-primary-foreground/60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-primary-foreground/30 text-xs">
            © {new Date().getFullYear()} TREM Oke Aro. All rights reserved.
          </p>
          <a
            href="https://goratechpowerhub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs text-primary-foreground/50 hover:text-secondary transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Designed & developed by <span className="font-semibold text-secondary">Goratech Power Hub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;