const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  level: {
    type: Number,
    default: 1 
  }
});

module.exports = mongoose.model("User", userSchema);
