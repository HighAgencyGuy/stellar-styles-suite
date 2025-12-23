import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Contact & Location
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Reach out via WhatsApp or visit us at our salon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding">
        <div className="container-salon">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">WhatsApp (Preferred)</h3>
                      <p className="text-muted-foreground">+234 800 000 0000</p>
                      <a
                        href="https://wa.me/2348000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2"
                      >
                        <Button variant="whatsapp" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Chat Now
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+234 800 000 0000</p>
                      <a
                        href="tel:+2348000000000"
                        className="text-primary hover:underline text-sm"
                      >
                        Call us directly
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground">
                        123 Beauty Lane,<br />
                        Lekki Phase 1,<br />
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Opening Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                        <p>Saturday: 9:00 AM - 6:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directions */}
              <div className="p-6 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">How to Find Us</h3>
                <p className="text-muted-foreground text-sm">
                  We are located on Beauty Lane, just off the main Lekki-Epe Expressway. 
                  Look for the cream building with gold signage. There is ample parking available 
                  in front of the salon. Landmark: Opposite XYZ Plaza.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="card-elegant overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7231755555555!2d3.4735!3d6.4335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnMDAuNiJOIDPCsDI4JzI0LjYiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Stellar Styles Location"
                className="w-full h-[450px]"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
