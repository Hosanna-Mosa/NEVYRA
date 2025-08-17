import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBannerImage from "@/assets/hero-banner.jpg";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

const slides = [
  {
    id: 1,
    title: "Shop Smart, Live Better",
    subtitle: "Discover millions of products at unbeatable prices",
    description:
      "From fashion to electronics, groceries to home essentials - everything you need is here.",
    image: heroBannerImage,
    buttonText: "Start Shopping",
    accentColor: "text-warning",
  },
  {
    id: 2,
    title: "Latest Smartphones",
    subtitle: "Get the newest technology",
    description:
      "Upgrade to the latest smartphones with amazing features and incredible performance.",
    image: phoneProduct,
    buttonText: "Shop Phones",
    accentColor: "text-blue-400",
  },
  {
    id: 3,
    title: "Fashion & Style",
    subtitle: "Express yourself with style",
    description:
      "Discover trendy fashion items that match your personality and lifestyle.",
    image: shoesProduct,
    buttonText: "Shop Fashion",
    accentColor: "text-pink-400",
  },
  {
    id: 4,
    title: "Premium Electronics",
    subtitle: "Cutting-edge technology",
    description:
      "Experience the future with our premium electronics and gadgets collection.",
    image: laptopProduct,
    buttonText: "Shop Electronics",
    accentColor: "text-green-400",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-hover overflow-hidden min-h-[300px] md:h-[350px] lg:h-[400px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full px-4 py-6 md:py-8 lg:py-10 relative z-10 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center h-full">
              <div className="text-primary-foreground text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 font-roboto leading-tight">
                  {slide.title.split(",")[0]},
                  <br />
                  <span className={slide.accentColor}>
                    {slide.title.split(",")[1]}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-3 md:mb-4 text-primary-foreground/90 font-medium">
                  {slide.subtitle}
                </p>
                <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 text-primary-foreground/90 leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-warning hover:bg-warning/90 text-warning-foreground font-medium text-sm sm:text-base"
                  >
                    {slide.buttonText}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-sm sm:text-base"
                  >
                    Explore Deals
                  </Button>
                </div>
              </div>
              <div className="relative order-first lg:order-last">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-auto max-h-[200px] md:max-h-[250px] lg:max-h-[300px] object-contain rounded-lg shadow-lg mx-auto lg:mx-0"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-primary-foreground/5 rounded-full -translate-y-24 translate-x-24 md:-translate-y-48 md:translate-x-48 hidden lg:block"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-warning/10 rounded-full translate-y-16 -translate-x-16 md:translate-y-32 md:-translate-x-32 hidden lg:block"></div>
    </div>
  );
};

export default HeroBanner;
