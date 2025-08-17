const { sequelize, User, Category, Product } = require("../models");
const bcrypt = require("bcrypt");

async function seed() {
 // await sequelize.sync({ force: true });

  const adminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@nevyra.com",
    password: adminPassword,
    isAdmin: true,
    phone: null,
  });

  const categories = await Category.bulkCreate([
    { name: "Electronics" },
    { name: "Books" },
    { name: "Clothing" },
  ]);

  await Product.bulkCreate([
    {
      name: "Smartphone",
      price: 699,
      description: "Latest smartphone",
      imageUrl: "",
      stock: 50,
      categoryId: categories[0].id,
    },
    {
      name: "Novel",
      price: 19.99,
      description: "Bestselling novel",
      imageUrl: "",
      stock: 100,
      categoryId: categories[1].id,
    },
    {
      name: "T-Shirt",
      price: 9.99,
      description: "Comfortable cotton t-shirt",
      imageUrl: "",
      stock: 200,
      categoryId: categories[2].id,
    },
  ]);

  console.log("Seed data inserted");
  process.exit();
}

seed();
