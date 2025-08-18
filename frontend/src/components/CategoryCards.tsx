import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";
import dressProduct from "@/assets/dress-product.jpg";

// Medical & Pharmacy Products
const medicalProducts = [
  {
    id: 1,
    name: "Ibuprofen 400mg Capsules",
    image: phoneProduct,
    price: 45,
    originalPrice: 90,
    discount: 50,
  },
  {
    id: 2,
    name: "Vitamin C 1000mg Tablets",
    image: phoneProduct,
    price: 120,
    originalPrice: 240,
    discount: 50,
  },
  {
    id: 3,
    name: "First Aid Kit Complete",
    image: phoneProduct,
    price: 299,
    originalPrice: 598,
    discount: 50,
  },
  {
    id: 4,
    name: "Amoxicillin 500mg Capsules",
    image: phoneProduct,
    price: 89,
    originalPrice: 178,
    discount: 50,
  },
  {
    id: 5,
    name: "Antiseptic Solution 100ml",
    image: phoneProduct,
    price: 75,
    originalPrice: 150,
    discount: 50,
  },
  {
    id: 6,
    name: "Digital Thermometer Pro",
    image: phoneProduct,
    price: 199,
    originalPrice: 398,
    discount: 50,
  },
  {
    id: 7,
    name: "Paracetamol 500mg",
    image: phoneProduct,
    price: 35,
    originalPrice: 70,
    discount: 50,
  },
  {
    id: 8,
    name: "Cough Syrup 100ml",
    image: phoneProduct,
    price: 89,
    originalPrice: 178,
    discount: 50,
  },
  {
    id: 9,
    name: "Bandage Roll 5m",
    image: phoneProduct,
    price: 25,
    originalPrice: 50,
    discount: 50,
  },
  {
    id: 10,
    name: "Pain Relief Gel",
    image: phoneProduct,
    price: 149,
    originalPrice: 298,
    discount: 50,
  },
];

// Groceries Products
const groceryProducts = [
  {
    id: 11,
    name: "Basmati Rice 5kg",
    image: shoesProduct,
    price: 299,
    originalPrice: 598,
    discount: 50,
  },
  {
    id: 12,
    name: "Greek Yogurt Natural 500g",
    image: shoesProduct,
    price: 89,
    originalPrice: 178,
    discount: 50,
  },
  {
    id: 13,
    name: "Organic Bananas 1kg",
    image: shoesProduct,
    price: 45,
    originalPrice: 90,
    discount: 50,
  },
  {
    id: 14,
    name: "Whole Wheat Bread 500g",
    image: shoesProduct,
    price: 35,
    originalPrice: 70,
    discount: 50,
  },
  {
    id: 15,
    name: "Extra Virgin Olive Oil 500ml",
    image: shoesProduct,
    price: 199,
    originalPrice: 398,
    discount: 50,
  },
  {
    id: 16,
    name: "Organic Honey 500g",
    image: shoesProduct,
    price: 149,
    originalPrice: 298,
    discount: 50,
  },
  {
    id: 17,
    name: "Almonds 250g",
    image: shoesProduct,
    price: 199,
    originalPrice: 398,
    discount: 50,
  },
  {
    id: 18,
    name: "Green Tea 100 Bags",
    image: shoesProduct,
    price: 89,
    originalPrice: 178,
    discount: 50,
  },
];

// Fashion & Beauty Products
const fashionProducts = [
  {
    id: 12,
    name: "Men's Cotton T-Shirt",
    image: dressProduct,
    price: 399,
    originalPrice: 798,
    discount: 50,
  },
  {
    id: 13,
    name: "Women's Summer Dress",
    image: dressProduct,
    price: 599,
    originalPrice: 1198,
    discount: 50,
  },
  {
    id: 14,
    name: "Leather Handbag Classic",
    image: dressProduct,
    price: 899,
    originalPrice: 1798,
    discount: 50,
  },
  {
    id: 15,
    name: "Running Shoes Pro",
    image: shoesProduct,
    price: 1299,
    originalPrice: 2598,
    discount: 50,
  },
];

// Devices Products
const deviceProducts = [
  {
    id: 16,
    name: "Smartphone X100",
    image: phoneProduct,
    price: 29999,
    originalPrice: 59998,
    discount: 50,
  },
  {
    id: 17,
    name: "Laptop Ultra Pro",
    image: laptopProduct,
    price: 49999,
    originalPrice: 99998,
    discount: 50,
  },
  {
    id: 18,
    name: "Wireless Headphones",
    image: phoneProduct,
    price: 1999,
    originalPrice: 3998,
    discount: 50,
  },
];

// Electrical Products
const electricalProducts = [
  {
    id: 19,
    name: "Solar Panel 100W",
    image: laptopProduct,
    price: 4999,
    originalPrice: 9998,
    discount: 50,
  },
  {
    id: 20,
    name: "LED Bulb Pack 10pcs",
    image: laptopProduct,
    price: 299,
    originalPrice: 598,
    discount: 50,
  },
  {
    id: 21,
    name: "Inverter Battery 150Ah",
    image: laptopProduct,
    price: 12999,
    originalPrice: 25998,
    discount: 50,
  },
  {
    id: 22,
    name: "Copper Wire 100m",
    image: laptopProduct,
    price: 899,
    originalPrice: 1798,
    discount: 50,
  },
];

