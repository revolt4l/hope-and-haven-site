import { Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12 border-t border-primary-foreground/10">
      <div className="container text-center">
        <p className="font-display font-bold text-xl text-primary-foreground mb-2">
          TREM <span className="text-secondary">Oke Aro</span>
        </p>
        <p className="font-body text-primary-foreground/50 text-sm mb-1">
          The Redeemed Evangelical Mission · Power in the Word
        </p>
        <p className="font-body text-primary-foreground/40 text-xs">
          Behind Idanre Garage, Akure, Nigeria
        </p>
        <p className="font-body text-primary-foreground/30 text-xs mt-6">
          © {new Date().getFullYear()} TREM Oke Aro. All rights reserved.
        </p>

        <div className="mt-6 pt-6 border-t border-primary-foreground/10">
          <a
            href="https://goratechpowerhub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs text-primary-foreground/50 hover:text-secondary transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Website designed & developed by <span className="font-semibold text-secondary">Goratech Power Hub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
