const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  college: String,
  degree: String,
  year: String,
  resumeUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
