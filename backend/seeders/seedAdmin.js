const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const { generateAdminToken } = require("../utils/jwtUtils");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI ||  "mongodb://localhost:27017/nevyra";

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = "admin@nevyra.com";
  const password = "admin123";
  const firstName = "Admin";
  const lastName = "User";

  let admin = await Admin.findOne({ email });
  if (admin) {
    console.log("Admin already exists:", email);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    admin = new Admin({ firstName, lastName, email, password: hashed });
    await admin.save();
    console.log("Admin created:", email);
  }

  // Generate JWT token
  const token = generateAdminToken({
    id: admin._id,
    email: admin.email
  });
  console.log("Admin JWT token:", token);
  mongoose.disconnect();
}

seedAdmin().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 