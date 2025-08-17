import { Truck, Shield, Headphones, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    description: "Free delivery on orders above ₹499. Express delivery available.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "100% secure payment with multiple payment options available.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Round-the-clock customer service to help you with any queries.",
  },
  {
    icon: Award,
    title: "Genuine Products",
    description: "All products are 100% genuine with warranty and return policy.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-background">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-roboto">
            Why Choose Nevyra?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're committed to providing you with the best online shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-hover transition-colors duration-300">
                  <IconComponent className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-roboto">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;