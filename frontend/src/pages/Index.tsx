import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TopDeals from "@/components/TopDeals";
import TopPicks from "@/components/TopPicks";
import CategoryCards from "@/components/CategoryCards";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      <HeroBanner />
      <div className="container mx-auto px-4 mt-6">
        <TopPicks />
      </div>
      <CategoryCards />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
