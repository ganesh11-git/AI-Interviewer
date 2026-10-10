const express = require("express");
const upload = require("../middleware/upload");
const Profile = require("../models/Profile");

const router = express.Router();

router.post("/save", upload.single("resume"), async (req, res) => {
  try {
    const data = req.body;

    const profile = new Profile({
      ...data,
      resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : "",
    });

    await profile.save(); 

    res.json({
      message: "Profile saved in MongoDB",
      resumeUrl: profile.resumeUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB Save Failed" });
  }
});

module.exports = router;
