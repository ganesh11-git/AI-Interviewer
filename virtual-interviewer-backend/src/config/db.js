const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interviewer"
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn; // 🔥 THIS IS CRITICAL
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // 🔥 Stop server if DB fails
  }
};

module.exports = connectDB;