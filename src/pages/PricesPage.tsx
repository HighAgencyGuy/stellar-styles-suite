import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

const priceList = [
  {
    category: "Braids",
    services: [
      { name: "Box Braids (Small)", price: "₦15,000 - ₦25,000" },
      { name: "Box Braids (Medium)", price: "₦12,000 - ₦18,000" },
      { name: "Box Braids (Large/Jumbo)", price: "₦8,000 - ₦12,000" },
      { name: "Knotless Braids", price: "₦18,000 - ₦30,000" },
      { name: "Cornrows (All-Back)", price: "₦3,000 - ₦6,000" },
      { name: "Cornrows (Ghana Weaving)", price: "₦5,000 - ₦10,000" },
      { name: "Passion Twists", price: "₦15,000 - ₦22,000" },
      { name: "Faux Locs", price: "₦20,000 - ₦35,000" },
    ],
  },
  {
    category: "Natural Hair",
    services: [
      { name: "Wash & Condition", price: "₦3,000 - ₦5,000" },
      { name: "Deep Conditioning Treatment", price: "₦5,000 - ₦8,000" },
      { name: "Twist Out / Braid Out", price: "₦5,000 - ₦8,000" },
      { name: "Silk Press / Blow Out", price: "₦8,000 - ₦15,000" },
      { name: "Loc Maintenance", price: "₦5,000 - ₦10,000" },
      { name: "Natural Hair Trim", price: "₦2,000 - ₦4,000" },
    ],
  },
  {
    category: "Weaves & Wigs",
    services: [
      { name: "Wig Installation (Glueless)", price: "₦8,000 - ₦12,000" },
      { name: "Wig Installation (Glue)", price: "₦10,000 - ₦15,000" },
      { name: "Sew-In Weave", price: "₦12,000 - ₦20,000" },
      { name: "Frontal Installation", price: "₦15,000 - ₦25,000" },
      { name: "Closure Installation", price: "₦10,000 - ₦18,000" },
      { name: "Wig Customization", price: "₦5,000 - ₦10,000" },
    ],
  },
  {
    category: "Special Occasion",
    services: [
      { name: "Bridal Hair", price: "₦30,000 - ₦60,000" },
      { name: "Bridal Party (per person)", price: "₦15,000 - ₦25,000" },
      { name: "Prom / Party Styling", price: "₦10,000 - ₦20,000" },
      { name: "Traditional Wedding Style", price: "₦20,000 - ₦40,000" },
      { name: "Photo Shoot Styling", price: "₦15,000 - ₦30,000" },
    ],
  },
];

export default function PricesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Our Price List
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              Transparent pricing with no hidden charges. Prices may vary based on hair length and complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Price List */}
      <section className="section-padding">
        <div className="container-salon max-w-4xl">
          <div className="space-y-10">
            {priceList.map((category) => (
              <div key={category.category} className="card-elegant overflow-hidden">
                <div className="bg-primary/10 px-6 py-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {category.category}
                  </h2>
                </div>
                <div className="divide-y divide-border">
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className="flex justify-between items-center px-6 py-4"
                    >
                      <span className="text-foreground">{service.name}</span>
                      <span className="font-semibold text-primary">{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-accent/30 rounded-lg">
            <p className="text-muted-foreground text-center text-sm">
              <strong>Note:</strong> Prices are estimates and may vary based on hair length, thickness, and specific style requirements. 
              Hair (extensions, wigs) not included unless specified. Please contact us for a personalized quote.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Ready to book your appointment?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book">
                <Button size="lg" variant="default" className="gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Ask on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
