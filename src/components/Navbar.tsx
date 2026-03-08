import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Schedule", href: "#schedule" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-foreground/95 backdrop-blur-md shadow-lg" : "bg-transparent"} border-b border-primary-foreground/10`}>
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="font-display font-bold text-lg text-primary-foreground">
          TREM <span className="text-secondary">Oke Aro</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm text-primary-foreground/70 hover:text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/2348037382276"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Connect
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-foreground/95 border-t border-primary-foreground/10 pb-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 font-body text-primary-foreground/80 hover:text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <a
              href="https://wa.me/2348037382276"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-body text-sm font-semibold bg-primary text-primary-foreground px-5 py-3 rounded-lg"
            >
              Connect on WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
