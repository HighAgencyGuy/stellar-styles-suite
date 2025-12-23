import { Layout } from "@/components/layout/Layout";
import { CheckCircle, Heart, Award, Users } from "lucide-react";
import aboutImage from "@/assets/about-stylist.jpg";

const values = [
  {
    icon: Heart,
    title: "Passion for Hair",
    description: "Every strand matters to us. We treat your hair with the care and attention it deserves.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We continuously improve our skills to bring you the latest and best styling techniques.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our priority. We listen to understand exactly what you want.",
  },
];

const commitments = [
  "Clean and sanitized equipment for every client",
  "Quality hair products that protect your natural hair",
  "Honest pricing with no hidden charges",
  "Comfortable waiting area with refreshments",
  "Appointment reminders via WhatsApp",
  "Friendly and respectful staff",
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              About Stellar Styles
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              A story of passion, dedication, and the art of making women feel beautiful.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-salon">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mt-2 mb-6">
                More Than Just a Salon
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Stellar Styles began over 10 years ago with a simple dream – to create a space where every woman feels valued, beautiful, and confident. What started as a small corner in my home has grown into a full-service salon that serves hundreds of happy clients.
                </p>
                <p>
                  As a woman-owned business, we understand the unique needs of Nigerian women. We know how important your hair is to your identity and self-expression. That's why we take the time to listen, advise, and create styles that truly suit you.
                </p>
                <p>
                  Our team is trained in both traditional and modern techniques. Whether you want elegant braids, a natural look, or a glamorous weave for a special occasion, we have the skills and experience to make it happen.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="card-elegant overflow-hidden">
                <img
                  src={aboutImage}
                  alt="Our lead stylist with beautiful natural hair"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Our Values
            </h2>
            <div className="divider-gold mt-4 mb-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="card-elegant p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="section-padding">
        <div className="container-salon">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                Our Commitment to You
              </h2>
              <div className="divider-gold mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {commitments.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