// Automotive Products
const automotiveProducts = [
  {
    id: 23,
    name: "Bike Helmet ISI Certified",
    image: shoesProduct,
    price: 899,
    originalPrice: 1798,
    discount: 50,
  },
  {
    id: 24,
    name: "Car Seat Cover Universal",
    image: dressProduct,
    price: 599,
    originalPrice: 1198,
    discount: 50,
  },
  {
    id: 25,
    name: "Engine Oil 1L Synthetic",
    image: phoneProduct,
    price: 399,
    originalPrice: 798,
    discount: 50,
  },
  {
    id: 26,
    name: "Air Filter High Performance",
    image: phoneProduct,
    price: 299,
    originalPrice: 598,
    discount: 50,
  },
];

// Sports Products
const sportsProducts = [
  {
    id: 27,
    name: "Cricket Bat English Willow",
    image: shoesProduct,
    price: 1499,
    originalPrice: 2998,
    discount: 50,
  },
  {
    id: 28,
    name: "Cricket Ball Leather Match",
    image: shoesProduct,
    price: 199,
    originalPrice: 398,
    discount: 50,
  },
  {
    id: 29,
    name: "Volleyball Official Size",
    image: shoesProduct,
    price: 399,
    originalPrice: 798,
    discount: 50,
  },
  {
    id: 30,
    name: "Cricket Kit Bag Large",
    image: dressProduct,
    price: 899,
    originalPrice: 1798,
    discount: 50,
  },
];

// Home Interior Products
const homeInteriorProducts = [
  {
    id: 31,
    name: "Gypsum False Ceiling",
    image: laptopProduct,
    price: 8999,
    originalPrice: 17998,
    discount: 50,
  },
  {
    id: 32,
    name: "Cove Lights 10m LED",
    image: laptopProduct,
    price: 1999,
    originalPrice: 3998,
    discount: 50,
  },
  {
    id: 33,
    name: "Main Door Solid Wood",
    image: dressProduct,
    price: 14999,
    originalPrice: 29998,
    discount: 50,
  },
  {
    id: 34,
    name: "Wall Paint 20L Emulsion",
    image: phoneProduct,
    price: 1999,
    originalPrice: 3998,
    discount: 50,
  },
];

// Top Picks for You Products
const topPicksProducts = [
  {
    id: 35,
    name: "Premium Wireless Earbuds",
    image: phoneProduct,
    price: 2499,
    originalPrice: 4998,
    discount: 50,
  },
  {
    id: 36,
    name: "Smart Fitness Watch",
    image: phoneProduct,
    price: 3999,
    originalPrice: 7998,
    discount: 50,
  },
  {
    id: 37,
    name: "Portable Bluetooth Speaker",
    image: laptopProduct,
    price: 1299,
    originalPrice: 2598,
    discount: 50,
  },
  {
    id: 38,
    name: "Gaming Mouse RGB",
    image: laptopProduct,
    price: 899,
    originalPrice: 1798,
    discount: 50,
  },
  {
    id: 39,
    name: "Mechanical Keyboard",
    image: laptopProduct,
    price: 1999,
    originalPrice: 3998,
    discount: 50,
  },
  {
    id: 40,
    name: "USB-C Fast Charger",
    image: phoneProduct,
    price: 599,
    originalPrice: 1198,
    discount: 50,
  },
  {
    id: 41,
    name: "Wireless Charging Pad",
    image: phoneProduct,
    price: 799,
    originalPrice: 1598,
    discount: 50,
  },
  {
    id: 42,
    name: "Laptop Cooling Pad",
    image: laptopProduct,
    price: 499,
    originalPrice: 998,
    discount: 50,
  },
];

const CategoryCards = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-16 bg-background">
      <div className="w-full px-4 space-y-12">
        
        {/* Medical Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/medical" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Medical</Link>
            <Link to="/category/medical" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 6+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? medicalProducts.slice(0, 4) : medicalProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Groceries Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/groceries" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Groceries</Link>
            <Link to="/category/groceries" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 5+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? groceryProducts.slice(0, 4) : groceryProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Fashion & Beauty Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/fashion-beauty" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">FashionBeauty</Link>
            <Link to="/category/fashion-beauty" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? fashionProducts.slice(0, 4) : fashionProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Devices Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/devices" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Devices</Link>
            <Link to="/category/devices" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 3+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? deviceProducts.slice(0, 4) : deviceProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Electrical Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/electrical" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Electrical</Link>
            <Link to="/category/electrical" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? electricalProducts.slice(0, 4) : electricalProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Automotive Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/automotive" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Automotive</Link>
            <Link to="/category/automotive" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? automotiveProducts.slice(0, 4) : automotiveProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sports Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/sports" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Sports</Link>
            <Link to="/category/sports" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? sportsProducts.slice(0, 4) : sportsProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Home Interior Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/home-interior" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Home Interior</Link>
            <Link to="/category/home-interior" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? homeInteriorProducts.slice(0, 4) : homeInteriorProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Up to 50% Off</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Picks for You Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 font-roboto mb-1">Top Picks for You</h2>
              <p className="text-blue-600 text-xs">Handpicked products just for you</p>
            </div>
            <Link to="/category/top-picks" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm">
              View More <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(isMobile ? topPicksProducts.slice(0, 4) : topPicksProducts).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5">
                        {product.discount}% OFF
                      </Badge>
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        ⭐ TOP
                      </div>
                    </div>
                    <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">(4.5)</span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCards; 