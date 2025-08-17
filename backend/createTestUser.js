const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

// MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    
    if (existingUser) {
      console.log("Test user already exists:");
      console.log("Email: test@example.com");
      console.log("Password: test123");
      console.log("User ID:", existingUser._id);
    } else {
      // Create test user
      const hashedPassword = await bcrypt.hash("test123", 10);
      
      const testUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: hashedPassword,
        phone: "1234567890",
        address: "123 Test Street, Test City, TC 12345"
      });

      await testUser.save();
      console.log("Test user created successfully!");
      console.log("Email: test@example.com");
      console.log("Password: test123");
      console.log("User ID:", testUser._id);
    }

    // List all users
    const allUsers = await User.find({}, { password: 0 });
    console.log("\nAll users in database:");
    allUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
    });

  } catch (error) {
    console.error("Error creating test user:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createTestUser(); 