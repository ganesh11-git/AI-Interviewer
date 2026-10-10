const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const aiRoadmapRoute = require("./routes/aiRoadmap");
const careerAdvisorRoutes = require("./routes/careerAdvisorRoutes");
const profileRoutes = require("./routes/profileRoutes");
const interviewerRoutes = require("./interviewer/routes/interview.routes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/interviewer", interviewerRoutes);
app.use("/api", aiRoadmapRoute);
app.use("/api/career-advisor", careerAdvisorRoutes);
app.use("/api/profile", profileRoutes);

// Static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "LOADED ✅" : "NOT LOADED ❌");

const PORT = process.env.PORT || 5000;

// 🔥 START SERVER ONLY AFTER DB CONNECTS
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });