import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Phone, Calendar, Sparkles, Heart, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";
import styleBraids from "@/assets/style-braids-1.jpg";
import styleNatural from "@/assets/style-natural-1.jpg";
import styleWeave from "@/assets/style-weave-1.jpg";
import styleSpecial from "@/assets/style-special-1.jpg";

const features = [
  {
    icon: Sparkles,
    title: "Expert Styling",
    description: "Over 10 years of professional hair care experience",
  },
  {
    icon: Heart,
    title: "Gentle Care",
    description: "We treat your hair with love and the best products",
  },
  {
    icon: Shield,
    title: "Clean Environment",
    description: "Spotless salon with sanitized equipment always",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    description: "We respect your time with punctual appointments",
  },
];

const popularStyles = [
  { image: styleBraids, title: "Box Braids", category: "Braids" },
  { image: styleNatural, title: "Natural Curls", category: "Natural" },
  { image: styleWeave, title: "Lace Front", category: "Weaves & Wigs" },
  { image: styleSpecial, title: "Bridal Updo", category: "Special Occasion" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful African woman with styled braids in a modern salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        
        <div className="container-salon relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight animate-fade-in">
              Welcome to{" "}
              <span className="text-primary">Stellar Styles</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Where beauty, care, and confidence meet. Your trusted partner for stunning hair transformations.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/styles">
                <Button size="lg" variant="default" className="gap-2">
                  View Our Styles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/book">
                <Button size="lg" variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book an Appointment
                </Button>
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/50">
        <div className="container-salon">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Why Choose Stellar Styles?
            </h2>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-muted-foreground">
              We're more than a salon – we're your beauty partner committed to making you look and feel your best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elegant p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Styles Preview */}
      <section className="section-padding">
        <div className="container-salon">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Our Popular Styles
            </h2>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-muted-foreground">
              From elegant braids to natural looks, we create styles that celebrate your unique beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularStyles.map((style, index) => (
              <Link
                key={style.title}
                to="/styles"
                className="group card-elegant overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {style.category}
                  </span>
                  <h3 className="font-display text-lg font-medium text-foreground mt-1">
                    {style.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/styles">
              <Button size="lg" variant="outline" className="gap-2">
                View All Styles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-warm-brown text-cream">
        <div className="container-salon text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="text-cream/80 max-w-xl mx-auto mb-8">
            Book your appointment today and let us create something beautiful for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <Button size="lg" variant="gold" className="gap-2">
                <Calendar className="w-5 h-5" />
                Book Now
              </Button>
            </Link>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp" className="gap-2">
                <Phone className="w-5 h-5" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
