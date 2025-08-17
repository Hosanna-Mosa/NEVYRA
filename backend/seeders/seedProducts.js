const { Product } = require("../models");
const { categorySchemas } = require("../categorySchemas");
const connectDB = require("../config/mongodb");

async function seedProducts() {
  // Remove all existing products
  await Product.deleteMany({});
  const products = [
    // Medical
    {
      title: "Paracetamol Tablets",
      price: 5,
      category: "Medical",
      subCategory: "Pain Relief",
      images: [
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      ],
      inStock: true,
      rating: 4.5,
      reviews: 120,
      stockQuantity: 200,
      soldCount: 500,
      attributes: {
        brand: "MediCure",
        expiryDate: "2025-12-31",
        drugName: "Paracetamol",
        dosage: "500mg",
        packSize: "20 tablets",
      },
    },
    // Groceries
    {
      title: "Basmati Rice 5kg",
      price: 13,
      category: "Groceries",
      subCategory: "Rice",
      images: [
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
      ],
      inStock: true,
      rating: 4.7,
      reviews: 80,
      stockQuantity: 100,
      soldCount: 300,
      attributes: {
        brand: "GoldenGrain",
        weight: "5kg",
        type: "Basmati",
        expiryDate: "2024-11-01",
      },
    },
    // FashionBeauty
    {
      title: "Men's Cotton T-Shirt",
      price: 10,
      category: "FashionBeauty",
      subCategory: "T-Shirts",
      images: [
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.2,
      reviews: 45,
      stockQuantity: 150,
      soldCount: 90,
      attributes: {
        size: "L",
        color: "Blue",
        material: "Cotton",
        brand: "StyleMan",
        gender: "Male",
        occasion: "Casual",
      },
    },
    // Devices
    {
      title: "Smartphone X100",
      price: 300,
      category: "Devices",
      subCategory: "Smartphones",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.8,
      reviews: 210,
      stockQuantity: 50,
      soldCount: 120,
      attributes: {
        brand: "TechBrand",
        model: "X100",
        warranty: "2 years",
        batteryLife: "24h",
        storage: "128GB",
      },
    },
    // Electrical
    {
      title: "LED Bulb 12W",
      price: 2,
      category: "Electrical",
      subCategory: "Bulbs",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.1,
      reviews: 30,
      stockQuantity: 500,
      soldCount: 200,
      attributes: {
        voltage: "220V",
        wattage: "12W",
        brand: "BrightLite",
        type: "LED",
        useCase: "Home",
      },
    },
    // Automotive
    {
      title: "Car Battery 60Ah",
      price: 90,
      category: "Automotive",
      subCategory: "Batteries",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.6,
      reviews: 60,
      stockQuantity: 40,
      soldCount: 25,
      attributes: {
        brand: "AutoPower",
        compatibleWith: "Sedan",
        material: "Lead-Acid",
        warranty: "1 year",
        type: "Car Battery",
      },
    },
    // Sports
    {
      title: "Cricket Bat Pro",
      price: 50,
      category: "Sports",
      subCategory: "Cricket",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.9,
      reviews: 33,
      stockQuantity: 20,
      soldCount: 10,
      attributes: {
        sport: "Cricket",
        material: "Willow Wood",
        brand: "Sporty",
        size: "Full Size",
      },
    },
    // HomeInterior
    {
      title: "Modern Sofa Set",
      price: 500,
      category: "HomeInterior",
      subCategory: "Sofas",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      ],
      inStock: true,
      rating: 4.3,
      reviews: 18,
      stockQuantity: 5,
      soldCount: 2,
      attributes: {
        material: "Leather",
        dimensions: "200x90x80cm",
        color: "Brown",
        style: "Modern",
        brand: "HomeLux",
      },
    },
  ];

  await Product.insertMany(products);
  console.log("Seeded products successfully!");
  const data = await Product.find();
  console.log(data);
  process.exit();
}

// Connect to DB, then seed
(async () => {
  try {
    await connectDB();
    await seedProducts();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
