import { Card } from "@/components/ui/card";
import { Smartphone, ShirtIcon, Home, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Smartphone,
    title: "Mobiles & Electronics",
    description: "Latest smartphones, laptops, and gadgets",
    color: "bg-blue-500",
  },
  {
    icon: ShirtIcon,
    title: "Fashion & Beauty",
    description: "Trending styles for men, women, and kids",
    color: "bg-pink-500",
  },
  {
    icon: Home,
    title: "Home & Living",
    description: "Furniture, decor, and home essentials",
    color: "bg-green-500",
  },
  {
    icon: Zap,
    title: "Electrical & Auto",
    description: "Car accessories, electrical supplies, and more",
    color: "bg-orange-500",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-roboto">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're
            looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/category/${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[&]/g, "and")}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-border bg-card">
                  <div
                    className={`${category.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2 font-roboto">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
