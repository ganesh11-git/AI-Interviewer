const express = require("express");
const User = require("../models/User");
const router = express.Router();


router.post("/submit", async (req, res) => {
  const { userId, score } = req.body;

  let user = await User.findById(userId);

  if (!user) return res.status(404).json({ msg: "User not found" });

  
  if (score >= 70) {
    user.level = 2;
    await user.save();
  }

  res.json({ level: user.level });
});

module.exports = router;
