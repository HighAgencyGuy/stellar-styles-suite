import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-warm-brown text-cream">
      <div className="container-salon section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              Stellar <span className="text-gold-light">Styles</span>
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Where beauty, care, and confidence meet. Your trusted hair care partner for over 10 years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-cream/80 hover:text-gold-light transition-colors text-sm">
                About Us
              </Link>
              <Link to="/styles" className="text-cream/80 hover:text-gold-light transition-colors text-sm">
                Our Styles
              </Link>
              <Link to="/prices" className="text-cream/80 hover:text-gold-light transition-colors text-sm">
                Price List
              </Link>
              <Link to="/book" className="text-cream/80 hover:text-gold-light transition-colors text-sm">
                Book Appointment
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+2348000000000"
                className="flex items-center gap-3 text-cream/80 hover:text-gold-light transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +234 800 000 0000
              </a>
              <div className="flex items-start gap-3 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Beauty Lane, Lekki Phase 1, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80 text-sm">
                <Clock className="w-4 h-4" />
                Mon - Sat: 9am - 7pm
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold-light hover:text-warm-brown transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold-light hover:text-warm-brown transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-cream/60 text-xs">
              @stellarstyles_ng
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/20 text-center text-cream/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Stellar Styles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
