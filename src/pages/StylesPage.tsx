import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

// Import all style images
import styleBraids1 from "@/assets/style-braids-1.jpg";
import styleBraids2 from "@/assets/style-braids-2.jpg";
import styleBraids3 from "@/assets/style-braids-3.jpg";
import styleNatural1 from "@/assets/style-natural-1.jpg";
import styleNatural2 from "@/assets/style-natural-2.jpg";
import styleWeave1 from "@/assets/style-weave-1.jpg";
import styleWeave2 from "@/assets/style-weave-2.jpg";
import styleSpecial1 from "@/assets/style-special-1.jpg";

const categories = ["All", "Braids", "Natural Hair", "Weaves & Wigs", "Special Occasion"];

const styles = [
  { id: 1, image: styleBraids1, title: "Box Braids Updo", category: "Braids", description: "Elegant box braids styled in a beautiful updo" },
  { id: 2, image: styleBraids2, title: "Knotless Braids", category: "Braids", description: "Long flowing knotless braids for a natural look" },
  { id: 3, image: styleBraids3, title: "Passion Twists", category: "Braids", description: "Beautiful passion twists with neat parting" },
  { id: 4, image: styleNatural1, title: "Natural Afro", category: "Natural Hair", description: "Well-defined natural afro curls" },
  { id: 5, image: styleNatural2, title: "Twist Out", category: "Natural Hair", description: "Bouncy twist out with beautiful definition" },
  { id: 6, image: styleWeave1, title: "Lace Front Bob", category: "Weaves & Wigs", description: "Sleek lace front wig styled to perfection" },
  { id: 7, image: styleWeave2, title: "Bone Straight", category: "Weaves & Wigs", description: "Long bone straight hair for a glamorous look" },
  { id: 8, image: styleSpecial1, title: "Bridal Updo", category: "Special Occasion", description: "Elegant bridal updo with gold accessories" },
];

export default function StylesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredStyles = activeCategory === "All"
    ? styles
    : styles.filter((style) => style.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Our Styles Gallery
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              Browse our collection of beautiful hairstyles. Each look is crafted with care and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-salon">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStyles.map((style) => (
              <div
                key={style.id}
                className="card-elegant overflow-hidden group"
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
                  <p className="text-sm text-muted-foreground mt-1">
                    {style.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredStyles.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No styles found in this category.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
