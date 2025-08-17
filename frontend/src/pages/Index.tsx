import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TopDeals from "@/components/TopDeals";
import CategoryCards from "@/components/CategoryCards";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      <HeroBanner />
      <CategoryCards />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
