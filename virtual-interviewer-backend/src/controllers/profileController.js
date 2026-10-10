const fs = require("fs");
const User = require("../models/User");


exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, email, role, interviewScore } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, role, interviewScore },
    { new: true }
  ).select("-password");

  res.json(updatedUser);
};


exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const user = await User.findById(req.user.id);

  
    if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume);
    }

    user.resume = req.file.path;
    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resume: req.file.path,
    });
  } catch (err) {
  console.error("UPLOAD ERROR 👉", err);
  res.status(500).json({
    message: err.message || "Resume upload failed",
  });
}
}