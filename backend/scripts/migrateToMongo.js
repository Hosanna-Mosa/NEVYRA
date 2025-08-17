require("dotenv").config();
const { sequelize } = require("../config/database");
const connectDB = require("../config/mongodb");
const { Product: SequelizeProduct } = require("../models");
const MongoProduct = require("../models/mongo/Product");

async function migrateProducts() {
  try {
    // Connect to both databases
    await connectDB();
    await sequelize.authenticate();

    // Fetch all products from PostgreSQL
    const products = await SequelizeProduct.findAll();

    // Convert and insert into MongoDB
    for (const product of products) {
      const mongoProduct = new MongoProduct({
        title: product.title,
        price: product.price,
        category: product.category,
        subCategory: product.subCategory,
        images: product.images,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        stockQuantity: product.stockQuantity,
        soldCount: product.soldCount,
        attributes: product.attributes,
      });

      await mongoProduct.save();
      console.log(`Migrated product: ${product.title}`);
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateProducts();
