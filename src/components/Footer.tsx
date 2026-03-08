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
      </div>
    </footer>
  );
};

export default Footer;
