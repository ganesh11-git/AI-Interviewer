const mongoose = require("mongoose");

const careerRecommendationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    skillsInput: {
      type: String,
      required: true,
    },

    recommendedCareer: {
      type: String,
      enum: [
        "Software Engineer",
        "Data Scientist",
        "Cybersecurity Analyst",
        "Cloud Engineer",
        "DevOps Engineer",
        "UI/UX Designer",
      ],
      required: true,
    },

    suitabilityScore: {
      type: Number, 
      min: 0,
      max: 100,
      required: true,
    },

    aiReason: {
      type: String,
      required: true,
    },

    fullAIResponse: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerRecommendation", careerRecommendationSchema);
