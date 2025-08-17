const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "mongodb://localhost:27017/nevyra"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
