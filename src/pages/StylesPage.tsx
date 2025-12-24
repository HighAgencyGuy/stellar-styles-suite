import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Fallback images for when database is empty
import styleBraids1 from "@/assets/style-braids-1.jpg";
import styleBraids2 from "@/assets/style-braids-2.jpg";
import styleBraids3 from "@/assets/style-braids-3.jpg";
import styleNatural1 from "@/assets/style-natural-1.jpg";
import styleNatural2 from "@/assets/style-natural-2.jpg";
import styleWeave1 from "@/assets/style-weave-1.jpg";
import styleWeave2 from "@/assets/style-weave-2.jpg";
import styleSpecial1 from "@/assets/style-special-1.jpg";

interface GalleryStyle {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  is_featured: boolean;
}

const defaultStyles = [
  { id: "1", image_url: styleBraids1, title: "Box Braids Updo", category: "Braids", description: "Elegant box braids styled in a beautiful updo", is_featured: false },
  { id: "2", image_url: styleBraids2, title: "Knotless Braids", category: "Braids", description: "Long flowing knotless braids for a natural look", is_featured: false },
  { id: "3", image_url: styleBraids3, title: "Passion Twists", category: "Braids", description: "Beautiful passion twists with neat parting", is_featured: false },
  { id: "4", image_url: styleNatural1, title: "Natural Afro", category: "Natural", description: "Well-defined natural afro curls", is_featured: false },
  { id: "5", image_url: styleNatural2, title: "Twist Out", category: "Natural", description: "Bouncy twist out with beautiful definition", is_featured: false },
  { id: "6", image_url: styleWeave1, title: "Lace Front Bob", category: "Weave", description: "Sleek lace front wig styled to perfection", is_featured: false },
  { id: "7", image_url: styleWeave2, title: "Bone Straight", category: "Weave", description: "Long bone straight hair for a glamorous look", is_featured: false },
  { id: "8", image_url: styleSpecial1, title: "Bridal Updo", category: "Special Occasion", description: "Elegant bridal updo with gold accessories", is_featured: false },
];

export default function StylesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [styles, setStyles] = useState<GalleryStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_styles')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setStyles(data);
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(s => s.category))];
        setCategories(uniqueCategories);
      } else {
        // Use default styles if database is empty
        setStyles(defaultStyles);
        setCategories(["All", "Braids", "Natural", "Weave", "Special Occasion"]);
      }
    } catch (err) {
      console.error('Error fetching styles:', err);
      // Use default styles on error
      setStyles(defaultStyles);
      setCategories(["All", "Braids", "Natural", "Weave", "Special Occasion"]);
    } finally {
      setLoading(false);
    }
  };

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

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStyles.map((style) => (
                  <div
                    key={style.id}
                    className="card-elegant overflow-hidden group"
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={style.image_url}
                        alt={style.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {style.is_featured && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {style.category}
                      </span>
                      <h3 className="font-display text-lg font-medium text-foreground mt-1">
                        {style.title}
                      </h3>
                      {style.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {style.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredStyles.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No styles found in this category.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
